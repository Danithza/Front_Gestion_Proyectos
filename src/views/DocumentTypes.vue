<template>
  <v-container class="py-8">
    <!-- Título y botones -->
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="12" md="6">
        <h2 class="text-h4 font-weight-bold text-primary">📁 Tipos de Documento</h2>
        <p class="text-caption text-medium-emphasis">Administra los tipos de documentos del sistema</p>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn
          color="primary"
          size="large"
          @click="openCreateModal"
          class="shadow-lg"
        >
          <v-icon left>mdi-plus-circle-outline</v-icon> Nuevo Documento
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
     <!-- Tarjetas de Documentos con diseño uniforme -->
<v-col cols="12">
  <transition-group name="list" tag="div" class="d-flex flex-wrap" style="gap: 10px;">
    <v-card
      v-for="item in typeDocuments"
      :key="item.id"
      class="pa-3 rounded-xl d-flex flex-column justify-space-between"
      elevation="2"
      style="width: calc(33.33% - 12px); height: 120px; min-width: 220px; max-width: 100%; overflow: hidden; border-left: 5px solid"
      :style="{ borderLeftColor: getColorById(item.id) }"
    >
      <div class="d-flex align-center mb-2">
        <v-avatar size="36" color="black" class="mr-3">
          <v-icon color="white">mdi-file-document-outline</v-icon>
        </v-avatar>
        <div class="flex-grow-1 overflow-hidden">
          <div
            class="text-subtitle-1 font-weight-bold text-truncate"
            style="max-width: 100%;"
            :title="item.abbreviation"
          >
            {{ item.abbreviation }}
          </div>
          <div
            class="text-caption text-medium-emphasis text-truncate"
            style="max-width: 100%;"
            :title="item.title"
          >
            {{ item.title }}
          </div>
        </div>
      </div>

     <div class="d-flex justify-end mt-auto">
        <v-btn
          icon
          variant="text"
          color="blue"
          size="small"
          @click="editTypeDocument(item)"
          title="Editar"
        >
          <v-icon>mdi-pencil-box-multiple-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          color="red"
          size="small"
          @click="confirmDelete(item.id)"
          title="Eliminar"
        >
          <v-icon>mdi-delete-alert-outline</v-icon>
        </v-btn>
      </div>
    </v-card>
  </transition-group>

  <!-- Mensaje cuando no hay datos -->
  <v-alert
    v-if="typeDocuments.length === 0 && !loading"
    type="info"
    variant="tonal"
    class="mt-3"
  >
    No hay tipos de documento registrados
  </v-alert>

  <!-- Cargando datos -->
  <v-progress-circular
    v-if="loading"
    indeterminate
    color="primary"
    class="mt-3"
  ></v-progress-circular>
</v-col>

    </v-row>

    <!-- Modal Crear/Editar Documento -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="rounded-lg">
        <v-toolbar :color="editingTypeDocument ? 'blue-darken-2' : 'primary'" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon left>{{ editingTypeDocument ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            {{ editingTypeDocument ? 'Editar Documento' : 'Crear Documento' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal" variant="text" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="typeDocumentForm.abbreviation"
              label="Abreviatura"
              outlined
              :rules="abbrRules"
              @input="filterOnlyLettersAndSpaces('abbreviation')"
              class="mb-4"
            />

            <v-text-field
              v-model="typeDocumentForm.title"
              label="Título"
              outlined
              :rules="titleRules"
              @input="filterOnlyLettersAndSpaces('title')"
              class="mb-4"
            />

            <v-alert
              v-if="hasDuplicate"
              type="error"
              variant="tonal"
              class="mb-4"
              border="start"
              border-color="error"
              density="compact"
              icon="mdi-alert-circle-outline"
            >
              <strong>Error:</strong> Este tipo de documento ya existe
            </v-alert>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="closeModal"
            :disabled="isSaving"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="isSaving"
            :disabled="isSaving || hasDuplicate"
            @click="saveTypeDocument"
            variant="elevated"
          >
            {{ editingTypeDocument ? 'Actualizar' : 'Crear' }}
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
            <span>¿Estás seguro de que deseas eliminar este tipo de documento?</span>
          </div>
          <p class="text-caption text-medium-emphasis">Esta acción no se puede deshacer.</p>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="confirmDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="red"
            variant="elevated"
            @click="deleteTypeDocument"
          >
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

const getColorById = (id: number) => {
  const index = id % colors.length;
  return colors[index];
};

interface TypeDocument {
  id: number;
  abbreviation: string;
  title: string;
}

const typeDocuments = ref<TypeDocument[]>([]);
const loading = ref(true);
const dialog = ref(false);
const editingTypeDocument = ref<TypeDocument | null>(null);
const typeDocumentForm = ref<Omit<TypeDocument, 'id'> & { id?: number }>({ abbreviation: '', title: '' });

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const snackbarIcon = ref('mdi-check-circle');
const isSaving = ref(false);
const hasDuplicate = ref(false);
const confirmDeleteDialog = ref(false);
const idToDelete = ref<number | null>(null);

// Colores aleatorios para las tarjetas
const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// Función para normalizar nombres
const normalizeForComparison = (str: string) => {
  return str
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

// Validación de documentos duplicados
const validateDuplicateAbbreviation = (v: string) => {
  if (!v) {
    hasDuplicate.value = false;
    return true;
  }

  const normalizedInput = normalizeForComparison(v);

  const exists = typeDocuments.value.some(d => {
    const normalizedExisting = normalizeForComparison(d.abbreviation);
    return normalizedExisting === normalizedInput &&
           (!editingTypeDocument.value || d.id !== editingTypeDocument.value.id);
  });

  hasDuplicate.value = exists;
  return !exists || 'Esta abreviatura ya existe';
};

const validateDuplicateTitle = (v: string) => {
  if (!v) {
    hasDuplicate.value = false;
    return true;
  }

  const normalizedInput = normalizeForComparison(v);

  const exists = typeDocuments.value.some(d => {
    const normalizedExisting = normalizeForComparison(d.title);
    return normalizedExisting === normalizedInput &&
           (!editingTypeDocument.value || d.id !== editingTypeDocument.value.id);
  });

  if (exists) hasDuplicate.value = true;
  return !exists || 'Este título ya existe';
};

// Validaciones del campo
const onlyLettersAndSpacesRegex = /^[\p{L}\s]+$/u;
const abbrRules = [
  (v: string) => !!v || 'Campo obligatorio',
  (v: string) => onlyLettersAndSpacesRegex.test(v) || 'Solo letras y espacios permitidos',
  (v: string) => (v && v.length >= 2) || 'Mínimo 2 caracteres',
  (v: string) => (v && v.length <= 10) || 'Máximo 10 caracteres',
  () => !hasDuplicate.value || 'Este documento ya existe'
];

const titleRules = [
  (v: string) => !!v || 'Campo obligatorio',
  (v: string) => onlyLettersAndSpacesRegex.test(v) || 'Solo letras y espacios permitidos',
  (v: string) => (v && v.length >= 3) || 'Mínimo 3 caracteres',
  (v: string) => (v && v.length <= 50) || 'Máximo 50 caracteres',
  () => !hasDuplicate.value || 'Este documento ya existe'
];

function filterOnlyLettersAndSpaces(field: 'abbreviation' | 'title') {
  const val = typeDocumentForm.value[field];
  typeDocumentForm.value[field] = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
}

watch(() => typeDocumentForm.value.abbreviation, (newVal) => validateDuplicateAbbreviation(newVal));
watch(() => typeDocumentForm.value.title, (newVal) => validateDuplicateTitle(newVal));

// CRUD funciones
const fetchTypeDocuments = async () => {
  try {
    loading.value = true;
    const response = await service.index<TypeDocument[]>(CONFIG.api.typesDocuments);
    typeDocuments.value = response;
  } catch (error) {
    showSnackbar('Error al obtener tipos de documento', 'error');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  editingTypeDocument.value = null;
  typeDocumentForm.value = { abbreviation: '', title: '' };
  hasDuplicate.value = false;
  dialog.value = true;
};

const editTypeDocument = (doc: TypeDocument) => {
  editingTypeDocument.value = doc;
  typeDocumentForm.value = { ...doc };
  hasDuplicate.value = false;
  dialog.value = true;
};

const saveTypeDocument = async () => {
  if (hasDuplicate.value) return;
  isSaving.value = true;
  try {
    if (editingTypeDocument.value && typeDocumentForm.value.id) {
      await service.update(CONFIG.api.typesDocuments, editingTypeDocument.value.id.toString(), typeDocumentForm.value);
      const index = typeDocuments.value.findIndex(d => d.id === editingTypeDocument.value?.id);
      if (index !== -1) typeDocuments.value[index] = { ...typeDocumentForm.value } as TypeDocument;
      showSnackbar('¡El tipo de documento ha sido actualizado correctamente!', 'success');
    } else {
      const response = await service.store<TypeDocument>(CONFIG.api.typesDocuments, typeDocumentForm.value);
      typeDocuments.value.push(response);
      showSnackbar('¡Nuevo tipo de documento creado exitosamente!', 'success');
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

const deleteTypeDocument = async () => {
  if (idToDelete.value !== null) {
    try {
      await service.delete(CONFIG.api.typesDocuments, idToDelete.value.toString());
      typeDocuments.value = typeDocuments.value.filter(d => d.id !== idToDelete.value);
      showSnackbar('¡Tipo de documento eliminado permanentemente!', 'success');
    } catch (error) {
      showSnackbar('Error al eliminar el tipo de documento', 'error');
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

onMounted(fetchTypeDocuments);
</script>
