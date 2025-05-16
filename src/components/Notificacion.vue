<template>
  <v-menu v-model="menu" location="bottom end" offset-y>
    <template #activator="{ props }">
      <v-btn icon v-bind="props" @click="notify">
        <v-icon>mdi-bell</v-icon>
      </v-btn>
    </template>
    <v-card width="300">
      <v-card-title class="text-h6">Notificaciones</v-card-title>
      <v-divider />
      <v-list>
        <v-list-item>
          <v-list-item-title>{{ message }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const menu = ref(false)
const message = ref('No hay nuevas notificaciones')

const emit = defineEmits(['notify'])

function notify() {
  if (!emit) {
    alert('Notificar estado')
  } else {
    emit('notify')
  }
}
</script>
