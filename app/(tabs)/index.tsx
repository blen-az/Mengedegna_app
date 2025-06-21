import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Clock } from 'lucide-react-native';
import SafeAreaView from '@/components/core/SafeAreaView';
import SearchBar from '@/components/core/SearchBar';
import TripCard from '@/components/custom/TripCard';
import PromoBanner from '@/components/custom/PromoBanner';
import LocationPicker from '@/components/custom/LocationPicker';
import DatePicker from '@/components/custom/DatePicker';
import TripFilter from '@/components/custom/TripFilter';
import { popularDestinations, featuredTrips } from '@/data/mockData';
import Colors from '@/constants/Colors';
import { fetchTrips } from '@/services/tripService';
import { useAuth } from '@/context/AuthContext';

// Define types
interface Location {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  departureTerminal: string;
  price: number;
  availableSeats: number;
  company: {
    name: string;
    logoUrl: string;
    rating: number;
  };
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPickingFrom, setIsPickingFrom] = useState(true);
  const [trips, setTrips] = useState<Trip[]>(featuredTrips as Trip[]);

  const handleSearch = async () => {
    if (fromLocation && toLocation) {
      try {
        const filteredTrips = await fetchTrips(
          fromLocation,
          toLocation,
          selectedDate.toISOString()
        );
        // Navigate to the first trip in the filtered results
        if (filteredTrips.length > 0) {
          router.push(`/trip/${filteredTrips[0].id}`);
        }
      } catch (error) {
        console.error('Error searching trips:', error);
      }
    }
  };

  const openLocationPicker = (isFrom = true) => {
    setIsPickingFrom(isFrom);
    setShowLocationPicker(true);
  };

  const handleLocationSelect = (location: string) => {
    if (isPickingFrom) {
      setFromLocation(location);
    } else {
      setToLocation(location);
    }
    setShowLocationPicker(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const navigateToTripDetail = (tripId: string) => {
    router.push(`/trip/${tripId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>
                Hello, {user?.displayName || 'Guest'}
              </Text>
              <Text style={styles.subtitle}>Where are you going today?</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/more')}>
              <Image
                source={{
                  uri:
                    user?.photoURL ||
                    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
          <SearchBar
            placeholder="Search destinations, buses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchBar}
          />
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchCard}>
            <TouchableOpacity
              style={styles.locationPicker}
              onPress={() => openLocationPicker(true)}
            >
              <MapPin size={18} color={Colors.primary} />
              <Text style={styles.locationText}>
                {fromLocation || 'From where?'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.locationPicker}
              onPress={() => openLocationPicker(false)}
            >
              <MapPin size={18} color={Colors.secondary} />
              <Text style={styles.locationText}>
                {toLocation || 'To where?'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.datePicker}
              onPress={toggleDatePicker}
            >
              <Calendar size={18} color={Colors.primary} />
              <Text style={styles.dateText}>
                {selectedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Search Buses</Text>
            </TouchableOpacity>
          </View>
        </View>

        <PromoBanner
          title="Get 25% off on your first trip!"
          description="Use code FIRST25 at checkout"
          imageUrl="https://images.pexels.com/photos/2402648/pexels-photo-2402648.jpeg"
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {popularDestinations.map((destination) => (
              <TouchableOpacity
                key={destination.id}
                style={styles.destinationCard}
                onPress={() => {
                  setToLocation(destination.name);
                  setFromLocation('Addis Ababa');
                  handleSearch();
                }}
              >
                <Image
                  source={{ uri: destination.imageUrl }}
                  style={styles.destinationImage}
                />
                <View style={styles.destinationInfo}>
                  <Text style={styles.destinationName}>{destination.name}</Text>
                  <Text style={styles.destinationPrice}>
                    From {destination.price} ETB
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Trips</Text>
          <TripFilter onFilter={(filteredTrips) => setTrips(filteredTrips)} />

          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPress={() => navigateToTripDetail(trip.id)}
            />
          ))}
        </View>
      </ScrollView>

      {showLocationPicker && (
        <LocationPicker
          isVisible={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onSelectLocation={handleLocationSelect}
          isFrom={isPickingFrom}
        />
      )}

      {showDatePicker && (
        <DatePicker
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelectDate={handleDateSelect}
          selectedDate={selectedDate}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    opacity: 0.8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  searchBar: {
    marginTop: 8,
  },
  searchSection: {
    marginTop: -30,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[800],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginVertical: 8,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[800],
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  searchButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  horizontalScroll: {
    marginLeft: -4,
  },
  destinationCard: {
    width: 180,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  destinationImage: {
    width: '100%',
    height: 120,
  },
  destinationInfo: {
    padding: 12,
  },
  destinationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  destinationPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
    marginTop: 4,
  },
});
