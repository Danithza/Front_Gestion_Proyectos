<template>
    <v-container>
      <v-card>
        <v-card-title class="text-h5">Gestión de Tareas</v-card-title>
        <v-data-table
          :headers="headers"
          :items="tareas"
          class="elevation-1"
          item-value="id"
        >
          <template #item.estado_tarea_id="{ item }">
            <v-chip :color="getEstadoColor(item.estado_tarea_id)" dark>
              {{ getEstadoNombre(item.estado_tarea_id) }}
            </v-chip>
          </template>

          <template #item.complejidad_id="{ item }">
            <v-chip :color="getComplejidadColor(item.complejidad_id)" dark>
              {{ getComplejidadTexto(item.complejidad_id) }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue'

  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Estado', value: 'estado_tarea_id' },
    { title: 'Comentario', value: 'comentario' },
    { title: 'Fecha estimada', value: 'Fecha_estimacion' },
    { title: 'Fecha finalización', value: 'fecha_finalizacion' },
    { title: 'Complejidad', value: 'complejidad_id' },
  ]

  const tareas = ref([
    {
      id: 1,
      requerimiento_id: 1,
      estado_tarea_id: 6,
      etiqueta_id: 6,
      complejidad_id: 6,
      comentario: 'Tarea iniciada con alta complejidad, requiere revisión',
      Fecha_estimacion: '01/03/2025',
      fecha_finalizacion: '04/03/2025'
    },
    {
      id: 2,
      requerimiento_id: 3,
      estado_tarea_id: 4,
      etiqueta_id: 4,
      complejidad_id: 6,
      comentario: 'Tarea completada exitosamente',
      Fecha_estimacion: '05/03/2025',
      fecha_finalizacion: '11/03/2025'
    },
    {
      id: 3,
      requerimiento_id: 7,
      estado_tarea_id: 5,
      etiqueta_id: 5,
      complejidad_id: 4,
      comentario: 'Desarrollo en curso, pendiente de validación',
      Fecha_estimacion: '12/03/2025',
      fecha_finalizacion: '20/03/2025'
    },
    {
      id: 4,
      requerimiento_id: 9,
      estado_tarea_id: 6,
      etiqueta_id: 6,
      complejidad_id: 3,
      comentario: 'Tarea pausada, requiere ajustes antes de continuar',
      Fecha_estimacion: '21/03/2025',
      fecha_finalizacion: '30/03/2025'
    },
    {
      id: 5,
      requerimiento_id: 10,
      estado_tarea_id: 4,
      etiqueta_id: 4,
      complejidad_id: 6,
      comentario: 'Finalizada, validar resultados finales',
      Fecha_estimacion: '04/03/2025',
      fecha_finalizacion: '11/03/2025'
    }
  ])

  function getEstadoNombre(id: number) {
    const estados: Record<number, string> = {
      4: 'Finalizado',
      5: 'En curso',
      6: 'Pendiente'
    }
    return estados[id] || 'Desconocido'
  }

  function getEstadoColor(id: number) {
    const colores: Record<number, string> = {
      4: 'green',
      5: 'blue',
      6: 'orange'
    }
    return colores[id] || 'grey'
  }

  function getComplejidadTexto(id: number) {
    const niveles: Record<number, string> = {
      3: 'Baja',
      4: 'Media',
      6: 'Alta'
    }
    return niveles[id] || 'N/D'
  }

  function getComplejidadColor(id: number) {
    const colores: Record<number, string> = {
      3: 'green',
      4: 'orange',
      6: 'red'
    }
    return colores[id] || 'grey'
  }
  </script>
