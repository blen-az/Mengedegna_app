import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Info,
  Shield,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import SafeAreaView from '@/components/core/SafeAreaView';
import SeatSelection from '@/components/custom/SeatSelection';
import Button from '@/components/core/Button';
import { fetchTripById } from '@/services/tripService';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import type { TripModel } from '@/types';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [trip, setTrip] = useState<TripModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const scrollY = useSharedValue(0);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const tripId = Array.isArray(id) ? id[0] : id;
        if (!tripId) {
          throw new Error('Invalid trip id');
        }
        const tripData = await fetchTripById(tripId as string);
        setTrip(tripData as unknown as TripModel);
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('Failed to load trip details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 200],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  const handleSeatSelect = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      if (selectedSeats.length < 5) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        Alert.alert(
          'Maximum Seats',
          'You can only select up to 5 seats per booking.'
        );
      }
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      Alert.alert(
        'No Seats Selected',
        'Please select at least one seat to continue.'
      );
      return;
    }

    if (!isAuthenticated) {
      Alert.alert('Login Required', 'You need to login to book tickets.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/login') },
      ]);
      return;
    }

    const tripId = Array.isArray(id) ? id[0] : id;
    router.push({
      pathname: '/booking/[id]',
      params: { id: String(tripId), seats: selectedSeats.join(',') },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Info size={64} color={Colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.errorButton}
        />
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Info size={64} color={Colors.error} />
        <Text style={styles.errorText}>Trip not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.errorButton}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={[styles.headerBackground, headerAnimatedStyle]} />
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={Colors.white} />
          </TouchableOpacity>
          <Animated.Text style={[styles.headerTitle, headerAnimatedStyle]}>
            {trip.from} to {trip.to}
          </Animated.Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <AnimatedScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                trip.company?.imageUrl ||
                'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg',
            }}
            style={styles.image}
          />
          <View style={styles.imageTitleContainer}>
            <Text style={styles.imageTitle}>
              {trip.from} to {trip.to}
            </Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.rating}>
                {trip.company?.rating} ({trip.company?.reviewCount})
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.companySection}>
            <Image
              source={{
                uri:
                  trip.company?.logoUrl ||
                  'https://images.pexels.com/photos/2402648/pexels-photo-2402648.jpeg',
              }}
              style={styles.companyLogo}
            />
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{trip.company?.name}</Text>
              <View style={styles.busInfo}>
                <Text style={styles.busType}>{trip.busType}</Text>
                <Text style={styles.busDot}>•</Text>
                <Users size={14} color={Colors.gray[600]} />
                <Text style={styles.busCapacity}>{trip.totalSeats} seats</Text>
              </View>
            </View>
          </View>

          <View style={styles.tripInfoSection}>
            <View style={styles.tripInfoItem}>
              <Calendar size={18} color={Colors.primary} />
              <Text style={styles.tripInfoText}>
                {new Date(trip.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.tripInfoItem}>
              <Clock size={18} color={Colors.primary} />
              <Text style={styles.tripInfoText}>
                {trip.departureTime} - {trip.arrivalTime}
              </Text>
            </View>
            <View style={styles.tripInfoItem}>
              <MapPin size={18} color={Colors.primary} />
              <Text style={styles.tripInfoText}>{trip.departureTerminal}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Your Seat</Text>
          <Text style={styles.sectionSubtitle}>
            Select up to 5 seats. Selected: {selectedSeats.length}
          </Text>

          <SeatSelection
            seats={trip.seats}
            selectedSeats={selectedSeats}
            onSelectSeat={handleSeatSelect}
          />

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.availableSeat]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.selectedSeat]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.bookedSeat]} />
              <Text style={styles.legendText}>Booked</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesList}>
            {trip.amenities?.map((amenity: string, index: number) => (
              <View key={index} style={styles.amenityItem}>
                <View style={styles.amenityIcon}>
                  {/* Placeholder for amenity icon */}
                </View>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.policySection}>
          <Shield size={20} color={Colors.gray[700]} />
          <Text style={styles.policyText}>
            Cancellation available up to 4 hours before departure with 80%
            refund.
          </Text>
        </View>
      </AnimatedScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price per seat</Text>
          <Text style={styles.price}>{trip.price} ETB</Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>
            {trip.price * selectedSeats.length} ETB
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedSeats.length === 0 && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 90,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 100,
  },
  imageContainer: {
    height: 220,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageTitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  imageTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.white,
    marginLeft: 4,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  companySection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  companyInfo: {
    marginLeft: 12,
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
  busDot: {
    fontSize: 14,
    color: Colors.gray[400],
    marginHorizontal: 4,
  },
  busCapacity: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginLeft: 4,
  },
  tripInfoSection: {
    marginTop: 16,
  },
  tripInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  availableSeat: {
    backgroundColor: Colors.gray[200],
  },
  selectedSeat: {
    backgroundColor: Colors.primary,
  },
  bookedSeat: {
    backgroundColor: Colors.gray[400],
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[700],
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    marginRight: 6,
  },
  amenityText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
  },
  policySection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  policyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[700],
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    padding: 16,
    paddingBottom: 32,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
  price: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  totalPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  disabledButton: {
    backgroundColor: Colors.gray[300],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
    textAlign: 'center',
  },
  errorButton: {
    minWidth: 150,
  },
});
