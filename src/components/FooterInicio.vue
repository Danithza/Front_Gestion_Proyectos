<template>
  <v-footer color="grey-darken-4" class="white--text py-2" height="auto">
    <v-container>
      <v-row justify="space-between" align="center" class="flex-wrap">
        <v-col cols="12" md="4" class="mb-2 mb-md-0 text-center text-md-left">
          <h4 class="text-h6 font-weight-bold mb-1">Linex</h4>
          <p class="text-body-2 mb-0">
            Gestor de proyectos colaborativo para maximizar tu productividad.
          </p>
        </v-col>
        <v-col cols="12" md="4" class="text-center text-md-right">
          <p class="text-body-2 mb-0">&copy; {{ year }} Linex. Todos los derechos reservados.</p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.text-body-2 {
  opacity: 0.85;
}
</style>
