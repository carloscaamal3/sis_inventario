<template>
  <v-chip-group column active-class="primary--text">
    <div v-if="tipo == 'Boolean'">
      <v-chip class="ma-1" label x-small :color="chipColor" text-color="white">
        {{ chipText }}
      </v-chip>
    </div>
    <div v-else-if="tipo == 'Number'">
      <v-chip class="ma-1" label x-small :color="chipColorNum" text-color="white">
        {{ chipTextNum }}
      </v-chip>
    </div>
    <div v-else-if="tipo == 'String'">
      <v-chip class="ma-1" label x-small :color="chipColorStr" text-color="white">
        {{ chipTextStr }}
      </v-chip>
    </div>
  </v-chip-group>
</template>

<script>
export default {
  name: 'Status',
  props: {
    tipo: {
      type: String,
      default: 'Boolean',
    },
    activonum: {
      type: Number,
      default: 1,
    },
    activostr: {
      type: String,
      default: '1',
    },

    activo: {
      type: Boolean,
      default: true,
    },
    valorTrue: {
      type: String,
      default: 'Activo',
    },
    valorFalse: {
      type: String,
      default: 'Inactivo',
    },
  },

  computed: {
    chipColor() {
      return this.activo ? 'green' : 'red'
    },
    chipText() {
      return this.activo ? this.valorTrue : this.valorFalse
    },
    chipColorNum() {
      return this.activonum == 1 ? 'green' : 'red'
    },
    chipTextNum() {
      return this.activonum == 1 ? this.valorTrue : this.valorFalse
    },
    chipColorStr() {
      return this.activostr == '1' ? 'green' : 'red'
    },
    chipTextStr() {
      return this.activostr == '1' ? this.valorTrue : this.valorFalse
    },
  },
  created() {
    //alert(this.tipo)
  },
}
</script>
