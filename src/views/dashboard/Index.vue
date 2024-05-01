<template>
  <v-app>
    <dashboard-core-app-bar v-model="expandOnHover" />

    <dashboard-core-drawer :expand-on-hover.sync="expandOnHover" />

    <dashboard-core-view />
    <SnackBar />
  </v-app>
</template>

<script>
export default {
  name: 'DashboardIndex',

  components: {
    DashboardCoreAppBar: () => import('@/components/AppBar'),
    DashboardCoreDrawer: () => import('@/components/Drawer'),
    DashboardCoreView: () => import('@/components/View'),
    SnackBar: () => import('@/components/general/SnackBar.vue'),
  },

  data: () => ({
    expandOnHover: false,
  }),
}
</script>
