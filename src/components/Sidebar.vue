<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    color="blue-darken-3"
    dark
  >
    <v-list nav dense>
      <!-- menu group -->
      <template
        v-for="group in menuGroups"
        :key="group.title"
      >
        <v-subheader>{{ group.title }}</v-subheader>
        <template
          v-for="item in group.items"
          :key="item.title"
        >
          <v-list-item
            :to="item.to"
            link
            active-class="bg-blue-darken-1"
          >
            <template v-slot:prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

const drawer = inject('drawer') as any

const mainItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
  { title: 'Proyectos', icon: 'mdi-folder-outline', to: '/proyectos' },
]

const gestionItems = [
  { title: 'Tareas', icon: 'mdi-format-list-checkbox', to: '/tareas' },
  { title: 'Calendario', icon: 'mdi-calendar-month', to: '/calendario' },
  { title: 'Reportes', icon: 'mdi-chart-box-outline', to: '/reportes' },
  { title: 'Equipos', icon: 'mdi-account-group-outline', to: '/equipos' },
]

const configItems = [
  { title: 'Roles', icon: 'mdi-account-cog-outline', to: '/roles' },
  { title: 'Usuarios', icon: 'mdi-account', to: '/usuarios' },
]

const menuGroups = [
  { title: 'Principal', items: mainItems },
  { title: 'Gestion', items: gestionItems },
  { title: 'Configuración', items: configItems },
]
</script>
