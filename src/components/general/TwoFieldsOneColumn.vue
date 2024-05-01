<template>
  <div>
    <div class="line">
      <b>{{ title1 }}:</b>{{ ' ' + line1 }}
    </div>
    <div class="line">
      <b>{{ title2 }}:</b>{{ ' ' + line2 }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwoFieldsOneColumn',
  props: {
    title1: {
      type: String,
      default: '',
    },
    title2: {
      type: String,
      default: '',
    },
    line1: {
      default: 'Sin definir',
    },
    line2: {
      default: 'Sin definir',
    },
  },
}
</script>

<style lang="scss" scoped>
.line {
  font-size: 0.8rem;
}
</style>
