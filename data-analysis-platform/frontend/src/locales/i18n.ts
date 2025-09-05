import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/common.json';
import zh from './zh/common.json';
i18n
  .use(initReactI18next)
  .init({
    lng: 'en', // 默认语言
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React已经处理了XSS
    },

    // 资源配置
    resources: {
      en: {
        common: en,
      },
      zh: {
        common: zh,
      },
    },

    // 默认命名空间
    defaultNS: 'common',
    ns: ['common'],

    // 语言检测
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
