<template>
  <v-container class="fill-height d-flex flex-column justify-center align-center text-center">
    <v-icon color="warning" size="100">mdi-lock-alert</v-icon>
    <h1 class="text-h4 font-weight-bold mt-4">403 - Not Authorized</h1>
    <p class="text-subtitle-1 mt-2">
      You don’t have permission to access this page.
    </p>
    <v-btn class="mt-6" color="primary" @click="goBack">
      Go Back
    </v-btn>
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.back();
}
</script>
