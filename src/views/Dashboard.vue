<template>
  <v-container fluid class="dashboard-container">
    <!-- Botón de refresh -->
    <v-row>
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="fetchDashboard"
          :loading="loading"
          prepend-icon="mdi-refresh"
          class="refresh-btn"
          variant="flat"
        />
      </v-col>
    </v-row>

    <!-- Tarjetas resumen -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="card in summaryCards" :key="card.title">
        <v-card
          class="summary-card pa-4 d-flex flex-column"
          elevation="2"
          :color="card.color + '-lighten-5'"
          border
        >
          <div class="d-flex align-center">
            <v-icon :color="card.color" size="40" class="mr-3">{{ card.icon }}</v-icon>
            <div>
              <h3 class="text-subtitle-1 text-grey-darken-2">{{ card.title }}</h3>
              <div class="text-h4 font-weight-bold" :class="`text-${card.color}`">{{ card.value }}</div>
            </div>
          </div>
          <v-divider class="my-3" />
          <span class="text-caption text-grey">Última actualización: ahora</span>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estado de Proyectos y Tareas -->
    <v-row>
      <!-- Estado de los Proyectos -->
      <v-col cols="12" md="6">
        <v-card class="status-card pa-5" elevation="2" border>
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" size="28" class="mr-2">mdi-folder-multiple</v-icon>
            <h3 class="text-h6 font-weight-medium">Estado de los Proyectos</h3>
          </div>
          <v-chip-group column class="status-chips">
            <v-chip
              v-for="status in projectsByStatus"
              :key="status.statusId"
              :color="getProjectStatusColor(status.statusTitle)"
              class="ma-1"
              variant="tonal"
              size="large"
            >
              <v-icon start>mdi-circle-medium</v-icon>
              {{ status.statusTitle }} ({{ status.total }})
            </v-chip>
          </v-chip-group>
        </v-card>
      </v-col>

      <!-- Estado de las Tareas -->
      <v-col cols="12" md="6">
        <v-card class="status-card pa-5" elevation="2" border>
          <div class="d-flex align-center mb-4">
            <v-icon color="orange" size="28" class="mr-2">mdi-clipboard-list</v-icon>
            <h3 class="text-h6 font-weight-medium">Estado de las Tareas</h3>
          </div>
          <v-chip-group column class="status-chips">
            <v-chip
              v-for="status in tasksByStatus"
              :key="status.statusId"
              :color="getTaskStatusColor(status.statusTitle)"
              class="ma-1"
              variant="tonal"
              size="large"
            >
              <v-icon start>mdi-circle-medium</v-icon>
              {{ status.statusTitle }} ({{ status.total }})
            </v-chip>
          </v-chip-group>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import service from '@/services/baseService'

const loading = ref(false)

const summaryCards = ref([
  { title: 'Total Proyectos', value: 0, icon: 'mdi-folder', color: 'primary' },
  { title: 'Total Tareas', value: 0, icon: 'mdi-clipboard-list', color: 'orange' },
  { title: 'Total Usuarios', value: 0, icon: 'mdi-account', color: 'teal' },
  { title: 'Total Roles', value: 0, icon: 'mdi-account-group', color: 'indigo' },
])

const projectsByStatus = ref<any[]>([])
const tasksByStatus = ref<any[]>([])

// Colores por estado para proyectos
function getProjectStatusColor(statusTitle: string) {
  const status = statusTitle?.toLowerCase() || ''
  if (status.includes('activo') || status.includes('active')) return 'light-blue-lighten-4'
  if (status.includes('progreso') || status.includes('progress')) return 'amber-lighten-4'
  if (status.includes('completado') || status.includes('complete')) return 'light-green-lighten-4'
  if (status.includes('archivado') || status.includes('archived')) return 'indigo-lighten-4'
  if (status.includes('cancelado') || status.includes('cancelled')) return 'red-lighten-4'
  return 'blue-lighten-3'
}

// Colores por estado para tareas
function getTaskStatusColor(statusTitle: string) {
  const status = statusTitle?.toLowerCase() || ''
  if (status.includes('to do') || status.includes('pendiente')) return 'cyan-lighten-4'
  if (status.includes('progress') || status.includes('progreso')) return 'orange-lighten-4'
  if (status.includes('review') || status.includes('revisión')) return 'purple-lighten-4'
  if (status.includes('complete') || status.includes('completo')) return 'green-lighten-4'
  return 'blue-lighten-3'
}

async function fetchDashboard() {
  loading.value = true
  try {
    const data = await service.get('/app/dashboard')
    summaryCards.value[0].value = data.projects
    summaryCards.value[1].value = data.tasks
    summaryCards.value[2].value = data.users
    summaryCards.value[3].value = data.roles
    projectsByStatus.value = data.projectsByStatus
    tasksByStatus.value = data.tasksByStatus
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboard)
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  padding: 24px;
}

.summary-card {
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.status-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  height: 100%;
}

.status-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.status-chips {
  margin-top: 8px;
}

.refresh-btn {
  border-radius: 8px;
  text-transform: none;
  letter-spacing: normal;
}

.text-h4 {
  line-height: 1.2;
}

.v-icon {
  transition: transform 0.3s ease;
}

.summary-card:hover .v-icon {
  transform: scale(1.1);
}

.v-chip--size-large {
  font-weight: 500;
  min-width: 120px;
  justify-content: center;
}
</style>
