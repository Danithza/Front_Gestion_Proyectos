<template>
    <v-form @submit.prevent="crearProyecto">
      <v-text-field
        v-model="tituloProyecto"
        label="Título del Proyecto"
        outlined
        required
      />
      <v-textarea
        v-model="descripcionProyecto"
        label="Descripción del Proyecto"
        outlined
        rows="3"
      />
      <v-text-field
        v-model="fechaInicio"
        label="Fecha de Inicio"
        outlined
        type="date"
        required
      />
      <v-text-field
        v-model="fechaFinal"
        label="Fecha de Finalización"
        outlined
        type="date"
        required
      />
      <v-text-field
        v-model="precio"
        label="Precio"
        outlined
        type="number"
        required
      />
      <v-text-field
        v-model="encargado"
        label="Encargado"
        outlined
        required
      />
      <v-select
        v-model="estado"
        :items="['Planificado', 'En progreso', 'Completado']"
        label="Estado"
        outlined
        required
      />
      <v-text-field
        v-model="cliente"
        label="Cliente"
        outlined
        required
      />
      <v-btn color="primary" type="submit">Guardar</v-btn>
    </v-form>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { defineEmits } from 'vue'
  
  const tituloProyecto = ref('')
  const descripcionProyecto = ref('')
  const fechaInicio = ref('')
  const fechaFinal = ref('')
  const precio = ref(0)
  const encargado = ref('')
  const estado = ref('')
  const cliente = ref('')
  
  
  
  const crearProyecto = () => {
    const nuevoProyecto = {
      titulo: tituloProyecto.value,
      descripcion: descripcionProyecto.value,
      fecha_inicio: fechaInicio.value,
      fecha_final: fechaFinal.value,
      precio: precio.value,
      encargado: encargado.value,
      estado: estado.value,
      cliente: cliente.value,
      tareas: [] // Inicialmente no hay tareas
    }
  
    // Aquí puedes hacer una petición POST para guardar el proyecto
    // Ejemplo con axios:
    // axios.post('/api/proyectos', nuevoProyecto)
  
  
    // Limpiar los campos para que el usuario pueda crear otro proyecto
    tituloProyecto.value = ''
    descripcionProyecto.value = ''
    fechaInicio.value = ''
    fechaFinal.value = ''
    precio.value = 0
    encargado.value = ''
    estado.value = ''
    cliente.value = ''
  }
  </script>
  
  <style scoped>
  /* Estilos específicos para el formulario de creación de proyectos */
  </style>