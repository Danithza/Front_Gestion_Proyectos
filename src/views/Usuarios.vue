<template>
  <v-container class="text-body-1">
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="6">
        <h2 class="text-h5 font-weight-bold">Gestión de Usuarios</h2>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="primary" @click="openCreateModal" class="text-body-1">Crear Usuario</v-btn>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="filters.search"
          label="Buscar usuario"
          prepend-inner-icon="mdi-magnify"
          clearable
          @click:clear="resetFilters"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="filters.role"
          :items="roles"
          item-text="title"
          item-value="id"
          label="Filtrar por Rol"
          clearable
          @click:clear="resetFilters"
        />
      </v-col>
    </v-row>

    <!-- User Table -->
    <v-data-table
      :headers="headers"
      :items="users"
      item-value="id"
      class="elevation-2 text-body-2"
      :loading="loading"
    >
      <template v-slot:item.typeDocument="{ item }">
        <span>{{ item.typeDocument?.abbreviation ?? '' }}</span>
      </template>
      <template v-slot:item.document="{ item }">
        <span>{{ item.document }}</span>
      </template>
      <template v-slot:item.roles="{ item }">
        <v-tooltip location="top">
          <template #activator="{ props }">
            <span v-bind="props" style="cursor: pointer;">
              <v-icon small>mdi-account-group</v-icon>
            </span>
          </template>
          <span>
            {{ (item.roles ?? []).map(role => role.title).join(', ') || 'Sin roles' }}
          </span>
        </v-tooltip>
      </template>
      <template v-slot:item.city="{ item }">
        <span>{{ item.city?.title ?? '' }}</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon color="primary" @click="editUser(item)" class="text-body-1">
          <v-icon>mdi-account-edit</v-icon>
        </v-btn>
        <v-btn
          v-if="currentUser.role === 'admin'"
          icon color="#B71C1C"
          @click="askDeleteUser(item)"
          class="text-body-1"
          style="margin-left: 8px;"
        >
          <v-icon>mdi-delete-empty-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">¿Eliminar usuario?</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar al usuario
          <b>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</b>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" @click="confirmDelete">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal for Create/Edit User -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="elevation-1 text-body-1">
        <v-card-title>
          <span class="text-h6 font-weight-bold">{{ editingUser ? 'Edit User' : 'Create User' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" :lazy-validation="true">
            <v-text-field
              v-model="userForm.firstName"
              label="First Name"
              :rules="[v => !!v || 'First name is required']"
              class="text-body-1"
            />
            <v-text-field
              v-model="userForm.lastName"
              label="Last Name"
              :rules="[v => !!v || 'Last name is required']"
              class="text-body-1"
            />
            <v-text-field
              v-model.number="userForm.telephone"
              label="Telephone"
              type="number"
              :rules="[
                v => !!v || 'Telephone is required',
                v => /^\d{10}$/.test(String(v)) || 'Telephone must be 10 digits'
              ]"
              class="text-body-1"
            />
            <v-text-field
              v-model="userForm.email"
              label="Email"
              :rules="[
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
              ]"
              class="text-body-1"
            />
            <v-text-field
              v-model="userForm.password"
              label="Password"
              :rules="[
                v => !!v || 'Password is required',
                v => v.length >= 6 || 'Password must be at least 6 characters'
              ]"
              :type="editingUser ? 'text' : 'password'"
              class="text-body-1"
            />
            <v-select
              v-model="userForm.roleIds"
              :items="roles"
              item-text="title"
              item-value="id"
              label="Roles"
              multiple
              :rules="[v => v && v.length > 0 || 'At least one role is required']"
              class="text-body-1"
            />
            <v-select
              v-model="userForm.typeDocumentId"
              :items="typeDocuments"
              item-text="title"
              item-value="id"
              label="Document Type"
              :rules="[v => !!v || 'Document type is required']"
              class="text-body-1"
            />
            <v-text-field
              v-model="userForm.document"
              label="Documento"
              type="number"
              class="text-body-1"
            />
            <v-select
              v-model="userForm.cityId"
              :items="cities"
              item-text="title"
              item-value="id"
              label="City"
              :rules="[v => !!v || 'City is required']"
              class="text-body-1"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeModal" class="text-body-1">Cancel</v-btn>
          <v-btn color="primary" @click="saveUser" class="text-body-1">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface TypeDocument {
  id: number;
  abbreviation: string;
}

interface Role {
  id: number;
  title: string;
}

interface City {
  id: number;
  title: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  password: string;
  document: number | string;
  typeDocumentId: number | string;
  cityId: number | string;
  typeDocument?: TypeDocument;
  city?: City;
  roles: Role[];
  roleIds: number[];
}

const headers = [
  { title: 'First Name', key: 'firstName' , sortable: false },
  { title: 'Last Name', key: 'lastName' , sortable: false },
  { title: 'Email', key: 'email' , sortable: false },
  { title: 'Telephone', key: 'telephone' , sortable: false },
  { title: 'Document Type', key: 'typeDocument' , sortable: false },
  { title: 'Document', key: 'document' , sortable: false },
  { title: 'Roles', key: 'roles', sortable: false },
  { title: 'City', key: 'city' , sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
];

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const typeDocuments = ref<TypeDocument[]>([]);
const cities = ref<City[]>([]);
const dialog = ref(false);
const editingUser = ref<User | null>(null);

const loading = ref(false);

// Filtros
const filters = ref<{ search: string; role: number | null }>({
  search: '',
  role: null,
});

// Simulación de usuario actual (ajusta según tu lógica real)
const currentUser = ref({ role: 'admin' }); // Cambia a 'user' para probar restricción

const confirmDeleteDialog = ref(false);
const userToDelete = ref<User | null>(null);

const emptyUserForm: User = {
  id: 0,
  firstName: '',
  lastName: '',
  telephone: '',
  email: '',
  password: '',
  document: '',
  typeDocumentId: '',
  cityId: '',
  roles: [],
  roleIds: [],
};

const userForm = ref<User>({ ...emptyUserForm });
const form = ref();

const fetchData = () => {
  fetchUsers();
  fetchRoles();
  fetchTypeDocuments();
  fetchCities();
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    // Construir parámetros de consulta para filtros
    const params: any = {
      with: 'roles,city,typeDocument',
    };
    if (filters.value.search) {
      params.search = filters.value.search;
    }
    if (filters.value.role) {
      params.role = filters.value.role;
    }
    const response = await service.index<User[]>(CONFIG.api.users, params);
    users.value = response.map(user => ({
      ...user,
      roleIds: (user.roles ?? []).map(role => role.id),
      document: user.document,
      typeDocumentId: user.typeDocumentId,
      cityId: user.cityId ?? '',
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};

const fetchRoles = async () => {
  try {
    const response = await service.index<Role[]>(CONFIG.api.roles);
    roles.value = response;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

const fetchTypeDocuments = async () => {
  try {
    const response = await service.index<TypeDocument[]>(CONFIG.api.typesDocuments);
    typeDocuments.value = response;
  } catch (error) {
    console.error('Error fetching type documents:', error);
  }
};

const fetchCities = async () => {
  try {
    const response = await service.index<City[]>(CONFIG.api.cities);
    cities.value = response;
  } catch (error) {
    console.error('Error fetching cities:', error);
  }
};

const openCreateModal = () => {
  editingUser.value = null;
  userForm.value = { ...emptyUserForm };
  dialog.value = true;
};

const editUser = (user: User) => {
  editingUser.value = user;
  userForm.value = {
    ...user,
    password: user.password,
    roleIds: (user.roles ?? []).map(role => role.id),
    document: user.document,
    typeDocumentId: user.typeDocumentId,
    cityId: user.cityId ?? (user.city?.id ?? ''),
  };
  dialog.value = true;
};

const isDuplicate = () => {
  // Si estás editando, ignora el usuario actual
  const editingId = editingUser.value ? editingUser.value.id : null;
  return users.value.some(u =>
    (
      u.email === userForm.value.email ||
      u.document === userForm.value.document ||
      u.telephone === userForm.value.telephone
    ) &&
    u.id !== editingId
  );
};

const saveUser = async () => {
  if (!(await form.value?.validate())) return;
  // Validación de duplicados
  if (isDuplicate()) {
    alert('Ya existe un usuario con este email o documento.');
    return;
  }
  try {
    const payload = {
      ...userForm.value,
      roles: userForm.value.roleIds,
      document: Number(userForm.value.document),
      typeDocumentId: Number(userForm.value.typeDocumentId),
      cityId: Number(userForm.value.cityId),
    };
    if (editingUser.value) {
      await service.update(CONFIG.api.users, editingUser.value.id.toString(), payload);
    } else {
      await service.store<User>(CONFIG.api.users, payload);
    }
    dialog.value = false;
    await fetchUsers(); // <-- refresca la lista después de guardar
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const deleteUser = async (id: number) => {
  try {
    await service.delete(CONFIG.api.users, id.toString());
    await fetchUsers(); // <-- refresca la lista después de eliminar
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const closeModal = () => {
  dialog.value = false;
};

function askDeleteUser(user: User) {
  userToDelete.value = user;
  confirmDeleteDialog.value = true;
}

async function confirmDelete() {
  if (userToDelete.value) {
    const id = userToDelete.value.id;
    await deleteUser(id);
    // Elimina el usuario del array local inmediatamente
    users.value = users.value.filter(u => u.id !== id);
    confirmDeleteDialog.value = false;
    userToDelete.value = null;
  }
}

// Filtros: recargar usuarios al cambiar filtros
const resetFilters = () => {
  filters.value.search = '';
  filters.value.role = null;
};

watch(
  () => [filters.value.search, filters.value.role],
  () => {
    fetchUsers();
  }
);

onMounted(() => {
  fetchData();
});
</script>

