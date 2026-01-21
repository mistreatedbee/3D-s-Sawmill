# Backend-first deployment checklist (recommended)
This project is **full-stack** (Express/Mongo backend + Vite/React frontend). To avoid breaking the live site, deploy in this order:

## 1) Deploy BACKEND first
### Required env vars (backend)
Set these on your backend host (Render/Railway/Fly/etc):
- **`MONGODB_URI`**: your Mongo connection string
- **`JWT_SECRET`**: strong secret
- **`NODE_ENV`**: `production`
- **`PORT`**: `5000` (or your host’s provided port)
- **`CORS_ORIGIN`**: your frontend domain (example: `https://3-d-s-sawmill.vercel.app`)

### Confirm the backend is healthy
- **Health check**: `GET /api/health` → `200` with `{ message: "Server is running" }`
- **Public data**:
  - `GET /api/site-settings`
  - `GET /api/products` (public only returns `isAvailable: true`)

### Confirm admin + auth works
- Log into admin on your local frontend (or Postman) and verify:
  - `GET /api/products/admin/all` (admin sees disabled + enabled)
  - `PUT /api/site-settings` (admin can update About)

### Confirm orders flow endpoints (enhanced)
The backend is wired to the enhanced orders API:
- Customer creates request: `POST /api/orders`
- Customer views: `GET /api/orders/user/:userId`
- Admin views: `GET /api/orders?page=1&limit=20`
- Admin updates totals: `PATCH /api/orders/:id/financials`
- Admin status/payment:
  - `PATCH /api/orders/:id/status`
  - `PATCH /api/orders/:id/payment-status`

## 2) Deploy FRONTEND second
### Required env vars (frontend)
Set on Vercel/Netlify:
- **`VITE_API_URL`**: your backend base URL **including `/api`**
  - Example: `https://YOUR-BACKEND-DOMAIN.com/api`

### Verify production build + runtime
- Open the site and confirm:
  - About page loads real content (not placeholder)
  - Products load and match admin updates
  - Checkout submits Quote/Invoice requests
  - Admin Orders shows orders and can edit totals/status

