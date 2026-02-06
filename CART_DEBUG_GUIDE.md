# Cart Issue Debugging Guide

## The Problem
Items added to cart are not showing up in the Cart page.

## Root Cause Analysis

The issue is likely one of these:

### 1. **Product ID Mismatch**
- Mock data uses `id` (numbers: 1, 2, 3)
- MongoDB uses `_id` (ObjectIds: 507f1f77bcf86cd799439011)
- When adding to cart with numeric ID, backend can't find the product

### 2. **Cart Not Refreshing After Add**
- CartContext fetches cart only on mount
- After adding item, the cart state might not update

## How to Debug (Step by Step)

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Add item to cart
4. Look for logs like:
   ```
   Adding to cart: { productId: "...", quantity: 2 }
   Cart updated: { items: [...], totalPrice: ... }
   ```

### Step 2: Check Network Tab
1. In DevTools, go to **Network** tab
2. Add item to cart
3. Look for POST request to: `http://localhost:5000/api/v1/cart/add`
4. Check the response:
   - ✅ Should be status 201 or 200
   - ✅ Response body should contain cart with items array
   - ❌ If 400 or 500 error, check the error message

### Step 3: Check localStorage
1. In DevTools, go to **Application** → **Local Storage**
2. Look for `authToken` - should exist if logged in
3. Copy the token and decode it at jwt.io to see the userId

### Step 4: Check MongoDB
If you have MongoDB Compass installed:
1. Connect to MongoDB
2. Go to database `salon_db` (or your DB name)
3. Look at `carts` collection
4. Find a document with your userId
5. Check if `items` array has your product

---

## Solution: Try These Steps

### Option A: Use API Products (Recommended)
Make sure your backend has products in MongoDB:

1. **Ensure backend is running**: 
   ```bash
   cd Backend/salon_e_com_server
   npm start
   ```

2. **Check if products exist** by visiting:
   ```
   http://localhost:5000/api/v1/products
   ```
   Should show JSON array of products with `_id` field

3. If no products, run the seeder script (if available)

### Option B: Clear & Restart
1. **Clear localStorage**: Open DevTools → Application → Local Storage → Delete all
2. **Logout and login again**
3. **Try adding to cart again**

### Option C: Check if Middleware is Working
The cart routes need the `@protect` middleware to extract userId from token.

Verify in cart.routes.js:
```javascript
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();
router.use(protect); // This must be here!
```

---

## What to Look For

### ✅ Successful Flow
```
1. Click "Add to Cart"
   ↓
2. Console shows: Adding to cart: { productId: "xxx", quantity: 1 }
   ↓
3. Network request to /api/v1/cart/add returns 201
   ↓
4. Console shows: Cart updated: { items: [{...}], totalPrice: ... }
   ↓
5. Click cart icon → Items appear in cart page
   ↓
6. Refresh page → Items still there (persisted in MongoDB)
```

### ❌ Common Errors

**Error: "Product not found"**
- Solution: Make sure product ID exists in database

**Error: "Unauthorized"**
- Solution: Check token is being sent (check Network tab headers)
- Look for: `Authorization: Bearer <token>`

**Error: "Cart not found"**
- Solution: Try logging out and back in

**Items not showing after refresh**
- Solution: Check MongoDB - cart might be created but not fetched

---

## Manual Testing with curl/Postman

### 1. Login to get token
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```
Copy the `token` from response

### 2. Add to cart
```bash
curl -X POST http://localhost:5000/api/v1/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"productId":"<PRODUCT_ID>","quantity":2}'
```
Replace `<YOUR_TOKEN>` and `<PRODUCT_ID>`

### 3. Get cart
```bash
curl -X GET http://localhost:5000/api/v1/cart \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## If All Else Fails

Try this complete fresh start:

1. **Stop backend and frontend** (Ctrl+C in both terminals)

2. **Clear MongoDB** (optional but recommended):
   - Use MongoDB Compass to delete the entire `salon_db` database

3. **Clear browser cache**:
   - DevTools → Storage → Clear all

4. **Restart everything**:
   ```bash
   # Terminal 1
   cd Backend/salon_e_com_server
   npm start
   
   # Terminal 2 (new terminal)
   cd Salon_E_Comm
   npm run dev
   ```

5. **Test again**:
   - Go to http://localhost:5173
   - Click Sign Up (create new account)
   - Browse products
   - Add to cart
   - Check cart page

---

## Key Files to Check

If issues persist, review these files:

1. **Frontend**:
   - `src/context/CartContext.jsx` - Check console logs
   - `src/pages/ProductDetailPage.jsx` - Check product ID extraction
   - `src/pages/CartPage.jsx` - Check items display logic

2. **Backend**:
   - `src/v1/routes/cart.routes.js` - Check all routes mounted
   - `src/v1/controllers/cart.controller.js` - Check error handling
   - `src/v1/services/cart.service.js` - Check database operations

---

## Need More Help?

Check the browser console for specific error messages and share them!
