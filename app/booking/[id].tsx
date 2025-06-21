import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Clock, MapPin, User, CreditCard, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import SafeAreaView from '@/components/core/SafeAreaView';
import PassengerForm from '@/components/custom/PassengerForm';
import Colors from '@/constants/Colors';
import { fetchTripById } from '@/services/tripService';
import { useAuth } from '@/context/AuthContext';
import { Trip, Passenger } from '@/types/Post';

export default function BookingScreen() {
  const { id, seats } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse seats from URL parameter
  const selectedSeats = typeof seats === 'string' ? seats.split(',') : [];
  
  useEffect(() => {
    const loadTrip = async () => {
      try {
        const tripData = await fetchTripById(id as string);
        setTrip(tripData);
        
        // Initialize passenger forms
        const initialPassengers: Passenger[] = selectedSeats.map((seatId) => ({
          seatId,
          fullName: '',
          phone: '',
          email: '',
          idNumber: '',
        }));
        
        // Pre-fill first passenger with user data if available
        if (user && initialPassengers.length > 0) {
          initialPassengers[0] = {
            ...initialPassengers[0],
            fullName: user.displayName || '',
            email: user.email || '',
          };
        }
        
        setPassengers(initialPassengers);
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('Failed to load trip details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id, seats, user]);

  useEffect(() => {
    // Check if all passenger forms are valid
    const valid = passengers.every(
      (p) => p.fullName && p.phone && (p.email || p.idNumber)
    );
    setIsFormValid(valid);
  }, [passengers]);

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    setPassengers(updatedPassengers);
  };

  const handleContinueToPayment = () => {
    if (!isFormValid) {
      Alert.alert(
        'Missing Information',
        'Please fill in all required passenger information.'
      );
      return;
    }

    // For now, just show an alert since we don't have a payment screen
    Alert.alert(
      'Payment',
      'Payment functionality would be implemented here.',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <AlertTriangle size={64} color={Colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <AlertTriangle size={64} color={Colors.error} />
        <Text style={styles.errorText}>Trip not found</Text>
        <TouchableOpacity 
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={Colors.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Passenger Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.tripInfoCard}>
          <Text style={styles.tripTitle}>{trip.from} to {trip.to}</Text>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{trip.company.name}</Text>
            <Text style={styles.busType}>{trip.busType}</Text>
          </View>
          
          <View style={styles.tripDetails}>
            <View style={styles.tripDetailItem}>
              <Calendar size={16} color={Colors.primary} />
              <Text style={styles.tripDetailText}>
                {new Date(trip.date).toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric'
                })}
              </Text>
            </View>
            <View style={styles.tripDetailItem}>
              <Clock size={16} color={Colors.primary} />
              <Text style={styles.tripDetailText}>{trip.departureTime}</Text>
            </View>
            <View style={styles.tripDetailItem}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.tripDetailText}>{trip.departureTerminal}</Text>
            </View>
          </View>
          
          <View style={styles.seatsInfo}>
            <Text style={styles.seatsLabel}>Selected Seats:</Text>
            <View style={styles.seatsList}>
              {selectedSeats.map((seat) => (
                <View key={seat} style={styles.seatBadge}>
                  <Text style={styles.seatNumber}>{seat}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger Information</Text>
          <Text style={styles.sectionSubtitle}>
            Please enter the details for each passenger
          </Text>

          {passengers.map((passenger, index) => (
            <PassengerForm
              key={passenger.seatId}
              passenger={passenger}
              seatNumber={passenger.seatId}
              index={index}
              onChange={handlePassengerChange}
            />
          ))}
        </View>

        <View style={styles.policySection}>
          <Text style={styles.policyTitle}>Booking Policies</Text>
          <View style={styles.policyItem}>
            <AlertTriangle size={16} color={Colors.warning} />
            <Text style={styles.policyText}>
              Cancellation available up to 4 hours before departure with 80% refund.
            </Text>
          </View>
          <View style={styles.policyItem}>
            <User size={16} color={Colors.gray[700]} />
            <Text style={styles.policyText}>
              Passengers must present a valid ID that matches the details provided.
            </Text>
          </View>
          <View style={styles.policyItem}>
            <Clock size={16} color={Colors.gray[700]} />
            <Text style={styles.policyText}>
              Please arrive at least 30 minutes before departure time.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceDetails}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{selectedSeats.length} seat(s) × {trip.price} ETB</Text>
            <Text style={styles.priceValue}>{trip.price * selectedSeats.length} ETB</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service fee</Text>
            <Text style={styles.priceValue}>20 ETB</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{trip.price * selectedSeats.length + 20} ETB</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.paymentButton,
            !isFormValid && styles.disabledButton
          ]} 
          onPress={handleContinueToPayment}
          disabled={!isFormValid}
        >
          <CreditCard size={20} color={Colors.white} />
          <Text style={styles.paymentButtonText}>Continue to Payment</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingTop: 16,
  },
  tripInfoCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tripTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.gray[900],
    marginBottom: 8,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[800],
  },
  busType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginLeft: 8,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: Colors.gray[300],
  },
  tripDetails: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
    marginLeft: 8,
  },
  seatsInfo: {
    marginTop: 16,
  },
  seatsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
    marginBottom: 8,
  },
  seatsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seatBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  seatNumber: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginBottom: 16,
  },
  policySection: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 100,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  policyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  policyItem: {
    flexDirection: 'row',
    marginBottom: 12,
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
  priceDetails: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[700],
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  paymentButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
  },
  paymentButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
    marginLeft: 8,
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
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
});