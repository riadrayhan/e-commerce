import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

// Helper function for safe queries
export async function query<T = any>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<T[]> {
  try {
    const result = await sql(strings, ...values);
    return result as T[];
  } catch (error) {
    console.error('[DB Error]', error);
    throw error;
  }
}

// Product operations
export async function getProducts() {
  return query(
    `SELECT id, name, price, description, image_data, stock, created_at FROM products WHERE stock > 0 ORDER BY created_at DESC`
  );
}

export async function getProductById(id: string) {
  const result = await query(
    `SELECT id, name, price, description, image_data, stock, created_at FROM products WHERE id = $1`,
    [id]
  );
  return result[0];
}

export async function createProduct(
  name: string,
  price: number,
  description: string,
  imageData: Buffer | null,
  stock: number
) {
  const result = await query(
    `INSERT INTO products (name, price, description, image_data, stock) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, name, price, description, image_data, stock, created_at`,
    [name, price, description, imageData, stock]
  );
  return result[0];
}

export async function updateProduct(
  id: string,
  name: string,
  price: number,
  description: string,
  imageData: Buffer | null,
  stock: number
) {
  const result = await query(
    `UPDATE products SET name = $1, price = $2, description = $3, image_data = $4, stock = $5, updated_at = NOW()
     WHERE id = $6
     RETURNING id, name, price, description, image_data, stock, created_at`,
    [name, price, description, imageData, stock, id]
  );
  return result[0];
}

export async function deleteProduct(id: string) {
  const result = await query(
    `DELETE FROM products WHERE id = $1 RETURNING id`,
    [id]
  );
  return result[0];
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
  const result = await query(
    `INSERT INTO orders (customer_name, customer_phone, customer_address, items, total_amount, status, order_number)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)
     RETURNING id, customer_name, customer_phone, customer_address, items, total_amount, status, order_number, created_at`,
    [customerName, customerPhone, customerAddress, JSON.stringify(items), totalAmount, status, `ORD-${Date.now()}`]
  );
  return result[0];
}

export async function getOrderById(id: string) {
  const result = await query(
    `SELECT id, customer_name, customer_phone, customer_address, items, total_amount, status, order_number, created_at
     FROM orders WHERE id = $1`,
    [id]
  );
  return result[0];
}

export async function getOrders(limit: number = 50) {
  return query(
    `SELECT id, customer_name, customer_phone, customer_address, items, total_amount, status, order_number, created_at
     FROM orders ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
}

export async function updateOrderStatus(id: string, status: string) {
  const result = await query(
    `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, status, updated_at`,
    [status, id]
  );
  return result[0];
}

// Admin operations
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';
  return bcrypt.compare(password, adminPasswordHash);
}
