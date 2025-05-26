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
      <template #item.roles="{ item }">
        <span>{{item.roles.map(role => role.title).join(', ')}}</span>
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
            <v-text-field v-model="userForm.email" label="Email" :rules="[v => !!v || 'Email is required']" />
            <v-select v-model="userForm.roleIds" :items="roles" item-text="name" item-value="id" label="Roles" multiple
              :rules="[v => v && v.length > 0 || 'At least one role is required']" />
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

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city?: City; // Optional city field
  roles: Role[]; // Include roles as an array of Role objects
  roleIds: number[]; // Used for selecting roles in the form
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
  { text: 'Roles', value: 'roles' },
  { text: 'City', value: 'city' },
  { text: 'Actions', value: 'actions', sortable: false },
];

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const dialog = ref(false);
const editingUser = ref<User | null>(null);
const userForm = ref<User>({
  id: 0,
  firstName: '',
  lastName: '',
  email: '',
  roles: [],
  roleIds: [], // Initialize as an empty array
});

const fetchData = () => {
  fetchUsers();
  fetchRoles();
}

const fetchUsers = async () => {
  try {
    const response = await service.index<User[]>(CONFIG.api.users, { with: 'roles,city' });
    users.value = response.map(user => ({
      ...user,
      roleIds: (user.roles || []).map(role => role.id), // Map roles to roleIds for the form
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

const openCreateModal = () => {
  editingUser.value = null;
  userForm.value = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    roles: [],
    roleIds: [],
  };
  dialog.value = true;
};

const editUser = (user: User) => {
  editingUser.value = user;
  userForm.value = { ...user, roleIds: user.roleIds || [] };
  dialog.value = true;
};

const saveUser = async () => {
  try {
    const payload = {
      ...userForm.value,
      roles: userForm.value.roleIds, // Send roles as an array of IDs
    };

    if (editingUser.value) {
      // Update user
      await service.update(CONFIG.api.users, editingUser.value.id.toString(), payload);
      const index = users.value.findIndex((u) => u.id === editingUser.value?.id);
      if (index !== -1) {
        users.value[index] = { ...userForm.value, roles: editingUser.value.roles };
      }
    } else {
      // Create user
      const response = await service.store<User>(CONFIG.api.users, payload);
      users.value.push(response);
    }
    dialog.value = false;
    fetchData(); // Refresh the user list
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
});
</script>
