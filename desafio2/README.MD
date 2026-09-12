# 🌮 El Buen Sabor - App de Pedidos

## 🔗 Enlaces

- **Repositorio de GitHub:** [https://github.com/joaquin-09/Desafio2_DPS](https://github.com/joaquin-09/Desafio2_DPS)
- **Video demostrativo:** [https://youtu.be/SsglUISKcsM]

## ✨ Funcionalidades

- Catálogo de 10 alimentos y 5 bebidas con imagen, nombre y precio fijo (no editable por el cliente)
- Filtrado por categoría (Alimentos / Bebidas) mediante pestañas
- Selector de cantidad por producto (mínimo 1, máximo 20 unidades)
- Orden actual: agregar, sumar cantidades y eliminar productos
- Cálculo automático de subtotal por producto, subtotal general, IVA (13%) y total
- Confirmación previa antes de enviar la orden (diálogo con el monto exacto)
- Validaciones visibles en pantalla: campos vacíos, cantidad inválida, orden vacía
- Autenticación: inicio de sesión con usuario y contraseña en variables locales
- Historial de compras persistido en `AsyncStorage`, separado por usuario y ordenado del más reciente al más antiguo
- Cierre de sesión con confirmación

## 🛠️ Tecnologías

- React Native (Expo)
- TypeScript
- Expo Router (navegación basada en archivos, Stack + Tabs)
- Context API (estado global de sesión y de la orden)
- `@react-native-async-storage/async-storage` (persistencia del historial)

## 📂 Estructura del proyecto

```
desafio2/
├── app/
│   ├── _layout.tsx        # Stack raíz (AuthProvider + OrdenProvider)
│   ├── index.tsx           # Login
│   └── main/
│       ├── _layout.tsx     # Tabs (Catálogo, Mi Orden, Historial) + botón Salir
│       ├── catalogo.tsx    # Selección de alimentos/bebidas con cantidad
│       ├── orden.tsx       # Orden actual, totales, IVA y confirmación
│       └── historial.tsx   # Historial de órdenes confirmadas por usuario
├── src/
│   ├── types/index.ts       # Interfaces TypeScript (Producto, Orden, etc.)
│   ├── data/productos.ts    # Catálogo fijo de alimentos y bebidas
│   └── context/
│       ├── AuthContext.tsx  # Sesión activa (usuario logueado)
│       └── OrdenContext.tsx # Carrito / orden en construcción
└── assets/
```

## 📄 ARCHIVOS


### 1️⃣ `src/types/index.ts`

```ts
export type Categoria = 'alimento' | 'bebida';

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: Categoria;
}

export interface ItemOrden {
  producto: Producto;
  cantidad: number;
}

export interface ItemHistorial {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

export interface OrdenHistorial {
  id: string;
  fecha: string; // ISO 8601
  usuario: string; // usuario dueño de la orden, para filtrar el historial por sesión
  items: ItemHistorial[];
  subtotal: number;
  iva: number;
  total: number;
}
```

### 2️⃣ `src/data/productos.ts`

```ts

import { Producto } from '../types';

// Catálogo fijo del restaurante. Precios reales, no editables por el cliente.
// 10 alimentos y 5 bebidas 
export const PRODUCTOS: Producto[] = [
  // ---------- ALIMENTOS ----------
  {
    id: 'a1',
    nombre: 'Tacos de Pastor (3 pzas)',
    precio: 4.5,
    imagen: 'https://comedera.com/wp-content/uploads/sites/9/2017/08/tacos-al-pastor-receta.jpg?fit=1316,838&crop=0px,49px,1316px,740px',
    categoria: 'alimento',
  },
  {
    id: 'a2',
    nombre: 'Quesadilla de Queso',
    precio: 3.25,
    imagen: 'https://marubotana.tv/uploads/responsive/2026/03/quesadillas-mexicanas-1200.webp',
    categoria: 'alimento',
  },
  {
    id: 'a3',
    nombre: 'Burrito de Res',
    precio: 5.75,
    imagen: 'https://rumbameats.com/wp-content/uploads/2025/11/Thai-Beef-Cheek-Burritos.jpg',
    categoria: 'alimento',
  },
  {
    id: 'a4',
    nombre: 'Enchiladas Verdes',
    precio: 6.0,
    imagen: 'https://www.cocinadelirante.com/800x600/filters:format(webp):quality(75)/sites/default/files/images/2018/09/receta-facil-de-salsa-verde-para-enchilada.jpg',
    categoria: 'alimento',
  },
  {
    id: 'a5',
    nombre: 'Nachos con Queso',
    precio: 4.25,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhnW7QMh0dqaBOqsOxXNezLkUcFlbRXb5jjB9_5x6zCP0f6OHbTwbC4C4&s=10',
    categoria: 'alimento',
  },
  {
    id: 'a6',
    nombre: 'Tostadas de Tinga',
    precio: 4.75,
    imagen: 'https://www.mylatinatable.com/wp-content/uploads/2018/09/foto-h-480x270.jpg',
    categoria: 'alimento',
  },
  {
    id: 'a7',
    nombre: 'Chiles Rellenos',
    precio: 6.5,
    imagen: 'https://www.incredibleegg.org/wp-content/uploads/2025/05/m-chiles-rellenos.webp',
    categoria: 'alimento',
  },
  {
    id: 'a8',
    nombre: 'Tamal de Elote',
    precio: 2.5,
    imagen: 'https://cdn-pro.elsalvador.com/wp-content/uploads/2025/08/vida-gastronomia-tamal-elote-04.jpg',
    categoria: 'alimento',
  },
  {
    id: 'a9',
    nombre: 'Torta de Milanesa',
    precio: 5.5,
    imagen: 'https://cdn7.kiwilimon.com/recetaimagen/41122/400x400/55631.jpg.webp',
    categoria: 'alimento',
  },
  {
    id: 'a10',
    nombre: 'Sopa de Tortilla',
    precio: 4.0,
    imagen: 'https://laroussecocina.mx/wp-content/uploads/2020/01/SOPA-DE-TORTILLA.jpg',
    categoria: 'alimento',
  },

  // ---------- BEBIDAS ----------
  {
    id: 'b1',
    nombre: 'Agua de Horchata',
    precio: 2.0,
    imagen: 'https://greenhealthycooking.com/wp-content/uploads/2019/05/Agua-de-Horchata-2.jpg',
    categoria: 'bebida',
  },
  {
    id: 'b2',
    nombre: 'Agua de Jamaica',
    precio: 2.0,
    imagen: 'https://images.recetasmexas.com/images/recipes/1770327909109-xt9c6j.webp',
    categoria: 'bebida',
  },
  {
    id: 'b3',
    nombre: 'Refresco de Tamarindo',
    precio: 2.25,
    imagen: 'https://jameaperu.com/assets/images/2025/11/refresco-de-tamarindo_300x200.webp',
    categoria: 'bebida',
  },
  {
    id: 'b4',
    nombre: 'Limonada con Chía',
    precio: 2.5,
    imagen: 'https://cdn7.kiwilimon.com/recetaimagen/31781/640x640/36560.jpg.webp',
    categoria: 'bebida',
  },
  {
    id: 'b5',
    nombre: 'Café de Olla',
    precio: 2.75,
    imagen: 'https://cdn.shopify.com/s/files/1/0022/7409/9299/files/1_27ad9112-f891-4040-b308-98ea9dc4803f.jpg?v=1742337321',
    categoria: 'bebida',
  },
];

// Reglas de validación de cantidad, usadas por el catálogo y el contexto de orden.
export const CANTIDAD_MINIMA = 1;
export const CANTIDAD_MAXIMA = 20;
export const IVA_PORCENTAJE = 0.13;
```

### 3️⃣ `src/context/AuthContext.tsx`

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  usuarioActual: string | null;
  iniciarSesion: (usuario: string) => void;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioActual, setUsuarioActual] = useState<string | null>(null);

  const iniciarSesion = (usuario: string): void => {
    setUsuarioActual(usuario);
  };

  const cerrarSesion = (): void => {
    setUsuarioActual(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioActual, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return contexto;
}
```

### 4️⃣ `src/context/OrdenContext.tsx`

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ItemOrden, Producto } from '../types';
import { CANTIDAD_MAXIMA, CANTIDAD_MINIMA } from '../data/productos';

interface OrdenContextType {
  items: ItemOrden[];
  agregarProducto: (producto: Producto, cantidad: number) => string | null; // retorna mensaje de error o null si fue exitoso
  eliminarProducto: (productoId: string) => void;
  limpiarOrden: () => void;
}

const OrdenContext = createContext<OrdenContextType | undefined>(undefined);

export function OrdenProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemOrden[]>([]);

  // Agrega un producto a la orden validando cantidad y límites.
  // Si el producto ya existe en la orden, suma la cantidad (sin exceder el máximo).
  const agregarProducto = (producto: Producto, cantidad: number): string | null => {
    if (!producto.nombre || !producto.precio || producto.precio <= 0) {
      return 'Este producto no tiene un precio válido.';
    }
    if (!Number.isInteger(cantidad) || cantidad < CANTIDAD_MINIMA) {
      return 'Selecciona al menos 1 unidad para agregar el producto.';
    }
    if (cantidad > CANTIDAD_MAXIMA) {
      return `La cantidad máxima permitida por producto es ${CANTIDAD_MAXIMA}.`;
    }

    setItems((prev) => {
      const existente = prev.find((it) => it.producto.id === producto.id);
      if (existente) {
        const nuevaCantidad = Math.min(existente.cantidad + cantidad, CANTIDAD_MAXIMA);
        return prev.map((it) =>
          it.producto.id === producto.id ? { ...it, cantidad: nuevaCantidad } : it
        );
      }
      return [...prev, { producto, cantidad }];
    });

    return null;
  };

  const eliminarProducto = (productoId: string): void => {
    setItems((prev) => prev.filter((it) => it.producto.id !== productoId));
  };

  const limpiarOrden = (): void => {
    setItems([]);
  };

  return (
    <OrdenContext.Provider value={{ items, agregarProducto, eliminarProducto, limpiarOrden }}>
      {children}
    </OrdenContext.Provider>
  );
}

export function useOrden(): OrdenContextType {
  const contexto = useContext(OrdenContext);
  if (!contexto) {
    throw new Error('useOrden debe usarse dentro de un OrdenProvider');
  }
  return contexto;
}
```

### 5️⃣ `app/_layout.tsx`

```tsx
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
```

### 6️⃣ `app/index.tsx`

```tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

// Usuario y contraseña definidos en variables locales
const USUARIOS_VALIDOS = [
  { usuario: 'cliente', password: '1234' },
  { usuario: 'admin', password: 'admin123' },
];

export default function Login() {
  const router = useRouter();
  const { iniciarSesion: guardarUsuarioSesion } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const iniciarSesion = () => {
    if (!usuario.trim() || !password.trim()) {
      setError('Ingresa tu usuario y contraseña.');
      return;
    }

    const encontrado = USUARIOS_VALIDOS.find(
      (u) => u.usuario === usuario.trim() && u.password === password
    );

    if (!encontrado) {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    setError('');
    guardarUsuarioSesion(encontrado.usuario);
    router.replace('/main/catalogo');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.emoji}>🌮</Text>
        <Text style={styles.titulo}>El Buen Sabor</Text>
        <Text style={styles.subtitulo}>Comida mexicana a tu mesa</Text>

        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="cliente"
          value={usuario}
          onChangeText={(v) => {
            setUsuario(v);
            setError('');
          }}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setError('');
          }}
          secureTextEntry
        />

        {error !== '' && <Text style={styles.errorText}>⚠ {error}</Text>}

        <TouchableOpacity style={styles.btnPrimario} onPress={iniciarSesion}>
          <Text style={styles.btnPrimarioText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.ayuda}>Usuario de prueba: cliente / 1234</Text>
        <Text style={styles.ayuda}>Usuario de prueba: admin / admin123</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff4e6', justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  emoji: { fontSize: 40, textAlign: 'center', marginBottom: 4 },
  titulo: { fontSize: 26, fontWeight: '800', color: '#7a2e0e', textAlign: 'center' },
  subtitulo: { fontSize: 13, color: '#8a6a5a', textAlign: 'center', marginBottom: 24 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8a6a5a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff4e6',
    borderWidth: 1.5,
    borderColor: '#f0d9c4',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 6,
  },
  errorText: { color: '#c0392b', fontSize: 13, marginTop: 6 },
  btnPrimario: {
    backgroundColor: '#e85d2c',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  btnPrimarioText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  ayuda: { textAlign: 'center', color: '#8a6a5a', fontSize: 11, marginTop: 14 },
});
```

### 7️⃣ `app/main/_layout.tsx`

```tsx
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
```

### 8️⃣ `app/main/catalogo.tsx`

```tsx
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
```

### 9️⃣ `app/main/orden.tsx`

```tsx
import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useOrden } from '../../src/context/OrdenContext';
import { useAuth } from '../../src/context/AuthContext';
import { IVA_PORCENTAJE } from '../../src/data/productos';
import { ItemHistorial, OrdenHistorial } from '../../src/types';

export default function Orden() {
  const router = useRouter();
  const { items, eliminarProducto, limpiarOrden } = useOrden();
  const { usuarioActual } = useAuth();
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
          if (!usuarioActual) {
            router.replace('/');
            return;
          }

          const itemsHistorial: ItemHistorial[] = items.map((it) => ({
            nombre: it.producto.nombre,
            cantidad: it.cantidad,
            precioUnitario: it.producto.precio,
          }));

          const nuevaOrden: OrdenHistorial = {
            id: Date.now().toString(),
            fecha: new Date().toISOString(),
            usuario: usuarioActual,
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
```

### 🔟 `app/main/historial.tsx`

```tsx
import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { OrdenHistorial } from '../../src/types';
import { useAuth } from '../../src/context/AuthContext';

export default function Historial() {
  const { usuarioActual } = useAuth();
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
    // Cada usuario solo ve sus propias órdenes.
    const misOrdenes = historial.filter((o) => o.usuario === usuarioActual);
    // Ya se guardan del más reciente al más antiguo (prepend al confirmar).
    setOrdenes(misOrdenes);
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
```

### 1️⃣1️⃣ `package.json`

```json
{
  "name": "desafio2",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "dependencies": {
    "@react-native-async-storage/async-storage": "2.2.0",
    "expo": "~57.0.21",
    "expo-constants": "~57.0.17",
    "expo-linking": "~57.0.9",
    "expo-router": "~57.0.20",
    "expo-status-bar": "~57.0.1",
    "react": "19.2.3",
    "react-native": "0.86.3",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "private": true
}
```

### 1️⃣2️⃣ `app.json`

```json
{
  "expo": {
    "name": "desafio2",
    "slug": "desafio2",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-status-bar"
    ]
  }
}
```



---

## 🚀 Instalación local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/joaquin-09/Desafio2_DPS.git
   cd Desafio2_DPS/desafio2
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Ejecutar en modo desarrollo:
   ```bash
   npx expo start
   ```

4. Escanear el código QR con la app **Expo Go**, o presionar `a` para abrirlo en el emulador de Android.

## 👤 Usuario de prueba

- Usuario: `cliente` — Contraseña: `1234`
- Usuario: `admin` — Contraseña: `admin123`

## 👤 Autor

**Joaquín Eduardo Morán Mejía** — Carné: MM230272
Universidad Don Bosco