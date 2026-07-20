# Feature: Internationalization (i18n)

## Intent

All user-visible text in the app is served through i18next translation keys, with English as the default language and Chinese Simplified, Korean, and Japanese as additional targets, switchable both by device locale and by a new in-app language preference in Settings.

## Context

- **Problem statement:** Every user-visible string in the app is hardcoded in English. There is no translation infrastructure, no locale detection, and no way for users to choose a display language. The app currently targets an audience that spans Chinese, Korean, and Japanese speakers in addition to English speakers, making i18n a prerequisite for any regional expansion.
- **Current code:** Hardcoded English strings are scattered across all screens and most components. Representative examples (confirmed by source inspection):
  - `src/app/index.tsx`: "Recent Searches", "Clear", "No internet connection.", "Location access needed", "Couldn't get your location", "Open Settings", "Try Again", "Search manually instead →", "Current location"
  - `src/components/SearchBar.tsx`: `placeholder="Search city..."`, "No results found"
  - `src/components/CurrentWeather.tsx`: `"Feels like {temp}"`
  - `src/components/WeatherStats.tsx`: module-level `STATS` array with hardcoded labels "Humidity", "Wind", "Precip.", "UV Index"; hardcoded "Sunrise", "Sunset"
  - `src/components/HourlyForecast.tsx`: "Hourly Forecast", "No forecast available"; custom `formatHour` function produces locale-unaware strings like `"12am"`, `"3pm"`
  - `src/components/DailyForecast.tsx`: "8-Day Forecast", "No forecast available", "Today"; module-level `DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']`
  - `src/components/ProfileMenuButton.tsx`: "Open profile menu", "Browsing as guest", "Settings", "About", "Sign in", "Log in", "Sign out", "Are you sure to sign out?", "Cancel"
  - `src/components/Chip.tsx`: `actionAccessibilityLabel = 'Remove'` prop default
  - `src/components/AuthModeTabs.tsx`: "Sign in", "Sign up"
  - `src/components/SocialSignIn.tsx`: "or", "Continue with Google", "Continue as guest"
  - `src/components/ForgotHeader.tsx`: "Back to sign in", "Reset password", "Use your account email to reset your password."
  - `src/app/login.tsx`: "Weather App", "Email address", "Password", "Confirm password", "Forgot password?"
  - `src/app/reset-password.tsx`: "Password updated!", "Taking you back to the app…", "Set new password", "New password", "Confirm new password", "Update password"
  - `src/app/settings.tsx`: all section labels, row titles, subtitles, and all three `showConfirmAlert` calls with hardcoded title/message strings
  - `src/app/about.tsx`: "About", "Version 1.0.0", copyright line, "Terms of Service", "Privacy Policy", "Open Source Software Notice"
  - `src/app/location/[id].tsx`: "Location", "Location not found", "Try Again", `accessibilityLabel` strings
  - `src/app/_layout.tsx` (`ErrorBoundary`): "Something went wrong", "Try again"
  - `src/hooks/useLoginForm.ts`: all error and success message strings produced inline (e.g., `"Please enter your email."`, `"Passwords do not match."`, `"Reset link sent — check your inbox."`)
  - `src/utils/alets.ts`: default values `confirmText = 'Confirm'` and `cancelText = 'Cancel'`
- **User impact:** After this feature ships, the app displays text in the user's device locale (English, Chinese Simplified, Korean, or Japanese) by default. Users can override the language in Settings. All accessibility labels, alert dialogs, and error messages are localized.
- **Dependencies:**
  - `i18next`, `react-i18next`, and `expo-localization` must be added as runtime dependencies.
  - `expo-localization` is not currently installed (confirmed; absent from `package.json` dependencies).
  - No database schema changes are required. The language preference is stored in the existing Zustand `app-storage` AsyncStorage entry via `useAppStore`.
  - No backend or Supabase changes are required.

## Data Model

### `useAppStore` — new fields

Two fields are added to `AppStore` (`src/store/useAppStore.ts`):

| Field         | Type                             | Default | Description                                                                                                           |
| ------------- | -------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| `language`    | `string \| null`                 | `null`  | BCP 47 language tag chosen by the user (`'en'`, `'zh'`, `'ko'`, `'ja'`). `null` means auto-detect from device locale. |
| `setLanguage` | `(lang: string \| null) => void` | —       | Setter; triggers `i18next.changeLanguage()` in a layout-level effect.                                                 |

`language` is added to the `partialize` selection so it persists across app restarts.

### Supported locales

| Tag  | Language                       |
| ---- | ------------------------------ |
| `en` | English (default and fallback) |
| `zh` | Chinese Simplified             |
| `ko` | Korean                         |
| `ja` | Japanese                       |

### Translation resource shape

A single `translation` namespace is used. The English resource (`src/i18n/locales/en.json`) defines the authoritative key set. All other locale files must provide the same keys with no additions or omissions. The top-level sections are:

```
common, home, search, weather, profile, chip, settings, auth, about, location, errorBoundary
```

Full key inventory (English values shown):

```json
{
  "common": {
    "tryAgain": "Try Again",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "clear": "Clear",
    "ok": "OK"
  },
  "home": {
    "recentSearches": "Recent Searches",
    "offlineBanner": "No internet connection.",
    "offlineBannerSub": "Showing the last saved weather update.",
    "locationAccessNeeded": "Location access needed",
    "couldNotGetLocation": "Couldn't get your location",
    "locationPermissionMsg": "Weather App uses your location to show local weather. Enable it in Settings to continue.",
    "locationErrorMsg": "Something went wrong while fetching your location. Check your connection and try again.",
    "openSettings": "Open Settings",
    "searchManually": "Search manually instead →",
    "currentLocation": "Current location"
  },
  "search": {
    "placeholder": "Search city...",
    "noResults": "No results found"
  },
  "weather": {
    "feelsLike": "Feels like {{temp}}",
    "hourlyForecast": "Hourly Forecast",
    "dailyForecast": "8-Day Forecast",
    "noForecastAvailable": "No forecast available",
    "today": "Today",
    "humidity": "Humidity",
    "wind": "Wind",
    "precip": "Precip.",
    "uvIndex": "UV Index",
    "sunrise": "Sunrise",
    "sunset": "Sunset"
  },
  "profile": {
    "openMenu": "Open profile menu",
    "browsingAsGuest": "Browsing as guest",
    "userFallback": "User",
    "logIn": "Log in",
    "signIn": "Sign in",
    "signOut": "Sign out",
    "signOutConfirmTitle": "Are you sure to sign out?",
    "removeFromFavorites": "Remove from favorites",
    "addToFavorites": "Add to favorites"
  },
  "chip": {
    "remove": "Remove"
  },
  "settings": {
    "title": "Settings",
    "preferences": "Preferences",
    "temperatureUnit": "Temperature unit",
    "temperatureUnitSub": "Choose how temperature is displayed",
    "haptics": "Haptics",
    "hapticsSub": "Enable vibration and touch feedback",
    "data": "Data",
    "clearFavorites": "Clear favorites",
    "clearFavoritesSub": "Remove all saved favorite cities",
    "clearFavoritesTitle": "Clear favorites?",
    "clearFavoritesMsg": "This will remove all saved favorite cities.",
    "clearRecentSearches": "Clear recent searches",
    "clearRecentSearchesSub": "Remove saved city search history",
    "clearRecentSearchesTitle": "Clear recent searches?",
    "clearRecentSearchesMsg": "This will remove your saved city search history.",
    "clearWeatherCache": "Clear weather cache",
    "clearWeatherCacheSub": "Reset stored forecast and weather data",
    "clearWeatherCacheTitle": "Clear weather cache?",
    "clearWeatherCacheMsg": "This will reset stored forecast and weather data.",
    "notifications": "Notifications",
    "dailySummary": "Daily weather summary",
    "comingSoon": "Coming soon...",
    "expoPushToken": "EXPO PUSH TOKEN",
    "expoPushTokenDesc": "Use this token at expo.dev/notifications to send a test push notification.",
    "shareToken": "Share token",
    "registeringPush": "Registering for push notifications...",
    "language": "Language",
    "languageSub": "Choose your preferred display language",
    "languageAuto": "Auto (device language)"
  },
  "auth": {
    "appName": "Weather App",
    "emailPlaceholder": "Email address",
    "passwordPlaceholder": "Password",
    "confirmPasswordPlaceholder": "Confirm password",
    "forgotPassword": "Forgot password?",
    "sendResetLink": "Send reset link",
    "createAccount": "Create account",
    "signIn": "Sign in",
    "signUp": "Sign up",
    "or": "or",
    "continueWithGoogle": "Continue with Google",
    "continueAsGuest": "Continue as guest",
    "backToSignIn": "Back to sign in",
    "resetPassword": "Reset password",
    "resetPasswordSub": "Use your account email to reset your password.",
    "setNewPassword": "Set new password",
    "setNewPasswordSub": "Choose a strong password for your account.",
    "newPassword": "New password",
    "confirmNewPassword": "Confirm new password",
    "updatePassword": "Update password",
    "passwordUpdated": "Password updated!",
    "takingYouBack": "Taking you back to the app…",
    "errors": {
      "emailRequired": "Please enter your email.",
      "passwordRequired": "Please enter your password.",
      "passwordsDoNotMatch": "Passwords do not match.",
      "newPasswordRequired": "Please enter a new password."
    },
    "success": {
      "resetLinkSent": "Reset link sent — check your inbox.",
      "accountCreated": "Account created! Check your email to confirm before signing in."
    }
  },
  "about": {
    "title": "About",
    "version": "Version {{version}}",
    "copyright": "Copyright © {{year}} Jonathan Concepcion.\nAll rights reserved.",
    "termsOfService": "Terms of Service",
    "privacyPolicy": "Privacy Policy",
    "ossNotice": "Open Source Software Notice"
  },
  "location": {
    "title": "Location",
    "notFound": "Location not found"
  },
  "errorBoundary": {
    "title": "Something went wrong",
    "tryAgain": "Try again"
  }
}
```

### TypeScript resource typing

`src/i18n/index.ts` augments the `i18next` module so `t()` calls are type-checked against `en.json`:

```typescript
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof import('./locales/en.json') };
  }
}
```

## Interfaces / API

### `src/i18n/index.ts` — initialization module

Exported surface:

| Export                                       | Type                | Description                                                                      |
| -------------------------------------------- | ------------------- | -------------------------------------------------------------------------------- |
| `default`                                    | `i18next.i18n`      | The configured i18next instance.                                                 |
| `SUPPORTED_LOCALES`                          | `readonly string[]` | `['en', 'zh', 'ko', 'ja']`                                                       |
| `resolveLocale(tag: string \| null): string` | function            | Maps a raw BCP 47 tag (or `null`) to a supported locale, falling back to `'en'`. |

`resolveLocale` logic:

1. If `tag` is `null`, read `Localization.getLocales()[0]?.languageCode` from `expo-localization`.
2. Strip any region subtag (e.g., `'zh-Hans'` → `'zh'`).
3. Return the result if it is in `SUPPORTED_LOCALES`; otherwise return `'en'`.

`i18next.init()` is called synchronously (bundled JSON resources; no async loading). The initial language is the resolved device locale. The stored user preference is applied later in `_layout.tsx` once the Zustand store has hydrated.

`interpolation.escapeValue` is set to `false` (React Native renders no HTML).

### `useTranslation` hook (react-i18next, re-exported)

Components call `const { t } = useTranslation()` to access typed translation keys. No namespace argument is needed because a single `translation` namespace is used globally.

### Language change flow

```
User selects language in Settings
  → useAppStore.setLanguage(tag)         // persisted to AsyncStorage
  → useEffect in _layout.tsx watches language
  → i18next.changeLanguage(resolvedTag)  // triggers re-render of all useTranslation() consumers
```

### `showConfirmAlert` — updated signature

The two optional parameters gain explicit documentation that callers must now pass translated strings. The hard-coded defaults are replaced by calling `i18next.t()` directly (i18next is a singleton accessible outside React):

```typescript
confirmText?: string  // default: i18next.t('common.confirm')
cancelText?: string   // default: i18next.t('common.cancel')
```

All three call sites in `src/app/settings.tsx` already supply `title` and `message` as arguments and will be updated to pass translated strings produced by `t()`.

### Locale-aware date/time formatting in forecast components

**`DailyForecast`**: The module-level `DAY_NAMES` constant is removed. Day-name rendering uses `Intl.DateTimeFormat` with the i18next resolved language:

```typescript
const { i18n, t } = useTranslation();
const dayLabel =
  i === 0
    ? t('weather.today')
    : new Intl.DateTimeFormat(i18n.language, { weekday: 'short' }).format(date);
```

**`HourlyForecast`**: The custom `formatHour` function is replaced with `Intl.DateTimeFormat`:

```typescript
new Intl.DateTimeFormat(i18n.language, { hour: 'numeric', hour12: true }).format(dateObj);
```

Both rely on Hermes's built-in `Intl` support, which is available in Expo SDK 54 with New Architecture enabled. Verify correct output on a physical device during implementation; if Hermes Intl proves insufficient for any supported locale, add `@formatjs/intl-datetimeformat` polyfill as a fallback.

### Settings screen — Language picker

A new `SettingsRow` is added inside the existing "Preferences" `SettingsCard`, below the Haptics row. It uses a separate `LanguagePicker` sub-component (internal to `settings.tsx`) that renders an inline list of language options:

| Display name           | Value stored in `language` |
| ---------------------- | -------------------------- |
| Auto (device language) | `null`                     |
| English                | `'en'`                     |
| 中文（简体）           | `'zh'`                     |
| 한국어                 | `'ko'`                     |
| 日本語                 | `'ja'`                     |

Tapping a row sets `useAppStore.setLanguage(value)`. The selected row shows a checkmark using `MaterialCommunityIcons name="check"`.

## Files Created

| File                       | Purpose                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `src/i18n/index.ts`        | i18next instance initialization, `resolveLocale` helper, TypeScript type augmentation. |
| `src/i18n/locales/en.json` | English translations — the authoritative key inventory.                                |
| `src/i18n/locales/zh.json` | Chinese Simplified translations, keyed identically to `en.json`.                       |
| `src/i18n/locales/ko.json` | Korean translations, keyed identically to `en.json`.                                   |
| `src/i18n/locales/ja.json` | Japanese translations, keyed identically to `en.json`.                                 |
| `docs/specs/i18n/SPEC.md`  | This specification.                                                                    |

## Files Modified

| File                                   | Change                                                                                                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                         | Add `i18next`, `react-i18next`, and `expo-localization` to `dependencies`.                                                                                                    |
| `src/store/useAppStore.ts`             | Add `language: string \| null` field, `setLanguage` action, and include `language` in `partialize`.                                                                           |
| `src/app/_layout.tsx`                  | Import `src/i18n/index.ts` to trigger initialization; add `useEffect` that calls `i18next.changeLanguage(resolveLocale(language))` when the store's `language` field changes. |
| `src/app/index.tsx`                    | Replace all hardcoded strings with `t()` calls.                                                                                                                               |
| `src/app/settings.tsx`                 | Replace all hardcoded strings; add Language picker row; pass translated strings to all three `showConfirmAlert` calls.                                                        |
| `src/app/about.tsx`                    | Replace all hardcoded strings with `t()` calls.                                                                                                                               |
| `src/app/login.tsx`                    | Replace all hardcoded strings (placeholder props, link text) with `t()` values.                                                                                               |
| `src/app/reset-password.tsx`           | Replace all hardcoded strings with `t()` calls.                                                                                                                               |
| `src/app/location/[id].tsx`            | Replace all hardcoded strings and accessibility labels with `t()` calls.                                                                                                      |
| `src/hooks/useLoginForm.ts`            | Add `useTranslation()` call; replace all inline error and success string literals with `t()` calls.                                                                           |
| `src/components/SearchBar.tsx`         | Replace placeholder and empty-state string with `t()`.                                                                                                                        |
| `src/components/CurrentWeather.tsx`    | Replace `"Feels like {temp}"` with `t('weather.feelsLike', { temp: feesLikeDisplay })`.                                                                                       |
| `src/components/WeatherStats.tsx`      | Move `STATS` definition inside the component body (or convert to a factory function) so labels are produced by `t()` at render time instead of at module initialization.      |
| `src/components/HourlyForecast.tsx`    | Add `useTranslation()`; replace section title and empty-state string; replace `formatHour` with `Intl.DateTimeFormat`.                                                        |
| `src/components/DailyForecast.tsx`     | Add `useTranslation()`; remove `DAY_NAMES` constant; replace section title, empty-state string, and day-name rendering with `t()` and `Intl.DateTimeFormat`.                  |
| `src/components/ProfileMenuButton.tsx` | Add `useTranslation()`; replace all hardcoded label strings and accessibility labels.                                                                                         |
| `src/components/Chip.tsx`              | Add `useTranslation()`; replace the `'Remove'` prop default with `t('chip.remove')`.                                                                                          |
| `src/components/AuthModeTabs.tsx`      | Replace `'Sign in'` / `'Sign up'` tab labels with `t()`.                                                                                                                      |
| `src/components/SocialSignIn.tsx`      | Replace divider text and button labels with `t()`.                                                                                                                            |
| `src/components/ForgotHeader.tsx`      | Replace all text strings with `t()`.                                                                                                                                          |
| `src/utils/alets.ts`                   | Replace English string defaults for `confirmText` and `cancelText` with `i18next.t('common.confirm')` and `i18next.t('common.cancel')`, accessed via the i18next singleton.   |

## Implementation Steps

1. Install dependencies. Run `npm install i18next react-i18next expo-localization`. Verify the three packages appear in `package.json` dependencies.

2. Create `src/i18n/locales/en.json` with the full key inventory defined in the Data Model section. Every key that appears in any screen or component must be present.

3. Create `src/i18n/locales/zh.json`, `ko.json`, and `ja.json` with Chinese Simplified, Korean, and Japanese translations for every key in `en.json`. The key structure must be identical; no keys may be added or omitted relative to `en.json`.

4. Create `src/i18n/index.ts`. Initialize i18next synchronously using `initReactI18next`, bundling all four locale JSON files as resources. Add the `CustomTypeOptions` type augmentation so `t()` is type-safe. Export `SUPPORTED_LOCALES`, `resolveLocale`, and the i18next default instance.

5. Modify `src/store/useAppStore.ts`: add the `language` field (default `null`) and `setLanguage` action to the store definition and the `AppStore` interface; add `language` to the `partialize` selector.

6. Modify `src/app/_layout.tsx`: add `import '../i18n'` at the top (triggers initialization); subscribe to `language` from `useAppStore` and call `i18next.changeLanguage(resolveLocale(language))` inside a `useEffect` that runs whenever `language` changes. The effect should run once on mount to apply any stored preference after hydration.

7. Update `src/utils/alets.ts`: replace the `'Confirm'` and `'Cancel'` string defaults with `i18next.t('common.confirm')` and `i18next.t('common.cancel')`.

8. Update `src/hooks/useLoginForm.ts`: call `useTranslation()` at the top of the hook; replace every inline error and success string with the corresponding `t()` key from the `auth.errors` and `auth.success` sections.

9. Update `src/components/WeatherStats.tsx`: move the `STATS` constant declaration inside the `WeatherStats` component function body (after the `useTranslation()` call) and replace each `label` string literal with the corresponding `t()` key. The `sunrise` and `sunset` labels in the JSX below the stats row also become `t()` calls.

10. Update `src/components/HourlyForecast.tsx`: add `useTranslation()`; replace the section title and empty-state strings; remove `formatHour` and replace its call sites with inline `Intl.DateTimeFormat` using `i18n.language`.

11. Update `src/components/DailyForecast.tsx`: add `useTranslation()`; remove the `DAY_NAMES` constant; replace section title and empty-state strings; replace the `dayName` computation with `t('weather.today')` for `i === 0` and `Intl.DateTimeFormat(i18n.language, { weekday: 'short' }).format(date)` for other days.

12. Update all remaining components (`SearchBar`, `CurrentWeather`, `ProfileMenuButton`, `Chip`, `AuthModeTabs`, `SocialSignIn`, `ForgotHeader`) to call `useTranslation()` and replace hardcoded strings with `t()` calls.

13. Update all screens (`index.tsx`, `login.tsx`, `reset-password.tsx`, `settings.tsx`, `about.tsx`, `location/[id].tsx`, `_layout.tsx` ErrorBoundary) to call `useTranslation()` and replace hardcoded strings. For `_layout.tsx`, note that `ErrorBoundary` is a class-style component exported as a named export; use `i18next.t()` directly (singleton access, no hook) rather than `useTranslation()`.

14. Add the Language picker to `src/app/settings.tsx`: add a `LanguagePicker` sub-component (file-local, not exported) that renders each supported locale as a pressable row with a checkmark for the active selection; wire it to `useAppStore.setLanguage`.

15. Write a Jest unit test for `resolveLocale` in `src/i18n/__tests__/resolveLocale.test.ts` covering: device locale matching a supported language, device locale with region subtag (e.g., `'zh-Hans'`), unsupported device locale falling back to `'en'`, explicit `tag` argument for each supported locale, and `null` input using a mocked `expo-localization` result.

16. Write a Jest unit test for the updated `useLoginForm` in `src/hooks/__tests__/useLoginForm.test.ts` verifying that the error and success strings returned match the English translations from `en.json` (mock `i18next` to return the key as its value to keep tests locale-independent, or assert on the key via a spy).

17. Verify locally: `expo lint` exits 0, `npx tsc --noEmit` exits 0, `npm test` passes all existing tests plus the new i18n tests. Manually switch language in Settings and confirm each language renders correctly on-screen.

## Style & Conventions

- All `t()` calls use the single `translation` namespace (no prefix argument). This aligns with the project's preference for minimal boilerplate (analogous to the single Supabase client rule in CLAUDE.md).
- `async`/`await` is used everywhere per CLAUDE.md. The i18next `init()` call is made synchronously (resource bundling, no HTTP loading) to avoid a flash of untranslated content before the React tree mounts.
- The `STATS` constant in `WeatherStats.tsx` is moved inside the component body. This is a deliberate deviation from the current pattern (module-level constant) justified by the fact that label strings must be evaluated at render time for translation to work. If performance becomes a concern, `useMemo` can wrap the array.
- No `any` types are introduced. The `CustomTypeOptions` augmentation ensures `t()` keys are typed against `en.json`.
- New locale files (`en.json`, `zh.json`, `ko.json`, `ja.json`) are committed as plain JSON; `prettier --write` will format them on pre-commit via the existing lint-staged rule for `**/*.{json,css,md}`.
- The `LanguagePicker` component in `settings.tsx` is file-local (not exported) to respect the existing pattern of settings-specific sub-components living in `src/components/settings/`. If the picker grows in complexity, it should be extracted to `src/components/settings/LanguagePicker.tsx` at that time.
- `Intl.DateTimeFormat` is used for day names and hour formatting instead of translation keys. This avoids maintaining a parallel set of localized abbreviations and leverages the runtime's locale data. The trade-off is runtime `Intl` API dependency; this is confirmed present in Hermes under Expo SDK 54 New Architecture, but must be verified on device during step 17.

## Acceptance Criteria

- [ ] `npm test` passes with all pre-existing tests (10 auth store + 19 app store + 11 route guard) plus new tests for `resolveLocale` and the updated `useLoginForm`.
- [ ] `npx tsc --noEmit` exits 0 with no new type errors. All `t()` call sites use keys that exist in `en.json`; typos are caught at compile time via the `CustomTypeOptions` augmentation.
- [ ] `expo lint` exits 0. No ESLint violations introduced.
- [ ] Setting the device locale to Chinese Simplified (`zh`) and launching the app (with `language: null` in the store) shows all UI strings in Chinese Simplified.
- [ ] Switching the app language to Korean in Settings immediately re-renders all visible strings in Korean without requiring an app restart.
- [ ] Switching back to "Auto (device language)" (`null`) reverts to the device locale.
- [ ] After closing and reopening the app, the previously selected language preference is restored (persisted via AsyncStorage).
- [ ] The `DailyForecast` component displays locale-appropriate day-name abbreviations for each supported language.
- [ ] The `HourlyForecast` component displays locale-appropriate hour labels for each supported language.
- [ ] Confirm dialogs triggered from Settings (clear favorites, clear recent searches, clear weather cache) show translated button text ("Confirm" / "Cancel") in the active language.
- [ ] The `ErrorBoundary` in `_layout.tsx` shows translated text when triggered in the active language.
- [ ] `en.json`, `zh.json`, `ko.json`, and `ja.json` have identical key structures. No key present in one file is absent from another.

## Constraints

- **Scope boundary:** Translation of content served by external APIs (weather condition labels from `wmo.ts`, geocoding city names from `services/geocoding.ts`, error messages returned by Supabase auth) is explicitly out of scope. WMO labels (`wmo.label`) and city names are proper nouns or standardized codes; localizing them requires separate data sources not covered here.
- **Right-to-left (RTL) layout** is out of scope. The four target languages (en, zh, ko, ja) are all left-to-right.
- **Plural forms:** i18next plural handling is not used in this initial implementation. The target languages do not require grammatical pluralization in any of the key strings identified above.
- **Dynamic error messages from Supabase and Open-Meteo:** Error strings passed through from API responses (e.g., `weather.error` rendered in `index.tsx` and `location/[id].tsx`) are not translated. They are displayed as-is from the API. Localizing these would require API-level error code mapping, which is a separate feature.
- **`src/app/about/licenses.tsx`, `src/app/about/privacy.tsx`, `src/app/about/terms.tsx`:** These static sub-pages likely contain long-form legal text. They are out of scope for this feature. If these pages have hardcoded English text, they remain in English post-ship.
- **`expo-localization` version:** The version installed by `npm install expo-localization` must be compatible with Expo SDK 54. Verify with `npx expo install expo-localization` instead of bare `npm install` to get the SDK-pinned version.
- **Hermes `Intl` support:** `Intl.DateTimeFormat` with `weekday: 'short'` and locale-specific tags (`'zh'`, `'ko'`, `'ja'`) is expected to work under Hermes in Expo SDK 54 New Architecture. If testing on a physical device reveals incorrect or missing output for any locale, add `@formatjs/intl-datetimeformat` as a polyfill and configure it in `_layout.tsx`. This decision is deferred to implementation step 17.
- **Splash-screen language flash:** On first launch after install, i18next initializes with the device locale before the Zustand store has hydrated from AsyncStorage. If a stored language preference differs from the device locale, the language will switch after hydration, potentially after the splash screen hides. This is acceptable for the initial implementation. Mitigating it (e.g., by reading AsyncStorage before i18next init) is a future optimization.
- **No server-side or EAS Build changes** are required. This is a pure client-side feature implemented in the Metro bundle.
