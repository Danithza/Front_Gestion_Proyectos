<template>
  <v-app>
    <Sidebar />

    <v-main>
      <v-container fluid>
        <!-- Tarjetas resumen -->
        <v-row>
          <v-col cols="12" md="3" v-for="(card, index) in summaryCards" :key="index">
            <v-card class="pa-4" color="primary" dark>
              <div class="text-subtitle-2">{{ card.label }}</div>
              <div class="text-h5 font-weight-bold">{{ card.value }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Sección de análisis -->
        <v-row>
          <!-- Causas de Paros -->
          <v-col cols="12" md="6">
            <v-card class="pa-4">
              <div class="text-subtitle-1 font-weight-medium mb-2">Causas de Paros</div>
              <v-chip class="ma-1" color="blue lighten-4" text-color="blue darken-2">25%</v-chip>
              <v-chip class="ma-1" color="blue lighten-4" text-color="blue darken-2">35%</v-chip>
              <v-chip class="ma-1" color="blue lighten-4" text-color="blue darken-2">15%</v-chip>
            </v-card>
          </v-col>

          <!-- Producción por trimestre -->
          <v-col cols="12" md="6">
            <v-card class="pa-4">
              <div class="text-subtitle-1 font-weight-medium mb-2">Producción por Trimestre</div>
              <v-progress-linear v-model="progress1" color="blue" height="12" class="mb-2" />
              <v-progress-linear v-model="progress2" color="blue" height="12" class="mb-2" />
              <v-progress-linear v-model="progress3" color="blue" height="12" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

const summaryCards = [
  { label: 'Volumen de Producción', value: '10.431' },
  { label: 'Órdenes Generadas', value: '7.061' },
  { label: 'Ingresos Totales', value: '$291.009' },
  { label: 'Costos Producción', value: '$137.061' },
]

const progress1 = ref(60)
const progress2 = ref(75)
const progress3 = ref(25)
</script>
