import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface BookingCardProps {
  booking: any;
  onPress: () => void;
}

export default function BookingCard({ booking, onPress }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.gray[500];
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.route}>
          <Text style={styles.routeText}>
            {booking.trip.from} to {booking.trip.to}
          </Text>
        </View>
        <View
          style={[
            styles.status,
            { backgroundColor: getStatusColor(booking.status) + '20' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(booking.status) },
            ]}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.company}>
        <Text style={styles.companyName}>{booking.trip.company.name}</Text>
        <Text style={styles.bookingId}>Booking ID: {booking.id}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Calendar size={16} color={Colors.primary} />
          <Text style={styles.detailText}>
            {new Date(booking.trip.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color={Colors.primary} />
          <Text style={styles.detailText}>{booking.trip.departureTime}</Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={16} color={Colors.primary} />
          <Text style={styles.detailText}>
            {booking.trip.departureTerminal}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.seats}>
          <Text style={styles.seatsLabel}>Seats</Text>
          <View style={styles.seatsList}>
            {booking.seats.map((seat: string) => (
              <View key={seat} style={styles.seatBadge}>
                <Text style={styles.seatNumber}>{seat}</Text>
              </View>
            ))}
          </View>
        </View>
        <ChevronRight size={20} color={Colors.gray[400]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  route: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  company: {
    marginBottom: 12,
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
  },
  bookingId: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginTop: 2,
  },
  details: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray[200],
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[800],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seats: {
    flex: 1,
  },
  seatsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
    marginBottom: 8,
  },
  seatsList: {
    flexDirection: 'row',
  },
  seatBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  seatNumber: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
});
