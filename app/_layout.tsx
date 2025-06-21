import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';
import ErrorBoundary from '@/components/core/ErrorBoundary';
import Colors from '@/constants/Colors';

export default function RootLayout() {
  const isReady = useFrameworkReady();

  if (!isReady) {
    return null; // or a loading spinner
  }

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
}