# Frontend & Backend Integration Guide

## ✅ Integration Completed

### 1. **API Service Layer Created**
   - **File**: `src/utils/apiClient.js`
   - **Purpose**: Centralized API communication with automatic token management
   - **Features**:
     - Bearer token authentication
     - Error handling with 401 redirect to login
     - Environment-based URL configuration
     - Organized API endpoints by module

### 2. **Authentication System Connected**
   - **Endpoint**: `POST /api/v1/auth/login`
   - **Frontend**: Updated LoginPage.jsx with real API calls
   - **Features**:
     - Stores JWT token in localStorage
     - Auto-redirects on 401 (unauthorized)
     - Role-based navigation (ADMIN → /admin, AGENT → /agent-dashboard)
     - Error messages displayed to user

### 3. **Product Browsing Connected**
   - **Endpoint**: `GET /api/v1/products`
   - **Frontend**: HomePage.jsx fetches from API with fallback to mock data
   - **Features**:
     - Filters support (status, category)
     - Graceful fallback to mock data if API fails
     - Loads active products automatically

### 4. **Product Details Connected**
   - **Endpoint**: `GET /api/v1/products/:id`
   - **Backend**: Added getProductById controller and service
   - **Frontend**: ProductDetailPage.jsx fetches specific product
   - **Features**:
     - Dynamic product loading
     - Fallback to mock data
     - Error handling

### 5. **Order Management Connected**
   - **Endpoint**: `POST /api/v1/orders`
   - **Frontend**: CheckoutPage.jsx creates orders via API
   - **Features**:
     - Requires authentication
     - Includes agent attribution for commissions
     - Payment method selection
     - Order status tracking

### 6. **Backend API Endpoints Enhanced**
   - Added: `GET /api/v1/products/:id` (get single product)
   - Added: `DELETE /api/v1/products/:id` (delete product - admin only)
   - Updated controllers and services to support new endpoints
   - All admin routes protected with `@protect` and `@authorize('ADMIN')` middleware

---

## 🔧 Configuration Files

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Salon E-Commerce
```

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/salon_e_com
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
APP_NAME=Salon E-Commerce API
APP_VERSION=1.0.0
```

---

## 🚀 How to Start the Application

### 1. **Start MongoDB**
   ```bash
   # If MongoDB is installed locally
   mongod
   
   # Or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

### 2. **Start Backend Server**
   ```bash
   cd Backend/salon_e_com_server
   npm install
   npm run dev
   # Server will run on http://localhost:5000
   ```

### 3. **Start Frontend Application**
   ```bash
   cd Salon_E_Comm
   npm install
   npm run dev
   # Application will run on http://localhost:5173 (or shown in terminal)
   ```

---

## 🔐 Authentication Flow

1. User logs in on LoginPage
2. Frontend sends POST request to `/api/v1/auth/login`
3. Backend validates credentials and returns JWT token
4. Token stored in localStorage as `authToken`
5. All subsequent API requests include `Authorization: Bearer {token}` header
6. Protected routes use `@protect` middleware to verify token
7. On 401 response, user redirected to login and token cleared

---

## 📱 API Endpoints Reference

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)

### Products
- `GET /api/v1/products` - List all products (with filters)
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product (admin only)
- `PATCH /api/v1/products/:id` - Update product (admin only)
- `DELETE /api/v1/products/:id` - Delete product (admin only)

### Orders
- `POST /api/v1/orders` - Create order (protected)
- `GET /api/v1/orders/me` - Get my orders (protected)
- `GET /api/v1/orders` - Get all orders (admin only)
- `PATCH /api/v1/orders/:id/status` - Update order status (admin only)

### Commissions
- `GET /api/v1/commissions` - Get commissions (protected)

---

## ✨ Key Features Implemented

### Frontend
- ✅ Login page with real authentication
- ✅ Products fetching with API integration
- ✅ Product detail pages with dynamic data
- ✅ Checkout with order placement
- ✅ Error handling and loading states
- ✅ Token management and auto-logout
- ✅ Graceful fallback to mock data

### Backend
- ✅ JWT-based authentication
- ✅ Role-based access control (ADMIN, AGENT, CUSTOMER)
- ✅ MongoDB integration with Mongoose
- ✅ Complete CRUD operations for products
- ✅ Order management system
- ✅ Commission tracking system
- ✅ Error handling and validation

---

## 🧪 Testing the Integration

### Test Login
1. Go to http://localhost:5173/login
2. Try login with test credentials
3. Should see error or success message
4. Success should redirect to home page

### Test Product Browsing
1. Home page should load products from API
2. Click on product to see details
3. Details should load from `/products/:id` endpoint

### Test Order Placement
1. Go to checkout page
2. Fill in agent ID (or skip)
3. Click "Place Order Now"
4. Should create order in database
5. Check backend database to confirm order was created

---

## ⚙️ Next Steps / Enhancements

1. **Seed Database** with initial products, users
2. **Implement Product Images** - Store and retrieve from backend
3. **Implement Wishlist** - Add/remove from user's wishlist
4. **Implement Cart** - Persistent cart in backend
5. **Payment Gateway Integration** - Stripe/Razorpay
6. **Admin Dashboard** - Connect admin panel to API
7. **Agent Dashboard** - Connect agent panel to commission API
8. **Email Notifications** - Order confirmations
9. **Search & Filtering** - Advanced product search
10. **Reviews & Ratings** - Product reviews system

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Ensure MongoDB is running
- Ensure backend server is running on port 5000
- Check VITE_API_BASE_URL in frontend .env.local

### "401 Unauthorized"
- Token might be expired
- Try logging in again
- Check if JWT_SECRET matches between frontend auth calls and backend

### "CORS Error"
- Backend has CORS enabled in server.js
- Check that frontend API URL matches backend URL

### "Product not loading"
- Backend might be down
- Check browser console for errors
- Frontend will fallback to mock data

---

## 📝 Notes

- All API calls have error handling with fallback to mock data where applicable
- JWT tokens expire in 30 days (configurable in .env)
- Passwords are hashed with bcrypt (10 salt rounds)
- Database connection shows connection status in backend console
- All admin endpoints are protected with role middleware

