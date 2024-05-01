<template>
  <v-container id="data-tables" tag="section">
    <base-material-card icon="mdi-card-bulleted-outline" color="blue" inline class="px-5 py-3">
      <!--boton de filtro-->
      <template v-slot:corner-button>
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="tipo_clave"
              :items="tipos"
              :menu-props="{ top: true, offsetY: true }"
              label="Tipo de orden"
              item-text="tipo_descripcion"
              item-value="tipo_clave"
              persistent-hint
              dense
              hint="Seleccione tipo de orden"
              @change="onChangeTipoPrinc"
              return-object
            >
            </v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="ejercicio"
              :items="ejercicios"
              :menu-props="{ top: true, offsetY: true }"
              label="Ejercicio"
              item-text="sp_ejercicio"
              item-value="sp_ejercicio"
              persistent-hint
              dense
              hint="Seleciona ejercicio"
              @change="onChangeEjercicioPrinc"
              return-object
            >
            </v-select>
          </v-col>
        </v-row>
      </template>
      <!-- Textfield para la barra de Búsqueda -->
      <v-text-field
        append-icon="mdi-magnify"
        class="ml-auto"
        hide-details
        label="Búsqueda"
        single-line
        style="max-width: 250px"
        v-model="search"
      />
      <v-divider class="mt-4" />
      <br />
      <!-- Tabla de Ordenes de compra-->
      <v-data-table
        dense
        loading-text="Cargando... Espere por favor"
        :headers="headers"
        :items="ordenes"
        :loading="isLoading"
        :search.sync="search"
        hide-default-footer
        disable-pagination
      >
        <!-- Template para Fecha -->
        <template v-slot:[`item.osFecha`]="{ item }">
          <div class="name-info-title">
            {{ formato(eFormatos.FECHA_NUM, item.osFecha) }}
          </div>
        </template>

        <template v-slot:[`item.osTotal`]="{ item }">
          {{ formato(eFormatos.MONEDA, item.osTotal) }}
        </template>
        <template v-slot:[`item.osTotalFact`]="{ item }">
          {{ formato(eFormatos.MONEDA, item.osTotalFact) }}
        </template>
        <!-- Acciones de la Tabla Principal -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon medium class="mr-2" @click="uploadFact(item)">mdi-cloud-upload</v-icon>
          <v-icon medium class="mr-2" @click="viewList(item)">mdi-eye</v-icon>
          <v-icon medium :disabled="item.osEstatus != 'FAC'" @click="envPago(item)"
            >mdi-alpha-p-box</v-icon
          >
        </template>
      </v-data-table>
      <CargarFactura
        v-model="dialogCargarFactura"
        :osNumDoc="osNumDocEnCargarFactura"
        :osTipoDoc="osTipoDocEnCargarFactura"
        :ejercicio="ejercicioEnCargarFactura"
        :montoDoc="osTotaEnCargarFactura"
        :proveedor="osRFCEnCargarFActura"
        :osTotalFactura="osTotalFactEnCargaFactura"
      />
      <v-dialog v-model="dialogDet" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitleDet }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-data-table
                class="Black--text"
                dense
                loading-text="Cargando... Espere por favor"
                :headers="headersDet"
                :items="tableData"
                :loading="isLoading"
                :search.sync="search"
                hide-default-footer
                disable-pagination
              >
                <template slot="body.append">
                  <tr class="Black--text">
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>
                      <h2 class="total">
                        Total: {{ formato(eFormatos.MONEDA, sumaTotalFactura('sumaTotal')) }}
                      </h2>
                    </th>
                  </tr>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
              </v-data-table>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogDet = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogConfirmar" persistent max-width="500">
        <v-card>
          <v-card-title class="font-weight-bold">{{ tittleConfirm }} </v-card-title>
          <v-card-text class="text-center mb-4">
            {{ notificacionDialog }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" id="ConfirmaSi" :disabled="!ConfirmaSi" text @click="enviaPago()"
              >Sí</v-btn
            >
            <v-btn color="error" text @click="dialogConfirmar = false">{{
              opcionSelect || 'No'
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </base-material-card>
  </v-container>
</template>
<script>
import { getValidToken } from '@/store/helpers.js'
import CargarFactura from '@/components/general/CargarFactura.vue'
import * as tools from '@/store/modules/tools.store.js'
// import Vue from 'vue'

export default {
  name: 'RecibeFactura',
  components: {
    CargarFactura,
  },
  data: () => ({
    usuario: JSON.parse(localStorage.getItem('user')),
    eFormatos: tools.formatos,
    isLoading: false,
    ejercicio: 0,
    sp_ejercicio: 0,
    ocultarCampo: false,
    dialogDet: false,
    dialogCargarFactura: false,
    search: undefined,
    dialogConfirmar: false,
    tittleConfirm: '',
    checkbox: false,
    isSure: false,
    notificacionDialog: '',
    opcionSelect: '',
    ConfirmaSi: true,
    osNumDocEnCargarFactura: 0,
    osTipoDocEnCargarFactura: 0,
    ejercicioEnCargarFactura: 0,
    sp_folio: 0,
    originalSpFolio: 0,
    Fecha: '',
    tipo_clave: '',
    headers: [
      { text: 'Nº Doc', align: 'start', value: 'osNumDoc', sortable: true },
      { text: 'Tipo de orden', align: 'start', value: 'osTipoDoc', sortable: true },
      { text: 'Fecha', align: 'center', value: 'osFecha', sortable: true },
      { text: 'Solicita', align: 'center', value: 'osEmpSolicitaNombre', sortable: true },
      { text: 'Proveedor', align: 'center', value: 'prov_razon_social', sortable: true },
      { text: 'Descripción', align: 'center', value: 'osDescripcion', sortable: true },
      { text: 'Total', align: 'center', value: 'osTotal', sortable: true },
      { text: 'Total Facturado', align: 'center', value: 'osTotalFact', sortable: true },
      { text: 'Estatus', align: 'center', value: 'estatus_nombre', sortable: true },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headersDet: [
      { text: 'Nº Doc', align: 'start', value: 'numDoc', sortable: true },
      { text: 'UUID', align: 'start', value: 'UUID', sortable: true },
      { text: 'Tipo Orden', align: 'start', value: 'tipoDoc', sortable: true },
      { text: 'Monto Factura', align: 'start', value: 'importeFactura', sortable: true },
      { text: 'Acciones', align: 'start', value: 'actions', sortable: true },
    ],
    ordenes: [],
    ejercicios: [],
    tipos: [],
    tableData: [],
    factura: [],
    conceptos: [],
  }),
  editedItem: {
    sp_ejercicio: 0,
    tipo_clave: '',
  },
  async created() {
    this.inicia()
    this.$root.$on('guardado-exitoso', () => {
      this.obtenerOrdenes()
    })
  },
  methods: {
    async inicia() {
      let jwt = await getValidToken(this)
      //await this.obtenerOrdenes(jwt, this.ejercicio)
      await this.obtenerEjercicios(jwt)
      await this.obtenerTipos(jwt)
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerOrdenes(this.ejercicio)
      if (this.tipo_clave == undefined || this.tipo_clave == 0) {
        this.tipo_clave = this.tipos[2].tipo_clave
      }
      this.EjercicioValido()
      this.obtenerConceptos()
    },

    EjercicioValido() {
      //console.log("ejercicio", this.ejercicio)
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      if (this.ejercicio == 0) {
        var currentTime = new Date()
        this.ejercicio = currentTime.getFullYear()
      }
      this.editedItem.sp_ejercicio = this.ejercicio
    },
    async onChangeEjercicioPrinc(value) {
      //let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await this.obtenerOrdenes(value.sp_ejercicio)
    },
    async onChangeTipoPrinc(value) {
      // let jwt = await getValidToken(this)
      await this.obtenerEjercicios()
      // this.ejercicio = value.sp_ejercicio
      this.tipo_clave = value.tipo_clave
      //console.log("tipos",value.sp_ejercicio)
      await this.obtenerOrdenes(value.sp_ejercicio, value.tipo_clave)
    },
    /*deleteItem(item) {
      console.log("item-text", item)
      const index = this.tableData.indexOf(item)
      confirm('¿Está seguro que desea eliminar este registro?, Se perderan todos los datos') &&
      this.tableData.splice(index, 1)
      this.BorrarRegistroDoc(item.numDoc)
      this.BorrarOrDet(item.UUID)
      this.BorrarRegistro(item.UUID)
    },*/
    async obtenerFactura(UUID) {
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=UUID&tipo1=igual&valor1=' + UUID
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.factura = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('factura/fetchFactura', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.factura = response.data
            }
            this.isLoading = false
          })
          .catch((err) => {
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },

    async deleteItem(item) {
      console.log('item-text', item)
      const index = this.tableData.indexOf(item)
      const userConfirm =
        confirm('¿Está seguro que desea eliminar este registro?, Se perderan todos los datoss') &&
        this.tableData.splice(index, 1)
      if (!userConfirm) {
        return
      }
      await this.obtenerFacturasDoc(item.UUID)
      await this.obtenerFactura(item.UUID)
      if (this.tableDataDoc.length > 1) {
        // Si se encontraron registros en obtenerFacturasDoc, borra el registro de documento
        this.BorrarRegistroDoc(item.numDoc, item.UUID)
      } else {
        // Si no se encontraron registros, borra solo el registro de documento
        this.BorrarRegistroDoc(item.numDoc, item.UUID)
        this.BorrarOrDet(item.UUID)
        this.BorrarRegistro(item.UUID)
      }
      // Elimina el elemento de la tabla
      this.tableData.splice(index, 1)
      this.Refresca()
    },
    sumaNuevoSaldo(key) {
      let suma = 0
      for (let x in this.factura) {
        console.log('saldoFac', this.factura[x].saldoFac)
        console.log('documento total', this.tableDataDoc[x].importeDocumento)
        if (key == 'Monto' || key == 'Total') {
          suma = Number(this.factura[x].saldoFac) + Number(this.tableDataDoc[x].importeDocumento)
        }
      }
      console.log('suma', suma)
      return suma
    },
    async obtenerFacturasDoc(UUID) {
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=UUID&tipo1=igual&valor1=' + UUID
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.tableDataDoc = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('factura/fetchFacturaDoc', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.tableDataDoc = response.data
            }
            this.isLoading = false
          })
          .catch((err) => {
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },

    async BorrarRegistroDoc(index, UUID) {
      // const saldoNuevo =
      let body = {
        numDoc: index,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index + '/' + UUID
      await this.$store
        .dispatch('factura/deleteFacturaDoc', payload)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se eliminó con éxito',
          })
          this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
          this.overlay = false
        })
      let bodyDoc = {
        saldoFac: Number(this.sumaNuevoSaldo('Total')),
      }
      let payloadDoc = { jwt: jwt, body: bodyDoc }
      payloadDoc.id = UUID
      await this.$store.dispatch('factura/editSaldo', payloadDoc).catch((err) => {
        this.$store.commit('ALERT', {
          color: 'error',
          text: err.response.data.msg,
        })
      })
      await this.obtenerOrdenes()
    },
    async BorrarRegistro(index) {
      let body = {
        UUID: index,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('factura/deleteFacturaCab', payload)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se eliminó con éxito',
          })
          this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
          this.overlay = false
        })
      await this.obtenerOrdenes()
    },
    async BorrarOrDet(index) {
      let body = {
        UUID: index,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('factura/deleteFacturaDet', payload)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se eliminó con éxito',
          })
          this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
          this.overlay = false
        })
    },

    async obtenerEjercicios(jwt) {
      //this.isLoading = true
      let params = null
      //params = 'solicitud_pagos/sp_ejercicio/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.ejercicios = []
        await this.$store
          .dispatch('consulta/fetchGetEjerciciosOrden', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ejercicios = response.data
            }
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
            })
          })
      }
    },
    sumaTotalFactura(key) {
      let suma = 0
      for (let x in this.tableData) {
        if (key == 'Monto' || key == 'sumaTotal') {
          suma += Number(this.tableData[x].importeFactura)
        }
      }
      return suma
    },
    async uploadFact(item) {
      this.editedIndex = this.ordenes.indexOf(item)
      console.log('this.editedIndex: ', item)
      this.editedItem = Object.assign({}, item)
      const osNumDocValue = this.editedItem.osNumDoc
      this.osNumDocEnCargarFactura = osNumDocValue
      const osTipoDocValue = this.editedItem.osTipoDoc
      this.osTipoDocEnCargarFactura = osTipoDocValue
      const ejercicioValue = this.editedItem.sp_ejercicio
      this.ejercicioEnCargarFactura = ejercicioValue
      const montoDocValue = this.editedItem.osTotal
      this.osTotaEnCargarFactura = montoDocValue
      const RfcDocValue = this.editedItem.prov_RFC
      this.osRFCEnCargarFActura = RfcDocValue
      const osTotalFacValue = this.editedItem.osTotalFact
      this.osTotalFactEnCargaFactura = osTotalFacValue
      this.dialogCargarFactura = true
    },
    async viewList(item) {
      this.editedIndex = this.tableData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.osNumDoc = this.editedItem.osNumDoc
      await this.obtenerFacturas(this.editedItem.osNumDoc)
      this.dialogDet = true
    },
    async envPago(item) {
      this.editedIndex = this.ordenes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.osNumDoc = this.editedItem.osNumDoc
      console.log('item', item)

      var fecha = new Date()
      console.log('tipo de sol', this.editedItem.sp_tipo_sol)
      if (this.editedItem.sp_tipo_sol === 'P') {
        this.dialogConfirmar = true
        this.tittleConfirm = 'Enviar a pago'
        this.notificacionDialog =
          'Se enviara a pago la orden: ' + this.editedItem.osNumDoc + ' ¿Seguro quiere continuar?'
        this.editedItem.sp_estatus = 'PRECAPXREC'
        this.editedItem.osEstatus = 'ENVPAG'
        this.os_fecha_envpag = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
        this.sp_fecha_precaxrec = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      }

      if (this.editedItem.sp_tipo_sol === 'NP') {
        this.dialogConfirmar = true
        this.tittleConfirm = 'Enviar a comprobacion'
        this.notificacionDialog =
          'Se enviara a comprobacion la orden: ' +
          this.editedItem.osNumDoc +
          ' ¿Seguro quiere continuar?'
        this.editedItem.sp_estatus = 'ENVPRECAP'
        this.editedItem.osEstatus = 'ENVCOMP'
        this.os_fecha_envcomprob = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
        this.sp_fecha_envprecap = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
        this.editedItem.sp_concepto = 'PAGPROV'
        if (this.editedItem.sp_tipo_sol === 'NP') {
          this.editedItem.tipoSol = 1
        }
        //obtiene el tipo_id del concepto registrado en la orden de compra
        await this.obtenerConceptos()
        if (this.conceptos && this.editedItem.sp_concepto) {
          const conceptoEncontrado = this.conceptos.find(
            (concepto) => concepto.tipo_clave === this.editedItem.sp_concepto
          )
          if (conceptoEncontrado) {
            this.sp_concepto_id = conceptoEncontrado.tipo_id
          }
          console.log('osEstatus', this.editedItem.osEstatus)
        }
      }
    },
    enviaPago() {
      if (this.ConfirmaSi && this.editedItem.sp_tipo_sol === 'NP') {
        this.savePreCap()
        this.enviarPago()
      }
      if (this.ConfirmaSi && this.editedItem.sp_tipo_sol === 'P') {
        this.enviarPago()
      }
    },

    /***********************************************/
    //Obtiene todos los Solicitudes de Pago para la tabla
    async obtenerIdSolPagos(jwt, year) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params = year

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.sgteIdSolPag = 0
        await this.$store
          .dispatch('solpago/fetchSgteSolPag', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.sgteIdSolPag = response.data[0].sgteSolPag
            }

            this.isLoading = false
          })
          .catch((err) => {
            this.isLoading = false
            this.error = err
            return 0
          })
      }
    },
    async savePreCap() {
      this.overlay = true
      //this.$v.$touch()
      let jwt = await getValidToken(this)
      //if (!this.$v.$invalid) {

      let prov = 0
      if (this.editedItem.prov_id.prov_id == null) {
        prov = this.editedItem.prov_id
      } else {
        prov = this.editedItem.prov_id.prov_id
      }
      let cuenta = 0
      if (this.editedItem.cuecon_cuenta.cuecon_cuenta == null) {
        cuenta = this.editedItem.cuecon_cuenta
      } else {
        cuenta = this.editedItem.cuecon_cuenta.cuecon_cuenta
      }
      let dirSolicita = 0
      if (this.editedItem.osDirSolicita.emp_direccion == null) {
        dirSolicita = this.editedItem.osDirSolicita
      } else {
        dirSolicita = this.editedItem.osDirSolicita.emp_direccion
      }
      let solicita = 0
      if (this.editedItem.osEmpSolicita.emp_id == null) {
        solicita = this.editedItem.osEmpSolicita
      } else {
        solicita = this.editedItem.osEmpSolicita.emp_id
      }
      let pagoNombreDe = ''
      if (this.editedItem.prov_razon_social.prov_razon_social == null) {
        pagoNombreDe = this.editedItem.prov_razon_social
      } else {
        pagoNombreDe = this.editedItem.prov_razon_social.prov_razon_social
      }
      let importe = 0
      if (this.editedItem.osTotal.osTotal == null) {
        importe = this.editedItem.osTotal
      } else {
        importe = this.editedItem.osTotal.osTotal
      }
      /*let tiposol = 0
      if (this.editedItem.sp_tipo_sol.tipo_id == null) {
        tiposol = this.editedItem.sp_tipo_sol
      } else {
        tiposol = this.editedItem.sp_tipo_sol.tipo_id
      }?*/
      //***********************
      //CREAR P o NP PRINCIPAL
      //***********************
      let body = {}
      console.log('conceptp', this.sp_concepto_id)
      body = {
        sp_tipo_sol: this.editedItem.tipoSol,
        sp_concepto: this.sp_concepto_id,
        prov_id: prov,
        cuecon_cuenta: cuenta,
        sp_descripcion: this.editedItem.osDescripcion || 'SOLICITUD CREADA PARA COMPROBACION',
        sp_pago_nombre_de: pagoNombreDe,
        sp_observacion: this.editedItem.osObservacion,
        sp_emp_id_sol: solicita,
        sp_emp_id_aut: this.editedItem.osEmpAut,
        sp_direccion_sol: dirSolicita,
        sp_estatus: this.editedItem.sp_estatus,
        sp_vobo_emp_id: 0, //pendiente
        sp_fuente_fin: 0,
        sp_importe: importe,
        sp_fecha_precaptura: '0001-01-01',
      }

      let payload = {
        jwt: jwt,
        body: body,
      }
      //*********************************
      // CREAR O EDITAR
      //*********************************
      //if (this.editedIndex > -1) {
      //EDITAR SOLICITUD DE PAGOS
      // payload.id = this.editedItem.sp_id
      //payload.ejercicio = this.editedItem.sp_ejercicio
      var year = this.editedItem.sp_ejercicio
      //console.log('year ' + year)

      await this.obtenerIdSolPagos(jwt, year)
      this.sp_folio = parseInt(this.sgteIdSolPag)
      console.log('sgteIdSolPag', this.sp_folio)
      this.originalSpFolio = this.sp_folio
      console.log('originalSpFolio', this.originalSpFolio)
      body.sp_ejercicio = year
      body.sp_id = this.sp_folio

      await this.$store
        .dispatch('solpago/addPreSolPagos', payload)
        .then(() => {
          this.msgStore = 'El registro se realizo con éxito'
          this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
          this.overlay = false
        })
      ///////////////////actualiza campo sp id comprobacion//////////////////////
      let bodySol = {}
      let payload3 = {}
      bodySol = {
        sp_id: this.sp_folio,
        sp_ejercicio: this.editedItem.sp_ejercicio,
        sp_id_comp: this.editedItem.sp_id, //guarda el sp id creado cuando era NP la sol
      }
      //if (this.isPreCaptura) {
      //payload.body.sp_fecha_solicitud = this.editedItem.sp_fecha_solicitud
      // ACTUALIZA SEGUIMIENTO DE LA SOLICITUD
      payload3 = { jwt: jwt, body: bodySol }
      await this.$store
        .dispatch('solpago/editCampoSol', payload3)

        .then(() => {
          this.msgStore = 'El registro se realizo con éxito'
          this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
          this.overlay = false
        })

      try {
        await this.obtenerOrdenes(jwt, this.ejercicio)
        this.close()
      } catch (error) {
        console.error('Error:', error)
      }

      //}
    },

    async enviarPago() {
      try {
        let jwt = await getValidToken(this)
        // ACTUALIZA ESTATUS DE ORDEN
        var year = this.editedItem.sp_ejercicio
        await this.obtenerIdSolPagos(jwt, year)
        this.sp_folio = parseInt(this.sgteIdSolPag)

        let bodyEstatus = {
          osEstatus: this.editedItem.osEstatus,
        }
        let payloadEstatus = { jwt: jwt, body: bodyEstatus }
        payloadEstatus.id = this.editedItem.osNumDoc
        await this.$store.dispatch('ordencompra/editEstatus', payloadEstatus)

        //////////////////////////////////////////////////////////////////////////////
        let bodyEnv = {}
        let bodySol = {}
        let body = {}

        // Verificar si os_fecha_envpag y os_user_envpag no están vacíos
        if (this.editedItem.sp_tipo_sol === 'P') {
          bodyEnv = {
            os_fecha_envpag: this.os_fecha_envpag,
            os_user_envpag: this.usuario.usr_id,
            osNumDoc: this.editedItem.osNumDoc,
            osEjercicio: this.editedItem.sp_ejercicio,
          }
          bodySol = {
            sp_id: this.editedItem.sp_id,
            sp_ejercicio: this.editedItem.sp_ejercicio,
            sp_fecha_precaxrec: this.sp_fecha_precaxrec,
            sp_user_precaxrec: this.usuario.usr_id,
          }
          // ACTUALIZA ESTATUS DE LA SOLICITUD
          body = {
            sp_estatus: this.editedItem.sp_estatus,
            sp_ejercicio: this.editedItem.sp_ejercicio,
            sp_id: this.editedItem.sp_id,
          }
        }
        if (this.editedItem.sp_tipo_sol === 'NP') {
          bodyEnv = {
            os_fecha_envcomp: this.os_fecha_envcomprob,
            os_user_envcomp: this.usuario.usr_id,
            osNumDoc: this.editedItem.osNumDoc,
            osEjercicio: this.editedItem.sp_ejercicio,
          }
          console.log('originalSpFolio 2', this.sp_folio)
          bodySol = {
            sp_id: this.originalSpFolio,
            sp_ejercicio: this.editedItem.sp_ejercicio,
            sp_fecha_envprecap: this.sp_fecha_envprecap,
            sp_user_envprecap: this.usuario.usr_id,
          }
        }
        // ACTUALIZA SEGUIMIENTO DE LA SOLICITUD
        let payload3 = { jwt: jwt, body: bodySol }
        await this.$store.dispatch('solpago/editCampoSol', payload3)
        // ACTUALIZA SEGUIMIENTO DE LA ORDEN
        let payloadEnv = { jwt: jwt, body: bodyEnv }
        await this.$store.dispatch('ordencompra/editSeguimiento', payloadEnv)

        // ACTUALIZA ESTATUS DE LA SOLICITUD CUANDO ES P

        let payload = { jwt: jwt, body: body }
        await this.$store.dispatch('solpago/editEstSol', payload)
        //}
        this.$store.commit('ALERT', {
          color: 'success',
          text: 'La orden se envió con éxito',
        })
      } catch (err) {
        this.$store.commit('ALERT', {
          color: 'error',
          text: err.response ? err.response.data.msg : 'Error desconocido',
        })
        this.overlay = false
      }

      this.obtenerOrdenes(this.ejercicio)
      this.close()
    },

    /***********************************************/
    async obtenerFacturas(osNumDoc) {
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=numDoc&tipo1=igual&valor1=' + osNumDoc
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.tableData = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('factura/fetchFacturaDoc', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.tableData = response.data
            }
            this.isLoading = false
          })
          .catch((err) => {
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    async obtenerOrdenes(ejercicio, tipo_clave) {
      let jwt = await getValidToken(this)
      this.isLoading = true
      let params =
        'filtro?campo1=sp_ejercicio&tipo1=igual&valor1=' +
        this.ejercicio +
        '&logico2=and&campo2=osEstatus&tipo2=igual&valor2=ENVPROV&logico3=or&campo3=osEstatus&tipo3=igual&valor3=FAC' //estatus anterior CAP_OS
      if (tipo_clave) {
        params += '&logico3=and&campo3=osTipoDoc&tipo3=igual&valor3=' + this.tipo_clave
      }
      if (tipo_clave == 0) {
        params =
          'filtro?campo1=sp_ejercicio&tipo1=igual&valor1=' +
          this.ejercicio +
          '&logico2=and&campo2=osEstatus&tipo2=igual&valor2=ENVPROV&logico3=or&campo3=osEstatus&tipo3=igual&valor3=FAC'
      }
      if (jwt != null) {
        this.ordenes = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchordersAll', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ordenes = response.data
            }

            this.isLoading = false
          })
          .catch((err) => {
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    async obtenerTipos(jwt) {
      this.isLoading = true
      let params = null
      //params ='filtro?campo1=t.clatip_id&tipo1=igual&valor1=TIPDOC&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.tipos = []
        await this.$store
          .dispatch('consulta/fetchTiposOrden', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.tipos = response.data
            }
            this.isLoading = false
          })
          .catch((err) => {
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
            })
          })
      }
    },
    //Obtiene Todos las conceptos para la tabla
    async obtenerConceptos() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: null }
        this.conceptos = []
        await this.$store
          .dispatch('consulta/fetchGetConceptosSica', payload)
          .then((response) => {
            this.conceptos = response.data
            this.isLoading = false
          })
          .catch((err) => {
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },

    formato(opcion, valor) {
      if (opcion == this.eFormatos.IMPORTE) {
        return tools.formatoImporte(valor)
      } else if (opcion == this.eFormatos.MONEDA) {
        return tools.formatoMoneda(valor)
      } else if (opcion == this.eFormatos.FECHA) {
        return tools.convierteNumeroFechaVista(valor)
      } else if (opcion == this.eFormatos.FECHA_NUM) {
        return tools.convierteNumeroFecha(valor)
      } else if (opcion == this.eFormatos.FECHA_FORMATO) {
        return tools.fechaformato(valor)
      } else if (opcion == this.eFormatos.MONEDA_RIGHT) {
        return tools.formatoMonedaRight(valor)
      }
    },
    close(checkbox) {
      this.isSure = false
      this.checkbox = checkbox
      if (!this.checkbox) {
        this.dialogConfirmar = false
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$v.$reset()
    },
  },
  computed: {
    formTitleDet() {
      return this.editedIndex === -1 ? 'Nueva Órden de Servicio' : 'Facturas registradas: '
    },
  },
}
</script>
