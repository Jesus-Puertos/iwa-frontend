import { apiFetch } from './client';

const DEMO_MODE = true;

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string | null;
  price: number;
}

// Estructura REAL del backend
export interface ProductPagedResources {
  data: { content: Product[]; size: number };
  page: { number: number; size: number };
  totalElements: number;
}

const MOCK: Product[] = [
  { id: 1, sku: 'PROD-001', name: 'Laptop Dell Latitude', description: 'Core i5, 8GB RAM, 256GB SSD', price: 18999.99 },
  { id: 2, sku: 'PROD-002', name: 'Monitor LG 24"',       description: 'Full HD IPS 75Hz',              price: 2899.00 },
  { id: 3, sku: 'PROD-003', name: 'Teclado mecánico',     description: 'Switch red, retroiluminado',    price: 1250.50 },
  { id: 4, sku: 'PROD-004', name: 'Mouse inalámbrico',    description: null,                            price: 499.00 },
  { id: 5, sku: 'PROD-005', name: 'Webcam 1080p',         description: 'Con micrófono integrado',       price: 899.99 },
];

export async function getProducts(page = 0, size = 20): Promise<ProductPagedResources> {
  if (DEMO_MODE) {
    const start = page * size;
    const content = MOCK.slice(start, start + size);
    return {
      data: { content, size: content.length },
      page: { number: page, size },
      totalElements: MOCK.length,
    };
  }
  return apiFetch<ProductPagedResources>(`/products?page=${page}&size=${size}`);
}

export async function getProduct(id: number): Promise<Product> {
  if (DEMO_MODE) {
    const p = MOCK.find(x => x.id === id);
    if (!p) throw new Error('Producto no encontrado (demo)');
    return p;
  }
  return apiFetch<Product>(`/products/${id}`);
}