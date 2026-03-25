# DailyMart - E-Commerce Platform

A complete, production-ready e-commerce store built with **Next.js 16**, **PostgreSQL (Neon)**, and **Vercel**. Perfect for selling daily essentials with zero infrastructure hassle.

## 🚀 Quick Links

- **[Quick Start Guide](./QUICK_START.md)** - Get running in 5 minutes
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Deploy to production
- **[Full Documentation](./README_ECOMMERCE.md)** - Complete reference
- **[Testing Guide](./TEST_DATA.md)** - Sample data & testing

## ✨ Features

### Public Website
- Browse all products with search functionality
- Product details with images and descriptions
- Shopping cart with persistent storage
- Guest checkout (no login required)
- Order confirmation and tracking
- Fully responsive mobile design

### Admin Panel
- Secure password-protected access
- Add, edit, and delete products
- Manage product images with URLs
- Track all orders
- Inventory management
- Clean, intuitive interface

### Backend
- REST API for all operations
- JWT authentication
- PostgreSQL database with Neon
- Deployed on Vercel (serverless)
- Zero cold starts with Vercel Functions

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Backend | Next.js API Routes |
| Database | Neon (PostgreSQL) |
| Auth | JWT |
| Hosting | Vercel |

## 📦 What's Included

```
app/
├── api/                 # REST API endpoints
│   ├── products/       # Product CRUD
│   ├── orders/         # Order management  
│   └── admin/          # Admin authentication
├── admin/              # Admin panel
├── product/            # Product details page
├── cart/               # Shopping cart
├── checkout/           # Checkout flow
└── order-success/      # Order confirmation

lib/
├── db.ts              # Database functions
└── auth.ts            # Auth utilities

scripts/
└── init-db.sql        # Database schema

components/
├── ui/                # shadcn/ui components
└── admin-protected.tsx # Auth wrapper
```

## 🎯 Getting Started (Local)

### 1. Prerequisites
- Node.js 18+ installed
- Neon account (free at https://neon.tech)
- Git

### 2. Database Setup
1. Create a Neon project at https://console.neon.tech
2. Copy your connection string
3. Run SQL from `/scripts/init-db.sql` in Neon's SQL Editor

### 3. Local Setup
```bash
# Install dependencies
pnpm install

# Create .env.local with:
DATABASE_URL=postgresql://...your_connection_string...
ADMIN_PASSWORD=admin123
JWT_SECRET=your-secret-key-here

# Run locally
pnpm dev
```

Visit http://localhost:3000

### 4. Add Test Products
- Go to http://localhost:3000/admin/login
- Password: `admin123`
- Add your first product with a URL to an image

## 🌐 Deploy to Vercel

### 1. Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dailymart.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Add environment variables:
   - `DATABASE_URL` → Your Neon connection string
   - `ADMIN_PASSWORD` → Your chosen password
   - `JWT_SECRET` → Random secret key
5. Click "Deploy"

### 3. Done!
Your store is live! Share your URL with customers.

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `ADMIN_PASSWORD` | Password for admin panel | Any secure string |
| `JWT_SECRET` | Secret for auth tokens | Random 32+ character string |

## 🔐 Security

- Admin login uses JWT tokens stored in HTTP-only cookies
- All API endpoints validate authentication
- No sensitive data exposed in frontend
- Passwords are verified on backend
- Vercel provides automatic HTTPS

## 📊 Database Schema

### Products Table
```sql
- id (UUID, primary key)
- name (string)
- price (decimal)
- description (text)
- image_url (string)
- stock (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### Orders Table
```sql
- id (UUID, primary key)
- customer_name (string)
- customer_email (string)
- customer_phone (string)
- customer_address (string)
- items (JSON)
- total_amount (decimal)
- status (string)
- created_at (timestamp)
- updated_at (timestamp)
```

## 🧪 Testing

Use test image URLs in admin panel:
- `https://via.placeholder.com/200` - Placeholder image
- `https://picsum.photos/200` - Random images

See [TEST_DATA.md](./TEST_DATA.md) for full testing guide.

## 🚨 Troubleshooting

### Database Connection Error
- Verify DATABASE_URL in environment variables
- Check Neon console - is project active?
- Ensure connection string is correct format

### Admin Login Not Working
- Check ADMIN_PASSWORD matches your env var
- Clear browser cookies and try again
- Verify JWT_SECRET is set

### Products Not Loading
- Run `/scripts/init-db.sql` in Neon SQL Editor
- Check if products table exists
- Add test product via admin panel

### Images Not Displaying
- Use HTTPS URLs only
- Test the image URL directly in browser
- For production: use Vercel Blob storage

## 🛣️ API Documentation

### Products
```
GET  /api/products          - List all products
POST /api/products          - Create product (admin)
GET  /api/products/[id]     - Get product details
PUT  /api/products/[id]     - Update product (admin)
DEL  /api/products/[id]     - Delete product (admin)
```

### Orders
```
GET  /api/orders            - List all orders (admin)
POST /api/orders            - Create order
GET  /api/orders/[id]       - Get order details
PUT  /api/orders/[id]       - Update order status (admin)
```

### Admin
```
POST /api/admin/login       - Login and get JWT token
GET  /api/admin/check       - Verify authentication
```

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Neon Docs](https://neon.tech/docs)
- [Vercel Docs](https://vercel.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## 📝 File Structure

```
.
├── app/                    # Next.js app directory
├── lib/                    # Utilities and database
├── components/             # React components
├── public/                 # Static assets
├── scripts/                # Database scripts
├── .env.example            # Example environment file
├── QUICK_START.md          # 5-minute setup
├── DEPLOYMENT_GUIDE.md     # Full deployment guide
├── README_ECOMMERCE.md     # Complete reference
└── TEST_DATA.md            # Testing guide
```

## 🤝 Contributing

Feel free to fork, improve, and use this as a template for your projects!

## 📄 License

MIT - Free to use and modify

## 🎉 Next Steps

1. ✅ Clone/download the project
2. ✅ Setup Neon database (5 mins)
3. ✅ Run locally and test (5 mins)
4. ✅ Deploy to Vercel (3 mins)
5. ✅ Share with customers!

## 💡 Enhancement Ideas

- Add payment integration (Stripe, Razorpay)
- Email confirmations via SendGrid
- User accounts and order history
- Product categories and filters
- Customer reviews and ratings
- Inventory alerts
- Analytics dashboard

## ❓ Support

- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for common issues
- Review [TEST_DATA.md](./TEST_DATA.md) for testing help
- Check Vercel and Neon dashboards for logs

---

**Built with ❤️ for entrepreneurs. Ready to scale.**
