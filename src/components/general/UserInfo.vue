<template>
  <div>
    <div class="name-info-title">{{ nombreCompleto }}</div>
    <div class="mail-info-subtitle">
      <a :href="'mailto:' + correo">{{ correo }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  props: {
    nombre: {
      type: String,
      default: '',
    },
    apellidos: {
      type: String,
      default: '',
    },
    correo: {
      type: String,
      default: '',
    },
  },
  computed: {
    nombreCompleto() {
      return this.nombre + ' ' + this.apellidos
    },
    // correoE() {
    //   return this.correo
    // },
  },
}
</script>

<style lang="scss" scoped>
.name-info-title {
  font-size: 0.9rem;
}
.mail-info-subtitle {
  font-size: 0.8rem;
}
</style>
