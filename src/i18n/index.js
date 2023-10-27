import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import cn from './locales/zh-cn.json'
import en from './locales/en-us.json'
import de from './locales/de-DE.json'
import fr from './locales/fr-FR.json'
// not like to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

// 中文（简体）：zh-CN
// 英语（美国）：en-US
// 德语（德国）：de-DE
// 法语（法国）：fr-FR
const resources = {
  'zh_CN': {
    translation: cn
  },
  "en_US": {
    translation: en
  },
  // "de-DE": {
  //   translation: de
  // },
  // "fr-FR": {
  //   translation: fr
  // },
}
i18n.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh_CN',
    debug: false,
    resources,
    detection: {
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;

export const languages = ['zh_CN', 'en_US']
