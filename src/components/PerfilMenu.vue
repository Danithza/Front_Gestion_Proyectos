<template>
  <v-menu v-model="menu" offset-y transition="scale-transition" location="bottom end">
    <template #activator="{ props }">
      <v-btn icon v-bind="props" color="primary" variant="tonal" rounded>
        <v-avatar size="32">
          <span class="text-white text-subtitle-1">{{ usernameInitial }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <v-list>
      <v-list-item @click="goToPerfil">
        <v-list-item-title>Mi perfil</v-list-item-title>
      </v-list-item>

      <v-list-item @click="goToCambiarClave">
        <v-list-item-title>Cambiar contraseña</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item @click="mostrarAlertaCerrarSesion" class="logout-item">
        <v-list-item-title class="text-error font-weight-medium">Cerrar sesión</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const router = useRouter()
const menu = ref(false)

const username = localStorage.getItem('username') || 'U'
const usernameInitial = computed(() => username.charAt(0).toUpperCase())

function mostrarAlertaCerrarSesion() {
  const confirmar = window.confirm('¿Estás seguro de que deseas cerrar sesión?')
  if (confirmar) {
    authStore.logout()
    router.push('/')
  }
}

function goToPerfil() {
  menu.value = false
  router.push('/perfil')
}

function goToCambiarClave() {
  menu.value = false
  router.push('/recuperarclave') // Redirige a la vista RecuperarClave.vue
}

function goToConfiguracion() {
  menu.value = false
  router.push('/configuracion')
}
</script>

<style scoped>
.logout-item:hover {
  background-color: #ffe6e6;
}
</style>
