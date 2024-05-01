<template>
  <!-- Empieza el dialogo de confirmación -->
  <v-dialog v-model="value" persistent width="400px" height="400px">
    <v-card>
      <!-- Empieza titulo y texto del dialogo-->
      <!-- Titulo y texto personalizable -->
    <v-card-text class="text-center ">  <v-icon color="error"   size="80" >mdi-alert-octagon</v-icon></v-card-text>
    <v-card-title class="headline font-weight-small">{{ title }}</v-card-title>
      <!-- Termina titulo y texto del dialogo -->
      <v-card-text class="text-center font-weight-medium">{{ descripcion }}</v-card-text>
 
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- Empieza Botón  (color y texto personalizable) -->
        <v-btn
          class="font-weight-medium"
          :color="buttonColor2"
          text
          @click="closeModal()"
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
      default: 200,
      },
      height: {
      type: Number,
      default: 200,
    },
    title: {
      type: String,
      default: '¡Se perderán todos los cambios!',
      },
     subtitle: {
      type: String,
      default: '¡Se perderán todos los cambios!',
      },
      descripcion: {
      type: String,
      default: '',
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
      default: 'red darken-1',
    },
    buttonText1: {
      type: String,
      default: 'NO',
    },
    buttonText2: {
      type: String,
      default: 'Aceptar',
    },
    },
    methods:
    {
    closeModal() {
    this.$emit("input", false);
    this.title = ''
    this.descripcion = ''
    },
  }
}
</script>
