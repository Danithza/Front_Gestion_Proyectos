<template>
    <v-app-bar app dark color="grey darken-3">
      <v-toolbar-title>
        <v-icon left>mdi-home</v-icon> Navbar
      </v-toolbar-title>
  
      <v-btn text>
        <v-icon left>mdi-bell</v-icon>
        Link
        <v-badge color="red" content="3" overlap />
      </v-btn>
  
      <v-btn text disabled>
        <v-icon left>mdi-alert</v-icon>
        Disabled
        <v-badge color="yellow" content="11" overlap />
      </v-btn>
  
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon left>mdi-email</v-icon>
            Dropdown
            <v-badge color="blue" content="15" overlap />
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link>
            <v-list-item-title>Action</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title>Another action</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
  
      <v-spacer />
  
      <v-btn icon>
        <v-icon>mdi-message</v-icon>
        <v-badge color="teal" content="9" overlap />
      </v-btn>
  
      <v-btn icon>
        <v-icon>mdi-email-check</v-icon>
        <v-badge color="green" content="11" overlap />
      </v-btn>
  
      <v-text-field
        dense
        hide-details
        solo-inverted
        flat
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        class="mx-2"
      />
      
      <v-btn color="green" dark>Search</v-btn>
    </v-app-bar>
  </template>
  
  <script lang="ts" setup>
  // No es necesario código adicional para esta barra si no hay lógica dinámica
  </script>
  
  <style scoped>
  .v-btn {
    position: relative;
  }
  .v-badge {
    position: absolute;
    top: -6px;
    right: -6px;
  }
  </style>
  