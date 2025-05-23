<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="bottom end"
    offset-y
  >
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>

    <v-card width="300">
      <v-card-title class="text-h6">{{ t('settings') }}</v-card-title>
      <v-divider />

      <v-list>
        <v-list-item>
          <v-list-item-title>{{ t('darkMode') }}</v-list-item-title>
          <v-list-item-action>
            <v-switch v-model="darkMode" inset />
          </v-list-item-action>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>{{ t('language') }}</v-list-item-title>
          <v-list-item-action>
            <v-select
              v-model="locale.value"
              :items="languages"
              item-text="name"
              item-value="code"
              dense
              hide-details
              style="max-width: 120px"
            />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

const menu = ref(false)
const darkMode = ref(false)
const { t, locale } = useI18n()
const theme = useTheme()

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  // agrega más idiomas si quieres
]

// Cambiar tema cuando darkMode cambia
watch(darkMode, (val) => {
  theme.global.name.value = val ? 'dark' : 'light'
})
</script>
