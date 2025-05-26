<template>
    <v-container>
        <v-row justify="space-between" align="center" class="mb-4">
            <v-col cols="6">
                <h2 class="text-h5 font-weight-bold">Priority Management</h2>
            </v-col>
            <v-col cols="6" class="text-right">
                <v-btn color="primary" @click="openCreateModal">Create Priority</v-btn>
                <v-btn color="secondary" @click="fetchPriorities" class="ml-2">Refresh</v-btn>
            </v-col>
        </v-row>

        <!-- Priority Table -->
        <v-data-table :headers="headers" :items="priorities" item-value="id" class="elevation-1">
            <template #item.actions="{ item }">
                <v-btn icon color="primary" @click="editPriority(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="red" @click="deletePriority(item.id)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>

        <!-- Modal for Create/Edit Priority -->
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h6">{{ editingPriority ? 'Edit Priority' : 'Create Priority' }}</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-text-field v-model="priorityForm.title" label="Title"
                            :rules="[v => !!v || 'Title is required']" />
                        <v-textarea v-model="priorityForm.description" label="Description"
                            :rules="[v => !!v || 'Description is required']" />
                        <v-select v-model="priorityForm.type" :items="types" label="Type"
                            :rules="[v => !!v || 'Type is required']" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="closeModal">Cancel</v-btn>
                    <v-btn color="primary" @click="savePriority">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface Priority {
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

const priorities = ref<Priority[]>([]);
const dialog = ref(false);
const editingPriority = ref<Priority | null>(null);
const priorityForm = ref<Priority>({
    id: 0,
    title: '',
    description: '',
    type: 'task', // Default to 'task'
});

const types = ['task', 'project']; // Enum values for the type field

const fetchPriorities = async () => {
    try {
        const response = await service.index<Priority[]>(CONFIG.api.priorities);
        priorities.value = response;
    } catch (error) {
        console.error('Error fetching priorities:', error);
    }
};

const openCreateModal = () => {
    editingPriority.value = null;
    priorityForm.value = {
        id: 0,
        title: '',
        description: '',
        type: 'task', // Default to 'task'
    };
    dialog.value = true;
};

const editPriority = (priority: Priority) => {
    editingPriority.value = priority;
    priorityForm.value = { ...priority };
    dialog.value = true;
};

const savePriority = async () => {
    try {
        if (editingPriority.value) {
            // Update priority
            await service.update(CONFIG.api.priorities, editingPriority.value.id.toString(), priorityForm.value);
            const index = priorities.value.findIndex((p) => p.id === editingPriority.value?.id);
            if (index !== -1) {
                priorities.value[index] = { ...priorityForm.value };
            }
        } else {
            // Create priority
            const response = await service.store<Priority>(CONFIG.api.priorities, priorityForm.value);
            priorities.value.push(response);
        }
        dialog.value = false;
    } catch (error) {
        console.error('Error saving priority:', error);
    }
};

const deletePriority = async (id: number) => {
    try {
        await service.delete(CONFIG.api.priorities, id.toString());
        priorities.value = priorities.value.filter((p) => p.id !== id);
    } catch (error) {
        console.error('Error deleting priority:', error);
    }
};

const closeModal = () => {
    dialog.value = false;
};

onMounted(() => {
    fetchPriorities();
});
</script>