<template>
  <v-app-bar
    color="blue-darken-2"
    dark
    elevate-on-scroll
    height="64"
    flat
    class="navbar-completo"
  >
    <!-- Logo + Título centrado -->
    <v-btn text class="d-flex align-center" to="/">
      <v-row align="center" class="ma-0 pa-0" no-gutters>
        <v-col class="d-flex align-center" cols="auto">
          <v-img
            src="@/assets/Logo.png"
            alt="Logo Linex"
            max-width="40"
            max-height="40"
            contain
            class="me-2 rounded"
          />
        </v-col>
        <v-col class="d-flex align-center" cols="auto">
          <span class="text-h6 font-weight-bold">Linex Plataforma</span>
        </v-col>
      </v-row>
    </v-btn>

    <v-spacer />

    <!-- Barra de búsqueda -->
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

    <!-- Componente Notificación con icono estilizado -->
    <div class="menu-icon">
      <Notificacion />
    </div>

    <!-- Componente Configuración con icono estilizado -->
    <div class="menu-icon">
      <Configuracion />
    </div>

    <!-- Componente Perfil con icono más parecido al estilo solicitado -->
    <div class="menu-icon">
      <PerfilMenu>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" size="32">mdi-account-circle-outline</v-icon>
        </template>
      </PerfilMenu>
    </div>
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

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  margin-left: 4px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.menu-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
</style>
