<template>
    <v-card>
      <v-card-title class="text-h6">
        {{ modoEdicion ? 'Editar Rol' : 'Nuevo Rol' }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="emitirGuardar" ref="formRef">
          <v-text-field
            v-model="form.nombre"
            label="Nombre del rol"
            :rules="[v => !!v || 'El nombre es requerido', v => v.length <= 50 || 'Máximo 50 caracteres']"
            required
          />
  
          <v-textarea
            v-model="form.descripcion"
            label="Descripción del rol"
            :rules="[v => !!v || 'La descripción es requerida', v => v.length <= 250 || 'Máximo 250 caracteres']"
            rows="3"
          />
  
          <v-combobox
            v-model="form.permisos"
            label="Permisos asignados"
            :items="permisosDisponibles"
            multiple
            chips
            clearable
            :rules="[v => v.length > 0 || 'Debes asignar al menos un permiso']"
          />
  
          <v-select
            v-model="form.estado"
            label="Estado del rol"
            :items="['Activo', 'Inactivo']"
            :rules="[v => !!v || 'Selecciona un estado']"
          />
  
          <div class="d-flex justify-end mt-4">
            <v-btn color="grey" class="me-2" @click="$emit('cancelar')">Cancelar</v-btn>
            <v-btn color="primary" type="submit">
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
  
  watch(() => props.rol, (nuevoRol) => {
    form.value = { ...nuevoRol }
  })
  
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
    const validacion = await formRef.value?.validate()
    if (validacion?.valid) {
      emit('guardar', { ...form.value })
    }
  }
  </script>
  