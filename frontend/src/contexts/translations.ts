import enJSON from '../i18n/en.json';
import nlJSON from '../i18n/nl.json';

export const translations = {
  en: enJSON,
  nl: nlJSON,
} as const;

export type TranslationsType = typeof enJSON;
