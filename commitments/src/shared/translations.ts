import { getTranslationsFromLocale } from '@procore/globalization-toolkit';
import { useI18nContext } from '@procore/core-react';
import type { TypedI18n } from '@procore/json-toolinator';
import type { Translations } from './translations.types';

export async function getTranslations(envLocale?: string) {
  return getTranslationsFromLocale(
    envLocale,
    (lang: string) => import(`../locales/${lang}.json`)
  );
}

export function getTranslationsPath(lang: string): string {
  return `blueprint-simulator/src/locales/${lang}.json`;
}

export function useTranslations(): TypedI18n<Translations> {
  return useI18nContext<Translations>();
}
