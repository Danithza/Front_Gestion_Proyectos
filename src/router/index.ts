import { createRouter, createWebHistory } from 'vue-router'

//layoute
import authLayout from '@/layouts/authLayout.vue'
import mainLayout from '@/layouts/mainLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
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
    path: '/auth',
    component: authLayout,
    children: [
      {
        path: 'login',
        name: 'auth.login',
        component: Login,
      },
      {
        path: 'register',
        name: 'auth.register',
        component: Registro
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
        path: 'projects',
        name: 'main.project',
        component: Proyectos
      },
      {
        path: 'tasks',
        name: 'main.tasks',
        component: Tareas
      }
    ],
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
