<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="6">
        <h2 class="text-h5 font-weight-bold">Gestión de Usuarios</h2>
      </v-col>
      <v-col cols="6" class="text-end">
        <v-btn color="primary" @click="abrirDialogo">Agregar Usuario</v-btn>
      </v-col>
    </v-row>

    <!-- Vista de tarjetas -->
    <v-row>
      <v-col
        v-for="usuario in usuarios"
        :key="usuario.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="pa-3">
          <v-avatar size="80" class="mb-3 mx-auto">
            <v-img :src="usuario.fotoPreview || 'https://via.placeholder.com/80'" />
          </v-avatar>
          <div class="text-center font-weight-bold text-subtitle-1">
            {{ usuario.nombre }} {{ usuario.apellido }}
          </div>
          <div class="text-center text-caption mb-2">
            {{ usuario.username }} | {{ obtenerNombreRol(usuario.rolId) }}
          </div>
          <div class="d-flex justify-center">
            <v-icon class="me-2" color="primary" @click="editarUsuario(usuario)">mdi-pencil</v-icon>
            <v-icon color="red" @click="eliminarUsuario(usuario.id)">mdi-delete</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de formulario -->
    <v-dialog v-model="dialogo" max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario' }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Nombre" v-model="form.nombre" />
          <v-text-field label="Apellido" v-model="form.apellido" />
          <v-text-field label="Username" v-model="form.username" />
          <v-text-field label="Password" v-model="form.password" type="password" />
          <v-text-field label="Documento ID" v-model="form.documentoId" />
          <v-text-field label="Correo" v-model="form.correo" type="email" />
          <v-select
            :items="roles"
            item-title="nombre"
            item-value="id"
            label="Rol"
            v-model="form.rolId"
          />
          <!-- Foto -->
          <v-file-input
            label="Foto"
            prepend-icon="mdi-camera"
            accept="image/*"
            @change="handleFotoSeleccionada"
          />
          <v-avatar size="80" class="mt-3" v-if="form.fotoPreview">
            <v-img :src="form.fotoPreview" />
          </v-avatar>
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
}

interface Usuario {
  id: number
  nombre: string
  apellido: string
  username: string
  password: string
  documentoId: string
  correo: string
  rolId: number
  fotoPreview?: string
}

const roles = ref<Rol[]>([
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Programador Frontend' },
  { id: 3, nombre: 'Programador Backend' },
  { id: 4, nombre: 'Vendedor' },
  { id: 5, nombre: 'Soporte' },
  { id: 6, nombre: 'Cliente' }
])

const usuarios = ref<Usuario[]>([
  {
    id: 1,
    nombre: 'Carlos',
    apellido: 'Gómez',
    username: 'cgomez',
    password: '123456',
    documentoId: '12345678',
    correo: 'carlos@example.com',
    rolId: 1,
    fotoPreview: ''
  },
  {
    id: 2,
    nombre: 'Ana',
    apellido: 'Ruiz',
    username: 'aruiz',
    password: 'abcdef',
    documentoId: '87654321',
    correo: 'ana@example.com',
    rolId: 2,
    fotoPreview: ''
  }
])

const dialogo = ref(false)
const usuarioEditando = ref<Usuario | null>(null)

const form = ref({
  nombre: '',
  apellido: '',
  username: '',
  password: '',
  documentoId: '',
  correo: '',
  rolId: 0,
  fotoPreview: ''
})

const abrirDialogo = () => {
  usuarioEditando.value = null
  form.value = {
    nombre: '',
    apellido: '',
    username: '',
    password: '',
    documentoId: '',
    correo: '',
    rolId: 0,
    fotoPreview: ''
  }
  dialogo.value = true
}

const cerrarDialogo = () => {
  dialogo.value = false
}

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
  form.value = {
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    username: usuario.username,
    password: usuario.password,
    documentoId: usuario.documentoId,
    correo: usuario.correo,
    rolId: usuario.rolId,
    fotoPreview: usuario.fotoPreview || ''
  }
  dialogo.value = true
}

const eliminarUsuario = (id: number) => {
  usuarios.value = usuarios.value.filter(u => u.id !== id)
}

const obtenerNombreRol = (rolId: number) => {
  const rol = roles.value.find(r => r.id === rolId)
  return rol ? rol.nombre : 'Sin rol'
}

// Manejo de imagen local
const handleFotoSeleccionada = (e: Event) => {
  const file = (e.target as HTMLInputElement)?.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      form.value.fotoPreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}
</script>
