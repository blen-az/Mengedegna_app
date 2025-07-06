import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function SavedTripsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [savedTrips, setSavedTrips] = useState<any[]>([]); // Replace with actual trip data structure

  useEffect(() => {
    // Fetch saved trips logic (e.g., from Firestore or local storage)
    // Example: setSavedTrips(await getSavedTrips(user.uid));
    setSavedTrips([
      { id: '1', route: 'Gondar to Hawassa', date: '2025-07-07' },
      { id: '2', route: 'Bahir Dar to Addis Ababa', date: '2025-07-08' },
    ]);
  }, [user]);

  const renderTrip = ({ item }: { item: any }) => (
    <View
      style={{
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[200],
      }}
    >
      <Text>{item.route}</Text>
      <Text>Date: {item.date}</Text>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.primary,
          padding: 5,
          borderRadius: 4,
          marginTop: 4,
        }}
        onPress={() => router.push(`/booking/${item.id}` as any)} // Navigate to booking details
      >
        <Text style={{ color: Colors.white }}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Saved Trips
      </Text>
      <FlatList
        data={savedTrips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No saved trips yet.</Text>}
      />
      <TouchableOpacity
        style={{
          backgroundColor: Colors.primary,
          padding: 10,
          borderRadius: 8,
          marginVertical: 8,
        }}
        onPress={() => router.back()}
      >
        <Text style={{ color: Colors.white }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
