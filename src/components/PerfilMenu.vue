<template>
  <!-- Menú del perfil -->
  <v-menu v-model="menu" offset-y transition="scale-transition" location="bottom end">
    <template #activator="{ props }">
      <v-btn icon v-bind="props" color="primary" variant="tonal" rounded>
        <v-avatar size="32">
          <v-icon color="white" size="28">mdi-account-circle</v-icon>
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

      <v-list-item @click="abrirConfirmacion" class="logout-item">
        <v-list-item-title class="text-error font-weight-medium">Cerrar sesión</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <!-- Diálogo de confirmación -->
  <v-dialog v-model="dialog" max-width="360" persistent>
    <v-card class="pa-4 rounded-xl elevation-3 border-dialog">
      <v-card-title class="text-center text-subtitle-1 font-weight-bold pb-1">
        Confirmar cierre de sesión
      </v-card-title>

      <v-card-text class="text-body-2 text-center mb-1">
        ¿Estás segura que deseas cerrar sesión?
      </v-card-text>

      <v-card-actions class="justify-center mt-2">
        <v-btn
          color="blue-darken-2"
          variant="tonal"
          rounded="pill"
          size="small"
          class="mx-1 text-white font-weight-medium"
          @click="dialog = false"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="blue-darken-2"
          variant="tonal"
          rounded="pill"
          size="small"
          class="mx-1 text-white font-weight-medium"
          @click="cerrarSesion"
        >
          Sí
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Snackbar tipo banner -->
  <v-snackbar
    v-model="snackbar.show"
    :timeout="2500"
    :color="snackbar.color"
    location="bottom right"
    rounded="pill"
    elevation="6"
    class="logout-snackbar"
  >
    <template #default>
      <div class="d-flex align-center">
        <v-icon class="mr-3" size="24" color="white">{{ snackbar.icon }}</v-icon>
        <div class="text-white font-weight-medium text-subtitle-2">
          {{ snackbar.message }}
        </div>
      </div>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menu = ref(false)
const dialog = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'green-darken-2',
  icon: 'mdi-logout-variant'
})

const username = localStorage.getItem('username') || 'U'
const usernameInitial = computed(() => username.charAt(0).toUpperCase())

function abrirConfirmacion() {
  menu.value = false
  dialog.value = true
}

function cerrarSesion() {
  dialog.value = false

  localStorage.removeItem('token')
  localStorage.removeItem('username')
  sessionStorage.clear()

  snackbar.value = {
    show: true,
    message: 'Has cerrado sesión exitosamente.',
    color: 'green-darken-2',
    icon: 'mdi-logout-variant'
  }

  setTimeout(() => {
    router.push('/')
  }, 1200)
}

function goToPerfil() {
  menu.value = false
  router.push('/perfil')
}

function goToCambiarClave() {
  menu.value = false
  router.push('/recuperarclave')
}
</script>

<style scoped>
.logout-item:hover {
  background-color: #ffe6e6;
}

.logout-snackbar {
  max-width: 360px;
  padding: 14px 20px;
}

.border-dialog {
  border: 1.5px solid #90caf9; /* azul claro */
  background-color: #fff;
}
</style>
