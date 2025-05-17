<template>
  <v-container>
    <v-card>
      <v-card-title>
        Calendario de Eventos
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
          :events="events"
          color="primary"
          type="month"
          event-color="green"
          @click:date="onDateClick"
        />
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>Agregar Evento</v-card-title>
        <v-card-text>
          <v-text-field label="Título del evento" v-model="newEvent.title" />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn text @click="saveEvent">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Event {
  name: string
  start: string
  end?: string
  color?: string
}

const current = ref(new Date().toISOString().substring(0, 10))
const events = ref<Event[]>([])

const dialog = ref(false)
const selectedDate = ref('')
const newEvent = ref({ title: '' })

const onDateClick = (e: { date: string }) => {
  selectedDate.value = e.date
  newEvent.value.title = ''
  dialog.value = true
}

const saveEvent = () => {
  if (newEvent.value.title && selectedDate.value) {
    events.value.push({
      name: newEvent.value.title,
      start: selectedDate.value,
      color: 'green',
    })
  }
  dialog.value = false
}

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
</script>
