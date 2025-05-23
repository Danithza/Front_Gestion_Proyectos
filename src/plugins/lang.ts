// src/plugins/lang.ts
import { createI18n } from 'vue-i18n'

const messages = {
  es: {
    settings: 'Configuración',
    darkMode: 'Modo oscuro',
    language: 'Idioma',
  },
  en: {
    settings: 'Settings',
    darkMode: 'Dark mode',
    language: 'Language',
  },
  fr: {
    settings: 'Paramètres',
    darkMode: 'Mode sombre',
    language: 'Langue',
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages,
})
