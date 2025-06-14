<template>
  <!-- Encabezado y botón -->
  <v-container class="text-body-1">
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="6">
        <h2 class="text-h5 font-weight-bold">Gestión de Usuarios</h2>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="primary" @click="openCreateModal" class="text-body-1">Crear Usuario</v-btn>
      </v-col>
    </v-row>

    <!-- Buscador -->
    <v-text-field
      v-model="search"
      label="Buscar usuario"
      prepend-inner-icon="mdi-magnify"
      class="mb-4"
      clearable
    />

    <!-- Tabla de usuarios -->
    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      item-value="id"
      class="elevation-2 text-body-2"
      :search="search"
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
          <span>{{ (item.roles ?? []).map(role => role.title).join(', ') || 'Sin roles' }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.city="{ item }">
        <span>{{ item.city?.title ?? '' }}</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon color="primary" @click="editUser(item)">
          <v-icon>mdi-account-edit</v-icon>
        </v-btn>
        <v-btn
          v-if="currentUser.role === 'admin'"
          icon color="#B71C1C"
          @click="askDeleteUser(item)"
          style="margin-left: 8px;"
        >
          <v-icon>mdi-delete-empty-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Confirmación de eliminación -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">¿Eliminar usuario?</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar al usuario <b>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</b>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" @click="confirmDelete">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de creación/edición -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="elevation-1 text-body-1">
        <v-card-title>
          <span class="text-h6 font-weight-bold">{{ editingUser ? 'Edit User' : 'Create User' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" :lazy-validation="true">
            <v-text-field v-model="userForm.firstName" label="First Name" :rules="[v => !!v || 'First name is required']" />
            <v-text-field v-model="userForm.lastName" label="Last Name" :rules="[v => !!v || 'Last name is required']" />
            <v-text-field
              v-model.number="userForm.telephone"
              label="Telephone"
              type="number"
              :rules="[
                v => !!v || 'Telephone is required',
                v => /^\d{10}$/.test(String(v)) || 'Telephone must be 10 digits'
              ]"
            />
            <v-text-field
              v-model="userForm.email"
              label="Email"
              :rules="[
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
              ]"
            />
            <v-text-field
              v-model="userForm.password"
              label="Password"
              :rules="[
                v => !!v || 'Password is required',
                v => v.length >= 6 || 'Password must be at least 6 characters'
              ]"
              :type="editingUser ? 'text' : 'password'"
            />
            <v-select
              v-model="userForm.roleIds"
              :items="roles"
              item-text="title"
              item-value="id"
              label="Roles"
              multiple
              :rules="[v => v && v.length > 0 || 'At least one role is required']"
            />
            <v-select
              v-model="userForm.typeDocumentId"
              :items="typeDocuments"
              item-text="title"
              item-value="id"
              label="Document Type"
              :rules="[v => !!v || 'Document type is required']"
            />
            <v-text-field v-model="userForm.document" label="Documento" type="number" />
            <v-select
              v-model="userForm.cityId"
              :items="cities"
              item-text="title"
              item-value="id"
              label="City"
              :rules="[v => !!v || 'City is required']"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeModal">Cancel</v-btn>
          <v-btn color="primary" @click="saveUser">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface TypeDocument { id: number; abbreviation: string; }
interface Role { id: number; title: string; }
interface City { id: number; title: string; }
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

const authStore = useAuthStore();
const headers = [
  { title: 'First Name', key: 'firstName' },
  { title: 'Last Name', key: 'lastName' },
  { title: 'Email', key: 'email' },
  { title: 'Telephone', key: 'telephone' },
  { title: 'Document Type', key: 'typeDocument' },
  { title: 'Document', key: 'document' },
  { title: 'Roles', key: 'roles' },
  { title: 'City', key: 'city' },
  { title: 'Actions', key: 'actions' },
];

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const typeDocuments = ref<TypeDocument[]>([]);
const cities = ref<City[]>([]);
const dialog = ref(false);
const editingUser = ref<User | null>(null);
const search = ref('');
const currentUser = ref({ role: 'admin' });
const confirmDeleteDialog = ref(false);
const userToDelete = ref<User | null>(null);
const emptyUserForm: User = {
  id: 0, firstName: '', lastName: '', telephone: '', email: '', password: '',
  document: '', typeDocumentId: '', cityId: '', roles: [], roleIds: [],
};
const userForm = ref<User>({ ...emptyUserForm });
const form = ref();

const fetchData = () => {
  fetchUsers(); fetchRoles(); fetchTypeDocuments(); fetchCities();
};

const fetchUsers = async () => {
  const response = await service.index<User[]>(CONFIG.api.users, { with: 'roles,city,typeDocument' });
  users.value = response.map(user => ({ ...user, roleIds: (user.roles ?? []).map(r => r.id) }));
};
const fetchRoles = async () => { roles.value = await service.index<Role[]>(CONFIG.api.roles); };
const fetchTypeDocuments = async () => { typeDocuments.value = await service.index<TypeDocument[]>(CONFIG.api.typesDocuments); };
const fetchCities = async () => { cities.value = await service.index<City[]>(CONFIG.api.cities); };

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
    roleIds: (user.roles ?? []).map(r => r.id),
    document: user.document,
    typeDocumentId: user.typeDocumentId,
    cityId: user.cityId ?? (user.city?.id ?? ''),
  };
  dialog.value = true;
};

const isDuplicate = () => {
  const editingId = editingUser.value?.id ?? null;
  return users.value.some(u =>
    (u.email === userForm.value.email || u.document === userForm.value.document || u.telephone === userForm.value.telephone) && u.id !== editingId
  );
};

const saveUser = async () => {
  if (!(await form.value?.validate())) return;
  if (isDuplicate()) return alert('Ya existe un usuario con este email o documento.');

  const payload = {
    ...userForm.value,
    roles: userForm.value.roleIds,
    document: Number(userForm.value.document),
    typeDocumentId: Number(userForm.value.typeDocumentId),
    cityId: Number(userForm.value.cityId),
  };

  if (editingUser.value) {
    await service.update(CONFIG.api.users, editingUser.value.id.toString(), payload);
    if (editingUser.value.id === authStore.user.id) {
      authStore.user = { ...authStore.user, ...userForm.value };
    }
  } else {
    const created = await service.store<User>(CONFIG.api.users, payload);
    if (created.id === authStore.user.id) {
      authStore.user = { ...created };
    }
  }

  dialog.value = false;
  await fetchUsers();
};

const deleteUser = async (id: number) => {
  await service.delete(CONFIG.api.users, id.toString());
  await fetchUsers();
};

const closeModal = () => { dialog.value = false; };
const askDeleteUser = (user: User) => { userToDelete.value = user; confirmDeleteDialog.value = true; };
const confirmDelete = async () => {
  if (userToDelete.value) {
    await deleteUser(userToDelete.value.id);
    users.value = users.value.filter(u => u.id !== userToDelete.value!.id);
    confirmDeleteDialog.value = false;
    userToDelete.value = null;
  }
};

const filteredUsers = computed(() => {
  const searchLower = search.value.toLowerCase();
  return users.value.filter(user => Object.values(user).some(val => String(val).toLowerCase().includes(searchLower)));
});

onMounted(() => { fetchData(); });
</script>
