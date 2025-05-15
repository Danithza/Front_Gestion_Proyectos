<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    color="blue-darken-3"
    dark
  >
    <v-list nav dense>
      <!-- Sección Principal -->
      <v-subheader>Principal</v-subheader>
      <v-list-item
        v-for="item in mainItems"
        :key="item.title"
        :to="item.to"
        link
        active-class="bg-blue-darken-1"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <!-- Sección Gestión -->
      <v-subheader>Gestión</v-subheader>
      <v-list-item
        v-for="item in gestionItems"
        :key="item.title"
        :to="item.to"
        link
        active-class="bg-blue-darken-1"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <!-- Sección Configuración -->
      <v-subheader>Configuración</v-subheader>
      <v-list-item
        v-for="item in configItems"
        :key="item.title"
        :to="item.to"
        link
        active-class="bg-blue-darken-1"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
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
  { title: 'Equipos', icon: 'mdi-account-group-outline', to: '/equipos' },
  { title: 'Calendario', icon: 'mdi-calendar-month', to: '/calendario' },
  { title: 'Reportes', icon: 'mdi-chart-box-outline', to: '/reportes' },
]

const configItems = [
  { title: 'Configuración', icon: 'mdi-cog-outline', to: '/configuracion' },
  { title: 'Roles', icon: 'mdi-account-cog-outline', to: '/roles' },
  { title: 'Usuarios', icon: 'mdi-account', to: '/usuarios' },
]
</script>
