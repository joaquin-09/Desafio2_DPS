import { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Categoria, Producto } from '../../src/types';
import { PRODUCTOS, CANTIDAD_MAXIMA, CANTIDAD_MINIMA } from '../../src/data/productos';
import { useOrden } from '../../src/context/OrdenContext';

export default function Catalogo() {
  const { agregarProducto } = useOrden();
  const [categoria, setCategoria] = useState<Categoria>('alimento');
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [mensajes, setMensajes] = useState<Record<string, string>>({});

  const productosFiltrados = PRODUCTOS.filter((p) => p.categoria === categoria);

  const obtenerCantidad = (id: string): number => cantidades[id] ?? 0;

  const cambiarCantidad = (id: string, delta: number) => {
    setCantidades((prev) => {
      const actual = prev[id] ?? 0;
      const nueva = Math.min(Math.max(actual + delta, 0), CANTIDAD_MAXIMA);
      return { ...prev, [id]: nueva };
    });
    setMensajes((prev) => ({ ...prev, [id]: '' }));
  };

  const handleAgregar = (producto: Producto) => {
    const cantidad = obtenerCantidad(producto.id);
    const error = agregarProducto(producto, cantidad);

    if (error) {
      setMensajes((prev) => ({ ...prev, [producto.id]: error }));
      return;
    }

    setMensajes((prev) => ({ ...prev, [producto.id]: `✅ Agregado (${cantidad})` }));
    setCantidades((prev) => ({ ...prev, [producto.id]: 0 }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsCategoria}>
        <TouchableOpacity
          style={[styles.tabBtn, categoria === 'alimento' && styles.tabBtnActivo]}
          onPress={() => setCategoria('alimento')}
        >
          <Text style={[styles.tabBtnText, categoria === 'alimento' && styles.tabBtnTextActivo]}>
            🌮 Alimentos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, categoria === 'bebida' && styles.tabBtnActivo]}
          onPress={() => setCategoria('bebida')}
        >
          <Text style={[styles.tabBtnText, categoria === 'bebida' && styles.tabBtnTextActivo]}>
            🥤 Bebidas
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagen }} style={styles.imagen} />
            <View style={styles.info}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.precio}>${item.precio.toFixed(2)}</Text>

              <View style={styles.selectorRow}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => cambiarCantidad(item.id, -1)}
                >
                  <Text style={styles.stepperText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.cantidadText}>{obtenerCantidad(item.id)}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => cambiarCantidad(item.id, 1)}
                >
                  <Text style={styles.stepperText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnAgregar} onPress={() => handleAgregar(item)}>
                  <Text style={styles.btnAgregarText}>Agregar</Text>
                </TouchableOpacity>
              </View>

              {mensajes[item.id] ? (
                <Text
                  style={[
                    styles.mensaje,
                    mensajes[item.id].startsWith('✅') ? styles.mensajeExito : styles.mensajeError,
                  ]}
                >
                  {mensajes[item.id]}
                </Text>
              ) : null}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff4e6' },
  tabsCategoria: { flexDirection: 'row', padding: 12, gap: 8 },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#f0d9c4',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tabBtnActivo: { backgroundColor: '#e85d2c', borderColor: '#e85d2c' },
  tabBtnText: { fontWeight: '700', color: '#7a2e0e', fontSize: 13 },
  tabBtnTextActivo: { color: '#fff' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  imagen: { width: 100, height: 100 },
  info: { flex: 1, padding: 10 },
  nombre: { fontWeight: '700', fontSize: 14, color: '#3a2418' },
  precio: { color: '#e85d2c', fontWeight: '800', fontSize: 14, marginBottom: 6 },
  selectorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff4e6',
    borderWidth: 1,
    borderColor: '#f0d9c4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: { fontSize: 16, fontWeight: '800', color: '#7a2e0e' },
  cantidadText: { fontSize: 14, fontWeight: '700', minWidth: 18, textAlign: 'center' },
  btnAgregar: {
    marginLeft: 'auto',
    backgroundColor: '#e85d2c',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnAgregarText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  mensaje: { fontSize: 11, marginTop: 6, fontWeight: '600' },
  mensajeExito: { color: '#1b8a3a' },
  mensajeError: { color: '#c0392b' },
});