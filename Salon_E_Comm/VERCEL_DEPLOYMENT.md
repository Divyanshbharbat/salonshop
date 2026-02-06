# Vercel Deployment Guide

## Frontend Setup for Vercel

Your frontend is already configured to use environment variables for all API calls. All axios/fetch requests go through a centralized API client.

### Environment Variables

The frontend uses the `VITE_API_BASE_URL` environment variable to configure the backend API endpoint.

**Variable Name:** `VITE_API_BASE_URL`  
**Example Value:** `https://your-salon-api.com/api/v1`

### Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Select "Import a git repository"
   - Choose your GitHub repository
   - Click "Import"

3. **Configure Environment Variables in Vercel**
   - In the Vercel dashboard, go to Settings → Environment Variables
   - Add the following:
     - **Name:** `VITE_API_BASE_URL`
     - **Value:** Your production backend URL (e.g., `https://salon-api-production.herokuapp.com/api/v1`)
     - **Environments:** Select "Production" and "Preview"

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main

### Local Development

For local development, use `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

⚠️ **Note:** Never commit `.env.local` to version control

### Verifying the Configuration

After deployment:
1. Open your Vercel deployment URL
2. Open browser DevTools (F12) → Network tab
3. Check API calls to ensure they're going to your production backend
4. Verify the URL pattern: `https://your-backend-url/api/v1/...`

### Troubleshooting

**Issue: API calls returning 404 or failing**
- Check the `VITE_API_BASE_URL` environment variable in Vercel settings
- Ensure your backend is running and accessible from the internet
- Check CORS configuration on your backend

**Issue: Environment variable not being picked up**
- Ensure the variable is set with the correct name: `VITE_API_BASE_URL`
- Redeploy after adding/changing environment variables
- Environment variables starting with `VITE_` are only available at build time with Vite

### Building Locally

To test the production build locally:

```bash
npm run build
npm run preview
```

Then set `VITE_API_BASE_URL` to test different backend URLs.

### Current API Client

All API calls use the centralized client in `src/utils/apiClient.js`:
- Uses `import.meta.env.VITE_API_BASE_URL` for the base URL
- Falls back to localhost if not set (for development)
- All endpoints are relative paths: `/auth`, `/products`, `/orders`, etc.

### Backend Endpoints Summary

When configuring `VITE_API_BASE_URL`, point to your v1 API endpoints:
- Authentication: `VITE_API_BASE_URL/auth`
- Products: `VITE_API_BASE_URL/products`
- Orders: `VITE_API_BASE_URL/orders`
- Cart: `VITE_API_BASE_URL/cart`
- Users: `VITE_API_BASE_URL/users`
- Payments: `VITE_API_BASE_URL/payments`
- Commissions: `VITE_API_BASE_URL/commissions`
