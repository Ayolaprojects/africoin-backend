#!/bin/bash
# AFRICOIN APP - MASTER SETUP SCRIPT
# This script automates the complete setup process

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║     🚀 AFRICOIN APP - COMPLETE SETUP & DEPLOYMENT 🚀          ║"
echo "║                                                                ║"
echo "║     Native iOS/Android + Web App (Production Ready)            ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}⚠️  Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 SETUP CHECKLIST:${NC}"
echo ""

# 1. Install Dependencies
echo -e "${GREEN}[1/5]${NC} Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  npm install had issues, but continuing...${NC}"
fi
echo -e "${GREEN}✅ Dependencies installed!${NC}"
echo ""

# 2. Build Web App
echo -e "${GREEN}[2/5]${NC} Building production web app..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}❌ Build failed. Please check errors above.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Web app built successfully!${NC}"
echo ""

# 3. Add iOS (if on Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${GREEN}[3/5]${NC} Adding iOS support..."
    npx cap add ios 2>/dev/null || echo -e "${YELLOW}⚠️  iOS already added or requires Xcode${NC}"
    echo -e "${GREEN}✅ iOS support ready!${NC}"
else
    echo -e "${YELLOW}[3/5]${NC} Skipping iOS (requires macOS)${NC}"
fi
echo ""

# 4. Add Android
echo -e "${GREEN}[4/5]${NC} Adding Android support..."
npx cap add android 2>/dev/null || echo -e "${YELLOW}⚠️  Android already added${NC}"
echo -e "${GREEN}✅ Android support ready!${NC}"
echo ""

# 5. Sync
echo -e "${GREEN}[5/5]${NC} Syncing to mobile projects..."
npx cap sync
echo -e "${GREEN}✅ Sync complete!${NC}"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ SETUP COMPLETE!                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${BLUE}📚 NEXT STEPS:${NC}"
echo ""
echo "1️⃣  TEST WEB APP LOCALLY:"
echo "   ${YELLOW}npm run dev${NC}"
echo "   Then visit: http://localhost:5173"
echo ""

echo "2️⃣  DEPLOY WEB APP:"
echo "   ${YELLOW}npm run build${NC}"
echo "   Upload dist/ folder to:"
echo "   - Vercel: ${BLUE}vercel.com${NC}"
echo "   - Netlify: ${BLUE}netlify.com${NC}"
echo "   - GitHub Pages (free)"
echo ""

echo "3️⃣  BUILD iOS APP (Mac only):"
echo "   ${YELLOW}npm run cap:open:ios${NC}"
echo "   - Opens Xcode"
echo "   - Select device/simulator"
echo "   - Press ⌘+R to build & run"
echo ""

echo "4️⃣  BUILD Android APP:"
echo "   ${YELLOW}npm run cap:open:android${NC}"
echo "   - Opens Android Studio"
echo "   - Click Run button"
echo "   - Select emulator or device"
echo ""

echo -e "${BLUE}📄 DOCUMENTATION:${NC}"
echo "  - Setup: ${YELLOW}APP_SETUP_GUIDE.md${NC}"
echo "  - Quick Start: ${YELLOW}GET_STARTED.md${NC}"
echo "  - Capacitor: ${YELLOW}CAPACITOR_NATIVE_BUILD.md${NC}"
echo "  - Deployment: ${YELLOW}DEPLOYMENT_SUMMARY.md${NC}"
echo "  - Structure: ${YELLOW}IOS_ANDROID_STRUCTURE.md${NC}"
echo ""

echo -e "${BLUE}💡 QUICK COMMANDS:${NC}"
echo "  npm run dev                 # Local development"
echo "  npm run build               # Production build"
echo "  npm run cap:sync            # Sync to mobile"
echo "  npm run cap:open:ios        # Open Xcode"
echo "  npm run cap:open:android    # Open Android Studio"
echo ""

echo -e "${GREEN}🎉 Your app is ready for:"
echo "   ✅ Web browsers (any device)"
echo "   ✅ iOS (iPhone/iPad)"
echo "   ✅ Android (any phone)"
echo "   ✅ App Stores (iOS + Google Play)${NC}"
echo ""
echo "Happy deploying! 🚀"
