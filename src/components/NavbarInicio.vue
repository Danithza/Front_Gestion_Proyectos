<template>
  <v-app-bar flat color="blue" elevate-on-scroll>
    <v-container class="d-flex justify-space-between align-center px-6">
      <!-- Logo + Nombre -->
      <RouterLink to="/" class="d-flex align-center text-decoration-none logo-container">
        <v-img
          :src="Logo"
          alt="Logo Linex"
          width="70"
          class="mr-2 logo-image"
        />
        <span class="text-h4 font-weight-bold text-white logo-text">Linex</span>
      </RouterLink>

      <!-- Contenedor derecho -->
      <div class="d-flex align-center pl-40">
        <!-- Enlaces para desktop -->
        <v-row class="d-none d-md-flex" align="center" justify="end" dense>
          <RouterLink to="/login" class="mx-4 text-decoration-none text-white">Iniciar sesión</RouterLink>
          <RouterLink to="/registro" class="mx-4 text-decoration-none text-white">Registro</RouterLink>
        </v-row>

        <!-- Menú móvil -->
        <v-menu class="d-md-none" transition="slide-y-transition" location="bottom end">
          <template #activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon color="white">mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item to="/login" link>
              <v-list-item-title>Iniciar sesión</v-list-item-title>
            </v-list-item>
            <v-list-item to="/registro" link>
              <v-list-item-title>Registro</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Logo from '@/assets/Logo.png'
</script>

<style scoped>
.text-white {
  color: white !important;
}

.logo-container {
  transition: transform 0.3s ease;
}
.logo-container:hover {
  transform: translateY(-5px);
}
.logo-image {
  transition: all 0.3s ease;
}
.logo-text {
  transition: all 0.3s ease;
}
.logo-container:hover .logo-image {
  transform: rotate(-5deg) scale(1.05);
}
.logo-container:hover .logo-text {
  transform: translateX(5px);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}
</style>
