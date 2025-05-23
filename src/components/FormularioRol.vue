<template>
  <v-card>
    <v-card-title class="text-h6 text-primary">
      {{ modoEdicion ? 'Editar Rol' : 'Nuevo Rol' }}
    </v-card-title>

    <v-card-text>
      <v-form ref="formRef" @submit.prevent="emitirGuardar">
        <v-text-field
          v-model="form.nombre"
          label="Nombre del rol"
          :rules="[requerido, max50]"
          required
        />

        <v-textarea
          v-model="form.descripcion"
          label="Descripción del rol"
          :rules="[requerido, max250]"
          auto-grow
          rows="3"
        />

        <v-combobox
          v-model="form.permisos"
          :items="permisosDisponibles"
          label="Permisos asignados"
          multiple
          chips
          clearable
          :rules="[alMenosUno]"
        />

        <v-select
          v-model="form.estado"
          :items="['Activo', 'Inactivo']"
          label="Estado del rol"
          :rules="[requerido]"
        />

        <div class="d-flex justify-end mt-4">
          <v-btn color="grey-darken-1" variant="outlined" class="me-2" @click="$emit('cancelar')">
            Cancelar
          </v-btn>
          <v-btn color="blue-darken-2" variant="elevated" type="submit">
            {{ modoEdicion ? 'Guardar cambios' : 'Crear rol' }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { VForm } from 'vuetify/components'

interface Rol {
  id?: number
  nombre: string
  descripcion: string
  permisos: string[]
  estado: string
}

const props = defineProps<{
  rol: Rol
  modoEdicion: boolean
}>()

const emit = defineEmits<{
  (e: 'guardar', rol: Rol): void
  (e: 'cancelar'): void
}>()

const formRef = ref<InstanceType<typeof VForm> | null>(null)
const form = ref<Rol>({ ...props.rol })

watch(() => props.rol, nuevo => {
  form.value = { ...nuevo }
})

// Reglas reutilizables
const requerido = (v: string | unknown[]) => !!v && v.length > 0 || 'Este campo es obligatorio'
const max50 = (v: string) => v.length <= 50 || 'Máximo 50 caracteres'
const max250 = (v: string) => v.length <= 250 || 'Máximo 250 caracteres'
const alMenosUno = (v: unknown[]) => (v?.length ?? 0) > 0 || 'Debes asignar al menos un permiso'

// Lista de permisos (puede venir del padre en el futuro)
const permisosDisponibles = [
  'Ver proyectos',
  'Crear proyectos',
  'Editar proyectos',
  'Eliminar proyectos',
  'Gestionar tareas',
  'Administrar usuarios',
  'Ver reportes',
  'Gestionar roles',
  'Acceder configuración',
  'Asignar tareas'
]

const emitirGuardar = async () => {
  const { valid } = await formRef.value?.validate() || {}
  if (valid) emit('guardar', { ...form.value })
}
</script>
