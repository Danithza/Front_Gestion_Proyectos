<template>
  <v-dialog v-model="dialog" max-width="900">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">Crear Proyecto</v-btn>
    </template>

    <v-card class="pa-6 rounded-xl elevation-4">
      <v-card-title class="text-h5 font-weight-bold">Crear Proyecto</v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submitProyecto">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field v-model="proyecto.titulo" label="Título" required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="proyecto.precio" label="Precio" type="number" prefix="$" required />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="proyecto.descripcion" label="Descripción" auto-grow />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="proyecto.fecha_inicio" label="Fecha Inicio" type="date" required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="proyecto.fecha_final" label="Fecha Final" type="date" required />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="proyecto.encargado"
                :items="usuarios"
                label="Encargado"
                item-title="nombre"
                item-value="id"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="proyecto.estado"
                :items="estados"
                label="Estado"
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
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="tareaDescripcion"
                label="Descripción de Tarea"
                placeholder="Opcional"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text color="error" @click="dialog = false">Cancelar</v-btn>
        <v-btn color="primary" @click="submitProyecto">Crear Proyecto</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['proyecto-creado']);
const dialog = ref(false);

const router = useRouter();
const form = ref();

const proyecto = ref({
  titulo: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_final: '',
  precio: 0,
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

function submitProyecto() {
  console.log('Proyecto creado:', proyecto.value);
  emit('proyecto-creado', proyecto.value);
  dialog.value = false;

  if (tareaDescripcion.value.trim()) {
    router.push({ name: 'Tareas' });
  }
}
</script>

<style scoped>
.v-card-title {
  background-color: #f5f5f5;
  color: #b88c3a;
}
</style>
