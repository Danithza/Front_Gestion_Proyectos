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
        <!-- Cambiar tema oscuro -->
        <v-list-item>
          <v-list-item-title>{{ t('darkMode') }}</v-list-item-title>
          <v-list-item-action>
            <v-switch v-model="darkMode" inset />
          </v-list-item-action>
        </v-list-item>

        <!-- Seleccionar idioma -->
        <v-list-item>
          <v-list-item-title>{{ t('language') }}</v-list-item-title>
          <v-list-item-action>
            <v-select
              v-model="selectedLanguage"
              :items="languages"
              item-title="title"
              item-value="value"
              hide-details
              dense
              style="max-width: 140px"
            />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

const menu = ref(false)
const darkMode = ref(false)

const { t, locale } = useI18n()
const theme = useTheme()

// Lista de idiomas disponibles
const languages = [
  { value: 'es', title: 'Español' },
  { value: 'en', title: 'English' },
  { value: 'fr', title: 'Français' },
]

// Idioma seleccionado (inicial desde locale)
const selectedLanguage = ref(locale.value)

// ⚙️ Cambiar tema claro/oscuro
watch(darkMode, (val) => {
  theme.global.name.value = val ? 'dark' : 'light'
})

// 🌐 Cambiar idioma dinámicamente
watch(selectedLanguage, (newLang) => {
  locale.value = newLang
  localStorage.setItem('lang', newLang)
})

// Restaurar idioma desde localStorage al cargar
onMounted(() => {
  const savedLang = localStorage.getItem('lang')
  if (savedLang && savedLang !== locale.value) {
    locale.value = savedLang
    selectedLanguage.value = savedLang
  }
})
</script>
