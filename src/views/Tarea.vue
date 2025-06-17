<template>
  <v-container fluid class="tasks-container">
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2 class="text-h4 font-weight-bold text-black">📝Gestión de Tareas</h2>
        <v-btn
          icon
          color="indigo-darken-3"
          @click="abrirModalNuevaTarea"
          class="shadow-lg"
          >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <div class="kanban-board">
      <div
        v-for="estado in estados"
        :key="estado.id"
        class="kanban-column"
        @drop="onDrop($event, estado.id)"
        @dragover.prevent
      >
        <div class="column-header" style="background-color: #2196F3">
          <h3 class="column-title">{{ estado.title }}</h3>
          <v-chip variant="flat" color="white" class="task-count">
            {{ tareasPorEstado(estado.id).length }}
          </v-chip>
        </div>

        <div class="tasks-scroll-container">
          <transition-group name="list" tag="div">
            <v-card
              v-for="tarea in tareasPorEstado(estado.id)"
              :key="tarea.id"
              class="task-card"
              draggable="true"
              @dragstart="onDragStart($event, tarea.id)"
              @click="editarTarea(tarea)"
              :style="{ backgroundColor: getStatusCardColor(estado.title) }"
            >
              <v-card-title class="d-flex justify-space-between align-start task-title">
                <span class="text-body-1 font-weight-medium">{{ tarea.title }}</span>
                <v-chip
                  size="small"
                  :color="getPriorityColor(tarea.priorityId)"
                  class="ml-2"
                  text-color="white"
                >
                  {{ obtenerNombrePrioridad(tarea.priorityId) }}
                </v-chip>
              </v-card-title>
              <v-card-text class="task-content">
                <div class="text-caption task-description">{{ tarea.description }}</div>
                <div class="task-meta">
                  <div class="d-flex align-center mt-2">
                    <v-avatar size="24" :color="getUserColor(tarea.userId)" class="mr-2">
                      <span class="text-caption text-white">{{ getUserInitials(tarea.userId) }}</span>
                    </v-avatar>
                    <span class="text-caption">{{ obtenerNombreUsuario(tarea.userId) }}</span>
                  </div>
                  <div class="d-flex align-center mt-1">
                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                    <span class="text-caption" :class="{ 'text-red-darken-2': isOverdue(tarea.dueDate) }">
                      {{ formatearFecha(tarea.dueDate) }}
                      <span v-if="isOverdue(tarea.dueDate)" class="text-caption font-weight-bold">(Atrasada)</span>
                    </span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </transition-group>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar tarea -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card class="rounded-xl">
        <v-toolbar :color="editando ? 'blue-darken-2' : 'indigo-darken-3'" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon left>{{ editando ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            {{ editando ? 'Editar Tarea' : 'Crear Tarea' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="cerrarModal" variant="text" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <v-text-field
            v-model="tareaForm.title"
            label="Título"
            class="mb-4"
            variant="outlined"
            :rules="[required]"
            color="indigo-darken-3"
          />
          <v-textarea
            v-model="tareaForm.description"
            label="Descripción"
            class="mb-4"
            variant="outlined"
            rows="3"
            auto-grow
            color="indigo-darken-3"
          />
          <v-select
            v-model="tareaForm.userId"
            :items="usuarios"
            item-value="id"
            item-title="name"
            label="Encargado"
            class="mb-4"
            variant="outlined"
            :rules="[required]"
            color="indigo-darken-3"
            :menu-props="{ maxHeight: 200 }"
          />
          <v-select
            v-model="tareaForm.priorityId"
            :items="prioridades"
            item-value="id"
            item-title="title"
            label="Prioridad"
            class="mb-4"
            variant="outlined"
            :rules="[required]"
            color="indigo-darken-3"
            :menu-props="{ maxHeight: 200 }"
          />
          <v-select
            v-model="tareaForm.projectId"
            :items="proyectos"
            item-value="id"
            item-title="title"
            label="Proyecto"
            class="mb-4"
            variant="outlined"
            :rules="[required]"
            color="indigo-darken-3"
            :menu-props="{ maxHeight: 200 }"
          />
          <v-select
            v-model="tareaForm.statusId"
            :items="estados"
            item-value="id"
            item-title="title"
            label="Estado"
            class="mb-4"
            variant="outlined"
            :rules="[required]"
            color="indigo-darken-3"
            :menu-props="{ maxHeight: 200 }"
          />
          <v-text-field
            v-model="tareaForm.dueDate"
            label="Fecha límite"
            type="date"
            variant="outlined"
            :rules="[required]"
            :min="new Date().toISOString().split('T')[0]"
            color="indigo-darken-3"
          />
        </v-card-text>

        <v-card-actions class="pa-4 bg-indigo-lighten-5">
          <v-spacer></v-spacer>
          <v-btn
            v-if="editando"
            color="red-darken-2"
            variant="tonal"
            @click="confirmarEliminar"
            prepend-icon="mdi-delete"
          >
            Eliminar
          </v-btn>
          <v-btn
            color="indigo-darken-3"
            @click="guardarTarea"
            variant="elevated"
            :prepend-icon="editando ? 'mdi-content-save' : 'mdi-plus'"
          >
            {{ editando ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="3000"
      :color="snackbar.color"
      location="bottom right"
      rounded="pill"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ snackbar.icon }}</v-icon>
        {{ snackbar.message }}
      </div>
    </v-snackbar>

    <!-- Dialogo de confirmación para eliminar -->
    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card class="rounded-lg">
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro que deseas eliminar la tarea "<strong>{{ tareaForm.title }}</strong>"?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="confirmDialog = false">Cancelar</v-btn>
          <v-btn color="red-darken-2" variant="elevated" @click="eliminarTarea">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import service from '@/services/baseService'

interface Tarea {
  id: number
  title: string
  description: string
  userId: number | null
  statusId: number | null
  priorityId: number | null
  dueDate: string
  projectId: number | null
}

interface Estado { id: number; title: string }
interface Usuario { id: number; firstName: string; lastName: string; name?: string }
interface Prioridad { id: number; title: string; type: string }
interface Proyecto { id: number; title: string }

const tareas = ref<Tarea[]>([])
const estados = ref<Estado[]>([])
const usuarios = ref<Usuario[]>([])
const prioridades = ref<Prioridad[]>([])
const proyectos = ref<Proyecto[]>([])

const dialog = ref(false)
const editando = ref(false)
const confirmDialog = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  icon: 'mdi-check'
})

const tareaForm = ref<Tarea>({
  id: 0,
  title: '',
  description: '',
  userId: null,
  statusId: null,
  priorityId: null,
  dueDate: new Date().toISOString().split('T')[0],
  projectId: null
})

const userColors = [
  '#2196F3', // Azul
  '#009688', // Verde agua
  '#3F51B5', // Índigo
  '#00BCD4', // Cyan
  '#8BC34A'  // Verde lima
]

async function cargarDatos() {
  try {
    const [tasks, users, prios, stats, proys] = await Promise.all([
      service.index<Tarea[]>('/tasks'),
      service.index<Usuario[]>('/users'),
      service.index<Prioridad[]>('/priorities'),
      service.index<Estado[]>('/statuses', { type: 'task' }),
      service.index<Proyecto[]>('/projects')
    ])

    tareas.value = tasks
    usuarios.value = users.map(u => ({ ...u, name: `${u.firstName} ${u.lastName}` }))
    prioridades.value = prios.filter(p => p.type === 'task')
    estados.value = stats
    proyectos.value = proys
  } catch {
    tareas.value = []
  }
}

onMounted(cargarDatos)
function tareasPorEstado(id: number) {
  return tareas.value
    .filter(t => t.statusId === id)
    .sort((a, b) => {
      // Manejar casos donde priorityId podría ser null
      const aPriority = a.priorityId || 0
      const bPriority = b.priorityId || 0
      return aPriority - bPriority
    })
}

function formatearFecha(fecha: string) {
  if (!fecha) return ''
  const [anio, mes, dia] = fecha.split('T')[0].split('-')
  return `${dia}/${mes}/${anio}`
}

function obtenerNombreUsuario(id: number | null): string {
  if (!id) return 'Sin asignar'
  const user = usuarios.value.find(u => u.id === id)
  return user ? `${user.firstName} ${user.lastName}` : `Usuario ${id}`
}

function getUserInitials(id: number | null): string {
  if (!id) return '?'
  const user = usuarios.value.find(u => u.id === id)
  if (!user) return '?'
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
}

function getUserColor(id: number | null): string {
  if (!id) return '#9E9E9E' // Gris para usuarios no asignados
  return userColors[id % userColors.length]
}

function obtenerNombrePrioridad(id: number | null): string {
  if (!id) return 'Sin prioridad'
  return prioridades.value.find(p => p.id === id)?.title || `Prioridad ${id}`
}
function getPriorityColor(priorityId: number | null): string {
  if (!priorityId) return '#9E9E9E' // Gris para prioridad no asignada

  const priorityColors: Record<number, string> = {
    1: '#F44336', // Urgente - Rojo
    2: '#FF9800', // Alta - Naranja
    3: '#FFC107', // Media - Amarillo
    4: '#4CAF50'  // Baja - Verde
  }
  return priorityColors[priorityId] || '#9E9E9E'
}

function getStatusCardColor(statusTitle: string) {
  return '#FFFFFF' // Blanco puro
}

function isOverdue(dueDate: string) {
  if (!dueDate) return false
  const today = new Date().toISOString().split('T')[0]
  return dueDate < today
}

function onDragStart(e: DragEvent, id: number) {
  e.dataTransfer?.setData('text/plain', id.toString())
}

function onDrop(e: DragEvent, estado: number) {
  const id = parseInt(e.dataTransfer?.getData('text/plain') || '')
  const tarea = tareas.value.find(t => t.id === id)
  if (tarea) {
    tarea.statusId = estado
    service.update('/tasks', id, { statusId: estado })
    showSnackbar('success', 'Estado actualizado', 'mdi-check-circle')
  }
}

function abrirModalNuevaTarea() {
  tareaForm.value = {
    id: 0,
    title: '',
    description: '',
    userId: null,
    statusId: estados.value[0]?.id || null,
    priorityId: null,
    dueDate: new Date().toISOString().split('T')[0],
    projectId: null
  }
  editando.value = false
  dialog.value = true
}

function editarTarea(tarea: Tarea) {
  tareaForm.value = { ...tarea, dueDate: tarea.dueDate.split('T')[0] }
  editando.value = true
  dialog.value = true
}

function cerrarModal() {
  dialog.value = false
}

function required(v: any) {
  return !!v || 'Campo requerido'
}

async function guardarTarea() {
  // Validar que todos los campos requeridos estén completos
  if (!tareaForm.value.title ||
      !tareaForm.value.userId ||
      !tareaForm.value.priorityId ||
      !tareaForm.value.projectId ||
      !tareaForm.value.statusId ||
      !tareaForm.value.dueDate) {
    showSnackbar('error', 'Por favor complete todos los campos requeridos', 'mdi-alert-circle')
    return
  }

  const data = { ...tareaForm.value }

  try {
    if (editando.value) {
      await service.update('/tasks', data.id, data)
      const idx = tareas.value.findIndex(t => t.id === data.id)
      if (idx !== -1) tareas.value[idx] = { ...data }
      showSnackbar('success', 'Tarea actualizada con éxito', 'mdi-check-circle')
    } else {
      const nueva = await service.store<Tarea>('/tasks', data)
      tareas.value.push(nueva)
      showSnackbar('success', 'Tarea creada con éxito', 'mdi-check-circle')
    }
    cerrarModal()
  } catch (err) {
    console.error('Error al guardar tarea', err)
    showSnackbar('error', 'Error al guardar la tarea', 'mdi-alert-circle')
  }
}

function confirmarEliminar() {
  confirmDialog.value = true
}

async function eliminarTarea() {
  try {
    await service.delete('/tasks', tareaForm.value.id.toString())
    tareas.value = tareas.value.filter(t => t.id !== tareaForm.value.id)
    confirmDialog.value = false
    dialog.value = false
    showSnackbar('success', 'Tarea eliminada con éxito', 'mdi-check-circle')
  } catch (err) {
    console.error('Error al eliminar', err)
    showSnackbar('error', 'No se pudo eliminar la tarea', 'mdi-alert-circle')
  }
}

function showSnackbar(color: string, message: string, icon: string) {
  snackbar.value = {
    show: true,
    message,
    color,
    icon
  }
}
</script>

<style scoped>
.tasks-container {
  padding: 20px;
  max-width: 100%;
}

.kanban-board {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
}

.kanban-column {
  min-width: 300px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.column-header {
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-title {
  color: white;
  font-weight: 500;
  margin: 0;
}

.task-count {
  font-weight: bold;
}

.tasks-scroll-container {
  padding: 8px;
  flex-grow: 1;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.task-card {
  margin-bottom: 8px;
  cursor: grab;
  transition: transform 0.2s;
}

.task-card:active {
  cursor: grabbing;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-title {
  padding: 12px 16px 0;
}

.task-content {
  padding: 0 16px 12px;
}

.task-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-meta {
  margin-top: 8px;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
