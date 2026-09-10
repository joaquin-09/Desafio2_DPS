import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { OrdenProvider } from '../src/context/OrdenContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrdenProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="main" />
        </Stack>
      </OrdenProvider>
    </AuthProvider>
  );
}