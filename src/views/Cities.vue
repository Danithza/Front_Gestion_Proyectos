<template>
  <v-container>
    <!-- Título y botones -->
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="6">
        <h2 class="text-h4 font-weight-bold">🏙️ Gestión de Ciudades</h2>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="primary" dark @click="openCreateModal">
          <v-icon left>mdi-plus-circle-outline</v-icon> Nueva Ciudad
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-row class="mb-4" dense>
      <v-col cols="12" sm="6">
        <v-autocomplete
          v-model="filters.title"
          :items="uniqueTitles"
          label="Filtrar por Título"
          clearable
          dense
          outlined
          prepend-inner-icon="mdi-filter"
          hide-no-data
          :search-input.sync="searchTitle"
          @click:clear="resetFilters"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="filters.search"
          label="Buscar"
          clearable
          dense
          outlined
          prepend-inner-icon="mdi-magnify"
          @click:clear="resetFilters"
        />
      </v-col>
    </v-row>

    <!-- Tarjetas de Ciudades -->
    <v-row dense>
      <v-col cols="12" md="4" v-for="item in filteredCities" :key="item.id">
        <v-card class="rounded-lg pa-4" :style="{ border: '2px solid #1976d2' }">
          <v-card-title class="font-weight-bold text-h6">
            <v-icon left>mdi-city</v-icon> {{ item.title }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn icon @click="editCity(item)">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn icon @click="confirmDelete(item.id)">
              <v-icon color="red">mdi-trash-can-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal Crear/Editar Ciudad -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="bg-primary text-white">
          <v-icon left>mdi-note-edit-outline</v-icon>
          {{ editingCity ? 'Editar Ciudad' : 'Crear Ciudad' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="cityForm.title"
              label="Título"
              dense
              :rules="[...titleRules, validateDuplicateTitle]"
              @input="filterOnlyLettersAndSpaces('title')"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeModal" :disabled="isSaving">Cancelar</v-btn>
          <v-btn 
            color="primary" 
            dark 
            @click="saveCity"
            :loading="isSaving"
            :disabled="isSaving || hasDuplicate"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmación eliminar -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400px">
      <v-card class="rounded-lg">
        <v-card-title class="text-h6 font-weight-bold">⚠️ Confirmar eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar esta ciudad?</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" dark @click="deleteConfirmed">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

interface City {
  id: number;
  title: string;
}

const cities = ref<City[]>([]);
const dialog = ref(false);
const editingCity = ref<City | null>(null);
const cityForm = ref<City>({ id: 0, title: '' });

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const isSaving = ref(false);
const hasDuplicate = ref(false);
const confirmDeleteDialog = ref(false);
const idToDelete = ref<number | null>(null);

// Filtros
const filters = ref({ title: '', search: '' });
const searchTitle = ref('');
const resetFilters = () => filters.value = { title: '', search: '' };

// Autocompletado
const uniqueTitles = computed(() => Array.from(new Set(cities.value.map(c => c.title))));

// Filtrado de ciudades
const filteredCities = computed(() =>
  cities.value.filter(city =>
    (!filters.value.title || city.title.toLowerCase().includes(filters.value.title.toLowerCase())) &&
    (!filters.value.search || city.title.toLowerCase().includes(filters.value.search.toLowerCase()))
  )
);

// Validaciones
const onlyLettersAndSpacesRegex = /^[\p{L}\s]+$/u;
const titleRules = [
  (v: string) => !!v || 'Campo obligatorio',
  (v: string) => onlyLettersAndSpacesRegex.test(v) || 'Solo letras y espacios permitidos',
];

const validateDuplicateTitle = (v: string) => {
  if (!v) return true;
  const exists = cities.value.some(c =>
    c.title.toLowerCase() === v.toLowerCase() &&
    (!editingCity.value || c.id !== editingCity.value.id)
  );
  hasDuplicate.value = exists;
  return !exists || 'Este título ya existe';
};

watch(() => cityForm.value.title, (newVal) => validateDuplicateTitle(newVal));

function filterOnlyLettersAndSpaces(field: 'title') {
  const val = cityForm.value[field];
  cityForm.value[field] = val.replace(/[^\p{L}\s]/gu, '');
}

// CRUD funciones
const fetchCities = async () => {
  try {
    const response = await service.index<City[]>(CONFIG.api.cities);
    cities.value = response;
  } catch (error) {
    showSnackbar('Error al obtener ciudades', 'error');
  }
};

const openCreateModal = () => {
  editingCity.value = null;
  cityForm.value = { id: 0, title: '' };
  dialog.value = true;
};

const editCity = (city: City) => {
  editingCity.value = city;
  cityForm.value = { ...city };
  dialog.value = true;
};

const saveCity = async () => {
  if (hasDuplicate.value) return;
  isSaving.value = true;
  try {
    if (editingCity.value) {
      await service.update(CONFIG.api.cities, editingCity.value.id.toString(), cityForm.value);
      const index = cities.value.findIndex(c => c.id === editingCity.value?.id);
      if (index !== -1) cities.value[index] = { ...cityForm.value };
      showSnackbar('Ciudad actualizada', 'success');
    } else {
      const response = await service.store<City>(CONFIG.api.cities, cityForm.value);
      cities.value.push(response);
      showSnackbar('Ciudad creada', 'success');
    }
    dialog.value = false;
  } catch (error) {
    showSnackbar('Error al guardar', 'error');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = (id: number) => {
  idToDelete.value = id;
  confirmDeleteDialog.value = true;
};

const deleteConfirmed = async () => {
  if (idToDelete.value !== null) {
    try {
      await service.delete(CONFIG.api.cities, idToDelete.value.toString());
      cities.value = cities.value.filter(c => c.id !== idToDelete.value);
      showSnackbar('Ciudad eliminada', 'success');
    } catch (error) {
      showSnackbar('Error al eliminar', 'error');
    } finally {
      confirmDeleteDialog.value = false;
      idToDelete.value = null;
    }
  }
};

const closeModal = () => {
  dialog.value = false;
};

const showSnackbar = (message: string, color = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(fetchCities);
</script>