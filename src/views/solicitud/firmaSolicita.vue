<template>
  <v-tabs fixed-tabs background-color="indigo" dark>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab @change="refreshEnviaFirma">
      <v-icon left> mdi-clipboard-arrow-right-outline </v-icon>Enviar a Firma
    </v-tab>
    <v-tab @change="refreshReciveFirma">
      <v-icon right> mdi-clipboard-arrow-left-outline </v-icon>Recibir de Firma
    </v-tab>
    <v-tab @change="refreshEnviaAutoriza">
      <v-icon left> mdi-clipboard-arrow-right-outline </v-icon>Enviar a Autoriza
    </v-tab>
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
                <v-text-field
                  v-model="editedItem.sp_folio_cancela"
                  label="Folio de cancelacion"
                  dense
                  @input="$v.editedItem.sp_folio_cancela.$reset(), (changed = true)"
                  @blur="$v.editedItem.sp_folio_cancela.$touch()"
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
    <!-- CONTENIDO DE CADA TAB -->
    <!-- Enviar a FIRMA -->
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
                v-model="ejercicioEnvFir"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioEnvFir"
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
                :dataFields="fieldsEnvFir"
                fileName="enviarFirma"
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
          <!-- <ConfirmationDialog v-model="isSure" @click="cancel" /> -->

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
            <!--             <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
 -->
            <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
              <div class="name-info-title">
                {{ convierteNumeroFechaVista(item.sp_fecha_solicitud) }}
              </div>
            </template>

            <template v-slot:item.sp_importe="{ item }">
              {{ formatPrice(item.sp_importe) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>

            <template v-slot:no-data>
              <!-- <v-btn color="primary">Reset</v-btn> -->
              ¡No hay datos para mostrar!
            </template>
          </v-data-table>
        </v-card>
      </base-material-card>
    </v-tab-item>
    <!-- RECIBIR DE FIRMA -->
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
                :disabled="selectedRecibe.length == 0"
                text
                @click="recibirsol"
                >Recibir</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="ejercicioRecFir"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioRecFir"
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
                :dataArray="solpagosfirExportar"
                :dataFields="fieldsRecFir"
                fileName="recibeFirma"
                pdfView="none"
              />
              <!-- Termina DataExporter -->
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="search2"
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
          <!-- <ConfirmationDialog v-model="isSure" @click="cancel" /> -->

          <v-divider class="mt-3" />
          <v-data-table
            :headers="headers2"
            :items="solpagosfir"
            :single-select="singleSelect"
            item-key="sp_id"
            show-select
            v-model="selectedRecibe"
            dense
            :search.sync="search2"
            :loading="isLoading"
            loading-text="Cargando... Espere por favor"
            class="elevation-5"
            disable-pagination
            hide-default-footer
          >
            <!--  <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template> -->

            <template v-slot:[`item.sp_fecha_firma_sol_ida`]="{ item }">
              <div class="name-info-title">
                {{ convierteNumeroFechaVista(item.sp_fecha_firma_sol_ida) }}
              </div>
            </template>
            <template v-slot:item.sp_importe="{ item }">
              {{ formatPrice(item.sp_importe) }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>

            <template v-slot:no-data>
              <!-- <v-btn color="primary">Reset</v-btn> -->
              ¡No hay datos para mostrar!
            </template>
          </v-data-table>
        </v-card>
      </base-material-card>
    </v-tab-item>
    <!-- ENVIAR A AUTORIZACION -->
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
                :disabled="selectedAut.length == 0"
                text
                @click="enviaraut"
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
                @change="onChangeEjercicioEnvAut"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>

          <!--  <v-btn
            small
            class="ma-2"
            elevation="2"
            color="blue"
            text
            @click="imprimeFormato(2, 'AUTORIZACION')"
            >Imprimir</v-btn
          > -->
        </template>

        <v-card flat>
          <v-row>
            <v-col cols="6">
              <!-- Empieza DataExporter -->
              <DataExporter
                :dataArray="solpagosautExportar"
                :dataFields="fieldsEnvAut"
                fileName="enviaAutoriza"
                pdfView="none"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="search3"
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
            :headers="headers3"
            :items="solpagosaut"
            :single-select="singleSelect"
            item-key="sp_id"
            show-select
            v-model="selectedAut"
            dense
            :search.sync="search3"
            :loading="isLoading"
            loading-text="Cargando... Espere por favor"
            class="elevation-5"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:[`item.sp_fecha_firma_sol_vuelta`]="{ item }">
              <div class="name-info-title">
                {{ convierteNumeroFechaVista(item.sp_fecha_firma_sol_vuelta) }}
              </div>
            </template>
            <template v-slot:item.sp_importe="{ item }">
              {{ formatPrice(item.sp_importe) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
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
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
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
    singleSelect: false,
    selected: [],
    selectedRecibe: [],
    selectedAut: [],
    //selectedConta: [],
    solpagos: [],
    solpagosExportar: [],
    solpagosfir: [],
    solpagosfirExportar: [],
    solpagosaut: [],
    solpagosautExportar: [],
    ejercicioEnvFir: 0,
    ejercicioRecFir: 0,
    ejercicioEnvAut: 0,
    ejercicios: [],
    //solpagosconta: [],
    search: undefined,
    search2: undefined,
    search3: undefined,
    //search4: undefined,
    isLoading: false,
    checkbox: false,
    isEditing: false,
    dialog: false,
    dialogxc: false,
    isSure: false,
    overlay: false,
    changed: false,
    error: '',
    sgteGpoFirmaSol: 0,
    sgteGpoFirmaAut: 0,
    //sgteGpoEntConta: 0,
    //Impresiones
    //solpagosimp: [],
    //GpoFirmaSol: [],
    headers: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      //{ text: 'Cuenta', value: 'cta_clave' },
      { text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Dirección', value: 'direccion_sol' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      //{ text: 'Fecha Solicitud', value: 'fechasol' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headers2: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      //{ text: 'Cuenta', value: 'cta_clave' },
      { text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Concepto', value: 'nom_concepto' },
      { text: 'Fecha Envio a Firma', value: 'sp_fecha_firma_sol_ida' },
      //{ text: 'Fecha Solicitud', value: 'fechasol' },

      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ], //
    headers3: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      //{ text: 'Cuenta', value: 'cta_clave' },
      { text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Concepto', value: 'nom_concepto' },
      { text: 'Recibida de solicitante', value: 'sp_fecha_firma_sol_vuelta' },
      //{ text: 'Fecha Solicitud', value: 'fechasol' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ], //
    value: [],
    tipos: [],
    clastipos: [],
    editedIndex: -1,
    editedItem: {
      tipo_id: 0,
      tipo_descripcion: '',
      clatip_id: 0,
      tipo_activo: true,
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
    fieldsEnvFir: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Solicitante: 'nombre_sol',
      Direccion: 'direccion_sol',
      Fecha_Solicita: 'sp_fecha_solicitud',
      Proveedor: 'sp_pago_nombre_de',
      Importe: 'sp_importe',
    },
    fieldsRecFir: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Solicitante: 'nombre_sol',
      Concepto: 'nom_concepto',
      fecha_Solicitud_ida: 'sp_fecha_firma_sol_ida',
      Proveedor: 'sp_pago_nombre_de',
      Importe: 'sp_importe',
    },
    fieldsEnvAut: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Solicitante: 'nombre_sol',
      nom_concepto: 'nom_concepto',
      sp_fecha_firma_sol_vuelta: 'sp_fecha_firma_sol_vuelta',
      Proveedor: 'sp_pago_nombre_de',
      Importe: 'sp_importe',
    },
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      sp_motivo_cancelacion: { required, minLength: minLength(10), maxLength: maxLength(100) },
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
      await this.obtenerEjercicios(jwt)
      //console.log('this.ejercicioEnvFir ' + this.ejercicioEnvFir)
      if (this.ejercicioEnvFir == undefined || this.ejercicioEnvFir == 0) {
        this.ejercicioEnvFir = this.ejercicios[0].sp_ejercicio
      }

      await this.obtenerSolPagos(jwt, this.ejercicioEnvFir)

      if (this.ejercicioRecFir == undefined || this.ejercicioRecFir == 0) {
        this.ejercicioRecFir = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosFIRSOL(jwt, this.ejercicioRecFir)

      console.log('this.ejercicioEnvAut ' + this.ejercicioEnvAut)
      if (this.ejercicioEnvAut == undefined || this.ejercicioEnvAut == 0) {
        this.ejercicioEnvAut = this.ejercicios[0].sp_ejercicio
      }

      await this.obtenerSolPagosFirAut(jwt, this.ejercicioEnvAut)
    },
    async refreshEnviaFirma() {
      let jwt = await getValidToken(this)
      await this.obtenerEjercicios(jwt)
      console.log('this.ejercicioEnvFir ' + this.ejercicioEnvFir)
      if (this.ejercicioEnvFir == undefined || this.ejercicioEnvFir == 0) {
        this.ejercicioEnvFir = this.ejercicios[0].sp_ejercicio
      }

      await this.obtenerSolPagos(jwt, this.ejercicioEnvFir)
    },
    async refreshReciveFirma() {
      let jwt = await getValidToken(this)
      await this.obtenerEjercicios(jwt)
      if (this.ejercicioRecFir == undefined || this.ejercicioRecFir == 0) {
        this.ejercicioRecFir = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosFIRSOL(jwt, this.ejercicioRecFir)

      //await this.obtenerSolPagosFIRSOL(jwt)
    },
    async refreshEnviaAutoriza() {
      let jwt = await getValidToken(this)
      await this.obtenerEjercicios(jwt)
      console.log('this.ejercicioEnvAut ' + this.ejercicioEnvAut)
      if (this.ejercicioEnvAut == undefined || this.ejercicioEnvAut == 0) {
        this.ejercicioEnvAut = this.ejercicios[0].sp_ejercicio
      }

      await this.obtenerSolPagosFirAut(jwt, this.ejercicioEnvAut)
      //await this.obtenerSolPagosFirAut(jwt)
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
    //Obtiene todos los Solicitudes de Pago para la tabla
    async obtenerSolPagos(jwt, ejercicio) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      console.log('ejercicio' + ejercicio)
      params =
        'filtro?campo1=sp_estatus&tipo1=igual&valor1=CREADO&logico2=and&campo2=sp_ejercicio&tipo2=igual&valor2=' +
        ejercicio

      if (jwt != null) {
        this.solpagos = []
        this.selected = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('solpago/fetchSolPagosCreado', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagos = response.data
              this.formateoInfoExportar('ENVIA_FIRMA')
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
    //Obtiene todos los Solicitudes de Pago para la tabla
    async obtenerSolPagosFIRSOL(jwt, ejercicio) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=sp_estatus&tipo1=igual&valor1=SOLFIRIDA&logico2=and&campo2=sp_ejercicio&tipo2=igual&valor2=' +
        ejercicio

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpagosfir = []
        this.selectedRecibe = []
        await this.$store
          .dispatch('solpago/fetchSolPagosCreado', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagosfir = response.data
              this.formateoInfoExportar('RECIBE_FIRMA')
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
      console.log('ejercicio ' + ejercicio)
      this.isLoading = true
      let params = null
      /*       params =
        'filtro?campo1=sp_estatus&tipo1=igual&valor1=SOLFIRVTA&logico2=and&campo2=sp_ejercicio&tipo2=igual&valor2=' +
        ejercicio
 */
      params =
        'filtro?campo1=sp_estatus&tipo1=igual&valor1=SOLFIRVTA&logico2=and&campo2=sp_ejercicio&tipo2=igual&valor2=' +
        ejercicio

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpagosaut = []
        this.selectedAut = []
        await this.$store
          .dispatch('solpago/fetchSolPagosCreado', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagosaut = response.data
              this.formateoInfoExportar('ENVIA_AUTORIZA')
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
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(',', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    convierteNumeroFecha(date) {
      const cadena = date.toString()
      let year = cadena.slice(0, 4)
      let month = cadena.slice(5, 7)
      let day = cadena.slice(8, 10)

      const fecha = year + '-' + month + '-' + day

      return fecha
    },

    convierteNumeroFechaVista(date) {
      const cadena = date.toString()
      let year = cadena.slice(2, 4)
      let month = cadena.slice(5, 7)
      let day = cadena.slice(8, 10)

      //const fecha = year + '-' + month + '-' + day
      const fecha = day + '-' + month + '-' + year

      return fecha
    },

    async enviarsol() {
      //Enviar las solicitudes de pago a solicitud de firma de solicitante
      if (this.selected.length > 0) {
        let jwt = await getValidToken(this)
        await this.obtenerIdGrupoSolFirma(jwt)
        if (this.sgteGpoFirmaSol > 0) {
          let sp_id = 0
          let ejercicio = 0
          for (var i in this.selected) {
            sp_id = this.selected[i].sp_id
            ejercicio = this.selected[i].sp_ejercicio
            let body = {
              sp_id_gpo_firma_sol: this.sgteGpoFirmaSol,
              sp_estatus: 'SOLFIRIDA',
            }
            let payload = { jwt: jwt, body: body }
            payload.id = sp_id
            payload.ejercicio = ejercicio
            await this.$store
              .dispatch('solpago/addGpoSolIda', payload)
              .then(() => {
                this.error = ''
              })
              .catch((err) => {
                this.error = err
              })
          }
          if (this.error == '') {
            this.$store.commit('ALERT', {
              color: 'success',
              text:
                'Se envio correctamente a firma de solicitante en el grupo: ' +
                this.sgteGpoFirmaSol,
            })
          } else {
            this.$store.commit('ALERT', {
              color: 'error',
              text: this.error,
            })
          }
          await this.refreshEnviaFirma()
        }
      }
    },
    //Obtiene todos los Solicitudes de Pago para la tabla
    async obtenerIdGrupoSolFirma(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.sgteGpoFirmaSol = 0
        await this.$store
          .dispatch('solpago/fetchSgteGpoFirmaSol', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.sgteGpoFirmaSol = response.data[0].sgteGpoFirmaSol
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

    async recibirsol() {
      //Enviar las solicitudes de pago a solicitud de firma de solicitante
      if (this.selectedRecibe.length > 0) {
        //obtener el sp_id_gpo_firma_sol
        let jwt = await getValidToken(this)
        let sp_id = 0
        let sp_ejercicio = 0
        for (var i in this.selectedRecibe) {
          sp_id = this.selectedRecibe[i].sp_id
          sp_ejercicio = this.selectedRecibe[i].sp_ejercicio
          let body = {
            //sp_id_gpo_firma_sol: this.sgteGpoFirmaSol,
            sp_estatus: 'SOLFIRVTA',
          }
          let payload = { jwt: jwt, body: body }
          payload.id = sp_id
          payload.ejercicio = sp_ejercicio
          await this.$store
            .dispatch('solpago/addGpoSolVta', payload)
            .then(() => {
              this.error = ''
            })
            .catch((err) => {
              this.error = err
            })
        }
        if (this.error == '') {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'Se recibio correctamente de firma de solicitante',
          })
        } else {
          this.$store.commit('ALERT', {
            color: 'error',
            //text: this.error.response.data.msg,
            text: this.error,
            // Enviar a inicio de sesión
          })
        }
        await this.refreshReciveFirma()
      }
    },

    //Obtiene todos los Solicitudes de Pago para la tabla
    async obtenerIdGrupoSolAutoriza(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.sgteGpoFirmaAut = 0
        await this.$store
          .dispatch('solpago/fetchSgteGpoFirmaAut', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.sgteGpoFirmaAut = response.data[0].sgteGpoFirmaAut
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

    async enviaraut() {
      //var sgteGpoFirmaSol
      //Enviar las solicitudes de pago a solicitud de firma de solicitante
      if (this.selectedAut.length > 0) {
        //obtener el sp_id_gpo_firma_Aut
        let jwt = await getValidToken(this)
        await this.obtenerIdGrupoSolAutoriza(jwt)
        if (this.sgteGpoFirmaAut > 0) {
          let sp_id = 0
          let sp_ejercicio
          for (var i in this.selectedAut) {
            sp_id = this.selectedAut[i].sp_id
            sp_ejercicio = this.selectedAut[i].sp_ejercicio
            let body = {
              sp_id_gpo_firma_aut_ida: this.sgteGpoFirmaAut,
              sp_estatus: 'AUTFIR',
            }
            let payload = { jwt: jwt, body: body }
            payload.id = sp_id
            payload.ejercicio = sp_ejercicio
            await this.$store
              .dispatch('solpago/addGpoAutIda', payload)
              .then(() => {
                this.error = ''
              })
              .catch((err) => {
                this.error = err
              })
          }
          if (this.error == '') {
            this.$store.commit('ALERT', {
              color: 'success',
              text:
                'Se envio correctamente a firma de autorización en el grupo: ' +
                this.sgteGpoFirmaAut,
            })
            //enviar a imprimir
            await imprimeGrupo(this.sgteGpoFirmaAut, 'AUTORIZACION', this)
          } else {
            this.$store.commit('ALERT', {
              color: 'error',
              //text: this.error.response.data.msg,
              text: this.error,
            })
          }

          //await this.obtenerSolPagosFirAut(jwt)
          await this.refreshEnviaAutoriza(jwt)
        }
      }
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
        sp_motivo_cancelacion: this.editedItem.sp_motivo_cancelacion,
        sp_folio_cancela: this.editedItem.sp_folio_cancela,
        sp_estatus: 'CANCELAR',
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = this.editedItem.sp_id
      payload.ejercicio = this.editedItem.sp_ejercicio
      //payload.estatus = this.editedItem.sp_estatus
      await this.$store
        .dispatch('solpago/addxCancelado', payload)
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
      await this.iniciando()
    },
    formateoInfoExportar(opcion) {
      var i
      if (opcion == 'ENVIA_FIRMA') {
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

              sp_pago_nombre_de: this.solpagos[i].sp_pago_nombre_de,

              //nom_concepto: this.solpagos[i].nom_concepto,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagos[i].sp_importe),
            }
            this.solpagosExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'RECIBE_FIRMA') {
        //console.log(opcion)
        if (this.solpagosfir.length > 0) {
          this.solpagosfirExportar = []
          for (i in this.solpagosfir) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagos[i].sp_ejercicio,
              sp_id: this.solpagosfir[i].sp_id,
              nombre_sol: this.solpagosfir[i].nombre_sol,
              nom_concepto: this.solpagosfir[i].nom_concepto,
              sp_fecha_firma_sol_ida: this.formato(
                this.eFormatos.FECHA,
                this.solpagosfir[i].sp_fecha_firma_sol_ida
              ),

              sp_pago_nombre_de: this.solpagosfir[i].sp_pago_nombre_de,

              //nom_concepto: this.solpagosfir[i].nom_concepto,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagosfir[i].sp_importe),
            }
            this.solpagosfirExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'ENVIA_AUTORIZA') {
        this.solpagosautExportar = []
        if (this.solpagosaut.length > 0) {
          for (i in this.solpagosaut) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagos[i].sp_ejercicio,
              sp_id: this.solpagosaut[i].sp_id,
              nombre_sol: this.solpagosaut[i].nombre_sol,
              nom_concepto: this.solpagosaut[i].nom_concepto,
              sp_fecha_firma_sol_vuelta: this.formato(
                this.eFormatos.FECHA,
                this.solpagosaut[i].sp_fecha_firma_sol_vuelta
              ),

              sp_pago_nombre_de: this.solpagosaut[i].sp_pago_nombre_de,

              //nom_concepto: this.solpagosaut[i].nom_concepto,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagosaut[i].sp_importe),
            }
            this.solpagosautExportar.push(fieldsPagos)
          }
        }
      }
    },
    async onChangeEjercicioEnvFir(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      this.ejercicioEnvFir = value.sp_ejercicio
      await this.obtenerSolPagos(jwt, value.sp_ejercicio)
    },
    async onChangeEjercicioRecFir(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      this.ejercicioRecFir = value.sp_ejercicio
      await this.obtenerSolPagosFIRSOL(jwt, value.sp_ejercicio)
    },

    async onChangeEjercicioEnvAut(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioEnvAut = value.sp_ejercicio
      await this.obtenerSolPagosFirAut(jwt, value.sp_ejercicio)
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
