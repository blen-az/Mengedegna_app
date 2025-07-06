import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';

import ErrorBoundary from '@/components/core/ErrorBoundary';
import Colors from '@/constants/Colors';
import { Text } from 'react-native';

export default function RootLayout() {
  console.log('RootLayout mounted');
  // const isReady = useFrameworkReady();
  // if (!isReady) {
  //   return null;
  // }

  try {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </ErrorBoundary>
    );
  } catch (e) {
    console.error('RootLayout error:', e);
    return <Text>RootLayout error: {String(e)}</Text>;
  }
}
