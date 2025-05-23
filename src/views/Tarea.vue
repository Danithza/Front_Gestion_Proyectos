<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2 class="text-h5 font-weight-bold">Gestión de Tareas</h2>
        <AgregarTareaDialog @tarea-creada="agregarTarea" />
      </v-col>
    </v-row>

    <!-- Columnas estilo Trello -->
    <div class="d-flex justify-space-between align-start flex-wrap">
      <div
        v-for="estado in estados"
        :key="estado"
        class="columna-trello"
        @drop="onDrop($event, estado)"
        @dragover.prevent
      >
        <h3 class="titulo-columna">{{ estado }}</h3>

        <transition-group name="fade" tag="div">
          <v-card
            v-for="tarea in tareasPorEstado(estado)"
            :key="tarea.id"
            class="mb-3 tarea-card"
            draggable="true"
            @dragstart="onDragStart($event, tarea.id)"
            @click="abrirEditor(tarea)"
            :style="{ backgroundColor: coloresEstado[tarea.estado], borderLeftColor: coloresEstado[tarea.estado] }"
          >
            <v-card-title class="justify-space-between">
              <span>{{ tarea.titulo }}</span>
              <v-chip
                size="small"
                :color="colorPrioridad(tarea.prioridad)"
                text-color="white"
              >
                {{ tarea.prioridad }}
              </v-chip>
            </v-card-title>
            <v-card-subtitle class="text-body-2">
              {{ tarea.descripcion }}
            </v-card-subtitle>
            <v-card-text class="text-caption">👤 {{ tarea.encargado }}</v-card-text>
          </v-card>
        </transition-group>
      </div>
    </div>

    <!-- Diálogo para editar -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          Editar Tarea
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="tareaEditando.titulo" label="Título" />
          <v-textarea v-model="tareaEditando.descripcion" label="Descripción" />
          <v-text-field v-model="tareaEditando.encargado" label="Encargado" />
          <v-select
            v-model="tareaEditando.prioridad"
            :items="['Alta', 'Media', 'Baja']"
            label="Prioridad"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="eliminarTarea(tareaEditando.id)">
            Eliminar
          </v-btn>
          <v-spacer />
          <v-btn color="primary" @click="guardarCambios">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import AgregarTareaDialog from '@/components/AgregarTarea.vue'

interface Tarea {
  id: number
  titulo: string
  descripcion: string
  encargado: string
  estado: string
  prioridad: string
}

const tareas = ref<Tarea[]>([])
const estados = ['Por hacer', 'En proceso', 'Hecho', 'Historial']

const coloresEstado: Record<string, string> = {
  'Por hacer': '#bbdefb',    // azul claro
  'En proceso': '#fff9c4',  // amarillo claro
  'Hecho': '#c8e6c9',       // verde claro
  'Historial': '#eeeeee',   // gris claro
}

onMounted(() => {
  const guardadas = localStorage.getItem('tareas')
  if (guardadas) tareas.value = JSON.parse(guardadas)
})

watch(tareas, (nuevas) => {
  localStorage.setItem('tareas', JSON.stringify(nuevas))
}, { deep: true })

function tareasPorEstado(estado: string): Tarea[] {
  return tareas.value
    .filter((t) => t.estado === estado)
    .sort((a, b) => prioridadOrden(b.prioridad) - prioridadOrden(a.prioridad))
}

function prioridadOrden(prio: string): number {
  return prio === 'Alta' ? 3 : prio === 'Media' ? 2 : 1
}

function colorPrioridad(prio: string): string {
  return prio === 'Alta' ? 'red' : prio === 'Media' ? 'orange' : 'green'
}

function onDragStart(event: DragEvent, id: number) {
  event.dataTransfer?.setData('text/plain', id.toString())
}

function onDrop(event: DragEvent, nuevoEstado: string) {
  const id = parseInt(event.dataTransfer?.getData('text/plain') || '')
  const tarea = tareas.value.find((t) => t.id === id)
  if (tarea) {
    tarea.estado = nuevoEstado
  }
}

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
  const index = tareas.value.findIndex((t) => t.id === tareaEditando.value.id)
  if (index !== -1) tareas.value[index] = { ...tareaEditando.value }
  dialog.value = false
}

function eliminarTarea(id: number) {
  tareas.value = tareas.value.filter((t) => t.id !== id)
  dialog.value = false
}

function agregarTarea(nueva: Tarea) {
  tareas.value.push(nueva)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.columna-trello {
  flex: 1;
  min-width: 250px;
  max-width: 280px;
  height: 720px;
  background-color: #e0f2f1;
  border: 2px solid #80cbc4;
  border-radius: 12px;
  padding: 16px;
  margin: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
}

.titulo-columna {
  color: #004d40;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  background-color: #b2dfdb;
  padding: 8px;
  border-radius: 8px;
}

.tarea-card {
  background-color: #ffffff;
  border-left: 5px solid #00796b;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.07);
}
</style>
