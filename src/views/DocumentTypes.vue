<template>
  <v-container>
    <!-- Botón para crear nuevo -->
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="6">
        <h2 class="text-h4 font-weight-bold">📁 Gestión de Tipos de Documento</h2>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="primary" dark @click="openCreateModal">
          <v-icon left>mdi-plus-circle-outline</v-icon> Nuevo Documento
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-row class="mb-4" dense>
      <v-col cols="12" sm="4">
        <v-autocomplete
          v-model="filters.abbreviation"
          :items="uniqueAbbreviations"
          label="Filtrar por Abreviatura"
          clearable
          dense
          outlined
          prepend-inner-icon="mdi-filter"
          hide-no-data
          :search-input.sync="searchAbbreviation"
          @click:clear="resetFilters"
        />
      </v-col>
      <v-col cols="12" sm="4">
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
      <v-col cols="12" sm="4">
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

    <!-- Lista -->
    <v-row dense>
      <v-col cols="12" md="4" v-for="item in filteredTypeDocuments" :key="item.id">
        <v-card class="rounded-lg pa-4" :style="{ border: '2px solid #1976d2' }">
          <v-card-title class="font-weight-bold text-h6">
            <v-icon left>mdi-file-document-multiple-outline</v-icon> {{ item.title }}
          </v-card-title>
          <v-card-subtitle class="mb-2 text-body-2">🔤 Abreviatura: {{ item.abbreviation }}</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn icon @click="editTypeDocument(item)">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn icon @click="confirmDelete(item.id)">
              <v-icon color="red">mdi-trash-can-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal Crear/Editar -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="bg-primary text-white">
          <v-icon left>mdi-note-edit-outline</v-icon>
          {{ editingTypeDocument ? 'Editar Tipo de Documento' : 'Crear Tipo de Documento' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="typeDocumentForm.abbreviation"
              label="Abreviatura"
              dense
              :rules="[...abbrRules, validateDuplicateAbbreviation]"
              @input="filterOnlyLettersAndSpaces('abbreviation')"
            />
            <v-text-field
              v-model="typeDocumentForm.title"
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
            @click="onSubmit"
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
        <v-card-text>¿Estás seguro de que deseas eliminar este tipo de documento?</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" dark @click="deleteTypeDocument">Eliminar</v-btn>
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

interface TypeDocument {
  id: number;
  abbreviation: string;
  title: string;
}

const typeDocuments = ref<TypeDocument[]>([]);
const dialog = ref(false);
const editingTypeDocument = ref<TypeDocument | null>(null);
const typeDocumentForm = ref<TypeDocument>({
  id: 0,
  abbreviation: '',
  title: '',
});

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const isSaving = ref(false);
const hasDuplicate = ref(false);
const confirmDeleteDialog = ref(false);
const idToDelete = ref<number | null>(null); // 👈 CORREGIDO: agregamos esta ref

// Validaciones
const onlyLettersAndSpacesRegex = /^[\p{L}\s]+$/u;
const abbrRules = [
  (v: string) => !!v || 'Campo obligatorio',
  (v: string) => onlyLettersAndSpacesRegex.test(v) || 'Solo letras y espacios permitidos',
];
const titleRules = [
  (v: string) => !!v || 'Campo obligatorio',
  (v: string) => onlyLettersAndSpacesRegex.test(v) || 'Solo letras y espacios permitidos',
];

const validateDuplicateAbbreviation = (v: string) => {
  if (!v) return true;
  const exists = typeDocuments.value.some(doc =>
    doc.abbreviation.toLowerCase() === v.toLowerCase() &&
    (!editingTypeDocument.value || doc.id !== editingTypeDocument.value.id)
  );
  hasDuplicate.value = exists;
  return !exists || 'Esta abreviatura ya existe';
};

const validateDuplicateTitle = (v: string) => {
  if (!v) return true;
  const exists = typeDocuments.value.some(doc =>
    doc.title.toLowerCase() === v.toLowerCase() &&
    (!editingTypeDocument.value || doc.id !== editingTypeDocument.value.id)
  );
  if (exists) hasDuplicate.value = true;
  return !exists || 'Este título ya existe';
};

// Watchers
watch(() => typeDocumentForm.value.abbreviation, (newVal) => validateDuplicateAbbreviation(newVal));
watch(() => typeDocumentForm.value.title, (newVal) => validateDuplicateTitle(newVal));

function filterOnlyLettersAndSpaces(field: 'abbreviation' | 'title') {
  const value = typeDocumentForm.value[field];
  const filtered = value.replace(/[^\p{L}\s]/gu, '');
  if (filtered !== value) {
    typeDocumentForm.value[field] = filtered;
  }
}

const showSnackbar = (message: string, color = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const fetchTypeDocuments = async () => {
  try {
    const response = await service.index<TypeDocument[]>(CONFIG.api.typesDocuments);
    typeDocuments.value = response;
  } catch (error) {
    console.error('Error al obtener los documentos:', error);
    showSnackbar('Error al cargar los documentos', 'error');
  }
};

const openCreateModal = () => {
  editingTypeDocument.value = null;
  typeDocumentForm.value = { id: 0, abbreviation: '', title: '' };
  hasDuplicate.value = false;
  dialog.value = true;
};

const editTypeDocument = (typeDocument: TypeDocument) => {
  editingTypeDocument.value = typeDocument;
  typeDocumentForm.value = { ...typeDocument };
  hasDuplicate.value = false;
  dialog.value = true;
};

const saveTypeDocument = async () => {
  try {
    const existsAbbr = typeDocuments.value.some(doc =>
      doc.abbreviation.toLowerCase() === typeDocumentForm.value.abbreviation.toLowerCase() &&
      (!editingTypeDocument.value || doc.id !== editingTypeDocument.value.id)
    );
    const existsTitle = typeDocuments.value.some(doc =>
      doc.title.toLowerCase() === typeDocumentForm.value.title.toLowerCase() &&
      (!editingTypeDocument.value || doc.id !== editingTypeDocument.value.id)
    );
    if (existsAbbr || existsTitle) {
      showSnackbar('No se puede guardar: existen documentos duplicados', 'error');
      return false;
    }
    if (editingTypeDocument.value) {
      await service.update(CONFIG.api.typesDocuments, editingTypeDocument.value.id.toString(), typeDocumentForm.value);
      const index = typeDocuments.value.findIndex(d => d.id === editingTypeDocument.value?.id);
      if (index !== -1) typeDocuments.value[index] = { ...typeDocumentForm.value };
      showSnackbar('Tipo de documento actualizado correctamente');
    } else {
      const response = await service.store<TypeDocument>(CONFIG.api.typesDocuments, typeDocumentForm.value);
      typeDocuments.value.push(response);
      showSnackbar('Tipo de documento creado correctamente');
    }
    dialog.value = false;
    return true;
  } catch (error) {
    console.error('Error al guardar:', error);
    showSnackbar('Error al guardar el documento', 'error');
    return false;
  }
};

const form = ref();
const onSubmit = async () => {
  if (!form.value || isSaving.value) return;
  const valid = await form.value.validate();
  if (!valid.valid || hasDuplicate.value) {
    showSnackbar('Corrija los errores antes de guardar', 'error');
    return;
  }
  isSaving.value = true;
  try { await saveTypeDocument(); } finally { isSaving.value = false; }
};

const confirmDelete = (id: number) => {
  idToDelete.value = id;
  confirmDeleteDialog.value = true;
};

const deleteTypeDocument = async () => {
  if (idToDelete.value !== null) {
    try {
      await service.delete(CONFIG.api.typesDocuments, idToDelete.value.toString());
      typeDocuments.value = typeDocuments.value.filter(td => td.id !== idToDelete.value);
      showSnackbar('Tipo de documento eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      showSnackbar('Error al eliminar el documento', 'error');
    } finally {
      confirmDeleteDialog.value = false;
      idToDelete.value = null;
    }
  }
};

const closeModal = () => { if (!isSaving.value) dialog.value = false; };

const filters = ref({ abbreviation: '', title: '', search: '' });
const resetFilters = () => filters.value = { abbreviation: '', title: '', search: '' };
const uniqueAbbreviations = computed(() => Array.from(new Set(typeDocuments.value.map(d => d.abbreviation))).sort());
const uniqueTitles = computed(() => Array.from(new Set(typeDocuments.value.map(d => d.title))).sort());
const filteredTypeDocuments = computed(() =>
  typeDocuments.value.filter(doc =>
    (!filters.value.abbreviation || doc.abbreviation.toLowerCase() === filters.value.abbreviation.toLowerCase()) &&
    (!filters.value.title || doc.title.toLowerCase() === filters.value.title.toLowerCase()) &&
    (!filters.value.search || doc.title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      doc.abbreviation.toLowerCase().includes(filters.value.search.toLowerCase()))
  )
);

onMounted(fetchTypeDocuments);
</script>
