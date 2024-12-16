import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import ru_main from './locales/ru/main.json';
import ru_notifications from './locales/ru/notifications.json';
import ru_menu from './locales/ru/menu.json';
import ru_layout from './locales/ru/layout.json';
import en_main from './locales/en/main.json';
import en_notifications from './locales/en/notifications.json';
import en_menu from './locales/en/menu.json';
import en_layout from './locales/en/layout.json';

const ru = {
  translation: {
    main: { ...ru_main },
    notifications: { ...ru_notifications },
    menu: { ...ru_menu },
    layout: { ...ru_layout }
  }
};

const en = {
  translation: {
    main: { ...en_main },
    notifications: { ...en_notifications },
    menu: { ...en_menu },
    layout: { ...en_layout }
  }
};

void i18n
  // Автоматическое определение языка
  .use(LanguageDetector)
  // модуль инициализации
  .use(initReactI18next)
  .init({
    resources: {
      ru, en
    },
    fallbackLng: 'ru',
    debug: false,
    // Распознавание и кэширование языковых кук
    detection: {
      order: ['queryString', 'cookie'],
      cache: ['cookie']
    },
    interpolation: {
      escapeValue: false
    },
  });

export default i18n;