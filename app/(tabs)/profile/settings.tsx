import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  Shield,
  Moon,
  Globe,
  Smartphone,
  Volume2,
  Eye,
  Lock,
  HelpCircle,
  Info,
  LogOut,
  User,
  CreditCard,
  Heart,
} from 'lucide-react-native';
import SafeAreaView from '@/components/core/SafeAreaView';
import Header from '@/components/core/Header';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

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

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: <User size={20} color={Colors.primary} />,
          title: 'Profile Settings',
          subtitle: 'Manage your personal information',
          onPress: () => router.push('/(tabs)/profile/personal-info' as any),
        },
        {
          id: 'payment',
          icon: <CreditCard size={20} color={Colors.primary} />,
          title: 'Payment Methods',
          subtitle: 'Manage your payment options',
          onPress: () => router.push('/(tabs)/profile/payment-methods' as any),
        },
        {
          id: 'saved',
          icon: <Heart size={20} color={Colors.primary} />,
          title: 'Saved Trips',
          subtitle: 'View your saved trip history',
          onPress: () => router.push('/(tabs)/profile/saved-trips' as any),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'push',
          icon: <Bell size={20} color={Colors.primary} />,
          title: 'Push Notifications',
          subtitle: 'Get notified about trips and updates',
          rightElement: (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.gray[300], true: Colors.primary }}
              thumbColor={Colors.white}
            />
          ),
        },
        {
          id: 'sound',
          icon: <Volume2 size={20} color={Colors.primary} />,
          title: 'Sound & Vibration',
          subtitle: 'Enable sound for notifications',
          rightElement: (
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: Colors.gray[300], true: Colors.primary }}
              thumbColor={Colors.white}
            />
          ),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'biometric',
          icon: <Lock size={20} color={Colors.primary} />,
          title: 'Biometric Authentication',
          subtitle: 'Use fingerprint or face ID',
          rightElement: (
            <Switch
              value={biometricAuth}
              onValueChange={setBiometricAuth}
              trackColor={{ false: Colors.gray[300], true: Colors.primary }}
              thumbColor={Colors.white}
            />
          ),
        },
        {
          id: 'location',
          icon: <Globe size={20} color={Colors.primary} />,
          title: 'Location Services',
          subtitle: 'Allow location access for better experience',
          rightElement: (
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{ false: Colors.gray[300], true: Colors.primary }}
              thumbColor={Colors.white}
            />
          ),
        },
        {
          id: 'privacy',
          icon: <Eye size={20} color={Colors.primary} />,
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          onPress: () =>
            Alert.alert(
              'Privacy Policy',
              'Privacy policy content would go here.'
            ),
        },
      ],
    },
    {
      title: 'App Preferences',
      items: [
        {
          id: 'darkMode',
          icon: <Moon size={20} color={Colors.primary} />,
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          rightElement: (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.gray[300], true: Colors.primary }}
              thumbColor={Colors.white}
            />
          ),
        },
        {
          id: 'autoRefresh',
          icon: <Smartphone size={20} color={Colors.primary} />,
          title: 'Auto Refresh',
          subtitle: 'Automatically refresh trip data',
          rightElement: (
            <Switch
              value={autoRefresh}
              onValueChange={setAutoRefresh}
              trackColor={{ false: Colors.gray[300], true: Colors.primary }}
              thumbColor={Colors.white}
            />
          ),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: <HelpCircle size={20} color={Colors.primary} />,
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          onPress: () => router.push('/(tabs)/profile/help' as any),
        },
        {
          id: 'about',
          icon: <Info size={20} color={Colors.primary} />,
          title: 'About App',
          subtitle: 'Version 1.0.0',
          onPress: () =>
            Alert.alert(
              'About',
              'Mengedegna Bus Booking App\nVersion 1.0.0\n\nYour trusted partner for bus travel in Ethiopia.'
            ),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={!item.onPress}
    >
      <View style={styles.settingIcon}>{item.icon}</View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      {item.rightElement && (
        <View style={styles.settingRight}>{item.rightElement}</View>
      )}
      {item.onPress && (
        <View style={styles.settingArrow}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => renderSettingItem(item))}
            </View>
          </View>
        ))}

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[900],
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
  },
  settingRight: {
    marginLeft: 12,
  },
  settingArrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 18,
    color: Colors.gray[400],
    fontFamily: 'Inter-Medium',
  },
  logoutSection: {
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.error,
  },
});
