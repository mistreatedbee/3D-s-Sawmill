# 3D SawMill - Complete E-Commerce Platform

A modern, full-stack e-commerce platform for timber/wood products with React frontend and Express.js/MongoDB backend.

## 🎯 What's Inside

- ✅ **React 18** frontend with TypeScript
- ✅ **Express.js** REST API backend
- ✅ **MongoDB** database with Mongoose ODM
- ✅ **JWT Authentication** with role-based access
- ✅ **Product Management** system
- ✅ **Order Processing** with status tracking
- ✅ **Admin Dashboard** endpoints
- ✅ **Shopping Cart** system
- ✅ **Gallery & Testimonials** management

## 🚀 Quick Start (5 Minutes)

### Terminal 1 - Backend
```bash
cd server
npm install
npm run seed          # Populate sample data
npm run dev          # Runs on port 5000
```

### Terminal 2 - Frontend
```bash
npm install
npm run dev          # Runs on http://localhost:5173
```

Visit **http://localhost:5173** - You're ready!

## 📚 Documentation

| File | Purpose |
|------|---------|
| **QUICKSTART.md** | 5-minute setup guide |
| **SETUP.md** | Detailed setup & troubleshooting |
| **API_DOCUMENTATION.md** | Complete API reference |
| **DATABASE_SCHEMA.md** | MongoDB schemas |
| **IMPLEMENTATION_SUMMARY.md** | Technical overview |

## 🏗️ Project Structure

```
3D SawMill/
├── server/                    # Express.js backend
│   ├── config/               # Database & auth
│   ├── models/               # MongoDB schemas
│   ├── controllers/          # Route handlers
│   ├── routes/               # API endpoints
│   └── server.js             # Main app
├── src/                       # React frontend
│   ├── components/
│   ├── context/
│   ├── hooks/
│   └── pages/
├── .env                       # Frontend config
└── server/.env               # Backend config
```

## 🔌 API Endpoints (22 total)

**Authentication:** 4 endpoints
**Products:** 5 endpoints  
**Orders:** 5 endpoints
**Gallery:** 3 endpoints
**Testimonials:** 4 endpoints
**Health:** 1 endpoint

See **API_DOCUMENTATION.md** for details.

## 🗄️ Tech Stack

**Frontend:**
- React 18.3.1 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Framer Motion
- React Router

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)

## 📋 Features

### User Features
- Browse & search products
- Filter by category
- Shopping cart
- User authentication
- Order placement
- Order tracking

### Admin Features
- Product CRUD operations
- Order management
- Gallery management
- Testimonial verification
- Stock management

## 🔒 Security

- Password hashing with bcryptjs
- JWT authentication
- Role-based access control
- CORS configuration
- Input validation

## 🗄️ Database Setup

### Local MongoDB
```bash
# macOS
brew install mongodb-community
mongod

# Or visit mongodb.com for installation
# Connection: mongodb://localhost:27017/sawmill
```

### MongoDB Atlas (Cloud)
1. Create free account at mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Add to server/.env

## 📦 Installation

### Requirements
- Node.js v16+
- npm or yarn
- MongoDB (local or Atlas account)

### Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
npm install
```

## ⚙️ Environment Configuration

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sawmill
JWT_SECRET=change_this_in_production
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Sample Accounts (after registration)
```
Email: test@example.com
Password: password123
```

### Test API
```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products
```

## 🚀 Development

### Available Commands

**Backend:**
- `npm run dev` - Start with auto-reload
- `npm run seed` - Populate database
- `npm start` - Production start

**Frontend:**
- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm run preview` - Preview build

## 📖 Next Steps

1. Read **QUICKSTART.md** for immediate setup
2. Check **SETUP.md** for detailed instructions
3. Review **API_DOCUMENTATION.md** for API endpoints
4. See **DATABASE_SCHEMA.md** for data structure

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check connection string in .env
- Ensure credentials are correct (if using Atlas)

### Backend Won't Start
- Check if port 5000 is available
- Verify .env file exists
- Check Node.js version (v16+)

### Frontend Can't Connect
- Ensure backend is running
- Check API_URL in .env matches backend
- Look for CORS errors in browser console

See **SETUP.md** for detailed troubleshooting.

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway/Render)
```
Set environment variables:
- MONGODB_URI (production database)
- JWT_SECRET (strong random key)
- NODE_ENV=production
- CORS_ORIGIN (frontend domain)
```

## 📞 Support Resources

- **SETUP.md** - Complete setup guide
- **API_DOCUMENTATION.md** - API reference
- **DATABASE_SCHEMA.md** - Data structure
- Backend logs - Check terminal for errors
- Browser console - Check frontend errors

## ✨ Key Files to Know

| File | Purpose |
|------|---------|
| server/server.js | Express app entry point |
| server/seed.js | Database seeder script |
| src/context/AuthContext.tsx | Authentication logic |
| src/hooks/useInventory.ts | Product data fetching |
| .env | Frontend configuration |
| server/.env | Backend configuration |

## 📊 Sample Data

Run `npm run seed` to populate:
- 7 timber products
- 3 testimonials
- 4 gallery images

## ✅ Verification Checklist

- [ ] MongoDB installed/configured
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] .env files created with correct values
- [ ] Backend starts without errors
- [ ] Database seeded
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can login/register
- [ ] Products load from API

## 🎓 Learning Path

1. Start backend → Review models & routes
2. Start frontend → Check context/hooks
3. Test API → Use curl or Postman
4. Add features → Follow existing patterns
5. Deploy → Use provided guides

## 📝 Recent Changes

**✅ NEW:**
- Complete Express backend
- MongoDB integration
- JWT authentication
- API seeding script
- Comprehensive documentation

**🔄 UPDATED:**
- Removed mock data
- API-based data fetching
- Real authentication

## 🏆 Production Ready

This project includes:
- Error handling
- Input validation
- Authentication/Authorization
- Database optimization
- Security best practices
- Comprehensive documentation

## 📞 Quick Reference

```bash
# Start everything
cd server && npm run dev &  # Terminal 1
cd .. && npm run dev        # Terminal 2

# Access
Frontend:  http://localhost:5173
Backend:   http://localhost:5000
API Docs:  See API_DOCUMENTATION.md
```

---

**Ready to get started?** Read **QUICKSTART.md** for a 5-minute setup!
