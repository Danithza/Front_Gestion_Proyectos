<template>
  <v-footer color="blue-grey-darken-4" class="white--text py-8" padless>
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12" md="4" class="mb-4 mb-md-0">
          <h4 class="text-h6 font-weight-bold">Linex</h4>
          <p class="text-body-2">
            Gestor de proyectos colaborativo para maximizar tu productividad.
          </p>
        </v-col>

        <v-col cols="12" md="4" class="text-center mb-4 mb-md-0">
          <v-btn icon href="#">
            <v-icon>mdi-facebook</v-icon>
          </v-btn>
          <v-btn icon href="#">
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn icon href="#">
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="12" md="4" class="text-md-right text-center">
          <p class="text-body-2">&copy; {{ year }} Linex. Todos los derechos reservados.</p>
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
  opacity: 0.8;
}
</style>
