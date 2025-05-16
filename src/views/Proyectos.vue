<template>
    <div class="p-6 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Gestión de Proyectos</h1>
  
      <v-btn @click="mostrarFormulario" color="primary" class="mb-4">
        + Crear Proyecto
      </v-btn>
  
      <v-dialog v-model="formularioVisible" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Crear Nuevo Proyecto</span>
          </v-card-title>
          <v-card-text>
            <ProyectoForm
              :proyecto="proyectoEnEdicion"
              @proyectoCreado="proyectoCreado"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="secondary" @click="formularioVisible = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import ProyectoForm from '@/components/ProyectoForm.vue'
  
  interface Tarea {
    id: number
    nombre: string
    encargado: string
    estado: string
  }
  
  interface Proyecto {
    id: number
    titulo: string
    descripcion: string
    fecha_inicio: string
    fecha_final: string
    precio: number
    encargado: string
    estado: string
    cliente: string
    tareas: Tarea[]
  }
  
  const router = useRouter()
  
  const proyectos = ref<Proyecto[]>([])
  const formularioVisible = ref(false)
  const proyectoEnEdicion = ref<Proyecto | null>(null)
  const filtro = ref('')
  
  const cargarProyectos = () => {
    proyectos.value = [
      {
        id: 1,
        titulo: 'Proyecto Alpha',
        descripcion: 'Este es un proyecto de prueba.',
        fecha_inicio: '2025-01-01',
        fecha_final: '2025-06-01',
        precio: 10000,
        encargado: 'Juan Pérez',
        estado: 'En progreso',
        cliente: 'Empresa XYZ',
        tareas: [{ id: 1, nombre: 'Tarea 1', encargado: 'Carlos', estado: 'Pendiente' }]
      },
      {
        id: 2,
        titulo: 'Proyecto Beta',
        descripcion: 'Otro proyecto de ejemplo.',
        fecha_inicio: '2025-03-01',
        fecha_final: '2025-12-31',
        precio: 15000,
        encargado: 'Ana López',
        estado: 'Planificado',
        cliente: 'Cliente ABC',
        tareas: []
      },
    ]
  }
  
  const proyectosFiltrados = computed(() =>
    filtro.value
      ? proyectos.value.filter(p =>
          p.titulo.toLowerCase().includes(filtro.value.toLowerCase()) ||
          p.cliente.toLowerCase().includes(filtro.value.toLowerCase())
        )
      : proyectos.value
  )
  
  const mostrarFormulario = () => {
    proyectoEnEdicion.value = null
    formularioVisible.value = true
  }
  
  const editarProyecto = (proyecto: Proyecto) => {
    proyectoEnEdicion.value = { ...proyecto }
    formularioVisible.value = true
  }
  
  const eliminarProyecto = (id: number) => {
    proyectos.value = proyectos.value.filter(p => p.id !== id)
  }
  
  const proyectoCreado = (nuevoProyecto: Proyecto) => {
    const index = proyectos.value.findIndex(p => p.id === nuevoProyecto.id)
    if (index !== -1) {
      proyectos.value[index] = nuevoProyecto
    } else {
      nuevoProyecto.id = Date.now()
      proyectos.value.push(nuevoProyecto)
    }
  }
  
  const verTareas = (proyecto: Proyecto) => {
    router.push({ name: 'tareas', query: { proyectoId: proyecto.id } })
  }
  
  const formatFecha = (fecha: string): string => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }
  
  onMounted(cargarProyectos)
  </script>