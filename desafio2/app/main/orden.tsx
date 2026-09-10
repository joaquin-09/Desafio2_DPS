import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useOrden } from '../../src/context/OrdenContext';
import { IVA_PORCENTAJE } from '../../src/data/productos';
import { ItemHistorial, OrdenHistorial } from '../../src/types';

export default function Orden() {
  const router = useRouter();
  const { items, eliminarProducto, limpiarOrden } = useOrden();
  const [error, setError] = useState('');

  const subtotalGeneral = items.reduce((acc, it) => acc + it.producto.precio * it.cantidad, 0);
  const iva = subtotalGeneral * IVA_PORCENTAJE;
  const total = subtotalGeneral + iva;

  const confirmarOrden = () => {
    if (items.length === 0) {
      setError('No puedes confirmar una orden vacía. Agrega productos desde el catálogo.');
      return;
    }

    Alert.alert('Confirmar orden', `¿Confirmar orden por $${total.toFixed(2)}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: async () => {
          const itemsHistorial: ItemHistorial[] = items.map((it) => ({
            nombre: it.producto.nombre,
            cantidad: it.cantidad,
            precioUnitario: it.producto.precio,
          }));

          const nuevaOrden: OrdenHistorial = {
            id: Date.now().toString(),
            fecha: new Date().toISOString(),
            items: itemsHistorial,
            subtotal: subtotalGeneral,
            iva,
            total,
          };

          const raw = await AsyncStorage.getItem('historial_ordenes');
          const historial: OrdenHistorial[] = raw ? JSON.parse(raw) : [];
          await AsyncStorage.setItem(
            'historial_ordenes',
            JSON.stringify([nuevaOrden, ...historial])
          );

          limpiarOrden();
          setError('');
          Alert.alert('✅ Orden confirmada', 'Tu orden fue registrada en el historial.', [
            { text: 'Ver historial', onPress: () => router.push('/main/historial') },
            { text: 'Seguir pidiendo', style: 'cancel' },
          ]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.producto.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioText}>🛒 Tu orden está vacía.</Text>
            <Text style={styles.vacioSub}>Agrega productos desde el catálogo.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNombre}>{item.producto.nombre}</Text>
              <Text style={styles.itemDetalle}>
                {item.cantidad} x ${item.producto.precio.toFixed(2)} = $
                {(item.cantidad * item.producto.precio).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => eliminarProducto(item.producto.id)}>
              <Text style={styles.eliminarText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {items.length > 0 && (
        <View style={styles.resumen}>
          <View style={styles.resumenRow}>
            <Text style={styles.resumenLabel}>Subtotal</Text>
            <Text style={styles.resumenValor}>${subtotalGeneral.toFixed(2)}</Text>
          </View>
          <View style={styles.resumenRow}>
            <Text style={styles.resumenLabel}>IVA (13%)</Text>
            <Text style={styles.resumenValor}>${iva.toFixed(2)}</Text>
          </View>
          <View style={styles.resumenRow}>
            <Text style={styles.resumenLabelTotal}>Total</Text>
            <Text style={styles.resumenValorTotal}>${total.toFixed(2)}</Text>
          </View>
        </View>
      )}

      {error !== '' && <Text style={styles.errorText}>⚠ {error}</Text>}

      <TouchableOpacity style={styles.btnConfirmar} onPress={confirmarOrden}>
        <Text style={styles.btnConfirmarText}>Confirmar orden</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff4e6' },
  vacio: { alignItems: 'center', paddingTop: 60 },
  vacioText: { fontSize: 15, fontWeight: '700', color: '#8a6a5a' },
  vacioSub: { fontSize: 12, color: '#b09585', marginTop: 6 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  itemNombre: { fontWeight: '700', fontSize: 14, color: '#3a2418' },
  itemDetalle: { fontSize: 12, color: '#8a6a5a', marginTop: 2 },
  eliminarText: { fontSize: 18, marginLeft: 10 },
  resumen: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16 },
  resumenRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  resumenLabel: { color: '#8a6a5a', fontSize: 13 },
  resumenValor: { color: '#3a2418', fontSize: 13, fontWeight: '600' },
  resumenLabelTotal: { color: '#3a2418', fontSize: 16, fontWeight: '800', marginTop: 4 },
  resumenValorTotal: { color: '#e85d2c', fontSize: 16, fontWeight: '800', marginTop: 4 },
  errorText: { color: '#c0392b', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  btnConfirmar: {
    backgroundColor: '#e85d2c',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  btnConfirmarText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});