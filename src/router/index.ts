import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Tareas from '@/views/Tarea.vue'
import Inicio from '@/views/Inicio.vue'
import Login from '@/views/Login.vue'
import Registro from '@/views/Registro.vue'
import RecuperarClave from '@/views/RecuperarClave.vue'
import Proyectos from '@/views/Proyectos.vue'
import Reportes from '@/views/Reportes.vue'
import Calendario from '@/views/Calendario.vue'
import Equipos from '@/views/Equipos.vue'
import Roles from '@/views/Roles.vue'
import Usuarios from '@/views/Usuarios.vue'
const routes = [
  {
    path: '/reportes',
    name: 'Reportes',
    component: Reportes,
  },
  {
    path: '/calendario',
    name: 'Calendario',
    component: Calendario,
  },
  {
    path: '/equipos',
    name: 'Equipos',
    component: Equipos,
  },
  {
    path: '/roles',
    name: 'Roles',
    component: Roles,
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: Usuarios,
  },
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
    name: 'RecuperarClave',
    component: RecuperarClave,
  },
  {
    path: '/proyectos',
    name: 'Proyectos',
    component: Proyectos,
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
      }, 
      {
        path: '',
        name: 'Tareas',
        component: Tareas,
      }, 
    ],
  },
  {
    path: '/tareas',
    name: 'Tareas',
    component: Tareas
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
