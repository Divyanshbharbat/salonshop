# Shopping Cart Implementation Guide

## Overview
A complete user-specific shopping cart system has been implemented that:
- Stores cart data in the backend (MongoDB)
- Associates each cart with an authenticated user
- Displays different cart data for different users
- Persists across sessions and page refreshes
- Real-time updates through API

---

## Backend Implementation

### 1. **Cart Model** (`src/v1/models/Cart.js`)
```javascript
{
  userId: ObjectId (unique),
  items: [
    {
      productId: ObjectId,
      productName: String,
      productImage: String,
      price: Number,
      quantity: Number,
      addedAt: Date
    }
  ],
  totalPrice: Number,
  totalItems: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Cart Service** (`src/v1/services/cart.service.js`)
- `getCart(userId)` - Retrieve user's cart
- `addToCart(userId, productId, quantity)` - Add product to cart
- `removeFromCart(userId, productId)` - Remove product from cart
- `updateCartItem(userId, productId, quantity)` - Update quantity
- `clearCart(userId)` - Empty entire cart
- `getCartTotal(userId)` - Get cart summary

### 3. **Cart Controller** (`src/v1/controllers/cart.controller.js`)
Handles all API requests with error handling.

### 4. **Cart Routes** (`src/v1/routes/cart.routes.js`)
All routes are protected with `@protect` middleware:
```
GET    /api/v1/cart              - Get cart
POST   /api/v1/cart/add          - Add to cart
PATCH  /api/v1/cart/:productId   - Update quantity
DELETE /api/v1/cart/:productId   - Remove from cart
DELETE /api/v1/cart              - Clear cart
GET    /api/v1/cart/total        - Get cart totals
```

---

## Frontend Implementation

### 1. **API Client** (`src/utils/apiClient.js`)
```javascript
// Add to cart
await cartAPI.addToCart(productId, quantity);

// Get cart
await cartAPI.getCart();

// Update cart
await cartAPI.updateCart(productId, quantity);

// Remove from cart
await cartAPI.removeFromCart(productId);

// Clear cart
await cartAPI.clearCart();

// Get totals
await cartAPI.getCartTotal();
```

### 2. **Cart Context** (`src/context/CartContext.jsx`)
Global state management for cart:
```javascript
const { cart, items, addToCart, removeFromCart, updateCartItem, getCartTotal } = useCart();
```

Features:
- Auto-fetches cart on login
- Manages cart state globally
- Handles loading and error states
- Automatically recalculates totals

### 3. **CartProvider Wrapper** (in `App.jsx`)
Wraps entire application to provide cart context to all components.

### 4. **Cart Page** (`src/pages/CartPage.jsx`)
- Displays all cart items
- Update quantities with +/- buttons
- Remove individual items
- View order summary
- Proceed to checkout

### 5. **Header Cart Icon** (`src/components/layout/Header.jsx`)
- Shows real-time item count
- Redirects to cart page
- Requires login to view cart

### 6. **Product Detail Page Integration** (`src/pages/ProductDetailPage.jsx`)
- "Add to Cart" button with loading state
- Requires user to be logged in
- Shows success/error messages
- Resets quantity after successful add

### 7. **Checkout Page Integration** (`src/pages/CheckoutPage.jsx`)
- Displays cart items from context
- Calculates taxes and discounts dynamically
- Uses real cart total for order amount
- Creates order with cart items

---

## User Flow

### User 1 Login & Cart
1. User 1 logs in → gets JWT token
2. CartContext fetches `/api/v1/cart` → gets User 1's cart
3. User 1 browses products
4. User 1 clicks "Add to Cart" on Product A
   - POST `/api/v1/cart/add` with `{productId, quantity}`
   - Backend adds to User 1's cart (tied to User 1's ID)
   - Cart updated in context
5. User 1 goes to cart page → sees their items
6. User 1 proceeds to checkout → creates order with their cart

### User 2 Login & Cart (Same Browser/Device)
1. User 1 logs out
2. User 2 logs in → gets different JWT token
3. CartContext clears previous cart and fetches `/api/v1/cart` → gets User 2's cart (empty initially)
4. User 2 adds Product B to cart
   - POST `/api/v1/cart/add` with `{productId, quantity}`
   - Backend adds to User 2's cart (tied to User 2's ID, NOT User 1's)
   - Only User 2 sees Product B in their cart
5. User 2 goes to cart page → sees ONLY their items

### Key Points
- Cart data stored in MongoDB tied to `userId`
- No cart data shared between users
- JWT token ensures backend knows which user is making request
- Each user has their own isolated cart

---

## API Endpoints Detailed

### Get Cart
```
GET /api/v1/cart
Authorization: Bearer {token}

Response:
{
  _id: "...",
  userId: "user123",
  items: [
    {
      productId: "prod456",
      productName: "Argan Oil",
      price: 4200,
      quantity: 2,
      productImage: "url"
    }
  ],
  totalPrice: 8400,
  totalItems: 2,
  createdAt: "2024-01-25T..."
}
```

### Add to Cart
```
POST /api/v1/cart/add
Authorization: Bearer {token}
Body: { productId: "prod456", quantity: 1 }

Response: Updated cart object
```

### Update Cart Item
```
PATCH /api/v1/cart/:productId
Authorization: Bearer {token}
Body: { quantity: 3 }

Response: Updated cart object
```

### Remove from Cart
```
DELETE /api/v1/cart/:productId
Authorization: Bearer {token}

Response: Updated cart object
```

### Clear Cart
```
DELETE /api/v1/cart
Authorization: Bearer {token}

Response: Empty cart object
```

---

## Testing the Cart

### Test Scenario 1: Single User
1. Start backend: `npm run dev`
2. Start frontend: `npm run dev`
3. Login as User 1
4. Add Product A to cart
5. Verify cart shows 1 item
6. Navigate to `/cart` page
7. See Product A with correct price/quantity
8. Update quantity
9. Verify totals update
10. Proceed to checkout

### Test Scenario 2: Multiple Users
1. User 1 logs in and adds 2 items to cart
2. View cart → shows 2 items
3. Open second browser/incognito window
4. User 2 logs in
5. User 2 adds 1 different item to cart
6. User 2's cart shows only 1 item (not User 1's 2 items)
7. User 1's original browser still shows 2 items
8. Switch back to User 1 → cart unchanged

### Test Scenario 3: Logout/Login
1. User 1 logs in, adds items
2. User 1 logs out
3. User 1 logs back in
4. Cart should still have their items (persisted in backend)

---

## Component Relationships

```
App.jsx (CartProvider wrapper)
├── Header.jsx (uses useCart for cart count)
├── HomePage.jsx
├── ProductDetailPage.jsx (uses useCart.addToCart)
├── CartPage.jsx (displays useCart.items)
├── CheckoutPage.jsx (uses useCart.items for order)
└── LoginPage.jsx (triggers CartContext.fetchCart on login)
```

---

## Error Handling

### Frontend
- "Please login to add items to cart" - if no token
- "Please login to view your cart" - if accessing cart without login
- API errors displayed to user with alert
- Graceful fallback to mock data where applicable

### Backend
- 401 Unauthorized if token missing/invalid
- 400 Bad Request if productId missing
- 404 Not Found if product doesn't exist
- 500 Server Error with meaningful message

---

## Performance Considerations

1. **Fetch on Mount** - Cart fetched once when app loads
2. **Conditional Fetches** - Only fetch if user logged in
3. **Caching** - Cart stored in React context (not fetched on every page)
4. **Debouncing** - Consider adding debounce for rapid add/remove actions
5. **Lazy Loading** - Cart page only loads when visited

---

## Future Enhancements

1. **Wishlist** - Save items for later
2. **Bulk Orders** - Buy same item multiple times with bulk discount
3. **Cart Recovery** - Recover abandoned carts
4. **Cart Sharing** - Share cart with others
5. **Stock Notifications** - Alert when out-of-stock items back in stock
6. **Cart Analytics** - Track popular products added to carts
7. **Persistent Storage** - Sync with localStorage as backup
8. **Cart Expiry** - Expire carts after 30 days

---

## Security Notes

- All cart endpoints protected with `@protect` middleware
- Cart data isolated per user via `userId`
- Cannot access other users' carts via ID manipulation (userId comes from token)
- Quantities validated on backend (must be > 0)
- Product prices fetched from database (not trusting frontend price)

---

## Troubleshooting

### Cart not showing items after login
- Ensure CartProvider wraps app
- Check browser console for errors
- Verify JWT token stored in localStorage
- Check backend is running on port 5000

### Items visible for wrong user
- Logout completely and clear browser cache
- Verify backend is checking userId from token
- Check MongoDB has separate cart documents per user

### Add to Cart button not working
- Ensure user is logged in
- Check ProductDetailPage imports useCart
- Verify product has valid _id

### Cart counts not updating in Header
- Ensure Header component uses useCart hook
- Check CartContext is providing cart data
- Verify getCartTotal calculates correctly

