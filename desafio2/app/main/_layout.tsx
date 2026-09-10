import { Text, TouchableOpacity, Alert } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { useOrden } from '../../src/context/OrdenContext';
import { useAuth } from '../../src/context/AuthContext';

export default function MainLayout() {
  const router = useRouter();
  const { limpiarOrden } = useOrden();
  const { cerrarSesion: cerrarSesionAuth, usuarioActual } = useAuth();

  const cerrarSesion = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => {
          limpiarOrden();
          cerrarSesionAuth();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#e85d2c' },
        headerTintColor: '#fff',
        headerRight: () => (
          <TouchableOpacity onPress={cerrarSesion} style={{ marginRight: 16 }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Salir</Text>
          </TouchableOpacity>
        ),
      }}
    >
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