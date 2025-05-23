<template>
    <v-card class="pa-6 rounded-xl elevation-12">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">Crear nuevo equipo</span>
        <v-btn icon @click="$emit('cerrar')" variant="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
  
      <v-card-text>
        <v-form @submit.prevent="guardarEquipo" ref="form">
          <!-- INFORMACIÓN BÁSICA -->
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field v-model="equipo.nombre" label="Nombre del equipo" required outlined />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="equipo.color" label="Color identificativo" outlined />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="equipo.observacion" label="Observaciones" rows="2" outlined />
            </v-col>
          </v-row>
  
          <v-divider class="my-6" />
  
          <!-- ASOCIACIONES -->
          <v-row dense>
            <v-col cols="12" md="6">
              <v-select
                v-model="equipo.proyecto"
                :items="proyectos"
                item-title="nombre"
                item-value="id"
                label="Proyecto asociado"
                required
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="equipo.supervisor"
                :items="usuarios"
                item-title="nombre"
                item-value="id"
                label="Supervisor del equipo"
                outlined
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
                outlined
              />
            </v-col>
          </v-row>
  
          <v-divider class="my-6" />
  
          <!-- DETALLES OPERATIVOS -->
          <v-row dense>
            <v-col cols="12" md="4">
              <v-select v-model="equipo.rol" :items="roles" label="Rol principal del equipo" outlined />
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="equipo.prioridad" :items="nivelesPrioridad" label="Nivel de prioridad" outlined />
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="equipo.ubicacion" :items="ubicaciones" label="Ubicación de trabajo" outlined />
            </v-col>
  
            <v-col cols="12" md="6">
              <v-select
                v-model="equipo.herramientas"
                :items="herramientas"
                label="Herramientas utilizadas"
                multiple
                chips
                outlined
              />
            </v-col>
  
            <v-col cols="12" md="6">
              <v-select
                v-model="equipo.tecnologias"
                :items="tecnologias"
                label="Tecnologías dominantes"
                multiple
                chips
                outlined
              />
            </v-col>
  
            <v-col cols="12" md="6">
              <v-select v-model="equipo.turno" :items="turnos" label="Turno de trabajo" outlined />
            </v-col>
  
            <v-col cols="12" md="6">
              <v-select v-model="equipo.metodologia" :items="metodologias" label="Metodología de trabajo" outlined />
            </v-col>
  
            <v-col cols="12" md="6">
              <v-text-field
                v-model="equipo.capacidad"
                type="number"
                label="Capacidad máxima de miembros"
                min="1"
                outlined
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
  
      <v-card-actions class="justify-end">
        <v-btn color="grey" variant="text" @click="$emit('cerrar')">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="guardarEquipo">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  