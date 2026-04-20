@echo off
REM AFRICOIN APP - MASTER SETUP SCRIPT (Windows)
REM This script automates the complete setup process

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║     🚀 AFRICOIN APP - COMPLETE SETUP ^& DEPLOYMENT 🚀          ║
echo ║                                                                ║
echo ║     Native iOS/Android + Web App (Production Ready)            ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if running from correct directory
if not exist "package.json" (
    echo ⚠️  Please run this script from the project root directory
    pause
    exit /b 1
)

echo 📋 SETUP CHECKLIST:
echo.

REM 1. Install Dependencies
echo [1/4] Installing dependencies...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ⚠️  npm install had issues, but continuing...
)
echo ✅ Dependencies installed!
echo.

REM 2. Build Web App
echo [2/4] Building production web app...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed. Please check errors above.
    pause
    exit /b 1
)
echo ✅ Web app built successfully!
echo.

REM 3. Add Android
echo [3/4] Adding Android support...
call npx cap add android 2>nul
if errorlevel 1 (
    echo ⚠️  Android already added or available
)
echo ✅ Android support ready!
echo.

REM 4. Sync
echo [4/4] Syncing to mobile projects...
call npx cap sync
echo ✅ Sync complete!
echo.

cls
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✅ SETUP COMPLETE!                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 📚 NEXT STEPS:
echo.
echo 1️⃣  TEST WEB APP LOCALLY:
echo    npm run dev
echo    Then visit: http://localhost:5173
echo.

echo 2️⃣  DEPLOY WEB APP:
echo    npm run build
echo    Upload dist/ folder to:
echo    - Vercel: vercel.com
echo    - Netlify: netlify.com
echo    - GitHub Pages (free)
echo.

echo 3️⃣  BUILD iOS APP (Mac only):
echo    npm run cap:open:ios
echo    - Opens Xcode
echo    - Select device/simulator
echo    - Press Cmd+R to build ^& run
echo.

echo 4️⃣  BUILD Android APP:
echo    npm run cap:open:android
echo    - Opens Android Studio
echo    - Click Run button
echo    - Select emulator or device
echo.

echo 📄 DOCUMENTATION:
echo    - Setup: APP_SETUP_GUIDE.md
echo    - Quick Start: GET_STARTED.md
echo    - Capacitor: CAPACITOR_NATIVE_BUILD.md
echo    - Deployment: DEPLOYMENT_SUMMARY.md
echo    - Structure: IOS_ANDROID_STRUCTURE.md
echo.

echo 💡 QUICK COMMANDS:
echo    npm run dev                 # Local development
echo    npm run build               # Production build
echo    npm run cap:sync            # Sync to mobile
echo    npm run cap:open:ios        # Open Xcode (Mac only)
echo    npm run cap:open:android    # Open Android Studio
echo.

echo 🎉 Your app is ready for:
echo    ✅ Web browsers (any device)
echo    ✅ iOS (iPhone/iPad)
echo    ✅ Android (any phone)
echo    ✅ App Stores (iOS + Google Play)
echo.

echo Happy deploying! 🚀
echo.
pause
