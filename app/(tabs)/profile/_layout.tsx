import { Stack } from 'expo-router/stack';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} />
      <Stack.Screen name="personal-info" options={{ title: 'Personal Info' }} />
      <Stack.Screen
        name="payment-methods"
        options={{ title: 'Payment Methods' }}
      />
      <Stack.Screen name="saved-trips" options={{ title: 'Saved Trips' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="help" options={{ title: 'Help' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} />
    </Stack>
  );
}
