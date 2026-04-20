# 🍎 iOS & 🤖 Android Project Structure (Post-Capacitor)

After running `npm run cap:add:ios` and `npm run cap:add:android`, your project will have this structure:

## 📁 Complete Directory Tree

```
AFRICOIN-APP - IOS/
│
├── 📦 Web App (Your React code)
├── ios/                               (iOS Native Project)
│   ├── App/
│   │   ├── App/
│   │   │   ├── AppDelegate.swift     (iOS app entry point)
│   │   │   └── ViewController.swift  (Main ViewController)
│   │   ├── Podfile                  (CocoaPods dependencies)
│   │   ├── Podfile.lock
│   │   ├── App.xcodeproj/           (Xcode project)
│   │   │   ├── project.pbxproj
│   │   │   └── xcshareddata/
│   │   ├── Pods/                    (CocoaPods libraries)
│   │   └── Assets/
│   │       ├── Images.xcassets      (App icons)
│   │       ├── LaunchScreen.storyboard
│   │       └── Info.plist
│   └── Capacitor/
│       ├── Capacitor.xcodeproj
│       ├── Capacitor/
│       └── CapacitorCordova/
│
├── android/                          (Android Native Project)
│   ├── app/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── AndroidManifest.xml (App config)
│   │   │   │   ├── java/
│   │   │   │   │   └── com/africoin/app/
│   │   │   │   │       └── MainActivity.java (Entry point)
│   │   │   │   ├── res/
│   │   │   │   │   ├── drawable/    (Icons & images)
│   │   │   │   │   ├── mipmap/      (App icons)
│   │   │   │   │   ├── values/      (Colors, strings)
│   │   │   │   │   └── layout/      (Layouts)
│   │   │   │   └── assets/
│   │   │   │       └── capacitor.plugins.json
│   │   │   ├── test/
│   │   │   └── androidTest/
│   │   ├── build.gradle             (App dependencies)
│   │   ├── proguard-rules.pro        (Code obfuscation)
│   │   └── release/                 (Signing keys)
│   │
│   ├── gradle/                       (Gradle wrapper)
│   ├── build.gradle                  (Project dependencies)
│   └── local.properties              (Local SDK paths)
│
├── src/                             (Your React code - unchanged)
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
│
├── public/                          (Static assets)
│   ├── logo.png
│   └── index.html
│
├── dist/                            (Compiled web app - after build)
│   ├── index.html
│   ├── assets/
│   └── styles/
│
├── node_modules/                    (npm packages)
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── capacitor.config.ts              (Capacitor config)
│
├── 📄 Documentation
├── APP_SETUP_GUIDE.md
├── GET_STARTED.md
├── CAPACITOR_NATIVE_BUILD.md
├── DEPLOYMENT_SUMMARY.md            (← You are here)
├── quick-start.bat
└── quick-start.sh
```

---

## 🔄 How Files Are Synced

When you run `npm run cap:sync`:

```
src/ (React code)
   ↓
npm run build
   ↓
dist/ (Compiled HTML/JS/CSS)
   ↓
npx cap sync
   ↓
ios/App/public/ (iOS WebView loads this)
   ↓
android/app/src/main/assets/public/ (Android loads this)
```

---

## 📱 iOS Project Key Files

### AppDelegate.swift
Entry point for the iOS app. Initializes Capacitor.

### ViewController.swift
Main view controller that hosts the Capacitor WebView.

### Podfile
Lists iOS dependencies (React, Capacitor, etc.)

### App.xcodeproj
Xcode project file. Open this in Xcode to build/run.

### Info.plist
App configuration - permissions, app info, etc.

### Images.xcassets
Where you add app icons, launch images, etc.

---

## 🤖 Android Project Key Files

### MainActivity.java
Android app entry point. Initializes Capacitor WebView.

### AndroidManifest.xml
App configuration and permissions.

### build.gradle
Dependencies and build configuration.

### res/drawable/
App icons and images (launcher icon, splash screen)

### res/values/colors.xml
App color definitions

### res/values/strings.xml
App text strings

---

## 🎨 Adding App Icons

### iOS (Xcode)
1. Open in Xcode: `ios/App/App.xcodeproj`
2. Select Assets → AppIcon
3. Drag 1024x1024 PNG to each size
4. Xcode auto-generates the rest

### Android (Android Studio)
1. Open in Android Studio: `android/`
2. Right-click res folder → New → Image Asset
3. Select app icon PNG (1024x1024)
4. Name: ic_launcher
5. Android generates all sizes

---

## 🖼️ Splash Screen Setup

### iOS
File: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

1. Create 1024x1024 image with Africoin branding
2. Drag to Xcode AppIcon
3. Set background color in LaunchScreen.storyboard

### Android
File: `android/app/src/main/res/drawable/`

1. Create splash.png (1024x1024)
2. Place in drawable folder
3. Update launch_background.xml to reference it

---

## 📦 Building for Each Platform

### iOS Build Process
```
src/ → dist/ → ios/public/ → Xcode Build → .app → ipa (archive)
```

### Android Build Process
```
src/ → dist/ → android/assets/ → Gradle Build → APK (or AAB)
```

---

## 🔐 Signing & Certificates

### iOS Signing
1. Apple Developer Account required
2. Create Signing Certificate
3. Xcode auto-manages with your Apple ID
4. Select Team in Xcode → Signing & Capabilities

### Android Signing
1. Generate Keystore (once)
```bash
keytool -genkey -v -keystore africoin-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias africoin
```

2. In `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        keyStore file("../africoin-release-key.jks")
        keyStorePassword "your_password"
        keyAlias "africoin"
        keyPassword "your_password"
    }
}
```

---

## 📊 Development Workflow

### Day-to-Day Development
```bash
# Terminal 1: Watch React changes
npm run dev

# Terminal 2: When ready to test on device
npm run build
npm run cap:sync ios    # or android

# Then rebuild in Xcode/Android Studio
```

### After Code Changes
```bash
# Just sync changes (no rebuild needed)
npm run build
npm run cap:sync

# Rebuild in Xcode/Android Studio
```

---

## 🔌 Using Native Plugins

### Example: Camera

```bash
npm install @capacitor/camera
npm run cap:sync ios
npm run cap:sync android
```

Then in React:
```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

async function takePhoto() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri
  });
  return image.webPath;
}
```

### Available Plugins
- Camera
- Geolocation
- Storage
- Keyboard
- StatusBar
- SplashScreen
- LocalNotifications
- PushNotifications
- And more: https://capacitorjs.com/docs/apis

---

## 🗂️ Where to Put Files

### Custom Native Code
- **iOS**: `ios/App/App/Plugins/`
- **Android**: `android/app/src/main/java/com/africoin/app/`

### Images & Assets
- **iOS Icons**: `ios/App/App/Assets.xcassets/`
- **Android Icons**: `android/app/src/main/res/drawable/`
- **Web Assets**: `public/` folder

### Configuration
- **iOS**: `Info.plist` and `ios/App/App/ViewController.swift`
- **Android**: `AndroidManifest.xml` and `MainActivity.java`

---

## 🐛 Debugging

### iOS Debugging
1. Open Xcode
2. Product → Scheme → Edit Scheme
3. Run → Pre-actions (add breakpoints)
4. Console logs visible in Xcode Output panel

### Android Debugging
1. Open Android Studio
2. Run → Edit Configurations
3. Add breakpoints in code
4. Logcat window shows logs

### Web View Console (Both)
Open browser inspector (F12) when app is running in simulator/emulator to see console.log() output.

---

## 📈 App Store Submission Checklist

### Before Submission

**iOS (App Store)**
- [ ] App icons (1024x1024)
- [ ] Screenshots (3-5 per iPhone size)
- [ ] App description & keywords
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Version number (e.g., 1.0.0)
- [ ] Bundle ID (com.africoin.app)
- [ ] Minimum iOS version (14.0+)
- [ ] Content rating
- [ ] Sign in with Apple or wallet connection

**Android (Play Store)**
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (2-8 per phone size)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars max)
- [ ] Privacy policy URL
- [ ] Minimum Android version (API 24+)
- [ ] Target Android version (API 33+)
- [ ] Content rating
- [ ] APK/AAB signed and tested

---

## ⏱️ Timeline

| Step | Time | Notes |
|------|------|-------|
| App development | 2-4 weeks | ✅ Done for you |
| Configuration | 1-2 days | Update app info, icons |
| iOS build | 30 min | Xcode build time |
| iOS TestFlight | 30 min | Upload & test |
| iOS App Store review | 24-48 hrs | Apple reviews manually |
| Android build | 20 min | Gradle build time |
| Android Play Store review | 2-3 hrs | Automated review |

---

## 📞 Quick Reference

```bash
# Setup
npm run cap:add:ios         # Add iOS project (first time)
npm run cap:add:android     # Add Android project (first time)

# Updates
npm run build               # Build web app
npm run cap:sync            # Sync to both platforms
npm run cap:sync ios        # Sync to iOS only
npm run cap:sync android    # Sync to Android only

# Open in IDE
npm run cap:open:ios        # Open Xcode
npm run cap:open:android    # Open Android Studio

# Copy only (without building React)
npx cap copy ios
npx cap copy android

# Update dependencies
npx cap update ios
npx cap update android
```

---

## ✅ Success Markers

Your project is ready when:
- ✅ `npm run dev` shows web app working
- ✅ `npm run build` completes with no errors
- ✅ `npm run cap:sync ios` succeeds
- ✅ `npm run cap:sync android` succeeds
- ✅ Xcode project opens and builds
- ✅ Android Studio project opens and builds
- ✅ App runs in iOS simulator
- ✅ App runs in Android emulator

---

## 🚀 You're Ready!

Everything is set up and configured. Your app can now be:
- Run as a web app (desktop browsers)
- Deployed on iOS (TestFlight → App Store)
- Deployed on Android (Internal testing → Play Store)
- Installed on any iPhone/iPad/Android phone

Next step: `npm run dev` and test it! 🎉

