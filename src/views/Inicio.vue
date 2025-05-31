<template>
  <v-app>
    <!-- Sección Hero -->
    <v-main class="gradient-background">
      <v-container class="py-8">
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" class="pr-md-8">
            <div class="d-flex align-center mb-4">
              <v-icon
                icon="mdi-rocket-launch-outline"
                size="36"
                color="blue-darken-2"
                class="mr-3 hover-grow"
              />
              <h1 class="hero-title font-weight-bold" style="font-size: 2rem;">
                {{ heroTitle }}
              </h1>
            </div>
            <p class="text-subtitle-1 text-grey-darken-2 mb-6">
              Captura, organiza y aborda tus tareas pendientes desde cualquier lugar.<br>
              Escapa del desorden y da rienda suelta a tu eficiencia con nuestro gestor de proyectos colaborativo.
            </p>

            <!-- Formulario de inicio de sesión rápido -->
            <v-form @submit.prevent="redirectToLogin" class="mt-6">
              <v-row align="center">
                <v-col cols="8">
                  <v-text-field
                    v-model="email"
                    label="Tu correo electrónico"
                    type="email"
                    required
                    outlined
                    dense
                    hide-details="auto"
                    class="rounded-lg"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-btn
                    type="submit"
                    color="blue-darken-2"
                    class="text-white font-weight-bold"
                    block
                    height="40"
                  >
                    Iniciar sesión
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>

          <v-col cols="12" md="6" class="pl-md-8">
            <v-img
              :src="appPreviewImage"
              max-width="500"
              :alt="appPreviewAlt"
              class="elevation-0 rounded-0 floating-image"
              cover
              style="background-color: transparent;"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Sección Beneficios -->
    <section class="benefits-section py-16">
      <v-container>
        <h2 class="text-center text-h4 font-weight-bold mb-10 text-white">¿Por qué elegir Linex?</h2>
        <v-row>
          <v-col
            v-for="(benefit, index) in benefits"
            :key="index"
            cols="12"
            md="4"
            class="text-center"
          >
            <div
              class="benefit-icon hover-pulse"
              @mouseenter="hoverBenefit = index"
              @mouseleave="hoverBenefit = null"
            >
              <v-icon
                :icon="benefit.icon"
                :size="hoverBenefit === index ? 52 : 48"
                :color="hoverBenefit === index ? 'white' : 'cyan-lighten-4'"
              />
            </div>
            <h3 class="text-h6 text-white mt-4 font-weight-medium">{{ benefit.title }}</h3>
            <p class="text-white text-body-1">{{ benefit.description }}</p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Sección Funcionalidades -->
    <section class="features-section py-16">
      <v-container>
        <h2 class="text-center text-h4 font-weight-bold mb-10">Características principales</h2>
        <v-row>
          <v-col
            v-for="(feature, index) in features"
            :key="index"
            cols="12"
            md="3"
            class="text-center px-6 feature-col"
            @mouseenter="hoverFeature = index"
            @mouseleave="hoverFeature = null"
          >
            <div
              class="feature-icon mb-4"
              :class="{'feature-icon-hover': hoverFeature === index}"
            >
              <v-icon
                :icon="feature.icon"
                :size="hoverFeature === index ? 56 : 48"
                :color="hoverFeature === index ? 'blue-darken-3' : 'primary'"
              />
            </div>
            <h3 class="text-subtitle-1 font-weight-bold mt-2">{{ feature.title }}</h3>
            <p class="text-grey-darken-1 text-body-1">{{ feature.description }}</p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Sección Testimonios -->
    <section class="testimonials-section py-16">
      <v-container>
        <h2 class="text-center text-h4 font-weight-bold mb-10">Lo que dicen nuestros usuarios</h2>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card
              class="pa-8 elevation-2 rounded-xl testimonial-card hover-float"
            >
              <div class="d-flex align-center mb-4">
                <v-avatar
                  color="blue-darken-2"
                  size="60"
                  class="mr-4"
                >
                  <span class="text-h5">{{ testimonial.authorInitials }}</span>
                </v-avatar>
                <div>
                  <p class="font-weight-medium mb-0">{{ testimonial.author }}</p>
                  <p class="text-caption text-grey">{{ testimonial.position }}</p>
                </div>
              </div>
              <p class="mb-0 text-body-1">{{ testimonial.content }}</p>
              <div class="d-flex justify-center mt-4">
                <v-rating
                  v-model="testimonial.rating"
                  color="amber"
                  density="compact"
                  size="24"
                  readonly
                  :length="5"
                />
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Sección CTA Final -->
    <section class="cta-section py-16">
      <v-container class="text-center">
        <v-icon
          size="64"
          color="white"
          class="mb-4 hover-bounce"
        >mdi-lightbulb-on-outline</v-icon>
        <h2 class="text-h3 font-weight-bold mb-6">¿Estás listo para mejorar tu productividad?</h2>
        <p class="mb-6 text-h6">Únete a miles de equipos que ya utilizan Linex para alcanzar sus objetivos más rápido.</p>
        <v-btn
          color="white"
          size="x-large"
          class="text-blue-darken-2 font-weight-bold hover-grow"
          @click="scrollToTop"
        >
          Comienza ahora
        </v-btn>
      </v-container>
    </section>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import inicioImg from '@/assets/inicio1.png'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const heroTitle = ref('Potencia tu productividad con Linex')
const appPreviewImage = ref(inicioImg)
const appPreviewAlt = ref('Vista previa de la aplicación Linex mostrando el tablero de tareas')
const hoverBenefit = ref<number | null>(null)
const hoverFeature = ref<number | null>(null)

// Función para redirigir al login con el email
const redirectToLogin = () => {
  if (email.value) {
    router.push({
      path: '/login',
      query: { email: encodeURIComponent(email.value) }
    })
  }
}

const benefits = ref([
  {
    icon: 'mdi-check-circle-outline',
    title: 'Organización efectiva',
    description: 'Administra tus proyectos de forma clara, organizada y visual.'
  },
  {
    icon: 'mdi-cloud-sync-outline',
    title: 'Sincronización en la nube',
    description: 'Accede a tus tareas y proyectos desde cualquier dispositivo.'
  },
  {
    icon: 'mdi-account-group-outline',
    title: 'Colaboración en equipo',
    description: 'Comparte tareas y colabora con tu equipo en tiempo real.'
  }
])

const features = ref([
  {
    icon: 'mdi-calendar-check-outline',
    title: 'Gestión de Tareas',
    description: 'Asigna, edita y prioriza tareas en segundos.'
  },
  {
    icon: 'mdi-timeline-check-outline',
    title: 'Seguimiento de Progreso',
    description: 'Visualiza el avance de tu equipo en tiempo real.'
  },
  {
    icon: 'mdi-bell-ring-outline',
    title: 'Notificaciones Inteligentes',
    description: 'Recibe alertas solo de lo importante.'
  },
  {
    icon: 'mdi-chart-box-outline',
    title: 'Reportes y métricas',
    description: 'Obtén análisis detallados del rendimiento.'
  }
])

const testimonial = ref({
  authorInitials: 'AP',
  author: 'Ana Pérez',
  position: 'Project Manager @TechSolutions',
  content: '"Linex ha transformado completamente cómo gestiono mi tiempo y mis tareas. La interfaz es intuitiva y muy útil para el trabajo en equipo. Hemos reducido nuestro tiempo de gestión de proyectos en un 40% desde que comenzamos a usarlo."',
  rating: 5
})

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<style scoped>
.hero-title {
  font-size: 2rem;
  line-height: 1.2;
  background: linear-gradient(to right, #0077b6, #00b4d8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline;
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 1.75rem;
  }
}

.gradient-background {
  background: linear-gradient(135deg, #f3f4f6, #e0f7fa);
  min-height: 80vh;
}

.floating-image {
  animation: float 6s ease-in-out infinite;
  transform: translateY(0px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  background-color: transparent;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

.benefits-section {
  background: linear-gradient(to right, #0077b6, #00b4d8);
  color: white;
}

.benefit-icon {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.features-section {
  background-color: #ffffff;
}

.feature-icon {
  background: #e3f2fd;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.feature-icon-hover {
  transform: scale(1.1);
  background: #bbdefb;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.testimonials-section {
  background-color: #f8f9fa;
}

.testimonial-card {
  background: white;
  border-top: 4px solid #0077b6;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-section {
  background: linear-gradient(to right, #0077b6, #00b4d8);
  color: white;
}

/* Efectos de hover */
.hover-grow {
  transition: transform 0.3s ease;
}
.hover-grow:hover {
  transform: scale(1.1);
}

.hover-pulse:hover {
  animation: pulse 1s infinite;
}

.hover-float:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.hover-bounce {
  transition: transform 0.3s ease;
}
.hover-bounce:hover {
  animation: bounce 0.5s;
}

.feature-col {
  transition: all 0.3s ease;
}
.feature-col:hover {
  transform: translateY(-5px);
}

/* Animaciones */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Estilo adicional para el formulario */
.v-text-field--outlined >>> fieldset {
  border-radius: 8px;
}

@media (max-width: 960px) {
  .pr-md-8, .pl-md-8 {
    padding-right: 0 !important;
    padding-left: 0 !important;
  }

  .gradient-background {
    min-height: auto;
    padding-bottom: 2rem;
  }

  .feature-col {
    margin-bottom: 2rem;
  }
}
</style>
