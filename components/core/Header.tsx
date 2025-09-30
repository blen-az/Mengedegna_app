import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, BellDot } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  onPressNotification?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export default function Header({
  title,
  showBack = false,
  showNotification = false,
  onPressNotification,
  style,
  titleStyle,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={Colors.gray[800]} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, titleStyle]}>{title}</Text>

      <View style={styles.rightContainer}>
        {showNotification && (
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={onPressNotification}
          >
            <BellDot size={24} color={Colors.gray[800]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  leftContainer: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
