import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

// Parse .env.local manually
const envContent = readFileSync('.env.local', 'utf8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
}

const sql = neon(process.env.DATABASE_URL_UNPOOLED);

// Drop old tables and recreate
console.log('Dropping old tables...');
await sql`DROP TABLE IF EXISTS notifications CASCADE`;
await sql`DROP TABLE IF EXISTS orders CASCADE`;
await sql`DROP TABLE IF EXISTS products CASCADE`;
await sql`DROP TABLE IF EXISTS admin_users CASCADE`;
console.log('Old tables dropped.');

// Create new tables
console.log('Creating new tables...');
await sql`
  CREATE TABLE products (
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
await sql`
  CREATE TABLE orders (
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
await sql`
  CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;
await sql`CREATE INDEX idx_orders_status ON orders(status)`;
await sql`CREATE INDEX idx_orders_phone ON orders(customer_phone)`;
await sql`CREATE INDEX idx_notifications_phone ON notifications(customer_phone)`;
await sql`CREATE INDEX idx_notifications_order ON notifications(order_id)`;

// Seed demo products
const demoProducts = [
  { id: '1', name: 'Fresh Organic Milk', price: 65, description: 'Farm-fresh organic whole milk, 1 liter. Rich in calcium and protein.', images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'], stock: 50 },
  { id: '2', name: 'Whole Wheat Bread', price: 45, description: 'Freshly baked whole wheat bread, perfect for breakfast and sandwiches.', images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'], stock: 100 },
  { id: '3', name: 'Free Range Eggs (12 pcs)', price: 120, description: 'Premium free-range eggs from local farms. Pack of 12.', images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'], stock: 75 },
  { id: '4', name: 'Basmati Rice (5kg)', price: 350, description: 'Premium aged basmati rice, long grain. Perfect for biryani and pulao.', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'], stock: 40 },
  { id: '5', name: 'Fresh Tomatoes (1kg)', price: 30, description: 'Locally sourced ripe tomatoes, perfect for cooking and salads.', images: ['https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400'], stock: 200 },
  { id: '6', name: 'Cooking Oil (1L)', price: 180, description: 'Pure refined soybean cooking oil for everyday use.', images: ['https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=400'], stock: 60 },
];
for (const p of demoProducts) {
  await sql`INSERT INTO products (id, name, price, description, images, image_url, stock) VALUES (${p.id}, ${p.name}, ${p.price}, ${p.description}, ${JSON.stringify(p.images)}, ${p.images[0]}, ${p.stock})`;
}
console.log('Seeded 6 demo products.');

// Verify
const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
console.log('Tables:', tables.map(t => t.table_name));
const count = await sql`SELECT COUNT(*) as count FROM products`;
console.log('Products count:', count[0].count);
console.log('Done!');
