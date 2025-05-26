<template>
    <v-container>
        <v-row justify="space-between" align="center" class="mb-4">
            <v-col cols="6">
                <h2 class="text-h5 font-weight-bold">Status Management</h2>
            </v-col>
            <v-col cols="6" class="text-right">
                <v-btn color="primary" @click="openCreateModal">Create Status</v-btn>
                <v-btn color="secondary" @click="fetchStatuses" class="ml-2">Refresh</v-btn>
            </v-col>
        </v-row>

        <!-- Status Table -->
        <v-data-table :headers="headers" :items="statuses" item-value="id" class="elevation-1">
            <template #item.actions="{ item }">
                <v-btn icon color="primary" @click="editStatus(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="red" @click="deleteStatus(item.id)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>

        <!-- Modal for Create/Edit Status -->
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h6">{{ editingStatus ? 'Edit Status' : 'Create Status' }}</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-text-field v-model="statusForm.title" label="Title"
                            :rules="[v => !!v || 'Title is required']" />
                        <v-textarea v-model="statusForm.description" label="Description"
                            :rules="[v => !!v || 'Description is required']" />
                        <v-select v-model="statusForm.type" :items="types" label="Type"
                            :rules="[v => !!v || 'Type is required']" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="closeModal">Cancel</v-btn>
                    <v-btn color="primary" @click="saveStatus">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface Status {
    id: number;
    title: string;
    description: string;
    type: 'task' | 'project'; // Enum type
}

const headers = [
    { text: 'Title', value: 'title' },
    { text: 'Description', value: 'description' },
    { text: 'Type', value: 'type' },
    { text: 'Actions', value: 'actions', sortable: false },
];

const statuses = ref<Status[]>([]);
const dialog = ref(false);
const editingStatus = ref<Status | null>(null);
const statusForm = ref<Status>({
    id: 0,
    title: '',
    description: '',
    type: 'task', // Default to 'task'
});

const types = ['task', 'project']; // Enum values for the type field

const fetchStatuses = async () => {
    try {
        const response = await service.index<Status[]>(CONFIG.api.statuses);
        statuses.value = response;
    } catch (error) {
        console.error('Error fetching statuses:', error);
    }
};

const openCreateModal = () => {
    editingStatus.value = null;
    statusForm.value = {
        id: 0,
        title: '',
        description: '',
        type: 'task', // Default to 'task'
    };
    dialog.value = true;
};

const editStatus = (status: Status) => {
    editingStatus.value = status;
    statusForm.value = { ...status };
    dialog.value = true;
};

const saveStatus = async () => {
    try {
        if (editingStatus.value) {
            // Update status
            await service.update(CONFIG.api.statuses, editingStatus.value.id.toString(), statusForm.value);
            const index = statuses.value.findIndex((s) => s.id === editingStatus.value?.id);
            if (index !== -1) {
                statuses.value[index] = { ...statusForm.value };
            }
        } else {
            // Create status
            const response = await service.store<Status>(CONFIG.api.statuses, statusForm.value);
            statuses.value.push(response);
        }
        dialog.value = false;
    } catch (error) {
        console.error('Error saving status:', error);
    }
};

const deleteStatus = async (id: number) => {
    try {
        await service.delete(CONFIG.api.statuses, id.toString());
        statuses.value = statuses.value.filter((s) => s.id !== id);
    } catch (error) {
        console.error('Error deleting status:', error);
    }
};

const closeModal = () => {
    dialog.value = false;
};

onMounted(() => {
    fetchStatuses();
});
</script>