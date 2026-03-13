import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './i18n/locales/en.json'
import ptPT from './i18n/locales/pt-PT.json'
import es from './i18n/locales/es.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, 'pt-PT': ptPT, es },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
