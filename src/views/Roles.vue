<template>
  <v-container class="py-8">
    <!-- Título y botones -->
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h2 class="text-h4 font-weight-bold text-primary">👤 Gestión de Roles</h2>
        <p class="text-caption text-medium-emphasis">
          Administra los roles y permisos disponibles en la plataforma
        </p>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn color="primary" size="large" @click="openCreateModal" class="shadow-lg mr-2">
          <v-icon left>mdi-plus-circle-outline</v-icon> NUEVO ROL
        </v-btn>
        <v-btn color="secondary" size="large" @click="fetchRoles" class="shadow-lg">
          <v-icon left>mdi-refresh</v-icon> REFRESCAR
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="filters.search"
          label="Buscar rol"
          prepend-inner-icon="mdi-magnify"
          clearable
          @click:clear="resetFilters"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete
          v-model="filters.title"
          :items="roleTitles"
          label="Filtrar por título"
          clearable
          @click:clear="resetFilters"
        />
      </v-col>
    </v-row>

    <!-- Lista de roles -->
    <v-row>
      <v-col cols="12" v-if="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>

      <v-col
        v-for="item in filteredRoles"
        :key="item.id"
        cols="12"
        md="4"
      >
        <v-card class="pa-4">
          <div class="d-flex justify-space-between">
            <div>
              <h3 class="text-h6">{{ item.title }}</h3>
              <p class="text-body-2">{{ item.description }}</p>
            </div>
            <div>
              <v-btn icon @click="editRole(item)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon color="red" @click="confirmDelete(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
            </div>
          </div>
          <div class="mt-2">
            <v-chip
              v-for="(permission, index) in item.permissions.split(',')"
              :key="index"
              small
              class="ma-1"
            >
              {{ permission.trim() }}
            </v-chip>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" v-if="!loading && filteredRoles.length === 0">
        <v-alert type="info">No se encontraron roles.</v-alert>
      </v-col>
    </v-row>

    <!-- Modal Crear/Editar -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editingRole ? 'Editar Rol' : 'Crear Rol' }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="roleForm.title" label="Título" required />
            <v-textarea v-model="roleForm.description" label="Descripción" />
            <v-text-field v-model="roleForm.permissions" label="Permisos (separados por comas)" required />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveRole">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmación de eliminación -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>¿Eliminar rol?</v-card-title>
        <v-card-text>Esta acción no se puede deshacer.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" @click="deleteConfirmed">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface Role {
  id: number;
  title: string;
  description: string;
  permissions: string;
}

const roles = ref<Role[]>([]);
const loading = ref(false);
const dialog = ref(false);
const confirmDeleteDialog = ref(false);
const roleForm = ref({ title: '', description: '', permissions: '', id: undefined });
const editingRole = ref<Role | null>(null);
const form = ref();
const roleToDeleteId = ref<number | null>(null);

const filters = ref({ title: '', search: '' });

const fetchRoles = async () => {
  loading.value = true;
  try {
    const params: any = {};
    if (filters.value.title) params.title = filters.value.title;
    if (filters.value.search) params.search = filters.value.search;
    const response = await service.index<Role[]>(CONFIG.api.roles, params);
    roles.value = response;
  } catch (err) {
    console.error('Error al obtener roles:', err);
  } finally {
    loading.value = false;
  }
};

const roleTitles = ref<string[]>([]);

const loadTitles = async () => {
  try {
    const response = await service.index<Role[]>(CONFIG.api.roles);
    roleTitles.value = [...new Set(response.map(r => r.title))];
  } catch (err) {
    console.error('Error al cargar títulos únicos:', err);
  }
};

// Computed para filtrar los roles en la vista
const filteredRoles = computed(() => {
  let filtered = roles.value;
  if (filters.value.title) {
    filtered = filtered.filter(role =>
      role.title.toLowerCase().includes(filters.value.title.toLowerCase())
    );
  }
  if (filters.value.search) {
    filtered = filtered.filter(role =>
      role.title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      role.description.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      role.permissions.toLowerCase().includes(filters.value.search.toLowerCase())
    );
  }
  return filtered;
});

watch(() => [filters.value.title, filters.value.search], fetchRoles);

onMounted(() => {
  fetchRoles();
  loadTitles();
});

const resetFilters = () => {
  filters.value.title = '';
  filters.value.search = '';
  fetchRoles();
};

const openCreateModal = () => {
  editingRole.value = null;
  roleForm.value = { title: '', description: '', permissions: '', id: undefined };
  dialog.value = true;
};

const editRole = (role: Role) => {
  editingRole.value = role;
  roleForm.value = { ...role };
  dialog.value = true;
};

const saveRole = async () => {
  const payload = { ...roleForm.value };
  try {
    if (editingRole.value && roleForm.value.id) {
      await service.update(CONFIG.api.roles, roleForm.value.id.toString(), payload);
    } else {
      await service.store(CONFIG.api.roles, payload);
    }
    dialog.value = false;
    await fetchRoles();
  } catch (err) {
    console.error('Error al guardar rol:', err);
  }
};

const confirmDelete = (id: number) => {
  roleToDeleteId.value = id;
  confirmDeleteDialog.value = true;
};

const deleteConfirmed = async () => {
  if (roleToDeleteId.value !== null) {
    try {
      await service.delete(CONFIG.api.roles, roleToDeleteId.value.toString());
      await fetchRoles();
    } catch (err) {
      console.error('Error al eliminar rol:', err);
    } finally {
      confirmDeleteDialog.value = false;
      roleToDeleteId.value = null;
    }
  }
};
</script>

<style scoped>
.role-card {
  transition: all 0.3s ease;
  min-height: 180px;
}
</style>
