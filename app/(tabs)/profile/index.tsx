import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  LogOut,
  User,
  CreditCard,
  Bell,
  Settings,
  CircleHelp as HelpCircle,
  Heart,
} from 'lucide-react-native';
import SafeAreaView from '@/components/core/SafeAreaView';
import ProfileListItem from '@/components/custom/ProfileListItem';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            router.replace('/welcome');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const profileSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'personal-info',
          icon: <User size={20} color={Colors.primary} />,
          title: 'Personal Information',
          onPress: () => router.push('/(tabs)/profile/personal-info' as any),
        },
        {
          id: 'payment',
          icon: <CreditCard size={20} color={Colors.primary} />,
          title: 'Payment Methods',
          onPress: () => router.push('/(tabs)/profile/payment-methods' as any),
        },
        {
          id: 'notifications',
          icon: <Bell size={20} color={Colors.primary} />,
          title: 'Notifications',
          rightElement: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.gray[300], true: Colors.primary }}
              thumbColor={Colors.white}
            />
          ),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'saved',
          icon: <Heart size={20} color={Colors.primary} />,
          title: 'Saved Trips',
          onPress: () => router.push('/(tabs)/profile/saved-trips' as any),
        },
        {
          id: 'settings',
          icon: <Settings size={20} color={Colors.primary} />,
          title: 'Settings',
          onPress: () => router.push('/(tabs)/profile/settings' as any),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: <HelpCircle size={20} color={Colors.primary} />,
          title: 'Help Center',
          onPress: () => router.push('/(tabs)/profile/help' as any),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={{
                uri:
                  user?.photoURL ||
                  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.displayName || 'Guest'}</Text>
              <Text style={styles.email}>{user?.email || 'Not signed in'}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/(tabs)/profile/edit' as any)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {profileSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => (
                <ProfileListItem key={item.id} item={item} />
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>
            © 2025 Mengedegna. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    paddingTop: 16,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.error,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  version: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
  },
});
