import { createRouter, createWebHistory } from 'vue-router'

// Importa tus vistas
import Inicio from '@/views/Inicio.vue'
import Login from '@/views/Login.vue'
import Registro from '@/views/Registro.vue'
import RecuperarClave from '@/views/RecuperarClave.vue'
import Dashboard from '@/views/Dashboard.vue'  

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Inicio,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/registro',
      name: 'Registro',
      component: Registro,
    },
    {
      path: '/recuperarclave',
      name: 'RecuperarClave', // Usando PascalCase aquí
      component: RecuperarClave,
    },{
    path: '/dashboard',
    name: 'Dashboard', 
    component: Dashboard,
    }
  ],
})

export default router
