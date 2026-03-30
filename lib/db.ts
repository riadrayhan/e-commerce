// Persistent data store
// Uses JSON files on disk for reliable local development
// Uses Upstash Redis in production (via UPSTASH_REDIS_REST_URL env var)

import { Redis } from '@upstash/redis';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const demoProducts = [
  { id: '1', name: 'Fresh Organic Milk', price: 65, description: 'Farm-fresh organic whole milk, 1 liter. Rich in calcium and protein.', images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'], image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', stock: 50, created_at: '2026-03-25T10:00:00.000Z' },
  { id: '2', name: 'Whole Wheat Bread', price: 45, description: 'Freshly baked whole wheat bread, perfect for breakfast and sandwiches.', images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'], image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', stock: 100, created_at: '2026-03-25T10:01:00.000Z' },
  { id: '3', name: 'Free Range Eggs (12 pcs)', price: 120, description: 'Premium free-range eggs from local farms. Pack of 12.', images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'], image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', stock: 75, created_at: '2026-03-25T10:02:00.000Z' },
  { id: '4', name: 'Basmati Rice (5kg)', price: 350, description: 'Premium aged basmati rice, long grain. Perfect for biryani and pulao.', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'], image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', stock: 40, created_at: '2026-03-25T10:03:00.000Z' },
  { id: '5', name: 'Fresh Tomatoes (1kg)', price: 30, description: 'Locally sourced ripe tomatoes, perfect for cooking and salads.', images: ['https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400'], image_url: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400', stock: 200, created_at: '2026-03-25T10:04:00.000Z' },
  { id: '6', name: 'Cooking Oil (1L)', price: 180, description: 'Pure refined soybean cooking oil for everyday use.', images: ['https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=400'], image_url: 'https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=400', stock: 60, created_at: '2026-03-25T10:05:00.000Z' },
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

// --- JSON File-based persistent storage for local development ---
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile(filePath: string, defaultData: any[] = []): any[] {
  try {
    if (existsSync(filePath)) {
      const raw = readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : defaultData;
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultData;
}

function writeJsonFile(filePath: string, data: any[]) {
  try {
    ensureDataDir();
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Initialize data files if they don't exist
function initDataFiles() {
  ensureDataDir();
  if (!existsSync(PRODUCTS_FILE)) {
    writeJsonFile(PRODUCTS_FILE, demoProducts);
  }
  if (!existsSync(ORDERS_FILE)) {
    writeJsonFile(ORDERS_FILE, []);
  }
}

initDataFiles();

async function loadProducts(): Promise<any[]> {
  if (USE_REDIS) {
    const data = await getRedis().get<any[]>('products');
    if (!data) {
      await getRedis().set('products', demoProducts);
      return [...demoProducts];
    }
    return data;
  }
  return readJsonFile(PRODUCTS_FILE, demoProducts);
}

async function saveProducts(products: any[]) {
  if (USE_REDIS) {
    await getRedis().set('products', products);
  } else {
    writeJsonFile(PRODUCTS_FILE, products);
  }
}

async function loadOrders(): Promise<any[]> {
  if (USE_REDIS) {
    const data = await getRedis().get<any[]>('orders');
    return data || [];
  }
  return readJsonFile(ORDERS_FILE, []);
}

async function saveOrders(orders: any[]) {
  if (USE_REDIS) {
    await getRedis().set('orders', orders);
  } else {
    writeJsonFile(ORDERS_FILE, orders);
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
  images: string[],
  stock: number
) {
  const products = await loadProducts();
  const product = {
    id: String(Date.now()),
    name,
    price,
    description,
    images: images || [],
    image_url: images?.[0] || '',
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
  images: string[],
  stock: number
) {
  const products = await loadProducts();
  const index = products.findIndex((p: any) => p.id === id);
  if (index === -1) return null;
  const existingImages = products[index].images || (products[index].image_url ? [products[index].image_url] : []);
  const newImages = images && images.length > 0 ? images : existingImages;
  products[index] = {
    ...products[index],
    name,
    price,
    description,
    images: newImages,
    image_url: newImages[0] || '',
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
