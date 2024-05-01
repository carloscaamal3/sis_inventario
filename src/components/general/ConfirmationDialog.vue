<template>
  <!-- Empieza el dialogo de confirmación -->
  <v-dialog v-model="value" persistent :max-width="width">
    <v-card>
      <!-- Empieza titulo y texto del dialogo-->
      <!-- Titulo y texto personalizable -->
      <v-card-title class="headline font-weight-medium">{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <!-- Termina titulo y texto del dialogo -->

      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- Empieza Botón 1 (color y texto personalizable)-->
        <v-btn
          class="font-weight-medium"
          :color="buttonColor1"
          text
          @click="$emit('click', false)"
        >{{ buttonText1 }}</v-btn>
        <!-- Termina Botón 1 -->

        <!-- Empieza Botón 2 (color y texto personalizable) -->
        <v-btn
          class="font-weight-medium"
          :color="buttonColor2"
          text
          @click="$emit('click', true)"
        >{{ buttonText2 }}</v-btn>
        <!-- Termina Botón 2 -->
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Termina el dialogo de confirmación -->
</template>

<script>
export default {
  name: 'ConfirmationDialog',
  //Propiedades del componente {tipo y valor predeterminado}
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 260,
    },
    title: {
      type: String,
      default: '¡Se perderán todos los cambios!',
    },
    text: {
      type: String,
      default: '¿Seguro quiere cancelar?',
    },
    buttonColor1: {
      type: String,
      default: 'red darken-1',
    },
    buttonColor2: {
      type: String,
      default: 'green darken-1',
    },
    buttonText1: {
      type: String,
      default: 'NO',
    },
    buttonText2: {
      type: String,
      default: 'SI',
    },
  },
}
</script>
