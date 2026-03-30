// In-memory data store (works on Vercel serverless)
// Data resets on cold start but persists across warm invocations

const demoProducts = [
  { id: '1', name: 'Fresh Organic Milk', price: 65, description: 'Farm-fresh organic whole milk, 1 liter. Rich in calcium and protein.', image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', stock: 50, created_at: '2026-03-25T10:00:00.000Z' },
  { id: '2', name: 'Whole Wheat Bread', price: 45, description: 'Freshly baked whole wheat bread, perfect for breakfast and sandwiches.', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', stock: 100, created_at: '2026-03-25T10:01:00.000Z' },
  { id: '3', name: 'Free Range Eggs (12 pcs)', price: 120, description: 'Premium free-range eggs from local farms. Pack of 12.', image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', stock: 75, created_at: '2026-03-25T10:02:00.000Z' },
  { id: '4', name: 'Basmati Rice (5kg)', price: 350, description: 'Premium aged basmati rice, long grain. Perfect for biryani and pulao.', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', stock: 40, created_at: '2026-03-25T10:03:00.000Z' },
  { id: '5', name: 'Fresh Tomatoes (1kg)', price: 30, description: 'Locally sourced ripe tomatoes, perfect for cooking and salads.', image_url: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400', stock: 200, created_at: '2026-03-25T10:04:00.000Z' },
  { id: '6', name: 'Cooking Oil (1L)', price: 180, description: 'Pure refined soybean cooking oil for everyday use.', image_url: 'https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=400', stock: 60, created_at: '2026-03-25T10:05:00.000Z' },
];

// Global store that persists across warm serverless invocations
const globalStore = globalThis as any;
if (!globalStore.__products) globalStore.__products = [...demoProducts];
if (!globalStore.__orders) globalStore.__orders = [];

function getStore() {
  return {
    products: globalStore.__products as any[],
    orders: globalStore.__orders as any[],
  };
}

// Product operations
export async function getProducts() {
  return getStore().products.filter((p: any) => p.stock > 0);
}

export async function getProductById(id: string) {
  return getStore().products.find((p: any) => p.id === id);
}

export async function createProduct(
  name: string,
  price: number,
  description: string,
  imageData: any,
  stock: number
) {
  const product = {
    id: String(Date.now()),
    name,
    price,
    description,
    image_url: typeof imageData === 'string' ? imageData : '',
    stock,
    created_at: new Date().toISOString(),
  };
  getStore().products.unshift(product);
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
  const store = getStore();
  const index = store.products.findIndex((p: any) => p.id === id);
  if (index === -1) return null;
  store.products[index] = {
    ...store.products[index],
    name,
    price,
    description,
    image_url: typeof imageData === 'string' && imageData ? imageData : store.products[index].image_url,
    stock,
  };
  return store.products[index];
}

export async function deleteProduct(id: string) {
  const store = getStore();
  const index = store.products.findIndex((p: any) => p.id === id);
  if (index === -1) return null;
  const deleted = store.products.splice(index, 1);
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
  getStore().orders.unshift(order);
  return order;
}

export async function getOrderById(id: string) {
  return getStore().orders.find((o: any) => o.id === id);
}

export async function getOrders(limit: number = 50) {
  return getStore().orders.slice(0, limit);
}

export async function updateOrderStatus(id: string, status: string) {
  const store = getStore();
  const index = store.orders.findIndex((o: any) => o.id === id);
  if (index === -1) return null;
  store.orders[index].status = status;
  store.orders[index].updated_at = new Date().toISOString();
  return store.orders[index];
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === (process.env.ADMIN_PASSWORD || 'admin');
}
