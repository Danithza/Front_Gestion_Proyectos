<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
    <FooterInicio />
  </v-app>
</template>

<script lang="ts" setup>
import Navbar from '@/components/NavbarInicio.vue'
import FooterInicio from '@/components/FooterInicio.vue'
</script>

<style scoped>
h1 {
  color: red !important;
}
</style>
