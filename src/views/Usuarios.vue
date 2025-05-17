<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="6">
        <h2 class="text-h5 font-weight-bold">Gestión de Usuarios</h2>
      </v-col>
      <v-col cols="6" class="text-end">
        <v-btn color="primary" class="me-2" @click="abrirDialogo">Agregar Usuario</v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="usuarios"
      item-value="id"
      class="elevation-1"
    >
      <template #item.acciones="{ item }">
        <v-icon class="me-2" color="primary" @click="editarUsuario(item)">mdi-pencil</v-icon>
        <v-icon color="red" @click="eliminarUsuario(item.id)">mdi-delete</v-icon>
      </template>
      <template #item.rol="{ item }">
        {{ obtenerNombreRol(item.rolId) }}
      </template>
    </v-data-table>

    <v-dialog v-model="dialogo" max-width="500">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario' }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Nombre" v-model="form.nombre" />
          <v-text-field label="Correo" v-model="form.correo" type="email" />
          <v-select
            :items="roles"
            item-title="nombre"
            item-value="id"
            label="Rol"
            v-model="form.rolId"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="blue darken-1" @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn text color="blue darken-1" @click="guardarUsuario">Guardar</v-btn>
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

interface Usuario {
  id: number
  nombre: string
  correo: string
  rolId: number
}

const roles = ref<Rol[]>([
  { id: 1, nombre: 'Administrador', descripcion: 'Acceso completo' },
  { id: 2, nombre: 'Usuario', descripcion: 'Acceso limitado' }
])

const usuarios = ref<Usuario[]>([
  { id: 1, nombre: 'Carlos Gómez', correo: 'carlos@example.com', rolId: 1 },
  { id: 2, nombre: 'Ana Ruiz', correo: 'ana@example.com', rolId: 2 }
])

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Correo', key: 'correo' },
  { title: 'Rol', key: 'rol' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

const dialogo = ref(false)
const usuarioEditando = ref<Usuario | null>(null)
const form = ref({ nombre: '', correo: '', rolId: 0 })

const abrirDialogo = () => {
  usuarioEditando.value = null
  form.value = { nombre: '', correo: '', rolId: 0 }
  dialogo.value = true
}
const cerrarDialogo = () => (dialogo.value = false)

const guardarUsuario = () => {
  if (usuarioEditando.value) {
    const index = usuarios.value.findIndex(u => u.id === usuarioEditando.value?.id)
    if (index !== -1) {
      usuarios.value[index] = { ...usuarioEditando.value, ...form.value }
    }
  } else {
    const nuevoId = usuarios.value.length ? Math.max(...usuarios.value.map(u => u.id)) + 1 : 1
    usuarios.value.push({ id: nuevoId, ...form.value })
  }
  cerrarDialogo()
}

const editarUsuario = (usuario: Usuario) => {
  usuarioEditando.value = { ...usuario }
  form.value = { nombre: usuario.nombre, correo: usuario.correo, rolId: usuario.rolId }
  dialogo.value = true
}

const eliminarUsuario = (id: number) => {
  usuarios.value = usuarios.value.filter(u => u.id !== id)
}

const obtenerNombreRol = (rolId: number) => {
  const rol = roles.value.find(r => r.id === rolId)
  return rol ? rol.nombre : 'Sin rol'
}

</script>
