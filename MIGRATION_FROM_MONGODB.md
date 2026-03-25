# Migration from MongoDB to Neon PostgreSQL

This document explains what changed from the original MongoDB + Netlify setup to the new Neon PostgreSQL + Vercel setup.

## 🔄 What Changed

### Database
| Aspect | Before | After |
|--------|--------|-------|
| **Database** | MongoDB | PostgreSQL (Neon) |
| **Connection** | Mongoose ORM | @neondatabase/serverless |
| **Schema** | Mongoose models | SQL tables |
| **Data Types** | MongoDB types | PostgreSQL types |
| **ID Field** | `_id` (ObjectId) | `id` (UUID) |

### Image Storage
| Aspect | Before | After |
|--------|--------|-------|
| **Storage** | GridFS in MongoDB | URL-based (HTTPS) |
| **Upload Method** | Binary data | External URLs |
| **Access** | Direct from DB | Direct from CDN |

### Hosting
| Aspect | Before | After |
|--------|--------|-------|
| **Frontend** | Netlify | Vercel |
| **Backend** | Netlify Functions | Vercel Functions |
| **Deployment** | Manual | Automatic from GitHub |
| **Environment** | Netlify UI | Vercel Dashboard |

### Code Changes

#### Database Connection

**Before (MongoDB):**
```typescript
import mongoose from 'mongoose';

export async function connectToDatabase() {
  return mongoose.connect(MONGODB_URI);
}

const productSchema = new mongoose.Schema({ ... });
export const Product = mongoose.model('Product', productSchema);
```

**After (Neon PostgreSQL):**
```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function getProducts() {
  return sql`SELECT * FROM products`;
}
```

#### Product Data

**Before:**
```javascript
{
  _id: ObjectId("..."),
  name: "Milk",
  price: 50,
  imageUrl: "base64-or-gridfs-id"
}
```

**After:**
```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Milk",
  price: 50,
  image_url: "https://example.com/milk.jpg"
}
```

#### API Response Format

**Before:**
```javascript
// Returns array directly
[{ _id: "...", name: "..." }]
```

**After:**
```javascript
// Returns object with data property
{
  success: true,
  data: [{ id: "...", name: "..." }]
}
```

#### Frontend Components

**Before (MongoDB field names):**
```typescript
interface Product {
  _id: string;      // MongoDB ObjectId
  imageUrl?: string;
}

key={product._id}
src={product.imageUrl}
```

**After (PostgreSQL field names):**
```typescript
interface Product {
  id: string;        // PostgreSQL UUID
  image_url?: string;
}

key={product.id}
src={product.image_url}
```

## 📋 Migration Checklist

### Database
- [x] Created Neon account
- [x] Generated PostgreSQL connection string
- [x] Ran `/scripts/init-db.sql` to create tables
- [x] Verified tables exist in Neon console

### Backend
- [x] Replaced `mongodb` with `@neondatabase/serverless`
- [x] Updated `lib/db.ts` with SQL functions
- [x] Updated all API routes for new response format
- [x] Fixed parameterized queries

### Frontend
- [x] Changed `_id` to `id` in interfaces
- [x] Changed `imageUrl` to `image_url`
- [x] Updated API response parsing
- [x] Fixed product mapping in components

### Deployment
- [x] Created `vercel.json` for Vercel config
- [x] Removed `netlify.toml` Netlify config
- [x] Updated environment variables
- [x] Updated deployment documentation

## 🔍 SQL Schema

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(1000),
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## ✅ Verification

After migration, verify:

1. **Database Connection**
   ```bash
   # Should connect without errors
   pnpm dev
   ```

2. **Products Table**
   - Check in Neon console: Tables → products
   - Should have columns: id, name, price, description, image_url, stock

3. **Orders Table**
   - Check in Neon console: Tables → orders
   - Should have all customer fields

4. **API Endpoints**
   ```bash
   # GET products
   curl http://localhost:3000/api/products
   
   # Should return:
   { "success": true, "data": [...] }
   ```

5. **Frontend**
   - Homepage loads products
   - Admin panel can add/edit products
   - Images display correctly

## 🔧 Fixing Common Issues

### Products Not Showing
**Problem:** API returns empty array

**Solution:**
1. Check Neon console - is products table created?
2. Run `/scripts/init-db.sql` again
3. Add test product via admin panel

### Admin Login Issues
**Problem:** Admin login fails

**Solution:**
1. Check DATABASE_URL is set correctly
2. Verify admin_password matches env var
3. Clear cookies and try again

### Image Not Loading
**Problem:** Product image shows as broken

**Solution:**
1. Use HTTPS image URL only
2. Test URL directly in browser
3. For production: use Vercel Blob

## 📊 Data Migration (If You Have Existing Data)

If you have existing MongoDB data, export it and convert:

```javascript
// MongoDB export to PostgreSQL insert
const products = [
  {
    _id: ObjectId("..."),
    name: "Product Name",
    price: 100,
    description: "...",
    imageUrl: "data:image/..." // base64 or URL
  }
];

// Convert to PostgreSQL INSERT statements
products.forEach(p => {
  const sql = `
    INSERT INTO products (name, price, description, image_url, stock)
    VALUES ('${p.name}', ${p.price}, '${p.description}', '${p.imageUrl}', 100);
  `;
  console.log(sql);
});

// Execute in Neon SQL Editor
```

## 🎯 Benefits of New Setup

### PostgreSQL Advantages
- More reliable for structured data
- Better query performance
- Standard SQL (easier to scale)
- Free Neon tier is generous

### Vercel Advantages
- Zero infrastructure management
- Automatic HTTPS
- Git deployment integration
- Built-in scaling
- Better Node.js support

### Cost Comparison
- **MongoDB Atlas**: Free tier limited, paid tiers ~$57/month
- **Neon**: Free tier includes 2GB/month, paid starts ~$7/month
- **Netlify**: Free for static sites, but functions limited
- **Vercel**: Free tier includes functions, $20/month for more

## 🚀 Next Steps

1. **Test Locally**
   - Run `pnpm dev`
   - Add test products
   - Test checkout flow

2. **Deploy to Vercel**
   - Push to GitHub
   - Connect to Vercel
   - Set environment variables

3. **Production Optimizations**
   - Add Vercel Blob for images
   - Setup email notifications
   - Add payment processing
   - Monitor performance

## 📚 Resources

- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Database Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)

---

**Migration complete! Your store is now on PostgreSQL + Vercel.** 🎉
