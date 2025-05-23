<template>
  <v-container>
    <v-row class="mb-4" align="center" justify="space-between">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filtro"
          label="Buscar por título..."
          prepend-inner-icon="mdi-magnify"
        />
      </v-col>
      <v-col cols="12" md="3" class="text-end">
        <ProyectoForm @proyecto-creado="agregarProyecto" />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="(slot, index) in tarjetasVisibles"
        :key="index"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="elevation-3" rounded="xl">
          <template v-if="slot">
            <v-card-title class="bg-primary text-white">{{ slot.titulo }}</v-card-title>
            <v-card-text>
              <div class="text-body-2 mb-2">{{ slot.descripcion }}</div>
              <v-chip class="ma-1" color="indigo" text-color="white">
                Inicio: {{ slot.fecha_inicio }}
              </v-chip>
              <v-chip class="ma-1" color="deep-purple accent-4" text-color="white">
                Fin: {{ slot.fecha_final }}
              </v-chip>
              <div class="mt-2">
                <strong>Precio:</strong> ${{ slot.precio }}<br />
                <strong>Encargado:</strong> {{ slot.encargado }}<br />
                <strong>Cliente:</strong> {{ slot.cliente }}<br />
                <strong>Estado:</strong> {{ slot.estado }}<br />
                <strong>Tareas:</strong>
                <ul class="pl-4">
                  <li v-for="(tarea, i) in slot.tareas" :key="i">
                    {{ tarea.nombre }} – {{ tarea.encargado }}
                  </li>
                </ul>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn icon color="blue" @click="editarProyecto(slot)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="eliminarProyecto(slot)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </template>

          <!-- Tarjeta vacía -->
          <template v-else>
            <v-card-title class="text-grey text-center">Tarjeta Vacía</v-card-title>
            <v-card-text class="text-grey text-center">Aún no se ha asignado un proyecto.</v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal edición -->
    <v-dialog v-model="editarDialog" max-width="800px">
      <v-card>
        <v-card-title>Editar Proyecto</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="guardarEdicion">
            <v-text-field v-model="proyectoEditado.titulo" label="Título" />
            <v-textarea v-model="proyectoEditado.descripcion" label="Descripción" />
            <v-text-field v-model="proyectoEditado.precio" label="Precio" type="number" />
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
import { ref, computed, onMounted, watch } from 'vue'
import ProyectoForm from '@/components/ProyectoForm.vue'

interface Tarea {
  nombre: string
  encargado: string
}

interface Proyecto {
  id: number
  titulo: string
  descripcion: string
  fecha_inicio: string
  fecha_final: string
  precio: number
  encargado: string
  cliente: string
  estado: string
  tareas: Tarea[]
}

const proyectos = ref<Proyecto[]>([])
const filtro = ref('')
const editarDialog = ref(false)
const proyectoEditado = ref<Proyecto>({
  id: 0,
  titulo: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_final: '',
  precio: 0,
  encargado: '',
  cliente: '',
  estado: '',
  tareas: [],
})

// Tarjetas visibles (3 mínimo)
const tarjetasVisibles = computed(() => {
  const visibles = [...proyectosFiltrados.value]
  while (visibles.length < 3) visibles.push(null)
  return visibles
})

// Cargar desde localStorage
onMounted(() => {
  const guardados = localStorage.getItem('proyectos')
  if (guardados) proyectos.value = JSON.parse(guardados)
})

// Guardar al editar
watch(proyectos, (nuevaLista) => {
  localStorage.setItem('proyectos', JSON.stringify(nuevaLista))
}, { deep: true })

const proyectosFiltrados = computed(() => {
  return proyectos.value.filter((p) =>
    p.titulo.toLowerCase().includes(filtro.value.toLowerCase())
  )
})

function agregarProyecto(nuevo: Proyecto) {
  nuevo.id = Date.now()
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
</script>
