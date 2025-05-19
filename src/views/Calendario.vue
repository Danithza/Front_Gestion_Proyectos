<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <span class="text-h6">📅 Calendario de Tareas</span>
        <v-spacer />
        <v-btn icon @click="prev">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon @click="next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-calendar
          v-model="current"
          type="month"
          :events="events"
          color="primary"
          event-color="green"
          @click:date="onDateClick"
        />
      </v-card-text>
    </v-card>

    <!-- Diálogo para agregar evento -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>Agregar Tarea</v-card-title>
        <v-card-text>
          <v-text-field label="Nombre de la tarea" v-model="newEvent.title" />
          <v-text-field label="Fecha límite (YYYY-MM-DD)" v-model="newEvent.dueDate" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" text @click="saveEvent">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para notificación -->
    <v-snackbar v-model="showNotification" color="red-darken-1" timeout="4000">
      🔔 La tarea "{{ upcomingTaskTitle }}" vence pronto.
      <template v-slot:actions>
        <v-btn icon @click="showNotification = false"><v-icon>mdi-close</v-icon></v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

interface Event {
  name: string
  start: string
  color?: string
}

const current = ref(new Date().toISOString().substring(0, 10))
const events = ref<Event[]>([])

const dialog = ref(false)
const selectedDate = ref('')
const newEvent = ref({ title: '', dueDate: '' })

const showNotification = ref(false)
const upcomingTaskTitle = ref('')

const onDateClick = (e: { date: string }) => {
  selectedDate.value = e.date
  newEvent.value = { title: '', dueDate: e.date }
  dialog.value = true
}

const saveEvent = () => {
  if (newEvent.value.title && newEvent.value.dueDate) {
    events.value.push({
      name: newEvent.value.title,
      start: newEvent.value.dueDate,
      color: 'green',
    })
    dialog.value = false
  }
}

// Mover a mes siguiente/anterior
const next = () => {
  const date = new Date(current.value)
  date.setMonth(date.getMonth() + 1)
  current.value = date.toISOString().substring(0, 10)
}

const prev = () => {
  const date = new Date(current.value)
  date.setMonth(date.getMonth() - 1)
  current.value = date.toISOString().substring(0, 10)
}

// Notificar si hay tareas próximas (mañana)
watch(events, () => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const formattedTomorrow = tomorrow.toISOString().substring(0, 10)

  const upcoming = events.value.find(e => e.start === formattedTomorrow)
  if (upcoming) {
    upcomingTaskTitle.value = upcoming.name
    showNotification.value = true
  }
})
</script>
