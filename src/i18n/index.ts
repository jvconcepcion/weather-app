import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import zh from './locales/zh.json';

export const SUPPORTED_LOCALES = ['en', 'zh', 'ko', 'ja'] as const;

export function resolveLocale(tag: string | null): string {
  const raw = tag ?? Localization.getLocales()[0]?.languageCode ?? 'en';
  const base = (raw ?? 'en').split('-')[0].split('_')[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(base) ? base : 'en';
}

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    ko: { translation: ko },
    ja: { translation: ja },
  },
  lng: resolveLocale(null),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof en };
  }
}

export default i18next;
