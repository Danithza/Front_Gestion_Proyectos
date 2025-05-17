<template>
  <v-app>
    <Navbar />

    <v-main>
      <v-container fluid class="fill-height">
        <v-row no-gutters class="fill-height">
          <!-- Columna izquierda -->
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column justify-center align-center px-10 text-center"
          >
            <div>
              <h1 class="text-h3 font-weight-bold mb-4">¡Únete a Linex!</h1>
              <p class="text-body-1 mb-4">
                Crea una cuenta y empieza a organizar y colaborar con tu equipo de manera eficiente.
              </p>
            </div>
          </v-col>

          <!-- Columna derecha: Formulario -->
          <v-col
            cols="12"
            md="6"
            class="d-flex justify-center align-start"
            style="padding-top: 40px;"
          >
            <v-card class="pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
              <div class="text-subtitle-1 text-medium-emphasis mb-4">Registro de usuario</div>

              <v-text-field
                v-model="name"
                :rules="[v => !!v || 'El nombre es requerido']"
                placeholder="Nombre completo"
                prepend-inner-icon="mdi-account"
                variant="outlined"
              />

              <v-text-field
                v-model="email"
                :rules="emailRules"
                placeholder="Correo electrónico"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
              />

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :type="visible ? 'text' : 'password'"
                placeholder="Contraseña"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />

              <v-btn
                class="mb-6"
                color="blue"
                size="large"
                variant="tonal"
                block
                :loading="loading"
                @click="register"
              >
                Registrarse
              </v-btn>

              <v-card-text class="text-center">
                <RouterLink
                  class="text-blue text-decoration-none"
                  to="/login"
                >
                  ¿Ya tienes cuenta? Inicia sesión aquí
                  <v-icon icon="mdi-chevron-right" />
                </RouterLink>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/NavbarInicio.vue'

// Refs con tipado
const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)

const router = useRouter()

// Reglas tipadas
const emailRules = [
  (v: string) => !!v || 'El correo es requerido',
  (v: string) => /.+@.+\..+/.test(v) || 'El correo debe ser válido',
]

const passwordRules = [
  (v: string) => !!v || 'La contraseña es requerida',
  (v: string) => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
]

// Función de registro
const register = (): void => {
  if (!name.value || !email.value || !password.value) return

  loading.value = true
  setTimeout(() => {
    loading.value = false
    router.push('/login')
  }, 1500)
}
</script>