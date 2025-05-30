import { createRouter, createWebHistory } from 'vue-router'

//layoute
import authLayout from '@/layouts/authLayout.vue'
import mainLayout from '@/layouts/mainLayout.vue'

//views
import Dashboard from '@/views/Dashboard.vue'
import Tareas from '@/views/Tarea.vue'
import Inicio from '@/views/Inicio.vue'
import Login from '@/views/Login.vue'
import Registro from '@/views/Registro.vue'
import RecuperarClave from '@/views/RecuperarClave.vue'
import Proyectos from '@/views/Proyectos.vue'
import Reportes from '@/views/Reportes.vue'
import Calendario from '@/views/Calendario.vue'
import Roles from '@/views/Roles.vue'
import Usuarios from '@/views/Usuarios.vue'
import Equipos from '@/views/Equipos.vue'
import Cities from '@/views/Cities.vue'
import DocumentTypes from '@/views/DocumentTypes.vue'
import Statuses from '@/views/Statuses.vue'
import Priorities from '@/views/Priorities.vue'
import perfil from '@/views/Perfil.vue'
import Perfil from '@/views/Perfil.vue'
const routes = [
  {
    path: '/auth',
    component: authLayout,
    children: [
      {
        path: '/',
        name: 'auth.inicio',
        component: Inicio,
      },
      {
        path: '/login',
        name: 'auth.login',
        component: Login,
      },
      {
        path: '/registro',
        name: 'auth.register',
        component: Registro
      },
      {
        path: '/recuperarclave',
        name: 'auth.recuperarclave',
        component: RecuperarClave
      }
    ],
  },
  {
    path: '/',
    component: mainLayout,
    children: [
      {
        path: '/roles',
        name: 'main.roles',
        component: Roles
      },
      {
        path: '/usuarios',
        name: 'main.usuarios',
        component: Usuarios
      },
      {
        path: '/cities',
        name: 'main.cities',
        component: Cities
      },
      {
        path: '/document-types',
        name: 'main.documentTypes',
        component: DocumentTypes
      },
      {
        path: '/statuses',
        name: 'main.statuses',
        component: Statuses
      },
      {
        path: '/priorities',
        name: 'main.priorities',
        component: Priorities
      },
      {
        path: 'dashboard',
        name: 'main.dashboard',
        component: Dashboard,
      },
      {
        path: '/proyectos',
        name: 'main.project',
        component: Proyectos
      },
      {
        path: '/tareas',
        name: 'main.tasks',
        component: Tareas
      },
      {
        path: '/calendario',
        name: 'main.calendario',
        component: Calendario
      },
      {
        path: '/reportes',
        name: 'main.reportes',
        component: Reportes
      },
      {
        path: '/equipos',
        name: 'main.equipos',
        component: Equipos
      },
      {
        path: '/perfil',
        name: 'main.perfil',
        component: Perfil
      },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
