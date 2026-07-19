/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: 'Weather App',
  slug: 'weather-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'weatherapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.POST_NOTIFICATIONS',
    ],
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    package: 'com.jthan.weatherapp',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    ['expo-router', { root: 'src/app' }],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Allow Weather App to use your location to show local weather.',
      },
    ],
    ['expo-notifications', { defaultChannel: 'default' }],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: { backgroundColor: '#000000' },
      },
    ],
    '@react-native-google-signin/google-signin',
    'expo-secure-store',
    'expo-localization',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: { root: 'src/app' },
    eas: { projectId: '7913be9b-5d1f-4e09-b063-6375c594f63a' },
  },
  owner: 'jvconcepcion1991',
};
