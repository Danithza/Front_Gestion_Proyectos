<template>
  <v-container fluid>
    <!-- Resumen general -->
    <v-row>
      <v-col cols="12" sm="6" md="3" v-for="card in summaryCards" :key="card.title">
        <v-card class="pa-4" elevation="5">
          <v-icon :color="card.color" size="36">{{ card.icon }}</v-icon>
          <h3 class="text-subtitle-1 mt-2">{{ card.title }}</h3>
          <div class="text-h5 font-weight-bold">{{ card.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sección de estado de tareas y proyectos -->
    <v-row>
      <!-- Progreso de Tareas -->
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="5">
          <h3 class="text-subtitle-1 mb-3">Progreso de Tareas</h3>
          <v-progress-linear
            color="primary"
            height="46"
            :model-value="75"
            striped
            rounded
          >
            <strong>75% Completadas</strong>
          </v-progress-linear>
        </v-card>
      </v-col>

      <!-- Estado de los Proyectos -->
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="5">
          <h3 class="text-subtitle-1 mb-3">Estado de los Proyectos</h3>
          <v-chip-group column>
            <v-chip color="blue" class="ma-1">En desarrollo (4)</v-chip>
            <v-chip color="green" class="ma-1">Finalizados (6)</v-chip>
            <v-chip color="orange" class="ma-1">En revisión (2)</v-chip>
          </v-chip-group>
        </v-card>
      </v-col>
    </v-row>

    <!-- Roles y Configuración -->
    <v-row>
      <!-- Roles del sistema -->
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="5">
          <h3 class="text-subtitle-1 mb-3">Roles del sistema</h3>
          <v-list density="compact">
            <v-list-item v-for="role in roles" :key="role.name">
              <v-list-item-title>{{ role.name }}</v-list-item-title>
              <v-chip size="small" :color="role.color">{{ role.users }} usuarios</v-chip>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Configuración activa -->
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="5">
          <h3 class="text-subtitle-1 mb-3">Configuraciones activas</h3>
          <v-list density="compact">
            <v-list-item v-for="setting in settings" :key="setting.label">
              <v-list-item-title>{{ setting.label }}</v-list-item-title>
              <v-icon :color="setting.enabled ? 'green' : 'red'">{{ setting.enabled ? 'mdi-check-circle' : 'mdi-cancel' }}</v-icon>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Información simulada que luego puedes reemplazar por datos reales
const summaryCards = [
  { title: 'Proyectos Activos', value: 12, icon: 'mdi-folder', color: 'primary' },
  { title: 'Tareas Pendientes', value: 34, icon: 'mdi-clipboard-list', color: 'orange' },
  { title: 'Roles del Sistema', value: 5, icon: 'mdi-account-group', color: 'indigo' },
  { title: 'Config. Activas', value: 3, icon: 'mdi-cog-outline', color: 'green' },
]

const roles = [
  { name: 'Administrador', users: 2, color: 'red' },
  { name: 'Gestor de Proyecto', users: 5, color: 'blue' },
  { name: 'Desarrollador', users: 10, color: 'green' },
]

const settings = [
  { label: 'Notificaciones', enabled: true },
  { label: 'Modo oscuro', enabled: false },
  { label: 'Tareas automáticas', enabled: true },
]
</script>

<style scoped>
h3 {
  font-weight: 500;
}
</style>
