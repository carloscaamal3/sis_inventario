<template>
  <v-app>
    <!-- <pages-core-app-bar /> -->

    <pages-core-view />
    <pages-core-footer />
    <SnackBar />
  </v-app>
</template>

<script>
export default {
  name: 'PagesIndex',

  components: {
    // PagesCoreAppBar: () => import('./components/core/AppBar'),
    PagesCoreFooter: () => import('./components/core/Footer'),
    PagesCoreView: () => import('./components/core/View'),
    SnackBar: () => import('@/components/general/SnackBar.vue'),
  },

  created() {
    this.$vuetify.theme.dark = true
  },

  beforeDestroy() {
    this.$vuetify.theme.dark = false
  },
}
</script>
