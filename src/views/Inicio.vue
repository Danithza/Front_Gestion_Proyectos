<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6" elevation="10" max-width="500">
      <v-card-title class="text-h5 font-weight-bold text-center">Gestor de Proyectos</v-card-title>
      <v-card-text class="text-subtitle-1 text-center mb-4">
        Administra tus proyectos de forma sencilla y eficiente.
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="$router.push('/login')">Iniciar sesión</v-btn>
        <v-btn color="secondary" @click="$router.push('/registro')">Registrarse</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
// Este componente es puramente de presentación
</script>
