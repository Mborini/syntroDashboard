// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar',        // اللغة الافتراضية إذا لم يجد ترجمة
    lng: 'ar',                 // ضبط اللغة الافتراضية مباشرة
    supportedLngs: ['ar', 'en'], // اللغات المدعومة
    defaultNS: 'translation',  // اسم الـ namespace الافتراضي
    debug:  false, // تفعيل أو تعطيل وضع التصحيح
    interpolation: {
      escapeValue: false,      // لمنع الـ XSS
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // المسار بالنسبة لمجلد public
    },
  });

export default i18n;
