<!-- src/components/AgregarEquipo.vue -->
<template>
    <v-card>
      <v-card-title>
        <span class="text-h6">Crear nuevo equipo</span>
        <v-spacer />
        <v-btn icon @click="$emit('cerrar')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
  
      
      <v-card-text>
        <v-form @submit.prevent="guardarEquipo" ref="form">
          <!-- INFORMACIÓN BÁSICA -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="equipo.nombre" label="Nombre del equipo" required />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="equipo.color" label="Color identificativo (ej. #ff0000 o 'rojo')" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="equipo.observacion" label="Observaciones" rows="2" />
            </v-col>
          </v-row>
  
          <v-divider class="my-4" />
  
          <!-- ASOCIACIONES -->
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="equipo.proyecto"
                :items="proyectos"
                item-title="nombre"
                item-value="id"
                label="Proyecto asociado"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="equipo.supervisor"
                :items="usuarios"
                item-title="nombre"
                item-value="id"
                label="Supervisor del equipo"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="equipo.miembros"
                :items="usuarios"
                item-title="nombre"
                item-value="id"
                label="Miembros del equipo"
                multiple
                chips
              />
            </v-col>
          </v-row>
  
          <v-divider class="my-4" />
  
          <!-- DETALLES OPERATIVOS -->
          <v-row>
            <v-col cols="12" md="4">
              <v-select v-model="equipo.rol" :items="roles" label="Rol principal del equipo" />
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="equipo.prioridad" :items="nivelesPrioridad" label="Nivel de prioridad" />
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="equipo.ubicacion" :items="ubicaciones" label="Ubicación de trabajo" />
            </v-col>
  
            <v-col cols="12" md="6">
              <v-select
                v-model="equipo.herramientas"
                :items="herramientas"
                label="Herramientas utilizadas"
                multiple
                chips
              />
            </v-col>
  
            <v-col cols="12" md="6">
              <v-select
                v-model="equipo.tecnologias"
                :items="tecnologias"
                label="Tecnologías dominantes"
                multiple
                chips
              />
            </v-col>
  
            <v-col cols="12" md="6">
              <v-select v-model="equipo.turno" :items="turnos" label="Turno de trabajo" />
            </v-col>
  
            <v-col cols="12" md="6">
              <v-select
                v-model="equipo.metodologia"
                :items="metodologias"
                label="Metodología de trabajo"
              />
            </v-col>
  
            <v-col cols="12" md="6">
              <v-text-field
                v-model="equipo.capacidad"
                type="number"
                label="Capacidad máxima de miembros"
                min="1"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
  
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="guardarEquipo">Guardar</v-btn>
        <v-btn color="grey" variant="text" @click="$emit('cerrar')">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const emit = defineEmits(['equipo-creado', 'cerrar']);
  
  const equipo = ref({
    nombre: '',
    color: '',
    observacion: '',
    proyecto: null,
    miembros: [],
    supervisor: null,
    rol: '',
    prioridad: '',
    ubicacion: '',
    herramientas: [],
    tecnologias: [],
    turno: '',
    metodologia: '',
    capacidad: null,
  });
  
  const usuarios = ref([
    { id: 1, nombre: 'Laura Gómez' },
    { id: 2, nombre: 'Carlos Pérez' },
    { id: 3, nombre: 'Ana Torres' },
    { id: 4, nombre: 'Juan Salas' },
    { id: 5, nombre: 'Lucía Herrera' },
  ]);
  
  const proyectos = ref([
    { id: 101, nombre: 'Proyecto Alfa' },
    { id: 102, nombre: 'Proyecto Beta' },
    { id: 103, nombre: 'Proyecto Gamma' },
  ]);
  
  const roles = ['Desarrollo', 'Soporte', 'QA', 'DevOps', 'Gestión', 'UX/UI', 'Análisis de datos'];
  const nivelesPrioridad = ['Alta', 'Media', 'Baja', 'Crítica'];
  const ubicaciones = ['Remoto', 'Oficina', 'Híbrido', 'Campo'];
  const herramientas = ['Jira', 'GitHub', 'Trello', 'Slack', 'Figma', 'Notion', 'Asana', 'ClickUp'];
  const tecnologias = ['Vue.js', 'Node.js', 'Laravel', 'Python', 'Java', 'React', 'Angular', 'TypeScript'];
  const turnos = ['Mañana', 'Tarde', 'Noche', 'Rotativo'];
  const metodologias = ['Scrum', 'Kanban', 'Waterfall', 'Híbrido', 'XP', 'Lean'];
  
  function guardarEquipo() {
    console.log('Equipo guardado:', equipo.value);
    emit('equipo-creado', equipo.value);
    emit('cerrar');
  }
  </script>
  