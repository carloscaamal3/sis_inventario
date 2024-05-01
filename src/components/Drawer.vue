<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    src="../assets/background.jpg"
    mobile-breakpoint="960"
    app
    mini-variant-width="80"
    width="260"
    v-bind="$attrs"
  >
    <!-- :src="barImage" -->
    <template v-slot:img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
    </template>
    <!-- Encabezado -->
    <v-list-item two-line>
      <v-list-item-content>
        <!--         <v-list-item-title class="text-uppercase font-weight-regular display-1">
          <span class="logo-mini">{{ $t('ct') }} </span>
          <span class="logo-normal">{{ $t('tim') }}</span>
        </v-list-item-title>
 -->
        <v-list-item-title class="font-weight-regular display-1">
          <!-- <span class="logo-mini">{{ $t('ct') }} </span> -->
          <span class="logo-mini">{{ usuario.sis_siglas }} </span>
          <!-- <span class="logo-normal">{{ $t('tim') }}</span> -->
        </v-list-item-title>

        <v-list-item-title class="font-weight-regular display-1">
          <span class="logo-normal">{{ usuario.sis_nomsistema }}</span>
        </v-list-item-title>
        <v-list-item-title class="font-weight-regular display-1">
          <span class="logo-normal">{{ usuario.sis_nomsistema2 }}</span>
        </v-list-item-title>
        <v-list-item-subtitle>v.{{ lastUpdated }}.{{ latestVersion }}</v-list-item-subtitle>
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
        <v-list-item-subtitle>{{ usuario.usr_nombres }}</v-list-item-subtitle>
        <v-list-item-subtitle>{{ usuario.nom_rol }}</v-list-item-subtitle>
        <!--         <v-list-item-subtitle>{{ profileUsr[0].ent_nombre }}</v-list-item-subtitle>
 -->
      </v-list-item-content>
    </v-list-item>
    <!-- Termina encabezado con el avatar -->

    <v-divider class="mb-2" />

    <!-- Menú -->
    <v-list expand nav>
      <div />

      <!-- Sistema Integral de Control de Folios -->
      <template v-if="usuario.sis_siglas == 'SICAS'">
        <!-- Seguimiento de Ordenes de compra -->
        <template v-if="esSupervisor || esAdministrador || esPresupuesto || esContabilidad">
          <v-list-item :to="{ path: 'allsicas' }">
            <v-list-item-action>
              <v-icon>mdi-monitor-eye</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Seguimiento </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- Ordenes de compra -->
        <template v-if="esSupervisor || esAdministrador || esPresupuesto || esContabilidad">
          <v-list-item :to="{ path: 'orders' }">
            <v-list-item-action>
              <v-icon>mdi-cart-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Órdenes de Compra </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- Ordenes de Servicio -->
        <template v-if="esSupervisor || esAdministrador || esPresupuesto || esContabilidad">
          <v-list-item :to="{ path: 'services' }">
            <v-list-item-action>
              <v-icon>mdi-car-wrench</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Órdenes de Servicio </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- Enviar Ordenes a Proveedor -->
        <template v-if="esSupervisor || esAdministrador || esPresupuesto || esContabilidad">
          <v-list-item :to="{ path: 'envioprov' }">
            <v-list-item-action>
              <v-icon>mdi-email-arrow-right-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Enviar a Proveedor </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- Recibir Factura -->
        <template v-if="esSupervisor || esAdministrador || esPresupuesto || esContabilidad">
          <v-list-item :to="{ path: 'recibefact' }">
            <v-list-item-action>
              <v-icon>mdi-file-rotate-right-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Recibir Factura </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- Entrega Pedido a usuario -->
        <template v-if="esSupervisor || esAdministrador || esPresupuesto || esContabilidad">
          <v-list-item :to="{ path: 'entregaped' }">
            <v-list-item-action>
              <v-icon>mdi-dolly</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Entrega Pedido </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-if="esSupervisor || esAdministrador || esPresupuesto || esContabilidad">
          <v-list-item :to="{ path: 'facturas' }">
            <v-list-item-action>
              <v-icon>mdi-receipt-text</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Facturas XML </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list-group>
          <v-list-item slot="activator">
            <v-list-item-action>
              <v-icon>mdi-printer-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Reportes </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </template>

      <!-- Sistema Integral de Control de Folios -->
      <template v-if="usuario.sis_siglas == 'SICF'">
        <template v-if="esSupervisor || esAdministrador || esPresupuesto || esContabilidad">
          <v-list-item :to="{ path: 'all' }">
            <v-list-item-action>
              <v-icon>mdi-eye-settings-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Seguimiento </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <!-- PRE - CAPTURA  -->
        <template v-if="esSupervisor || esPresupuesto">
          <v-list-item :to="{ path: 'precaptura' }">
            <v-list-item-action>
              <v-icon>mdi-alpha-p-box-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> PreCaptura </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- Captura -->
        <template v-if="esSupervisor || esPresupuesto">
          <v-list-item :to="{ path: 'captura' }">
            <v-list-item-action>
              <v-icon>mdi-file-document-edit-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Captura Inicial </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <!-- Firmas Presupuesto -->
        <template v-if="esSupervisor || esPresupuesto">
          <v-list-item :to="{ path: 'firmasol' }">
            <v-list-item-action>
              <v-icon>mdi-application-edit-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Firmas Presupuesto </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- Firmas Administrador -->
        <template v-if="esSupervisor || esAdministrador">
          <v-list-item :to="{ path: 'firmaaut' }">
            <v-list-item-action>
              <v-icon>mdi-application-edit</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Firmas Administrador </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- Pagos Tesoreria -->
        <template v-if="esSupervisor || esContabilidad">
          <v-list-item :to="{ path: 'pagos' }">
            <v-list-item-action>
              <v-icon>mdi-account-cash</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Pagos Tesoreria </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- Ejercido -->
        <template v-if="esSupervisor || esContabilidad">
          <v-list-item :to="{ path: 'ejercido' }">
            <v-list-item-action>
              <v-icon>mdi-clipboard-list-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Ejercido </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- Envio a Contabilidad -->
        <template v-if="esSupervisor || esPresupuesto">
          <v-list-item :to="{ path: 'devengado' }">
            <v-list-item-action>
              <v-icon>mdi-clipboard-arrow-right-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Envio a Contabilidad </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- Consulta -->
        <template v-if="esSupervisor || esAdministrador || esPresupuesto || esContabilidad">
          <v-list-item :to="{ path: 'consulta' }">
            <v-list-item-action>
              <v-icon>mdi-file-find-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Consulta </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>
      <template v-if="esSupervisor || esPresupuesto || esOwner">
        <v-list-group>
          <v-list-item slot="activator">
            <v-list-item-action>
              <v-icon>mdi-bookshelf</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Catalogos </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="esOwner" :to="{ path: 'sistema' }">
            <v-list-item-action>
              <v-icon>mdi-cube-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Sistemas </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ path: 'usuarios' }">
            <v-list-item-action>
              <v-icon>mdi-account</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Usuarios </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ path: 'empleados' }">
            <v-list-item-action>
              <v-icon>mdi-human-queue</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Empleados </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ path: 'clasificacion' }">
            <v-list-item-action>
              <v-icon>mdi-drawing</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Clasificacion</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ path: 'tipos' }">
            <v-list-item-action>
              <v-icon>mdi-shape</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Tipos </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ path: 'proveedores' }">
            <v-list-item-action>
              <v-icon>mdi-account-tie</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Proveedores </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ path: 'cuentas' }">
            <v-list-item-action>
              <v-icon>mdi-credit-card-plus-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Cuentas Contables </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ path: 'vehiculos' }">
            <v-list-item-action>
              <v-icon>mdi-car-pickup</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Vehículos </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ path: 'productos' }">
            <v-list-item-action>
              <v-icon>mdi-paperclip</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Productos </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ path: 'comcomite' }">
            <v-list-item-action>
              <v-icon>mdi-post-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Comite </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </template>

      <!--<template v-for="(item, i) in computedSettings">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item">
            
        </base-item-group>

        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>-->
      <v-divider class="mb-2" />
      <!-- <template v-for="(item, i) in computedAdministration">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item"> </base-item-group>

        <base-item v-else :key="`item-${i}`" :item="item" />
      </template> -->
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
import changelogContent from '/CHANGELOG.md'
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
    changelog: changelogContent,
    latestVersion: '',
    lastUpdated: '',
    profileUsr: [],
    profileUsr2: {
      usr_id: '',
      usr_login: '',
      usr_nombre: '',
      usr_correo: '',
      ent_nombre: '',

      //imagen: { avatar: '' },
    },
    items2: [] /* para usar con Json dinamico */,
    settings2: [] /* para usar con Json dinamico */,
    dashboard: [] /* para usar con Json dinamico */,
    config: [] /* para usar con Json dinamico */,
    //Menu Lateral
    items: [
      {
        icon: 'mdi-view-dashboard',
        title: 'dashboard',
        to: '/',
      },
      //Captura
      {
        icon: 'mdi-file-document-edit-outline',
        title: 'all',
        to: '/all',
      },

      //Captura
      {
        icon: 'mdi-file-document-edit-outline',
        title: 'capture',
        to: '/captura',
      },
      //Firma Solicitante
      {
        icon: 'mdi-file-document-edit-outline',
        title: 'firmsol',
        to: '/firmasol',
      },
      //Firma Autoriza
      {
        icon: 'mdi-file-document-edit-outline',
        title: 'firmaut',
        to: '/firmaaut',
      },
      //Pagos Tesoreria
      {
        icon: 'mdi-file-document-edit-outline',
        title: 'pagos',
        to: '/pagos',
      },
      //Ejercido
      {
        icon: 'mdi-file-document-edit-outline',
        title: 'ejercido',
        to: '/ejercido',
      },
      //Devengado y Comprometido
      {
        icon: 'mdi-file-document-edit-outline',
        title: 'Envio a Contabilidad',
        to: '/devengado',
      },
      {
        //group: '/ventas',
        group: '/admon',
        icon: 'mdi-bookshelf',
        title: 'catalogs',
        //icon: 'mdi-account-multiple',
        //title: 'users',
        children: [
          {
            icon: 'mdi-cube-outline',
            title: 'sistem',
            to: 'sistema',
          },

          {
            icon: 'mdi-account',
            title: 'users',
            to: 'usuarios',
          },
          {
            icon: 'mdi-account',
            title: 'employee',
            to: 'empleados',
          },

          {
            title: 'classification',
            icon: 'mdi-cogs',
            to: 'clasificacion',
          },
          {
            icon: 'mdi-account',
            title: 'type',
            to: 'tipos',
          },
          {
            title: 'provider',
            icon: 'mdi-cogs',
            to: 'proveedores',
          },
          {
            title: 'accounts',
            icon: 'mdi-cogs',
            to: 'cuentas',
          },
          /*  {
            title: 'products',
            icon: 'mdi-paperclip',
            to: 'productos',
          }, */
          {
            title: 'vehicles',
            icon: 'mdi-car-pickup',
            to: 'vehiculos',
          },
        ],
      },
      /* {
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
      }, */
      /* {
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
        //group: '/admon',
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
      }, */
    ],
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
    esAdministrador() {
      //console.log(this.usuario.usr_rol)
      return this.usuario && this.usuario.usr_rol == 'ADMON'
      //return this.usuario && this.usuario.usr_rol == '86'
    },
    esPresupuesto() {
      //console.log(this.usuario.usr_rol)
      return this.usuario && this.usuario.usr_rol == 'PRES'
      //return this.usuario && this.usuario.usr_rol == '87'
    },
    esSupervisor() {
      //console.log(this.usuario.sis_siglas)
      return this.usuario && this.usuario.usr_rol == 'SUPER'
      //return this.usuario && this.usuario.usr_rol == '85'
    },
    esContabilidad() {
      //console.log(this.usuario.usr_rol)
      return this.usuario && this.usuario.usr_rol == 'CONTAB'
      //return this.usuario && this.usuario.usr_rol == '88'
    },
    esOwner() {
      //console.log(this.usuario.usr_rol)
      return this.usuario && this.usuario.usr_rol == 'OWNER'
      //return this.usuario && this.usuario.usr_rol == '88'
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
  mounted() {
    // axios.get('items.json').then((response) => (this.items2 = response.data))
    this.parseChangelog()
  },
  created() {
    //OJOOOO
    this.obtenerUsuario()
    //  console.log('usuario.sis_siglas: ' + this.usuario.sis_siglas)
    /* para usar con Json dinamico */
    /* this.getConfig()
    this.getDashboard()
    this.getItems()
    this.getSettings() */
  },
  methods: {
    parseChangelog() {
      //  console.log("changelogContent", changelogContent)
      // Analizar el contenido del changelog para obtener la última versión y la fecha de la última actualización
      const regexVersion = /## \[(\d+\.\d+\.\d+)\]/
      //const regexVersion = /## \[(.*?)\]/
      const regexDate = /## \[\d+\.\d+\.\d+\](?:\([^)]*\))? \((\d{4}-\d{2}-\d{2})\)/

      const versionMatch = regexVersion.exec(this.changelog)
      const dateMatch = regexDate.exec(this.changelog)
      if (versionMatch && versionMatch.length > 1) {
        const fullVersion = versionMatch[1] // Obtener la versión completa
        const versionNumbers = fullVersion.split('.') // Dividir la versión en números
        this.latestVersion = versionNumbers[versionNumbers.length - 1] // Obtener el último número
      }
      /* if (dateMatch && dateMatch.length > 1) {
        this.lastUpdated = dateMatch[1]
      }¨*/

      if (dateMatch && dateMatch.length > 1) {
        // Convierte la fecha del formato de puntos a guiones
        const dateWithDots = dateMatch[1]
        //const dateWithHyphens = dateWithDots.replace(/\./g, ".");
        const dateWithHyphens = dateWithDots.replace(/-/g, '.')
        this.lastUpdated = dateWithHyphens
        //console.log("dateWithHyphens", dateWithHyphens)
      }
    },
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
            //console.log(response.data)
            this.profileUsr = response.data
            //console.log(this.profileUsr)
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
