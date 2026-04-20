# 🚀 Local Development Startup Guide

**Get your AfriCoin project running locally in 5 minutes**

---

## Prerequisites Check (2 minutes)

Before starting, verify you have:

```bash
# Check Node.js (should be 18+)
node --version
# If not installed: https://nodejs.org/

# Check npm
npm --version
# If not installed: npm comes with Node.js

# Check PostgreSQL (should be running)
psql --version
# If not installed: https://www.postgresql.org/download/

# Windows: Database should be listening on localhost:5432
```

---

## Step 1: Configure Environment (1 minute)

### Backend Configuration

```bash
# Navigate to backend folder
cd backend

# Copy environment template
cp .env.example .env

# Edit .env file with your values
# Windows: notepad .env
# Mac/Linux: nano .env

# MINIMUM required values:
DATABASE_URL=postgresql://postgres:password@localhost:5432/africoin
JWT_SECRET=your-super-secret-key-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Database URL Format:**
```
postgresql://username:password@host:port/database
postgresql://postgres:postgres@localhost:5432/africoin
```

### Frontend Configuration (Optional)

```bash
# In project root (not backend folder)
# Create .env file with:
VITE_API_URL=http://localhost:3001
VITE_SOLANA_RPC=https://api.mainnet-beta.solana.com
```

---

## Step 2: Setup Database (1 minute)

```bash
# Create PostgreSQL database
createdb africoin

# Verify it was created
psql -U postgres -d africoin -c "SELECT 1;"
# Should return: "1"

# Run migrations (from backend folder)
npm run migrate

# Verify tables were created
psql -U postgres -d africoin -c "\dt"
# Should show tables: users, accounts, transactions, etc.
```

**Windows Users:**
```bash
# If createdb not found, use psql directly:
psql -U postgres -c "CREATE DATABASE africoin;"
```

---

## Step 3: Install Dependencies (1 minute)

```bash
# Frontend dependencies (run from project root)
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Total: ~2-3 minutes
```

---

## Step 4: Start Development Servers (30 seconds)

### Terminal 1: Start Backend

```bash
cd backend
npm run dev

# Expected output:
# 🚀 Server running on http://localhost:3001
# ✅ Database connection successful
# 📚 API Documentation: http://localhost:3001/api-docs
```

**Leave this terminal running!**

### Terminal 2: Start Frontend (new terminal window)

```bash
# From project root (not backend folder)
npm run dev

# Expected output:
# VITE v4.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

**Leave this terminal running!**

---

## Step 5: Test It Works (30 seconds)

### Test 1: Frontend Loads
```bash
# Open browser to:
http://localhost:5173

# You should see:
- AfriCoin app loaded
- Navigation menu visible
- No console errors
```

### Test 2: Backend API Works
```bash
# Open browser to:
http://localhost:3001/api-docs

# You should see:
- Swagger API documentation
- All endpoints listed
- Try-it-out buttons
```

### Test 3: Quick Health Check
```bash
# In new terminal:
curl http://localhost:3001/health

# Expected response:
# { "status": "ok" }
```

---

## Next: Configure Banking (Optional - 10 minutes)

### Add Stripe Keys (for testing)
```bash
# Edit backend/.env and add:
STRIPE_PUBLIC_KEY=pk_test_...your_test_key...
STRIPE_SECRET_KEY=sk_test_...your_test_key...
STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_secret...

# Get these from: https://dashboard.stripe.com/apikeys
```

### Add Solana Network
```bash
# Edit backend/.env:
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta
```

### Add a Bank API (FNB example)
```bash
# Edit backend/.env:
FNB_API_KEY=your_key_here
FNB_API_SECRET=your_secret_here
FNB_BASE_URL=https://api.sandbox.fnb.co.za
```

---

## Useful Development Commands

### Database Management
```bash
# Get into PostgreSQL console
psql -U postgres -d africoin

# Common commands in psql:
\dt                    # Show all tables
\d users               # Show users table structure
SELECT COUNT(*) FROM users;  # Count users
\q                     # Exit

# Reset database (development only!)
npm run migration:reset

# Create database backup
pg_dump africoin > backup.sql

# Restore from backup
psql africoin < backup.sql
```

### Backend Commands
```bash
# Start in development mode
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Run tests
npm test

# Build for production
npm run build

# Check database connection
npm run check:db
```

### Frontend Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Mobile Commands
```bash
# Add iOS platform
npx cap add ios

# Add Android platform
npx cap add android

# Sync changes to platforms
npx cap sync ios
npx cap sync android

# Open iOS in Xcode
npx cap open ios

# Open Android in Android Studio
npx cap open android

# Check status
npx cap doctor
```

---

## Common Issues & Quick Fixes

### Issue: Port 3001 already in use

**Solution:**
```bash
# Find what's using port 3001
# macOS/Linux:
lsof -i :3001

# Windows:
netstat -ano | findstr :3001

# Kill the process
kill -9 <PID>  # macOS/Linux
```

### Issue: Cannot connect to database

**Solution:**
```bash
# Verify PostgreSQL is running
# macOS:
brew services list | grep postgres

# Windows:
# Check Services app → PostgreSQL

# Check connection string in .env
# Should be: postgresql://user:pass@localhost:5432/africoin

# Test connection manually:
psql -U postgres -d africoin -c "SELECT 1;"
```

### Issue: Dependencies won't install

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check types
npm run typecheck

# Fix linting issues
npm run lint --fix

# Rebuild
npm run build
```

---

## Development Workflow

### Making Code Changes

1. **Edit files** in your editor
2. **Save** (auto-refresh in browser usually)
3. **Check terminal** for error messages
4. **Test in browser** at http://localhost:5173
5. **Check console** (F12) for errors

### Common Edits

**Add new API endpoint:**
1. Create route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Restart backend: `Ctrl+C` then `npm run dev`
4. Test at `http://localhost:3001/api-docs`

**Add new page:**
1. Create file in `src/pages/`
2. Add route in `src/App.tsx`
3. Frontend auto-reloads

**Add banking feature:**
1. Edit `bankingService.ts`
2. Edit `Banking.tsx` component
3. Test in `/banking` route

---

## Stopping the Servers

```bash
# To stop backend server:
# In backend terminal: Ctrl+C

# To stop frontend server:
# In frontend terminal: Ctrl+C

# To stop everything:
# Ctrl+C in all terminals

# To fully shutdown:
pkill -f "node"  # macOS/Linux
```

---

## Quick Test Scenarios

### Test 1: Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test 2: Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }' | jq '.accessToken'
```

### Test 3: Get User Profile
```bash
# First get token from Test 2, then:
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Performance Tips

1. **Use VS Code** with TypeScript extension
2. **Keep terminals visible** to see errors
3. **Use console (F12)** to spot frontend errors
4. **Check network tab** for API issues
5. **Use Swagger** to test API endpoints
6. **Keep Chrome DevTools open** for debugging

---

## Next Steps After Startup

Once everything is running:

1. **Explore the app** - Click around
2. **Create test account** - Register a user
3. **Test features** - Try payments, banking, etc.
4. **Check API docs** - http://localhost:3001/api-docs
5. **Read documentation** - See PROJECT_SUMMARY.md

---

## Getting Help

| Issue | Solution |
|-------|----------|
| App won't start | Check all prerequisites installed |
| API returns 500 error | Check backend terminal for error |
| Frontend shows errors | Check browser console (F12) |
| Database connection fails | Verify PostgreSQL running |
| Port already in use | Kill process on that port |
| Dependencies won't install | Clear cache and reinstall |

---

## Verify Everything Works

```bash
# Checklist:
✅ Node.js installed (18+)
✅ PostgreSQL running locally
✅ Database 'africoin' created
✅ .env files configured
✅ Dependencies installed
✅ Backend running on 3001
✅ Frontend running on 5173
✅ Can load app in browser
✅ No errors in console
✅ API docs accessible

# If all checked: YOU'RE READY! 🚀
```

---

## Your Development Environment is Ready!

### You Can Now:
- ✅ View app at http://localhost:5173
- ✅ Access APIs at http://localhost:3001
- ✅ Browse API docs at http://localhost:3001/api-docs
- ✅ Test banking integration
- ✅ Test payment processing
- ✅ Test blockchain features
- ✅ Test authentication

### Keep These URLs Bookmarked:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api-docs
- Database: localhost:5432 (PostgreSQL)

---

## Next: Production Deployment

Once comfortable with local development:

1. **Get bank credentials** - Register with bank APIs
2. **Deploy backend** - Choose hosting platform
3. **Build mobile apps** - iOS and Android
4. **Submit to stores** - App Store and Play Store
5. **Go live!** - 🎉

See DEPLOYMENT_CHECKLIST.md for detailed steps

---

## Support

If something doesn't work:
1. Check this guide
2. Check PROJECT_SUMMARY.md
3. Check backend terminal output
4. Check browser console (F12)
5. Check error log files

**You've got this! 💪**

---

**Total Time: 5 minutes from zero to running**

Start at Step 1 now! 🚀
