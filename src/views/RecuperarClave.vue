<template>
  <v-app>
    <v-main class="recovery-background">
      <v-container fluid class="fill-height">
        <v-row no-gutters class="fill-height">
          <!-- Columna derecha: Formulario -->
          <v-col cols="12" md="6" class="d-flex justify-center align-center">
            <v-card class="pa-10" elevation="12" max-width="448" rounded="xl" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(4px); margin-top: -5vh;">
              <div class="text-center mb-8">
                <h2 class="text-h3 primary--text" style="font-weight: 600; letter-spacing: -0.5px;">Recuperar Acceso</h2>
                <p class="text-body-1 text--secondary mt-3" style="font-size: 1rem;">Ingresa tu correo electrónico registrado</p>
              </div>

              <v-text-field
                v-model="email"
                :rules="[emailRequired, emailValid]"
                density="comfortable"
                placeholder="Correo electrónico"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                color="primary"
                class="mb-6"
                style="font-size: 0.95rem;"
                hide-details="auto"
              />

              <v-btn
                class="mb-4"
                color="primary"
                size="large"
                variant="flat"
                block
                @click="submitForm"
                :disabled="!formValid"
                :loading="loading"
                rounded="lg"
                style="height: 50px; font-weight: 600; letter-spacing: 0.5px;"
              >
                Enviar Instrucciones
              </v-btn>

              <v-card-text class="text-center mt-4">
                <router-link class="text-decoration-none primary--text" to="/login" style="font-size: 0.875rem;">
                  ← Volver al inicio de sesión
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const formValid = ref(false)
const loading = ref(false)

const emailRequired = (value: string) => !!value || 'El correo es requerido'
const emailValid = (value: string) => /.+@.+\..+/.test(value) || 'Debe ser un correo válido'

const submitForm = async () => {
  if (!formValid.value) return

  loading.value = true
  try {
    // Simular envío de email
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert(`Se han enviado instrucciones a ${email.value}`)
    router.push('/login')
  } catch (error) {
    console.error('Error:', error)
    alert('Ocurrió un error. Por favor intenta nuevamente.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.recovery-background {
  background-image: linear-gradient(to bottom right, rgba(0, 0, 0, 0.4), rgba(0, 80, 170, 0.4)),
    url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80');
  background-size: cover;
  background-position: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.glass-card {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  transition: all 0.3s ease;
}

.text-h2 {
  font-size: 2.5rem !important;
  line-height: 1.2;
}

.text-h3 {
  font-size: 2rem !important;
}

.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

@media (max-width: 960px) {
  .glass-card {
    margin-top: 2vh !important;
    padding: 30px 20px !important;
  }

  .text-h2 {
    font-size: 2rem !important;
  }
}
</style>
