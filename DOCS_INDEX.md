# DailyMart Documentation Index

Welcome! Start here to navigate all documentation for your e-commerce store.

## 🚀 Quick Start (Choose Your Path)

### I Want to Run It Locally Right Now
→ **[QUICK_START.md](./QUICK_START.md)** (5 minutes)

Just follow 4 simple steps and you'll have the store running locally. Includes setup for Neon database and running the Next.js dev server.

### I Want to Deploy to Production
→ **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** (Detailed)

Complete step-by-step guide to deploy your store to Vercel with Neon database. Includes environment setup, GitHub integration, and troubleshooting.

### I Want to Understand Everything
→ **[README.md](./README.md)** (Comprehensive)

Full overview of the project, features, tech stack, API documentation, and security information.

## 📚 Documentation by Topic

### Setup & Deployment

| Document | Time | Purpose |
|----------|------|---------|
| [QUICK_START.md](./QUICK_START.md) | 5 min | Get running locally fast |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | 15 min | Deploy to Vercel with Neon |
| [vercel.json](./vercel.json) | - | Vercel deployment config |
| [.env.example](./.env.example) | - | Environment variables template |

### Project Information

| Document | Details |
|----------|---------|
| [README.md](./README.md) | Main project overview |
| [README_ECOMMERCE.md](./README_ECOMMERCE.md) | E-commerce features & architecture |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Technical summary |

### Development & Testing

| Document | Details |
|----------|---------|
| [TEST_DATA.md](./TEST_DATA.md) | Testing guide with sample products |
| [MIGRATION_FROM_MONGODB.md](./MIGRATION_FROM_MONGODB.md) | MongoDB to PostgreSQL migration |

### Database

| File | Purpose |
|------|---------|
| [scripts/init-db.sql](./scripts/init-db.sql) | Create database tables |
| [lib/db.ts](./lib/db.ts) | Database query functions |

## 🎯 Step-by-Step Guides

### First Time Setup

1. **Database Setup** (5 mins)
   - Create Neon account
   - Get connection string
   - Run init script
   - See: QUICK_START.md (Step 1)

2. **Local Development** (5 mins)
   - Install dependencies
   - Create .env.local
   - Run dev server
   - See: QUICK_START.md (Steps 2-4)

3. **Test the Store** (5 mins)
   - Add test product
   - Shop as customer
   - Test checkout
   - See: TEST_DATA.md

4. **Deploy to Production** (10 mins)
   - Push to GitHub
   - Connect to Vercel
   - Add env variables
   - Deploy
   - See: DEPLOYMENT_GUIDE.md

### Common Tasks

**Add a Product**
1. Go to `/admin/login` (password: admin123)
2. Click "Add Product"
3. Fill in name, price, description
4. Add image URL (https only)
5. Click "Add Product"

See: [Admin Dashboard](#admin-dashboard)

**Test Checkout**
1. Go to homepage
2. Click on a product
3. Click "Add to Cart"
4. Go to `/cart`
5. Click "Proceed to Checkout"
6. Enter name, phone, address
7. Place order
8. See confirmation

See: [TEST_DATA.md](./TEST_DATA.md)

**Deploy Changes**
1. Make code changes
2. Commit: `git commit -m "..."`
3. Push: `git push origin main`
4. Vercel auto-deploys!

See: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📁 Project Structure

```
DailyMart/
├── QUICK_START.md              ← Start here!
├── DEPLOYMENT_GUIDE.md         ← Deploy here
├── README.md                   ← Full overview
├── TEST_DATA.md                ← Testing guide
├── DOCS_INDEX.md               ← You are here
│
├── app/
│   ├── api/
│   │   ├── products/           # Product endpoints
│   │   ├── orders/             # Order endpoints
│   │   └── admin/              # Auth endpoints
│   ├── admin/                  # Admin panel
│   ├── product/                # Product detail page
│   ├── cart/                   # Shopping cart
│   ├── checkout/               # Checkout page
│   └── page.tsx                # Homepage
│
├── lib/
│   ├── db.ts                   # Database functions
│   └── auth.ts                 # Auth utilities
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── admin-protected.tsx     # Auth wrapper
│
├── scripts/
│   └── init-db.sql             # Create tables
│
├── public/                     # Static files
├── vercel.json                 # Vercel config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── .env.example                # Env template
```

## 🔑 Key Concepts

### Authentication
- Admin panel protected with password
- JWT tokens stored in HTTP-only cookies
- Token verified on every admin page
- See: [lib/auth.ts](./lib/auth.ts)

### Database
- PostgreSQL via Neon
- Tables: products, orders
- SQL queries with parameterization
- See: [scripts/init-db.sql](./scripts/init-db.sql)

### API
- REST endpoints for products, orders
- JSON request/response format
- Error handling and validation
- See: [app/api/](./app/api/)

### Deployment
- Vercel handles frontend & backend
- Automatic scaling
- Zero config needed
- See: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## ❓ Troubleshooting

### "DATABASE_URL is not set"
→ Check `.env.local` file exists and has correct connection string
→ See: [QUICK_START.md](./QUICK_START.md#step-3-setup-local-environment)

### "Admin login not working"
→ Default password is `admin123`
→ Check `ADMIN_PASSWORD` in `.env.local`
→ See: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#troubleshooting)

### "No products showing"
→ Run `/scripts/init-db.sql` in Neon SQL Editor
→ Check products table exists
→ Add test product
→ See: [TEST_DATA.md](./TEST_DATA.md)

### "Images not displaying"
→ Use HTTPS URLs only
→ Test URL in browser first
→ For production use Vercel Blob
→ See: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#upgrade-to-production)

For more help, see: [DEPLOYMENT_GUIDE.md - Troubleshooting](./DEPLOYMENT_GUIDE.md#troubleshooting)

## 📞 Support Resources

| Issue | Resource |
|-------|----------|
| Setup help | [QUICK_START.md](./QUICK_START.md) |
| Deployment issues | [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) |
| Testing | [TEST_DATA.md](./TEST_DATA.md) |
| Neon problems | [Neon Docs](https://neon.tech/docs) |
| Vercel problems | [Vercel Docs](https://vercel.com/docs) |
| Next.js questions | [Next.js Docs](https://nextjs.org/docs) |

## 🎓 Learning Path

**Beginner** (Just want it working)
1. [QUICK_START.md](./QUICK_START.md) - Setup locally
2. [TEST_DATA.md](./TEST_DATA.md) - Test the store
3. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deploy to production

**Intermediate** (Want to customize)
1. [README.md](./README.md) - Understand the project
2. Review [app/](./app/) directory structure
3. Modify components and styles
4. Deploy changes to Vercel

**Advanced** (Want to extend)
1. [README_ECOMMERCE.md](./README_ECOMMERCE.md) - Full architecture
2. Review [app/api/](./app/api/) endpoints
3. Extend database schema
4. Add payment integration
5. Add email notifications

## 🔄 Common Workflows

### Add New Feature
1. Make changes locally
2. Test with `pnpm dev`
3. Commit: `git commit -m "Add feature"`
4. Push: `git push`
5. Vercel auto-deploys

### Modify Database
1. Update [scripts/init-db.sql](./scripts/init-db.sql)
2. Run in Neon SQL Editor
3. Update [lib/db.ts](./lib/db.ts) functions
4. Test locally
5. Deploy

### Debug Issues
1. Check `pnpm dev` logs
2. Use browser DevTools (F12)
3. Check Vercel dashboard logs
4. Check Neon console
5. See troubleshooting section

## 📋 Checklist

Getting started:
- [ ] Read [QUICK_START.md](./QUICK_START.md)
- [ ] Create Neon account
- [ ] Run `/scripts/init-db.sql`
- [ ] Setup `.env.local`
- [ ] Run `pnpm install && pnpm dev`
- [ ] Add test product
- [ ] Test checkout

Before deploying:
- [ ] Test locally with `pnpm dev`
- [ ] Test admin panel
- [ ] Test product add/edit/delete
- [ ] Test checkout flow
- [ ] Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [ ] Push code to GitHub
- [ ] Set up Vercel project
- [ ] Add environment variables

## 🎉 You're All Set!

Everything is set up and ready to go. Start with [QUICK_START.md](./QUICK_START.md) and follow the path that matches your needs.

**Questions?** Check the relevant documentation section above, or review the troubleshooting guide.

**Ready to deploy?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Want to test first?** See [TEST_DATA.md](./TEST_DATA.md)

---

**Happy building! 🚀**
