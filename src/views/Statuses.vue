<template>
  <v-container>
    <!-- Título y botones -->
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="6">
        <h2 class="text-h4 font-weight-bold">📋 Gestión de Estados</h2>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="primary" dark @click="openCreateModal">
          <v-icon left>mdi-plus-circle-outline</v-icon> Nuevo Estado
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

    <!-- Tarjetas de Estados -->
    <v-row dense>
      <v-col cols="12" md="4" v-for="item in filteredStatuses" :key="item.id">
        <v-card class="rounded-lg pa-4" :style="{ border: '2px solid #1976d2' }">
          <v-card-title class="font-weight-bold text-h6">
            <v-icon left>mdi-checkbox-marked-circle-outline</v-icon> {{ item.title }}
          </v-card-title>
          <v-card-subtitle class="mb-2 text-body-2">📝 {{ item.description }}</v-card-subtitle>
          <v-card-text>
            <span class="font-weight-bold">Tipo:</span> {{ item.type === 'task' ? 'Tarea' : 'Proyecto' }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn icon @click="editStatus(item)">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn icon @click="confirmDelete(item.id)">
              <v-icon color="red">mdi-trash-can-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal Crear/Editar Estado -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="bg-primary text-white">
          <v-icon left>mdi-note-edit-outline</v-icon>
          {{ editingStatus ? 'Editar Estado' : 'Crear Estado' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="statusForm.title"
              label="Título"
              dense
              :rules="[...titleRules, validateDuplicateTitle]"
              @input="filterOnlyLettersAndSpaces('title')"
            />
            <v-textarea
              v-model="statusForm.description"
              label="Descripción"
              dense
              :rules="[v => !!v || 'Descripción es obligatoria']"
            />
            <v-select
              v-model="statusForm.type"
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
            @click="saveStatus"
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
        <v-card-text>¿Estás seguro de que deseas eliminar este estado?</v-card-text>
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

interface Status {
  id: number;
  title: string;
  description: string;
  type: 'task' | 'project';
}

const statuses = ref<Status[]>([]);
const dialog = ref(false);
const editingStatus = ref<Status | null>(null);
const statusForm = ref<Status>({ id: 0, title: '', description: '', type: 'task' });
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
const resetFilters = () => filters.value = { title: '', type: '', search: '' };

// Filtrado de estados
const filteredStatuses = computed(() =>
  statuses.value.filter(status =>
    (!filters.value.title || status.title.toLowerCase().includes(filters.value.title.toLowerCase())) &&
    (!filters.value.type || status.type.toLowerCase().includes(filters.value.type.toLowerCase())) &&
    (!filters.value.search ||
      status.title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      status.description.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      status.type.toLowerCase().includes(filters.value.search.toLowerCase()))
  )
);

// Obtener títulos y tipos únicos para los filtros
const uniqueTitles = computed(() => Array.from(new Set(statuses.value.map(status => status.title))));
const uniqueTypes = computed(() => Array.from(new Set(statuses.value.map(status => status.type))));

// Validaciones
const onlyLettersAndSpacesRegex = /^[\p{L}\s]+$/u;
const titleRules = [
  (v: string) => !!v || 'Campo obligatorio',
  (v: string) => onlyLettersAndSpacesRegex.test(v) || 'Solo letras y espacios permitidos',
];

const validateDuplicateTitle = (v: string) => {
  if (!v) return true;
  const exists = statuses.value.some(s =>
    s.title.toLowerCase() === v.toLowerCase() &&
    (!editingStatus.value || s.id !== editingStatus.value.id)
  );
  hasDuplicate.value = exists;
  return !exists || 'Este título ya existe';
};

watch(() => statusForm.value.title, (newVal) => validateDuplicateTitle(newVal));

function filterOnlyLettersAndSpaces(field: 'title') {
  const val = statusForm.value[field];
  statusForm.value[field] = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
}

// CRUD funciones
const fetchStatuses = async () => {
  try {
    const response = await service.index<Status[]>(CONFIG.api.statuses);
    statuses.value = response;
  } catch (error) {
    showSnackbar('Error al obtener estados', 'error');
  }
};

const openCreateModal = () => {
  editingStatus.value = null;
  statusForm.value = { id: 0, title: '', description: '', type: 'task' };
  dialog.value = true;
};

const editStatus = (status: Status) => {
  editingStatus.value = status;
  statusForm.value = { ...status };
  dialog.value = true;
};

const saveStatus = async () => {
  if (hasDuplicate.value) return;
  isSaving.value = true;
  try {
    if (editingStatus.value) {
      await service.update(CONFIG.api.statuses, editingStatus.value.id.toString(), statusForm.value);
      const index = statuses.value.findIndex(s => s.id === editingStatus.value?.id);
      if (index !== -1) statuses.value[index] = { ...statusForm.value };
      showSnackbar('Estado actualizado', 'success');
    } else {
      const response = await service.store<Status>(CONFIG.api.statuses, statusForm.value);
      statuses.value.push(response);
      showSnackbar('Estado creado', 'success');
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
      await service.delete(CONFIG.api.statuses, idToDelete.value.toString());
      statuses.value = statuses.value.filter(s => s.id !== idToDelete.value);
      showSnackbar('Estado eliminado', 'success');
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

const showSnackbar = (message: string, color: string) => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(fetchStatuses);
</script>
