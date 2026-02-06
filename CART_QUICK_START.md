# Quick Start Guide - Shopping Cart

## ⚡ Get Running in 5 Minutes

### Step 1: Start MongoDB
```bash
# If you have MongoDB installed locally
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 2: Start Backend
```bash
cd Backend/salon_e_com_server
npm install  # Only needed first time
npm run dev
```
✅ Backend running on `http://localhost:5000`

### Step 3: Start Frontend
```bash
cd Salon_E_Comm
npm install  # Only needed first time
npm run dev
```
✅ Frontend running on `http://localhost:5173`

---

## 🧪 Test Cart (Simple Flow)

### Step 1: Login
1. Open http://localhost:5173
2. Click "Login" button
3. Enter any email (e.g., `user1@test.com`)
4. Enter any password (e.g., `password123`)
5. Click "Sign In"

### Step 2: Add to Cart
1. Click on any product card
2. Adjust quantity with +/- buttons
3. Click "Add to Cart" button
4. See success message
5. Notice cart count in header changed!

### Step 3: View Cart
1. Click cart icon in header (with count badge)
2. See your products listed
3. Adjust quantities
4. Remove items if you want
5. See totals update automatically

### Step 4: Proceed to Checkout
1. Click "Proceed to Checkout" button
2. Verify your items are listed
3. Enter Agent ID (optional)
4. Select payment method
5. Click "Place Order"

---

## 👥 Test Multiple Users

### Test in Two Browsers
```
Browser 1                           Browser 2
===========                         ===========
Login as User 1                     Login as User 2
Add Product A to cart               Add Product B to cart
Cart shows: Product A               Cart shows: Product B
Cart count: 1                       Cart count: 1
```

### What You'll See
- Each user has completely separate cart
- User 1's cart unaffected by User 2's actions
- Products don't cross over
- Perfect isolation!

---

## 🛒 Cart Features

| Feature | How to Use |
|---------|-----------|
| Add to Cart | Click product → Select quantity → Click "Add to Cart" |
| View Cart | Click cart icon in header |
| Update Quantity | Use +/- buttons on cart page |
| Remove Item | Click "Remove" button |
| Clear Cart | Manual removal or logout/login |
| Proceed to Checkout | Click "Proceed to Checkout" button |

---

## ✅ Verify It's Working

### Frontend Signs
- ✅ Cart icon shows item count
- ✅ Cart page displays items
- ✅ Quantities can be updated
- ✅ Items can be removed
- ✅ Checkout has items

### Backend Signs (Check Terminal)
```
✅ Cart data saved in MongoDB
✅ Each user has separate cart
✅ Prices calculated correctly
✅ Items persist after logout
```

---

## 🔍 Debugging Checklist

| Issue | Solution |
|-------|----------|
| Cart is empty | Make sure you're logged in |
| Can't add to cart | Verify user is logged in |
| Multiple users same cart | Clear localStorage, logout, login again |
| Header count not updating | Refresh page or re-login |
| Backend errors | Check MongoDB is running |
| Frontend not loading | Check port 5173 is available |

---

## 📝 Endpoints to Know

```
# Add to cart
curl -X POST http://localhost:5000/api/v1/cart/add \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"productId":"507f1f77bcf86cd799439011","quantity":1}'

# View cart
curl http://localhost:5000/api/v1/cart \
  -H "Authorization: Bearer {token}"

# Update quantity
curl -X PATCH http://localhost:5000/api/v1/cart/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"quantity":3}'

# Remove from cart
curl -X DELETE http://localhost:5000/api/v1/cart/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer {token}"
```

---

## 🎯 Key Points

1. **Each user gets their own cart** - Completely isolated
2. **Cart persists** - Saved in MongoDB, survives logout
3. **Real-time updates** - Totals and counts update instantly
4. **Secure** - Protected by JWT authentication
5. **Works everywhere** - Mobile responsive design

---

## 💡 Pro Tips

- Use different browsers for different users
- Login with same email to see persisted cart
- Logout to switch users
- Check browser DevTools → Network to see API calls
- Check browser DevTools → Application → localStorage for JWT token

---

## 🚀 What Happens Behind the Scenes

```
User clicks "Add to Cart"
           ↓
Frontend: POST /api/v1/cart/add {productId, quantity}
           ↓
Backend: Extract userId from JWT token
           ↓
Backend: Find or create cart document for this userId
           ↓
Backend: Add product to that specific user's cart
           ↓
Backend: Calculate totals and save to MongoDB
           ↓
Backend: Return updated cart to frontend
           ↓
Frontend: Update React context with new cart data
           ↓
Frontend: Update UI (cart count in header, cart page, etc)
           ↓
User sees success message and item added!
```

---

## 🎓 Learning Resources

- `CART_IMPLEMENTATION_GUIDE.md` - Deep technical details
- `SHOPPING_CART_SUMMARY.md` - Feature overview
- `FRONTEND_BACKEND_INTEGRATION_GUIDE.md` - Architecture overview

---

**Ready to test?** Start with Step 1 above! 🚀

