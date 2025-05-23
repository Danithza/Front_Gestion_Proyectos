<template>
    <v-container>
      <h2 class="text-h5 font-weight-bold mb-6">📊 Reporte por Usuario / Tareas</h2>
  
      <!-- FILTROS -->
      <v-card class="mb-6 pa-4" elevation="1">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-select
              v-model="filtros.usuario"
              :items="usuarios"
              item-title="nombre"
              item-value="id"
              label="Filtrar por Usuario"
              clearable
              prepend-icon="mdi-account"
            />
          </v-col>
  
          <v-col cols="12" md="4">
            <v-select
              v-model="filtros.estado"
              :items="estados"
              label="Estado de Tarea"
              clearable
              prepend-icon="mdi-clipboard-check"
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
                  label="Fecha específica"
                  readonly
                  v-bind="props"
                  prepend-icon="mdi-calendar"
                />
              </template>
              <v-date-picker
                v-model="filtros.fecha"
                @update:model-value="menu = false"
              />
            </v-menu>
          </v-col>
        </v-row>
      </v-card>
  
      <!-- TABLA -->
      <v-card>
        <v-card-title class="text-subtitle-1 font-weight-bold">
          Resumen de Tareas
        </v-card-title>
  
        <v-data-table
          :headers="headers"
          :items="tareasFiltradas"
          class="elevation-1"
          density="compact"
        >
          <template #item.estado="{ item }">
            <v-chip
              :color="item.estado === 'Completada' ? 'green' : 'orange'"
              text-color="white"
              small
            >
              {{ item.estado }}
            </v-chip>
          </template>
  
          <template #item.usuarioId="{ item }">
            {{ obtenerNombreUsuario(item.usuarioId) }}
          </template>
        </v-data-table>
  
        <!-- CONTADOR -->
        <v-card-subtitle class="mt-4 d-flex flex-wrap">
          <v-chip color="green" text-color="white" class="ma-2">
            ✅ Completadas: {{ contarEstado('Completada') }}
          </v-chip>
          <v-chip color="orange" text-color="white" class="ma-2">
            ⏳ Pendientes: {{ contarEstado('Pendiente') }}
          </v-chip>
        </v-card-subtitle>
      </v-card>
  
      <!-- BOTÓN PDF -->
      <v-btn
        color="primary"
        class="mt-6"
        prepend-icon="mdi-file-pdf-box"
        @click="generarPDF"
      >
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
    fecha: string
    descripcion: string
  }
  
  // Estado
  const filtros = ref({
    usuario: null as number | null,
    estado: null as string | null,
    fecha: null as string | null,
  })
  
  const menu = ref(false)
  const fechaTexto = ref('')
  
  // Datos de prueba
  const usuarios = ref<Usuario[]>([
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'Ana Torres' },
  ])
  const estados = ref(['Pendiente', 'Completada'])
  
  const tareas = ref<Tarea[]>([
    { id: 1, usuarioId: 1, estado: 'Pendiente', fecha: '2025-05-22', descripcion: 'Revisar informe' },
    { id: 2, usuarioId: 2, estado: 'Completada', fecha: '2025-05-20', descripcion: 'Enviar correo' },
    { id: 3, usuarioId: 1, estado: 'Completada', fecha: '2025-05-21', descripcion: 'Actualizar base de datos' },
  ])
  
  // Actualiza texto de fecha
  watch(() => filtros.value.fecha, (nuevaFecha) => {
    fechaTexto.value = nuevaFecha ? new Date(nuevaFecha).toLocaleDateString() : ''
  })
  
  // Tabla
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Usuario', value: 'usuarioId' },
    { title: 'Descripción', value: 'descripcion' },
    { title: 'Estado', value: 'estado' },
    { title: 'Fecha', value: 'fecha' },
  ]
  
  const tareasFiltradas = computed(() => {
    return tareas.value.filter((t) => {
      const u = !filtros.value.usuario || t.usuarioId === filtros.value.usuario
      const e = !filtros.value.estado || t.estado === filtros.value.estado
      const f = !filtros.value.fecha || t.fecha === filtros.value.fecha
      return u && e && f
    })
  })
  
  const contarEstado = (estado: string) => {
    return tareasFiltradas.value.filter((t) => t.estado === estado).length
  }
  
  const obtenerNombreUsuario = (id: number) => {
    return usuarios.value.find(u => u.id === id)?.nombre || 'Desconocido'
  }
  
  // PDF
  const generarPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Reporte de Tareas', 10, 10)
  
    tareasFiltradas.value.forEach((tarea, i) => {
      doc.setFontSize(12)
      doc.text(
        `${i + 1}. ${tarea.descripcion} | ${tarea.estado} | ${tarea.fecha} | ${obtenerNombreUsuario(tarea.usuarioId)}`,
        10,
        20 + i * 10
      )
    })
  
    doc.save('reporte-tareas.pdf')
  }
  </script>
  