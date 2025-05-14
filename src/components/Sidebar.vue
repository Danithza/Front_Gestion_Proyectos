<template>
  <v-navigation-drawer
    app
    :permanent="true"
    :rail="isCollapsed"
    @mouseenter="isCollapsed = false"
    @mouseleave="isCollapsed = true"
    color="primary"
    dark
  >
    <v-list-item class="d-flex justify-center py-4">
      <v-avatar size="56">
        <v-img :src="inicioImage" alt="Logo" cover />
      </v-avatar>
    </v-list-item>

    <v-list>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title v-if="!isCollapsed">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import inicioImage from '@/assets/Logo.png'

const isCollapsed = ref(true)

const items = [
  { icon: 'mdi-view-dashboard', title: 'Dashboard' },
  { icon: 'mdi-account', title: 'Usuarios' },
  { icon: 'mdi-briefcase', title: 'Proyectos' },
  { icon: 'mdi-clipboard-text', title: 'Tarea' },
  { icon: 'mdi-file-chart', title: 'Reportes' },
  { icon: 'mdi-account-cog', title: 'Roles' },
  { icon: 'mdi-comment', title: 'Comentarios' }
]
</script>
