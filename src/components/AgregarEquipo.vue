<template>
    <v-card class="mb-6 pa-4">
      <v-card-title class="text-h6">
        {{ modoEdicion ? 'Editar equipo' : 'Crear nuevo equipo' }}
      </v-card-title>
      <v-form @submit.prevent="guardarEquipo" ref="formRef">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="equipoLocal.nombre"
              label="Nombre del equipo"
              :rules="[validarNombre]"
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="equipoLocal.miembros"
              :items="usuarios"
              item-title="nombre"
              item-value="id"
              label="Miembros"
              multiple
              chips
              clearable
              :rules="[validarMiembros]"
              required
            />
          </v-col>

          <v-col cols="12">
            <v-btn color="primary" type="submit">
              {{ modoEdicion ? 'Guardar cambios' : 'Crear equipo' }}
            </v-btn>
            <v-btn color="grey" class="ml-2" v-if="modoEdicion" @click="cancelarEdicion">
              Cancelar
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </template>

  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'

  const props = defineProps<{
    equipo: { id: number; nombre: string; miembros: number[] }
    modoEdicion: boolean
    usuarios: { id: number; nombre: string }[]
  }>()

  const emit = defineEmits<{
    (e: 'guardar', equipo: any): void
    (e: 'cancelar'): void
  }>()

  const formRef = ref<InstanceType<typeof VForm> | null>(null)
  const equipoLocal = ref({ ...props.equipo })

  // Actualiza cuando cambian las props
  watch(() => props.equipo, (nuevo) => {
    equipoLocal.value = { ...nuevo }
  })

  const validarNombre = (v: string) =>
    !v || v.trim() === ''
      ? 'El nombre es obligatorio'
      : /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v)
        ? true
        : 'Solo letras y espacios'

  const validarMiembros = (v: number[]) =>
    v && v.length > 0 ? true : 'Selecciona al menos un miembro'

  const guardarEquipo = async () => {
    const validacion = await formRef.value?.validate()
    if (!validacion?.valid) return
    emit('guardar', { ...equipoLocal.value })
  }

  const cancelarEdicion = () => {
    emit('cancelar')
  }
  </script>
