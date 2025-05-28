<template>
  <v-navigation-drawer permanent color="primary" dark width="72" class="elevation-2 custom-sidebar">
    <v-list dense nav class="pa-0">
      <v-tooltip v-for="item in allItems" :key="item.title" location="right">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            :to="item.to"
            link
            active-class="active-item"
            class="icon-item"
          >
            <v-icon class="icon-style">{{ item.icon }}</v-icon>
          </v-list-item>
        </template>
        <span>{{ item.title }}</span>
      </v-tooltip>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
interface NavItem {
  title: string
  icon: string
  to: string
}

const allItems: NavItem[] = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
  { title: 'Proyectos', icon: 'mdi-folder-outline', to: '/proyectos' },
  { title: 'Tareas', icon: 'mdi-format-list-checkbox', to: '/tareas' },
  { title: 'Calendario', icon: 'mdi-calendar-month', to: '/calendario' },
  { title: 'Reportes', icon: 'mdi-chart-box-outline', to: '/reportes' },
  { title: 'Equipos', icon: 'mdi-account-group-outline', to: '/equipos' },
  { title: 'Usuarios', icon: 'mdi-account', to: '/usuarios' },
  { title: 'Roles', icon: 'mdi-account-cog-outline', to: '/roles' },
  { title: 'Cities', icon: 'mdi-home-city', to: '/cities' },
  { title: 'Document Types', icon: 'mdi-badge-account', to: '/document-types' },
  { title: 'Statuses', icon: 'mdi-list-status', to: '/statuses' },
  { title: 'Priorities', icon: 'mdi-flag-variant', to: '/priorities' }
]
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-sidebar {
  margin-top: 64px;
  height: calc(100vh - 64px); /* Ajusta según la altura de tu navbar */
  position: fixed;
  z-index: 1001;
}

.icon-item {
  min-height: 72px;
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  padding: 0 !important;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%; /* Asegura que ocupe todo el ancho del sidebar */
}

.icon-style {
  font-size: 28px;
  color: white;
  transition: color 0.3s;
}

.icon-item:hover .icon-style {
  color: #bbdefb;
}

.active-item {
  background-color: rgba(187, 222, 251, 0.15) !important;
  border-left: 4px solid #bbdefb !important;
  color: #bbdefb !important;
}
</style>
