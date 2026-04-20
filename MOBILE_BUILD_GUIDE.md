# 🚀 AfriCoin - iOS & Android Build Guide

## Complete Setup for Mobile App Deployment

---

## 📱 Prerequisites

### Requirements
- **Node.js** 18+ 
- **npm** or **yarn**
- **Capacitor** CLI
- **iOS**: Xcode 14+, macOS
- **Android**: Android Studio, Java SDK 11+

### Installation

```bash
# Global Capacitor CLI
npm install -g @capacitor/cli

# Navigate to project
cd "C:\Users\zwexm\LPSN\AFRICOIN-APP - IOS"

# Install dependencies
npm install
```

---

## 🏗️ Build Process

### Step 1: Build Web App

```bash
# From project root
npm run build

# This creates the 'dist' folder that gets bundled into mobile apps
```

### Step 2: Sync Capacitor

```bash
# Sync the web app to both iOS and Android
npx cap sync

# Or sync individually:
npx cap sync ios
npx cap sync android
```

---

## 🍎 iOS Build Guide

### Step 1: Install iOS Platform

```bash
# Add iOS platform
npx cap add ios

# Or update existing
npx cap update ios
```

### Step 2: Open in Xcode

```bash
# Open iOS project in Xcode
npx cap open ios

# Or manually:
open ios/App/App.xcworkspace
```

### Step 3: Configure in Xcode

1. **Select Team**
   - Select project in left sidebar
   - Select "App" target
   - Go to Signing & Capabilities
   - Select your Apple Team

2. **Configure Bundle ID**
   - Bundle Identifier: `com.africoin.app`
   - Version: `1.0.0`
   - Build: `1`

3. **Enable Capabilities**
   - Go to Signing & Capabilities
   - Click "+ Capability"
   - Add:
     - Push Notifications
     - App Groups
     - HealthKit (for biometric auth)

### Step 4: Build & Run

```bash
# In Xcode:
1. Select simulator or device
2. Product > Build (⌘B)
3. Product > Run (⌘R)

# Or via terminal:
xcodebuild -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -derivedDataPath build
```

### Step 5: Create Signing Certificate

```bash
# Generate Certificate Signing Request (CSR) in Keychain Access
# Then upload to Apple Developer account
# Download provisioning profile

# Import to Xcode:
# 1. Xcode > Preferences > Accounts
# 2. Download Manual Profiles
# 3. Restart Xcode
```

### Step 6: Archive & Submit

```bash
# In Xcode:
1. Product > Archive
2. Window > Organizer
3. Select Archive > Distribute App
4. Choose: App Store Connect
5. Follow upload steps

# Or via terminal:
xcodebuild -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -archivePath build/App.xcarchive \
  archive

# Export archive:
xcodebuild -exportArchive \
  -archivePath build/App.xcarchive \
  -exportPath build/ipa \
  -exportOptionsPlist ios/EnlistConfig.plist
```

### iOS App Icons & Splash

```bash
# Icons should be at: ios/App/App/Assets.xcassets
# Add icons in:
# - 1024x1024 for App Store
# - 180x180 for iPhone
# - 120x120 for iPhone notification
# - 167x167 for iPad

# Splash screen:
# iOS: ios/App/App/Assets.xcassets/LaunchImage.imageset
```

### iOS Signing for Ad Hoc Distribution

```bash
# Create Ad Hoc provisioning profile in Apple Developer
# 1. Go to developer.apple.com
# 2. Certificates, Identifiers & Profiles
# 3. Provisioning Profiles > Ad Hoc
# 4. Create new profile
# 5. Download and install

# Update in Xcode:
# 1. Xcode > Preferences > Accounts
# 2. Download updated profiles
# 3. Build with Ad Hoc provisioning
```

---

## 🤖 Android Build Guide

### Step 1: Install Android Platform

```bash
# Add Android platform
npx cap add android

# Or update existing
npx cap update android
```

### Step 2: Prerequisites

```bash
# Install Java Development Kit (JDK 11+)
# Download from: https://www.oracle.com/java/technologies/downloads/

# Set JAVA_HOME environment variable:
# Windows:
setx JAVA_HOME "C:\Program Files\Java\jdk-11.0.x"

# Linux/Mac:
export JAVA_HOME=/path/to/jdk

# Install Android SDK
# Download Android Studio from: https://developer.android.com/studio
```

### Step 3: Configure Android SDK

In **Android Studio**:

1. **SDK Manager** (Tools > SDK Manager):
   - SDK Platforms:
     - Android 12 (API 31)
     - Android 13 (API 33)
     - Android 14 (API 34)
   - SDK Tools:
     - Android SDK Platform Tools
     - Android SDK Build Tools (latest)
     - Android Emulator
     - NDK

2. **Configure gradle.properties** (android/gradle.properties):
```properties
org.gradle.jvmargs=-Xmx2048m
org.gradle.parallel=true
org.gradle.caching=true
```

### Step 4: Generate Keystore

```bash
# For Debug (Testing):
keytool -genkey -v -keystore debug.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias androiddebugkey \
  -storepass android -keypass android

# For Release (Distribution):
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias africoin-release \
  -storepass YOUR_PASSWORD -keypass YOUR_PASSWORD
```

### Step 5: Build APK

```bash
# Navigate to Android directory
cd android

# Build Debug APK:
./gradlew assembleDebug

# APK location: app/build/outputs/apk/debug/app-debug.apk

# Build Release APK:
./gradlew assembleRelease

# APK location: app/build/outputs/apk/release/app-release-unsigned.apk
```

### Step 6: Sign APK (Release)

```bash
# Sign the APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore release.keystore \
  app/build/outputs/apk/release/app-release-unsigned.apk \
  africoin-release

# Verify signing
jarsigner -verify -verbose app/build/outputs/apk/release/app-release-unsigned.apk

# Optimize with zipaling (optional)
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

### Step 7: Build AAB (Android App Bundle)

```bash
# For Google Play Store
./gradlew bundleRelease

# AAB location: app/build/outputs/bundle/release/app-release.aab

# Test AAB locally:
./gradlew bundleDebug
```

### Step 8: Upload to Play Store

```bash
# Via Google Play Console:
# 1. Go to play.google.com/console
# 2. Create new app
# 3. Release > Production
# 4. Upload AAB or APK
# 5. Fill in store listing
# 6. Submit for review
```

### Android Signing Configuration

In **build.gradle**:

```gradle
android {
  signingConfigs {
    release {
      storeFile file("../release.keystore")
      storePassword "YOUR_PASSWORD"
      keyAlias "africoin-release"
      keyPassword "YOUR_PASSWORD"
    }
  }

  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
  }
}
```

### Android Permissions

In **android/app/src/AndroidManifest.xml**:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.BIOMETRIC" />
```

### Android Icons & Assets

```
Icons:
- 192x192 -> android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
- 144x144 -> android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
- 96x96  -> android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
- 72x72  -> android/app/src/main/res/mipmap-hdpi/ic_launcher.png
- 48x48  -> android/app/src/main/res/mipmap-mdpi/ic_launcher.png

Splash screen:
- android/app/src/main/res/drawable/splash.png
```

---

## 📦 Release Checklist

### Pre-Release

- [ ] Update version in `capacitor.config.ts`
- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Run full test suite: `npm test`
- [ ] Build web app: `npm run build`
- [ ] Test in simulator/emulator

### iOS Release

- [ ] Archive in Xcode
- [ ] Check build settings
- [ ] Verify signing certificate
- [ ] Upload to App Store
- [ ] Fill app details
- [ ] Submit for review

### Android Release

- [ ] Build AAB: `./gradlew bundleRelease`
- [ ] Verify signing
- [ ] Upload to Play Console
- [ ] Fill app details
- [ ] Submit for review
- [ ] Add privacy policy

### Post-Release

- [ ] Monitor crash reports
- [ ] Check user ratings
- [ ] Respond to reviews
- [ ] Plan hotfixes if needed

---

## 🔧 Troubleshooting

### iOS Issues

**Codesigning error:**
```bash
# Clean build folder
rm -rf ~/Library/Developer/Xcode/DerivedData/

# Restart Xcode
killall Xcode

# Retry build
```

**Pod issues:**
```bash
# Update pods
cd ios
rm Podfile.lock
pod install
```

### Android Issues

**Gradle build error:**
```bash
# Clean build
./gradlew clean

# Retry
./gradlew assembleDebug
```

**Keystore password forgotten:**
```bash
# Generate new keystore
keytool -genkey -v -keystore new.keystore -keyalg RSA -keysize 2048 -validity 10000
```

---

## 🌐 Testing

### iOS Simulator

```bash
# List available simulators
xcrun simctl list devices

# Run on specific simulator
xcrun simctl boot "iPhone 15"

# Install app
xcrun simctl install booted build/app.app

# Launch app
xcrun simctl launch booted com.africoin.app
```

### Android Emulator

```bash
# List AVDs
emulator -list-avds

# Start emulator
emulator -avd Pixel_5

# Verify connection
adb devices

# Install APK
adb install app-debug.apk

# Launch app
adb shell am start -n com.africoin.app/.MainActivity
```

### Testing Banking Features

```bash
# 1. Create test account
# 2. Link test bank account
# 3. Make test transfer
# 4. Verify transaction history
# 5. Check payment notifications
```

---

## 📊 Distribution

### App Store Distribution

1. **Create Account**: developer.apple.com
2. **Add Certificate**: iOS Bundle ID
3. **Create AppID**: com.africoin.app
4. **Upload**: TestFlight first, then Production
5. **Review**: ~24-48 hours

### Google Play Distribution

1. **Create Account**: play.google.com/console
2. **Setup Store Listing**: Add screenshots, descriptions
3. **Content Classification**: Select appropriate rating
4. **Privacy Policy**: Add URL
5. **Upload AAB**: Submit for review
6. **Review**: ~24-48 hours

---

## 📈 Feature Rollout

```bash
# Staged rollout
# Google Play: 1% -> 5% -> 10% -> 25% -> 50% -> 100%
# App Store: Full rollout immediately

# Monitor metrics:
# - Crash-free sessions
# - Uninstall rate
# - User ratings
```

---

## 🔐 Security

### iOS Security
- Enable code signing
- Use secure enclave for sensitive data
- Enable app transport security

### Android Security
- Obfuscate code with ProGuard
- Use certificate pinning
- Enable security exceptions

```xml
<!-- network_security_config.xml -->
<domain-config cleartextTrafficPermitted="false">
  <domain includeSubdomains="true">api.africoin.com</domain>
  <pin-set expiration="2027-12-31">
    <pin digest="SHA-256">YOUR_CERTIFICATE_SHA256</pin>
  </pin-set>
</domain-config>
```

---

## 📞 Support

For build issues:
1. Check app logs: `adb logcat` or Xcode console
2. Review Capacitor docs: capacitorjs.com
3. Check GitHub issues: github.com/ionic-team/capacitor

---

## 🎯 Next Steps

1. ✅ Configure signing certificates
2. ✅ Build and test in simulator/emulator
3. ✅ Prepare app store listings
4. ✅ Submit for review
5. ✅ Monitor releases
6. ✅ Plan future updates

---

**Happy releasing!** 🚀
