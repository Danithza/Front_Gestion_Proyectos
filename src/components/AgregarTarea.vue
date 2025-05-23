<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">Agregar tarea</v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h6">📝 Agregar nueva tarea</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="formValid">
          <v-text-field
            v-model="form.titulo"
            label="Título"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-format-title"
            clearable
            required
          />

          <v-textarea
            v-model="form.descripcion"
            label="Descripción"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-text"
            clearable
            required
          />

          <v-select
            v-model="form.encargado"
            :items="usuarios"
            label="Encargado"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account"
            clearable
            required
          />

          <v-select
            v-model="form.proyecto"
            :items="proyectos"
            label="Proyecto"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-folder"
            clearable
            required
          />

          <v-select
            v-model="form.estado"
            :items="estados"
            label="Estado"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-flag"
            clearable
            required
          />

          <v-select
            v-model="form.prioridad"
            :items="prioridades"
            label="Prioridad"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-alert"
            clearable
            required
          />

          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="form.fecha_limite"
                label="Fecha Límite"
                readonly
                v-bind="props"
                prepend-inner-icon="mdi-calendar"
              />
            </template>
            <v-date-picker
              v-model="form.fecha_limite"
              @input="menu = false"
              scrollable
            />
          </v-menu>

          <v-textarea
            v-model="form.comentario"
            label="Comentario"
            prepend-inner-icon="mdi-comment"
            clearable
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="dialog = false">Cancelar</v-btn>
        <v-btn color="primary" :disabled="!formValid" @click="guardarTarea">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref(false)
const menu = ref(false)
const formRef = ref()
const formValid = ref(false)

const usuarios = ['Ana', 'Luis', 'Carlos']
const proyectos = ['Proyecto A', 'Proyecto B']
const estados = ['Por hacer', 'En proceso', 'Hecho']
const prioridades = ['Baja', 'Media', 'Alta']

const form = ref({
  titulo: '',
  descripcion: '',
  encargado: '',
  estado: 'Por hacer',
  prioridad: '',
  fecha_limite: '',
  proyecto: '',
  comentario: '',
})

const emit = defineEmits(['tarea-creada'])

const rules = {
  required: (value: any) => !!value || 'Este campo es obligatorio',
}

async function guardarTarea() {
  const isValid = await formRef.value?.validate()
  if (!isValid) return // Evita guardar si hay errores

  const nuevaTarea = {
    ...form.value,
    id: Date.now(),
  }

  emit('tarea-creada', nuevaTarea)
  dialog.value = false

  form.value = {
    titulo: '',
    descripcion: '',
    encargado: '',
    estado: 'Por hacer',
    prioridad: '',
    fecha_limite: '',
    proyecto: '',
    comentario: '',
  }

  formRef.value?.resetValidation()
}
</script>
