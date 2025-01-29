import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


import enTranslations from '../locals/en.json';
import esTranslations from '../locals/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      es: {
        translation: esTranslations,
      },
    },
    lng: 'es',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;