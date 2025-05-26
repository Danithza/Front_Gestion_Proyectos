// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VCalendar } from 'vuetify/labs/components'

import { createI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import service from '@/services/baseService';

// ✅ Traducciones básicas
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

// ✅ i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages,
})

// ✅ Vuetify con temas personalizados
const vuetify = createVuetify({
  components: {
    ...components,
    VCalendar,
  },
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#1976D2', // Azul
          secondary: '#03A9F4', // Azul claro
          error: '#B00020',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#2196F3', // Azul más claro para modo oscuro
          secondary: '#03A9F4',
          error: '#CF6679',
        },
      },
    },
  },
})


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(vuetify)
app.mount('#app')

// Restore the token in the baseService
const authStore = useAuthStore();
if (authStore.token) {
  service.setToken(authStore.token);
}
