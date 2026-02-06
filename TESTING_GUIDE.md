# SalonPro E-Commerce - Testing Guide

## Complete Feature Testing

This guide covers all the functionality you've implemented for the SalonPro e-commerce platform. Follow these steps to test the complete flow.

---

## 1. SIGNUP & ACCOUNT CREATION

### Test Case 1.1: Create Customer Account
1. Open the application at `http://localhost:5173`
2. Click **"Sign Up"** button in the header
3. Fill in the signup form with:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Phone: `1234567890`
   - Password: `password123`
   - Confirm Password: `password123`
   - Account Type: **Customer** (selected)
4. Click **"Sign Up"** button
5. **Expected Result**: 
   - Account created successfully
   - Redirected to home page
   - Header shows **"Logout"** button (user is logged in)

### Test Case 1.2: Create Agent/Seller Account
1. Repeat steps 1-3 but use different email (e.g., `agent@example.com`)
2. Select Account Type: **Agent/Seller**
3. Click **"Sign Up"**
4. **Expected Result**:
   - Account created
   - Redirected to `/agent-dashboard`
   - Logout button visible in header

### Test Case 1.3: Form Validation
1. Try to submit form with:
   - Missing fields → Should show "Please fill all fields"
   - Password < 6 chars → Should show validation error
   - Passwords don't match → Should show "Passwords do not match"
   - Invalid email format → Should validate email properly

---

## 2. LOGIN & AUTHENTICATION

### Test Case 2.1: Login with Credentials
1. Click **"Login"** in header
2. Enter email: `john@example.com`
3. Enter password: `password123`
4. Click **"Login"** button
5. **Expected Result**:
   - Login successful
   - Redirected to home page
   - Header shows **"Logout"** button
   - localStorage contains JWT token and user data

### Test Case 2.2: Login with Invalid Credentials
1. Login with wrong password
2. **Expected Result**: Error message displayed

### Test Case 2.3: Logout
1. Click **"Logout"** button in header
2. **Expected Result**:
   - Token removed from localStorage
   - Header shows **"Login"** and **"Sign Up"** buttons
   - Redirected to home page

---

## 3. PRODUCT BROWSING

### Test Case 3.1: View Products on Home Page
1. Navigate to home page
2. **Expected Result**:
   - All products displayed in grid layout
   - Each product shows: Image, Name, Price, Rating
   - Products fetched from API (`/api/v1/products`)

### Test Case 3.2: View Product Details
1. Click any product card
2. **Expected Result**:
   - Detailed product page loads
   - Shows: Image, Name, Description, Price, Stock, Rating
   - "Add to Cart" button visible
   - Quantity selector available

### Test Case 3.3: Search Products
1. Type product name in search bar
2. Press Enter or click search button
3. **Expected Result**: Search feedback shown (can be expanded to filter results)

---

## 4. ADD TO CART - WITHOUT LOGIN

### Test Case 4.1: Add to Cart When Not Logged In
1. **DO NOT LOGIN** - Ensure you're logged out
2. Go to any product page
3. Try to click **"Add to Cart"** button
4. **Expected Result**:
   - Alert message: "Please login to add items to cart"
   - Automatically redirected to `/login` page

### Test Case 4.2: Login from Redirect
1. From the login page (redirected from step 4.1)
2. Enter credentials and login
3. **Expected Result**:
   - Login successful
   - User is now authenticated (token in localStorage)

---

## 5. ADD TO CART - AFTER LOGIN

### Test Case 5.1: Add Product to Cart (User 1)
1. **Login as User 1** (john@example.com)
2. Go to any product page
3. Select quantity (e.g., 2)
4. Click **"Add to Cart"** button
5. **Expected Result**:
   - Product added to cart successfully
   - Success message shown
   - Cart count in header updates (e.g., shows "🛒 1")
   - Quantity resets in form

### Test Case 5.2: View Cart (User 1)
1. Click cart icon (🛒) in header
2. **Expected Result**:
   - Cart page loads
   - Shows product added: Name, Price, Quantity
   - Shows Order Summary with:
     - Subtotal (from cart API)
     - Total Items
     - Total Price

### Test Case 5.3: Modify Cart Items
1. In cart page, find the product
2. Click **+** button to increase quantity
3. **Expected Result**:
   - Quantity increases
   - Subtotal recalculates
   - Cart updates in real-time

### Test Case 5.4: Remove Item from Cart
1. In cart page, click **Remove** button
2. **Expected Result**:
   - Item removed from cart
   - Cart count updates in header
   - Order summary recalculates

---

## 6. MULTI-USER CART ISOLATION

### Test Case 6.1: User 1 Cart Data Persistence
1. **User 1** is logged in with items in cart
2. Navigate to different pages, then back to home
3. Click cart icon
4. **Expected Result**:
   - Same items still in cart
   - Cart data persisted in MongoDB (per userId)

### Test Case 6.2: User 2 Separate Cart
1. **Logout** (User 1)
2. Open new browser tab/private window
3. **Login as User 2** (agent@example.com or create new account)
4. Go to same product page
5. Add to cart with different quantity
6. **Expected Result**:
   - User 2's cart is separate from User 1
   - Cart count shows different items
   - User 2 sees only their items

### Test Case 6.3: Verify User 1 Cart Unchanged
1. Go back to original tab with User 1 still logged in
2. Click cart icon
3. **Expected Result**:
   - User 1's original cart items unchanged
   - No interference from User 2's cart

---

## 7. CHECKOUT & ORDERS

### Test Case 7.1: Proceed to Checkout
1. User logged in with items in cart
2. Go to cart page
3. Click **"Proceed to Checkout"** button
4. **Expected Result**:
   - Redirected to checkout page
   - Shows order summary with:
     - Product items from cart
     - Subtotal calculation
     - Discount (10%)
     - Tax (18%)
     - Final total

### Test Case 7.2: Create Order
1. In checkout page, fill order details (if form required)
2. Click **"Place Order"** button
3. **Expected Result**:
   - Order created successfully
   - Order stored in MongoDB
   - Cart cleared after order
   - Confirmation message shown

---

## 8. HEADER FUNCTIONALITY

### Test Case 8.1: Header Navigation
1. Check header shows all elements:
   - **Logo** - Clickable, goes to home
   - **Search bar** - Functional
   - **Login/SignUp buttons** - When not logged in
   - **Logout button** - When logged in
   - **Cart icon** - Shows count when items in cart

### Test Case 8.2: Become a Seller
1. **Not logged in**: Click "Become a Seller" → Redirects to `/signup`
2. **Logged in**: Click "Become a Seller" → Redirects to `/become-seller`

### Test Case 8.3: Help Center
1. Click "Help Center" link
2. **Expected Result**: Navigates to help/support page

---

## 9. CATEGORIES & FILTERING

### Test Case 9.1: Browse by Category
1. Click any category button in nav (Hair Care, Skin Care, Tools, etc.)
2. **Expected Result**:
   - Filtered products displayed
   - Products relevant to category shown

### Test Case 9.2: Category Persistence
1. Go to a category page
2. Refresh page
3. **Expected Result**: Category filters maintain or default to home

---

## 10. ERROR HANDLING

### Test Case 10.1: API Failure Fallback
1. Stop backend server
2. Navigate to home page
3. **Expected Result**:
   - Products load from mock data (fallback)
   - Application continues to function
   - No crashes or console errors

### Test Case 10.2: Invalid Token
1. Manually delete JWT token from localStorage (DevTools)
2. Try to add to cart
3. **Expected Result**:
   - Token validation fails
   - User redirected to login

---

## 11. BACKEND CART ENDPOINTS

These endpoints are protected (require JWT token):

### Endpoints to Test:
- **GET** `/api/v1/cart` - Get user's cart
- **POST** `/api/v1/cart/add` - Add product to cart
  - Body: `{ "productId": "...", "quantity": 2 }`
- **PATCH** `/api/v1/cart/:productId` - Update quantity
  - Body: `{ "quantity": 3 }`
- **DELETE** `/api/v1/cart/:productId` - Remove item
- **DELETE** `/api/v1/cart` - Clear entire cart
- **GET** `/api/v1/cart/total` - Get cart totals

### Using Postman/Thunder Client:
1. Login and copy JWT token from localStorage
2. Set header: `Authorization: Bearer <token>`
3. Test each endpoint
4. **Expected**: All operations return 200 and valid data

---

## 12. RESPONSIVE DESIGN

### Test Case 12.1: Mobile Responsiveness
1. Open DevTools (F12)
2. Toggle device toolbar (iPhone, iPad, Android)
3. **Expected**:
   - Header responsive
   - Products stack vertically
   - Cart page readable on mobile
   - All buttons accessible

### Test Case 12.2: Tablet View
1. Test on iPad/Tablet size (768px width)
2. **Expected**: Optimized 2-column layout

---

## QUICK START TESTING SEQUENCE

If you want to quickly test everything:

```
1. FRESH START:
   - Clear localStorage
   - Refresh page

2. SIGNUP TEST:
   - Click Sign Up
   - Fill form as customer
   - Submit → Should land on home page

3. PRODUCT TEST:
   - View products on home
   - Click a product

4. CART TEST (NOT LOGGED IN):
   - Try Add to Cart (without login)
   - Should redirect to login

5. LOGIN & CART:
   - Login with credentials
   - Go to product
   - Add to cart
   - Click cart icon
   - See your items

6. CHECKOUT:
   - Click Proceed to Checkout
   - Fill details
   - Place Order

7. MULTI-USER:
   - Logout
   - Open private/incognito window
   - Create new user
   - Add different product
   - Compare carts (both users have separate data)
```

---

## TROUBLESHOOTING

### Issue: "Please login to add items to cart" always shows
- **Fix**: Check localStorage has valid JWT token after login
- **Check**: Browser DevTools → Application → localStorage → look for auth token

### Issue: Cart doesn't show items
- **Fix**: Make sure user is logged in (Logout button visible)
- **Check**: Backend cart API running on port 5000
- **Check**: MongoDB connection working

### Issue: Products not loading
- **Fix**: Backend needs to be running
- **Command**: `cd Backend/salon_e_com_server && npm start`

### Issue: Signup/Login fails
- **Fix**: Check backend is running
- **Check**: Email not already used in database
- **Check**: Password is at least 6 characters

---

## API ENDPOINTS REFERENCE

### Authentication
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product details

### Cart (Protected)
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart/add` - Add to cart
- `PATCH /api/v1/cart/:productId` - Update quantity
- `DELETE /api/v1/cart/:productId` - Remove item
- `DELETE /api/v1/cart` - Clear cart

### Orders (Protected)
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user's orders

---

## SUCCESS CRITERIA

Your implementation is complete when:

✅ Users can signup with email/password/role selection
✅ Users can login and receive JWT token
✅ Add-to-cart without login redirects to login page
✅ After login, add-to-cart works and adds to MongoDB cart
✅ Cart page shows user's items with accurate totals
✅ Different users have completely separate cart data
✅ Modifying cart (add/remove/update) works in real-time
✅ Checkout page shows order summary with tax/discount
✅ Logout clears token and shows login buttons
✅ Header buttons update based on auth state
✅ All API calls include proper JWT authorization
✅ Mobile responsive design works
✅ Error handling and fallbacks work

---

**Last Updated**: Current Session
**Status**: All features implemented and ready for testing
