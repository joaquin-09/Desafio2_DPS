import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { OrdenHistorial } from '../../src/types';

export default function Historial() {
  const [ordenes, setOrdenes] = useState<OrdenHistorial[]>([]);

  // Recarga el historial cada vez que la pestaña gana el foco,
  // para reflejar órdenes recién confirmadas.
  useFocusEffect(
    useCallback(() => {
      cargarHistorial();
    }, [])
  );

  const cargarHistorial = async () => {
    const raw = await AsyncStorage.getItem('historial_ordenes');
    const historial: OrdenHistorial[] = raw ? JSON.parse(raw) : [];
    // Ya se guardan del más reciente al más antiguo (prepend al confirmar).
    setOrdenes(historial);
  };

  const formatearFecha = (iso: string): string =>
    new Date(iso).toLocaleString('es-SV', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <View style={styles.container}>
      <FlatList
        data={ordenes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioText}>📋 Aún no tienes órdenes confirmadas.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.fecha}>🕐 {formatearFecha(item.fecha)}</Text>
            {item.items.map((p, idx) => (
              <Text key={idx} style={styles.producto}>
                • {p.cantidad}x {p.nombre}
              </Text>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValor}>${item.total.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff4e6' },
  vacio: { alignItems: 'center', paddingTop: 60 },
  vacioText: { fontSize: 14, fontWeight: '600', color: '#8a6a5a' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fecha: { fontSize: 12, color: '#8a6a5a', marginBottom: 6, fontWeight: '600' },
  producto: { fontSize: 13, color: '#3a2418', marginBottom: 2 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0d9c4',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: { fontWeight: '700', color: '#3a2418' },
  totalValor: { fontWeight: '800', color: '#e85d2c' },
});