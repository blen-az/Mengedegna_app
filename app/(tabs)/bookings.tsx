import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  CircleAlert as AlertCircle,
} from 'lucide-react-native';
import SafeAreaView from '@/components/core/SafeAreaView';
import Header from '@/components/core/Header';
import BookingCard from '@/components/custom/BookingCard';
import EmptyState from '@/components/core/EmptyState';
import { fetchUserBookings } from '@/services/bookingService';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

// Import Booking type from bookingService
import type { Booking } from '@/services/bookingService';

type BookingTab = 'upcoming' | 'past' | 'cancelled';

export default function BookingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user, activeTab]);

  const loadBookings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const fetchedBookings = await fetchUserBookings(user.uid, activeTab);
      setBookings(fetchedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <BookingCard
      booking={item}
      onPress={() => router.push(`/booking/${item.id}`)}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      icon={<Calendar size={64} color={Colors.gray[400]} />}
      title="No bookings yet"
      description={
        activeTab === 'upcoming'
          ? "You don't have any upcoming trips. Book a trip now!"
          : activeTab === 'past'
          ? "You don't have any past trips."
          : "You don't have any cancelled trips."
      }
      actionLabel={activeTab === 'upcoming' ? 'Book a Trip' : null}
      onAction={activeTab === 'upcoming' ? () => router.push('/') : null}
    />
  );

  const tabs: { id: BookingTab; label: string }[] = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Bookings" />

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={loadBookings}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: Colors.gray[100],
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[600],
  },
  activeTabText: {
    color: Colors.primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
});
