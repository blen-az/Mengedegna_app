import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SafeAreaView from '@/components/core/SafeAreaView';
import Colors from '@/constants/Colors';
import { fetchTripById, Trip } from '@/services/tripService';
import { useAuth } from '@/context/AuthContext';
import { createBackendBooking, Passenger } from '@/services/bookingService';
import SeatSelection from '@/components/custom/SeatSelection';
import PassengerForm from '@/components/custom/PassengerForm';

export default function BookingScreen() {
  const router = useRouter();
  const { id, seats: seatsParam } = useLocalSearchParams();
  const { user } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTripById(id as string)
        .then((data) => {
          setTrip(data);
          // If seats are passed from trip detail, pre-select them
          if (seatsParam && typeof seatsParam === 'string') {
            const preSelectedSeats = seatsParam.split(',');
            setSelectedSeats(preSelectedSeats);
            // Create passengers with user info for main passenger only
            const prePassengers: Passenger[] = preSelectedSeats.map(
              (seatId, index) => ({
                seatId,
                firstName: index === 0 ? user?.displayName || '' : '',
                phone: '',
              })
            );
            setPassengers(prePassengers);
          }
          setLoading(false);
        })
        .catch(() => {
          Alert.alert('Error', 'Failed to load trip details.');
          setLoading(false);
        });
    }
  }, [id, seatsParam, user]);

  const handleSeatSelect = (seatId: string) => {
    // If seats are pre-selected from trip detail, don't allow changes
    if (seatsParam) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.includes(seatId);
      if (isSelected) {
        // Remove seat
        const newSelected = prev.filter((id) => id !== seatId);
        // Remove corresponding passenger
        setPassengers((prevPassengers) =>
          prevPassengers.filter((p) => p.seatId !== seatId)
        );
        return newSelected;
      } else {
        // Add seat
        const newSelected = [...prev, seatId];
        // Add corresponding passenger
        const newPassenger: Passenger = {
          seatId,
          firstName: '',
          phone: '',
        };
        setPassengers((prevPassengers) => [...prevPassengers, newPassenger]);
        return newSelected;
      }
    });
  };

  const updatePassenger = (index: number, field: string, value: string) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleBooking = async () => {
    console.log('Book button pressed. Booking details:', {
      tripId: trip?.id,
      userId: user?.uid,
      selectedSeats,
      passengers,
      totalAmount: selectedSeats.length * (trip?.price || 0),
    });

    if (!user) {
      console.error('Booking failed: User not authenticated');
      Alert.alert('Authentication required', 'Please login to book a trip.');
      router.push('/login' as any);
      return;
    }
    if (!trip || selectedSeats.length === 0) {
      console.error('Booking failed: No trip or seats selected', {
        trip: !!trip,
        selectedSeatsCount: selectedSeats.length,
      });
      return;
    }

    // Validate passengers
    const invalidPassengers = passengers.filter(
      (p) => !p.firstName || !p.phone
    );
    if (invalidPassengers.length > 0) {
      console.error('Booking failed: Invalid passengers', invalidPassengers);
      Alert.alert(
        'Validation Error',
        'Please fill in required fields for all passengers.'
      );
      return;
    }

    setBookingLoading(true);
    try {
      console.log('Attempting to create booking...');
      const booking = await createBackendBooking({
        tripId: trip.id,
        seats: selectedSeats,
        passengers,
        totalAmount: selectedSeats.length * trip.price,
      });
      console.log('Booking created successfully:', booking);
      Alert.alert('Booking created', 'Proceed to confirmation.');
      router.push({
        pathname: '/booking/confirmation',
        params: { booking: JSON.stringify(booking) },
      });
    } catch (error) {
      console.error('Booking failed in handleBooking:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert(
        'Booking failed',
        `Error: ${errorMessage}. Please try again later.`
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Trip not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {trip.from} to {trip.to}
        </Text>
        <Text style={styles.date}>Date: {trip.date}</Text>
        <Text style={styles.price}>Price per seat: {trip.price} ETB</Text>
        <Text style={styles.availableSeats}>
          Available seats: {trip.seatsAvailable}
        </Text>

        {trip.seats && !seatsParam && (
          <SeatSelection
            seats={trip.seats}
            selectedSeats={selectedSeats}
            onSelectSeat={handleSeatSelect}
          />
        )}

        {passengers.map((passenger, index) => (
          <PassengerForm
            key={passenger.seatId}
            passenger={passenger}
            seatNumber={passenger.seatId}
            index={index}
            onChange={updatePassenger}
          />
        ))}

        <TouchableOpacity
          onPress={handleBooking}
          style={styles.bookButton}
          disabled={bookingLoading || selectedSeats.length === 0}
          accessibilityLabel="Book trip"
          accessibilityHint="Creates a booking for the selected trip and seats"
        >
          <Text style={styles.bookButtonText}>
            {bookingLoading
              ? 'Booking...'
              : `Book ${selectedSeats.length} Seat${
                  selectedSeats.length > 1 ? 's' : ''
                }`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  loadingText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
    color: Colors.gray[600],
  },
  errorText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
    color: Colors.error,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    marginBottom: 4,
  },
  availableSeats: {
    fontSize: 16,
    marginBottom: 16,
  },
  seatSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  seatButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  seatButtonText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  seatCount: {
    marginHorizontal: 20,
    fontSize: 18,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
