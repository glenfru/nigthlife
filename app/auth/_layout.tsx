import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="user-signup" />
      <Stack.Screen name="owner-signup" />
      <Stack.Screen name="login" />
    </Stack>
  );
}