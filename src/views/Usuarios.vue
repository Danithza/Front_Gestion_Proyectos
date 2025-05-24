<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="6">
        <h2 class="text-h5 font-weight-bold">Gestión de Usuarios</h2>
      </v-col>
      <v-col cols="6" class="text-right">
        <!-- SOLO este botón que está dentro del componente -->
        <AgregarUsuario
          v-model:dialogo="dialogo"
          :usuario-editando="usuarioEditando"
          @guardar="guardarUsuario"
        />
      </v-col>
    </v-row>

    <!-- Tarjetas de usuarios -->
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
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import AgregarUsuario from '@/components/AgregarUsuario.vue'

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

interface Rol {
  id: number
  nombre: string
}

const roles = ref<Rol[]>([
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Programador Frontend' },
  { id: 3, nombre: 'Programador Backend' },
  { id: 4, nombre: 'Vendedor' },
  { id: 5, nombre: 'Soporte' },
  { id: 6, nombre: 'Cliente' }
])

const usuarios = ref<Usuario[]>([])

onMounted(() => {
  const datosGuardados = localStorage.getItem('usuarios')
  if (datosGuardados) {
    usuarios.value = JSON.parse(datosGuardados)
  }
})

watch(usuarios, nuevos => {
  localStorage.setItem('usuarios', JSON.stringify(nuevos))
}, { deep: true })

const dialogo = ref(false)
const usuarioEditando = ref<Usuario | null>(null)

const editarUsuario = (usuario: Usuario) => {
  usuarioEditando.value = { ...usuario }
  dialogo.value = true
}

const eliminarUsuario = (id: number) => {
  usuarios.value = usuarios.value.filter(u => u.id !== id)
}

const obtenerNombreRol = (rolId: number) => {
  const rol = roles.value.find(r => r.id === rolId)
  return rol ? rol.nombre : 'Sin rol'
}

const guardarUsuario = (nuevoUsuario: Usuario) => {
  if (usuarioEditando.value) {
    const index = usuarios.value.findIndex(u => u.id === usuarioEditando.value?.id)
    if (index !== -1) {
      usuarios.value[index] = { ...nuevoUsuario, id: usuarioEditando.value.id }
    }
  } else {
    const nuevoId = usuarios.value.length ? Math.max(...usuarios.value.map(u => u.id)) + 1 : 1
    usuarios.value.push({ ...nuevoUsuario, id: nuevoId })
  }
  dialogo.value = false
}
</script>
