<template>
  <v-app>
    <v-main class="login-background">
      <v-container fluid class="fill-height">
        <v-row no-gutters class="fill-height">
          <!-- Columna izquierda - Bienvenida -->
          <v-col cols="12" md="6" class="d-flex flex-column justify-start align-center px-10 text-center" style="padding-top: 8vh;">
            <div class="glass-card pa-10 rounded-xl" style="background: rgba(255, 255, 255, 0.75); margin-top: 5vh;">

              <h1 class="text-h2 font-weight-bold mb-6 primary--text" style="letter-spacing: -0.5px;">
                ¡Bienvenido a Linex!
              </h1>
              <p class="text-body-1 mb-8 text--secondary" style="font-size: 1.1rem; line-height: 1.7;">
                Organiza, planifica y colabora con tu equipo de manera eficiente.<br>
                Linex es tu solución integral para la gestión de proyectos.
              </p>
              <transition name="fade" mode="out-in">
                <p :key="fraseActual" class="text-h6 font-italic primary--text" style="font-weight: 500;">
                  "{{ fraseActual }}"
                </p>
              </transition>
            </div>
          </v-col>

          <!-- Columna derecha: Formulario -->
          <v-col cols="12" md="6" class="d-flex justify-center align-center">
            <v-card
              class="pa-10"
              elevation="12"
              max-width="448"
              rounded="xl"
              style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(4px); margin-top: -15vh;"
            >
              <div class="text-center mb-8">
                <h2 class="text-h3 primary--text" style="font-weight: 600; letter-spacing: -0.5px;">
                  Iniciar Sesión
                </h2>
                <p class="text-body-1 text--secondary mt-3" style="font-size: 1rem;">
                  Ingresa tus credenciales para continuar
                </p>
              </div>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                density="comfortable"
                placeholder="Correo electrónico"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                color="primary"
                class="mb-6"
                style="font-size: 0.95rem;"
                hide-details="auto"
              />

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="comfortable"
                placeholder="Contraseña"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                color="primary"
                class="mb-4"
                @click:append-inner="visible = !visible"
                style="font-size: 0.95rem;"
                hide-details="auto"
              />

              <div class="d-flex justify-end mb-8">
                <router-link
                  class="text-caption text-decoration-none primary--text"
                  to="/recuperarclave"
                  style="font-size: 0.875rem;"
                >
                  ¿Olvidaste tu contraseña?
                </router-link>
              </div>

              <v-btn
                class="mb-4"
                color="primary"
                size="large"
                variant="flat"
                block
                @click="login"
                :loading="loading"
                rounded="lg"
                style="height: 50px; font-weight: 600; letter-spacing: 0.5px;"
              >
                Iniciar sesión
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Diálogo modal para éxito -->
      <v-dialog
        v-model="successDialog"
        persistent
        max-width="500"
        transition="dialog-bottom-transition"
      >
        <v-card class="text-center pa-6" rounded="xl">
          <v-card-text class="py-6">
            <v-icon
              color="success"
              size="80"
              icon="mdi-check-circle-outline"
            ></v-icon>
            <h2 class="text-h4 mt-4 mb-2" style="font-weight: 400;">¡Bienvenido!</h2>
            <p class="text-body-1">Credenciales verificadas correctamente</p>
          </v-card-text>

          <v-progress-linear
            v-if="successDialog"
            indeterminate
            color="primary"
            height="4"
          ></v-progress-linear>
        </v-card>
      </v-dialog>

      <!-- Diálogo modal para errores -->
      <v-dialog
        v-model="errorDialog"
        max-width="500"
        transition="dialog-top-transition"
      >
        <v-card class="text-center pa-6" rounded="xl">
          <v-card-text class="py-6">
            <v-icon
              color="error"
              size="80"
              icon="mdi-alert-circle-outline"
            ></v-icon>
            <h2 class="text-h4 mt-4 mb-2" style="font-weight: 600;">Error de autenticación</h2>
            <p class="text-body-1">{{ errorMessage }}</p>
          </v-card-text>

          <v-card-actions class="justify-center pb-4">
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              rounded="lg"
              @click="errorDialog = false"
              style="min-width: 160px;"
            >
              Entendido
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue' 
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const visible = ref(false)
const loading = ref(false)
const email = ref('')
const password = ref('')
const successDialog = ref(false)
const errorDialog = ref(false)
const errorMessage = ref('')

// Capturar el email de la URL cuando el componente se monta
onMounted(() => {
  if (route.query.email) {
    email.value = decodeURIComponent(route.query.email as string)
  }
})

// También puedes usar un watcher por si cambia la URL dinámicamente
watch(
  () => route.query.email,
  (newEmail) => {
    if (newEmail) {
      email.value = decodeURIComponent(newEmail as string)
    }
  }
)

// Resto del código permanece igual...
const emailRules = [
  (v: string) => !!v || 'El correo es requerido',
  (v: string) => /.+@.+\..+/.test(v) || 'El correo debe ser válido',
]

const passwordRules = [
  (v: string) => !!v || 'La contraseña es requerida',
  (v: string) => v.length >= 6 || 'Mínimo 6 caracteres',
]

const login = async (): Promise<void> => {
  if (!email.value || !password.value) return
  loading.value = true

  try {
    await authStore.login({ email: email.value, password: password.value })
    successDialog.value = true
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = 'Las credenciales proporcionadas no son válidas. Por favor, verifica tus datos.'
    errorDialog.value = true
  } finally {
    loading.value = false
  }
}

// Frases rotativas
const frases = [
  'Una meta sin un plan es solo un deseo.',
  'Planificar es traer el futuro al presente.',
  'Tu equipo, tu ritmo, tus reglas.',
]

const fraseActual = ref(frases[0])
let index = 0
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  interval = setInterval(() => {
    index = (index + 1) % frases.length
    fraseActual.value = frases[index]
  }, 3000)
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.login-background {
  background-image: linear-gradient(to bottom right, rgba(0, 0, 0, 0.4), rgba(0, 80, 170, 0.4)),
    url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80');
  background-size: cover;
  background-position: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.glass-card {
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 600px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.85) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.text-h2 {
  font-size: 2.5rem !important;
  line-height: 1.2;
}

.text-h3 {
  font-size: 2rem !important;
}

.text-h6 {
  font-size: 1.25rem !important;
}

.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

/* Animaciones personalizadas para los diálogos */
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.4s ease-out, opacity 0.3s ease;
}
.dialog-bottom-transition-enter-from,
.dialog-bottom-transition-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.dialog-top-transition-enter-active,
.dialog-top-transition-leave-active {
  transition: transform 0.4s ease-out, opacity 0.3s ease;
}
.dialog-top-transition-enter-from,
.dialog-top-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
