<template>
  <v-app>
    <Navbar />

    <v-main>
      <v-container class="pa-4 fill-height d-flex align-center justify-center" fluid>
        <v-row justify="center" class="w-100">
          <v-col cols="12" md="6">
            <v-card elevation="8" class="pa-6 rounded-lg">
              <v-card-title class="headline">Recuperar Contraseña</v-card-title>
              <v-card-subtitle class="mb-4">
                Ingresa tu correo electrónico para recibir instrucciones de recuperación.
              </v-card-subtitle>

              <v-form v-model="formValid" @submit.prevent="submitForm">
                <v-text-field
                  v-model="email"
                  label="Correo electrónico"
                  type="email"
                  :rules="[emailRequired, emailValid]"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-email-outline"
                  required
                />

                <v-btn
                  :disabled="!formValid"
                  color="blue"
                  block
                  type="submit"
                  class="mt-4"
                >
                  Enviar solicitud
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'


// Estado y validación
const email = ref<string>('')
const formValid = ref<boolean>(false)

const emailRequired = (value: string) =>
  !!value || 'El correo electrónico es obligatorio.'
const emailValid = (value: string) =>
  /.+@.+\..+/.test(value) || 'Debe ser un correo válido.'

// Envío del formulario
function submitForm(): void {
  console.log('Solicitud de recuperación enviada para:', email.value)
  // Aquí puedes agregar lógica para enviar email real (API call)
}
</script>