import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { useAuthStore } from '@/stores/authStore'
import service from '@/services/baseService';

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VCalendar } from 'vuetify/labs/components'

const vuetify = createVuetify({
  components: { ...components, VCalendar },
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#1976D2',
          secondary: '#03A9F4',
          error: '#B00020',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#2196F3',
          secondary: '#03A9F4',
          error: '#CF6679',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(createPinia())

async function bootstrap() {
  const authStore = useAuthStore();
  if (authStore.token) service.setToken(authStore.token);
  await authStore.me();

  app.use(router)
  app.use(vuetify)
  app.mount('#app')
}

bootstrap()
