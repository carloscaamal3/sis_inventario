<template>
  <v-tabs fixed-tabs background-color="indigo" dark>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab @change="refrescaEnvia">
      <v-icon left> mdi-clipboard-arrow-right-outline </v-icon>Enviar Autorizadas
    </v-tab>
    <v-tab @change="refrescaReimprime">
      <v-icon right> mdi-printer </v-icon>ReImpresion de Autorizadas
    </v-tab>
    <v-tab @change="refrescaAutorizados">
      <v-icon right> mdi-clipboard-arrow-down </v-icon>Folios Autorizados
    </v-tab>

    <!-- ENVIAR AUTORIZADAS -->
    <v-tab-item>
      <base-material-card
        color="blue"
        icon="mdi-clipboard-arrow-right-outline"
        inline
        class="px-5 py-3"
      >
        <template v-slot:corner-button>
          <v-row>
            <v-col cols="6">
              <v-btn
                small
                class="ma-2"
                elevation="2"
                color="blue"
                :disabled="selected.length == 0"
                text
                @click="enviarsol"
                >Enviar</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="ejercicioEnvAut"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEnvAut"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </template>

        <v-card flat>
          <v-row>
            <v-col cols="6">
              <!-- Empieza DataExporter -->
              <DataExporter
                :dataArray="solpagosExportar"
                :dataFields="fieldsEnvAut"
                fileName="enviarAutoriza"
                pdfView="none"
              />
              <!-- Termina DataExporter -->
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                class="ml-auto"
                label="Búsqueda"
                hide-details
                single-line
                style="max-width: 250px"
              />
            </v-col>
          </v-row>
          <!-- Empieza Dialogo Cancelar -->
          <ConfirmationDialog v-model="isSure" @click="cancel" />
          <!-- Dialogo para motivo de cancelacion -->
          <v-dialog v-model="dialogxc" persistent max-width="800px">
            <v-card class="v-text">
              <v-card-title class="v-text">
                <span>Cancelar Documento</span>
              </v-card-title>
              <v-card-text class="v-text">
                <v-container class="v-text">
                  <v-row>
                    <!-- Campo MOTIVO DE CANCELACION -->
                    <v-col cols="12" class="v-text">
                      <v-text-field
                        v-model="editedItem.sp_motivo_cancelacion"
                        label="Motivo de Cancelación"
                        counter="100"
                        :error-messages="sp_motivo_cancelacionErrors"
                        @input="$v.editedItem.sp_motivo_cancelacion.$reset(), (changed = true)"
                        @blur="$v.editedItem.sp_motivo_cancelacion.$touch()"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="v-text">
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="Borrar()" :disabled="$v.$invalid"
                  >Guardar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Termina Dialogo para motivo de cancelacion -->

          <v-divider class="mt-3" />
          <v-data-table
            :headers="headers"
            :items="solpagos"
            :single-select="singleSelect"
            item-key="sp_id"
            show-select
            v-model="selected"
            dense
            :search.sync="search"
            :loading="isLoading"
            loading-text="Cargando... Espere por favor"
            class="elevation-5"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>

            <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
              <div class="name-info-title">{{ convierteNumeroFecha(item.sp_fecha_solicitud) }}</div>
            </template>
            <template v-slot:item.sp_importe="{ item }">
              {{ formatPrice(item.sp_importe) }}
            </template>

            <template v-slot:no-data>
              <!-- <v-btn color="primary">Reset</v-btn> -->
              ¡No hay datos para mostrar!
            </template>
          </v-data-table>
        </v-card>
      </base-material-card>
    </v-tab-item>
    <!-- REIMPRESION AUTORIZADAS -->
    <v-tab-item>
      <v-tabs>
        <!-- REIMPRESION ENVIADAS A PAGO -->
        <v-tab
          ><v-icon left> mdi-printer </v-icon>Solicitud de Pago Recibida con firma de
          Autoriza</v-tab
        >
        <!-- REIMPRESION ENVIADAS A CONTROL PRESUPUESTAL -->
        <v-tab
          ><v-icon left> mdi-printer </v-icon>Comprobacion recibida con firma de Autoriza</v-tab
        >
        <!-- CONTENIDO: REIMPRESION ENVIADAS A PAGO -->
        <v-tab-item>
          <!-- icono -->
          <base-material-card color="blue" icon="mdi-printer" inline class="px-5 py-3">
            <v-card flat>
              <v-row>
                <v-col cols="6">
                  <!-- Empieza DataExporter -->
                  <DataExporter
                    :dataArray="gpoenvpagoExportar"
                    :dataFields="fieldsGpoEnvPag"
                    fileName="gpoEnviaPago"
                    pdfView="none"
                  />
                  <!-- Termina DataExporter -->
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="searchRep"
                    append-icon="mdi-magnify"
                    class="ml-auto"
                    label="Búsqueda"
                    hide-details
                    single-line
                    style="max-width: 250px"
                  />
                </v-col>
              </v-row>

              <v-divider class="mt-3" />

              <v-data-table
                :headers="headersRep"
                :items="gpoenvpago"
                dense
                :search.sync="searchRep"
                :loading="isLoading"
                loading-text="Cargando... Espere por favor"
                class="elevation-5"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="printItem(item, 'TESORERIA')">mdi-printer</v-icon>
                </template>

                <template v-slot:[`item.FechaEnviaPago`]="{ item }">
                  <div class="name-info-title">
                    {{ convierteNumeroFecha(item.FechaEnviaPago) }}
                  </div>
                </template>
                <template v-slot:item.totalGrupo="{ item }">
                  {{ formatPrice(item.totalGrupo) }}
                </template>

                <template v-slot:no-data>
                  <!-- <v-btn color="primary">Reset</v-btn> -->
                  ¡No hay datos para mostrar!
                </template>
              </v-data-table>
            </v-card>
          </base-material-card>
        </v-tab-item>
        <!-- CONTENIDO: REIMPRESION ENVIADAS A CONTROL PRESUPUESTAL -->
        <v-tab-item>
          <!-- icono -->
          <base-material-card color="blue" icon="mdi-printer" inline class="px-5 py-3">
            <v-card flat>
              <v-row>
                <v-col cols="6">
                  <!-- Empieza DataExporter -->
                  <DataExporter
                    :dataArray="gpoenvpresgxcExportar"
                    :dataFields="fields"
                    fileName="enviarGxc"
                    pdfView="none"
                  />
                  <!-- Termina DataExporter -->
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="searchRepgxc"
                    append-icon="mdi-magnify"
                    class="ml-auto"
                    label="Búsqueda"
                    hide-details
                    single-line
                    style="max-width: 250px"
                  />
                </v-col>
              </v-row>

              <v-divider class="mt-3" />

              <v-data-table
                :headers="headersRepgxc"
                :items="gpoenvpresgxc"
                dense
                :search.sync="searchRepgxc"
                :loading="isLoading"
                loading-text="Cargando... Espere por favor"
                class="elevation-5"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="printItem(item, 'GASTOSXC')">mdi-printer</v-icon>
                </template>

                <template v-slot:[`item.FechaEnviaPresuGxC`]="{ item }">
                  <div class="name-info-title">
                    {{ convierteNumeroFecha(item.FechaEnviaPresuGxC) }}
                  </div>
                </template>
                <template v-slot:item.totalGrupo="{ item }">
                  {{ formatPrice(item.totalGrupo) }}
                </template>

                <template v-slot:no-data>
                  <!-- <v-btn color="primary">Reset</v-btn> -->
                  ¡No hay datos para mostrar!
                </template>
              </v-data-table>
            </v-card>
          </base-material-card>
        </v-tab-item>
      </v-tabs>
    </v-tab-item>
    <!-- FOLIOS AUTORIZADAS -->
    <v-tab-item>
      <base-material-card
        color="blue"
        icon="mdi-clipboard-arrow-right-outline"
        inline
        class="px-5 py-3"
      >
        <template v-slot:corner-button>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="ejercicioAut"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeAut"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </template>
        <v-card flat>
          <v-row>
            <v-col cols="6">
              <!-- Empieza DataExporter -->
              <DataExporter
                :dataArray="solpagosautExportar"
                :dataFields="fieldsAutorizados"
                fileName="foliosAut"
                pdfView="none"
              />
              <!-- Termina DataExporter -->
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="searchAut"
                append-icon="mdi-magnify"
                class="ml-auto"
                label="Búsqueda"
                hide-details
                single-line
                style="max-width: 250px"
              />
            </v-col>
          </v-row>

          <v-divider class="mt-3" />
          <v-data-table
            :headers="headersAut"
            :items="solpagosaut"
            dense
            :search.sync="searchAut"
            :loading="isLoading"
            loading-text="Cargando... Espere por favor"
            class="elevation-5"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>

            <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
              <div class="name-info-title">{{ convierteNumeroFecha(item.sp_fecha_solicitud) }}</div>
            </template>
            <template v-slot:item.sp_importe="{ item }">
              {{ formatPrice(item.sp_importe) }}
            </template>

            <template v-slot:no-data>
              <!-- <v-btn color="primary">Reset</v-btn> -->
              ¡No hay datos para mostrar!
            </template>
          </v-data-table>
        </v-card>
      </base-material-card>
    </v-tab-item>
  </v-tabs>
</template>
<script>
//import DataExporter from '@/components/general/DataExporter.vue'
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { imprimeGrupo } from '@/store/modules/impresiones.store.js'
import DataExporter from '@/components/general/DataExporter.vue'
import * as tools from '@/store/modules/tools.store.js'

export default {
  components: {
    ConfirmationDialog,
    DataExporter,
  },
  data: () => ({
    eFormatos: tools.formatos,
    usuario: JSON.parse(localStorage.getItem('user')),
    //REIMPRESIONES
    //Grupo envia a Pagos
    gpoenvpago: [],
    gpoenvpagoExportar: [],
    gpoenvpresgxcExportar: [],
    searchRep: undefined,
    headersRep: [
      { text: 'Grupo', align: 'start', value: 'idGrupo' },
      { text: 'Fecha', value: 'FechaEnviaPago' },
      { text: 'Usuario', value: 'UserEnviaPago' },
      { text: 'Nombre', value: 'nombreEnviaFirmaAutoriza' },
      { text: '# Solicitudes', value: 'numelementos' },
      { text: 'Importe Grupo', value: 'totalGrupo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //Grupo envia a Control Presupuestal Gastos x Comprobar
    gpoenvpresgxc: [],
    searchRepgxc: undefined,
    headersRepgxc: [
      { text: 'Grupo', align: 'start', value: 'idGrupo' },
      { text: 'Fecha', value: 'FechaEnviaPresuGxC' },
      { text: 'Usuario', value: 'UserEnviaPresuGxC' },
      { text: 'Nombre', value: 'NombreEnviaPresuGxC' },
      { text: '# Solicitudes', value: 'numelementos' },
      { text: 'Importe Grupo', value: 'totalGrupo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    ejercicioEnvAut: 0,
    ejercicioAut: 0,
    ejercicios: [],

    //seleccionar
    singleSelect: false,
    gastosxcomp: ['23', '24', '81'],
    selected: [],
    solpagos: [],
    solpagosExportar: [],
    //solpagosfir: [],
    //Folios Autorizados
    searchAut: undefined,
    solpagosaut: [],
    solpagosautExportar: [],
    headersAut: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      { text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Dirección', value: 'direccion_sol' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: 'Concepto', value: 'nom_concepto' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Estatus', value: 'estatus_nombre' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //
    search: undefined,
    //search2: undefined,
    //search3: undefined,
    isLoading: false,
    checkbox: false,
    isEditing: false,
    dialog: false,
    dialogxc: false,
    isSure: false,
    overlay: false,
    changed: false,
    error: '',
    sgteGpoPago: 0,
    sgteGpoGastoComp: 0,
    //GpoFirmaSol: [],
    headers: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      { text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Dirección', value: 'direccion_sol' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: 'Concepto', value: 'nom_concepto' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    value: [],
    tipos: [],
    clastipos: [],
    editedIndex: -1,
    editedItem: {
      sp_motivo_cancelacion: '',
    },
    defaultItem: {
      tipo_id: 0,
      tipo_descripcion: '',
      clatip_id: 0,
      tipo_activo: true,
      sp_motivo_cancelacion: '',
    },
    //Para Exportar
    fieldsEnvAut: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Solicitante: 'nombre_sol',
      Direccion: 'direccion_sol',
      Fecha_Solicita: 'sp_fecha_solicitud',
      nom_concepto: 'nom_concepto',
      Proveedor: 'sp_pago_nombre_de',
      //estatus_nombre: 'estatus_nombre',
      Importe: 'sp_importe',
    },
    fieldsGpoEnvPag: {
      Grupo: 'idGrupo',
      Fecha: 'FechaEnviaPago',
      Usuario: 'UserEnviaPago',
      Nombre: 'nombreEnviaFirmaAutoriza',
      Importe: 'totalGrupo',
    },
    fieldsGpoEnvGxc: {
      Grupo: 'idGrupo',
      Fecha: 'FechaEnviaPresuGxC',
      Usuario: 'UserEnviaPresuGxC',
      Nombre: 'NombreEnviaPresuGxC',
      Importe: 'totalGrupo',
    },
    fieldsAutorizados: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Solicitante: 'nombre_sol',
      Direccion: 'direccion_sol',
      Fecha_Solicita: 'sp_fecha_solicitud',
      nom_concepto: 'nom_concepto',
      Proveedor: 'sp_pago_nombre_de',
      estatus_nombre: 'estatus_nombre',
      Importe: 'sp_importe',
    },
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      sp_motivo_cancelacion: { required, minLength: minLength(10), maxLength: maxLength(100) },
      //id_tipo: { required, minLength: minLength(3), maxLength: maxLength(255) },
      //reten_nombre: { required, minLength: minLength(3), maxLength: maxLength(100) },
    },
  },
  computed: {
    sp_motivo_cancelacionErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_motivo_cancelacion.$dirty) return errors
      !this.$v.editedItem.sp_motivo_cancelacion.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.sp_motivo_cancelacion.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.sp_motivo_cancelacion.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
  },
  created() {
    this.iniciando()
  },
  methods: {
    //Refresca Datos para la tabla
    async iniciando() {
      let jwt = await getValidToken(this)

      await this.obtenerGruposEnvPago(jwt)
      await this.obtenerGruposEnvPreGxc(jwt)

      await this.obtenerEjercicios(jwt)

      console.log('this.ejercicioEnvAut ' + this.ejercicioEnvAut)
      if (this.ejercicioEnvAut == undefined || this.ejercicioEnvAut == 0) {
        this.ejercicioEnvAut = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosFirAut(jwt, this.ejercicioEnvAut)

      if (this.ejercicioAut == undefined || this.ejercicioAut == 0) {
        this.ejercicioAut = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosAut(jwt, this.ejercicioAut)
    },

    async refrescaEnvia() {
      let jwt = await getValidToken(this)
      await this.obtenerEjercicios(jwt)
      if (this.ejercicioEnvAut == undefined || this.ejercicioEnvAut == 0) {
        this.ejercicioEnvAut = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosFirAut(jwt, this.ejercicioEnvAut)
    },
    async refrescaReimprime() {
      let jwt = await getValidToken(this)
      await this.obtenerGruposEnvPago(jwt)
      await this.obtenerGruposEnvPreGxc(jwt)
    },
    async refrescaAutorizados() {
      let jwt = await getValidToken(this)
      await this.obtenerEjercicios(jwt)
      if (this.ejercicioAut == undefined || this.ejercicioAut == 0) {
        this.ejercicioAut = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosAut(jwt, this.ejercicioAut)

      //await this.obtenerSolPagosAut(jwt)
    },
    async obtenerEjercicios(jwt) {
      //this.isLoading = true
      let params = null

      //params = 'solicitud_pagos/sp_ejercicio/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.ejercicios = []
        await this.$store
          .dispatch('consulta/fetchGetEjercicios', payload)
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
    //Obtener todos los folios autorizados
    async obtenerSolPagosAut(jwt, ejercicio) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params =
        '(sp_id_gpo_firma_aut_vuelta > 0 or sp_id_gpo_firma_aut_vuelta_gxc > 0) and sp_ejercicio = ' +
        ejercicio +
        ' /sp_id/'

      if (jwt != null) {
        this.solpagosaut = []
        let payload = { jwt: jwt, params: params }
        this.solpagosaut = []
        await this.$store
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagosaut = response.data
              this.formateoInfoExportar('AUTORIZADOS')
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
    //Obtiene todos los grupos enviados a Pagos
    async obtenerGruposEnvPreGxc(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params = 'sp_id_gpo_firma_aut_vuelta_gxc > 0/sp_id_gpo_firma_aut_vuelta_gxc/'

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoenvpresgxc = []
        await this.$store
          .dispatch('consulta/fetchGetGpoEnvPresGxc', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoenvpresgxc = response.data
              this.formateoInfoExportar('REIMPRIME_GASCOM')
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
    //Obtiene todos los grupos enviados a Pagos
    async obtenerGruposEnvPago(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params = 'sp_id_gpo_firma_aut_vuelta > 0/sp_id_gpo_firma_aut_vuelta/'

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoenvpago = []
        await this.$store
          .dispatch('consulta/fetchGetGpoEnvPago', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoenvpago = response.data
              //this.formateoInfoExportar('FOLIOS_AUTORIZADS')
              this.formateoInfoExportar('REIMPRIME_AUTFINVTA')
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
    //Obtiene todos los Solicitudes de Pago para la tabla
    async obtenerSolPagosFirAut(jwt, ejercicio) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=sp_estatus&tipo1=igual&valor1=AUTFIR&logico2=and&campo2=sp_ejercicio&tipo2=igual&valor2=' +
        ejercicio

      console.log('obtenerSolPagosFirAut()')
      console.log('params', params)
      if (jwt != null) {
        this.solpagos = []
        this.selected = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('solpago/fetchSolPagosCreado', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagos = response.data
              this.formateoInfoExportar('AUTORIZA')
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
    //formato de importe
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(',', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    //formato de fecha
    convierteNumeroFecha(date) {
      const cadena = date.toString()
      //let year = cadena.slice(0, 4)
      let year = cadena.slice(2, 4)
      let month = cadena.slice(5, 7)
      let day = cadena.slice(8, 10)

      //const fecha = year + '-' + month + '-' + day
      const fecha = day + '-' + month + '-' + year

      return fecha
    },
    //Enviar solicitud a Contabilidad y/o Presupuesto
    async enviarsol() {
      //Enviar las solicitudes de pago a solicitud de firma de solicitante
      if (this.selected.length > 0) {
        //obtener el sp_id_gpo_firma_sol
        let jwt = await getValidToken(this)

        let sp_id = 0
        let sp_ejercicio = 0
        let body = {}
        let payload = {}
        for (var i in this.selected) {
          sp_id = this.selected[i].sp_id
          sp_ejercicio = this.selected[i].sp_ejercicio
          if (this.gastosxcomp.indexOf(this.selected[i].sp_concepto) >= 0) {
            // verificar si tiene gastos x comprobar
            if (this.sgteGpoGastoComp == 0) {
              await this.obtenerIdGrupoGastos(jwt)
            }
            //console.log('sgteGpoGastoComp: ' + this.sgteGpoGastoComp)
            if (this.sgteGpoGastoComp > 0) {
              body = {
                sp_id_gpo_firma_aut_vuelta_gxc: this.sgteGpoGastoComp,
                sp_estatus: 'GASCOM',
              }
              payload = { jwt: jwt, body: body }
              payload.id = sp_id
              payload.ejercicio = sp_ejercicio
              await this.$store
                .dispatch('solpago/addGpoGasto', payload)
                .then(() => {
                  this.error = ''
                })
                .catch((err) => {
                  this.error = err
                })
            }
          } else {
            //enviar a pago
            if (this.sgteGpoPago == 0) {
              await this.obtenerIdGrupoPago(jwt)
            }
            //console.log('sgteGpoPago: ' + this.sgteGpoPago)
            if (this.sgteGpoPago > 0) {
              body = {
                sp_id_gpo_firma_aut_vuelta: this.sgteGpoPago,
                //sp_estatus: 'PAGOS',
                sp_estatus: 'AUTFIRVTA',
              }
              payload = { jwt: jwt, body: body }
              payload.id = sp_id
              payload.ejercicio = sp_ejercicio
              await this.$store
                .dispatch('solpago/addGpoPago', payload)
                .then(() => {
                  this.error = ''
                })
                .catch((err) => {
                  this.error = err
                })
            }
          }
        }
        if (this.error == '') {
          if (this.sgteGpoPago > 0) {
            imprimeGrupo(this.sgteGpoPago, 'TESORERIA', this)
          }
          if (this.sgteGpoGastoComp > 0) {
            imprimeGrupo(this.sgteGpoGastoComp, 'GASTOSXC', this)
          }
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'Registros enviados correctamente',
          })
          //imprimir
        } else {
          this.$store.commit('ALERT', {
            color: 'error',
            text: this.error,
          })
        }
        await this.refrescaEnvia()
      }

      //console.log('imprimeRecibo')
    },
    //Obtiene todos los Solicitudes de Pago para la tabla
    async obtenerIdGrupoPago(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.sgteGpoPago = 0
        await this.$store
          .dispatch('solpago/fetchSgteGpoPago', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.sgteGpoPago = response.data[0].sgteGpoPagos
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
    //Obtiene todos los Solicitudes de Pago para la tabla
    async obtenerIdGrupoGastos(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.sgteGpoGastoComp = 0
        await this.$store
          .dispatch('solpago/fetchSgteGpoGasto', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.sgteGpoGastoComp = response.data[0].sgteGpoGastosxComp
              this.formateoInfoExportar('REIMPRIME_GASCOM')
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
    // x Cancelar
    deleteItem(item) {
      this.isEditing = true
      this.editedIndex = this.solpagos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.rec_estatus = 'CAN'
      this.dialogxc = true
    },
    //Borrar en BD es desActivar
    async Borrar() {
      this.overlay = true
      this.$v.$touch()

      let body = {
        //_id: this.editedItem.id_tipo,
        sp_motivo_por_cancelar: this.editedItem.sp_motivo_cancelacion,
        sp_estatus: 'XCANCELAR',
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = this.editedItem.sp_id
      //payload.estatus = this.editedItem.sp_estatus
      payload.ejercicio = this.editedItem.sp_ejercicio
      await this.$store
        .dispatch('solpago/addxCancelar', payload)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se cancelo satisfactoriamente',
          })
          this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
            // Enviar a inicio de sesión
          })
          this.overlay = false
        })
      //Object.assign(this.solpagos[this.editedIndex], this.editedItem)
      this.close(this.checkbox)
      this.changed = false
      this.iniciando()
    },
    // Revisar los cambios en el formulario
    checkChanges() {
      if (this.changed) {
        this.isSure = true
      } else {
        this.close(false)
        this.changed = false
      }
    },
    //cancelar dialogo
    cancel(isSure) {
      this.isSure = isSure
      if (this.isSure) {
        this.close(false)
        this.changed = false
      }
    },

    // Cerrar el formulario
    close(checkbox) {
      this.isSure = false
      this.checkbox = checkbox
      if (!this.checkbox) {
        this.dialog = false
        this.dialogxc = false
        this.isEditing = false
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$v.$reset()
    },
    //Imprimir
    printItem(item, opcion) {
      this.editedItem = Object.assign({}, item)
      imprimeGrupo(this.editedItem.idGrupo, opcion, this)
    },
    //Para Exportar
    formateoInfoExportar(opcion) {
      var i
      if (opcion == 'AUTORIZA') {
        if (this.solpagos.length > 0) {
          this.solpagosExportar = []
          for (i in this.solpagos) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagos[i].sp_ejercicio,
              sp_id: this.solpagos[i].sp_id,
              nombre_sol: this.solpagos[i].nombre_sol,
              direccion_sol: this.solpagos[i].direccion_sol,
              sp_fecha_solicitud: this.formato(
                this.eFormatos.FECHA,
                this.solpagos[i].sp_fecha_solicitud
              ),
              nom_concepto: this.solpagos[i].nom_concepto,
              sp_pago_nombre_de: this.solpagos[i].sp_pago_nombre_de,
              //estatus_nombre: this.solpagos[i].estatus_nombre,
              //
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagos[i].sp_importe),
            }
            this.solpagosExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'REIMPRIME_AUTFINVTA') {
        //console.log(opcion)
        if (this.gpoenvpago.length > 0) {
          this.gpoenvpagoExportar = []
          for (i in this.gpoenvpago) {
            let fieldsPagos = {
              idGrupo: this.gpoenvpago[i].idGrupo,
              FechaEnviaPago: this.formato(this.eFormatos.FECHA, this.gpoenvpago[i].FechaEnviaPago),

              UserEnviaPago: this.gpoenvpago[i].UserEnviaPago,
              nombreEnviaFirmaAutoriza: this.gpoenvpago[i].nombreEnviaFirmaAutoriza,

              totalGrupo: this.formato(this.eFormatos.MONEDA, this.gpoenvpago[i].totalGrupo),
            }
            this.gpoenvpagoExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'REIMPRIME_GASCOM') {
        if (this.gpoenvpresgxc.length > 0) {
          this.gpoenvpresgxcExportar = []
          for (i in this.gpoenvpresgxc) {
            let fieldsPagos = {
              idGrupo: this.gpoenvpresgxc[i].idGrupo,
              FechaEnviaPresuGxC: this.formato(
                this.eFormatos.FECHA,
                this.gpoenvpresgxc[i].FechaEnviaPresuGxC
              ),

              UserEnviaPresuGxC: this.gpoenvpresgxc[i].UserEnviaPresuGxC,
              NombreEnviaPresuGxC: this.gpoenvpresgxc[i].NombreEnviaPresuGxC,

              totalGrupo: this.formato(this.eFormatos.MONEDA, this.gpoenvpresgxc[i].totalGrupo),
            }
            this.gpoenvpresgxcExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'AUTORIZADOS') {
        if (this.solpagosaut.length > 0) {
          this.solpagosautExportar = []
          for (i in this.solpagosaut) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagosaut[i].sp_ejercicio,
              sp_id: this.solpagosaut[i].sp_id,
              nombre_sol: this.solpagosaut[i].nombre_sol,
              direccion_sol: this.solpagosaut[i].direccion_sol,
              sp_fecha_solicitud: this.formato(
                this.eFormatos.FECHA,
                this.solpagosaut[i].sp_fecha_solicitud
              ),
              nom_concepto: this.solpagosaut[i].nom_concepto,
              sp_pago_nombre_de: this.solpagosaut[i].sp_pago_nombre_de,
              estatus_nombre: this.solpagosaut[i].estatus_nombre,

              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagosaut[i].sp_importe),
            }
            this.solpagosautExportar.push(fieldsPagos)
          }
        }
      }
    },
    async onChangeEnvAut(value) {
      let jwt = await getValidToken(this)
      this.ejercicioEnvAut = value.sp_ejercicio
      await this.obtenerSolPagosFirAut(jwt, value.sp_ejercicio)
    },
    async onChangeAut(value) {
      let jwt = await getValidToken(this)
      this.ejercicioAut = value.sp_ejercicio
      await this.obtenerSolPagosAut(jwt, value.sp_ejercicio)
    },

    formato(opcion, valor) {
      if (opcion == this.eFormatos.IMPORTE) {
        return tools.formatoImporte(valor)
      } else if (opcion == this.eFormatos.MONEDA) {
        return tools.formatoMoneda(valor)
      } else if (opcion == this.eFormatos.FECHA) {
        return tools.convierteNumeroFechaVista(valor)
      }
    },
  },
}
</script>
