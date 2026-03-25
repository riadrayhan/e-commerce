# DailyMart E-Commerce Deployment Guide

This is a complete e-commerce platform for daily essentials with an admin panel, built with Next.js 16 and deployed on Vercel with Neon PostgreSQL database.

## Features

- **Public Website**: Browse products, view details, add to cart, guest checkout
- **Admin Panel**: Secure dashboard to manage products (add, edit, delete, track orders)
- **Shopping Cart**: Full cart management with checkout
- **Orders**: Guest checkout with order confirmation and tracking
- **PostgreSQL Database**: Neon serverless PostgreSQL for data persistence
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes (Vercel Functions)
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: JWT-based admin protection
- **Hosting**: Vercel (Zero-config deployment)
- **Images**: URL-based image storage (Vercel Blob recommended for production)

## Prerequisites

- Node.js 18+
- Neon account (free tier available at https://neon.tech)
- Vercel account (https://vercel.com)
- Git and GitHub account

## Step 1: Neon Database Setup

### 1.1 Create a Neon Account

1. Go to [Neon Console](https://console.neon.tech)
2. Sign up with GitHub, Google, or email
3. Create a new project (default settings are fine)

### 1.2 Get Your Connection String

1. In the Neon console, go to "Connection Details" in the right panel
2. Copy the "Connection string" (it will look like: `postgresql://user:password@...`)
3. Save this URL safely - you'll need it for environment variables

### 1.3 Create Tables (IMPORTANT!)

1. In the Neon console, click "SQL Editor" in the left sidebar
2. Copy and paste the entire content from `/scripts/init-db.sql`
3. Click "Run" to execute the SQL

Your database is now ready!

## Step 2: Local Development Setup

### 2.1 Install Dependencies

```bash
pnpm install
```

### 2.2 Create Local Environment File

Create a `.env.local` file in the root directory:

```env
# Your Neon connection string from Step 1.2
DATABASE_URL=postgresql://user:password@...

# Admin password (change this!)
ADMIN_PASSWORD=admin123

# Random secret for JWT (change this to something random!)
JWT_SECRET=your-random-secret-key-here
```

### 2.3 Run Locally

```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

**Test Admin Panel:**
- Go to `http://localhost:3000/admin/login`
- Password: `admin123`
- Add a test product with image URL

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dailymart.git
git push -u origin main
```

### 3.2 Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"
5. Under "Environment Variables", add:
   - `DATABASE_URL` = Your Neon connection string
   - `ADMIN_PASSWORD` = Your secure password
   - `JWT_SECRET` = Your random secret
6. Click "Deploy"

Wait for deployment to complete!

### 3.3 Database Initialization (First Time Only)

After deployment, run the database initialization:

1. In the Neon console, go to SQL Editor
2. Run the SQL from `/scripts/init-db.sql`
3. Or execute it locally:
   ```bash
   psql $DATABASE_URL < scripts/init-db.sql
   ```

## Step 4: Test Your Live Store

Once deployed:

1. **Visit your store**: https://your-project.vercel.app
2. **Access admin panel**: https://your-project.vercel.app/admin/login
3. **Add a product**: Upload with a public image URL
4. **Test checkout**: Buy a product (guest checkout)

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `ADMIN_PASSWORD` | Password to access admin panel | `SuperSecurePassword123!` |
| `JWT_SECRET` | Secret for authentication tokens | `aRandom32CharacterStringHere1234` |

## Troubleshooting

### Database Connection Error

**Problem**: "DATABASE_URL is not set" or connection timeout

**Solution**:
1. Verify `DATABASE_URL` is set in Vercel environment variables
2. Check Neon console for correct connection string
3. Ensure Neon project is active (not paused)

### Admin Login Not Working

**Problem**: Password doesn't work at `/admin/login`

**Solution**:
1. Check the `ADMIN_PASSWORD` in Vercel environment variables
2. Make sure it matches the password you set
3. Clear browser cookies and try again

### Products Not Loading

**Problem**: Homepage shows "No products" or error

**Solution**:
1. Run `/scripts/init-db.sql` in Neon SQL Editor
2. Add products via admin panel
3. Check Neon database has `products` table

### Images Not Showing

**Problem**: Product images display as broken

**Solution**:
1. Use fully qualified URLs (https://...)
2. For production, use Vercel Blob for image storage
3. Test image URL in browser first

## Upgrading to Production

### Add Vercel Blob for Images

For production-grade image storage:

1. Go to Vercel Dashboard → Your Project → Storage
2. Create a "Blob" storage
3. Use it in admin panel to upload images

### Set Up Email Notifications

Add order confirmation emails:

1. Use SendGrid, Mailgun, or Gmail
2. Add `SMTP_*` environment variables
3. Integrate with checkout API

### Add Payment Processing

Integrate Stripe or Razorpay:

1. Get API keys from payment provider
2. Add environment variables
3. Modify checkout API to process payments

## File Structure

```
app/
├── api/
│   ├── products/     # Product CRUD
│   ├── orders/       # Order management
│   └── admin/        # Admin auth
├── admin/            # Admin panel pages
├── product/          # Product detail pages
├── cart/             # Shopping cart
├── checkout/         # Checkout page
└── page.tsx          # Homepage
lib/
├── db.ts             # Database functions
└── auth.ts           # Authentication helpers
scripts/
└── init-db.sql       # Database schema
```

## Support

For issues:

1. Check logs in Vercel Dashboard
2. Check Neon console for database issues
3. Verify all environment variables are set
4. Test locally first before deploying

## Security Notes

⚠️ **Important**:
- Change `ADMIN_PASSWORD` and `JWT_SECRET` to strong values
- Don't commit `.env.local` to Git
- Use HTTPS only (Vercel provides this)
- Keep Neon credentials secure
- Regenerate secrets periodically

Good luck with your store! 🚀
