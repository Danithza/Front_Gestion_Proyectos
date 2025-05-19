<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="6">
        <h2 class="text-h5 font-weight-bold">Gestión de Equipos</h2>
      </v-col>
      <v-col cols="6" class="text-end">
        <v-btn color="primary" class="me-2" @click="abrirDialogo">Agregar Equipo</v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="equipos"
      item-value="id"
      class="elevation-1"
    >
      <template #item.acciones="{ item }">
        <v-icon class="me-2" color="primary" @click="editarEquipo(item)">mdi-pencil</v-icon>
        <v-icon color="red" @click="eliminarEquipo(item.id)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Diálogo -->
    <v-dialog v-model="dialogo" max-width="500">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ equipoEditando ? 'Editar Equipo' : 'Nuevo Equipo' }}</span>
        </v-card-title>

        <v-card-text>
          <v-text-field label="Nombre del Equipo" v-model="form.nombre" />
          <v-text-field label="Responsable" v-model="form.responsable" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="guardarEquipo">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'



interface Equipo {
  id: number
  nombre: string
  responsable: string
}

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre del Equipo', key: 'nombre' },
  { title: 'Responsable', key: 'responsable' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

const equipos = ref<Equipo[]>([
  { id: 1, nombre: 'Desarrollo', responsable: 'Carlos Gómez' },
  { id: 2, nombre: 'Diseño', responsable: 'Ana Ruiz' }
])

const dialogo = ref(false)
const equipoEditando = ref<Equipo | null>(null)
const form = ref({ nombre: '', responsable: '' })

const abrirDialogo = () => {
  equipoEditando.value = null
  form.value = { nombre: '', responsable: '' }
  dialogo.value = true
}

const cerrarDialogo = () => {
  dialogo.value = false
}

const guardarEquipo = () => {
  if (equipoEditando.value) {
    // Editar
    const index = equipos.value.findIndex(e => e.id === equipoEditando.value?.id)
    if (index !== -1) {
      equipos.value[index] = { ...equipoEditando.value, ...form.value }
    }
  } else {
    // Crear nuevo
    const nuevoId = Math.max(...equipos.value.map(e => e.id)) + 1
    equipos.value.push({ id: nuevoId, ...form.value })
  }
  cerrarDialogo()
}

const editarEquipo = (equipo: Equipo) => {
  equipoEditando.value = { ...equipo }
  form.value = { nombre: equipo.nombre, responsable: equipo.responsable }
  dialogo.value = true
}

const eliminarEquipo = (id: number) => {
  equipos.value = equipos.value.filter(e => e.id !== id)
}

</script>
