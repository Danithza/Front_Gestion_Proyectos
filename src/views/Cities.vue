<template>
    <v-container>
        <v-row justify="space-between" align="center" class="mb-4">
            <v-col cols="6">
                <h2 class="text-h5 font-weight-bold">City Management</h2>
            </v-col>
            <v-col cols="6" class="text-right">
                <v-btn color="primary" @click="openCreateModal">Create City</v-btn>
                <v-btn color="secondary" @click="fetchCities" class="ml-2">Refresh</v-btn>
            </v-col>
        </v-row>

        <!-- City Table -->
        <v-data-table :headers="headers" :items="cities" item-value="id" class="elevation-1">
            <template #item.actions="{ item }">
                <v-btn icon color="primary" @click="editCity(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="red" @click="deleteCity(item.id)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>

        <!-- Modal for Create/Edit City -->
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h6">{{ editingCity ? 'Edit City' : 'Create City' }}</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-text-field v-model="cityForm.title" label="Title"
                            :rules="[v => !!v || 'Title is required']" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="closeModal">Cancel</v-btn>
                    <v-btn color="primary" @click="saveCity">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface City {
    id: number;
    title: string;
}

const headers = [
    { text: 'Title', value: 'title' },
    { text: 'Actions', value: 'actions', sortable: false },
];

const cities = ref<City[]>([]);
const dialog = ref(false);
const editingCity = ref<City | null>(null);
const cityForm = ref<City>({
    id: 0,
    title: '',
});

const fetchCities = async () => {
    try {
        const response = await service.index<City[]>(CONFIG.api.cities);
        cities.value = response;
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
};

const openCreateModal = () => {
    editingCity.value = null;
    cityForm.value = {
        id: 0,
        title: '',
    };
    dialog.value = true;
};

const editCity = (city: City) => {
    editingCity.value = city;
    cityForm.value = { ...city };
    dialog.value = true;
};

const saveCity = async () => {
    try {
        if (editingCity.value) {
            // Update city
            await service.update(CONFIG.api.cities, editingCity.value.id.toString(), cityForm.value);
            const index = cities.value.findIndex((c) => c.id === editingCity.value?.id);
            if (index !== -1) {
                cities.value[index] = { ...cityForm.value };
            }
        } else {
            // Create city
            const response = await service.store<City>(CONFIG.api.cities, cityForm.value);
            cities.value.push(response);
        }
        dialog.value = false;
    } catch (error) {
        console.error('Error saving city:', error);
    }
};

const deleteCity = async (id: number) => {
    try {
        await service.delete(CONFIG.api.cities, id.toString());
        cities.value = cities.value.filter((c) => c.id !== id);
    } catch (error) {
        console.error('Error deleting city:', error);
    }
};

const closeModal = () => {
    dialog.value = false;
};

onMounted(() => {
    fetchCities();
});
</script>