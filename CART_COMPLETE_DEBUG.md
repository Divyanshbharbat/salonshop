# Complete Debugging Checklist for Cart Issue

## Step 1: Verify Products Are in Database

### Check via API:
Open in browser: `http://localhost:5000/api/v1/products`

**Expected Result:**
```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Professional Argan Oil 100ml",
      "price": 799,
      ...
    },
    ...
  ]
}
```

**If you see empty array `[]`:**
- Run seeder again: `node seed.js` in `Backend/salon_e_com_server`
- Check error messages from seeder output

---

## Step 2: Check Browser Console While Adding to Cart

### Do This:
1. Open DevTools (F12)
2. Go to **Console** tab
3. **Login** on the website
4. Go to a **product page**
5. Click **"Add to Cart"** button
6. **Watch the console**

### Look For These Logs (in order):

✅ **Should see:**
```
🛒 Adding to cart: { productId: "507f1f77bcf86cd799439011", quantity: 1, token: "eyJhbGciOi..." }
✅ Cart updated successfully: { _id: "...", userId: "...", items: [{...}], totalPrice: 799, totalItems: 1 }
```

❌ **If you see errors, post them here:**
```
❌ Add to cart error: Product not found
❌ Add to cart error: Unauthorized
❌ Add to cart error: [other error message]
```

---

## Step 3: Check Network Request

### Do This:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Click **"Add to Cart"** button
4. Look for request named `add` (POST to `/api/v1/cart/add`)

### Check These:

#### Request Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

#### Request Body:
```
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 1
}
```

#### Response Status:
- ✅ **201** or **200** = Success
- ❌ **400** = Bad request (check error message)
- ❌ **401** = Not authenticated (token issue)
- ❌ **500** = Server error

#### Response Body:
```
{
  "_id": "...",
  "userId": "...",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "Professional Argan Oil 100ml",
      "price": 799,
      "quantity": 1
    }
  ],
  "totalPrice": 799,
  "totalItems": 1
}
```

---

## Step 4: Click Cart Icon & Check Console Again

### Do This:
1. After adding to cart (step 2 above)
2. Click **cart icon** (🛒) in header
3. **Watch console**

### Look For:

✅ **Should see:**
```
📦 CartPage loaded: { 
  cart: { _id: "...", items: [{...}], totalPrice: 799 },
  items: [{productId: "...", productName: "...", price: 799, quantity: 1}],
  loading: false,
  totalPrice: 799,
  totalItems: 1
}
```

❌ **If you see:**
```
⚠️ Cart is empty. Items: []
```
Then the API returned an empty cart (or no items array)

---

## Step 5: Verify Token is Valid

### Check localStorage:
1. Open DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Find `authToken`
4. Copy the token value
5. Go to https://jwt.io
6. Paste token in **Encoded** box
7. Check the **Payload** section

### Should see:
```json
{
  "id": "507f1f77bcf86cd799439012",  // Your userId
  "email": "your@email.com",
  "role": "CUSTOMER",
  "iat": 1705939200,
  "exp": 1706025600
}
```

If token is missing or invalid → **You're not logged in!** Login again.

---

## Step 6: Check MongoDB Directly (Optional)

If you have MongoDB Compass:

1. Connect to `mongodb://localhost:27017`
2. Open `salon_e_com` database
3. Go to `carts` collection
4. Find a document with your userId

### Should see structure:
```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("507f1f77bcf86cd799439012"),
  "items": [
    {
      "productId": ObjectId("507f1f77bcf86cd799439011"),
      "productName": "Professional Argan Oil 100ml",
      "price": 799,
      "quantity": 1,
      "addedAt": ISODate(...)
    }
  ],
  "totalPrice": 799,
  "totalItems": 1,
  "createdAt": ISODate(...),
  "updatedAt": ISODate(...)
}
```

---

## Common Issues & Fixes

### Issue 1: "Product not found" error
**Cause:** Products table is empty or product ID is wrong
**Fix:** Run `node seed.js` again

### Issue 2: "Unauthorized" error
**Cause:** Token not sent or expired
**Fix:** 
- Logout: Click Logout button
- Login again: Use credentials
- Try adding to cart again

### Issue 3: Cart shows empty after refresh
**Cause:** Cart state lost on page refresh, but data is in MongoDB
**Fix:** 
- This is normal! CartContext refetches on load
- Check console for "Fetching cart from API..." log
- Wait a moment for cart to load

### Issue 4: No error, but cart still empty
**Cause:** Items added but CartContext not updated
**Fix:**
- Close CartPage completely
- Go to product page
- Add to cart again
- Open cart again (let it fully load)

---

## Complete Test Sequence

Follow this exact sequence:

```
1. Fresh Start:
   - Open DevTools (F12)
   - Go to Console tab
   - Go to Application → Local Storage → Delete authToken

2. Login:
   - Login with email/password
   - Check token added to localStorage
   - See "✅ Login successful" message

3. Product Page:
   - Click a product
   - Check console shows product loaded
   - See product._id in console logs

4. Add to Cart:
   - Set quantity to 2
   - Click "Add to Cart"
   - Watch console for logs:
     - 🛒 Adding to cart: {...}
     - ✅ Cart updated successfully: {...items: [...]...}
   - See success alert message

5. View Cart:
   - Click cart icon
   - Console shows: 📦 CartPage loaded: {...items: [...]...}
   - Page displays: Your product with quantity 2

6. Verify Persistence:
   - Refresh page (F5)
   - Still logged in?
   - Click cart icon
   - Items still there?
   - ✅ SUCCESS!
```

---

## What to Report If Still Not Working

Share these details:

1. **Screenshot of console errors** (when clicking "Add to Cart")
2. **Screenshot of Network tab** (the POST request response)
3. **Screenshot of what you see in browser** (empty cart? error message?)
4. **MongoDB connection** (running? connected to salon_e_com db?)
5. **Backend running** (on port 5000? showing requests in terminal?)

---

## Quick Restart Procedure

If everything seems broken:

```bash
# Terminal 1 - Stop everything
Ctrl+C
Ctrl+C

# Terminal 1 - Clear and restart backend
cd Backend/salon_e_com_server
npm start

# Terminal 2 - In new terminal, clear and restart frontend
cd Salon_E_Comm
npm run dev

# Browser - Hard refresh
Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# Then test again
```

---

**Follow these steps and share the console logs/errors you see!**
