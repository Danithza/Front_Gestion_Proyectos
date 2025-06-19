<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">Reporte de Tareas por Usuario</h2>

    <v-row class="align-center mb-4" no-gutters>
      <!-- Select de usuarios -->
      <v-col cols="12" md="6">
        <v-select
          v-model="usuariosSeleccionados"
          :items="usuarios"
          item-title="firstName"
          item-value="id"
          label="Seleccionar Usuarios"
          multiple
          chips
          clearable
        />
      </v-col>

      <!-- Botones -->
      <v-col cols="12" md="6" class="d-flex justify-end" style="gap: 16px;">
        <v-btn color="red" @click="exportarPDF">PDF</v-btn>
        <v-btn color="success" @click="exportarExcel">Excel</v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="taskHeaders"
      :items="tareasFiltradas"
      class="elevation-1"
      items-per-page="10"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import CONFIG from '@/config/app';

interface Usuario {
  id: number
  firstName: string
  lastName: string
}

interface Estado {
  id: string
  title: string
}

interface Proyecto {
  id: string
  title: string
}

interface Tarea {
  id: number
  title: string
  description: string
  statusId: string
  projectId: string
  userId: number
  createdAt: string
  status?: string
  proyecto?: string
  responsable?: string
}

const token = localStorage.getItem('token') || '' // Asegúrate que el usuario haya iniciado sesión

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

const usuarios = ref<Usuario[]>([])
const estados = ref<Estado[]>([])
const proyectos = ref<Proyecto[]>([])
const tareas = ref<Tarea[]>([])
const usuariosSeleccionados = ref<number[]>([])

const tareasFiltradas = computed(() => {
  if (usuariosSeleccionados.value.length === 0) return tareas.value
  return tareas.value.filter(t => usuariosSeleccionados.value.includes(t.userId))
})

const taskHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Título', key: 'title' },
  { title: 'Descripción', key: 'description' },
  { title: 'Estado', key: 'status' },
  { title: 'Proyecto', key: 'proyecto' },
  { title: 'Responsable', key: 'responsable' },
  { title: 'Fecha', key: 'createdAt' },
]

const obtenerUsuarios = async () => {
  const res = await fetch(CONFIG.baseUrl+'/api/users', { headers })
  usuarios.value = await res.json()
}

const obtenerEstados = async () => {
  const res = await fetch(CONFIG.baseUrl+'/api/statuses', { headers })
  estados.value = await res.json()
}

const obtenerProyectos = async () => {
  const res = await fetch(CONFIG.baseUrl+'/api/projects', { headers })
  proyectos.value = await res.json()
}

const obtenerTareas = async () => {
  try {
    const res = await fetch(CONFIG.baseUrl+'/api/tasks', { headers })

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)

    const data = await res.json()

    if (!Array.isArray(data)) throw new Error('Respuesta inesperada: no es un array')

    tareas.value = data.map((t: Tarea) => {
      const user = usuarios.value.find(u => u.id === t.userId)
      const estado = estados.value.find(e => e.id === t.statusId)
      const proyecto = proyectos.value.find(p => p.id === t.projectId)

      return {
        ...t,
        responsable: user ? `${user.firstName} ${user.lastName}` : 'Desconocido',
        status: estado ? estado.title : 'Sin estado',
        proyecto: proyecto ? proyecto.title : 'Sin proyecto',
      }
    })
  } catch (err) {
    console.error('Error al obtener tareas:', err)
  }
}

const exportarPDF = () => {
  const doc = new jsPDF()
  doc.text('Reporte de Tareas', 14, 10)

  if (tareasFiltradas.value.length === 0) {
    doc.text('No hay tareas para mostrar.', 14, 20)
    doc.save('reporte_tareas.pdf')
    return
  }

  const rows = tareasFiltradas.value.map(t => [
    t.id,
    t.title,
    t.description,
    t.status,
    t.proyecto,
    t.responsable,
    new Date(t.createdAt).toLocaleString(),
  ])

  autoTable(doc, {
    startY: 20,
    head: [['ID', 'Título', 'Descripción', 'Estado', 'Proyecto', 'Responsable', 'Fecha']],
    body: rows,
  })

  doc.save('reporte_tareas.pdf')
}

const exportarExcel = () => {
  if (tareasFiltradas.value.length === 0) return

  const rows = tareasFiltradas.value.map(t => ({
    ID: t.id,
    Título: t.title,
    Descripción: t.description,
    Estado: t.status,
    Proyecto: t.proyecto,
    Responsable: t.responsable,
    Fecha: new Date(t.createdAt).toLocaleString(),
  }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Tareas')
  XLSX.writeFile(wb, 'reporte_tareas.xlsx')
}

onMounted(async () => {
  await Promise.all([
    obtenerUsuarios(),
    obtenerEstados(),
    obtenerProyectos(),
  ])
  await obtenerTareas()
})
</script>
