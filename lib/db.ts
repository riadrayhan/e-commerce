// Neon PostgreSQL database for Vercel deployment
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

let _sql: NeonQueryFunction<false, false> | null = null;

function getSql() {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL_UNPOOLED!);
  }
  return _sql;
}

let _initialized = false;

async function ensureTables() {
  if (_initialized) return;

  await getSql()`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      description TEXT NOT NULL,
      images TEXT DEFAULT '[]',
      image_url TEXT DEFAULT '',
      stock INTEGER DEFAULT 100,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await getSql()`
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
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await getSql()`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await getSql()`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
  await getSql()`CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone)`;
  await getSql()`CREATE INDEX IF NOT EXISTS idx_notifications_phone ON notifications(customer_phone)`;
  await getSql()`CREATE INDEX IF NOT EXISTS idx_notifications_order ON notifications(order_id)`;

  // Seed demo products if empty
  const countResult = await getSql()`SELECT COUNT(*) as count FROM products`;
  if (Number(countResult[0].count) === 0) {
    const demoProducts = [
      { id: '1', name: 'Fresh Organic Milk', price: 65, description: 'Farm-fresh organic whole milk, 1 liter. Rich in calcium and protein.', images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'], stock: 50 },
      { id: '2', name: 'Whole Wheat Bread', price: 45, description: 'Freshly baked whole wheat bread, perfect for breakfast and sandwiches.', images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'], stock: 100 },
      { id: '3', name: 'Free Range Eggs (12 pcs)', price: 120, description: 'Premium free-range eggs from local farms. Pack of 12.', images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'], stock: 75 },
      { id: '4', name: 'Basmati Rice (5kg)', price: 350, description: 'Premium aged basmati rice, long grain. Perfect for biryani and pulao.', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'], stock: 40 },
      { id: '5', name: 'Fresh Tomatoes (1kg)', price: 30, description: 'Locally sourced ripe tomatoes, perfect for cooking and salads.', images: ['https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400'], stock: 200 },
      { id: '6', name: 'Cooking Oil (1L)', price: 180, description: 'Pure refined soybean cooking oil for everyday use.', images: ['https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=400'], stock: 60 },
    ];
    for (const p of demoProducts) {
      await getSql()`INSERT INTO products (id, name, price, description, images, image_url, stock, created_at)
        VALUES (${p.id}, ${p.name}, ${p.price}, ${p.description}, ${JSON.stringify(p.images)}, ${p.images[0]}, ${p.stock}, NOW())`;
    }
  }
  _initialized = true;
}

// --- Product operations ---

export async function getProducts() {
  await ensureTables();
  const rows = await getSql()`SELECT * FROM products WHERE stock > 0 ORDER BY created_at DESC`;
  return rows.map(parseProduct);
}

export async function getProductById(id: string) {
  await ensureTables();
  const rows = await getSql()`SELECT * FROM products WHERE id::text = ${id}`;
  return rows[0] ? parseProduct(rows[0]) : null;
}

export async function createProduct(
  name: string,
  price: number,
  description: string,
  images: string[],
  stock: number
) {
  await ensureTables();
  const id = String(Date.now());
  const imageList = images || [];
  const now = new Date().toISOString();
  await getSql()`INSERT INTO products (id, name, price, description, images, image_url, stock, created_at)
    VALUES (${id}, ${name}, ${price}, ${description}, ${JSON.stringify(imageList)}, ${imageList[0] || ''}, ${stock}, ${now})`;
  return { id, name, price, description, images: imageList, image_url: imageList[0] || '', stock, created_at: now };
}

export async function updateProduct(
  id: string,
  name: string,
  price: number,
  description: string,
  images: string[],
  stock: number
) {
  await ensureTables();
  const existing = await getSql()`SELECT * FROM products WHERE id::text = ${id}`;
  if (!existing[0]) return null;

  const existingImages = safeJsonParse(existing[0].images as string, existing[0].image_url ? [existing[0].image_url as string] : []);
  const newImages = images && images.length > 0 ? images : existingImages;

  await getSql()`UPDATE products SET name = ${name}, price = ${price}, description = ${description},
    images = ${JSON.stringify(newImages)}, image_url = ${newImages[0] || ''}, stock = ${stock} WHERE id::text = ${id}`;

  return { id, name, price, description, images: newImages, image_url: newImages[0] || '', stock, created_at: existing[0].created_at };
}

export async function deleteProduct(id: string) {
  await ensureTables();
  const existing = await getSql()`SELECT * FROM products WHERE id::text = ${id}`;
  if (!existing[0]) return null;
  await getSql()`DELETE FROM products WHERE id::text = ${id}`;
  return parseProduct(existing[0]);
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
  await ensureTables();
  const id = String(Date.now());
  const orderNumber = `ORD-${Date.now()}`;
  const now = new Date().toISOString();

  await getSql()`INSERT INTO orders (id, order_number, customer_name, customer_phone, customer_address, items, total_amount, status, created_at, updated_at)
    VALUES (${id}, ${orderNumber}, ${customerName}, ${customerPhone}, ${customerAddress}, ${JSON.stringify(items)}, ${totalAmount}, ${status}, ${now}, ${now})`;

  return {
    id, order_number: orderNumber, customer_name: customerName, customer_phone: customerPhone,
    customer_address: customerAddress, items, total_amount: totalAmount, status, status_message: '',
    created_at: now,
  };
}

export async function getOrderById(id: string) {
  await ensureTables();
  const rows = await getSql()`SELECT * FROM orders WHERE id::text = ${id}`;
  return rows[0] ? parseOrder(rows[0]) : null;
}

export async function getOrders(limit: number = 100) {
  await ensureTables();
  const rows = await getSql()`SELECT * FROM orders ORDER BY created_at DESC LIMIT ${limit}`;
  return rows.map(parseOrder);
}

export async function getOrdersByPhone(phone: string) {
  await ensureTables();
  const rows = await getSql()`SELECT * FROM orders WHERE customer_phone = ${phone} ORDER BY created_at DESC`;
  return rows.map(parseOrder);
}

export async function updateOrderStatus(id: string, status: string) {
  await ensureTables();
  const existing = await getSql()`SELECT * FROM orders WHERE id::text = ${id}`;
  if (!existing[0]) return null;

  const statusMessages: Record<string, string> = {
    confirmed: '✅ Your order has been approved and confirmed! It will be processed soon.',
    shipped: '🚚 Your order has been shipped! It is on the way to your address.',
    delivered: '📦 Your order has been delivered! Thank you for shopping with us.',
    cancelled: '❌ Your order has been cancelled. Please contact support for details.',
  };

  const message = statusMessages[status] || `Order status updated to: ${status}`;
  const now = new Date().toISOString();

  await getSql()`UPDATE orders SET status = ${status}, status_message = ${message}, updated_at = ${now} WHERE id::text = ${id}`;

  // Create notification for the customer
  const notifId = `notif-${Date.now()}`;
  await getSql()`INSERT INTO notifications (id, order_id, customer_phone, message, created_at)
    VALUES (${notifId}, ${id}, ${existing[0].customer_phone}, ${message}, ${now})`;

  const updated = await getSql()`SELECT * FROM orders WHERE id::text = ${id}`;
  return parseOrder(updated[0]);
}

// --- Notification operations ---

export async function getNotificationsByPhone(phone: string) {
  await ensureTables();
  const rows = await getSql()`SELECT n.*, o.order_number FROM notifications n JOIN orders o ON n.order_id = o.id WHERE n.customer_phone = ${phone} ORDER BY n.created_at DESC`;
  return rows;
}

export async function getNotificationsByOrderId(orderId: string) {
  await ensureTables();
  const rows = await getSql()`SELECT * FROM notifications WHERE order_id = ${orderId} ORDER BY created_at DESC`;
  return rows;
}

export async function markNotificationsRead(phone: string) {
  await ensureTables();
  await getSql()`UPDATE notifications SET is_read = 1 WHERE customer_phone = ${phone}`;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === (process.env.ADMIN_PASSWORD || 'admin');
}

// --- Helpers ---

function safeJsonParse(str: any, fallback: any[] = []): any[] {
  if (Array.isArray(str)) return str;
  try { return JSON.parse(str); } catch { return fallback; }
}

function parseProduct(row: any) {
  const images = safeJsonParse(row.images, row.image_url ? [row.image_url] : []);
  return {
    ...row,
    id: String(row.id),
    images,
    image_url: row.image_url || images[0] || '',
  };
}

function parseOrder(row: any) {
  return {
    ...row,
    id: String(row.id),
    items: safeJsonParse(row.items, []),
    total_amount: row.total_amount,
  };
}
