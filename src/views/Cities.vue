<template>
  <v-container class="py-8">
    <!-- Título y botones -->
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h2 class="text-h4 font-weight-bold text-primary">🏙️ Gestión de Ciudades</h2>
        <p class="text-caption text-medium-emphasis">Administra las ciudades disponibles en la plataforma</p>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn color="primary" size="large" @click="openCreateModal" class="shadow-lg">
          <v-icon left>mdi-plus-circle-outline</v-icon> Nueva Ciudad
        </v-btn>
        <v-btn color="secondary" size="large" class="ml-2" @click="refreshData">
          <v-icon left>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <!-- Filtro de búsqueda -->
      <v-col cols="12" md="3" class="pr-md-6">
        <v-card class="pa-4 rounded-lg sticky-filter" elevation="2">
          <h3 class="text-h6 mb-4 d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-filter</v-icon>
            Buscar
          </h3>
          <v-text-field v-model="filters.search" label="Buscar ciudad" clearable outlined dense
            prepend-inner-icon="mdi-magnify" @click:clear="resetFilters" />
          <v-btn block color="secondary" variant="outlined" class="mt-2" @click="resetFilters">
            Limpiar búsqueda
          </v-btn>
        </v-card>
      </v-col>

      <!-- Tarjetas de Ciudades -->
      <v-col cols="12" md="9">
        <transition-group name="list" tag="div" class="d-flex flex-wrap" style="gap: 16px;">
          <v-card v-for="item in cities" :key="item.id" class="city-card pa-4 rounded-xl" elevation="2"
            :style="{ borderLeft: '4px solid ' + getRandomColor() }">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="d-flex align-center">
                <v-avatar size="40" color="black" class="mr-3">
                  <v-icon color="white">mdi-city-variant-outline</v-icon>
                </v-avatar>
                <div>
                  <span class="text-h6 font-weight-bold d-block">{{ item.title }}</span>
                  <span class="text-caption text-medium-emphasis">ID: {{ item.id }}</span>
                </div>
              </div>
              <div class="d-flex align-center" style="gap: 8px;">
                <v-btn icon variant="text" color="blue" size="small" @click="editCity(item)" title="Editar">
                  <v-icon>mdi-pencil-box-multiple-outline</v-icon>
                </v-btn>
                <v-btn icon variant="text" color="red" size="small" @click="confirmDelete(item.id)" title="Eliminar">
                  <v-icon>mdi-delete-alert-outline</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </transition-group>

        <!-- Mensaje cuando no hay resultados con filtros -->
        <v-alert v-if="cities.length === 0 && hasActiveFilters" type="info" variant="tonal" class="mt-4">
          No se encontraron ciudades con la búsqueda aplicada
        </v-alert>

        <!-- Mensaje cuando no hay datos -->
        <v-alert v-if="cities.length === 0 && !loading && !hasActiveFilters" type="info" variant="tonal" class="mt-4">
          No hay ciudades registradas
        </v-alert>

        <!-- Cargando datos -->
        <v-progress-circular v-if="loading" indeterminate color="primary" class="mt-4"></v-progress-circular>

        <!-- Paginador -->
        {{ pagination.total }} ciudades encontradas
        <v-pagination v-if="pagination.total > pagination.itemsPerPage" v-model="pagination.page"
          :length="Math.ceil(pagination.total / pagination.itemsPerPage)" class="mt-6" />
      </v-col>
    </v-row>

    <!-- Modal Crear/Editar Ciudad -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="rounded-lg">
        <v-toolbar :color="editingCity ? 'blue-darken-2' : 'primary'" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon left>{{ editingCity ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            {{ editingCity ? 'Editar Ciudad' : 'Crear Ciudad' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal" variant="text" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <v-form ref="form" lazy-validation>
            <v-text-field v-model="cityForm.title" label="Nombre de la ciudad" outlined :rules="titleRules"
              @input="normalizeCityName" class="mb-4" />

            <v-alert v-if="hasDuplicate" type="error" variant="tonal" class="mb-4" border="start" border-color="error"
              density="compact" icon="mdi-alert-circle-outline">
              <strong>Error:</strong> Esta ciudad ya existe (incluyendo variaciones con tildes o espacios)
            </v-alert>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeModal" :disabled="isSaving">
            Cancelar
          </v-btn>
          <v-btn color="primary" :loading="isSaving" :disabled="isSaving || hasDuplicate" @click="saveCity"
            variant="elevated">
            {{ editingCity ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmación eliminar -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400px">
      <v-card class="rounded-lg">
        <v-toolbar color="red-darken-1" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon left>mdi-alert</v-icon>
            Confirmar eliminación
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pa-4">
          <div class="d-flex align-center mb-4">
            <v-icon color="red" size="large" class="mr-2">mdi-alert-circle-outline</v-icon>
            <span>¿Estás seguro de que deseas eliminar esta ciudad?</span>
          </div>
          <p class="text-caption text-medium-emphasis">Esta acción no se puede deshacer.</p>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="confirmDeleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="red" variant="elevated" @click="deleteConfirmed">
            <v-icon left>mdi-delete</v-icon>
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="bottom right">
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ snackbarIcon }}</v-icon>
        {{ snackbarMessage }}
      </div>
      <template v-slot:actions>
        <v-btn icon @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
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
const loading = ref(true);
const dialog = ref(false);
const editingCity = ref<City | null>(null);
const cityForm = ref<Omit<City, 'id'> & { id?: number }>({ title: '' });

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const snackbarIcon = ref('mdi-check-circle');
const isSaving = ref(false);
const hasDuplicate = ref(false);
const confirmDeleteDialog = ref(false);
const idToDelete = ref<number | null>(null);

// Filtros
const filters = ref({
  search: ''
});

// Paginación
const pagination = ref({
  page: 1,
  itemsPerPage: 10,
  total: 0
});

// Verificar si hay filtros activos
const hasActiveFilters = computed(() => {
  return !!filters.value.search;
});

const resetFilters = () => {
  filters.value = {
    search: ''
  };
  pagination.value.page = 1;
};

const refreshData = () => {
  fetchCities();
};

// Colores aleatorios para las tarjetas
const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const normalizeForComparison = (str: string) => {
  return str
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

// Validación de nombres duplicados
const validateDuplicateTitle = (v: string) => {
  if (!v) {
    hasDuplicate.value = false;
    return true;
  }

  const normalizedInput = normalizeForComparison(v);

  const exists = cities.value.some(c => {
    const normalizedExisting = normalizeForComparison(c.title);
    return normalizedExisting === normalizedInput &&
      (!editingCity.value || c.id !== editingCity.value.id);
  });

  hasDuplicate.value = exists;
  return !exists || 'Esta ciudad ya existe';
};

// Función para normalizar el input (permite escribir artículos)
const normalizeCityName = () => {
  if (cityForm.value.title) {
    cityForm.value.title = cityForm.value.title
    checkDuplicateTitle();
  }
};

// Verificar duplicados
const checkDuplicateTitle = () => {
  validateDuplicateTitle(cityForm.value.title);
};

watch(() => cityForm.value.title, () => checkDuplicateTitle());

// Validaciones del campo
const titleRules = [
  (v: string) => !!v || 'Campo obligatorio',
  (v: string) => (v && v.length >= 3) || 'Mínimo 3 caracteres',
  (v: string) => /^[\p{L}\s'-]+$/u.test(v) || 'Solo letras, espacios y guiones/apóstrofes permitidos',
  () => !hasDuplicate.value || 'Esta ciudad ya existe'
];

// CRUD funciones
const fetchCities = async () => {
  try {
    loading.value = true;
    // Construir parámetros de consulta
    const params: any = {
      page: pagination.value.page,
      per_page: pagination.value.itemsPerPage,
    };
    if (filters.value.search) {
      params.page = 1
      params.search = filters.value.search
    };

    // Llama al API con filtros y paginación
    const response = await service.index<{ data: City[], total: number }>(CONFIG.api.cities, params);
    cities.value = response.data;
    pagination.value.total = response.meta.total;
  } catch (error) {
    showSnackbar('Error al obtener ciudades', 'error');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  editingCity.value = null;
  cityForm.value = { title: '' };
  hasDuplicate.value = false;
  dialog.value = true;
};

const editCity = (city: City) => {
  editingCity.value = city;
  cityForm.value = { ...city };
  hasDuplicate.value = false;
  dialog.value = true;
};

const saveCity = async () => {
  if (hasDuplicate.value) return;
  isSaving.value = true;
  try {
    normalizeCityName();

    if (editingCity.value && cityForm.value.id) {
      await service.update(CONFIG.api.cities, editingCity.value.id.toString(), cityForm.value);
      fetchCities();
      showSnackbar('Ciudad actualizada correctamente', 'success');
    } else {
      await service.store<City>(CONFIG.api.cities, cityForm.value);
      fetchCities();
      showSnackbar('Ciudad creada exitosamente', 'success');
    }
    dialog.value = false;
  } catch (error) {
    showSnackbar('Error al guardar los cambios', 'error');
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
      fetchCities();
      showSnackbar('Ciudad eliminada con éxito', 'success');
    } catch (error) {
      showSnackbar('Error al eliminar la ciudad', 'error');
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
  snackbarIcon.value = color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
  snackbar.value = true;
};

// Observar cambios en filtros y paginación para recargar datos
watch(
  () => [filters.value.search, pagination.value.page, pagination.value.itemsPerPage],
  () => {
    fetchCities();
  }
);

onMounted(fetchCities);
</script>

<style scoped>
.sticky-filter {
  position: sticky;
  top: 20px;
}

.city-card {
  transition: all 0.3s ease;
  width: calc(33.333% - 11px);
  min-width: 280px;
  flex-grow: 1;
}

.city-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@media (max-width: 960px) {
  .city-card {
    width: calc(50% - 8px);
  }
}

@media (max-width: 600px) {
  .city-card {
    width: 100%;
  }
}
</style>
