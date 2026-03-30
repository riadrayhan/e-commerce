const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.API_PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// --- Data helpers ---
const DATA_DIR = path.join(__dirname, 'data');

function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// --- PRODUCTS ---

// GET all products
app.get('/api/products', (req, res) => {
  try {
    const products = readJSON('products.json');
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  try {
    const products = readJSON('products.json');
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// POST create product
app.post('/api/products', (req, res) => {
  try {
    const { name, price, description, imageUrl, stock } = req.body;
    if (!name || price === undefined || !description) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const products = readJSON('products.json');
    const newProduct = {
      id: String(Date.now()),
      name,
      price: parseFloat(price),
      description,
      image_url: imageUrl || '',
      stock: parseInt(stock) || 100,
      created_at: new Date().toISOString(),
    };
    products.push(newProduct);
    writeJSON('products.json', products);

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  try {
    const { name, price, description, imageUrl, stock } = req.body;
    if (!name || !price || !description) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const products = readJSON('products.json');
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    products[index] = {
      ...products[index],
      name,
      price: parseFloat(price),
      description,
      image_url: imageUrl || products[index].image_url,
      stock: parseInt(stock) || products[index].stock,
    };
    writeJSON('products.json', products);

    res.json({ success: true, data: products[index] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  try {
    const products = readJSON('products.json');
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    products.splice(index, 1);
    writeJSON('products.json', products);

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// --- ORDERS ---

// GET all orders
app.get('/api/orders', (req, res) => {
  try {
    const orders = readJSON('orders.json');
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// GET single order
app.get('/api/orders/:id', (req, res) => {
  try {
    const orders = readJSON('orders.json');
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

// POST create order
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, items, totalAmount } = req.body;
    if (!customerName || !customerPhone || !customerAddress || !items || !totalAmount) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const orders = readJSON('orders.json');
    const newOrder = {
      id: String(Date.now()),
      order_number: `ORD-${Date.now()}`,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      items,
      total_amount: parseFloat(totalAmount),
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    orders.push(newOrder);
    writeJSON('orders.json', orders);

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

// PUT update order status
app.put('/api/orders/:id', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const orders = readJSON('orders.json');
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    orders[index].status = status;
    orders[index].updated_at = new Date().toISOString();
    writeJSON('orders.json', orders);

    res.json({ success: true, data: orders[index] });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, error: 'Failed to update order' });
  }
});

// --- ADMIN ---

// POST admin login
app.post('/api/admin/login', (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ role: 'admin', iat: Date.now() }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// GET admin auth check
app.get('/api/admin/check', (req, res) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
  console.log(`   Products API: http://localhost:${PORT}/api/products`);
  console.log(`   Orders API:   http://localhost:${PORT}/api/orders`);
  console.log(`   Admin Login:  http://localhost:${PORT}/api/admin/login`);
});
