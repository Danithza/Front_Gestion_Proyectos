<template>
  <v-container class="py-8">
    <!-- Título y botones -->
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h2 class="text-h4 font-weight-bold text-primary">📌 Gestión de Prioridades</h2>
        <p class="text-caption text-medium-emphasis">Administra las prioridades disponibles en la plataforma</p>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn
          color="primary"
          size="large"
          @click="openCreateModal"
          class="shadow-lg"
        >
          <v-icon left>mdi-plus-circle-outline</v-icon> Nueva Prioridad
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <!-- Filtros verticales -->
      <v-col cols="12" md="3" class="pr-md-6">
        <v-card class="pa-4 rounded-lg sticky-filter" elevation="2">
          <h3 class="text-h6 mb-4 d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-filter</v-icon>
            Filtros
          </h3>

          <v-autocomplete
            v-model="filters.title"
            :items="uniqueTitles"
            label="Filtrar por Título"
            clearable
            outlined
            dense
            prepend-inner-icon="mdi-format-title"
            hide-no-data
            @click:clear="resetFilters"
            class="mb-4"
          />

          <v-autocomplete
            v-model="filters.type"
            :items="types"
            item-title="text"
            item-value="value"
            label="Filtrar por Tipo"
            clearable
            outlined
            dense
            prepend-inner-icon="mdi-form-select"
            hide-no-data
            @click:clear="resetFilters"
            class="mb-4"
          />

          <v-text-field
            v-model="filters.search"
            label="Buscar prioridad"
            clearable
            outlined
            dense
            prepend-inner-icon="mdi-magnify"
            @click:clear="resetFilters"
          />

          <v-btn
            block
            color="secondary"
            variant="outlined"
            class="mt-2"
            @click="resetFilters"
          >
            Limpiar filtros
          </v-btn>
        </v-card>
      </v-col>

      <!-- Tarjetas de Prioridades -->
      <v-col cols="12" md="9">
        <transition-group name="list" tag="div" class="d-flex flex-wrap" style="gap: 16px;">
          <v-card
            v-for="item in filteredPriorities"
            :key="item.id"
            class="priority-card pa-4 rounded-xl"
            elevation="2"
            :style="{ borderLeft: '4px solid ' + getRandomColor() }"
          >
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="d-flex align-center">

                 <v-avatar size="40" color="black" class="mr-3">
                  <v-icon color="white">mdi-flag-outline</v-icon>
                </v-avatar>
                <div>
                  <span class="text-h6 font-weight-bold d-block">{{ item.title }}</span>
                  <span class="text-caption text-medium-emphasis">ID: {{ item.id }}</span>
                  <p class="text-caption mt-1">{{ item.description }}</p>
                </div>
              </div>
              <div class="d-flex align-center" style="gap: 8px;">
                <v-chip small :color="item.type === 'task' ? 'orange' : 'red'" text-color="white">
                  {{ item.type === 'task' ? 'Tarea' : 'Proyecto' }}
                </v-chip>
                <v-btn
                  icon
                  variant="text"
                  color="blue"
                  size="small"
                  @click="editPriority(item)"
                  title="Editar"
                >
                  <v-icon>mdi-pencil-box-multiple-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  color="red"
                  size="small"
                  @click="confirmDelete(item.id)"
                  title="Eliminar"
                >
                  <v-icon>mdi-delete-alert-outline</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </transition-group>

        <!-- Mensaje cuando no hay resultados con filtros -->
        <v-alert
          v-if="filteredPriorities.length === 0 && hasActiveFilters"
          type="info"
          variant="tonal"
          class="mt-4"
        >
          No se encontraron prioridades con los filtros aplicados
        </v-alert>

        <!-- Mensaje cuando no hay datos -->
        <v-alert
          v-if="priorities.length === 0 && !loading"
          type="info"
          variant="tonal"
          class="mt-4"
        >
          No hay prioridades registradas
        </v-alert>

        <!-- Cargando datos -->
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          class="mt-4"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Modal Crear/Editar Prioridad -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="rounded-lg">
        <v-toolbar :color="editingPriority ? 'blue-darken-2' : 'primary'" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon left>{{ editingPriority ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            {{ editingPriority ? 'Editar Prioridad' : 'Crear Prioridad' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal" variant="text" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="priorityForm.title"
              label="Nombre de la prioridad"
              outlined
              :rules="titleRules"
              @input="normalizePriorityName"
              class="mb-4"
            />

            <v-textarea
              v-model="priorityForm.description"
              label="Descripción"
              outlined
              :rules="descriptionRules"
              class="mb-4"
            />

            <v-select
              v-model="priorityForm.type"
              :items="types"
              item-title="text"
              item-value="value"
              label="Tipo"
              outlined
              :rules="typeRules"
              class="mb-4"
            />

            <v-alert
              v-if="hasDuplicate"
              type="error"
              variant="tonal"
              class="mb-4"
              border="start"
              border-color="error"
              density="compact"
              icon="mdi-alert-circle-outline"
            >
              <strong>Error:</strong> Esta prioridad ya existe (incluyendo variaciones con tildes o espacios)
            </v-alert>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="closeModal"
            :disabled="isSaving"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="isSaving"
            :disabled="isSaving || hasDuplicate"
            @click="savePriority"
            variant="elevated"
          >
            {{ editingPriority ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmación eliminar -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400px">
      <v-card class="rounded-lg">
        <v-toolbar color="red-darken-1" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon left>mdi-alert</v-icon>
            Confirmar eliminación
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pa-4">
          <div class="d-flex align-center mb-4">
            <v-icon color="red" size="large" class="mr-2">mdi-alert-circle-outline</v-icon>
            <span>¿Estás seguro de que deseas eliminar esta prioridad?</span>
          </div>
          <p class="text-caption text-medium-emphasis">Esta acción no se puede deshacer.</p>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="confirmDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="red"
            variant="elevated"
            @click="deleteConfirmed"
          >
            <v-icon left>mdi-delete</v-icon>
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="bottom right">
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ snackbarIcon }}</v-icon>
        {{ snackbarMessage }}
      </div>
      <template v-slot:actions>
        <v-btn icon @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
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
const loading = ref(false);
const dialog = ref(false);
const editingPriority = ref<Priority | null>(null);
const priorityForm = ref<Omit<Priority, 'id'> & { id?: number }>({
  title: '',
  description: '',
  type: 'task'
});

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const snackbarIcon = ref('mdi-check-circle');
const isSaving = ref(false);
const hasDuplicate = ref(false);
const confirmDeleteDialog = ref(false);
const idToDelete = ref<number | null>(null);

const types = [
  { text: 'Tarea', value: 'task' },
  { text: 'Proyecto', value: 'project' }
];

// Filtros
const filters = ref({
  title: '',
  type: '',
  search: ''
});

// Verificar si hay filtros activos
const hasActiveFilters = computed(() => {
  return filters.value.title || filters.value.type || filters.value.search;
});

const resetFilters = () => {
  filters.value = {
    title: '',
    type: '',
    search: ''
  };
};

// Lista de títulos y tipos únicos para el autocomplete
const uniqueTitles = computed(() => {
  return Array.from(new Set(priorities.value.map(p => p.title))).sort();
});

const uniqueTypes = computed(() => {
  return Array.from(new Set(priorities.value.map(p => p.type))).sort();
});

// Filtrado de prioridades
const filteredPriorities = computed(() => {
  // Si no hay filtros activos, mostrar todas las prioridades
  if (!hasActiveFilters.value) {
    return priorities.value;
  }

  const titleFilter = filters.value.title?.toLowerCase();
  const typeFilter = filters.value.type;
  const searchFilter = filters.value.search?.toLowerCase();

  return priorities.value.filter(priority => {
    const priorityTitle = priority.title.toLowerCase();
    const priorityDescription = priority.description.toLowerCase();

    const matchesTitle = titleFilter ? priorityTitle.includes(titleFilter) : true;
    const matchesType = typeFilter ? priority.type === typeFilter : true;
    const matchesSearch = searchFilter ?
      (priorityTitle.includes(searchFilter) ||
      priorityDescription.includes(searchFilter)) : true;

    return matchesTitle && matchesType && matchesSearch;
  });
});

const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const normalizeForComparison = (str: string) => {
  return str
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

// Validación de nombres duplicados
const validateDuplicateTitle = (v: string) => {
  if (!v) {
    hasDuplicate.value = false;
    return true;
  }

  const normalizedInput = normalizeForComparison(v);

  const exists = priorities.value.some(p => {
    const normalizedExisting = normalizeForComparison(p.title);
    return normalizedExisting === normalizedInput &&
           (!editingPriority.value || p.id !== editingPriority.value.id);
  });

  hasDuplicate.value = exists;
  return !exists || 'Esta prioridad ya existe';
};

// Función para normalizar el input (permite escribir artículos)
const normalizePriorityName = () => {
  // Permite letras, espacios y algunos caracteres especiales para artículos
  if (priorityForm.value.title) {
    priorityForm.value.title = priorityForm.value.title
    checkDuplicateTitle();
  }
};

// Verificar duplicados
const checkDuplicateTitle = () => {
  validateDuplicateTitle(priorityForm.value.title);
};

watch(() => priorityForm.value.title, () => checkDuplicateTitle());

// Validaciones del campo
const titleRules = [
  (v: string) => !!v || 'Campo obligatorio',
  (v: string) => (v && v.length >= 3) || 'Mínimo 3 caracteres',
  (v: string) => /^[\p{L}\s'-]+$/u.test(v) || 'Solo letras, espacios y guiones/apóstrofes permitidos',
  () => !hasDuplicate.value || 'Esta prioridad ya existe'
];

const descriptionRules = [
  (v: string) => !!v || 'Descripción obligatoria',
];

const typeRules = [
  (v: string) => !!v || 'Tipo obligatorio'
];

// CRUD funciones
const fetchPriorities = async () => {
  try {
    loading.value = true;
    const response = await service.index<Priority[]>(CONFIG.api.priorities);
    priorities.value = response || [];
  } catch (error) {
    showSnackbar('Error al obtener prioridades', 'error');
    priorities.value = [];
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  editingPriority.value = null;
  priorityForm.value = { title: '', description: '', type: 'task' };
  hasDuplicate.value = false;
  dialog.value = true;
};

const editPriority = (priority: Priority) => {
  editingPriority.value = priority;
  priorityForm.value = { ...priority };
  hasDuplicate.value = false;
  dialog.value = true;
};

const savePriority = async () => {
  if (hasDuplicate.value) return;
  isSaving.value = true;
  try {
    // Normalizar el título antes de guardar
    normalizePriorityName();

    if (editingPriority.value && priorityForm.value.id) {
      await service.update(CONFIG.api.priorities, editingPriority.value.id.toString(), priorityForm.value);
      const index = priorities.value.findIndex(p => p.id === editingPriority.value?.id);
      if (index !== -1) priorities.value[index] = { ...priorityForm.value } as Priority;
      showSnackbar('Prioridad actualizada correctamente', 'success');
    } else {
      const response = await service.store<Priority>(CONFIG.api.priorities, priorityForm.value);
      priorities.value.push(response);
      showSnackbar('Prioridad creada exitosamente', 'success');
    }
    dialog.value = false;
  } catch (error) {
    showSnackbar('Error al guardar los cambios', 'error');
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
      showSnackbar('Prioridad eliminada con éxito', 'success');
    } catch (error) {
      showSnackbar('Error al eliminar la prioridad', 'error');
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
  snackbarIcon.value = color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
  snackbar.value = true;
};

onMounted(fetchPriorities);
</script>

<style scoped>
.sticky-filter {
  position: sticky;
  top: 20px;
}

.priority-card {
  transition: all 0.3s ease;
  width: calc(33.333% - 11px);
  min-width: 280px;
  flex-grow: 1;
}

.priority-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@media (max-width: 960px) {
  .priority-card {
    width: calc(50% - 8px);
  }
}

@media (max-width: 600px) {
  .priority-card {
    width: 100%;
  }
}
</style>
