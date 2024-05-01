<template>
  <v-snackbar
    bottom
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :multi-line="snackbar.multiline === true"
    :color="snackbar.color"
    >{{ snackbar.text }}</v-snackbar
  >
  <!-- <v -btn text dark @click="closeAlert">Close</v> -->
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  computed: {
    snackbar() {
      return this.$store.state.snackbar
    },
  },
  methods: {
    ...mapMutations(['closeAlert']),
  },
}
</script>
