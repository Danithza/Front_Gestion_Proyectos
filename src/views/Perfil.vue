<template>
    <v-card
      class="mx-auto my-10 pa-6"
      elevation="3"
      max-width="600"
      rounded="xl"
    >
      <v-row class="text-center mb-4" justify="center">
        <v-avatar size="120">
          <v-img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" />
        </v-avatar>
      </v-row>
      <v-row justify="center" class="text-center">
        <div>
          <h2 class="text-h5 font-weight-bold mb-1">{{ usuario.nombre }} {{ usuario.apellido }}</h2>
          <p class="text-body-2 grey--text">
            {{ usuario.rol }} • Registrado el {{ usuario.fechaRegistro }}
          </p>
          <p class="text-body-2 mt-2">
            {{ usuario.descripcion }}
          </p>
        </div>
      </v-row>
  
      <v-divider class="my-4"></v-divider>
  
      <v-row class="text-center mb-4">
        <v-col cols="6">
          <div class="text-h6 font-weight-bold">{{ usuario.proyectos }}</div>
          <div class="caption">Proyectos</div>
        </v-col>
        <v-col cols="6">
          <div class="text-h6 font-weight-bold">{{ usuario.tareas }}</div>
          <div class="caption">Tareas</div>
        </v-col>
      </v-row>
  
      <v-divider class="my-4"></v-divider>
  
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="usuario.nombre"
            label="Nombre"
            variant="outlined"
            readonly
            prepend-inner-icon="mdi-account"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="usuario.apellido"
            label="Apellido"
            variant="outlined"
            readonly
            prepend-inner-icon="mdi-account"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="usuario.email"
            label="Correo Electrónico"
            variant="outlined"
            readonly
            prepend-inner-icon="mdi-email"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="usuario.telefono"
            label="Teléfono"
            variant="outlined"
            readonly
            prepend-inner-icon="mdi-phone"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="usuario.ciudad"
            label="Ciudad"
            variant="outlined"
            readonly
            prepend-inner-icon="mdi-city"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="usuario.tipoDocumento"
            label="Tipo de Documento"
            variant="outlined"
            readonly
            prepend-inner-icon="mdi-card-account-details"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="usuario.documento"
            label="Documento"
            variant="outlined"
            readonly
            prepend-inner-icon="mdi-card-text"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="usuario.rol"
            label="Rol"
            variant="outlined"
            readonly
            prepend-inner-icon="mdi-account-tie"
          />
        </v-col>
      </v-row>
  
      <v-row justify="center" class="mt-4">
        <v-btn color="primary" variant="text" prepend-icon="mdi-pencil">
          Editar Perfil
        </v-btn>
      </v-row>
    </v-card>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  interface Usuario {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    ciudad: string;
    tipoDocumento: string;
    documento: string;
    rol: string;
    fechaRegistro: string;
    descripcion: string;
    proyectos: number;
    tareas: number;
  }
  
  const usuario = ref<Usuario>({
    nombre: 'Laura',
    apellido: 'Forero',
    email: 'laura.forero@example.com',
    telefono: '3123456789',
    ciudad: 'Bogotá',
    tipoDocumento: 'Cédula',
    documento: '123456789',
    rol: 'Administrador',
    fechaRegistro: '2023-08-15',
    descripcion: 'Apasionada por la tecnología y la gestión de proyectos. Siempre en busca de nuevos retos.',
    proyectos: 8,
    tareas: 45,
  });
  </script>
  
  <style scoped>
  .text-center {
    text-align: center;
  }
  </style>
  