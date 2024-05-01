import Vue from 'vue'
import Vuex from 'vuex'
import * as user from './modules/user.js'
import * as auth from './modules/auth.js'
import * as group from './modules/group'
import * as userRole from './modules/userRole'
import * as permit from './modules/permiso.store'

import * as clastipo from './modules/clasificacion.store'
import * as consulta from './modules/consulta.store'
import * as cuenta from './modules/cuenta.store'
import * as empleado from './modules/empleado.store'
import * as proveedor from './modules/proveedor.store'
import * as solpago from './modules/solpagos.store'
import * as tipo from './modules/tipo.store'
import * as folio from './modules/folios.store'
import * as casosesp from './modules/casosesp.store'
import * as general from './modules/generales.store'
import * as impresiones from './modules/impresiones.store'
import * as tools from './modules/tools.store'
import * as relcuentas from './modules/relcuentas.store'
import * as sistema from './modules/sistema.store'
import * as vehiculo from './modules/sica/vehiculo.store'
import * as producto from './modules/sica/producto.store'
import * as comcomite from './modules/sica/comcomite.store'
import * as ordencompra from './modules/sica/ordenes_compra.store'
import * as ordenServicio from './modules/sica/ordenes_servicio.store.js'
import * as factura from './modules/sica/facturas.store.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .3), rgba(0, 0, 0, .3)',
    //barColor: "rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0.5)",
    barImage: 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg',
    //barImage: 'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-1.jpg',
    //barImage: 'background.jpg',
    drawer: null,
    snackbar: {
      visible: false,
      color: 'success',
      text: null,
      timeout: 6000,
      multiline: false,
    },
  },
  mutations: {
    SET_BAR_IMAGE(state, payload) {
      state.barImage = payload
    },
    SET_DRAWER(state, payload) {
      state.drawer = payload
    },
    SET_SCRIM(state, payload) {
      state.barColor = payload
    },
    ALERT(state, payload) {
      state.snackbar.text = payload.text
      if (payload.text.length > 50) {
        state.snackbar.multiline = true
      }

      // Si es mas de 50 caracteres definirlo como multilinea
      if (payload.multiline) {
        state.snackbar.multiline = payload.multiline
      }

      // Color para mensajes de error o éxito
      if (payload.color) {
        state.snackbar.color = payload.color
      }

      // Tiempo de duración
      if (payload.timeout) {
        state.snackbar.timeout = payload.timeout
      }
      state.snackbar.visible = true
    },
    CLOSE_ALERT(state) {
      state.snackbar.visible = false
      state.snackbar.multiline = false
      state.snackbar.text = null
    },
  },
  actions: {},
  modules: {
    auth,
    casosesp,
    clastipo,
    consulta,
    cuenta,
    empleado,
    folio,
    general,
    group,
    impresiones,
    permit,
    proveedor,
    relcuentas,
    sistema,
    solpago,
    tipo,
    tools,
    user,
    userRole,
    vehiculo,
    producto,
    comcomite,
    ordencompra,
    ordenServicio,
    factura
  },
})
