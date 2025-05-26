<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="6">
        <h2 class="text-h5 font-weight-bold">User Management</h2>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="primary" @click="openCreateModal">Create User</v-btn>
        <v-btn color="secondary" @click="fetchData" class="ml-2">Refresh</v-btn>
      </v-col>
    </v-row>

    <!-- User Table -->
    <v-data-table :headers="headers" :items="users" item-value="id" class="elevation-1">
      <template #item.typeDocument="{ item }">
        <span>{{ item.typeDocument?.title ?? '' }}</span>
      </template>
      <template #item.document="{ item }">
        <span>{{ item.document }}</span>
      </template>
      <template #item.roles="{ item }">
        <span>{{(item.roles??[]).map(role => role.title).join(', ')}}</span>
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

    <!-- Modal for Create/Edit User -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ editingUser ? 'Edit User' : 'Create User' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="userForm.firstName" label="First Name"
              :rules="[v => !!v || 'First name is required']" />
            <v-text-field v-model="userForm.lastName" label="Last Name"
              :rules="[v => !!v || 'Last name is required']" />
            <v-text-field v-model="userForm.telephone" label="Telephone" :rules="[v => !!v || 'Telephone is required']" />
            <v-text-field v-model="userForm.email" label="Email" :rules="[v => !!v || 'Email is required']" />
              <v-text-field v-model="userForm.password" label="Password" :rules="[v => !!v || 'Password is required']" />
            <v-select v-model="userForm.roleIds" :items="roles" item-text="title" item-value="id" label="Roles" multiple
              :rules="[v => v && v.length > 0 || 'At least one role is required']" />
              <v-select
              v-model="userForm.typeDocumentId"
              :items="typeDocuments"
              item-text="title"
              item-value="id"
              label="Document Type"
              :rules="[v => !!v || 'Document type is required']"
            />
            <v-text-field
              v-model="userForm.document"
              label="Document"
              :rules="[v => !!v || 'Document is required']"
              type="number"
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
import { ref, onMounted } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface TypeDocument {
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
  document: number;
  typeDocumentId: number;
  typeDocument?: TypeDocument;
  city?: City;
  roles: Role[];
  roleIds: number[];
}

interface Role {
  id: number;
  title: string;
}

interface City {
  id: number;
  title: string;
}

const headers = [
  { text: 'First Name', value: 'firstName' },
  { text: 'Last Name', value: 'lastName' },
  { text: 'Email', value: 'email' },
  { text: 'Document Type', value: 'typeDocument' },
  { text: 'Document', value: 'document' },
  { text: 'Roles', value: 'roles' },
  { text: 'City', value: 'city' },
  { text: 'Actions', value: 'actions', sortable: false },
];

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const typeDocuments = ref<TypeDocument[]>([]);
const dialog = ref(false);
const editingUser = ref<User | null>(null);
const userForm = ref<User>({
  id: 0,
  firstName: '',
  lastName: '',
  telephone: '',
  email: '',
  password: '',
  document: 0,
  typeDocumentId: 0,
  roles: [],
  roleIds: [],
});

const fetchData = () => {
  fetchUsers();
  fetchRoles();
  fetchTypeDocuments();
}

const fetchUsers = async () => {
  try {
    const response = await service.index<User[]>(CONFIG.api.users, { with: 'roles,city,typeDocument' });
    users.value = response.map(user => ({
      ...user,
      roleIds: (user.roles || []).map(role => role.id),
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

const openCreateModal = () => {
  editingUser.value = null;
  userForm.value = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    document: 0,
    typeDocumentId: 0,
    roles: [],
    roleIds: [],
  };
  dialog.value = true;
};

const editUser = (user: User) => {
  editingUser.value = user;
  userForm.value = {
    ...user,
    roleIds: user.roleIds || [],
    document: user.document,
    typeDocumentId: user.typeDocumentId,
  };
  dialog.value = true;
};

const saveUser = async () => {
  try {
    const payload = {
      ...userForm.value,
      roles: userForm.value.roleIds,
    };

    if (editingUser.value) {
      await service.update(CONFIG.api.users, editingUser.value.id.toString(), payload);
      const index = users.value.findIndex((u) => u.id === editingUser.value?.id);
      if (index !== -1) {
        users.value[index] = { ...userForm.value, roles: editingUser.value.roles };
      }
    } else {
      const response = await service.store<User>(CONFIG.api.users, payload);
      users.value.push(response);
    }
    dialog.value = false;
    fetchData();
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const deleteUser = async (id: number) => {
  try {
    await service.delete(CONFIG.api.users, id.toString());
    users.value = users.value.filter((u) => u.id !== id);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const closeModal = () => {
  dialog.value = false;
};

onMounted(() => {
  fetchUsers();
  fetchRoles();
  fetchTypeDocuments();
});
</script>
