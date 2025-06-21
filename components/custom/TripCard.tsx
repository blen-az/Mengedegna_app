import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Star, Clock, MapPin } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface TripCardProps {
  trip: any;
  onPress: () => void;
}

export default function TripCard({ trip, onPress }: TripCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Image
            source={{ uri: trip.company.logoUrl || 'https://images.pexels.com/photos/2402648/pexels-photo-2402648.jpeg' }}
            style={styles.companyLogo}
          />
          <View>
            <Text style={styles.companyName}>{trip.company.name}</Text>
            <View style={styles.rating}>
              <Star size={12} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.ratingText}>{trip.company.rating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>{trip.price} ETB</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.routeContainer}>
          <View style={styles.locationDots}>
            <View style={styles.originDot} />
            <View style={styles.routeLine} />
            <View style={styles.destinationDot} />
          </View>
          <View style={styles.locations}>
            <Text style={styles.locationText}>{trip.from}</Text>
            <Text style={styles.locationText}>{trip.to}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Clock size={14} color={Colors.gray[600]} />
            <Text style={styles.infoText}>{trip.departureTime}</Text>
          </View>
          <View style={styles.infoItem}>
            <MapPin size={14} color={Colors.gray[600]} />
            <Text style={styles.infoText}>{trip.departureTerminal}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.seatsContainer}>
          <Text style={styles.seatsLabel}>Available Seats</Text>
          <Text style={styles.seatsCount}>{trip.availableSeats} seats</Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  content: {
    padding: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  locationDots: {
    marginRight: 12,
    alignItems: 'center',
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  routeLine: {
    width: 1,
    height: 24,
    backgroundColor: Colors.gray[300],
    marginVertical: 4,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary,
  },
  locations: {
    justifyContent: 'space-between',
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[700],
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.gray[50],
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  seatsContainer: {},
  seatsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
  seatsCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
});