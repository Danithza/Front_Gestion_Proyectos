<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center mb-4">
        <h2>Gestión de Tareas</h2>
        <v-btn color="primary" @click="agregarTarea">Agregar tarea</v-btn>
      </v-col>
    </v-row>

    <!-- Listas horizontales con scroll -->
    <div
      class="d-flex"
      style="overflow-x: auto; gap: 16px; padding: 8px; min-height: 400px;"
    >
      <div
        v-for="estado in estados"
        :key="estado"
        style="min-width: 280px; max-width: 300px; background-color: #f4f4f4; border-radius: 8px; padding: 12px; flex-shrink: 0;"
        @drop="onDrop($event, estado)"
        @dragover.prevent
      >
        <h3>{{ estado }}</h3>
        <v-card
          v-for="tarea in tareasPorEstado(estado)"
          :key="tarea.id"
          class="mb-2"
          draggable="true"
          @dragstart="onDragStart($event, tarea.id)"
          @click="abrirEditor(tarea)"
          style="cursor: pointer;"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ tarea.titulo }}</span>
            <v-chip
              size="x-small"
              :color="colorPrioridad(tarea.prioridad)"
              text-color="white"
            >
              {{ tarea.prioridad }}
            </v-chip>
          </v-card-title>
          <v-card-subtitle>{{ tarea.descripcion }}</v-card-subtitle>
          <v-card-text>Encargado: {{ tarea.encargado }}</v-card-text>
        </v-card>
      </div>
    </div>

    <!-- Modal para editar tarea -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          Editar Tarea
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-text-field label="Título" v-model="tareaEditando.titulo" />
          <v-textarea label="Descripción" v-model="tareaEditando.descripcion" />
          <v-text-field label="Encargado" v-model="tareaEditando.encargado" />
          <v-select
            label="Prioridad"
            :items="['Alta', 'Media', 'Baja']"
            v-model="tareaEditando.prioridad"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" @click="eliminarTarea(tareaEditando.id)">Eliminar</v-btn>
          <v-spacer />
          <v-btn color="primary" @click="guardarCambios">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Tarea {
  id: number
  titulo: string
  descripcion: string
  encargado: string
  estado: string
  prioridad: string
}

const tareas = ref<Tarea[]>([
  {
    id: 1,
    titulo: 'Diseñar logo',
    descripcion: 'Crear logo para cliente X',
    encargado: 'Ana',
    estado: 'Por hacer',
    prioridad: 'Alta',
  },
  {
    id: 2,
    titulo: 'Revisar contrato',
    descripcion: 'Revisar términos con abogado',
    encargado: 'Luis',
    estado: 'En proceso',
    prioridad: 'Media',
  },
])

const estados = ['Por hacer', 'En proceso', 'Hecho']

function tareasPorEstado(estado: string): Tarea[] {
  return tareas.value
    .filter((t) => t.estado === estado)
    .sort((a, b) => prioridadOrden(b.prioridad) - prioridadOrden(a.prioridad))
}

function prioridadOrden(prio: string): number {
  switch (prio) {
    case 'Alta': return 3
    case 'Media': return 2
    case 'Baja': return 1
    default: return 0
  }
}

function colorPrioridad(prio: string): string {
  switch (prio) {
    case 'Alta': return 'red'
    case 'Media': return 'orange'
    case 'Baja': return 'green'
    default: return 'grey'
  }
}

function onDragStart(event: DragEvent, id: number) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', id.toString())
  }
}

function onDrop(event: DragEvent, nuevoEstado: string) {
  const idStr = event.dataTransfer?.getData('text/plain')
  const id = parseInt(idStr || '')
  const tarea = tareas.value.find((t) => t.id === id)
  if (tarea) {
    tarea.estado = nuevoEstado
  }
}

function agregarTarea() {
  const nueva: Tarea = {
    id: Date.now(),
    titulo: 'Nueva tarea',
    descripcion: 'Descripción...',
    encargado: 'Sin asignar',
    estado: 'Por hacer',
    prioridad: 'Media',
  }
  tareas.value.push(nueva)
}

// Modal
const dialog = ref(false)
const tareaEditando = ref<Tarea>({
  id: 0,
  titulo: '',
  descripcion: '',
  encargado: '',
  estado: '',
  prioridad: 'Media',
})

function abrirEditor(tarea: Tarea) {
  tareaEditando.value = { ...tarea }
  dialog.value = true
}

function guardarCambios() {
  const idx = tareas.value.findIndex((t) => t.id === tareaEditando.value.id)
  if (idx !== -1) tareas.value[idx] = { ...tareaEditando.value }
  dialog.value = false
}

function eliminarTarea(id: number) {
  tareas.value = tareas.value.filter((t) => t.id !== id)
  dialog.value = false
}
</script>
