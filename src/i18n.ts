import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './resources/translations/en.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'en',
    fallbackLng: 'en',

    resources: {
      en: {
        translation: enTranslations,
      },
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
