<template>
  <v-dialog v-model="dialog" max-width="900" persistent>
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary" class="text-white font-bold">
        + Crear Proyecto
      </v-btn>
    </template>

    <v-card class="pa-6 rounded-2xl elevation-10">
      <v-card-title class="text-h5 font-weight-bold text-primary mb-2">
        🗂️ Nuevo Proyecto
      </v-card-title>

      <v-divider class="mb-4" />

      <v-card-text>
        <v-form ref="form" v-model="formValid" @submit.prevent="submitProyecto">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="proyecto.titulo"
                label="Título del Proyecto"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-format-title"
                placeholder="Ej: Rediseño de sitio web"
                clearable
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="proyecto.precio"
                label="Presupuesto (USD)"
                type="number"
                prefix="$"
                :rules="[rules.required, rules.numeric]"
                prepend-inner-icon="mdi-cash-multiple"
                placeholder="Ej: 1500"
                clearable
                required
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="proyecto.descripcion"
                label="Descripción"
                auto-grow
                rows="2"
                prepend-inner-icon="mdi-text"
                placeholder="Describe los objetivos del proyecto"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="proyecto.fecha_inicio"
                label="Fecha de Inicio"
                type="date"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-calendar-start"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="proyecto.fecha_final"
                label="Fecha de Finalización"
                type="date"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-calendar-end"
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="proyecto.encargado"
                :items="usuarios"
                label="Encargado"
                item-title="nombre"
                item-value="id"
                prepend-inner-icon="mdi-account-tie"
                :rules="[rules.required]"
                placeholder="Selecciona un responsable"
                clearable
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="proyecto.estado"
                :items="estados"
                label="Estado del Proyecto"
                prepend-inner-icon="mdi-flag"
                :rules="[rules.required]"
                clearable
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="proyecto.cliente"
                :items="clientes"
                label="Cliente"
                item-title="nombre"
                item-value="id"
                prepend-inner-icon="mdi-account-box"
                :rules="[rules.required]"
                clearable
                required
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="tareaDescripcion"
                label="Descripción de tarea (opcional)"
                placeholder="Ej: Crear wireframes"
                prepend-inner-icon="mdi-playlist-plus"
                clearable
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider class="my-4" />

      <v-card-actions class="justify-end">
        <v-btn color="grey-lighten-2" text @click="closeDialog">
          Cancelar
        </v-btn>
        <v-btn color="primary" class="text-white" @click="submitProyecto">
          Guardar Proyecto
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['proyecto-creado']);
const router = useRouter();

const dialog = ref(false);
const form = ref();
const formValid = ref(false);

const proyecto = ref({
  titulo: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_final: '',
  precio: null,
  encargado: null,
  estado: '',
  cliente: null,
});

const tareaDescripcion = ref('');

const usuarios = ref([
  { id: 1, nombre: 'Ana López' },
  { id: 2, nombre: 'Carlos Méndez' },
]);

const estados = ref(['Planificado', 'En progreso', 'Completado', 'En espera']);

const clientes = ref([
  { id: 1, nombre: 'Cliente A' },
  { id: 2, nombre: 'Cliente B' },
]);

const rules = {
  required: (value: any) => !!value || 'Este campo es obligatorio',
  numeric: (value: any) => !isNaN(value) || 'Debe ser un número válido',
};

function resetForm() {
  proyecto.value = {
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_final: '',
    precio: null,
    encargado: null,
    estado: '',
    cliente: null,
  };
  tareaDescripcion.value = '';
  form.value?.resetValidation();
}

function closeDialog() {
  dialog.value = false;
  resetForm();
}

async function submitProyecto() {
  const isValid = await form.value?.validate();
  if (!isValid.valid) return;

  emit('proyecto-creado', proyecto.value);
  dialog.value = false;
  resetForm();

  if (tareaDescripcion.value.trim()) {
    router.push({ name: 'Tareas' });
  }
}
</script>

<style scoped>
.v-card-title {
  background-color: #f3f4f6;
}
</style>
