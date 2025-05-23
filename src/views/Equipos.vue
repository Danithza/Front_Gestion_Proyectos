<template>
  <v-container>
    <!-- TÍTULO -->
    <v-row>
      <v-col>
        <h1 class="text-h4 font-weight-bold">Gestión de Equipos</h1>
      </v-col>
    </v-row>

    <!-- LISTADO DE EQUIPOS -->
    <v-row>
      <v-col
        v-for="equipo in equipos"
        :key="equipo.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="pa-4" elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-laptop</v-icon>
              <span class="font-weight-medium">{{ equipo.nombre }}</span>
            </div>
            <div>
              <v-btn icon size="small" @click="editarEquipo(equipo)">
                <v-icon color="blue">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" @click="eliminarEquipo(equipo.id)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-card-title>

          <v-card-subtitle class="mt-2">Color: {{ equipo.color || 'Sin especificar' }}</v-card-subtitle>
          <v-card-text>
            Observación: {{ equipo.observacion || 'Sin observación' }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- BOTÓN FLOTANTE PARA CREAR -->
    <v-btn
      icon
      color="primary"
      class="ma-4"
      style="position: fixed; bottom: 16px; right: 16px;"
      @click="abrirFormulario"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- DIALOGO CON FORMULARIO -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">
          {{ formEquipo.id ? 'Editar Equipo' : 'Crear Equipo' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef" @submit.prevent="guardarEquipo" lazy-validation>
            <v-text-field v-model="formEquipo.nombre" label="Nombre del equipo" :rules="[v => !!v || 'Campo requerido']" />
            <v-text-field v-model="formEquipo.color" label="Color" />
            <v-textarea v-model="formEquipo.observacion" label="Observación" />
            <v-select
              v-model="formEquipo.proyecto"
              :items="proyectos"
              item-title="nombre"
              item-value="id"
              label="Proyecto"
              :rules="[v => !!v || 'Campo requerido']"
            />
            <v-select
              v-model="formEquipo.miembros"
              :items="usuarios"
              item-title="nombre"
              item-value="id"
              label="Miembros"
              multiple
              chips
              :rules="[v => v?.length > 0 || 'Selecciona al menos un miembro']"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="flat" @click="guardarEquipo">Guardar</v-btn>
          <v-btn color="grey" variant="text" @click="cerrarFormulario">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

const dialog = ref(false)
const formRef = ref()

const usuarios = [
  { id: 1, nombre: 'Laura Gómez' },
  { id: 2, nombre: 'Carlos Pérez' },
  { id: 3, nombre: 'Ana Torres' },
]

const proyectos = [
  { id: 101, nombre: 'Proyecto Alfa' },
  { id: 102, nombre: 'Proyecto Beta' },
]

const equipos = ref<any[]>(JSON.parse(localStorage.getItem('equipos') || '[]'))

const defaultEquipo = () => ({
  id: 0,
  nombre: '',
  color: '',
  observacion: '',
  proyecto: null,
  miembros: [] as number[],
})

const formEquipo = reactive(defaultEquipo())

function abrirFormulario() {
  Object.assign(formEquipo, defaultEquipo())
  dialog.value = true
}

function editarEquipo(data: any) {
  Object.assign(formEquipo, { ...data })
  dialog.value = true
}

function guardarEquipo() {
  const form = formRef.value
  form?.validate().then((valid: boolean) => {
    if (!valid) return

    if (formEquipo.id) {
      const idx = equipos.value.findIndex(e => e.id === formEquipo.id)
      if (idx !== -1) equipos.value[idx] = { ...formEquipo }
    } else {
      formEquipo.id = Date.now()
      equipos.value.push({ ...formEquipo })
    }

    cerrarFormulario()
  })
}

function eliminarEquipo(id: number) {
  equipos.value = equipos.value.filter(e => e.id !== id)
  guardarEnLocalStorage()
}

function cerrarFormulario() {
  dialog.value = false
  Object.assign(formEquipo, defaultEquipo())
  formRef.value?.resetValidation()
}

function guardarEnLocalStorage() {
  localStorage.setItem('equipos', JSON.stringify(equipos.value))
}

watch(equipos, guardarEnLocalStorage, { deep: true })
</script>
