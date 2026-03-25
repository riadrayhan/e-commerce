# DailyMart - Quick Start Guide

Get your e-commerce store running in just 5 minutes!

## Step 1: Get Neon Database (2 minutes)

1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up with GitHub or email
3. Create a new project (default settings are fine)
4. Click "Connection Details" on the right
5. Copy your connection string (starts with `postgresql://`)
6. Save it somewhere safe

## Step 2: Create Tables in Neon (1 minute)

1. In Neon console, click "SQL Editor" on the left
2. Copy all content from `/scripts/init-db.sql`
3. Paste into SQL Editor
4. Click "Run" button
5. Done! Tables are created

## Step 3: Setup Local Environment (1 minute)

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and fill in:
```env
DATABASE_URL=postgresql://your_connection_string_here
ADMIN_PASSWORD=admin123
JWT_SECRET=random-secret-key-12345
```

## Step 4: Run Your Store (1 minute)

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 5: Test the Store

1. **Homepage**: Should show "No products yet"
2. **Admin Panel**: Go to `/admin/login`, password: `admin123`
3. **Add Product**: Use any public image URL
4. **Back to Homepage**: Your product should appear
5. **Test Checkout**: Add to cart → Checkout → Complete order

## Quick URLs

- Store: [http://localhost:3000](http://localhost:3000)
- Admin Login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- API Products: [http://localhost:3000/api/products](http://localhost:3000/api/products)

## Deploy to Vercel (Optional - 3 minutes)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New" → "Project"
4. Select your repository
5. Add environment variables (DATABASE_URL, ADMIN_PASSWORD, JWT_SECRET)
6. Click Deploy!

## Troubleshooting

**"DATABASE_URL is not set"**
- Make sure `.env.local` exists in root directory
- Check DATABASE_URL value is correct

**"No tables in database"**
- Run `/scripts/init-db.sql` in Neon SQL Editor
- Check Neon console for the `products` and `orders` tables

**Admin login not working**
- Default password is `admin123`
- Check ADMIN_PASSWORD in `.env.local`

**Images not showing**
- Use full URLs starting with https://
- Test the image URL in browser first

## Next Steps

Once you're running locally:

1. Add more products via admin panel
2. Test cart and checkout flow
3. Deploy to Vercel for free hosting
4. Add payment integration (optional)
5. Setup email notifications (optional)

## Support Resources

- [Full Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Project Overview](./README_ECOMMERCE.md)
- [Testing Guide](./TEST_DATA.md)
- [Neon Docs](https://neon.tech/docs)
- [Next.js Docs](https://nextjs.org/docs)

Happy selling! 🚀
