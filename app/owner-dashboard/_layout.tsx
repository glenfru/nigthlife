import { Stack } from 'expo-router';

export default function OwnerDashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="venue-management" />
      <Stack.Screen name="promotions" />
      <Stack.Screen name="reservations" />
      <Stack.Screen name="analytics" />
    </Stack>
  );
}