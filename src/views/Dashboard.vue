<template>
  <v-container fluid>
    <!-- Botón de refresh -->
    <v-row>
      <v-col cols="12" class="d-flex justify-end">
        <v-btn color="primary" @click="fetchDashboard" :loading="loading" prepend-icon="mdi-refresh">
          Actualizar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tarjetas resumen -->
    <v-row>
      <v-col cols="12" sm="6" md="3" v-for="card in summaryCards" :key="card.title">
        <v-card class="pa-4" elevation="5">
          <v-icon :color="card.color" size="36">{{ card.icon }}</v-icon>
          <h3 class="text-subtitle-1 mt-2">{{ card.title }}</h3>
          <div class="text-h5 font-weight-bold">{{ card.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estado de Proyectos y Tareas -->
    <v-row>
      <!-- Estado de los Proyectos -->
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="5">
          <h3 class="text-subtitle-1 mb-3">Estado de los Proyectos</h3>
          <v-chip-group column>
            <v-chip
              v-for="status in projectsByStatus"
              :key="status.statusId"
              :color="getProjectStatusColor(status.statusTitle)"
              class="ma-1"
            >
              {{ status.statusTitle }} ({{ status.total }})
            </v-chip>
          </v-chip-group>
        </v-card>
      </v-col>
      <!-- Estado de las Tareas -->
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="5">
          <h3 class="text-subtitle-1 mb-3">Estado de las Tareas</h3>
          <v-chip-group column>
            <v-chip
              v-for="status in tasksByStatus"
              :key="status.statusId"
              :color="getTaskStatusColor(status.statusTitle)"
              class="ma-1"
            >
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

function getProjectStatusColor(statusTitle: string) {
  if (!statusTitle) return 'grey'
  if (statusTitle.toLowerCase().includes('desarrollo')) return 'blue'
  if (statusTitle.toLowerCase().includes('finalizad')) return 'green'
  if (statusTitle.toLowerCase().includes('revisión')) return 'orange'
  if (statusTitle.toLowerCase().includes('pendiente')) return 'red'
  return 'grey'
}

function getTaskStatusColor(statusTitle: string) {
  if (!statusTitle) return 'grey'
  if (statusTitle.toLowerCase().includes('complet')) return 'green'
  if (statusTitle.toLowerCase().includes('en progreso')) return 'blue'
  if (statusTitle.toLowerCase().includes('pendiente')) return 'orange'
  if (statusTitle.toLowerCase().includes('bloqueada')) return 'red'
  return 'grey'
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
h3 {
  font-weight: 500;
}
</style>
