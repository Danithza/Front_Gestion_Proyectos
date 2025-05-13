<template>
  <v-container fluid class="fill-height">
    <v-row no-gutters class="fill-height">

      <!-- Columna izquierda: Texto de bienvenida -->
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

      <!-- Columna derecha: Formulario de Registro -->
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
          ></v-text-field>

          <v-text-field
            v-model="email"
            :rules="[
              v => !!v || 'El correo es requerido',
              v => /.+@.+\..+/.test(v) || 'El correo debe ser válido'
            ]"
            placeholder="Correo electrónico"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="[
              v => !!v || 'La contraseña es requerida',
              v => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres'
            ]"
            :type="visible ? 'text' : 'password'"
            placeholder="Contraseña"
            prepend-inner-icon="mdi-lock-outline"
            append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            @click:append-inner="visible = !visible"
          ></v-text-field>

          <v-btn
            class="mb-6"
            color="blue"
            size="large"
            variant="tonal"
            block
            @click="register"
            :loading="loading"
          >
            Registrarse
          </v-btn>

          <v-card-text class="text-center">
            <router-link
              class="text-blue text-decoration-none"
              to="/login"
            >
              Ya tienes cuenta? Inicia sesión aquí <v-icon icon="mdi-chevron-right"></v-icon>
            </router-link>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
const loading = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')

const register = async () => {
  if (!name.value || !email.value || !password.value) return

  loading.value = true

  // Simula un proceso de registro
  setTimeout(() => {
    loading.value = false
    // Redirige a la página de inicio de sesión o dashboard
    router.push('/login')
  }, 1500)

  // Si tienes un backend, usa algo como:
  /*
  try {
    const response = await axios.post('/api/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    if (response.data.success) {
      router.push('/login')
    } else {
      alert(response.data.message)
    }
  } catch (error) {
    console.error(error)
    alert('Error en el registro')
  }
  */
}
</script>

