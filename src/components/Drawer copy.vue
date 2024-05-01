<!-- gaspar inicio -->
<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-breakpoint="960"
    app
    mini-variant-width="80"
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
    </template>
    <!-- Encabezado -->
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-uppercase font-weight-regular display-1">
          <span class="logo-mini">{{ $t('ct') }} </span>
          <span class="logo-normal">{{ $t('tim') }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider class="mb-1" />
    <!-- Encabezado con el avatar -->
    <!-- <v-list dense nav>
      <base-item-group :item="profile" />
    </v-list> -->
    <v-list-item two-line :class="false && 'px-0'">
      <!--  <ThumborImage
        v-if="profileUsr.imagen.avatar"
        :imageUrl="profileUsr.imagen.avatar"
        :avatarSize="60"
      /> -->
      <!-- <v-list-item-avatar>
        <img
          src="https://api.shuttleexpressmexico.com.mx/imagenes/b4500d07-ed98-4221-80ef-afb8e56d3319.jpeg"
        />
      </v-list-item-avatar> -->

      <v-list-item-content>
        <!-- <v-list-item-title>{{ this.$t('avatar') }}</v-list-item-title>
 -->

        <v-list-item-title>{{ usuario.usr_login }}</v-list-item-title>
        <v-list-item-subtitle>{{ usuario.usr_nombre }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <!-- Termina encabezado con el avatar -->

    <v-divider class="mb-2" />

    <!-- Menú -->
    <v-list expand nav v-if="adminMode">
      <div />

      <template v-for="(item, i) in computedSettings">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item">
          <!--  -->
        </base-item-group>

        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>
      <v-divider class="mb-2" />
      <!-- <template v-for="(item, i) in computedAdministration">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item"> </base-item-group>

        <base-item v-else :key="`item-${i}`" :item="item" />
      </template> -->
      <div />
    </v-list>
    <v-list expand nav v-else>
      <div />

      <template v-for="(item, i) in computedItems">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item">
          <!--  -->
        </base-item-group>

        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>
      <div />
    </v-list>
    <!-- Termina Menú -->
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { getValidToken } from '@/store/helpers.js'
import { mapState } from 'vuex'
import axios from 'axios'
//import ThumborImage from '@/components/general/ThumborImage.vue'

export default {
  components: {
    //ThumborImage,
  },
  name: 'DashboardCoreDrawer',

  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
    adminMode: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    usuario: JSON.parse(localStorage.getItem('user')),
    profileUsr2: [],
    profileUsr: {
      usr_id: '',
      usr_login: '',
      usr_nombre: '',
      usr_correo: '',
      //imagen: { avatar: '' },
    },
    items2: [] /* para usar con Json dinamico */,
    settings2: [] /* para usar con Json dinamico */,
    dashboard: [] /* para usar con Json dinamico */,
    config: [] /* para usar con Json dinamico */,
    items: [
      {
        icon: 'mdi-file-document-edit-outline',
        title: 'capture',
        to: '/',
      },
      {
        group: '/admon',
        icon: 'mdi-account-multiple',
        title: 'users',
        children: [
          {
            icon: 'mdi-account',
            title: 'users',
            to: 'usuarios',
          },
        ],
      },
      {
        group: '/admon',
        icon: 'mdi-bookshelf',
        title: 'catalogs',
        children: [
          {
            icon: 'mdi-account',
            title: 'type',
            to: 'tipos',
          },
          {
            icon: 'mdi-account',
            title: 'entity',
            to: 'entidad',
          },
        ],
      },
    ],
    items_ANT: [
      {
        icon: 'mdi-view-dashboard',
        title: 'dashboard',
        to: '/',
      },
      {
        group: '/ventas',
        icon: 'mdi-cash-register',
        title: 'sales',
        children: [
          {
            title: 'transfers',
            icon: 'mdi-cogs',
            to: 'traslados',
          },
          {
            title: 'tours',
            icon: 'mdi-cogs',
            to: 'paseos',
          },
          {
            title: 'circuits',
            icon: 'mdi-cogs',
            to: 'circuitos',
          },
        ],
      },
      {
        group: '/store',
        icon: 'mdi-storefront-outline',
        title: 'store',
        children: [
          {
            title: 'inputs',
            icon: 'cart-arrow-down',
            to: 'inputs',
          },
          {
            title: 'outputs',
            icon: 'cart-arrow-up',
            to: 'outputs',
          },
          {
            title: 'adjusts',
            icon: 'scale-balance',
            to: 'adjust',
          },
        ],
      },
    ],
    settings: [
      {
        group: '/admon',
        icon: 'mdi-account-multiple',
        title: 'users',
        children: [
          {
            icon: 'mdi-account',
            title: 'users',
            to: 'usuarios',
          },
          {
            icon: 'mdi-account-multiple',
            title: 'groups',
            to: 'grupos',
          },
          {
            icon: 'mdi-cog-transfer',
            title: 'roles',
            to: 'roles',
          },
          {
            icon: 'mdi-account-multiple',
            title: 'permisos',
            to: 'permisos',
          },
        ],
      },
      {
        group: '/admon',
        icon: 'mdi-application-cog',
        title: 'applications',
        children: [
          {
            icon: 'mdi-animation',
            title: 'systems',
            to: 'sistemas',
          },
          {
            icon: 'mdi-view-module',
            title: 'modules',
            to: 'modulos',
          },
        ],
      },
      {
        group: '/admon',
        icon: 'mdi-bookshelf',
        title: 'catalogs',
        children: [
          {
            icon: 'mdi-human-male-female', //human-male-female gender-male-female
            title: 'gender',
            to: 'generos',
          },
          {
            title: 'hotels',
            icon: 'mdi-hotel',
            to: 'hoteles',
          },
          {
            icon: 'mdi-account-voice',
            title: 'languaje',
            to: 'idiomas',
          },
          {
            icon: 'mdi-watermark',
            title: 'brand',
            to: 'marcas',
          },
          {
            icon: 'mdi-train-car',
            title: 'model',
            to: 'modelos',
          },
          {
            icon: 'mdi-flag-variant',
            title: 'countries',
            to: 'paises',
          },
          {
            icon: 'mdi-car-cog',
            title: 'vehicles_type',
            to: 'tipos',
          },
          {
            icon: 'mdi-car-estate',
            title: 'vehicles',
            to: 'vehiculos',
          },
          {
            icon: 'mdi-map-marker-radius',
            title: 'zones',
            to: 'zonas',
          },
        ],
      },
      {
        group: '/admon',
        icon: 'mdi-cash-register',
        title: 'sales',
        children: [
          {
            icon: 'mdi-ticket-confirmation',
            title: 'tickets',
            to: 'boletosferry',
          },
          {
            icon: 'mdi-baby-carriage',
            title: 'extras_category',
            to: 'servicioscat',
          },
          {
            icon: 'mdi-shape',
            title: 'product_category',
            to: 'productoscat',
          },
          {
            icon: 'mdi-account-group',
            title: 'clients',
            to: 'clientes',
          },
          {
            icon: 'mdi-car-child-seat',
            title: 'extras',
            to: 'extras',
          },
          {
            icon: 'mdi-food',
            title: 'products',
            to: 'productos',
          },
          {
            icon: 'mdi-car-limousine',
            title: 'services',
            to: 'servicios',
          },
          {
            icon: 'mdi-currency-usd',
            title: 'rates',
            to: 'tarifas',
          },
          {
            icon: 'mdi-bus-stop-covered',
            title: 'service_type',
            to: 'traslados',
          },
        ],
      },
    ],
    // administration: [
    // {
    //   group: '/catalogos',
    //   icon: 'mdi-bookshelf',
    //   title: 'catalogs',
    //   children: [
    //     {
    //       title: 'tours',
    //       icon: 'mdi-cogs',
    //       to: 'paseos',
    //     },
    //     {
    //       title: 'circuits',
    //       icon: 'mdi-cogs',
    //       to: 'circuitos',
    //     },
    //   ],
    // },
    //],
  }),

  computed: {
    ...mapState(['barColor', 'barImage']),
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(val) {
        this.$store.commit('SET_DRAWER', val)
      },
    },
    computedItems() {
      return this.items.map(this.mapItem)
    },
    computedSettings() {
      return this.settings.map(this.mapItem)
    },
    // computedAdministration() {
    //   return this.administration.map(this.mapItem)
    // },
    profile() {
      return {
        avatar: true,
        // group: '',
        title: this.$t('avatar'),
        children: [
          // {
          //   href: '',
          //   title: this.$t('my-profile'),
          // },
          // {
          //   to: '',
          //   title: this.$t('edit-profile'),
          // },
          // {
          //   to: '',
          //   title: this.$t('settings'),
          // },
        ],
      }
    },
  },

  watch: {
    '$vuetify.breakpoint.smAndDown'(val) {
      this.$emit('update:expandOnHover', !val)
    },
  },
  /*   mounted() {
    axios.get('items.json').then((response) => (this.items2 = response.data))
   },
   */
  created() {
    //OJOOOO
    this.obtenerUsuario()
    /* para usar con Json dinamico */
    /* this.getConfig()
    this.getDashboard()
    this.getItems()
    this.getSettings() */
  },
  methods: {
    /* para usar con Json dinamico */
    getConfig: function () {
      axios.get('http://localhost:3000/config').then((response) => {
        this.config = response.data
      })
    },
    /* para usar con Json dinamico */
    getDashboard: function () {
      axios.get('http://localhost:3000/dashboard').then((response) => {
        this.dashboard = response.data
      })
    },
    /* para usar con Json dinamico */
    getItems: function () {
      axios.get('http://localhost:3000/grupos').then((response) => {
        this.items = response.data
        this.config.forEach((element) => this.items.unshift(element))
        this.dashboard.forEach((element) => this.items.unshift(element))
      })
    },
    /* para usar con Json dinamico */
    getSettings: function () {
      axios.get('http://localhost:3000/settings').then((response) => {
        this.settings = response.data
        this.dashboard.forEach((element) => this.settings.unshift(element))
      })
    },
    //Roger Gala
    // Obtener todos los Usuarios
    async obtenerUsuario() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      let payload = {
        jwt: jwt,
        //id: this.usuario.id,
        id: this.usuario.usr_id,
      }
      if (jwt !== null) {
        this.$store
          .dispatch('user/fetchUsersId', payload)
          .then((response) => {
            //this.usuarios = response.data
            console.log(response.data)
            this.profileUsr = response.data
            //this.isLoading = false
            //console.log(this.editedItem.imagen.avatar)
            /*             if (this.editedItem.imagen.avatar == undefined) {
              this.editedItem.imagen.avatar = this.urlSinImagen
            }
 */
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title),
      }
    },
    mapSetting(setting) {
      return {
        ...setting,
        children: setting.children ? setting.children.map(this.mapSetting) : undefined,
        title: this.$t(setting.title),
      }
    },
  },
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important

    .v-list-group--sub-group
      display: block !important

  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
      margin-right: 24px
      margin-left: 12px !important

      +rtl()
      margin-left: 24px
      margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
      padding-left: 8px

      +rtl()
      padding-right: 8px

    .v-list-group__header
      +ltr()
      padding-right: 0

      +rtl()
      padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
        margin-right: 8px

        +rtl()
        margin-left: 8px
</style>
