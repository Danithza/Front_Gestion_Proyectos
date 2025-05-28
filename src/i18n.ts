import { createI18n } from 'vue-i18n'

const messages = {
  es: {
    settings: 'Configuración',
    darkMode: 'Modo oscuro',
    language: 'Idioma',
    welcomeMessage: 'Bienvenido a nuestra aplicación',
  },
  en: {
    settings: 'Settings',
    darkMode: 'Dark Mode',
    language: 'Language',
    welcomeMessage: 'Welcome to our app',
  },
  fr: {
    settings: 'Paramètres',
    darkMode: 'Mode sombre',
    language: 'Langue',
    welcomeMessage: 'Bienvenue dans notre application',
  },
}

const userLocale = localStorage.getItem('lang') || 'es'

const i18n = createI18n({
  legacy: false,
  locale: userLocale,
  fallbackLocale: 'en',
  messages
})

export default i18n
