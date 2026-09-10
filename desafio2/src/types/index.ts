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
