<template>
    <v-menu v-model="menu" offset-y bottom>
      <template #activator="{ props }">
        <v-btn icon v-bind="props" color="white" variant="tonal" rounded>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="logout" clickable>
          <v-list-item-title class="text-primary font-weight-medium">Cerrar sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const menu = ref(false)
  const router = useRouter()
  
  function logout() {
    menu.value = false
    router.push({ name: 'Home' })
  }
  </script>
  