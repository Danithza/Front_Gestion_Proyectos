<template>
  <v-container>
    <!-- Título y botones -->
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h2 class="text-h4 font-weight-bold">👤 Gestión de Roles</h2>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn color="primary" dark @click="openCreateModal">
          <v-icon left>mdi-plus-circle-outline</v-icon> Nuevo Rol
        </v-btn>
        <v-btn color="secondary" @click="fetchRoles" class="ml-2">🔄 Refrescar</v-btn>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-row class="mb-4" dense>
      <v-col cols="12" sm="6" md="4">
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
      <v-col cols="12" sm="6" md="4">
        <v-autocomplete
          v-model="filters.permissions"
          :items="uniquePermissions"
          label="Filtrar por Permiso"
          clearable
          dense
          outlined
          prepend-inner-icon="mdi-filter"
          hide-no-data
          :search-input.sync="searchPermissions"
          @click:clear="resetFilters"
        />
      </v-col>
      <v-col cols="12" md="4">
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

    <!-- Tarjetas de Roles -->
    <v-row dense>
      <v-col cols="12" sm="6" md="4" v-for="item in filteredRoles" :key="item.id">
        <v-card class="rounded-lg pa-4" :style="{ border: '2px solid #1976d2' }">
          <v-card-title class="font-weight-bold text-h6">
            <v-icon left>mdi-account-key-outline</v-icon> {{ item.title }}
          </v-card-title>
          <v-card-subtitle class="mb-2 text-body-2">📝 {{ item.description }}</v-card-subtitle>
          <v-card-text>
            <span class="font-weight-bold">Permisos:</span> {{ item.permissions }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn icon @click="editRole(item)">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn icon @click="confirmDelete(item.id)">
              <v-icon color="red">mdi-trash-can-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal Crear/Editar Rol -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="bg-primary text-white">
          <v-icon left>mdi-note-edit-outline</v-icon>
          {{ editingRole ? 'Editar Rol' : 'Crear Rol' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="roleForm.title"
              label="Título"
              dense
              :rules="[...titleRules, validateDuplicateTitle]"
              @input="filterOnlyLettersAndSpaces('title')"
            />
            <v-textarea
              v-model="roleForm.description"
              label="Descripción"
              dense
              :rules="[v => !!v || 'Descripción es obligatoria']"
            />
            <v-textarea
              v-model="roleForm.permissions"
              label="Permisos (separados por coma)"
              dense
              :rules="[v => !!v || 'Permisos son obligatorios']"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeModal" :disabled="isSaving">Cancelar</v-btn>
          <v-btn
            color="primary"
            dark
            @click="saveRole"
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
        <v-card-text>¿Estás seguro de que deseas eliminar este rol?</v-card-text>
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

interface Role {
  id: number;
  title: string;
  description: string;
  permissions: string;
}

const roles = ref<Role[]>([]);
const dialog = ref(false);
const editingRole = ref<Role | null>(null);
const roleForm = ref<Role>({
  id: 0,
  title: '',
  description: '',
  permissions: '',
});

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const isSaving = ref(false);
const hasDuplicate = ref(false);
const confirmDeleteDialog = ref(false);
const idToDelete = ref<number | null>(null);

// Filtros
const filters = ref({ title: '', permissions: '', search: '' });
const searchTitle = ref('');
const searchPermissions = ref('');
const resetFilters = () => filters.value = { title: '', permissions: '', search: '' };

// Autocompletado
const uniqueTitles = computed(() => Array.from(new Set(roles.value.map(r => r.title))));
const uniquePermissions = computed(() => {
  const perms = roles.value.flatMap(r => r.permissions.split(',').map(p => p.trim()));
  return Array.from(new Set(perms)).filter(p => p);
});

// Filtrado de roles
const filteredRoles = computed(() =>
  roles.value.filter(role =>
    (!filters.value.title || role.title.toLowerCase().includes(filters.value.title.toLowerCase())) &&
    (!filters.value.permissions || role.permissions.toLowerCase().includes(filters.value.permissions.toLowerCase())) &&
    (!filters.value.search ||
      role.title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      role.description.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      role.permissions.toLowerCase().includes(filters.value.search.toLowerCase()))
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
  const exists = roles.value.some(r =>
    r.title.toLowerCase() === v.toLowerCase() &&
    (!editingRole.value || r.id !== editingRole.value.id)
  );
  hasDuplicate.value = exists;
  return !exists || 'Este título ya existe';
};

watch(() => roleForm.value.title, (newVal) => validateDuplicateTitle(newVal));

function filterOnlyLettersAndSpaces(field: 'title') {
  const val = roleForm.value[field];
  roleForm.value[field] = val.replace(/[^\p{L}\s]/gu, '');
}

// CRUD funciones
const fetchRoles = async () => {
  try {
    const response = await service.index<Role[]>(CONFIG.api.roles);
    roles.value = response;
  } catch (error) {
    showSnackbar('Error al obtener roles', 'error');
  }
};

const openCreateModal = () => {
  editingRole.value = null;
  roleForm.value = { id: 0, title: '', description: '', permissions: '' };
  dialog.value = true;
};

const editRole = (role: Role) => {
  editingRole.value = role;
  roleForm.value = { ...role };
  dialog.value = true;
};

const saveRole = async () => {
  if (hasDuplicate.value) return;
  isSaving.value = true;
  try {
    if (editingRole.value) {
      await service.update(CONFIG.api.roles, editingRole.value.id.toString(), roleForm.value);
      const index = roles.value.findIndex(r => r.id === editingRole.value?.id);
      if (index !== -1) roles.value[index] = { ...roleForm.value };
      showSnackbar('Rol actualizado', 'success');
    } else {
      const response = await service.store<Role>(CONFIG.api.roles, roleForm.value);
      roles.value.push(response);
      showSnackbar('Rol creado', 'success');
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
      await service.delete(CONFIG.api.roles, idToDelete.value.toString());
      roles.value = roles.value.filter(r => r.id !== idToDelete.value);
      showSnackbar('Rol eliminado', 'success');
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

onMounted(fetchRoles);
</script>
