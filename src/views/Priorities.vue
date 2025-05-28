<template>
  <v-container>
    <!-- Título y botones -->
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="6">
        <h2 class="text-h4 font-weight-bold">📌 Gestión de Prioridades</h2>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="primary" dark @click="openCreateModal">
          <v-icon left>mdi-plus-circle-outline</v-icon> Nueva Prioridad
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-row class="mb-4" dense>
      <v-col cols="12" sm="4">
        <v-autocomplete
          v-model="filters.title"
          :items="uniqueTitles"
          label="Filtrar por Título"
          clearable
          dense
          outlined
          prepend-inner-icon="mdi-filter"
          hide-no-data
          :search-input.sync="searchTitle"
          @click:clear="resetFilters"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-autocomplete
          v-model="filters.type"
          :items="uniqueTypes"
          label="Filtrar por Tipo"
          clearable
          dense
          outlined
          prepend-inner-icon="mdi-filter"
          hide-no-data
          :search-input.sync="searchType"
          @click:clear="resetFilters"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="filters.search"
          label="Buscar"
          clearable
          dense
          outlined
          prepend-inner-icon="mdi-magnify"
          @click:clear="resetFilters"
        />
      </v-col>
    </v-row>

    <!-- Tarjetas de Prioridades -->
    <v-row dense>
      <v-col cols="12" md="4" v-for="item in filteredPriorities" :key="item.id">
        <v-card class="rounded-lg pa-4" :style="{ border: '2px solid #1976d2' }">
          <v-card-title class="font-weight-bold text-h6">
            <v-icon left>mdi-flag-outline</v-icon> {{ item.title }}
          </v-card-title>
          <v-card-subtitle class="mb-2 text-body-2">📝 {{ item.description }}</v-card-subtitle>
          <v-card-text>
            <span class="font-weight-bold">Tipo:</span> {{ item.type === 'task' ? 'Tarea' : 'Proyecto' }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn icon @click="editPriority(item)">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn icon @click="confirmDelete(item.id)">
              <v-icon color="red">mdi-trash-can-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal Crear/Editar Prioridad -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="bg-primary text-white">
          <v-icon left>mdi-note-edit-outline</v-icon>
          {{ editingPriority ? 'Editar Prioridad' : 'Crear Prioridad' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="priorityForm.title"
              label="Título"
              dense
              :rules="[...titleRules, validateDuplicateTitle]"
              @input="filterOnlyLettersAndSpaces('title')"
            />
            <v-textarea
              v-model="priorityForm.description"
              label="Descripción"
              dense
              :rules="[v => !!v || 'Descripción es obligatoria']"
            />
            <v-select
              v-model="priorityForm.type"
              :items="types"
              label="Tipo"
              dense
              :rules="[v => !!v || 'Tipo es obligatorio']"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeModal" :disabled="isSaving">Cancelar</v-btn>
          <v-btn 
            color="primary" 
            dark 
            @click="savePriority"
            :loading="isSaving"
            :disabled="isSaving || hasDuplicate"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmación eliminar -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400px">
      <v-card class="rounded-lg">
        <v-card-title class="text-h6 font-weight-bold">⚠️ Confirmar eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar esta prioridad?</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" dark @click="deleteConfirmed">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface Priority {
  id: number;
  title: string;
  description: string;
  type: 'task' | 'project';
}

const priorities = ref<Priority[]>([]);
const dialog = ref(false);
const editingPriority = ref<Priority | null>(null);
const priorityForm = ref<Priority>({
  id: 0,
  title: '',
  description: '',
  type: 'task',
});

const types = ['task', 'project'];

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const isSaving = ref(false);
const hasDuplicate = ref(false);
const confirmDeleteDialog = ref(false);
const idToDelete = ref<number | null>(null);

// Filtros
const filters = ref({ title: '', type: '', search: '' });
const searchTitle = ref('');
const searchType = ref('');
const resetFilters = () => filters.value = { title: '', type: '', search: '' };

// Autocompletado
const uniqueTitles = computed(() => Array.from(new Set(priorities.value.map(p => p.title))));
const uniqueTypes = computed(() => Array.from(new Set(priorities.value.map(p => p.type === 'task' ? 'Tarea' : 'Proyecto'))));

// Filtrado de prioridades
const filteredPriorities = computed(() =>
  priorities.value.filter(priority =>
    (!filters.value.title || priority.title.toLowerCase().includes(filters.value.title.toLowerCase())) &&
    (!filters.value.type || (priority.type === 'task' ? 'Tarea' : 'Proyecto').toLowerCase().includes(filters.value.type.toLowerCase())) &&
    (!filters.value.search ||
      priority.title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      priority.description.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      (priority.type === 'task' ? 'Tarea' : 'Proyecto').toLowerCase().includes(filters.value.search.toLowerCase()))
  )
);

// Validaciones
const onlyLettersAndSpacesRegex = /^[\p{L}\s]+$/u;
const titleRules = [
  (v: string) => !!v || 'Campo obligatorio',
  (v: string) => onlyLettersAndSpacesRegex.test(v) || 'Solo letras y espacios permitidos',
];

const validateDuplicateTitle = (v: string) => {
  if (!v) return true;
  const exists = priorities.value.some(p =>
    p.title.toLowerCase() === v.toLowerCase() &&
    (!editingPriority.value || p.id !== editingPriority.value.id)
  );
  hasDuplicate.value = exists;
  return !exists || 'Este título ya existe';
};

watch(() => priorityForm.value.title, (newVal) => validateDuplicateTitle(newVal));

function filterOnlyLettersAndSpaces(field: 'title') {
  const val = priorityForm.value[field];
  priorityForm.value[field] = val.replace(/[^\p{L}\s]/gu, '');
}

// CRUD funciones
const fetchPriorities = async () => {
  try {
    const response = await service.index<Priority[]>(CONFIG.api.priorities);
    priorities.value = response;
  } catch (error) {
    showSnackbar('Error al obtener prioridades', 'error');
  }
};

const openCreateModal = () => {
  editingPriority.value = null;
  priorityForm.value = { id: 0, title: '', description: '', type: 'task' };
  dialog.value = true;
};

const editPriority = (priority: Priority) => {
  editingPriority.value = priority;
  priorityForm.value = { ...priority };
  dialog.value = true;
};

const savePriority = async () => {
  if (hasDuplicate.value) return;
  isSaving.value = true;
  try {
    if (editingPriority.value) {
      await service.update(CONFIG.api.priorities, editingPriority.value.id.toString(), priorityForm.value);
      const index = priorities.value.findIndex(p => p.id === editingPriority.value?.id);
      if (index !== -1) priorities.value[index] = { ...priorityForm.value };
      showSnackbar('Prioridad actualizada', 'success');
    } else {
      const response = await service.store<Priority>(CONFIG.api.priorities, priorityForm.value);
      priorities.value.push(response);
      showSnackbar('Prioridad creada', 'success');
    }
    dialog.value = false;
  } catch (error) {
    showSnackbar('Error al guardar', 'error');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = (id: number) => {
  idToDelete.value = id;
  confirmDeleteDialog.value = true;
};

const deleteConfirmed = async () => {
  if (idToDelete.value !== null) {
    try {
      await service.delete(CONFIG.api.priorities, idToDelete.value.toString());
      priorities.value = priorities.value.filter(p => p.id !== idToDelete.value);
      showSnackbar('Prioridad eliminada', 'success');
    } catch (error) {
      showSnackbar('Error al eliminar', 'error');
    } finally {
      confirmDeleteDialog.value = false;
      idToDelete.value = null;
    }
  }
};

const closeModal = () => {
  dialog.value = false;
};

const showSnackbar = (message: string, color = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(fetchPriorities);
</script>