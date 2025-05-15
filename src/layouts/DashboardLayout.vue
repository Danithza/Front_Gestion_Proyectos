<template>
  <v-app>
    <Sidebar />
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

const drawer = ref(false)
provide('drawer', drawer)
provide('toggleDrawer', () => {
  drawer.value = !drawer.value
})
</script>
