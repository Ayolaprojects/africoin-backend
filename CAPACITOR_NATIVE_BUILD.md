# 🚀 Convert to Native iOS/Android with Capacitor

Your Africoin app can now be converted to native iOS and Android apps using Capacitor!

## ⚡ Quick Setup (15 minutes)

### Step 1: Build Web App
```bash
npm run build
```

### Step 2: Add iOS & Android
```bash
# iOS
npm run cap:add:ios

# Android (optional, do both or one)
npm run cap:add:android
```

### Step 3: Sync Changes
```bash
npm run cap:sync
```

### Step 4: Open in Native IDE
```bash
# iOS - Opens in Xcode
npm run cap:open:ios

# Android - Opens in Android Studio
npm run cap:open:android
```

---

## 📱 DETAILED SETUP (macOS for iOS)

### Prerequisites for iOS

**Required:**
- Mac with macOS 10.15+
- Xcode 12+ (App Store)
- Xcode Command Line Tools installed

**Installation:**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Or install full Xcode from App Store
```

**Verify Installation:**
```bash
xcode-select --version
npm --version
node --version
```

### Complete iOS Setup

```bash
# 1. Install Capacitor CLI
npm install -g @capacitor/cli

# 2. Navigate to project
cd "C:\Users\zwexm\LPSN\AFRICOIN-APP - IOS"

# 3. Build production
npm run build

# 4. Add iOS platform (first time only)
npx cap add ios

# 5. Sync web files to iOS project
npx cap sync ios

# 6. Open in Xcode
npx cap open ios
```

### Building iOS App in Xcode

Once Xcode opens:

1. **Select Device/Simulator**
   - Top left: Select target device (iPhone 15 Pro, etc.)

2. **Configure Signing**
   - Navigate menu: Signing & Capabilities
   - Team: Select your Apple Developer account
   - Bundle Identifier: `com.africoin.app`

3. **Build & Run**
   - Press: `⌘ + R` (or Product → Run)
   - Wait for build to complete (~2 min)

4. **Test on Device**
   - Connect iPhone via USB
   - Select device in dropdown
   - Press `⌘ + R` to install

### Publishing to App Store

```bash
# 1. Archive for distribution
Product → Archive (in Xcode)

# 2. Sign & upload
Window → Organizer → Upload

# 3. Submit for review
App Store Connect → TestFlight → Submit
```

---

## 🤖 DETAILED SETUP (Android)

### Prerequisites for Android

**Required:**
- Android Studio 4.1+
- JDK 8 or 11
- Android SDK (auto-installed with Android Studio)

**Installation:**
```bash
# Windows: Download from
# https://developer.android.com/studio

# macOS: 
brew install android-studio

# Linux:
# Download from developer.android.com/studio
```

**Verify Installation:**
```bash
java -version
sdkmanager --version
```

### Complete Android Setup

```bash
# 1. Build production
npm run build

# 2. Add Android platform (first time only)
npx cap add android

# 3. Sync web files to Android project
npx cap sync android

# 4. Open in Android Studio
npx cap open android
```

### Building Android App in Android Studio

Once Android Studio opens:

1. **Gradle Sync**
   - File → Sync Now (waits for gradle sync)
   - Wait for build to complete

2. **Configure App Settings**
   - Open: `android/app/build.gradle`
   - Update:
     ```gradle
     defaultConfig {
         applicationId = "com.africoin.app"
         minSdk = 24
         targetSdk = 34
         versionCode = 1
         versionName = "1.0.0"
     }
     ```

3. **Build & Run**
   - Run → Run 'app'
   - Select emulator or connected device
   - Wait for build (~3 min on first run)

4. **Test on Device**
   - Connect Android phone via USB
   - Enable Developer Mode:
     - Settings → About → Tap Build 7x
     - Settings → Developer → USB Debugging ON
   - Select device in Android Studio
   - Click Run button

### Building Release APK

```bash
# 1. Open Build menu
Build → Generate Signed Bundle/APK

# 2. Select APK (not Bundle)

# 3. Configure signing key
# Create keystore or use existing

# 4. Export
# Save APK file

# 5. Install on device
adb install path/to/app-release.apk
```

### Publishing to Play Store

```bash
# 1. Generate signed AAB
Build → Generate Signed Bundle/APK (select Bundle)

# 2. Upload to Play Store
# Visit: https://play.google.com/console

# 3. Create app listing
# Add screenshots, descriptions, etc.

# 4. Submit for review
# Wait 2-7 days for approval
```

---

## 🔄 Development Workflow

### During Development

```bash
# Terminal 1: Watch React changes
npm run dev

# Terminal 2: In iOS/Android folder
# Make code changes in src/
# Build when ready
npm run build
npx cap sync ios    # or android
# Rebuild in Xcode/Android Studio
```

### Plugin Usage (Camera, Location, etc.)

```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const takePhoto = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri
  });
  return image.webPath;
};
```

### Useful Plugins

```bash
# Camera
npm install @capacitor/camera

# Geolocation
npm install @capacitor/geolocation

# Storage
npm install @capacitor/storage

# Push Notifications
npm install @capacitor/push-notifications

# Sync with native projects
npx cap sync
```

---

## 🐛 Troubleshooting

### iOS Issues

**Xcode Build Fails**
```bash
# Clean build
cd ios/App
rm -rf Pods
rm Podfile.lock
pod install
cd ../..
npx cap open ios
```

**Port 8081 in use**
```bash
# Kill process using port
lsof -i :8081
kill -9 <PID>
```

**Signing Issues**
- Xcode → Preferences → Accounts
- Add Apple ID account
- Reset simulator: Device → Erase All Content and Settings

### Android Issues

**Gradle Build Fails**
```bash
# Clean build
cd android
./gradlew clean
./gradlew build
cd ..
```

**Emulator Won't Start**
```bash
# List emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_4_API_30
```

**Device Not Recognized**
```bash
# Check connected devices
adb devices

# Restart ADB
adb kill-server
adb start-server
```

---

## 📋 File Structure After Capacitor Setup

```
AFRICOIN-APP - IOS/
├── ios/
│   └── App/
│       ├── App.xcodeproj/
│       ├── Podfile
│       └── App (source)
├── android/
│   ├── app/
│   │   ├── src/
│   │   └── build.gradle
│   ├── gradle/
│   └── build.gradle
├── src/
├── dist/
└── capacitor.config.ts
```

---

## 🔐 Production Settings

### iOS

Create `.env.production`:
```
VITE_API_URL=https://api.africoin.com
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
NODE_ENV=production
```

In Xcode:
- Set Build Configuration to Release
- Update App Icon (1024x1024 PNG)
- Update Launch Screen
- Add Privacy Descriptions in Info.plist

### Android

In `android/app/build.gradle`:
```gradle
buildTypes {
  release {
    minifyEnabled true
    proguardFiles getDefaultProguardFile(...), 'proguard-rules.pro'
  }
}
```

Setup signing key in keystore properties.

---

## 🎯 Testing Checklist

### Before Submission

- [ ] Test all pages load
- [ ] Wallet connection works
- [ ] Payments process correctly
- [ ] Swaps work properly
- [ ] Transactions display
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] App icon displays
- [ ] Splash screen shows
- [ ] Offline functionality (if needed)

### Device Testing

- [ ] iPhone 13/14/15 (iOS)
- [ ] Android 10+ phones
- [ ] Tablets (iPad/Android)
- [ ] Different orientations
- [ ] Slow 3G network

---

## 📊 Capacitor Configuration

Edit `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.africoin.app',
  appName: 'Africoin',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
```

---

## 🚀 Quick Commands Reference

```bash
# Build
npm run build

# iOS
npm run cap:add:ios
npm run cap:sync      # Sync web to iOS
npm run cap:open:ios   # Open Xcode

# Android
npm run cap:add:android
npm run cap:sync      # Sync web to Android
npm run cap:open:android # Open Android Studio

# Updates
npm run cap:sync      # Sync after changes

# View console logs
npx cap open ios   # View Xcode console
npx cap open android # View Android Studio logcat
```

---

## 📱 Final Steps

1. **Test in browsers first**
   ```bash
   npm run dev
   # Test at localhost:5173
   ```

2. **Build production**
   ```bash
   npm run build
   ```

3. **Sync to mobile**
   ```bash
   npx cap sync ios
   npx cap sync android
   ```

4. **Build & test on device**
   - iOS: Open Xcode, press ⌘+R
   - Android: Open Android Studio, click Run

5. **Publish**
   - iOS: App Store (14-48 hours review)
   - Android: Play Store (2-3 hours review)

---

## ✅ Success!

Your Africoin app is now:
- ✅ Web app (localhost:5173)
- ✅ iOS native app (App Store ready)
- ✅ Android native app (Play Store ready)
- ✅ Fully responsive
- ✅ Works offline (with caching)

**Total Time:** ~30 minutes (first setup)
**Time per update:** ~2 minutes (just `npm run cap:sync`)

---

## 📞 Support

- Capacitor Docs: https://capacitorjs.com/docs
- iOS Support: https://developer.apple.com/
- Android Support: https://developer.android.com/

Good luck! 🚀
