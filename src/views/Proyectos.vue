<template>
  <v-container>
    <v-row class="mb-4" align="center" justify="space-between">
      <v-col cols="12" md="4">
        <v-text-field v-model="filtro" label="Buscar proyecto" clearable />
      </v-col>
      <v-col cols="12" md="3" class="text-end">
        <ProyectoForm @proyecto-creado="agregarProyecto" />
      </v-col>
    </v-row>

    <!-- Tabla de proyectos -->
    <v-table class="elevation-2 rounded-xl">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Encargado</th>
          <th>Cliente</th>
          <th>Estado</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="proyecto in proyectosFiltrados" :key="proyecto.id">
          <td>{{ proyecto.title }}</td>
          <td>{{ proyecto.description }}</td>
          <td>{{ proyecto.userId }}</td>
          <td>{{ proyecto.clientId }}</td>
          <td>{{ proyecto.statusId }}</td>
          <td>{{ formatoFecha(proyecto.startDate) }}</td>
          <td>{{ formatoFecha(proyecto.endDate) }}</td>
          <td class="text-center">
            <v-btn icon color="blue" @click="editarProyecto(proyecto)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="eliminarProyecto(proyecto)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>

        <tr v-if="proyectosFiltrados.length === 0">
          <td colspan="8" class="text-center text-grey">No se encontraron proyectos.</td>
        </tr>
      </tbody>
    </v-table>

    <!-- Modal edición -->
    <v-dialog v-model="editarDialog" max-width="800px">
      <v-card>
        <v-card-title>Editar Proyecto</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="guardarEdicion">
            <v-text-field v-model="proyectoEditado.title" label="Título" />
            <v-textarea v-model="proyectoEditado.description" label="Descripción" />
            <v-text-field
              v-model="proyectoEditado.startDate"
              label="Fecha Inicio"
              type="date"
            />
            <v-text-field
              v-model="proyectoEditado.endDate"
              label="Fecha Fin"
              type="date"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" text @click="editarDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="guardarEdicion">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import service from '@/services/baseService'

interface Proyecto {
  id: number
  title: string
  description: string
  userId: string
  clientId: string
  statusId: string
  startDate: string
  endDate: string
}

const proyectos = ref<Proyecto[]>([])
const filtro = ref('')
const editarDialog = ref(false)
const proyectoEditado = ref<Proyecto>({
  id: 0,
  title: '',
  description: '',
  userId: '',
  clientId: '',
  statusId: '',
  startDate: '',
  endDate: '',
})

onMounted(async () => {
  try {
    const data = await service.index<Proyecto[]>('/projects')
    proyectos.value = data
  } catch (error) {
    console.error('Error al cargar proyectos:', error)
  }
})

const proyectosFiltrados = computed(() => {
  return proyectos.value.filter(p =>
    p.title.toLowerCase().includes(filtro.value.toLowerCase())
  )
})

function agregarProyecto(nuevo: Proyecto) {
  proyectos.value.push(nuevo)
}

function editarProyecto(p: Proyecto) {
  proyectoEditado.value = { ...p }
  editarDialog.value = true
}

function guardarEdicion() {
  const index = proyectos.value.findIndex(p => p.id === proyectoEditado.value.id)
  if (index !== -1) proyectos.value[index] = { ...proyectoEditado.value }
  editarDialog.value = false
}

function eliminarProyecto(p: Proyecto) {
  proyectos.value = proyectos.value.filter(proj => proj.id !== p.id)
}

function formatoFecha(fecha: string) {
  if (!fecha) return '-'
  return fecha.slice(0, 10).split('-').reverse().join('/') // "2025-01-05" → "05/01/2025"
}
</script>
