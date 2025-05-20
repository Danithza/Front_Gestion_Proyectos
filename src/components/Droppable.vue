<template>
  <v-col cols="12" md="4" class="d-flex flex-column">
    <v-card class="pa-2 column" elevation="4">
      <h3 class="text-center">{{ estado }}</h3>
      <draggable
        :list="tareas"
        :group="'tareas'"
        item-key="id"
        class="draggable-column"
        @end="onDragEnd"
      >
        <template #item="{ element }">
          <v-card class="mb-2 task-card" elevation="2">
            <v-card-title>{{ element.titulo }}</v-card-title>
            <v-card-text>
              <p>{{ element.descripcion }}</p>
              <small><strong>Encargado:</strong> {{ element.encargado }}</small>
            </v-card-text>
          </v-card>
        </template>
      </draggable>
    </v-card>
  </v-col>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps<{
  estado: string
  tareas: { id: number, titulo: string, descripcion: string, encargado: string, estado: string }[]
}>()

const emit = defineEmits<{
  (e: 'actualizar-estado', id: number, estado: string): void
}>()

function onDragEnd(evt: any) {
  const movedElement = evt.item?._underlying_vm_
  if (movedElement && movedElement.id) {
    emit('actualizar-estado', movedElement.id, props.estado)
  }
}
</script>

<style scoped>
.column {
  background-color: #ffffff10;
  border-radius: 12px;
  min-height: 300px;
}

.task-card {
  background-color: #ffffffcc;
  color: #333;
  border-left: 5px solid #2196f3;
}
</style>
