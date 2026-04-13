// Persistent PostgreSQL database using Neon serverless driver
// Data is stored in Neon cloud PostgreSQL and survives deployments/restarts
// NEVER run scripts/check-schema.mjs — it DROPS all tables and deletes all data!

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('Missing database connection string. Set DATABASE_URL_UNPOOLED, POSTGRES_URL, or DATABASE_URL in your environment.');
}

const sql = neon(DATABASE_URL);

// Retry wrapper for Neon cold starts — verifies write success
async function withRetry<T>(fn: () => Promise<T>, retries = 5, delay = 3000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      console.error(`[DB] Attempt ${i + 1}/${retries} failed:`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
  throw new Error('All retries failed');
}

// Ensure tables exist — called on EVERY request (IF NOT EXISTS is cheap/safe)
// No globalThis caching — avoids cold start bugs where flag resets but tables exist
async function ensureSchema() {
  await sql`SELECT 1`; // wake up Neon compute

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      description TEXT NOT NULL,
      images TEXT DEFAULT '[]',
      image_url TEXT DEFAULT '',
      stock INTEGER DEFAULT 100,
      created_at TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      items TEXT NOT NULL,
      total_amount DOUBLE PRECISION NOT NULL,
      status TEXT DEFAULT 'pending',
      status_message TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_notifications_phone ON notifications(customer_phone)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_notifications_order ON notifications(order_id)`;

  // Seed demo products ONLY if table is truly empty (first time ever)
  const countResult = await sql`SELECT COUNT(*) as cnt FROM products`;
  if (parseInt(countResult[0].cnt) === 0) {
    const now = new Date().toISOString();
    const demos = [
      { id: '1', name: 'Fresh Organic Milk', price: 65, desc: 'Farm-fresh organic whole milk, 1 liter. Rich in calcium and protein.', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', stock: 50 },
      { id: '2', name: 'Whole Wheat Bread', price: 45, desc: 'Freshly baked whole wheat bread, perfect for breakfast and sandwiches.', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', stock: 100 },
      { id: '3', name: 'Free Range Eggs (12 pcs)', price: 120, desc: 'Premium free-range eggs from local farms. Pack of 12.', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', stock: 75 },
      { id: '4', name: 'Basmati Rice (5kg)', price: 350, desc: 'Premium aged basmati rice, long grain. Perfect for biryani and pulao.', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', stock: 40 },
      { id: '5', name: 'Fresh Tomatoes (1kg)', price: 30, desc: 'Locally sourced ripe tomatoes, perfect for cooking and salads.', img: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400', stock: 200 },
      { id: '6', name: 'Cooking Oil (1L)', price: 180, desc: 'Pure refined soybean cooking oil for everyday use.', img: 'https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=400', stock: 60 },
    ];
    for (const p of demos) {
      await sql`INSERT INTO products (id, name, price, description, images, image_url, stock, created_at) VALUES (${p.id}, ${p.name}, ${p.price}, ${p.desc}, ${JSON.stringify([p.img])}, ${p.img}, ${p.stock}, ${now}) ON CONFLICT (id) DO NOTHING`;
    }
    console.log('[DB] Seeded demo products');
  }
}

// Helper to parse JSON fields
function parseProduct(row: any) {
  if (!row) return null;
  const images = typeof row.images === 'string' ? JSON.parse(row.images || '[]') : (row.images || []);
  return { ...row, images };
}
function parseOrder(row: any) {
  if (!row) return null;
  const items = typeof row.items === 'string' ? JSON.parse(row.items || '[]') : (row.items || []);
  return { ...row, items };
}

// --- Product operations ---

export async function getProducts() {
  return withRetry(async () => {
    await ensureSchema();
    const rows = await sql`SELECT id, name, price, description, images, image_url, stock, created_at FROM products ORDER BY created_at DESC`;
    return rows.map((row: any) => parseProduct(row));
  });
}

export async function getProductById(id: string) {
  return withRetry(async () => {
    await ensureSchema();
    const rows = await sql`SELECT * FROM products WHERE id = ${id}`;
    return parseProduct(rows[0] || null);
  });
}

export async function createProduct(
  name: string,
  price: number,
  description: string,
  images: string[],
  stock: number
) {
  return withRetry(async () => {
    await ensureSchema();
    const id = String(Date.now());
    const imageList = images || [];
    const now = new Date().toISOString();
    await sql`INSERT INTO products (id, name, price, description, images, image_url, stock, created_at) VALUES (${id}, ${name}, ${price}, ${description}, ${JSON.stringify(imageList)}, ${imageList[0] || ''}, ${stock}, ${now})`;

    // VERIFY the write actually persisted
    const verify = await sql`SELECT id FROM products WHERE id = ${id}`;
    if (verify.length === 0) {
      throw new Error(`Product write verification failed for id=${id}`);
    }

    console.log(`[DB] Product created & verified: id=${id}, name=${name}`);
    return {
      id, name, price, description,
      images: imageList,
      image_url: imageList[0] || '',
      stock,
      created_at: now,
    };
  });
}

export async function updateProduct(
  id: string,
  name: string,
  price: number,
  description: string,
  images: string[],
  stock: number
) {
  return withRetry(async () => {
    await ensureSchema();
    const existingRows = await sql`SELECT * FROM products WHERE id = ${id}`;
    const existing = existingRows[0];
    if (!existing) return null;

    const newImages = images && images.length > 0 ? images : (typeof existing.images === 'string' ? JSON.parse(existing.images || '[]') : (existing.images || []));
    await sql`UPDATE products SET name = ${name}, price = ${price}, description = ${description}, images = ${JSON.stringify(newImages)}, image_url = ${newImages[0] || ''}, stock = ${stock} WHERE id = ${id}`;

    return {
      id, name, price, description,
      images: newImages,
      image_url: newImages[0] || '',
      stock,
      created_at: existing.created_at,
    };
  });
}

export async function deleteProduct(id: string) {
  return withRetry(async () => {
    await ensureSchema();
    const existingRows = await sql`SELECT * FROM products WHERE id = ${id}`;
    const existing = existingRows[0];
    if (!existing) return null;
    await sql`DELETE FROM products WHERE id = ${id}`;
    return parseProduct(existing);
  });
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
  return withRetry(async () => {
    await ensureSchema();
    const id = String(Date.now());
    const orderNumber = `ORD-${Date.now()}`;
    const now = new Date().toISOString();
    await sql`INSERT INTO orders (id, order_number, customer_name, customer_phone, customer_address, items, total_amount, status, status_message, created_at, updated_at) VALUES (${id}, ${orderNumber}, ${customerName}, ${customerPhone}, ${customerAddress}, ${JSON.stringify(items)}, ${totalAmount}, ${status}, ${''}, ${now}, ${now})`;
    console.log(`[DB] Order created: id=${id}, order_number=${orderNumber}, phone=${customerPhone}`);
    return {
      id, order_number: orderNumber,
      customer_name: customerName, customer_phone: customerPhone,
      customer_address: customerAddress,
      items, total_amount: totalAmount,
      status, status_message: '',
      created_at: now, updated_at: now,
    };
  });
}

export async function getOrderById(id: string) {
  return withRetry(async () => {
    await ensureSchema();
    const rows = await sql`SELECT * FROM orders WHERE id = ${id}`;
    return parseOrder(rows[0] || null);
  });
}

export async function getOrders(limit: number = 100) {
  return withRetry(async () => {
    await ensureSchema();
    const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT ${limit}`;
    return rows.map(parseOrder);
  });
}

export async function getOrdersByPhone(phone: string) {
  return withRetry(async () => {
    await ensureSchema();
    const rows = await sql`SELECT * FROM orders WHERE customer_phone = ${phone} ORDER BY created_at DESC`;
    return rows.map(parseOrder);
  });
}

export async function updateOrderStatus(id: string, status: string) {
  return withRetry(async () => {
    await ensureSchema();
    const existingRows = await sql`SELECT * FROM orders WHERE id = ${id}`;
    const existing = existingRows[0];
    if (!existing) return null;

    const statusMessages: Record<string, string> = {
      confirmed: '✅ Your order has been approved and confirmed! It will be processed soon.',
      shipped: '🚚 Your order has been shipped! It is on the way to your address.',
      delivered: '📦 Your order has been delivered! Thank you for shopping with us.',
      cancelled: '❌ Your order has been cancelled. Please contact support for details.',
    };

    const message = statusMessages[status] || `Order status updated to: ${status}`;
    const now = new Date().toISOString();

    await sql`UPDATE orders SET status = ${status}, status_message = ${message}, updated_at = ${now} WHERE id = ${id}`;

    // Create notification
    const notifId = `notif-${Date.now()}`;
    await sql`INSERT INTO notifications (id, order_id, customer_phone, message, is_read, created_at) VALUES (${notifId}, ${id}, ${existing.customer_phone}, ${message}, ${0}, ${now})`;

    return {
      ...parseOrder(existing),
      status, status_message: message, updated_at: now,
    };
  });
}

// --- Notification operations ---

export async function getNotificationsByPhone(phone: string) {
  return withRetry(async () => {
    await ensureSchema();
    return await sql`SELECT n.*, o.order_number FROM notifications n LEFT JOIN orders o ON n.order_id = o.id WHERE n.customer_phone = ${phone} ORDER BY n.created_at DESC`;
  });
}

export async function getNotificationsByOrderId(orderId: string) {
  return withRetry(async () => {
    await ensureSchema();
    return await sql`SELECT * FROM notifications WHERE order_id = ${orderId} ORDER BY created_at DESC`;
  });
}

export async function markNotificationsRead(phone: string) {
  await ensureSchema();
  await sql`UPDATE notifications SET is_read = 1 WHERE customer_phone = ${phone}`;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === (process.env.ADMIN_PASSWORD || 'admin');
}
