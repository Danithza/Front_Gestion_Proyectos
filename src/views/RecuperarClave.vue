<template>
  <v-container class="pa-4" fluid>
    <v-row>
      <v-col cols="12" md="6" offset-md="3">
        <v-card>
          <v-card-title class="headline">Recuperar Contraseña</v-card-title>
          <v-card-subtitle>
            Ingresa tu correo electrónico para recibir instrucciones de recuperación.
          </v-card-subtitle>
          <v-form v-model="formValid" @submit.prevent="submitForm">
            <v-text-field
              v-model="email"
              label="Correo electrónico"
              type="email"
              :rules="[emailRules.required, emailRules.email]"
              outlined
              dense
              required
            ></v-text-field>

            <v-btn
              :disabled="!formValid"
              color="primary"
              block
              type="submit"
            >
              Enviar solicitud
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      formValid: false,
      emailRules: {
        required: value => !!value || 'El correo electrónico es obligatorio.',
        email: value => /.+@.+\..+/.test(value) || 'Debe ser un correo válido.',
      },
    };
  },
  methods: {
    submitForm() {
      // Aquí puedes agregar la lógica para enviar el correo de recuperación
      console.log('Solicitud de recuperación enviada para:', this.email);
      // Mostrar mensaje de éxito o error según el resultado de la acción
      this.$emit('recuperar-clave', this.email);
    },
  },
};
</script>

