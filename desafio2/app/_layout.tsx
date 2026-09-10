import { Stack } from 'expo-router';
import { OrdenProvider } from '../src/context/OrdenContext';

export default function RootLayout() {
  return (
    <OrdenProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="main" />
      </Stack>
    </OrdenProvider>
  );
}