# DailyMart E-Commerce Deployment Guide

This is a complete e-commerce platform for daily essentials with an admin panel, built with Next.js 16, MongoDB, and deployed on Netlify.

## Features

- **Public Website**: Browse and search products, view details, add to cart, guest checkout
- **Admin Panel**: Secure admin dashboard to manage products (add, edit, delete)
- **Shopping Cart**: Client-side cart management with localStorage
- **Orders**: Guest checkout with order confirmation and tracking
- **MongoDB Integration**: Cloud-based database for products and orders
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Modern UI**: Clean, professional design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js API routes (Netlify Serverless Functions)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based admin authentication
- **Hosting**: Netlify (Frontend + Backend)

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier available)
- Netlify account
- Git

## Step 1: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster
4. Go to "Database Access" and create a database user
5. Go to "Network Access" and add your IP (or 0.0.0.0 for development)
6. Go to "Clusters" and click "Connect"
7. Choose "Drivers" and copy the connection string
8. Replace `<password>` and `<username>` with your credentials
9. Save this URL - you'll need it for environment variables

Example: `mongodb+srv://myusername:mypassword@cluster0.abcde.mongodb.net/dailymart?retryWrites=true&w=majority`

## Step 2: Local Development Setup

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```
MONGODB_URI=your_mongodb_connection_string_here
ADMIN_PASSWORD=your_secure_admin_password_here
JWT_SECRET=your_random_secret_key_here
NODE_ENV=development
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Step 3: Testing Locally

### Add Products (Admin Panel)
1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Enter the admin password you set in `.env.local`
3. Click "Add Product" and fill in:
   - Product Name
   - Price
   - Description
   - Image URL (optional, use any publicly available image URL)
   - Stock
4. Click "Add Product"

### Browse Products
1. Go to [http://localhost:3000](http://localhost:3000)
2. You should see the products you added
3. Click on any product to view details
4. Click "Add to Cart" to add to cart
5. Go to checkout to place an order

## Step 4: Deploy to Netlify

### Option A: Using Netlify CLI (Recommended)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod
```

### Option B: Using Netlify Web Interface

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Functions directory**: `netlify/functions`

6. Set environment variables in Netlify settings:
   - Go to "Site settings" → "Build & deploy" → "Environment"
   - Add these variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `ADMIN_PASSWORD`: Your admin password
     - `JWT_SECRET`: A random secret key
     - `NODE_ENV`: production

7. Deploy!

## Step 5: Netlify Configuration

Create a `netlify.toml` file in the root directory:

```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = ".next"

[functions]
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[env.production]
  NODE_ENV = "production"
```

## Step 6: Updating Products on Production

1. Go to your live website: `your-site-name.netlify.app/admin/login`
2. Log in with your admin password
3. Add, edit, or delete products just like locally

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order by ID
- `PUT /api/orders/[id]` - Update order status (admin)

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/check` - Check if authenticated

## Admin Password Security

**IMPORTANT**: 
- Change the default admin password immediately
- Use a strong, unique password
- Store it securely
- Use environment variables, NOT hardcoded values
- Netlify environment variables are encrypted and secure

## Database Backups

MongoDB Atlas automatically backs up your data daily. To export data:
1. Go to MongoDB Atlas
2. Click your cluster
3. Go to "Collections" → "Export Collection"
4. Download the data

## Troubleshooting

### Products not showing
- Check MongoDB connection string in `.env`
- Ensure MongoDB user has database access
- Check browser console for errors

### Admin login not working
- Verify `ADMIN_PASSWORD` environment variable
- Clear browser cookies and try again
- Check server logs

### Images not loading
- Ensure image URLs are publicly accessible
- Use direct image links, not sharing links

### Cart not persisting
- Make sure localStorage is enabled
- Check browser privacy settings
- Clear cache if having issues

## Production Checklist

- [ ] Change admin password to something secure
- [ ] Set random JWT_SECRET (use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Verify MongoDB backups are configured
- [ ] Test checkout flow end-to-end
- [ ] Set up error monitoring (optional: Sentry, LogRocket)
- [ ] Configure custom domain in Netlify
- [ ] Enable SSL/HTTPS (Netlify does this automatically)
- [ ] Add privacy policy and terms of service pages

## Performance Tips

1. Optimize product images before uploading
2. Use CDN for static assets
3. Monitor database query performance
4. Enable MongoDB connection pooling
5. Cache frequently accessed products

## Support

For issues or questions:
1. Check the MongoDB Atlas documentation
2. Review Next.js deployment guide
3. Check Netlify function logs in dashboard
4. Verify environment variables are set correctly

## License

This project is open source and available under the MIT License.

---

**Happy selling! Your e-commerce store is now live!** 🚀
