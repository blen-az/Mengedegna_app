import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { getUserProfile } from '@/services/firebase';
import { UserProfile } from '@/types';
import SafeAreaView from '@/components/core/SafeAreaView';
import Header from '@/components/core/Header';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          Alert.alert(
            'Error',
            'Failed to load personal info. Please try again.'
          );
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Personal Info" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Personal Info" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Please log in to view your personal info.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Personal Info" />
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>
          {userProfile?.displayName || 'Not set'}
        </Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>
          {userProfile?.phoneNumber || 'Not set'}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/(tabs)/profile/edit')}
        >
          <Text style={styles.editButtonText}>Edit Personal Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    margin: 16,
    padding: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
    marginBottom: 4,
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginVertical: 8,
    borderRadius: 1,
  },
  buttonContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  editButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  backButton: {
    backgroundColor: Colors.gray[200],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.gray[700],
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});
