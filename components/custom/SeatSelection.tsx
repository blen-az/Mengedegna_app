import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors from '@/constants/Colors';

interface SeatSelectionProps {
  seats: {
    id: string;
    status: 'available' | 'booked' | 'selected';
    price?: number;
  }[];
  selectedSeats: string[];
  onSelectSeat: (seatId: string) => void;
}

export default function SeatSelection({
  seats,
  selectedSeats,
  onSelectSeat,
}: SeatSelectionProps) {
  // Organize seats in a grid - assuming 4 seats per row (2-2 configuration)
  const rowsOfSeats = [];
  const seatsPerRow = 4;

  for (let i = 0; i < seats.length; i += seatsPerRow) {
    rowsOfSeats.push(seats.slice(i, i + seatsPerRow));
  }

  const renderSeat = (seat: {
    id: string;
    status: 'available' | 'booked' | 'selected';
    price?: number;
  }) => {
    const isSelected = selectedSeats.includes(seat.id);
    const isBooked = seat.status === 'booked';

    return (
      <TouchableOpacity
        key={seat.id}
        style={[
          styles.seat,
          isBooked && styles.bookedSeat,
          isSelected && styles.selectedSeat,
        ]}
        onPress={() => !isBooked && onSelectSeat(seat.id)}
        disabled={isBooked}
      >
        <Text
          style={[
            styles.seatText,
            isBooked && styles.bookedSeatText,
            isSelected && styles.selectedSeatText,
          ]}
        >
          {seat.id}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
      <View style={styles.busLayout}>
        <View style={styles.driverSection}>
          <View style={styles.steeringWheel} />
          <Text style={styles.driverText}>Driver</Text>
        </View>

        <View style={styles.seatsContainer}>
          {rowsOfSeats.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              <View style={styles.leftSection}>
                {row.slice(0, 2).map(renderSeat)}
              </View>
              <View style={styles.aisle} />
              <View style={styles.rightSection}>
                {row.slice(2, 4).map(renderSeat)}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.backSection}>
          <Text style={styles.backText}>Back</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  busLayout: {
    backgroundColor: Colors.gray[100],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[300],
    width: '100%',
    justifyContent: 'center',
  },
  steeringWheel: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.gray[700],
    marginRight: 8,
  },
  driverText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
  },
  seatsContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
  },
  rightSection: {
    flexDirection: 'row',
  },
  aisle: {
    width: 20,
  },
  seat: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  bookedSeat: {
    backgroundColor: Colors.gray[400],
  },
  selectedSeat: {
    backgroundColor: Colors.primary,
  },
  seatText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[800],
  },
  bookedSeatText: {
    color: Colors.gray[200],
  },
  selectedSeatText: {
    color: Colors.white,
  },
  backSection: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[300],
  },
  backText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
  },
});
