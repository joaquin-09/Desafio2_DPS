
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
