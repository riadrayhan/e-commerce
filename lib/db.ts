// SQLite database for reliable storage (handles 1000+ users)
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'store.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Use globalThis to persist the DB connection across Next.js hot reloads
const globalForDb = globalThis as unknown as { __sqlite_db?: Database.Database };

function getDb(): Database.Database {
  if (!globalForDb.__sqlite_db) {
    globalForDb.__sqlite_db = new Database(DB_PATH);
    globalForDb.__sqlite_db.pragma('journal_mode = WAL');
    globalForDb.__sqlite_db.pragma('foreign_keys = ON');
    initializeDatabase(globalForDb.__sqlite_db);
  }
  return globalForDb.__sqlite_db;
}

function initializeDatabase(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      images TEXT DEFAULT '[]',
      image_url TEXT DEFAULT '',
      stock INTEGER DEFAULT 100,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      items TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      status_message TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );

    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
    CREATE INDEX IF NOT EXISTS idx_notifications_phone ON notifications(customer_phone);
    CREATE INDEX IF NOT EXISTS idx_notifications_order ON notifications(order_id);
  `);

  // Seed demo products if table is empty
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (count.count === 0) {
    const insert = db.prepare(
      'INSERT INTO products (id, name, price, description, images, image_url, stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const demoProducts = [
      { id: '1', name: 'Fresh Organic Milk', price: 65, description: 'Farm-fresh organic whole milk, 1 liter. Rich in calcium and protein.', images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'], stock: 50 },
      { id: '2', name: 'Whole Wheat Bread', price: 45, description: 'Freshly baked whole wheat bread, perfect for breakfast and sandwiches.', images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'], stock: 100 },
      { id: '3', name: 'Free Range Eggs (12 pcs)', price: 120, description: 'Premium free-range eggs from local farms. Pack of 12.', images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'], stock: 75 },
      { id: '4', name: 'Basmati Rice (5kg)', price: 350, description: 'Premium aged basmati rice, long grain. Perfect for biryani and pulao.', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'], stock: 40 },
      { id: '5', name: 'Fresh Tomatoes (1kg)', price: 30, description: 'Locally sourced ripe tomatoes, perfect for cooking and salads.', images: ['https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400'], stock: 200 },
      { id: '6', name: 'Cooking Oil (1L)', price: 180, description: 'Pure refined soybean cooking oil for everyday use.', images: ['https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=400'], stock: 60 },
    ];

    const insertMany = db.transaction((products: typeof demoProducts) => {
      for (const p of products) {
        insert.run(p.id, p.name, p.price, p.description, JSON.stringify(p.images), p.images[0], p.stock, new Date().toISOString());
      }
    });
    insertMany(demoProducts);
  }
}

// --- Product operations ---

export async function getProducts() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM products WHERE stock > 0 ORDER BY created_at DESC').all() as any[];
  return rows.map(parseProduct);
}

export async function getProductById(id: string) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
  return row ? parseProduct(row) : null;
}

export async function createProduct(
  name: string,
  price: number,
  description: string,
  images: string[],
  stock: number
) {
  const db = getDb();
  const id = String(Date.now());
  const imageList = images || [];
  db.prepare(
    'INSERT INTO products (id, name, price, description, images, image_url, stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, name, price, description, JSON.stringify(imageList), imageList[0] || '', stock, new Date().toISOString());

  return { id, name, price, description, images: imageList, image_url: imageList[0] || '', stock, created_at: new Date().toISOString() };
}

export async function updateProduct(
  id: string,
  name: string,
  price: number,
  description: string,
  images: string[],
  stock: number
) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
  if (!existing) return null;

  const existingImages = safeJsonParse(existing.images, existing.image_url ? [existing.image_url] : []);
  const newImages = images && images.length > 0 ? images : existingImages;

  db.prepare(
    'UPDATE products SET name = ?, price = ?, description = ?, images = ?, image_url = ?, stock = ? WHERE id = ?'
  ).run(name, price, description, JSON.stringify(newImages), newImages[0] || '', stock, id);

  return { id, name, price, description, images: newImages, image_url: newImages[0] || '', stock, created_at: existing.created_at };
}

export async function deleteProduct(id: string) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
  if (!existing) return null;
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return parseProduct(existing);
}

// --- Order operations ---

export async function createOrder(
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  items: Array<{ productId: string; productName?: string; quantity: number; price: number }>,
  totalAmount: number,
  status: string = 'pending'
) {
  const db = getDb();
  const id = String(Date.now());
  const orderNumber = `ORD-${Date.now()}`;

  db.prepare(
    'INSERT INTO orders (id, order_number, customer_name, customer_phone, customer_address, items, total_amount, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, orderNumber, customerName, customerPhone, customerAddress, JSON.stringify(items), totalAmount, status, new Date().toISOString(), new Date().toISOString());

  return {
    id, order_number: orderNumber, customer_name: customerName, customer_phone: customerPhone,
    customer_address: customerAddress, items, total_amount: totalAmount, status, status_message: '',
    created_at: new Date().toISOString(),
  };
}

export async function getOrderById(id: string) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
  return row ? parseOrder(row) : null;
}

export async function getOrders(limit: number = 100) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ?').all(limit) as any[];
  return rows.map(parseOrder);
}

export async function getOrdersByPhone(phone: string) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM orders WHERE customer_phone = ? ORDER BY created_at DESC').all(phone) as any[];
  return rows.map(parseOrder);
}

export async function updateOrderStatus(id: string, status: string) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
  if (!existing) return null;

  const statusMessages: Record<string, string> = {
    confirmed: '✅ Your order has been approved and confirmed! It will be processed soon.',
    shipped: '🚚 Your order has been shipped! It is on the way to your address.',
    delivered: '📦 Your order has been delivered! Thank you for shopping with us.',
    cancelled: '❌ Your order has been cancelled. Please contact support for details.',
  };

  const message = statusMessages[status] || `Order status updated to: ${status}`;

  db.prepare(
    'UPDATE orders SET status = ?, status_message = ?, updated_at = ? WHERE id = ?'
  ).run(status, message, new Date().toISOString(), id);

  // Create notification for the customer
  const notifId = `notif-${Date.now()}`;
  db.prepare(
    'INSERT INTO notifications (id, order_id, customer_phone, message, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(notifId, id, existing.customer_phone, message, new Date().toISOString());

  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
  return parseOrder(updated);
}

// --- Notification operations ---

export async function getNotificationsByPhone(phone: string) {
  const db = getDb();
  const rows = db.prepare(
    'SELECT n.*, o.order_number FROM notifications n JOIN orders o ON n.order_id = o.id WHERE n.customer_phone = ? ORDER BY n.created_at DESC'
  ).all(phone) as any[];
  return rows;
}

export async function getNotificationsByOrderId(orderId: string) {
  const db = getDb();
  const rows = db.prepare(
    'SELECT * FROM notifications WHERE order_id = ? ORDER BY created_at DESC'
  ).all(orderId) as any[];
  return rows;
}

export async function markNotificationsRead(phone: string) {
  const db = getDb();
  db.prepare('UPDATE notifications SET is_read = 1 WHERE customer_phone = ?').run(phone);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === (process.env.ADMIN_PASSWORD || 'admin');
}

// --- Helpers ---

function safeJsonParse(str: string, fallback: any[] = []): any[] {
  try { return JSON.parse(str); } catch { return fallback; }
}

function parseProduct(row: any) {
  return {
    ...row,
    images: safeJsonParse(row.images, row.image_url ? [row.image_url] : []),
  };
}

function parseOrder(row: any) {
  return {
    ...row,
    items: safeJsonParse(row.items, []),
    total_amount: row.total_amount,
  };
}
