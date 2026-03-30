// Persistent data store
// Uses Upstash Redis in production (via UPSTASH_REDIS_REST_URL env var)
// Falls back to in-memory storage for local development

import { Redis } from '@upstash/redis';

const demoProducts = [
  { id: '1', name: 'Fresh Organic Milk', price: 65, description: 'Farm-fresh organic whole milk, 1 liter. Rich in calcium and protein.', image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', stock: 50, created_at: '2026-03-25T10:00:00.000Z' },
  { id: '2', name: 'Whole Wheat Bread', price: 45, description: 'Freshly baked whole wheat bread, perfect for breakfast and sandwiches.', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', stock: 100, created_at: '2026-03-25T10:01:00.000Z' },
  { id: '3', name: 'Free Range Eggs (12 pcs)', price: 120, description: 'Premium free-range eggs from local farms. Pack of 12.', image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', stock: 75, created_at: '2026-03-25T10:02:00.000Z' },
  { id: '4', name: 'Basmati Rice (5kg)', price: 350, description: 'Premium aged basmati rice, long grain. Perfect for biryani and pulao.', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', stock: 40, created_at: '2026-03-25T10:03:00.000Z' },
  { id: '5', name: 'Fresh Tomatoes (1kg)', price: 30, description: 'Locally sourced ripe tomatoes, perfect for cooking and salads.', image_url: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400', stock: 200, created_at: '2026-03-25T10:04:00.000Z' },
  { id: '6', name: 'Cooking Oil (1L)', price: 180, description: 'Pure refined soybean cooking oil for everyday use.', image_url: 'https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=400', stock: 60, created_at: '2026-03-25T10:05:00.000Z' },
];

// --- Storage layer ---
const USE_REDIS = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

let redis: Redis | null = null;
function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

// In-memory fallback for local development
const globalStore = globalThis as any;
if (!globalStore.__products) globalStore.__products = [...demoProducts];
if (!globalStore.__orders) globalStore.__orders = [];

async function loadProducts(): Promise<any[]> {
  if (USE_REDIS) {
    const data = await getRedis().get<any[]>('products');
    if (!data) {
      await getRedis().set('products', demoProducts);
      return [...demoProducts];
    }
    return data;
  }
  return globalStore.__products;
}

async function saveProducts(products: any[]) {
  if (USE_REDIS) {
    await getRedis().set('products', products);
  } else {
    globalStore.__products = products;
  }
}

async function loadOrders(): Promise<any[]> {
  if (USE_REDIS) {
    const data = await getRedis().get<any[]>('orders');
    return data || [];
  }
  return globalStore.__orders;
}

async function saveOrders(orders: any[]) {
  if (USE_REDIS) {
    await getRedis().set('orders', orders);
  } else {
    globalStore.__orders = orders;
  }
}

// Product operations
export async function getProducts() {
  const products = await loadProducts();
  return products.filter((p: any) => p.stock > 0);
}

export async function getProductById(id: string) {
  const products = await loadProducts();
  return products.find((p: any) => p.id === id);
}

export async function createProduct(
  name: string,
  price: number,
  description: string,
  imageData: any,
  stock: number
) {
  const products = await loadProducts();
  const product = {
    id: String(Date.now()),
    name,
    price,
    description,
    image_url: typeof imageData === 'string' ? imageData : '',
    stock,
    created_at: new Date().toISOString(),
  };
  products.unshift(product);
  await saveProducts(products);
  return product;
}

export async function updateProduct(
  id: string,
  name: string,
  price: number,
  description: string,
  imageData: any,
  stock: number
) {
  const products = await loadProducts();
  const index = products.findIndex((p: any) => p.id === id);
  if (index === -1) return null;
  products[index] = {
    ...products[index],
    name,
    price,
    description,
    image_url: typeof imageData === 'string' && imageData ? imageData : products[index].image_url,
    stock,
  };
  await saveProducts(products);
  return products[index];
}

export async function deleteProduct(id: string) {
  const products = await loadProducts();
  const index = products.findIndex((p: any) => p.id === id);
  if (index === -1) return null;
  const deleted = products.splice(index, 1);
  await saveProducts(products);
  return deleted[0];
}

// Order operations
export async function createOrder(
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  items: Array<{ productId: string; quantity: number; price: number }>,
  totalAmount: number,
  status: string = 'pending'
) {
  const orders = await loadOrders();
  const order = {
    id: String(Date.now()),
    order_number: `ORD-${Date.now()}`,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_address: customerAddress,
    items,
    total_amount: totalAmount,
    status,
    created_at: new Date().toISOString(),
  };
  orders.unshift(order);
  await saveOrders(orders);
  return order;
}

export async function getOrderById(id: string) {
  const orders = await loadOrders();
  return orders.find((o: any) => o.id === id);
}

export async function getOrders(limit: number = 50) {
  const orders = await loadOrders();
  return orders.slice(0, limit);
}

export async function updateOrderStatus(id: string, status: string) {
  const orders = await loadOrders();
  const index = orders.findIndex((o: any) => o.id === id);
  if (index === -1) return null;
  orders[index].status = status;
  orders[index].updated_at = new Date().toISOString();
  await saveOrders(orders);
  return orders[index];
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === (process.env.ADMIN_PASSWORD || 'admin');
}
