<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="6">
        <h2 class="text-h5 font-weight-bold">Gestión de Roles</h2>
      </v-col>
      <v-col cols="6" class="text-end">
        <v-btn color="primary" class="me-2" @click="abrirDialogo">Agregar Rol</v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="roles"
      item-value="id"
      class="elevation-1"
    >
      <template #item.acciones="{ item }">
        <v-icon class="me-2" color="primary" @click="editarRol(item)">mdi-pencil</v-icon>
        <v-icon color="red" @click="eliminarRol(item.id)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogo" max-width="400">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ rolEditando ? 'Editar Rol' : 'Nuevo Rol' }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Nombre del Rol" v-model="form.nombre" />
          <v-textarea label="Descripción" v-model="form.descripcion" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="blue darken-1" @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn text color="blue darken-1" @click="guardarRol">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'


interface Rol {
  id: number
  nombre: string
  descripcion: string
}

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

const roles = ref<Rol[]>([
  { id: 1, nombre: 'Administrador', descripcion: 'Acceso completo' },
  { id: 2, nombre: 'Usuario', descripcion: 'Acceso limitado' }
])

const dialogo = ref(false)
const rolEditando = ref<Rol | null>(null)
const form = ref({ nombre: '', descripcion: '' })

const abrirDialogo = () => {
  rolEditando.value = null
  form.value = { nombre: '', descripcion: '' }
  dialogo.value = true
}
const cerrarDialogo = () => (dialogo.value = false)

const guardarRol = () => {
  if (rolEditando.value) {
    const index = roles.value.findIndex(r => r.id === rolEditando.value?.id)
    if (index !== -1) {
      roles.value[index] = { ...rolEditando.value, ...form.value }
    }
  } else {
    const nuevoId = roles.value.length ? Math.max(...roles.value.map(r => r.id)) + 1 : 1
    roles.value.push({ id: nuevoId, ...form.value })
  }
  cerrarDialogo()
}

const editarRol = (rol: Rol) => {
  rolEditando.value = { ...rol }
  form.value = { nombre: rol.nombre, descripcion: rol.descripcion }
  dialogo.value = true
}

const eliminarRol = (id: number) => {
  roles.value = roles.value.filter(r => r.id !== id)
}

</script>
