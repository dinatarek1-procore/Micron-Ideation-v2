import { getTranslations, getTranslationsPath } from './translations';

import enTranslations from '../locales/en.json';

describe('getTranslations', () => {
  describe('given no environment configuration', () => {
    describe('when translations are fetched', () => {
      it('returns English translations by default', async () => {
        const t10s = await getTranslations();
        expect(t10s).toEqual({ en: enTranslations });
      });
    });
  });

  describe('given an English locale', () => {
    describe('when translations are fetched', () => {
      it('returns English translations', async () => {
        const t10s = await getTranslations('en');
        expect(t10s).toEqual({ en: enTranslations });
      });
    });
  });

  describe('given an unsupported locale', () => {
    describe('when translations are fetched', () => {
      it('returns English translations for the unsupported locale', async () => {
        const t10s = await getTranslations('en-owner');
        expect(t10s).toEqual({
          en: enTranslations,
        });
      });
    });
  });
});

describe('getTranslationsPath', () => {
  describe('given a locale', () => {
    it('returns the correct path', () => {
      const path = getTranslationsPath('en');
      expect(path).toEqual('blueprint-simulator/src/locales/en.json');
    });
  });
});
