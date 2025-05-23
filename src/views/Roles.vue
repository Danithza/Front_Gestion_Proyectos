<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-6 text-blue-darken-2">Gestión de Roles</h2>

    <v-row dense>
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        v-for="rol in roles"
        :key="rol.id"
        class="d-flex"
      >
        <v-card
          :color="rol.activo ? 'blue-lighten-5' : 'grey-lighten-3'"
          class="flex-grow-1 d-flex flex-column justify-space-between"
          height="280"
          elevation="3"
        >
          <div>
            <v-card-title class="text-h6 text-blue-darken-2">
              {{ rol.nombre }}
            </v-card-title>
            <v-card-subtitle
              class="text-subtitle-2"
              :class="rol.activo ? 'text-green' : 'text-red'"
            >
              {{ rol.activo ? 'Activo' : 'Inactivo' }}
            </v-card-subtitle>

            <v-card-subtitle class="text-subtitle-2 text-blue-grey-darken-1">
              {{ rol.descripcion }}
            </v-card-subtitle>

            <v-card-text class="pt-2">
              <strong class="text-blue-darken-3">Permisos:</strong>
              <v-chip-group column class="mt-2" style="max-height: 100px; overflow-y: auto;">
                <v-chip
                  v-for="permiso in rol.permisos"
                  :key="permiso"
                  size="small"
                  color="blue-lighten-2"
                  text-color="white"
                  class="ma-1"
                  variant="elevated"
                >
                  {{ permiso }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
          </div>

          <v-card-actions class="justify-end">
            <v-btn icon variant="text" color="blue-darken-1" @click="editarRol(rol)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="blue-darken-3" @click="eliminarRol(rol.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              :color="rol.activo ? 'green darken-2' : 'red darken-2'"
              @click="toggleActivo(rol)"
              :title="rol.activo ? 'Desactivar rol' : 'Activar rol'"
            >
              <v-icon>{{ rol.activo ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      color="blue-darken-2"
      class="mt-6"
      prepend-icon="mdi-plus"
      @click="agregarRol"
      variant="elevated"
    >
      Agregar Rol
    </v-btn>

    <!-- Modal de formulario -->
    <v-dialog v-model="mostrarFormulario" max-width="600px">
      <FormularioRol
        :rol="rolSeleccionado"
        :modo-edicion="modoEdicion"
        @guardar="guardarRol"
        @cancelar="mostrarFormulario = false"
      />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import FormularioRol from '@/components/FormularioRol.vue'

interface Rol {
  id: number
  nombre: string
  descripcion: string
  permisos: string[]
  activo: boolean
}

const STORAGE_KEY = 'roles_app'

const roles = ref<Rol[]>([])
const rolSeleccionado = ref<Rol>({
  id: 0,
  nombre: '',
  descripcion: '',
  permisos: [],
  activo: true
})
const modoEdicion = ref(false)
const mostrarFormulario = ref(false)

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  roles.value = saved ? JSON.parse(saved) : []
})

watch(
  roles,
  newVal => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true }
)

const agregarRol = () => {
  rolSeleccionado.value = {
    id: 0,
    nombre: '',
    descripcion: '',
    permisos: [],
    activo: true
  }
  modoEdicion.value = false
  mostrarFormulario.value = true
}

const editarRol = (rol: Rol) => {
  rolSeleccionado.value = { ...rol }
  modoEdicion.value = true
  mostrarFormulario.value = true
}

const guardarRol = (rol: Rol) => {
  if (modoEdicion.value) {
    const index = roles.value.findIndex(r => r.id === rol.id)
    if (index !== -1) {
      roles.value[index] = { ...rol }
    }
  } else {
    const nuevoId = roles.value.length ? Math.max(...roles.value.map(r => r.id)) + 1 : 1
    roles.value.push({ ...rol, id: nuevoId })
  }
  mostrarFormulario.value = false
}

const eliminarRol = (id: number) => {
  roles.value = roles.value.filter(r => r.id !== id)
}

const toggleActivo = (rol: Rol) => {
  const index = roles.value.findIndex(r => r.id === rol.id)
  if (index !== -1) {
    roles.value[index].activo = !roles.value[index].activo
  }
}
</script>

<style scoped>
.text-green {
  color: #388e3c; /* verde */
}
.text-red {
  color: #d32f2f; /* rojo */
}
</style>
