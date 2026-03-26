# Troubleshooting Guide

## Issue: "next: command not found" or "Fatal error during initialization"

### What's Happening
When you see this error, it means the Next.js dependencies are still being installed. This is a normal part of the first-time setup and usually resolves automatically within 1-2 minutes.

### Solution: Wait for Dependencies to Install

**The system is automatically installing:**
- next (Next.js framework)
- react & react-dom (React framework)
- All UI components and utilities
- Tailwind CSS
- Database client (@neondatabase/serverless)

**This happens automatically - no action needed from you.**

### What to Do

1. **Wait 1-2 minutes** for the installation to complete
2. **Refresh the preview** (click the refresh button)
3. You should see the beautiful homepage appear!

### If It Still Doesn't Work

If after 2 minutes you still see the error:

1. **Click the three dots menu** (top right)
2. **Select "Settings"**
3. Check that:
   - ✅ Neon database is connected (you connected it earlier)
   - ✅ DATABASE_URL environment variable is set
   - ✅ No build errors in the output

### Manual Fix (if needed)

If dependencies still aren't installing, try this:

1. **Make a small change** to any file (like adding a comment in package.json)
2. **Save the file**
3. This will trigger the package manager to reinstall dependencies
4. **Wait 2-3 minutes** for installation to complete

### Expected Timeline

- **0-30 seconds:** Dependencies start downloading
- **30 seconds - 2 minutes:** Installation in progress
- **2+ minutes:** Dependencies complete, preview appears

---

## After Dependencies Install

You'll see a beautiful homepage with:
- Hero section with trust signals
- Feature cards (Fast Delivery, Secure, 24/7 Support, Quality Products)
- Product grid showing daily essentials
- Shopping cart functionality
- Search and filter capabilities
- Professional footer

## Admin Panel

Once the homepage is working:

1. Go to **http://localhost:3000/admin/login** (or your deployed URL + /admin/login)
2. Login with your admin password (set in environment variables)
3. Add products, manage inventory, view orders

---

## Still Having Issues?

**Check the Neon Integration:**
```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL
```

If DATABASE_URL is empty:
1. Go to Settings → Integrations
2. Confirm Neon database is connected
3. Copy the DATABASE_URL and add it to environment variables

**Check Project Structure:**
All these files should exist:
- ✅ `/app/page.tsx` (homepage)
- ✅ `/app/admin/login/page.tsx` (admin login)
- ✅ `/app/admin/dashboard/page.tsx` (admin panel)
- ✅ `/app/api/products/route.ts` (product API)
- ✅ `/app/api/orders/route.ts` (order API)
- ✅ `/lib/db.ts` (database client)
- ✅ `/package.json` (dependencies)

If you're missing any of these files, the build will fail.

---

## Still Stuck?

The most common causes are:

1. **Dependencies still installing** - Just wait a bit longer
2. **DATABASE_URL not set** - Check environment variables in Settings
3. **Browser cache** - Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. **Port already in use** - Close other dev servers

Try waiting 2-3 minutes, then refreshing the preview. The beautiful homepage should appear!
