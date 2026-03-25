# DailyMart - Quick Start Guide

## 5-Minute Setup

### 1. Get MongoDB (Free)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create account → Create cluster (FREE tier)
3. Create database user (remember username & password)
4. Network Access: Add IP "0.0.0.0/0"
5. Click "Connect" → "Drivers" → Copy connection string
6. Replace `<username>` and `<password>` with your credentials

### 2. Setup Environment
1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.abcde.mongodb.net/dailymart?retryWrites=true&w=majority
ADMIN_PASSWORD=YourSecurePassword123
JWT_SECRET=random-secret-key-12345
```

### 3. Run Locally
```bash
npm install
npm run dev
```

Open http://localhost:3000

### 4. Add Products
- Go to http://localhost:3000/admin/login
- Enter your ADMIN_PASSWORD
- Click "Add Product"
- Fill in: Name, Price, Description, Image URL, Stock
- Click "Add Product"

### 5. Test Shopping
- Back to homepage
- Click product to see details
- "Add to Cart" → "Cart" → "Checkout"
- Fill delivery info → "Place Order"

## Deploy to Netlify

### Quick Deploy (GitHub)
1. Push code to GitHub
2. Go to [netlify.com](https://app.netlify.com)
3. Click "New site from Git" → Select repo
4. Build command: `npm run build`
5. Publish: `.next`
6. Click "Deploy"

### Add Environment Variables
1. Go to Site settings → Environment
2. Add 3 variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `ADMIN_PASSWORD`: Your admin password
   - `JWT_SECRET`: Random secret key

3. Redeploy

### Your Live Site
- Frontend: https://your-site-name.netlify.app
- Admin: https://your-site-name.netlify.app/admin/login
- Orders: Admin can see all orders

## Important Security Notes

⚠️ **NEVER share your MongoDB password or JWT_SECRET**
- Use Netlify environment variables (encrypted)
- Change ADMIN_PASSWORD to something strong
- For JWT_SECRET, generate random: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## File Structure

```
app/
├── page.tsx                 # Homepage - Product listing
├── cart/page.tsx           # Shopping cart
├── checkout/page.tsx       # Guest checkout
├── order-success/[id]/page.tsx # Order confirmation
├── product/[id]/page.tsx   # Product details
├── admin/
│   ├── login/page.tsx      # Admin login
│   └── dashboard/page.tsx  # Product management
└── api/
    ├── products/route.ts   # Product CRUD
    ├── orders/route.ts     # Order management
    └── admin/
        ├── login/route.ts  # Login API
        └── check/route.ts  # Auth check

lib/
├── db.ts                   # MongoDB connection & models
└── auth.ts                 # Authentication helpers
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Add product |
| GET | `/api/products/[id]` | Get product details |
| PUT | `/api/products/[id]` | Edit product |
| DELETE | `/api/products/[id]` | Delete product |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get all orders |
| POST | `/api/admin/login` | Admin login |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` |
| MongoDB connection error | Check MONGODB_URI in `.env.local` |
| Admin login fails | Verify ADMIN_PASSWORD matches `.env` |
| Images not showing | Use full HTTP/HTTPS URLs for images |
| Cart empty after refresh | Check localStorage is enabled |

## Next Steps

1. **Add more products** through admin panel
2. **Customize branding** - Change "DailyMart" to your store name
3. **Update colors** - Edit `app/globals.css` design tokens
4. **Add payment** - Integrate Stripe or Razorpay
5. **Setup emails** - Add order confirmation emails
6. **Analytics** - Add Google Analytics or Vercel Analytics

## Getting Help

- Check `DEPLOYMENT_GUIDE.md` for detailed setup
- Review Next.js docs: [nextjs.org](https://nextjs.org)
- MongoDB help: [mongodb.com/docs](https://docs.mongodb.com)
- Netlify support: [netlify.com/support](https://www.netlify.com/support)

---

**Ready to launch?** Your complete e-commerce store is ready! 🚀
