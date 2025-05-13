import { createRouter, createWebHistory } from 'vue-router'

// Importa tus vistas
import Inicio from '@/views/Inicio.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Inicio,
    },
  ],
})

export default router
