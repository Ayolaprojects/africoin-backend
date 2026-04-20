# 🚀 AFRICOIN APP - COMPLETE STARTUP GUIDE

## ✅ PostgreSQL Found on Your System!

You have PostgreSQL 15 installed at: `C:\Program Files\PostgreSQL\15\bin\`

---

## 🎯 **QUICK START** (2 Terminals, 2 Commands)

### **Option A: Use SQLite** (Works Right Now - Recommended for Testing)

**Terminal 1 - Start Frontend**:
```bash
cd "C:\Users\zwexm\LPSN\AFRICOIN-APP - IOS"
npm run dev
```
✅ Opens at **http://localhost:5173**

**Terminal 2 - Start Backend**:
```bash
cd "C:\Users\zwexm\LPSN\AFRICOIN-APP - IOS\backend"
npm run dev
```
✅ Runs at **http://localhost:3001**

That's it! The app will start immediately with SQLite.

---

## 🐘 **Option B: Use PostgreSQL** (Your Installed Database)

### Step 1: Start PostgreSQL Service
Open **Services** (services.msc) and start **postgresql-x64-15**:
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find **postgresql-x64-15** in the list
4. Right-click → **Start**
5. Wait for status to change to **Running**

### Step 2: Create Database Using pgAdmin
PostgreSQL came with pgAdmin (a GUI tool):
1. Open pgAdmin from your Start Menu
2. Connect to your server (password was set during installation)
3. Right-click **Databases** → **Create** → **Database**
4. Name: `africoin_db`
5. Click **Save**

### Step 3: Backend Configuration
Your `.env` file is already set to PostgreSQL:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/africoin_db
```

### Step 4: Run Database Migrations
```bash
cd "C:\Users\zwexm\LPSN\AFRICOIN-APP - IOS\backend"
npm run migrate
npm run seed  # Optional: adds test data
```

### Step 5: Start the App
```bash
# Terminal 1:
npm run dev

# Terminal 2:
cd backend && npm run dev
```

---

## 🎊 Access Your App

Once running, visit:

| Component | URL |
|-----------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:3001 |
| **API Docs** | http://localhost:3001/api/docs |

---

## 🔧 Troubleshooting

### PostgreSQL Won't Start
1. Try running PowerShell as Administrator
2. Run: `Start-Service postgresql-x64-15`
3. Check status: `Get-Service postgresql-x64-15`

### Port Already in Use
```bash
# Use different ports:
npm run dev -- --port 5174        # Frontend
PORT=3002 npm run dev             # Backend
```

### "Cannot find module" errors
```bash
cd "C:\Users\zwexm\LPSN\AFRICOIN-APP - IOS"
npm install --legacy-peer-deps
```

### Can't Remember PostgreSQL Password
Use pgAdmin GUI instead - it doesn't require remembering the password.

---

## ✨ Features to Test

Once the app is running:

1. ✅ **Home Page** - Browse features
2. ✅ **Dashboard** - View wallet (if connected)
3. ✅ **Swap** - Token exchange interface
4. ✅ **Payment Gateway** - Multiple payment methods
5. ✅ **Services** - Feature showcase
6. ✅ **Transactions** - History and tracking

---

## 📝 Command Quick Reference

```bash
# Navigate to project
cd "C:\Users\zwexm\LPSN\AFRICOIN-APP - IOS"

# Install dependencies (if needed)
npm install --legacy-peer-deps

# Build for production
npm run build

# Start development servers
npm run dev                         # Frontend
cd backend && npm run dev           # Backend

# Run database migrations (PostgreSQL only)
cd backend && npm run migrate
cd backend && npm run seed

# View API documentation
# Visit: http://localhost:3001/api/docs
```

---

## 🎯 Recommended Workflow

1. **First Time**:
   - Start with SQLite (no setup needed)
   - Test all features
   - Verify everything works

2. **When Ready**:
   - Switch to PostgreSQL for "production-like" testing
   - Use pgAdmin for easier database management
   - Run migrations and seed data

---

## 🚀 That's All!

Just run the two commands from **Option A** or **Option B** above and you're done!

**Frontend**: `npm run dev`  
**Backend**: `cd backend && npm run dev`

Open http://localhost:5173 and start using the app! 🎉

---

**Need Help?**
- Check [RUN_WITHOUT_DOCKER.md](RUN_WITHOUT_DOCKER.md) for detailed setup
- Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for production setup
- All documentation is in the project root folder
