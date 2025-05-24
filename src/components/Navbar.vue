<template>
  <v-app-bar
    color="blue-darken-2"
    dark
    elevate-on-scroll
    height="64"
    flat
    class="navbar-completo"
  >
    <v-btn text class="d-flex align-center" to="/">
      <v-img
        src="@/assets/Logo.png"
        alt="Logo Linex"
        max-width="40"
        max-height="40"
        contain
        class="me-2 rounded"
      />
      <span class="text-h6 font-weight-bold">Linex</span>
    </v-btn>

    <v-spacer />

    <v-text-field
      v-model="search"
      flat
      hide-details
      rounded
      prepend-inner-icon="mdi-magnify"
      label="Buscar"
      class="search-field"
      density="compact"
      style="max-width: 300px"
    />

    <!-- Componente Notificación -->
    <Notificacion />

    <!-- Componente Configuración -->
    <Configuracion />

    <!-- Componente Perfil / Menú -->
    <PerfilMenu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Notificacion from '@/components/Notificacion.vue'
import Configuracion from '@/components/Configuracion.vue'
import PerfilMenu from '@/components/PerfilMenu.vue'

const search = ref('')
</script>

<style scoped>
.navbar-completo {
  left: 0 !important;
  width: 100% !important;
  z-index: 10;
}

.search-field {
  background-color: rgba(255, 255, 255, 0.15);
  max-width: 300px;
}

.search-field .v-input__control {
  border-radius: 20px;
}
</style>
