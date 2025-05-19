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
const routes = [
  {
    path: '/',
    name: '/incio',
    component: Inicio,
  },
  {
    path: '/auth',
    component: authLayout,
    children: [
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
        path: '/roles',
        name: 'main.roles',
        component: Roles
      },
      {
        path: '/usuario',
        name: 'main.usuarios',
        component: Usuarios
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
    ],
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
