<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="6">
        <h2 class="text-h5 font-weight-bold">Gestión de Usuarios</h2>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="primary" @click="openCreateModal">Crear Usuario</v-btn>
      </v-col>
    </v-row>

    <!-- Tabla de Usuarios -->
    <v-data-table :headers="headers" :items="users" item-value="id" class="elevation-1">
      <template #item.typeDocument="{ item }">
        <span>{{ item.typeDocument?.title ?? '' }}</span>
      </template>
      <template #item.document="{ item }">
        <span>{{ item.document }}</span>
      </template>
      <template #item.roles="{ item }">
        <span>{{ (item.roles ?? []).map(role => role.title).join(', ') }}</span>
      </template>
      <template #item.city="{ item }">
        <span>{{ item.city?.title ?? '' }}</span>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon color="primary" @click="editUser(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="deleteUser(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Modal Crear/Editar Usuario -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ editingUser ? 'Editar Usuario' : 'Crear Usuario' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="userForm.firstName"
              label="Nombre"
              :rules="[v => !!v || 'El nombre es obligatorio', v => onlyLettersAndSpacesRegex.test(v) || 'Solo letras y espacios']"
            />
            <v-text-field
              v-model="userForm.lastName"
              label="Apellido"
              :rules="[v => !!v || 'El apellido es obligatorio', v => onlyLettersAndSpacesRegex.test(v) || 'Solo letras y espacios']"
            />
            <v-text-field
              v-model="userForm.email"
              label="Correo"
              :rules="[v => !!v || 'El correo es obligatorio', v => emailRegex.test(v) || 'Correo inválido']"
            />
            <v-text-field
              v-model="userForm.telephone"
              label="Teléfono"
              :rules="[v => !!v || 'El teléfono es obligatorio']"
            />
            <v-select
              v-model="userForm.roleIds"
              :items="roles"
              item-text="title"
              item-value="id"
              label="Rol"
              multiple
              :rules="[v => v && v.length > 0 || 'Seleccione al menos un rol']"
            />
            <v-select
              v-model="userForm.cityId"
              :items="cities"
              item-text="title"
              item-value="id"
              label="Ciudad"
              :rules="[v => !!v || 'La ciudad es obligatoria']"
            />
            <v-select
              v-model="userForm.typeDocumentId"
              :items="typeDocuments"
              item-text="title"
              item-value="id"
              label="Tipo de Documento"
              :rules="[v => !!v || 'El tipo de documento es obligatorio']"
            />
            <v-text-field
              v-model="userForm.document"
              label="Documento"
              type="number"
              :rules="[v => !!v || 'El documento es obligatorio', validateDuplicateDocument]"
            />
            <v-text-field
              v-model="userForm.password"
              label="Contraseña"
              :rules="[v => !!v || 'La contraseña es obligatoria']"
              :type="'password'"
              v-if="!editingUser"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeModal">Cancelar</v-btn>
          <v-btn color="primary" @click="saveUser" :disabled="hasDuplicateDocument">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface TypeDocument {
  id: number;
  title: string;
}
interface City {
  id: number;
  title: string;
}
interface Role {
  id: number;
  title: string;
}
interface User {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  password?: string;
  document: number;
  typeDocumentId: number;
  typeDocument?: TypeDocument;
  cityId?: number;
  city?: City;
  roles: Role[];
  roleIds: number[];
}

const headers = [
  { text: 'Nombre', value: 'firstName' },
  { text: 'Apellido', value: 'lastName' },
  { text: 'Correo', value: 'email' },
  { text: 'Tipo de Documento', value: 'typeDocument' },
  { text: 'Documento', value: 'document' },
  { text: 'Teléfono', value: 'telephone' },
  { text: 'Rol', value: 'roles' },
  { text: 'Ciudad', value: 'city' },
  { text: 'Acciones', value: 'actions', sortable: false },
];

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const typeDocuments = ref<TypeDocument[]>([]);
const cities = ref<City[]>([]);
const dialog = ref(false);
const editingUser = ref<User | null>(null);
const hasDuplicateDocument = ref(false);

const userForm = ref<User>({
  id: 0,
  firstName: '',
  lastName: '',
  telephone: '',
  email: '',
  password: '',
  document: '', // <-- string vacío
  typeDocumentId: 0,
  cityId: undefined,
  roles: [],
  roleIds: [],
});

const onlyLettersAndSpacesRegex = /^[\p{L}\s]+$/u;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateDuplicateDocument = (v: string | number) => {
  if (!v) return true;
  const exists = users.value.some(u =>
    String(u.document) === String(v) &&
    (!editingUser.value || u.id !== editingUser.value.id)
  );
  hasDuplicateDocument.value = exists;
  return !exists || 'Este documento ya existe';
};

watch(() => userForm.value.document, (newVal) => validateDuplicateDocument(newVal));

const fetchData = () => {
  fetchUsers();
  fetchRoles();
  fetchTypeDocuments();
  fetchCities();
};

const fetchUsers = async () => {
  try {
    const response = await service.index<User[]>(CONFIG.api.users, { with: 'roles,city,typeDocument' });
    users.value = response.map(user => ({
      ...user,
      roleIds: (user.roles || []).map(role => role.id),
      cityId: user.city?.id,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
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
  userForm.value = {
    id: 0,
    firstName: '',
    lastName: '',
    telephone: '',
    email: '',
    password: '',
    document: '', // <-- string vacío
    typeDocumentId: 0,
    cityId: undefined,
    roles: [],
    roleIds: [],
  };
  dialog.value = true;
};

const editUser = (user: User) => {
  editingUser.value = user;
  userForm.value = {
    ...user,
    password: '',
    roleIds: user.roleIds || (user.roles || []).map(r => r.id),
    cityId: user.city?.id,
  };
  dialog.value = true;
};

const saveUser = async () => {
  if (hasDuplicateDocument.value) return;
  try {
    const payload = {
      ...userForm.value,
      roles: userForm.value.roleIds,
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

onMounted(() => {
  fetchData();
});
</script>
