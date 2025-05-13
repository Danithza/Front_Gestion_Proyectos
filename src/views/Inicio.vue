<template>
  <v-app>
    <Navbar />

    <v-main class="gradient-background">
      <v-container class="py-16">
        <v-row align="center" justify="center">
          <!-- Columna de texto -->
          <v-col cols="12" md="6">
            <h1 class="text-h2 font-weight-bold mb-4 text-primary d-flex align-center">
              <v-icon icon="mdi-rocket-launch-outline" size="36" class="mr-2" />
              Potencia tu productividad con Linex
            </h1>

            <p class="text-subtitle-1 text-grey-darken-2 mb-6">
              Captura, organiza y aborda tus tareas pendientes desde cualquier lugar.
              Escapa del desorden y da rienda suelta a tu eficiencia con nuestro gestor de proyectos colaborativo.
            </p>

            <v-row class="align-center">
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="email"
                  placeholder="Tu correo electrónico"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  prepend-inner-icon="mdi-email-outline"
                />
              </v-col>

              <v-col cols="12" sm="4">
                <v-btn
                  color="blue-darken-2"
                  block
                  size="large"
                  @click="registrar"
                >
                  Regístrate gratis
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

          <!-- Columna de imagen -->
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-img
              :src="inicioImage"
              max-width="450"
              alt="Vista previa de la app"
              class="elevation-3 rounded-lg"
              cover
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/NavbarInicio.vue'
import inicioImage from '@/assets/inicio.jpg'

const email = ref('')

function registrar() {
  console.log('Correo ingresado:', email.value)
}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(135deg, #f3f4f6, #e0f7fa);
  min-height: 100vh;
}
</style>
