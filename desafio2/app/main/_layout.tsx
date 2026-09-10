import { Text } from 'react-native';
import { Tabs } from 'expo-router';

export default function MainLayout() {
  return (
    <Tabs screenOptions={{ headerStyle: { backgroundColor: '#e85d2c' }, headerTintColor: '#fff' }}>
      <Tabs.Screen
        name="catalogo"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🍽️</Text>,
        }}
      />
      <Tabs.Screen
        name="orden"
        options={{
          title: 'Mi Orden',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🧾</Text>,
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🕐</Text>,
        }}
      />
    </Tabs>
  );
}