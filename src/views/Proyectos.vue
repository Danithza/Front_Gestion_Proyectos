<template>
  <v-container fluid class="projects-container">
    <!-- Encabezado -->
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2 class="text-h4 font-weight-bold text-black">🗂️Gestión de Proyectos</h2>
        <v-btn
         icon
         color="indigo-darken-3"
         @click="abrirModalNuevoProyecto"
         class="shadow-lg"
         v-if="authStore.hasPermission('project:create')"
       >
         <v-icon>mdi-plus</v-icon>
       </v-btn>
      </v-col>
    </v-row>

    <!-- Mostrar mensaje de error si falla la carga -->
    <v-alert v-if="errorCarga" type="error" class="mb-4">
      Error al cargar los datos: {{ errorCarga }}
      <v-btn small @click="cargarDatos" class="ml-2">Reintentar</v-btn>
    </v-alert>

    <!-- Mostrar esqueleto de carga mientras se obtienen datos -->
    <v-skeleton-loader
      v-else-if="cargando"
      type="card, card, card"
      class="mb-4"
    ></v-skeleton-loader>

    <!-- Vista Kanban cuando los datos están cargados -->
    <div v-else class="kanban-board">
      <div
        v-for="estado in estados"
        :key="estado.id"
        class="kanban-column"
        @drop="onDrop($event, estado.id)"
        @dragover.prevent
      >
        <div class="column-header" :style="{ backgroundColor: getStatusColor(estado.title) }">
          <h3 class="column-title">{{ estado.title }}</h3>
          <v-chip variant="flat" color="white" class="task-count">
            {{ proyectosPorEstado(estado.id).length }}
          </v-chip>
        </div>

        <div class="tasks-scroll-container">
          <transition-group name="list" tag="div">
            <v-card
              v-for="proyecto in proyectosPorEstado(estado.id)"
              :key="proyecto.id"
              class="task-card"
              draggable="true"
              @dragstart="onDragStart($event, proyecto.id)"
              @click="editarProyecto(proyecto)"
              :style="{ backgroundColor: '#FFFFFF' }"
            >
              <v-card-title class="d-flex justify-space-between align-start task-title">
                <span class="text-body-1 font-weight-medium">{{ proyecto.title }}</span>
                <v-chip
                  size="small"
                  color="indigo-darken-3"
                  class="ml-2"
                  text-color="white"
                  v-if="proyecto.clientId"
                >
                  {{ obtenerNombreCliente(proyecto.clientId) }}
                </v-chip>
              </v-card-title>
              <v-card-text class="task-content">
                <div class="text-caption task-description">{{ proyecto.description }}</div>
                <div class="task-meta">
                  <div class="d-flex align-center mt-2">
                    <v-avatar size="24" :color="getUserColor(proyecto.userId)" class="mr-2">
                      <span class="text-caption text-white">{{ getUserInitials(proyecto.userId) }}</span>
                    </v-avatar>
                    <span class="text-caption">{{ obtenerNombreUsuario(proyecto.userId) }}</span>
                  </div>
                  <div class="d-flex align-center mt-1">
                    <v-icon size="small" class="mr-1">mdi-calendar-start</v-icon>
                    <span class="text-caption">{{ formatearFecha(proyecto.startDate) }}</span>
                  </div>
                  <div class="d-flex align-center mt-1">
                    <v-icon size="small" class="mr-1">mdi-calendar-end</v-icon>
                    <span class="text-caption" :class="{ 'text-red-darken-2': isOverdue(proyecto.endDate) }">
                      {{ formatearFecha(proyecto.endDate) }}
                      <span v-if="isOverdue(proyecto.endDate)" class="text-caption font-weight-bold">(Atrasado)</span>
                    </span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </transition-group>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar proyecto -->
    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card class="rounded-xl">
        <v-toolbar :color="editando ? 'blue-darken-2' : 'indigo-darken-3'" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon left>{{ editando ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            {{ editando ? 'Editar Proyecto' : 'Crear Proyecto' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="cerrarModal" variant="text" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <v-text-field
            v-model="proyectoForm.title"
            label="Título"
            class="mb-4"
            variant="outlined"
            :rules="[required]"
            color="indigo-darken-3"
          />
          <v-textarea
            v-model="proyectoForm.description"
            label="Descripción"
            class="mb-4"
            variant="outlined"
            rows="3"
            auto-grow
            color="indigo-darken-3"
          />
          <v-select
            v-model="proyectoForm.userId"
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
            v-model="proyectoForm.clientId"
            :items="usuarios"
            item-value="id"
            item-title="name"
            label="Cliente"
            class="mb-4"
            variant="outlined"
            :rules="[required]"
            color="indigo-darken-3"
            :menu-props="{ maxHeight: 200 }"
          />
          <v-select
            v-model="proyectoForm.statusId"
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
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="proyectoForm.startDate"
                label="Fecha de inicio"
                type="date"
                variant="outlined"
                :rules="[required]"
                color="indigo-darken-3"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="proyectoForm.endDate"
                label="Fecha de fin"
                type="date"
                variant="outlined"
                :rules="[required, val => val >= proyectoForm.startDate || 'Debe ser posterior a fecha de inicio']"
                :min="proyectoForm.startDate"
                color="indigo-darken-3"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4 bg-indigo-lighten-5">
          <v-spacer></v-spacer>
          <v-btn
            v-if="editando && authStore.hasPermission('project:delete')"
            color="red-darken-2"
            variant="tonal"
            @click="confirmarEliminar"
            prepend-icon="mdi-delete"
          >
            Eliminar
          </v-btn>
          <v-btn
            color="indigo-darken-3"
            @click="guardarProyecto"
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
          ¿Estás seguro que deseas eliminar el proyecto "<strong>{{ proyectoForm.title }}</strong>"?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="confirmDialog = false">Cancelar</v-btn>
          <v-btn color="red-darken-2" variant="elevated" @click="eliminarProyecto">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import service from '@/services/baseService'
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

interface Proyecto {
  id: number
  title: string
  description: string
  userId: number | null
  statusId: number | null
  clientId: number | null
  startDate: string
  endDate: string
}

interface Estado { id: number; title: string }
interface Usuario { id: number; firstName: string; lastName: string; name?: string }

const proyectos = ref<Proyecto[]>([])
const estados = ref<Estado[]>([])
const usuarios = ref<Usuario[]>([])
const cargando = ref(true)
const errorCarga = ref<string | null>(null)
const dialog = ref(false)
const editando = ref(false)
const confirmDialog = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  icon: 'mdi-check'
})

const proyectoForm = ref<Proyecto>({
  id: 0,
  title: '',
  description: '',
  userId: null,
  statusId: null,
  clientId: null,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0]
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
    cargando.value = true
    errorCarga.value = null

    const [projects, users, stats] = await Promise.all([
      service.index<Proyecto[]>('/projects').catch(() => []),
      service.index<Usuario[]>('/users').catch(() => []),
      service.index<Estado[]>('/statuses', { type: 'project' }).catch(() => [])
    ])

    proyectos.value = projects
    usuarios.value = users.map(u => ({
      ...u,
      name: `${u.firstName} ${u.lastName}`
    }))
    estados.value = stats

    if (projects.length === 0 && users.length === 0 && stats.length === 0) {
      throw new Error('No se pudieron cargar los datos. Verifica la conexión con el servidor.')
    }
  } catch (error) {
    console.error('Error en carga de datos:', error)
    errorCarga.value = error instanceof Error ? error.message : 'Error desconocido al cargar datos'
    showSnackbar('error', 'Error al cargar datos', 'mdi-alert-circle')
  } finally {
    cargando.value = false
  }
}

onMounted(cargarDatos)

function proyectosPorEstado(id: number) {
  return proyectos.value
    .filter(p => p.statusId === id)
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
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

function obtenerNombreCliente(id: number | null): string {
  if (!id) return 'Sin cliente'
  const usuario = usuarios.value.find(u => u.id === id)
  return usuario ? `${usuario.firstName} ${usuario.lastName}` : `Cliente ${id}`
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

function getStatusColor(statusTitle: string) {
  const statusColors: Record<string, string> = {
    'Nuevo': '#2196F3',      // Azul
    'En progreso': '#FF9800', // Naranja
    'En revisión': '#9C27B0', // Morado
    'Completado': '#4CAF50',  // Verde
    'Cancelado': '#F44336',   // Rojo
    'Pausado': '#607D8B'      // Gris azulado
  }
  return statusColors[statusTitle] || '#2196F3' // Azul por defecto
}

function isOverdue(endDate: string) {
  if (!endDate) return false
  const today = new Date().toISOString().split('T')[0]
  return endDate < today
}

function onDragStart(e: DragEvent, id: number) {
  e.dataTransfer?.setData('text/plain', id.toString())
}

function onDrop(e: DragEvent, estado: number) {
  const id = parseInt(e.dataTransfer?.getData('text/plain') || '')
  const proyecto = proyectos.value.find(p => p.id === id)
  if (proyecto) {
    proyecto.statusId = estado
    service.update('/projects', id, { statusId: estado })
      .catch(err => {
        console.error('Error al actualizar estado:', err)
        showSnackbar('error', 'Error al actualizar estado', 'mdi-alert-circle')
      })
    showSnackbar('success', 'Estado actualizado', 'mdi-check-circle')
  }
}

function abrirModalNuevoProyecto() {
  proyectoForm.value = {
    id: 0,
    title: '',
    description: '',
    userId: null,
    statusId: estados.value[0]?.id || null,
    clientId: null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  }
  editando.value = false
  dialog.value = true
}

function editarProyecto(proyecto: Proyecto) {
  if(authStore.hasPermission('project:update'))
  {
    proyectoForm.value = {
      ...proyecto,
      startDate: proyecto.startDate.split('T')[0],
      endDate: proyecto.endDate.split('T')[0]
    }
    editando.value = true
    dialog.value = true
  }
}

function cerrarModal() {
  dialog.value = false
}

function required(v: any) {
  return !!v || 'Campo requerido'
}

async function guardarProyecto() {
  if (!proyectoForm.value.title ||
      !proyectoForm.value.userId ||
      !proyectoForm.value.clientId ||
      !proyectoForm.value.statusId ||
      !proyectoForm.value.startDate ||
      !proyectoForm.value.endDate) {
    showSnackbar('error', 'Por favor complete todos los campos requeridos', 'mdi-alert-circle')
    return
  }

  const data = { ...proyectoForm.value }

  try {
    if (editando.value) {
      await service.update('/projects', data.id, data)
      const idx = proyectos.value.findIndex(p => p.id === data.id)
      if (idx !== -1) proyectos.value[idx] = { ...data }
      showSnackbar('success', 'Proyecto actualizado con éxito', 'mdi-check-circle')
    } else {
      const nuevo = await service.store<Proyecto>('/projects', data)
      proyectos.value.push(nuevo)
      showSnackbar('success', 'Proyecto creado con éxito', 'mdi-check-circle')
    }
    cerrarModal()
  } catch (err) {
    console.error('Error al guardar proyecto', err)
    showSnackbar('error', 'Error al guardar el proyecto', 'mdi-alert-circle')
  }
}

function confirmarEliminar() {
  confirmDialog.value = true
}

async function eliminarProyecto() {
  try {
    await service.delete('/projects', proyectoForm.value.id.toString())
    proyectos.value = proyectos.value.filter(p => p.id !== proyectoForm.value.id)
    confirmDialog.value = false
    dialog.value = false
    showSnackbar('success', 'Proyecto eliminado con éxito', 'mdi-check-circle')
  } catch (err) {
    console.error('Error al eliminar', err)
    showSnackbar('error', 'No se pudo eliminar el proyecto', 'mdi-alert-circle')
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
.projects-container {
  max-width: 100%;
  padding: 20px;
}

.kanban-board {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 16px;
}

.kanban-column {
  min-width: 300px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 8px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  color: white;
}

.column-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.task-count {
  font-size: 0.75rem;
}

.tasks-scroll-container {
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  padding-right: 4px;
}

.task-card {
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-title {
  padding: 12px 16px 0 16px;
}

.task-content {
  padding: 0 16px 12px 16px;
}

.task-description {
  color: #616161;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-meta {
  font-size: 0.75rem;
  color: #757575;
}

.list-move {
  transition: transform 0.5s ease;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
