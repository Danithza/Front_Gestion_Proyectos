<template>
  <v-container class="py-8">
    <!-- Título y botones -->
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h2 class="text-h4 font-weight-bold text-black">📋 Gestión de Estados</h2>
        <p class="text-caption text-medium-emphasis">Administra los estados disponibles en la plataforma</p>
      </v-col>
    <v-col cols="12" md="6" class="text-md-right">
       <v-btn
         icon
         color="primary"
         size="large"
         @click="openCreateModal"
         class="shadow-lg"
         v-if="authStore.hasPermission('status:create')"
       >
         <v-icon>mdi-plus</v-icon>
       </v-btn>
     </v-col>
    </v-row>

    <v-row>
      <!-- Tarjetas de Estados SIN FILTROS -->
      <v-col cols="12">
        <transition-group name="list" tag="div" class="d-flex flex-wrap" style="gap: 16px;">
          <v-card
            v-for="item in statuses"
            :key="item.id"
            class="status-card pa-4 rounded-xl"
            elevation="2"
            :style="{ borderLeft: '4px solid ' + getRandomColor() }"
          >
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="d-flex align-center">
                <v-avatar size="40" color="black" class="mr-3">
                  <v-icon color="white">mdi-checkbox-marked-circle-outline</v-icon>
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
                  @click="editStatus(item)"
                  title="Editar"
                  v-if="authStore.hasPermission('status:update')"
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
                  v-if="authStore.hasPermission('status:delete')"
                >
                  <v-icon>mdi-delete-alert-outline</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </transition-group>

        <!-- Mensaje cuando no hay datos -->
        <v-alert
          v-if="statuses.length === 0 && !loading"
          type="info"
          variant="tonal"
          class="mt-4"
        >
          No hay estados registrados
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

    <!-- Modal Crear/Editar Estado -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="rounded-lg">
        <v-toolbar :color="editingStatus ? 'blue-darken-2' : 'primary'" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon left>{{ editingStatus ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            {{ editingStatus ? 'Editar Estado' : 'Crear Estado' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal" variant="text" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="statusForm.title"
              label="Nombre del estado"
              outlined
              :rules="titleRules"
              @input="normalizeStatusName"
              class="mb-4"
            />

            <v-textarea
              v-model="statusForm.description"
              label="Descripción"
              outlined
              :rules="descriptionRules"
              class="mb-4"
            />

            <v-select
              v-model="statusForm.type"
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
              <strong>Error:</strong> Este estado ya existe (incluyendo variaciones con tildes o espacios)
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
            @click="saveStatus"
            variant="elevated"
          >
            {{ editingStatus ? 'Actualizar' : 'Crear' }}
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
            <span>¿Estás seguro de que deseas eliminar este estado?</span>
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
import { ref, onMounted, watch } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

interface Status {
  id: number;
  title: string;
  description: string;
  type: 'task' | 'project';
}

const statuses = ref<Status[]>([]);
const loading = ref(true);
const dialog = ref(false);
const editingStatus = ref<Status | null>(null);
const statusForm = ref<Omit<Status, 'id'> & { id?: number }>({
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

// --- ELIMINADO: Filtros y lógica relacionada ---

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

  const exists = statuses.value.some(s => {
    const normalizedExisting = normalizeForComparison(s.title);
    return normalizedExisting === normalizedInput &&
           (!editingStatus.value || s.id !== editingStatus.value.id);
  });

  hasDuplicate.value = exists;
  return !exists || 'Este estado ya existe';
};

// Función para normalizar el input (permite escribir artículos)
const normalizeStatusName = () => {
  if (statusForm.value.title) {
    statusForm.value.title = statusForm.value.title
    checkDuplicateTitle();
  }
};

// Verificar duplicados
const checkDuplicateTitle = () => {
  validateDuplicateTitle(statusForm.value.title);
};

watch(() => statusForm.value.title, () => checkDuplicateTitle());

// Validaciones del campo
const titleRules = [
  (v: string) => !!v || 'Campo obligatorio',
  (v: string) => (v && v.length >= 3) || 'Mínimo 3 caracteres',
  (v: string) => /^[\p{L}\s'-]+$/u.test(v) || 'Solo letras, espacios y guiones/apóstrofes permitidos',
  () => !hasDuplicate.value || 'Este estado ya existe'
];

const descriptionRules = [
  (v: string) => !!v || 'Descripción obligatoria',
];

const typeRules = [
  (v: string) => !!v || 'Tipo obligatorio'
];

// CRUD funciones
const fetchStatuses = async () => {
  try {
    loading.value = true;
    const response = await service.index<Status[]>(CONFIG.api.statuses);
    statuses.value = response;
  } catch (error) {
    showSnackbar('Error al obtener estados', 'error');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  editingStatus.value = null;
  statusForm.value = { title: '', description: '', type: 'task' };
  hasDuplicate.value = false;
  dialog.value = true;
};

const editStatus = (status: Status) => {
  editingStatus.value = status;
  statusForm.value = { ...status };
  hasDuplicate.value = false;
  dialog.value = true;
};

const saveStatus = async () => {
  if (hasDuplicate.value) return;
  isSaving.value = true;
  try {
    normalizeStatusName();

    if (editingStatus.value && statusForm.value.id) {
      await service.update(CONFIG.api.statuses, editingStatus.value.id.toString(), statusForm.value);
      const index = statuses.value.findIndex(s => s.id === editingStatus.value?.id);
      if (index !== -1) statuses.value[index] = { ...statusForm.value } as Status;
      showSnackbar('Estado actualizado correctamente', 'success');
    } else {
      const response = await service.store<Status>(CONFIG.api.statuses, statusForm.value);
      statuses.value.push(response);
      showSnackbar('Estado creado exitosamente', 'success');
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
      await service.delete(CONFIG.api.statuses, idToDelete.value.toString());
      statuses.value = statuses.value.filter(s => s.id !== idToDelete.value);
      showSnackbar('Estado eliminado con éxito', 'success');
    } catch (error) {
      showSnackbar('Error al eliminar el estado', 'error');
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

onMounted(fetchStatuses);
</script>

<style scoped>
.sticky-filter {
  position: sticky;
  top: 20px;
}

.status-card {
  transition: all 0.3s ease;
  width: calc(33.333% - 11px);
  min-width: 280px;
  flex-grow: 1;
}

.status-card:hover {
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
  .status-card {
    width: calc(50% - 8px);
  }
}

@media (max-width: 600px) {
  .status-card {
    width: 100%;
  }
}
</style>
