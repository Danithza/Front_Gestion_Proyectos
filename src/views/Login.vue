<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row no-gutters class="fill-height">
          <!-- Columna izquierda: Bienvenida con fondo azul claro -->
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column justify-center align-center px-10 text-center"
          >
            <div>
              <h1 class="text-h3 font-weight-bold mb-4">¡Bienvenido a Linex!</h1>
              <p class="text-body-1 mb-4">
                Organiza, planifica y colabora con tu equipo de manera eficiente.
                Linex es tu solución integral para la gestión de proyectos.
              </p>
              <transition name="fade" mode="out-in">
                <p :key="fraseActual" class="text-subtitle-1 text-grey-darken-1">
                  “{{ fraseActual }}”
                </p>
              </transition>
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
              <div class="text-subtitle-1 text-medium-emphasis">Cuenta</div>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                density="compact"
                placeholder="Correo electrónico"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
              />

              <!-- Contraseña y link -->
              <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                <span>Contraseña</span>
                <router-link
                  class="text-caption text-decoration-none text-blue"
                  to="/recuperarclave"
                >
                  ¿Olvidaste tu contraseña?
                </router-link>
              </div>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="Ingresa tu contraseña"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />

              <v-card class="mb-6" color="surface-variant" variant="tonal">
                <v-card-text class="text-medium-emphasis text-caption">
                  Advertencia: Después de 3 intentos fallidos consecutivos, tu cuenta será bloqueada temporalmente por tres horas.
                </v-card-text>
              </v-card>

              <v-btn
                class="mb-6"
                color="blue"
                size="large"
                variant="tonal"
                block
                @click="login"
                :loading="loading"
              >
                Iniciar sesión
              </v-btn>

              <v-card-text class="text-center">
                <router-link class="text-blue text-decoration-none" to="/registro">
                  Regístrate ahora <v-icon icon="mdi-chevron-right" />
                </router-link>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const visible = ref(false)
const loading = ref(false)
let email = ref('')
const password = ref('')

const emailRules = [
  (v: string) => !!v || 'El correo es requerido',
  (v: string) => /.+@.+\..+/.test(v) || 'El correo debe ser válido',
]

const passwordRules = [
  (v: string) => !!v || 'La contraseña es requerida',
  (v: string) => v.length >= 6 || 'Mínimo 6 caracteres',
]

const login = (): void => {
  if (!email.value || !password.value) return

  loading.value = true
  setTimeout(() => {
    loading.value = false
    router.push('/dashboard')
  }, 1000)
}

// Frases rotativas
const frases = [
  'Una meta sin un plan es solo un deseo.',
  'Los proyectos exitosos nacen de una buena organización.',
  'La colaboración es el alma de la productividad.',
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
  }, 1500)
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
