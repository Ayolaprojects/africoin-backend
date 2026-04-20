import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.africoin.app',
  appName: 'Africoin',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  // iOS specific settings
  ios: {
    scheme: 'Africoin',
    bundleId: 'com.africoin.app',
  },
  // Android specific settings
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'AAB', // or 'APK'
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#020817',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#22c55e',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#22c55e',
    },
  },
};

export default config;
