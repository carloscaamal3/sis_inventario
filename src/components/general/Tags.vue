<template>
  <v-chip-group column active-class="primary--text">
    <v-chip
      v-for="tag in tags"
      :key="tag"
      class="ma-1"
      label
      x-small
      color="blue"
      text-color="white"
    >
      {{ tag }}
    </v-chip>
  </v-chip-group>
</template>

<script>
export default {
  name: 'Tags',
  props: {
    tags: {
      type: Array,
      default: () => ['Empty'],
    },
  },
}
</script>
