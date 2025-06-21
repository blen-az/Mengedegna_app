import React from 'react';
import { SafeAreaView as NativeSafeAreaView, StyleSheet, ViewStyle, Platform, StatusBar } from 'react-native';
import Colors from '@/constants/Colors';

interface SafeAreaViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function SafeAreaView({ children, style }: SafeAreaViewProps) {
  return (
    <NativeSafeAreaView style={[styles.container, style]}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />}
      {children}
    </NativeSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});