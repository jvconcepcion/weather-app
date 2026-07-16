@AGENTS.md

# CLAUDE.md

Guidance for Claude Code when working in the weather-app repository.

## Project Overview

Weather App is an Expo (SDK 54) React Native app with real-time weather data, city search, favorites, and Supabase-backed auth and sync. TypeScript strict mode, expo-router for navigation, Zustand for state, NativeWind for styling.

## Commands

- `npx expo start`: start the Metro dev server
- `npx expo run:android`: run on connected Android device/emulator
- `npm test`: run the full Jest suite (no watch)
- `npm run test:watch`: Jest in watch mode
- `expo lint`: ESLint via eslint-config-expo
- `npx tsc --noEmit`: type check without emitting files
- `eas build --platform android --profile development`: EAS development build

There is no `build` script for local dev, do not invent one.

## Code Style

- TypeScript strict mode throughout. Avoid `any`; always cast explicitly when unavoidable.
- NativeWind (`className`) over `StyleSheet` or inline style objects. Only use inline styles when NativeWind cannot express the value (e.g. dynamic numeric values).
- `async`/`await` everywhere. No `.then()` chains in application code.
- No comments unless the WHY is non-obvious. Never describe what the code does.
- No emojis in code or output unless the user explicitly asks.

## Architecture

```
src/
├── app/          # Expo Router screens, file name = route
├── components/   # Presentational UI only, no business logic
├── constants/    # Design tokens (theme.ts), WMO weather codes (wmo.ts)
├── hooks/        # Orchestration: data fetching, permissions, form state
├── lib/          # External client setup (Supabase client, auth helpers)
├── services/     # Pure fetch wrappers for Open-Meteo weather and geocoding
├── store/        # Zustand stores (useAppStore, useAuthStore)
└── utils/        # Thin helpers (alerts, haptics)
```

- `services/` is the only place that calls external APIs.
- `store/` is the only place that holds global state.
- `lib/supabase.ts` is the single Supabase client. Never create another instance.
- `ScreenContainer` (`src/components/ScreenContainer.tsx`) is the standard screen wrapper. Use it instead of bare `View` + `SafeAreaView`.

## Repo Conventions

- Branches: `feature/` (new features), `bugfix/` (bug fixes), `hotfix/` (critical production fixes), `release/` (release prep), `docs/` (documentation), `refactor/` (code refactoring). Examples: `feature/github-actions-ci`, `bugfix/header-styling`, `hotfix/critical-security-issue`.
- Commits follow Conventional Commits: `feat:`, `fix:`, `hotfix:`, `release:`, `refactor:`, `docs:`, `test:`.
- Pre-commit hook (Husky + lint-staged) runs `eslint --fix` and `prettier --write` automatically.
- All icon-only touchables must have `accessibilityRole="button"` and `accessibilityLabel`.

## Environment

- Expo SDK 54, React Native 0.81.5, New Architecture enabled.
- Node.js >= 18 required.
- Copy `.env.example` to `.env` and fill in Supabase and Google credentials before running.
- `google-services.json` must be downloaded from Firebase Console and placed at the project root. It is gitignored.

## Critical Rules

- IMPORTANT: Never commit `.env`, `google-services.json`, `GoogleService-Info.plist`, or `credentials.json`. All are gitignored for security.
- IMPORTANT: Use `expo-secure-store` (via `lib/secureStorage.ts`) for any sensitive data. Never use `AsyncStorage` for tokens or credentials.
- IMPORTANT: Read the exact versioned Expo docs at https://docs.expo.dev/versions/v54.0.0/ before writing any Expo-specific code.
- Never create a second Supabase client. Always import from `src/lib/supabase.ts`.
- Never use `router.push` with `as never`. Use typed routes instead.
