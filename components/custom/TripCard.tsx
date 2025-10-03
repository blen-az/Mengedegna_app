import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

type Trip = {
  from?: string;
  to?: string;
  date?: string;
  price?: number;
  seatsAvailable?: number;
};

interface Props {
  trip: Trip;
  onPress?: () => void;
}

export default function TripCard({ trip, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.9}
      accessibilityLabel={`Trip from ${trip.from || 'Unknown'} to ${
        trip.to || 'Unknown'
      }`}
      accessibilityHint="Tap to view trip details"
    >
      {/* Route Info */}
      <View style={styles.routeContainer}>
        <Text style={styles.routeText}>{trip.from || 'Unknown'}</Text>
        <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
        <Text style={styles.routeText}>{trip.to || 'Unknown'}</Text>
      </View>

      {/* Date */}
      <Text style={styles.dateText}>
        🗓️ {trip.date || 'Date not available'}
      </Text>

      {/* Price & Seats */}
      <View style={styles.detailsContainer}>
        <View>
          <Text style={styles.labelText}>Price</Text>
          <Text style={styles.priceText}>
            {trip.price ? `${trip.price} ETB` : 'N/A'}
          </Text>
        </View>

        <View style={styles.seatsContainer}>
          <Text style={styles.labelText}>Seats Available</Text>
          <Text style={styles.seatsText}>{trip.seatsAvailable ?? 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  routeText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.secondary,
  },
  seatsContainer: {
    alignItems: 'flex-end',
  },
  seatsText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
});
