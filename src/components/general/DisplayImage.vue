<template>
  <div v-if="vueImage == true">
    <v-img :src="imagen" :width="width" :height="height" dark="isDark" class="class"></v-img>
    <!-- <v-img :src="imagen" :width="width" :height="100px" dark="isDark" class="vueImagen"></v-img> -->
  </div>
  <div v-else-if="vueImage == false">
    <img :src="imagen" alt="" :width="width" :height="height" />
  </div>
</template>
<script>
export default {
  name: 'DisplayImge',
  props: {
    imagen: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '',
    },
    vueImage: {
      type: Boolean,
      default: false,
    },
    isDark: {
      type: Boolean,
      default: false,
    },
    class: {
      type: String,
      default: 'grey darken-4',
    },
  },
}
</script>
