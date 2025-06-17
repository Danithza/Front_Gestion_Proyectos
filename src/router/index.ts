import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

//layout
import authLayout from '@/layouts/authLayout.vue'
import mainLayout from '@/layouts/mainLayout.vue'

//views
import Dashboard from '@/views/Dashboard.vue'
import Tareas from '@/views/Tarea.vue'
import Login from '@/views/Login.vue'
import RecuperarClave from '@/views/RecuperarClave.vue'
import Proyectos from '@/views/Proyectos.vue'
import Reportes from '@/views/Reportes.vue'
import Roles from '@/views/Roles.vue'
import Usuarios from '@/views/Usuarios.vue'
import Cities from '@/views/Cities.vue'
import DocumentTypes from '@/views/DocumentTypes.vue'
import Statuses from '@/views/Statuses.vue'
import Priorities from '@/views/Priorities.vue'
import Perfil from '@/views/Perfil.vue'
import Unauthorized from '@/views/Unauthorized.vue'

const routes = [
  {
    path: '/auth',
    component: authLayout,
    children: [
      {
        path: '/',
        name: 'auth.inicio',
        component: Login,
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
        component: Roles,
        meta: {permission: 'role:read'}
      },
      {
        path: '/usuarios',
        name: 'main.usuarios',
        component: Usuarios,
        meta: {permission: 'user:read'}
      },
      {
        path: '/cities',
        name: 'main.cities',
        component: Cities,
        meta: {permission: 'city:read'}
      },
      {
        path: '/document-types',
        name: 'main.documentTypes',
        component: DocumentTypes,
        meta: {permission: 'typeDocument:read'}
      },
      {
        path: '/statuses',
        name: 'main.statuses',
        component: Statuses,
        meta: {permission: 'status:read'}
      },
      {
        path: '/priorities',
        name: 'main.priorities',
        component: Priorities,
        meta: {permission: 'priority:read'}
      },
      {
        path: 'dashboard',
        name: 'main.dashboard',
        component: Dashboard,
      },
      {
        path: '/proyectos',
        name: 'main.project',
        component: Proyectos,
        meta: {permission: 'project:read'}
      },
      {
        path: '/tareas',
        name: 'main.tasks',
        component: Tareas,
        meta: {permission: 'task:read'}
      },
      {
        path: '/reportes',
        name: 'main.reportes',
        component: Reportes
      },
      {
        path: '/perfil',
        name: 'main.perfil',
        component: Perfil
      },
      {
        path: '/unauthorized',
        name: 'main.noAuthorized',
        component: Unauthorized
      }
    ],
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  const requiredPermission = to.meta.permission;
  if (requiredPermission && !auth.hasPermission(requiredPermission)) {
    return next({ name: 'main.noAuthorized' }); // or redirect to login, etc.
  }

  next();
});

export default router
