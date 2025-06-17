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
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

interface NavItem {
  title: string
  icon: string
  to: string
  permission?: string
}

const allItems: NavItem[] = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
  { title: 'Proyectos', icon: 'mdi-folder-outline', to: '/proyectos', permission: 'project:read' },
  { title: 'Tareas', icon: 'mdi-format-list-checkbox', to: '/tareas', permission: 'task:read' },
  { title: 'Reportes', icon: 'mdi-chart-box-outline', to: '/reportes' },
  { title: 'Usuarios', icon: 'mdi-account', to: '/usuarios', permission: 'user:read' },
  { title: 'Roles', icon: 'mdi-account-cog-outline', to: '/roles', permission: 'role:read' },
  { title: 'Cities', icon: 'mdi-home-city', to: '/cities', permission: 'city:read' },
  { title: 'Document Types', icon: 'mdi-badge-account', to: '/document-types', permission: 'typeDocument:read' },
  { title: 'Statuses', icon: 'mdi-list-status', to: '/statuses',permission: 'status:read' },
  { title: 'Priorities', icon: 'mdi-flag-variant', to: '/priorities', permission: 'priority:read' },
].filter((item: NavItem) => {
  if (!item.permission) return true
  return authStore.hasPermission(item.permission)
})
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
