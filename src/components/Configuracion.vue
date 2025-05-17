<template>
    <v-menu v-model="menu" location="bottom end" offset-y>
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
  
      <v-card width="300">
        <v-card-title class="text-h6">Configuración</v-card-title>
        <v-divider />
  
        <v-list>
          <v-list-item @click="toggleDarkMode">
            <v-list-item-title>Modo oscuro</v-list-item-title>
            <v-list-item-action>
              <v-switch v-model="darkMode" inset />
            </v-list-item-action>
          </v-list-item>
  
          <v-list-item>
            <v-list-item-title>Preferencias</v-list-item-title>
          </v-list-item>
  
          <v-list-item>
            <v-list-item-title>Idioma</v-list-item-title>
            <v-select
              :items="idiomas"
              v-model="idiomaSeleccionado"
              variant="underlined"
              hide-details
              class="ms-2"
              density="compact"
              style="max-width: 150px"
            />
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const menu = ref(false)
  const darkMode = ref(false)
  const idiomas = ['Español', 'Inglés', 'Francés']
  const idiomaSeleccionado = ref(idiomas[0])
  
  function toggleDarkMode() {
    // Aquí podrías emitir un evento al padre, o usar provide/inject para un tema global
    console.log('Modo oscuro:', darkMode.value)
  }
  </script>
  