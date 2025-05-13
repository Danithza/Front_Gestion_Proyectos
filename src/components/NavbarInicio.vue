<template>
  <v-app-bar flat color="transparent" elevate-on-scroll>
    <v-container class="d-flex justify-space-between align-center">
      <!-- Logo o nombre de la app -->
      <RouterLink to="/" class="text-h6 font-weight-bold text-primary text-decoration-none">
        GestorProyectos
      </RouterLink>

      <!-- Enlaces a otras rutas -->
      <v-row class="d-none d-md-flex" align="center" dense>
        <RouterLink to="/login" class="mx-3 text-decoration-none text-body-1">Iniciar sesión</RouterLink>
        <RouterLink to="/registro" class="mx-3 text-decoration-none text-body-1">Registro</RouterLink>
      </v-row>

      <!-- Menú móvil -->
      <v-menu
        class="d-md-none"
        transition="slide-y-transition"
        location="bottom end"
      >
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-menu</v-icon>
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
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}
</style>
