<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="6">
        <h2 class="text-h5 font-weight-bold">Role Management</h2>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="primary" @click="openCreateModal">Create Role</v-btn>
        <v-btn color="secondary" @click="fetchRoles" class="ml-2">Refresh</v-btn>
      </v-col>
    </v-row>

    <!-- Role Table -->
    <v-data-table :headers="headers" :items="roles" item-value="id" class="elevation-1">
      <template #item.permissions="{ item }">
        <span>{{ item.permissions }}</span>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon color="primary" @click="editRole(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="deleteRole(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Modal for Create/Edit Role -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ editingRole ? 'Edit Role' : 'Create Role' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="roleForm.title" label="Title" :rules="[v => !!v || 'Title is required']" />
            <v-textarea v-model="roleForm.description" label="Description"
              :rules="[v => !!v || 'Description is required']" />
            <v-textarea v-model="roleForm.permissions" label="Permissions (comma-separated)"
              :rules="[v => !!v || 'Permissions are required']" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeModal">Cancel</v-btn>
          <v-btn color="primary" @click="saveRole">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface Role {
  id: number;
  title: string;
  description: string;
  permissions: string;
}

const headers = [
  { text: 'Title', value: 'title' },
  { text: 'Description', value: 'description' },
  { text: 'Permissions', value: 'permissions' },
  { text: 'Actions', value: 'actions', sortable: false },
];

const roles = ref<Role[]>([]);
const dialog = ref(false);
const editingRole = ref<Role | null>(null);
const roleForm = ref<Role>({
  id: 0,
  title: '',
  description: '',
  permissions: '',
});

const fetchRoles = async () => {
  try {
    const response = await service.index<Role[]>(CONFIG.api.roles);
    roles.value = response;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

const openCreateModal = () => {
  editingRole.value = null;
  roleForm.value = {
    id: 0,
    title: '',
    description: '',
    permissions: '',
  };
  dialog.value = true;
};

const editRole = (role: Role) => {
  editingRole.value = role;
  roleForm.value = { ...role };
  dialog.value = true;
};

const saveRole = async () => {
  try {
    if (editingRole.value) {
      // Update role
      await service.update(CONFIG.api.roles, editingRole.value.id.toString(), roleForm.value);
      const index = roles.value.findIndex((r) => r.id === editingRole.value?.id);
      if (index !== -1) {
        roles.value[index] = { ...roleForm.value };
      }
    } else {
      // Create role
      const response = await service.store<Role>(CONFIG.api.roles, roleForm.value);
      roles.value.push(response);
    }
    dialog.value = false;
  } catch (error) {
    console.error('Error saving role:', error);
  }
};

const deleteRole = async (id: number) => {
  try {
    await service.delete(CONFIG.api.roles, id.toString());
    roles.value = roles.value.filter((r) => r.id !== id);
  } catch (error) {
    console.error('Error deleting role:', error);
  }
};

const closeModal = () => {
  dialog.value = false;
};

onMounted(() => {
  fetchRoles();
});
</script>