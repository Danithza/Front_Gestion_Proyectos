<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()

const newTask = ref({
  title: '',
  date: '',
  type: '',
  priority: 'media'
})

function addTask() {
  store.addTask({ ...newTask.value, id: Date.now() })
  newTask.value = { title: '', date: '', type: '', priority: 'media' }
}
</script>

<template>
  <v-container>
    <v-form @submit.prevent="addTask">
      <v-text-field v-model="newTask.title" label="Título" />
      <v-text-field v-model="newTask.type" label="Tipo" />
      <v-select
        v-model="newTask.priority"
        :items="['alta', 'media', 'baja']"
        label="Prioridad"
      />
      <v-text-field v-model="newTask.date" label="Fecha (YYYY-MM-DD)" />
      <v-btn type="submit" color="primary">Agregar tarea</v-btn>
    </v-form>
  </v-container>
</template>
