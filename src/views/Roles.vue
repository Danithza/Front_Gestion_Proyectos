<template>
  <v-container class="py-8">
    <!-- Título y botones -->
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h2 class="text-h4 font-weight-bold text-primary">👤 Gestión de Roles</h2>
        <p class="text-caption text-medium-emphasis">Administra los roles y permisos disponibles en la plataforma</p>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn color="primary" size="large" @click="openCreateModal" class="shadow-lg">
          <v-icon left>mdi-plus-circle-outline</v-icon> Nuevo Rol
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

          <v-autocomplete v-model="filters.title" :items="uniqueTitles" label="Filtrar por Título" clearable outlined
            dense prepend-inner-icon="mdi-format-title" hide-no-data @click:clear="resetFilters" class="mb-4" />

          <v-text-field v-model="filters.search" label="Buscar rol" clearable outlined dense
            prepend-inner-icon="mdi-magnify" @click:clear="resetFilters" />

          <v-btn block color="secondary" variant="outlined" class="mt-2" @click="resetFilters">
            Limpiar filtros
          </v-btn>
        </v-card>
      </v-col>

      <!-- Tarjetas de Roles -->
      <v-col cols="12" md="9">
        <transition-group name="list" tag="div" class="d-flex flex-wrap" style="gap: 16px;">
          <v-card v-for="item in filteredRoles" :key="item.id" class="role-card pa-4 rounded-xl" elevation="2"
            :style="{ borderLeft: '4px solid ' + getRandomColor() }">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="d-flex align-center">
                <v-avatar size="40" color="black" class="mr-3">
                  <v-icon color="white">mdi-account-key-outline</v-icon>
                </v-avatar>
                <div>
                  <span class="text-h6 font-weight-bold d-block">{{ item.title }}</span>
                  <span class="text-caption text-medium-emphasis">ID: {{ item.id }}</span>
                </div>
              </div>
              <div class="d-flex align-center" style="gap: 8px;">
                <v-btn icon variant="text" color="blue" size="small" @click="editRole(item)" title="Editar">
                  <v-icon>mdi-pencil-box-multiple-outline</v-icon>
                </v-btn>
                <v-btn icon variant="text" color="red" size="small" @click="confirmDelete(item.id)" title="Eliminar">
                  <v-icon>mdi-delete-alert-outline</v-icon>
                </v-btn>
              </div>
            </div>

            <v-divider class="my-3"></v-divider>

            <div class="mb-2">
              <span class="text-subtitle-2 font-weight-bold">Descripción:</span>
              <p class="text-body-2">{{ item.description }}</p>
            </div>
          </v-card>
        </transition-group>

        <!-- Mensaje cuando no hay resultados con filtros -->
        <v-alert v-if="filteredRoles.length === 0 && hasActiveFilters" type="info" variant="tonal" class="mt-4">
          No se encontraron roles con los filtros aplicados
        </v-alert>

        <!-- Mensaje cuando no hay datos -->
        <v-alert v-if="roles.length === 0 && !loading" type="info" variant="tonal" class="mt-4">
          No hay roles registrados
        </v-alert>

        <!-- Cargando datos -->
        <v-progress-circular v-if="loading" indeterminate color="primary" class="mt-4"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Modal Crear/Editar Rol -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="rounded-lg">
        <v-toolbar :color="editingRole ? 'blue-darken-2' : 'primary'" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon left>{{ editingRole ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            {{ editingRole ? 'Editar Rol' : 'Crear Rol' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal" variant="text" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <v-form ref="form" lazy-validation>
            <div class="text-right mb-6">
              <PermissionManager v-model="roleForm.permissions" />
            </div>
            <v-text-field v-model="roleForm.title" label="Nombre del rol" outlined :rules="titleRules"
              @input="normalizeRoleName" class="mb-4" />

            <v-textarea v-model="roleForm.description" label="Descripción" outlined :rules="descriptionRules"
              class="mb-4" />

            <v-alert v-if="hasDuplicate" type="error" variant="tonal" class="mb-4" border="start" border-color="error"
              density="compact" icon="mdi-alert-circle-outline">
              <strong>Error:</strong> Este rol ya existe (incluyendo variaciones con tildes o espacios)
            </v-alert>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeModal" :disabled="isSaving">
            Cancelar
          </v-btn>
          <v-btn color="primary" :loading="isSaving" :disabled="isSaving || hasDuplicate" @click="saveRole"
            variant="elevated">
            {{ editingRole ? 'Actualizar' : 'Crear' }}
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
            <span>¿Estás seguro de que deseas eliminar este rol?</span>
          </div>
          <p class="text-caption text-medium-emphasis">Esta acción no se puede deshacer.</p>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="confirmDeleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="red" variant="elevated" @click="deleteConfirmed">
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
import PermissionManager from '@/components/PermissionsManager.vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface Role {
  id: number;
  title: string;
  description: string;
  permissions?: Record<string, boolean>;
}

const roles = ref<Role[]>([]);
const loading = ref(true);
const dialog = ref(false);
const editingRole = ref<Role | null>(null);
const roleForm = ref<Omit<Role, 'id'> & { id?: number }>({
  title: '',
  description: '',
  permissions: {},
});

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const snackbarIcon = ref('mdi-check-circle');
const isSaving = ref(false);
const hasDuplicate = ref(false);
const confirmDeleteDialog = ref(false);
const idToDelete = ref<number | null>(null);

// Filtros
const filters = ref({
  title: '',
  permissions: '',
  search: ''
});

// Verificar si hay filtros activos
const hasActiveFilters = computed(() => {
  return filters.value.title || filters.value.permissions || filters.value.search;
});

const resetFilters = () => {
  filters.value = {
    title: '',
    permissions: '',
    search: ''
  };
};

// Lista de títulos y permisos únicos para el autocomplete
const uniqueTitles = computed(() => {
  return Array.from(new Set(roles.value.map(r => r.title))).sort();
});

const filteredRoles = computed(() => {
  // Si no hay filtros activos, mostrar todos los roles
  if (!hasActiveFilters.value) {
    return roles.value;
  }

  const titleFilter = filters.value.title?.toLowerCase();
  const permissionsFilter = filters.value.permissions?.toLowerCase();
  const searchFilter = filters.value.search?.toLowerCase();

  return roles.value.filter(role => {
    const roleTitle = role.title.toLowerCase();
    const roleDescription = role.description.toLowerCase();

    const matchesTitle = titleFilter ? roleTitle.includes(titleFilter) : true;
    const matchesSearch = searchFilter ?
      (roleTitle.includes(searchFilter) || roleDescription.includes(searchFilter)) : true;

    return matchesTitle && matchesSearch;
  });
});

// Colores aleatorios para las tarjetas
const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const normalizeForComparison = (str: string) => {
  return str
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

// Función para normalizar el input (permite escribir artículos)
const normalizeRoleName = () => {
  // Permite letras, espacios y algunos caracteres especiales para artículos
  if (roleForm.value.title) {
    roleForm.value.title = roleForm.value.title
    checkDuplicateTitle();
  }
};

// Verificar duplicados
const checkDuplicateTitle = () => {
  validateDuplicateTitle(roleForm.value.title);
};

watch(() => roleForm.value.title, () => checkDuplicateTitle());

// Validaciones del campo título
const titleRules = [
  (v: string) => !!v || 'Campo obligatorio',
  (v: string) => (v && v.length >= 3) || 'Mínimo 3 caracteres',
  (v: string) => /^[\p{L}\s'-]+$/u.test(v) || 'Solo letras, espacios y guiones/apóstrofes permitidos',
  () => !hasDuplicate.value || 'Este rol ya existe'
];

// Validaciones del campo descripción
const descriptionRules = [
  (v: string) => !!v || 'Descripción obligatoria',
];

// Validaciones del campo permisos
const permissionsRules = [
  (v: string) => !!v || 'Permisos obligatorios',
  (v: string) => (v && v.split(',').length > 0) || 'Debe incluir al menos un permiso'
];

// Validación de nombres duplicados
const validateDuplicateTitle = (v: string) => {
  if (!v) {
    hasDuplicate.value = false;
    return true;
  }

  const normalizedInput = normalizeForComparison(v);

  const exists = roles.value.some(r => {
    const normalizedExisting = normalizeForComparison(r.title);
    return normalizedExisting === normalizedInput &&
      (!editingRole.value || r.id !== editingRole.value.id);
  });

  hasDuplicate.value = exists;
  return !exists || 'Este rol ya existe';
};

// CRUD funciones
const fetchRoles = async () => {
  try {
    loading.value = true;
    const response = await service.index<Role[]>(CONFIG.api.roles);
    roles.value = response;
  } catch (error) {
    showSnackbar('Error al obtener roles', 'error');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  editingRole.value = null;
  roleForm.value = { title: '', description: '' };
  hasDuplicate.value = false;
  dialog.value = true;
};

const editRole = (role: Role) => {
  editingRole.value = role;
  roleForm.value = { ...role };
  hasDuplicate.value = false;
  dialog.value = true;
};

const saveRole = async () => {
  if (hasDuplicate.value) return;
  isSaving.value = true;
  try {
    // Normalizar el título antes de guardar
    normalizeRoleName();

    if (editingRole.value && roleForm.value.id) {
      await service.update(CONFIG.api.roles, editingRole.value.id.toString(), roleForm.value);
      const index = roles.value.findIndex(r => r.id === editingRole.value?.id);
      if (index !== -1) roles.value[index] = { ...roleForm.value } as Role;
      showSnackbar('Rol actualizado correctamente', 'success');
    } else {
      const response = await service.store<Role>(CONFIG.api.roles, roleForm.value);
      roles.value.push(response);
      showSnackbar('Rol creado exitosamente', 'success');
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
      await service.delete(CONFIG.api.roles, idToDelete.value.toString());
      roles.value = roles.value.filter(r => r.id !== idToDelete.value);
      showSnackbar('Rol eliminado con éxito', 'success');
    } catch (error) {
      showSnackbar('Error al eliminar el rol', 'error');
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

onMounted(fetchRoles);
</script>

<style scoped>
.sticky-filter {
  position: sticky;
  top: 20px;
}

.role-card {
  transition: all 0.3s ease;
  width: calc(33.333% - 11px);
  min-width: 280px;
  flex-grow: 1;
}

.role-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
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
  .role-card {
    width: calc(50% - 8px);
  }
}

@media (max-width: 600px) {
  .role-card {
    width: 100%;
  }
}
</style>
