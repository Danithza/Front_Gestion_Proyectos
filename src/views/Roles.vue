<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-6 text-blue-darken-2">Gestión de Roles</h2>

    <v-row dense>
      <v-col
        v-for="rol in roles"
        :key="rol.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex"
      >
        <v-card
          :color="rol.activo ? 'blue-lighten-5' : 'grey-lighten-3'"
          class="flex-grow-1 d-flex flex-column justify-space-between"
          height="280"
          elevation="2"
        >
          <div>
            <v-card-title class="text-blue-darken-2 text-h6">
              {{ rol.nombre }}
            </v-card-title>

            <v-card-subtitle :class="rol.activo ? 'text-green' : 'text-red'">
              {{ rol.activo ? 'Activo' : 'Inactivo' }}
            </v-card-subtitle>

            <v-card-text class="py-2 text-blue-grey-darken-2">
              {{ rol.descripcion || 'Sin descripción' }}
            </v-card-text>

            <v-card-text class="pt-0">
              <strong class="text-blue-darken-3">Permisos:</strong>
              <v-chip-group column class="mt-2 overflow-y-auto" style="max-height: 90px;">
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
            <v-btn
              icon
              variant="text"
              color="blue-darken-1"
              @click="editarRol(rol)"
              aria-label="Editar rol"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              icon
              variant="text"
              color="blue-darken-3"
              @click="eliminarRol(rol.id)"
              aria-label="Eliminar rol"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-btn
              icon
              variant="text"
              :color="rol.activo ? 'green' : 'red'"
              @click="toggleActivo(rol)"
              :aria-label="rol.activo ? 'Desactivar rol' : 'Activar rol'"
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

    <!-- Diálogo con Formulario -->
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
import { ref, onMounted, watch } from 'vue'
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
  activo: true,
})
const modoEdicion = ref(false)
const mostrarFormulario = ref(false)

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  roles.value = saved ? JSON.parse(saved) : []
})

watch(roles, (nuevosRoles) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosRoles))
}, { deep: true })

function agregarRol() {
  rolSeleccionado.value = {
    id: 0,
    nombre: '',
    descripcion: '',
    permisos: [],
    activo: true,
  }
  modoEdicion.value = false
  mostrarFormulario.value = true
}

function editarRol(rol: Rol) {
  rolSeleccionado.value = { ...rol }
  modoEdicion.value = true
  mostrarFormulario.value = true
}

function guardarRol(rol: Rol) {
  if (modoEdicion.value) {
    const idx = roles.value.findIndex(r => r.id === rol.id)
    if (idx !== -1) roles.value[idx] = { ...rol }
  } else {
    const nuevoId = roles.value.length ? Math.max(...roles.value.map(r => r.id)) + 1 : 1
    roles.value.push({ ...rol, id: nuevoId })
  }
  mostrarFormulario.value = false
}

function eliminarRol(id: number) {
  roles.value = roles.value.filter(r => r.id !== id)
}

function toggleActivo(rol: Rol) {
  rol.activo = !rol.activo
}
</script>

<style scoped>
.text-green {
  color: #2e7d32;
}
.text-red {
  color: #c62828;
}
</style>
