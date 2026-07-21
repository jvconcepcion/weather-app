<div align="center">
  <h1>Weather App</h1>
  <p>A cross-platform mobile weather app built with Expo and React Native.</p>
</div>

---

## Introduction

Weather App delivers real-time weather data, hourly and 8-day forecasts, city search, and favorites - all in a clean, gradient-driven UI. Authentication and cross-device sync are backed by Supabase, with support for English, Chinese Simplified, Korean, and Japanese.

## Tech Stack

- **[Expo SDK 54](https://expo.dev)** - managed workflow, file-based routing via expo-router
- **[React Native 0.81](https://reactnative.dev)** - New Architecture enabled
- **[TypeScript](https://www.typescriptlang.org)** - strict mode throughout
- **[Zustand](https://zustand-demo.pmnd.rs)** - lightweight global state
- **[NativeWind](https://www.nativewind.dev)** - Tailwind CSS for React Native
- **[Supabase](https://supabase.com)** - authentication and user data sync
- **[Open-Meteo](https://open-meteo.com)** - free, no-key weather and forecast API
- **[i18next](https://www.i18next.com)** - internationalization (EN / ZH / KO / JA)

## Features

- Real-time weather - current conditions, hourly forecast, and 8-day outlook powered by Open-Meteo
- City search - geocoding-backed search with recent searches and chip-based history
- Favorites - save cities and access them instantly from any screen
- Authentication - email/password and Google Sign-In via Supabase, with guest mode
- Internationalization - full EN / ZH / KO / JA support with auto device-locale detection and an in-app language picker
- Offline support - cached weather data shown when there is no network connection
- Haptics and accessibility - touch feedback, screen reader labels, and tablet-responsive layout

## Project Structure

```
src/
├── app/          # Screens and routes (Expo Router)
├── components/   # Reusable UI components
├── constants/    # Theme tokens and WMO weather code mappings
├── hooks/        # Data fetching, location, and form logic
├── i18n/         # Translations and locale setup (EN/ZH/KO/JA)
├── lib/          # Supabase client and auth helpers
├── services/     # Open-Meteo weather and geocoding API calls
├── store/        # Global state (Zustand)
└── utils/        # Shared helpers (alerts, haptics)
```

## Quick Start

**Prerequisites**

- [Node.js 18+](https://nodejs.org)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) or a physical device for Android

**Cloning the repository**

```bash
git clone https://github.com/jvconcepcion/weather-app.git
cd weather-app
```

**Installation**

```bash
npm install
```

**Set up environment variables**

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
```

> For Google Sign-In on Android, also download `google-services.json` from your Firebase Console and place it at the project root.

**Running the project**

```bash
npx expo start
```

For a full native build on Android:

```bash
npx expo run:android
```
