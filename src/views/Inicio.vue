<template>
  <v-app>
    <Navbar />

    <v-main>
      <v-container class="py-12">
        <v-row align="center" justify="center">
          <v-col cols="12" md="6">
            <h1 class="text-h3 font-weight-bold mb-4">
              Captura, organiza y aborda tus tareas pendientes en cualquier lugar.
            </h1>
            <p class="text-subtitle-1 mb-6">
              Escapa del desorden y el caos: da rienda suelta a tu productividad con nuestro gestor de proyectos.
            </p>
            <v-row class="align-center">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="email"
                  placeholder="Correo electrónico"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-btn color="primary" block @click="registrar">
                  Regístrate, ¡es gratis!
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-img
              src="/mockup-phone.png"
              max-width="350"
              alt="Aplicación en móvil"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Navbar from '@/components/NavbarInicio.vue'

const email = ref('')

function registrar() {
  console.log('Correo:', email.value)
}
</script>
