import * as Localization from 'expo-localization';
import { resolveLocale } from '../index';

jest.mock('expo-localization', () => ({
  getLocales: jest.fn().mockReturnValue([{ languageCode: 'en' }]),
}));

const mockGetLocales = Localization.getLocales as jest.Mock;

beforeEach(() => {
  mockGetLocales.mockReturnValue([{ languageCode: 'en' }]);
});

describe('resolveLocale — explicit tag', () => {
  it.each(['en', 'zh', 'ko', 'ja'])('returns supported locale %s as-is', (locale) => {
    expect(resolveLocale(locale)).toBe(locale);
  });

  it('strips BCP 47 region subtag (en-US → en)', () => {
    expect(resolveLocale('en-US')).toBe('en');
  });

  it('strips BCP 47 region subtag (zh-CN → zh)', () => {
    expect(resolveLocale('zh-CN')).toBe('zh');
  });

  it('strips underscore region variant (zh_CN → zh)', () => {
    expect(resolveLocale('zh_CN')).toBe('zh');
  });

  it('falls back to en for unsupported locale (fr)', () => {
    expect(resolveLocale('fr')).toBe('en');
  });

  it('falls back to en for unsupported locale (de)', () => {
    expect(resolveLocale('de')).toBe('en');
  });
});

describe('resolveLocale — null input uses device locale', () => {
  it('returns device locale when supported', () => {
    mockGetLocales.mockReturnValue([{ languageCode: 'ko' }]);
    expect(resolveLocale(null)).toBe('ko');
  });

  it('falls back to en when device locale is unsupported', () => {
    mockGetLocales.mockReturnValue([{ languageCode: 'fr' }]);
    expect(resolveLocale(null)).toBe('en');
  });

  it('falls back to en when getLocales returns empty array', () => {
    mockGetLocales.mockReturnValue([]);
    expect(resolveLocale(null)).toBe('en');
  });

  it('falls back to en when languageCode is null', () => {
    mockGetLocales.mockReturnValue([{ languageCode: null }]);
    expect(resolveLocale(null)).toBe('en');
  });
});
