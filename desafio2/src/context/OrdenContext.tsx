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
