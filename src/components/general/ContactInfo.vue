<template>
  <div>
    <div class="session-info-subtitle" v-if="tel != ''"><b>Tel:</b> {{ tel }}</div>
    <div class="session-info-subtitle" v-if="cel != ''"><b>Cel:</b> {{ cel }}</div>
  </div>
</template>

<script>
export default {
  name: 'ContactInfo',
  props: {
    tel: {
      type: String,
      default: '',
    },
    cel: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.session-info-title {
  font-size: 0.9rem;
}
.session-info-subtitle {
  font-size: 0.75rem;
}
</style>
