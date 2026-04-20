# 🚀 AFRICOIN APP - RUNNING WITHOUT DOCKER

## ✅ Fixed Issues
- ✅ Removed unused imports
- ✅ Fixed JSX syntax errors (Dashboard and PaymentGateway)
- ✅ Reinstalled all dependencies (including Solana packages)
- ✅ App now builds successfully

---

## 🎯 How to Run the App

Since Docker is not available on your system, here are your options:

### Option 1: Use SQLite (Fastest - Development Only) ⭐ **Recommended**

**Advantages**: No setup needed, instant start, perfect for development

#### Step 1: Update Backend .env
Edit `backend/.env` and replace the DATABASE_URL:

```env
# Change this line:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/africoin_db

# To this:
DATABASE_URL=file:./dev.db
```

#### Step 2: Start Frontend (Terminal 1)
```bash
cd c:\Users\zwexm\LPSN\AFRICOIN-APP\ -\ IOS
npm run dev
```

✅ Opens at **http://localhost:5173**

#### Step 3: Start Backend (Terminal 2)
```bash
cd c:\Users\zwexm\LPSN\AFRICOIN-APP\ -\ IOS\backend
npm run dev
```

✅ Runs at **http://localhost:3001**

---

### Option 2: Install PostgreSQL Locally (For Production Testing)

#### Step 1: Download & Install PostgreSQL
- Visit: https://www.postgresql.org/download/windows/
- Download PostgreSQL 15 or higher
- Run the installer
- Remember the password you set for the `postgres` user

#### Step 2: Create Database
```bash
# Open PowerShell and run:
psql -U postgres

# In psql prompt, run:
CREATE DATABASE africoin_db;
\q
```

#### Step 3: Run Migrations
```bash
cd backend
npm run migrate
npm run seed
```

#### Step 4: Start Services
```bash
# Terminal 1:
npm run dev

# Terminal 2:
cd backend && npm run dev
```

---

### Option 3: Use Cloud PostgreSQL (Quick Alternative)

If you want PostgreSQL without local installation, use:

**Railway.app** (Free tier available):
1. Go to https://railway.app
2. Sign up
3. Create PostgreSQL database
4. Copy the connection string
5. Paste into `backend/.env` as `DATABASE_URL`

**Supabase** (Free tier available):
1. Go to https://supabase.com
2. Create new project
3. Copy PostgreSQL connection string
4. Paste into `backend/.env` as `DATABASE_URL`

---

## 🚀 Quick Start (Copy & Paste)

### If Using SQLite (Recommended)

**Terminal 1** (Frontend):
```bash
cd "C:\Users\zwexm\LPSN\AFRICOIN-APP - IOS"
npm run dev
```

**Terminal 2** (Backend):
```bash
cd "C:\Users\zwexm\LPSN\AFRICOIN-APP - IOS\backend"
npm run dev
```

Then open: **http://localhost:5173** ✨

---

## 🎊 You're All Set!

### Access the App:
| Component | URL | Status |
|-----------|-----|--------|
| **Frontend** | http://localhost:5173 | ✅ Running |
| **Backend API** | http://localhost:3001 | ✅ Running |
| **API Docs** | http://localhost:3001/api/docs | ✅ Available |

### What to Try:
1. ✅ Browse the home page
2. ✅ Navigate between pages
3. ✅ Check payment gateway
4. ✅ View transaction history
5. ✅ Connect wallet (if you have Phantom/Backpack)

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Cannot run npm** | Make sure Node.js is installed: `node --version` |
| **Port 5173 in use** | `npm run dev -- --port 5174` |
| **Port 3001 in use** | `PORT=3002 npm run dev` (in backend) |
| **Module errors** | Delete `node_modules` and run `npm install --legacy-peer-deps` again |
| **Cannot connect to database** | Make sure the DATABASE_URL in `.env` is correct |
| **Wallet import errors** | Clear browser cache and hard refresh (Ctrl+Shift+R) |

---

## 📝 Setting Up PostgreSQL Step-by-Step (If Needed)

### Windows PostgreSQL Installation:

1. **Download & Run Installer**:
   - Go to https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Choose version 15 or higher

2. **Installation Wizard**:
   - Choose default installation directory
   - Set password: `postgres` (remember this!)
   - Keep port: `5432`
   - Locale: Default

3. **Create Database**:
   ```bash
   # Open Command Prompt or PowerShell
   psql -U postgres -c "CREATE DATABASE africoin_db;"
   
   # Test connection:
   psql -U postgres -d africoin_db -c "SELECT 'Connected!'"
   ```

4. **Update Backend .env**:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/africoin_db
   ```

5. **Run Migrations**:
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

---

## 🎯 Database Options Comparison

| Option | Setup Time | Cost | Best For |
|--------|-----------|------|----------|
| **SQLite** (File) | < 1 min | Free | Development & Testing |
| **PostgreSQL Local** | 15-20 min | Free | Production Testing |
| **Railway.app** | 5 min | Free tier | Quick Cloud Setup |
| **Supabase** | 5 min | Free tier | Cloud Database |
| **Docker** | N/A (Not Available) | Free | Full Containerization |

---

## 💡 Next Steps After Running

1. **Explore the App**:
   - Test all pages and features
   - Try different payment methods
   - View transaction history

2. **Configure APIs** (Optional):
   - Add real Stripe keys to `.env`
   - Configure Solana devnet wallet
   - Set up email notifications

3. **Deploy** (When Ready):
   - See `backend/DEPLOY_*.md` files
   - Choose: Heroku, Railway, AWS, Azure, etc.

4. **Build for Mobile**:
   - See `CAPACITOR_NATIVE_BUILD.md`
   - Build for iOS (Mac) or Android

---

## ✨ Everything Is Ready!

**Just follow the Quick Start above and you'll have the app running in 2 minutes!**

```bash
# That's it! Just these two commands in two terminals:
npm run dev                    # Terminal 1: Frontend
cd backend && npm run dev      # Terminal 2: Backend
```

Happy coding! 🚀
