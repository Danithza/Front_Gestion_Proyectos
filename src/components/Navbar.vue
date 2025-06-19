navbar
<template>
  <v-app-bar
    color="blue-darken-2"
    dark
    elevate-on-scroll
    height="64"
    flat
    class="navbar-completo"
  >
    <!-- Logo y título -->
    <div class="d-flex align-center logo-container">
      <v-img
        :src="Logo"
        alt="Logo Linex"
        width="70"
        class="mr-3"
        contain
      />
      <span class="text-h4 font-weight-bold text-white logo-text">Linex</span>
    </div>

    <v-spacer />

    <!-- Iconos -->
    <div class="menu-icon">
    </div>

    <div class="menu-icon">
      <Configuracion>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" size="28">mdi-cog-outline</v-icon>
        </template>
      </Configuracion>
    </div>

    <!-- Ícono de perfil forzado correctamente -->
    <div class="menu-icon">
      <PerfilMenu>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon>
            <v-icon size="30">mdi-account-circle-outline</v-icon>
          </v-btn>
        </template>
      </PerfilMenu>
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Notificacion from '@/components/Notificacion.vue'
import PerfilMenu from '@/components/PerfilMenu.vue'
import Logo from '@/assets/Logo.png'

const search = ref('')
</script>

<style scoped>
.navbar-completo {
  left: 0 !important;
  width: 100% !important;
  z-index: 10;
}
.logo-container {
  display: flex;
  align-items: center;
}
.logo-text {
  font-size: 26px;
  font-weight: bold;
  color: white;
}
.search-field {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  max-width: 300px;
  transition: background-color 0.3s ease;
}
.search-field:hover {
  background-color: rgba(255, 255, 255, 0.15);
}
.search-field input {
  color: white !important;
}
.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  margin-left: 4px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}
.menu-icon:hover {
  background-color: rgba(255, 255, 255, 0.15);
  cursor: pointer;
}
</style>
