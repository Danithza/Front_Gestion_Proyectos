<template>
  <v-app-bar app color="blue darken-2" dark elevate-on-scroll>
    <v-app-bar-nav-icon @click="toggleDrawer" class="me-4" />

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

    <v-btn icon>
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-cog</v-icon>
    </v-btn>
    <v-menu
      v-model="logoutMenu"
      offset-y
      bottom
    >
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="logout">
          <v-list-item-title>Cerrar sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const toggleDrawer = inject<() => void>('toggleDrawer')!
const search = ref('')

const logoutMenu = ref(false)
const router = useRouter()

function logout() {
  logoutMenu.value = false
  router.push({ name: 'Home' })  // Redirige a Inicio
}
</script>

<style scoped>
.search-field {
  background-color: rgba(255, 255, 255, 0.15);
  max-width: 300px;
}

.search-field .v-input__control {
  border-radius: 20px;
}
</style>
