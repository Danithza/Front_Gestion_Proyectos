<template>
  <v-dialog v-model="dialog" max-width="600">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">Agregar tarea</v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h6">Agregar nueva tarea</v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="guardarTarea">
          <v-text-field
            v-model="form.titulo"
            label="Título"
            required
          ></v-text-field>

          <v-textarea
            v-model="form.descripcion"
            label="Descripción"
            required
          ></v-textarea>

          <v-select
            v-model="form.encargado"
            :items="usuarios"
            label="Encargado"
            required
          ></v-select>

          <v-select
            v-model="form.proyecto"
            :items="proyectos"
            label="Proyecto"
          ></v-select>

          <v-select
            v-model="form.estado"
            :items="estados"
            label="Estado"
            required
          ></v-select>

          <v-select
            v-model="form.prioridad"
            :items="prioridades"
            label="Prioridad"
            required
          ></v-select>

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
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="dialog = false">Cancelar</v-btn>
        <v-btn color="primary" @click="guardarTarea">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref(false)
const menu = ref(false)

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

function guardarTarea() {
  const nuevaTarea = {
    ...form.value,
    id: Date.now(),
  }

  emit('tarea-creada', nuevaTarea)
  dialog.value = false

  // Reiniciar formulario
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
}
</script>
