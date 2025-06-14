<template>
  <v-card class="mx-auto my-10 pa-6" elevation="3" max-width="600" rounded="xl">
    <!-- Avatar y datos principales -->
    <v-row class="text-center mb-4" justify="center">
      <v-avatar size="120">
        <v-img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" />
      </v-avatar>
    </v-row>

    <v-row justify="center" class="text-center">
      <div v-if="user">
        <h2 class="text-h5 font-weight-bold mb-1">
          {{ user.firstName }} {{ user.lastName }}
        </h2>
        <p class="text-body-2 grey--text">
          {{ user.rol }} • Registrado el {{ user.fechaRegistro }}
        </p>
        <p class="text-body-2 mt-2">{{ user.descripcion }}</p>
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
          :model-value="typeDocumentName"
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
          :model-value="cityName"
          label="Ciudad"
          variant="outlined"
          readonly
          prepend-inner-icon="mdi-city"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
defineOptions({ name: 'UserPerfil' });

import { computed, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';

// Tipo User local
interface User {
  firstName: string;
  lastName: string;
  rol: string;
  fechaRegistro: string;
  descripcion: string;
  typeDocumentId: number;
  cityId: number;
  document: string;
  email: string;
  telephone: string;
}

const authStore = useAuthStore();
const { user } = storeToRefs(authStore) as unknown as { user: Ref<User> };

// Catálogo manual de tipo de documento
const typeDocumentCatalog = [
  { id: 1, nombre: 'Cédula de Ciudadanía' },
  { id: 2, nombre: 'Tarjeta de Identidad' },
  { id: 3, nombre: 'Pasaporte' },
];

// Catálogo manual de ciudades
const cityCatalog = [
  { id: 1, nombre: 'Bogotá' },
  { id: 2, nombre: 'Medellín' },
  { id: 3, nombre: 'Cali' },
];

const typeDocumentName = computed(() =>
  typeDocumentCatalog.find(t => t.id === user.value?.typeDocumentId)?.nombre || 'Desconocido'
);

const cityName = computed(() =>
  cityCatalog.find(c => c.id === user.value?.cityId)?.nombre || 'Desconocida'
);
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
