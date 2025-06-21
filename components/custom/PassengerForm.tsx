import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Colors from '@/constants/Colors';

interface PassengerFormProps {
  passenger: {
    seatId: string;
    fullName: string;
    phone: string;
    email: string;
    idNumber: string;
  };
  seatNumber: string;
  index: number;
  onChange: (index: number, field: string, value: string) => void;
}

export default function PassengerForm({
  passenger,
  seatNumber,
  index,
  onChange,
}: PassengerFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.passengerTitle}>
          {index === 0 ? 'Main Passenger' : `Passenger ${index + 1}`}
        </Text>
        <View style={styles.seatBadge}>
          <Text style={styles.seatNumber}>Seat {seatNumber}</Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          placeholderTextColor={Colors.gray[400]}
          value={passenger.fullName}
          onChangeText={(text) => onChange(index, 'fullName', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number*</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., +251 91 234 5678"
          placeholderTextColor={Colors.gray[400]}
          keyboardType="phone-pad"
          value={passenger.phone}
          onChangeText={(text) => onChange(index, 'phone', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          placeholderTextColor={Colors.gray[400]}
          keyboardType="email-address"
          autoCapitalize="none"
          value={passenger.email}
          onChangeText={(text) => onChange(index, 'email', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ID Number</Text>
        <TextInput
          style={styles.input}
          placeholder="National ID, passport, or driver's license"
          placeholderTextColor={Colors.gray[400]}
          value={passenger.idNumber}
          onChangeText={(text) => onChange(index, 'idNumber', text)}
        />
      </View>

      <Text style={styles.note}>
        * Required fields. Please provide either email or ID number.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  passengerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  seatBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  seatNumber: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[800],
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[900],
  },
  note: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginTop: 8,
  },
});