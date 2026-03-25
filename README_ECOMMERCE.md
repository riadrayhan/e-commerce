# DailyMart - E-Commerce Platform for Daily Essentials

A complete, production-ready e-commerce platform built with modern web technologies. Perfect for selling groceries, household items, and daily essentials.

## Overview

DailyMart is a full-stack e-commerce solution featuring:
- **Public storefront** with product browsing and search
- **Secure admin panel** for inventory management
- **Guest checkout** with order tracking
- **Responsive design** for all devices
- **Live API** deployment ready for Netlify
- **MongoDB** for data persistence

## Quick Links

- 🚀 [Quick Start Guide](./QUICK_START.md) - Get running in 5 minutes
- 📖 [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Detailed setup & deployment
- 🌐 Live Demo: Check the preview environment

## Features Included

### Public Website
- ✅ Browse all products with images and details
- ✅ Search and filter products
- ✅ View detailed product information
- ✅ Add items to shopping cart (client-side storage)
- ✅ Guest checkout with delivery address
- ✅ Order confirmation and tracking
- ✅ Fully responsive mobile design

### Admin Panel
- ✅ Secure login with password protection
- ✅ Add new products with image URLs
- ✅ Edit product details (name, price, description)
- ✅ Delete products
- ✅ View all orders from customers
- ✅ Track order status
- ✅ Manage inventory (stock levels)

### Backend API
- ✅ RESTful API for products (CRUD)
- ✅ Order management system
- ✅ Admin authentication with JWT
- ✅ MongoDB database integration
- ✅ Error handling and validation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **Backend** | Node.js API routes (Netlify Functions) |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT (JSON Web Tokens) |
| **Hosting** | Netlify (Frontend + Serverless Functions) |
| **State** | localStorage for cart, React hooks for UI |

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage (product listing)
│   ├── cart/page.tsx           # Shopping cart
│   ├── checkout/page.tsx       # Checkout form
│   ├── order-success/[id]/     # Order confirmation
│   ├── product/[id]/page.tsx   # Product details
│   ├── admin/
│   │   ├── login/page.tsx      # Admin login
│   │   └── dashboard/page.tsx  # Product management
│   ├── api/
│   │   ├── products/           # Product endpoints
│   │   ├── orders/             # Order endpoints
│   │   └── admin/              # Admin endpoints
│   └── globals.css             # Global styles & design tokens
│
├── lib/
│   ├── db.ts                   # MongoDB models & connection
│   └── auth.ts                 # Authentication helpers
│
├── components/
│   └── admin-protected.tsx     # Auth protection wrapper
│
├── public/                      # Static assets
├── .env.example                # Environment template
├── netlify.toml                # Netlify configuration
├── QUICK_START.md              # 5-minute setup guide
└── DEPLOYMENT_GUIDE.md         # Detailed deployment guide
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas account (free)
- Netlify account (free)
- Git and GitHub (for deployment)

### Local Setup (5 minutes)

1. **Clone and install**
```bash
git clone <your-repo>
cd dailymart
npm install
```

2. **Setup MongoDB**
   - Create free account at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a cluster and database user
   - Get connection string

3. **Configure environment**
```bash
# Create .env.local
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=your_connection_string_here
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=generate_random_secret
```

4. **Run development server**
```bash
npm run dev
```

5. **Access the app**
- Website: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## API Endpoints

### Products
```
GET    /api/products              List all products
POST   /api/products              Create product (admin)
GET    /api/products/[id]         Get product details
PUT    /api/products/[id]         Update product (admin)
DELETE /api/products/[id]         Delete product (admin)
```

### Orders
```
GET    /api/orders                List all orders (admin)
POST   /api/orders                Create new order
GET    /api/orders/[id]           Get order details
PUT    /api/orders/[id]           Update order status (admin)
```

### Admin
```
POST   /api/admin/login           Login to admin panel
GET    /api/admin/check           Verify authentication
```

## Deployment to Netlify

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy on Netlify
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "New site from Git"
3. Select your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `.next`

### Step 3: Set Environment Variables
In Netlify Site Settings → Environment:
- `MONGODB_URI`: Your MongoDB connection string
- `ADMIN_PASSWORD`: Your admin password
- `JWT_SECRET`: Random secret key

### Step 4: Deploy
Click "Deploy site" and wait for completion

Your site will be live at: `https://your-site-name.netlify.app`

## Usage

### Admin Workflow
1. Go to `/admin/login`
2. Enter admin password
3. Click "Add Product"
4. Fill in: Name, Price, Description, Image URL (optional), Stock
5. Submit and manage products

### Customer Workflow
1. Browse products on homepage
2. Click product to view details
3. Adjust quantity and click "Add to Cart"
4. Go to cart to review items
5. Click "Checkout"
6. Fill delivery information
7. Confirm order

## Security Features

- ✅ Password-protected admin panel
- ✅ JWT-based authentication
- ✅ Secure environment variables
- ✅ HTTPS enabled (Netlify)
- ✅ MongoDB connection string encrypted
- ✅ Admin authentication checks on routes

## Customization

### Change Store Name
Replace "DailyMart" in:
- `app/page.tsx`
- `app/layout.tsx` (metadata.title)
- Component headers and footers

### Update Colors
Edit `app/globals.css`:
```css
--primary: oklch(0.35 0.15 245);    /* Main color */
--accent: oklch(0.65 0.18 28);      /* Accent color */
--background: oklch(0.98 0.01 240); /* Background */
```

### Add Payment Gateway
- **Stripe**: Integrate Stripe Checkout API
- **Razorpay**: Add Razorpay payment button
- **PayPal**: Implement PayPal SDK

## Performance Optimization

- Next.js server-side rendering for fast loads
- Optimized images with Next.js Image component
- MongoDB indexing for fast queries
- Client-side caching with localStorage
- Gzip compression on Netlify

## Monitoring & Analytics

Add to `app/layout.tsx` for analytics:
```typescript
import { Analytics } from '@vercel/analytics/next'
```

Monitor in Netlify Dashboard:
- Function logs
- Build history
- Deployment status

## Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Security
ADMIN_PASSWORD=strong_password_here
JWT_SECRET=random_secret_key_32_chars

# Deployment
NODE_ENV=production
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Products not loading | Verify MONGODB_URI is correct |
| Admin login fails | Check ADMIN_PASSWORD matches env var |
| Images not showing | Ensure image URLs are public |
| Cart data lost | Enable localStorage in browser |
| Deploy fails | Check Node version (18+) and npm packages |

## Performance Tips

1. **Optimize product images** - Use compressed JPEGs
2. **Use CDNs** - Host images on external CDN
3. **Database indexing** - MongoDB creates indexes automatically
4. **Caching** - Enable Next.js static optimization
5. **Monitoring** - Use Netlify analytics

## Roadmap

Future enhancements:
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] User accounts & order history
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Advanced search filters
- [ ] Inventory notifications
- [ ] SMS notifications

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Netlify Docs**: https://docs.netlify.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

## License

This project is open source and available under the MIT License.

---

## Quick Checklist

- [ ] Read [QUICK_START.md](./QUICK_START.md)
- [ ] Setup MongoDB Atlas
- [ ] Create `.env.local` file
- [ ] Run `npm install && npm run dev`
- [ ] Test locally
- [ ] Push to GitHub
- [ ] Deploy to Netlify
- [ ] Set environment variables
- [ ] Add first products
- [ ] Test checkout flow
- [ ] Celebrate! 🎉

---

**Ready to launch your e-commerce store?** Start with [QUICK_START.md](./QUICK_START.md) now!

Built with ❤️ for modern e-commerce.
