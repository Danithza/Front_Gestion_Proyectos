<template>
  <v-app-bar flat color="blue-darken-3" elevate-on-scroll>
    <v-container class="d-flex justify-space-between align-center px-6 py-3">
      <!-- Logo con animación suave -->
      <RouterLink
        to="/"
        class="d-flex align-center text-decoration-none logo-container"
      >
        <v-img
          :src="Logo"
          alt="Logo Linex"
          width="60"
          class="mr-3 logo-image"
          contain
        />
        <span class="text-h4 font-weight-bold text-white logo-text">Linex</span>
      </RouterLink>

    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Logo from '@/assets/Logo.png'
</script>

<style scoped>
/* Estilo base mejorado */
.text-white {
  color: white !important;
}

/* Animaciones para el logo */
.logo-container {
  transition: all 0.3s ease-out;
}
.logo-container:hover {
  transform: translateY(-2px);
}
.logo-image {
  transition: all 0.3s ease-out;
}
.logo-text {
  transition: all 0.3s ease-out;
  letter-spacing: 1px;
  position: relative;
}
.logo-text::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 2px;
  background: white;
  transition: width 0.4s ease;
}
.logo-container:hover .logo-image {
  transform: scale(1.05);
}
.logo-container:hover .logo-text::after {
  width: 100%;
}

/* Botón de login con efectos mejorados */
.login-button {
  display: inline-flex;
  align-items: center;
  padding: 10px 22px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.login-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.4s ease;
}

.login-button:hover::before {
  left: 100%;
}

.button-text {
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-right: 8px;
  transition: all 0.3s ease;
}

.button-icon {
  transition: all 0.3s ease;
}

.login-button:hover .button-icon {
  transform: translateX(3px);
}

/* Transición suave para la página */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Efecto de sombra para el app-bar */
.v-app-bar {
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15) !important;
  transition: box-shadow 0.3s ease;
}
.v-app-bar:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
}
</style>
