# 🚀 AFRICOIN APP - QUICK RUN GUIDE

## ✅ Status: READY TO RUN

All builds are complete and configurations are in place.

---

## 🎯 Run in 3 Steps

### Step 1️⃣: Start PostgreSQL Database

**Option A - Docker** (Highly Recommended):
```bash
docker run --name africoin-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=africoin_db -p 5432:5432 -d postgres:15
```

**Option B - If already installed locally**:
```bash
# Windows: Services.msc → PostgreSQL → Start
# Mac: brew services start postgresql  
# Linux: sudo systemctl start postgresql
```

---

### Step 2️⃣: Start Frontend (Port 5173)

```bash
cd c:\Users\zwexm\LPSN\AFRICOIN-APP\ -\ IOS
npm run dev
```

Wait for: `Local: http://localhost:5173`

---

### Step 3️⃣: Start Backend (Port 3001)

```bash
cd c:\Users\zwexm\LPSN\AFRICOIN-APP\ -\ IOS\backend
npm run dev
```

Wait for: `✓ Server running on http://localhost:3001`

---

## 🎊 You're Done!

| Component | URL | Status |
|-----------|-----|--------|
| **Frontend** | http://localhost:5173 | ✅ Ready |
| **Backend API** | http://localhost:3001 | ✅ Ready |
| **API Docs** | http://localhost:3001/api/docs | ✅ Ready |
| **PostgreSQL** | localhost:5432 | ✅ Ready |

---

## 📱 Test the App

1. Open http://localhost:5173 in your browser
2. Sign up with a test email
3. Explore the dashboard
4. Try payment gateway features
5. View transaction history

---

## 🔧 Optional: Database Setup (First Time Only)

If using a fresh PostgreSQL:

```bash
cd c:\Users\zwexm\LPSN\AFRICOIN-APP\ -\ IOS\backend

# Run migrations to create tables
npm run migrate

# Seed with test data (optional)
npm run seed
```

---

## 🛑 Stopping Everything

```bash
# Press Ctrl+C in both terminals

# Optional: Stop Docker container
# docker stop africoin-postgres
```

---

## 🐛 Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| **Port 5173 in use** | `npm run dev -- --port 5174` |
| **Port 3001 in use** | `PORT=3002 npm run dev` |
| **PostgreSQL won't connect** | Check `.env` DATABASE_URL, or run Docker command |
| **CORS errors** | Ensure backend is running on port 3001 |
| **Module not found** | Run `npm install` in the root and backend directories |
| **Build failed** | Delete `dist/` and `node_modules/`, then `npm install && npm run build` |

---

## 📝 Configuration Files

✅ **Frontend**: `.env.local` configured
✅ **Backend**: `.env` configured  
✅ **Database**: PostgreSQL connection ready

All credentials are using development/test values. For production, update these files with real API keys.

---

## 🎯 What to Do Next

After running the app:

1. **Explore Features**:
   - Home page with services
   - Dashboard with mock wallet
   - Swap interface
   - Payment gateway (Stripe integration ready)
   - Transaction history

2. **Test Backend APIs**:
   - Use Postman or VS Code REST Client
   - Check `backend/requests.http` for example requests
   - Visit http://localhost:3001/api/docs for Swagger documentation

3. **Customize**:
   - Update styles in `src/styles/`
   - Modify pages in `src/pages/`
   - Add your API keys in `.env` files
   - Configure real Stripe keys for payments

4. **Deploy**:
   - See `backend/DEPLOY_*.md` files for hosting options
   - Use `npm run build` for production builds
   - Follow Capacitor guide for iOS/Android builds

---

## 📚 Documentation

- **Full Setup Guide**: [APP_SETUP_GUIDE.md](APP_SETUP_GUIDE.md)
- **Deployment Options**: `backend/DEPLOY_*.md`
- **Mobile Building**: [CAPACITOR_NATIVE_BUILD.md](CAPACITOR_NATIVE_BUILD.md)
- **Complete Status**: [APP_COMPLETION.md](APP_COMPLETION.md)

---

## 🎉 You're All Set!

The AFRICOIN App is **fully configured and ready to run**. 

**Start with Step 1 above and you'll be running the app in minutes!** 🚀
