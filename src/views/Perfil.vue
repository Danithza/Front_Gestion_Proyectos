<template>
  <v-card class="mx-auto my-10 pa-6 perfil-card" elevation="3" max-width="600" rounded="xl">
    <!-- Avatar e ícono principal -->
    <v-row class="text-center mb-4" justify="center">
      <v-avatar size="120" color="white">
        <v-icon size="96" color="blue-darken-2">mdi-account-circle-outline</v-icon>
      </v-avatar>
    </v-row>

    <!-- Cabecera con nombre, rol y fecha -->
    <v-row justify="center" class="text-center mb-2 white--text">
      <div v-if="user">
        <h2 class="text-h5 font-weight-bold mb-1">
          {{ user.firstName }} {{ user.lastName }}
        </h2>

        <p class="text-caption text-white font-weight-medium mb-0">
          <span v-if="user.rol">{{ user.rol }}</span>
        </p>

        <p class="text-caption text-white font-italic">
          <span v-if="user.fechaRegistro">Registrado el {{ user.fechaRegistro }}</span>
        </p>

        <p class="text-body-2 mt-2 text-white" v-if="user.descripcion">{{ user.descripcion }}</p>
      </div>
    </v-row>

    <v-divider class="my-4" />

    <!-- Datos de usuario -->
    <v-row dense v-if="user">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="user.firstName"
          label="Nombre"
          variant="outlined"
          readonly
          prepend-inner-icon="mdi-account"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="user.lastName"
          label="Apellido"
          variant="outlined"
          readonly
          prepend-inner-icon="mdi-account"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="typeDocumentTitle"
          label="Tipo de Documento"
          variant="outlined"
          readonly
          prepend-inner-icon="mdi-card-account-details"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="user.document"
          label="Documento"
          variant="outlined"
          readonly
          prepend-inner-icon="mdi-card-text"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="user.email"
          label="Correo Electrónico"
          variant="outlined"
          readonly
          prepend-inner-icon="mdi-email"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="user.telephone"
          label="Teléfono"
          variant="outlined"
          readonly
          prepend-inner-icon="mdi-phone"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="cityTitle"
          label="Ciudad"
          variant="outlined"
          readonly
          prepend-inner-icon="mdi-city"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserPerfil' })

import { ref, computed, onMounted, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

interface User {
  id: number
  firstName: string
  lastName: string
  rol?: string
  fechaRegistro?: string
  descripcion?: string
  typeDocumentId?: number
  cityId?: number
  document?: string
  email?: string
  telephone?: string
}

interface City {
  id: number
  title: string
}

interface TypeDocument {
  id: number
  title: string
}

const authStore = useAuthStore()
const { user } = storeToRefs(authStore) as unknown as { user: Ref<User> }

const typeDocuments = ref<TypeDocument[]>([])
const cities = ref<City[]>([])

const typeDocumentTitle = computed(() => {
  return typeDocuments.value.find(t => t.id === user.value?.typeDocumentId)?.title || '...'
})

const cityTitle = computed(() => {
  return cities.value.find(c => c.id === user.value?.cityId)?.title || '...'
})

const fetchCatalogs = async () => {
  const [docRes, cityRes] = await Promise.all([
    fetch('http://localhost:3333/api/types_documents'),
    fetch('http://localhost:3333/api/cities'),
  ])

  if (!docRes.ok || !cityRes.ok) throw new Error('Error al cargar catálogos')

  typeDocuments.value = await docRes.json()
  cities.value = await cityRes.json()
}

onMounted(fetchCatalogs)
</script>

<style scoped>
.text-center {
  text-align: center;
}

.perfil-card {
  background: linear-gradient(to bottom right, #e3f2fd, #ffffff); /* azul claro degradado */
  border: 1px solid #c5cae9;
}
</style>
