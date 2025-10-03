import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';

import ErrorBoundary from '@/components/core/ErrorBoundary';
import Colors from '@/constants/Colors';
import { Text } from 'react-native';

export default function RootLayout() {
  console.log('RootLayout mounted');

  const [fontsLoaded] = useFonts({
    'Inter-Regular':
      'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
    'Inter-Medium':
      'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2',
    'Inter-SemiBold':
      'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2',
    'Inter-Bold':
      'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZ9hiJ-Ek-_EeA.woff2',
  });

  const isReady = useFrameworkReady();
  if (!isReady || !fontsLoaded) {
    return null;
  }

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
            <Stack.Screen name="trip/[id]" />
            <Stack.Screen name="booking/[id]" />
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
