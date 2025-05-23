<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">Gestión de Equipos</h2>

    <FormularioEquipo
      :equipo="nuevoEquipo"
      :modo-edicion="modoEdicion"
      :usuarios="usuarios"
      @guardar="guardarEquipo"
      @cancelar="resetFormulario"
    />

    <v-row>
      <v-col
        v-for="equipo in equipos"
        :key="equipo.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card>
          <v-card-title class="font-weight-bold">
            {{ equipo.nombre }}
          </v-card-title>
          <v-card-text>
            <div class="mb-2 text-caption text-grey">Miembros:</div>
            <v-chip-group column>
              <v-chip
                v-for="id in equipo.miembros"
                :key="id"
                color="blue"
                class="ma-1"
                size="small"
              >
                {{ obtenerNombreUsuario(id) }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
          <v-card-actions>
            <v-btn icon color="blue" @click="editarEquipo(equipo)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="eliminarEquipo(equipo.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormularioEquipo from '@/components/AgregarEquipo.vue'

interface Usuario {
  id: number
  nombre: string
}

interface Equipo {
  id: number
  nombre: string
  miembros: number[]
}

const usuarios = ref<Usuario[]>([
  { id: 1, nombre: 'Juan Pérez' },
  { id: 2, nombre: 'Ana Torres' },
  { id: 3, nombre: 'Carlos Gómez' },
  { id: 4, nombre: 'Luisa Martínez' }
])

const equipos = ref<Equipo[]>([
  { id: 1, nombre: 'Equipo Alpha', miembros: [1, 2] },
  { id: 2, nombre: 'Equipo Beta', miembros: [3] }
])

const nuevoEquipo = ref<Equipo>({
  id: 0,
  nombre: '',
  miembros: []
})

const modoEdicion = ref(false)
const equipoEditandoId = ref<number | null>(null)

const guardarEquipo = (equipo: Equipo) => {
  if (modoEdicion.value && equipoEditandoId.value !== null) {
    const index = equipos.value.findIndex(e => e.id === equipoEditandoId.value)
    if (index !== -1) {
      equipos.value[index] = { ...equipo, id: equipoEditandoId.value }
    }
  } else {
    const nuevoId = equipos.value.length > 0
      ? Math.max(...equipos.value.map(e => e.id)) + 1
      : 1
    equipos.value.push({ ...equipo, id: nuevoId })
  }
  resetFormulario()
}

const editarEquipo = (equipo: Equipo) => {
  modoEdicion.value = true
  equipoEditandoId.value = equipo.id
  nuevoEquipo.value = { ...equipo }
}

const eliminarEquipo = (id: number) => {
  equipos.value = equipos.value.filter(e => e.id !== id)
}

const resetFormulario = () => {
  nuevoEquipo.value = { id: 0, nombre: '', miembros: [] }
  modoEdicion.value = false
  equipoEditandoId.value = null
}

const obtenerNombreUsuario = (id: number) => {
  const usuario = usuarios.value.find(u => u.id === id)
  return usuario ? usuario.nombre : 'Desconocido'
}
</script>
