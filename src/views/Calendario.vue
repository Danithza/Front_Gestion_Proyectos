<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  startOfMonth,
  endOfMonth,
  addDays,
  addMonths,
  subMonths,
  startOfWeek,
  format,
} from 'date-fns'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
const currentDate = ref(new Date())

const goToPreviousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
}

const goToNextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
}

// Generar los días del calendario (6 filas x 7 columnas)
const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentDate.value), { weekStartsOn: 0 }) // Domingo
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
})

const formattedMonthYear = computed(() => {
  return format(currentDate.value, 'MMMM yyyy')
})

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'alta': return 'pink-lighten-4'
    case 'media': return 'indigo-lighten-4'
    case 'baja': return 'blue-lighten-4'
    default: return 'grey-lighten-2'
  }
}
</script>

<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <v-btn icon @click="goToPreviousMonth">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <span class="text-h6 font-weight-bold">
              {{ formattedMonthYear }}
            </span>
            <v-btn icon @click="goToNextMonth">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <!-- Encabezado de días de la semana -->
          <v-row class="text-center font-weight-bold py-2" no-gutters>
            <v-col
              v-for="day in weekDays"
              :key="day"
              class="text-grey-darken-1"
            >
              {{ day }}
            </v-col>
          </v-row>

          <!-- Celdas del calendario -->
          <v-row no-gutters>
            <v-col
              v-for="day in calendarDays"
              :key="day.toString()"
              cols="12"
              sm="1"
              class="pa-1"
            >
              <v-sheet
                class="pa-2 rounded-xl"
                color="grey-lighten-5"
                height="120"
                elevation="1"
              >
                <div class="text-caption text-grey-darken-2 font-weight-medium">
                  {{ format(day, 'd') }}
                </div>

                <!-- Tareas del día -->
                <v-chip
                  v-for="task in store.getTasksByDate(format(day, 'yyyy-MM-dd'))"
                  :key="task.id"
                  :color="getPriorityColor(task.priority)"
                  size="x-small"
                  class="ma-1"
                  label
                >
                  {{ task.title }}
                </v-chip>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
