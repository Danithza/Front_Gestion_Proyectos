<template>
  <v-dialog v-model="dialogo" max-width="600px">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">Agregar Usuario</v-btn>
    </template>

    <v-card>
      <v-card-title>
        {{ usuarioEditando ? 'Editar Usuario' : 'Agregar Usuario' }}
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field v-model="form.nombre" label="Nombre" />
          <v-text-field v-model="form.apellido" label="Apellido" />
          <v-text-field v-model="form.username" label="Username" />
          <v-text-field v-model="form.password" label="Password" type="password" />
          <v-text-field v-model="form.documentoId" label="Documento ID" />
          <v-text-field v-model="form.correo" label="Correo" />
          <v-text-field v-model="form.rolId" label="Rol ID" type="number" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="guardarUsuario">Guardar</v-btn>
        <v-btn color="grey darken-1" text @click="dialogo = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps<{
  usuarioEditando: null | {
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
}>()

const emit = defineEmits(['guardar'])

// Model para controlar el modal desde fuera
const dialogo = defineModel<boolean>('dialogo')

// Formulario reactivo
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

// Rellena el formulario al editar
watch(() => props.usuarioEditando, (usuario) => {
  if (usuario) {
    form.value = {
      nombre: usuario.nombre ?? '',
      apellido: usuario.apellido ?? '',
      username: usuario.username ?? '',
      password: usuario.password ?? '',
      documentoId: usuario.documentoId ?? '',
      correo: usuario.correo ?? '',
      rolId: usuario.rolId ?? 0,
      fotoPreview: usuario.fotoPreview ?? ''
    }
    dialogo.value = true
  } else {
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
  }
})

// Guardar usuario
function guardarUsuario() {
  emit('guardar', { ...form.value })
  dialogo.value = false
}
</script>
