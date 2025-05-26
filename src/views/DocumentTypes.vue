<template>
    <v-container>
        <v-row justify="space-between" align="center" class="mb-4">
            <v-col cols="6">
                <h2 class="text-h5 font-weight-bold">Type Document Management</h2>
            </v-col>
            <v-col cols="6" class="text-right">
                <v-btn color="primary" @click="openCreateModal">Create Type Document</v-btn>
                <v-btn color="secondary" @click="fetchTypeDocuments" class="ml-2">Refresh</v-btn>
            </v-col>
        </v-row>

        <!-- Type Document Table -->
        <v-data-table :headers="headers" :items="typeDocuments" item-value="id" class="elevation-1">
            <template #item.actions="{ item }">
                <v-btn icon color="primary" @click="editTypeDocument(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="red" @click="deleteTypeDocument(item.id)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>

        <!-- Modal for Create/Edit Type Document -->
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h6">{{ editingTypeDocument ? 'Edit Type Document' : 'Create Type Document'
                    }}</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-text-field v-model="typeDocumentForm.abbreviation" label="Abbreviation"
                            :rules="[v => !!v || 'Abbreviation is required']" />
                        <v-text-field v-model="typeDocumentForm.title" label="Title"
                            :rules="[v => !!v || 'Title is required']" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="closeModal">Cancel</v-btn>
                    <v-btn color="primary" @click="saveTypeDocument">Save</v-btn>
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
    abbreviation: string;
    title: string;
}

const headers = [
    { text: 'Abbreviation', value: 'abbreviation' },
    { text: 'Title', value: 'title' },
    { text: 'Actions', value: 'actions', sortable: false },
];

const typeDocuments = ref<TypeDocument[]>([]);
const dialog = ref(false);
const editingTypeDocument = ref<TypeDocument | null>(null);
const typeDocumentForm = ref<TypeDocument>({
    id: 0,
    abbreviation: '',
    title: '',
});

const fetchTypeDocuments = async () => {
    try {
        const response = await service.index<TypeDocument[]>(CONFIG.api.typesDocuments);
        typeDocuments.value = response;
    } catch (error) {
        console.error('Error fetching type documents:', error);
    }
};

const openCreateModal = () => {
    editingTypeDocument.value = null;
    typeDocumentForm.value = {
        id: 0,
        abbreviation: '',
        title: '',
    };
    dialog.value = true;
};

const editTypeDocument = (typeDocument: TypeDocument) => {
    editingTypeDocument.value = typeDocument;
    typeDocumentForm.value = { ...typeDocument };
    dialog.value = true;
};

const saveTypeDocument = async () => {
    try {
        if (editingTypeDocument.value) {
            // Update type document
            await service.update(CONFIG.api.typesDocuments, editingTypeDocument.value.id.toString(), typeDocumentForm.value);
            const index = typeDocuments.value.findIndex((td) => td.id === editingTypeDocument.value?.id);
            if (index !== -1) {
                typeDocuments.value[index] = { ...typeDocumentForm.value };
            }
        } else {
            // Create type document
            const response = await service.store<TypeDocument>(CONFIG.api.typesDocuments, typeDocumentForm.value);
            typeDocuments.value.push(response);
        }
        dialog.value = false;
    } catch (error) {
        console.error('Error saving type document:', error);
    }
};

const deleteTypeDocument = async (id: number) => {
    try {
        await service.delete(CONFIG.api.typesDocuments, id.toString());
        typeDocuments.value = typeDocuments.value.filter((td) => td.id !== id);
    } catch (error) {
        console.error('Error deleting type document:', error);
    }
};

const closeModal = () => {
    dialog.value = false;
};

onMounted(() => {
    fetchTypeDocuments();
});
</script>