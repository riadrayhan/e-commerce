# Test Data & Testing Guide

Use this guide to populate your store with test products and verify all features work correctly.

## Sample Products to Add

Copy these products into your admin panel to test. You can use the image URLs provided.

### Product 1: Fresh Milk
```
Name: Fresh Milk 1L
Price: 45
Description: Pure and fresh pasteurized milk, rich in calcium and protein. Delivered fresh daily. Perfect for breakfast and cooking.
Image URL: https://images.unsplash.com/photo-1550583890-46b16ae0981f?w=400
Stock: 50
```

### Product 2: Whole Wheat Flour
```
Name: Whole Wheat Flour 1kg
Price: 60
Description: Premium quality whole wheat flour for making healthy rotis, bread, and other baked goods. Rich in fiber and nutrients.
Image URL: https://images.unsplash.com/photo-1586985289688-cacf313f826e?w=400
Stock: 40
```

### Product 3: Cooking Oil
```
Name: Cooking Oil 1L
Price: 150
Description: Pure vegetable cooking oil, ideal for everyday cooking. Light and healthy. Suitable for deep frying and sautéing.
Image URL: https://images.unsplash.com/photo-1592189519833-3f66afc7ecc8?w=400
Stock: 35
```

### Product 4: Rice
```
Name: Basmati Rice 1kg
Price: 120
Description: Premium long-grain basmati rice. Perfect for making delicious biryanis, pulaos, and regular rice meals. Aromatic and fluffy.
Image URL: https://images.unsplash.com/photo-1586857826885-d0d6f2edf36e?w=400
Stock: 60
```

### Product 5: Eggs
```
Name: Fresh Eggs (Dozen)
Price: 75
Description: Farm fresh brown eggs, rich in protein and nutrients. Great for breakfast and baking. Delivered in sturdy packaging.
Image URL: https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400
Stock: 100
```

### Product 6: Sugar
```
Name: Sugar 1kg
Price: 50
Description: Pure granulated sugar for everyday use. Sweet and fine quality. Perfect for tea, coffee, and desserts.
Image URL: https://images.unsplash.com/photo-1599599810694-b5ac4dd64e6a?w=400
Stock: 45
```

### Product 7: Salt
```
Name: Iodized Salt 500g
Price: 30
Description: Pure iodized salt with anti-caking agents. Essential mineral for cooking. Improves taste and health.
Image URL: https://images.unsplash.com/photo-1599599810694-b5ac4dd64e6a?w=400
Stock: 80
```

### Product 8: Tea
```
Name: Premium Black Tea 500g
Price: 250
Description: Finest quality black tea leaves. Aromatic and flavorful. Perfect for morning tea. Gives strong brew.
Image URL: https://images.unsplash.com/photo-1597318972826-a12db313df6b?w=400
Stock: 25
```

### Product 9: Coffee
```
Name: Ground Coffee 250g
Price: 280
Description: Freshly ground premium coffee beans. Rich aroma and bold taste. Perfect for coffee lovers. Medium roast.
Image URL: https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400
Stock: 30
```

### Product 10: Soap
```
Name: Bathing Soap 100g
Price: 25
Description: Premium bathing soap with natural ingredients. Gentle on skin. Moisturizing formula. Pack of 3.
Image URL: https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400
Stock: 150
```

## How to Add Test Products

1. Login to admin panel: `http://localhost:3000/admin/login`
2. Enter your admin password
3. Click "Add Product"
4. Fill in the details from above
5. Click "Add Product"
6. Repeat for each product

**Note**: You can use the image URLs provided, or upload your own images to a free service like:
- Unsplash (free stock images)
- Pexels
- Pixabay
- Imgur

## Testing Checklist

### Homepage Testing
- [ ] All products display on homepage
- [ ] Product images load correctly
- [ ] Product prices show correctly (₹ symbol)
- [ ] Stock status shows (In Stock/Out of Stock)
- [ ] Search functionality works
- [ ] Page is responsive on mobile
- [ ] "View Details" button works

### Product Details Testing
- [ ] Product name displays correctly
- [ ] Full description visible
- [ ] Price shows with ₹ symbol
- [ ] Stock information accurate
- [ ] Quantity selector allows ±1
- [ ] Cannot go below 1 item
- [ ] "Add to Cart" button works
- [ ] Redirects to cart after adding

### Shopping Cart Testing
- [ ] Products appear in cart
- [ ] Correct product names show
- [ ] Prices match product pages
- [ ] Quantities display correctly
- [ ] Subtotal calculates correctly
- [ ] Tax (10%) calculates
- [ ] Total is correct (subtotal + tax)
- [ ] Can remove items
- [ ] Can adjust quantities
- [ ] "Continue Shopping" works

### Checkout Testing
- [ ] Cart items visible on checkout
- [ ] All form fields required
- [ ] Can fill customer information
- [ ] Phone number validation (10 digits)
- [ ] Payment method shows COD
- [ ] Order summary accurate
- [ ] Submit order works
- [ ] Order number generated
- [ ] Confirmation page shows

### Order Confirmation Testing
- [ ] Order number visible
- [ ] Customer details display
- [ ] All items listed
- [ ] Total amount correct
- [ ] Next steps instructions clear
- [ ] Can go back to shopping

### Admin Panel Testing
- [ ] Login page accessible
- [ ] Wrong password rejected
- [ ] Correct password allows access
- [ ] Product list displays
- [ ] Can edit products
- [ ] Changes save correctly
- [ ] Can delete products
- [ ] Deletion shows confirmation
- [ ] Can add new products
- [ ] Logout works

### Mobile Testing
- [ ] Homepage responsive
- [ ] Product images sized correctly
- [ ] Buttons easily clickable
- [ ] Form inputs readable
- [ ] Cart summary visible
- [ ] Checkout form fits screen
- [ ] Navigation works on mobile
- [ ] No horizontal scrolling

### API Testing (Optional)

Using curl or Postman:

**Get all products:**
```bash
curl http://localhost:3000/api/products
```

**Get single product:**
```bash
curl http://localhost:3000/api/products/[PRODUCT_ID]
```

**Create order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "[PRODUCT_ID]",
        "productName": "Test Product",
        "price": 100,
        "quantity": 1
      }
    ],
    "customer": {
      "name": "Test User",
      "phone": "9876543210",
      "address": "123 Test Street",
      "city": "Test City",
      "pincode": "123456"
    },
    "totalAmount": 110
  }'
```

**Get all orders:**
```bash
curl http://localhost:3000/api/orders
```

## Test User Data

### Admin Test
```
Admin Password: (Set in .env.local)
Default: admin123
```

### Test Customer Order
```
Name: John Doe
Phone: 9876543210
Address: 123 Main Street, Apt 5
City: New York
Pincode: 100001
```

## Common Testing Scenarios

### Scenario 1: Complete Purchase
1. Browse products on homepage
2. Search for "Milk"
3. Click on "Fresh Milk"
4. View details
5. Add 2 items to cart
6. Go to cart
7. Modify quantity
8. Checkout
9. Fill customer details
10. Submit order
11. View confirmation

### Scenario 2: Admin Management
1. Login to admin
2. Add new product
3. View it on homepage
4. Edit product (change price)
5. Verify price changed
6. Delete product
7. Verify it's gone from homepage

### Scenario 3: Mobile Purchase
1. Open site on mobile
2. Browse products
3. Add item to cart
4. View cart
5. Checkout on mobile
6. Fill form (test auto-fill)
7. Submit
8. Verify success page

## Performance Testing

Check these metrics:

- **Lighthouse Score**: Run in Chrome DevTools
- **Page Load Time**: Should be < 2 seconds
- **Mobile Score**: Should be > 80
- **First Contentful Paint**: < 1.5 seconds

## Troubleshooting During Testing

| Issue | Solution |
|-------|----------|
| Products not showing | Check MongoDB connection |
| Images not loading | Verify image URLs are correct |
| Cart empty on refresh | Check localStorage is enabled |
| Admin login fails | Verify ADMIN_PASSWORD in .env |
| Checkout not working | Check browser console for errors |
| Orders not saving | Verify MongoDB connection |

## Success Criteria

Your store is ready for production when:
- ✅ All 10 products added successfully
- ✅ All test scenarios pass
- ✅ Mobile version works perfectly
- ✅ Orders are saved to database
- ✅ Admin can manage products
- ✅ Checkout process smooth
- ✅ No console errors
- ✅ Performance is good

## Clean Up Test Data

To remove all test products:

1. **Option 1**: Delete through admin panel one by one
2. **Option 2**: Delete through MongoDB Atlas
   - Go to MongoDB Collections
   - Find products collection
   - Delete all documents

To reset orders:
1. Go to MongoDB Atlas
2. Find orders collection
3. Delete all documents

## Next Steps

Once testing is complete:
1. Add real products
2. Update store name
3. Customize colors
4. Deploy to Netlify
5. Start taking orders!

---

Happy testing! Report any issues and make improvements as needed.
