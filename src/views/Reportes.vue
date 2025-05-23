<template>
    <v-container>
      <h2 class="text-h5 font-weight-bold mb-4">Reporte por usuario / tareas</h2>
  
      <!-- FILTROS -->
      <v-row dense>
        <v-col cols="12" md="4">
          <v-select
            v-model="filtros.usuario"
            :items="usuarios"
            item-title="nombre"
            item-value="id"
            label="Usuario"
            clearable
          />
        </v-col>
  
        <v-col cols="12" md="4">
          <v-select
            v-model="filtros.estado"
            :items="estados"
            label="Estado de Tarea"
            clearable
          />
        </v-col>
  
        <v-col cols="12" md="4">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="fechaTexto"
                label="Fecha"
                readonly
                v-bind="props"
              />
            </template>
  
            <v-date-picker
              v-model="filtros.fecha"
              @update:model-value="menu = false"
            />
          </v-menu>
        </v-col>
      </v-row>
  
      <!-- TABLA -->
      <v-card class="mt-6">
        <v-card-title>Resumen de Tareas</v-card-title>
  
        <v-data-table
          :headers="headers"
          :items="tareasFiltradas"
          class="elevation-1"
        />
  
        <v-card-subtitle class="mt-4">
          <v-chip color="green" text-color="white" class="ma-2">
            Completadas: {{ contarEstado('Completada') }}
          </v-chip>
          <v-chip color="orange" text-color="white" class="ma-2">
            Pendientes: {{ contarEstado('Pendiente') }}
          </v-chip>
        </v-card-subtitle>
      </v-card>
  
      <!-- BOTÓN PDF -->
      <v-btn color="primary" class="mt-6" @click="generarPDF">
        Exportar como PDF
      </v-btn>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { jsPDF } from 'jspdf'
  
  // Interfaces
  interface Usuario {
    id: number
    nombre: string
  }
  
  interface Tarea {
    id: number
    usuarioId: number
    estado: string
    fecha: string // Formato ISO: 'YYYY-MM-DD'
    descripcion: string
  }
  
  // Estado de filtros
  const filtros = ref({
    usuario: null as number | null,
    estado: null as string | null,
    fecha: null as string | null,
  })
  
  // Estado del datepicker
  const menu = ref(false)
  const fechaTexto = ref('')
  
  // Usuarios de prueba
  const usuarios = ref<Usuario[]>([
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'Ana Torres' },
  ])
  
  // Estados posibles
  const estados = ref(['Pendiente', 'Completada'])
  
  // Tareas de prueba
  const tareas = ref<Tarea[]>([
    { id: 1, usuarioId: 1, estado: 'Pendiente', fecha: '2025-05-22', descripcion: 'Revisar informe' },
    { id: 2, usuarioId: 2, estado: 'Completada', fecha: '2025-05-20', descripcion: 'Enviar correo' },
    { id: 3, usuarioId: 1, estado: 'Completada', fecha: '2025-05-21', descripcion: 'Actualizar base de datos' },
  ])
  
  // Actualiza el texto de la fecha seleccionada
  watch(() => filtros.value.fecha, (nuevaFecha) => {
    fechaTexto.value = nuevaFecha ? new Date(nuevaFecha).toLocaleDateString() : ''
  })
  
  // Headers de la tabla
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Descripción', value: 'descripcion' },
    { title: 'Estado', value: 'estado' },
    { title: 'Fecha', value: 'fecha' },
  ]
  
  // Computed: tareas filtradas por los filtros seleccionados
  const tareasFiltradas = computed(() => {
    return tareas.value.filter((t) => {
      const coincideUsuario = !filtros.value.usuario || t.usuarioId === filtros.value.usuario
      const coincideEstado = !filtros.value.estado || t.estado === filtros.value.estado
      const coincideFecha = !filtros.value.fecha || t.fecha === filtros.value.fecha
      return coincideUsuario && coincideEstado && coincideFecha
    })
  })
  
  // Contador de tareas por estado
  const contarEstado = (estado: string) => {
    return tareasFiltradas.value.filter((t) => t.estado === estado).length
  }
  
  // Exportar PDF
  const generarPDF = () => {
    const doc = new jsPDF()
    doc.text('Resumen de Tareas', 10, 10)
  
    tareasFiltradas.value.forEach((tarea, index) => {
      doc.text(
        `${index + 1}. ${tarea.descripcion} - ${tarea.estado} - ${tarea.fecha}`,
        10,
        20 + index * 10
      )
    })
  
    doc.save('reporte-tareas.pdf')
  }
  </script>
  