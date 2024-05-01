<template>
  <v-dialog v-model="value" width="1220px" height="1020px" :persistent="true" :scrollable="false">
    <v-tabs v-model="tabs" fixed-tabs>
      <v-tabs-slider color="blue"></v-tabs-slider>
      <v-tab> <v-icon left> mdi-card-bulleted-outline</v-icon>Factura </v-tab>
      <v-tab> <v-icon right> mdi-format-list-bulleted-type </v-icon>Detalle Factura </v-tab>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <!--<base-material-card
                color="blue"
                icon="mdi-card-bulleted-outline"
                inline
                class="px-5 py-3"
              >-->
          <v-card class="px-5 py-3" inline>
            <v-card-title> {{ formTitle }} </v-card-title>
            <v-card-text class="px-5 py-3">
              <v-container>
                <v-file-input
                  v-if="!isEditing"
                  accept=".xml"
                  label="Cargar archivo XML"
                  class="mi-clase-personalizada"
                  variant="outlined"
                  @change="onFileSelected"
                  clearable
                  outlined
                  @clear="
                    clearData
                    fileInputValue = null
                  "
                  v-model="fileInputValue"
                ></v-file-input>
                <v-divider class="mt-3" />
                <!---ejercicio fuera del v-row campo oculto-->
                <v-col cols="1">
                  <v-select
                    v-model="editedItem.sp_ejercicio"
                    :items="ejercicios"
                    v-if="ocultarCampo"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Ejercicio*"
                    item-text="sp_ejercicio"
                    item-value="sp_ejercicio"
                    persistent-hint
                    dense
                    readonly
                    return-object
                    @change="onChangeEjercicioCap"
                    @blur="$v.editedItem.sp_ejercicio.$touch()"
                  >
                    <!-- @input="changed = true" -->
                  </v-select>
                </v-col>
                <v-row>
                  <v-col cols="2">
                    <v-text-field
                      v-model="xmlData.cabecero.Fecha"
                      label="Fecha*"
                      dense
                      readonly
                      required
                      :value="Fecha"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="xmlData.cabecero.Folio"
                      label="Folio*"
                      dense
                      readonly
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="xmlData.complemento.UUID"
                      label="UUID*"
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-text-field
                      v-model="xmlData.cabecero.Version"
                      label="Version*"
                      required
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="xmlData.complemento.FechaTimbrado"
                      label="FechaTimbrado"
                      required
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <!--   <v-col cols="2">
                          <v-text-field
                          v-model="xmlData.complemento.RfcProvCertif"
                          label="RfcProvCertif"
                          required
                          dense
                           
                          ></v-text-field>
                        </v-col>-->

                  <v-col cols="1" class="text-center">
                    <v-text-field
                      v-model="xmlData.cabecero.SubTotal"
                      label="SubTotal*"
                      dense
                      readonly
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1" class="text-center">
                    <v-text-field
                      v-model="xmlData.cabecero.Total"
                      dense
                      readonly
                      label="Total*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1" class="text-center">
                    <v-text-field
                      v-model="xmlData.cabecero.Moneda"
                      label="Moneda"
                      dense
                      readonly
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1" class="text-center">
                    <v-text-field
                      v-model="xmlData.cabecero.FormaPago"
                      label="Forma de pago"
                      dense
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2" class="text-center">
                    <v-text-field
                      v-model="xmlData.cabecero.MetodoPago"
                      label="MetodoPago*"
                      dense
                      readonly
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2" class="text-center">
                    <v-text-field
                      v-model="xmlData.cabecero.LugarExpedicion"
                      label="LugarExpedicion*"
                      dense
                      readonly
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      v-model="xmlData.hijos.emisor.Nombre"
                      label="Nombre Emisor*"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="xmlData.hijos.emisor.RegimenFiscal"
                      label="RegimenFiscal*"
                      required
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="xmlData.hijos.emisor.Rfc"
                      label="RFC Emisor*"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      v-model="xmlData.hijos.receptor.Nombre"
                      label="Nombre Receptor*"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-text-field
                      v-model="xmlData.hijos.receptor.RegimenFiscalReceptor"
                      label="RegimenFiscal Receptor*"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-text-field
                      v-model="xmlData.hijos.receptor.DomicilioFiscalReceptor"
                      label="DomicilioFiscalReceptor"
                      required
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="xmlData.hijos.receptor.Rfc"
                      label="RFC Receptor*"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-text-field
                      v-model="xmlData.hijos.receptor.UsoCFDI"
                      label="UsoCFDI*"
                      required
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-text-field
                      v-model="xmlData.cabecero.TipoDeComprobante"
                      label="TipoDeComprobante*"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-text-field
                      v-model="xmlData.cabecero.Exportacion"
                      label="Exportacion*"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-text-field
                      v-model="xmlData.cabecero.Serie"
                      label="Serie*"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      v-model="xmlData.cabecero.NoCertificado"
                      label="NoCertificado*"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="xmlData.cabecero.Total"
                      label="Total impuestos trasladados"
                      dense
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="xmlData.trasData1.Base"
                      label="Base"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="xmlData.trasData1.Impuesto"
                      label="Impuesto"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="xmlData.trasData1.TipoFactor"
                      label="TipoFactor"
                      required
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="xmlData.trasData1.TasaOCuota"
                      label="TasaOCuota"
                      dense
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="xmlData.trasData1.Importe"
                      label="Importe"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="xmlData.trasData2.Base2"
                      label="Base 2"
                      required
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="xmlData.trasData2.Importe2"
                      label="Impuesto 2"
                      required
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="xmlData.trasData2.TipoFactor2"
                      label="TipoFactor 2"
                      required
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="xmlData.trasData2.TasaOCuota2"
                      label="TasaOCuota 2"
                      required
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="xmlData.trasData2.Importe2"
                      label="Importe 2"
                      required
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" border="2px solid" text @click="closeModal">Cerrar</v-btn>
              <v-btn
                color="blue darken-1"
                border="2px solid"
                :disabled="isEditing || existeOrden"
                text
                @click="Guardar"
                >Guardar</v-btn
              >
              <!--<v-btn color="blue darken-1" border="2px solid" :disabled="isEditing || existeOrden" text @click="Guardar"
                      >Guardar</v-btn
                    >-->
            </v-card-actions>
          </v-card>
          <!--</base-material-card>-->
        </v-tab-item>
        <v-tab-item>
          <!--  <base-material-card
                color="blue"
                icon="mdi-card-bulleted-outline"
                inline
                class="px-5 py-3"
              >-->
          <v-card>
            <v-card-title> Detalle </v-card-title>

            <v-card-text class="">
              <v-container>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  class="ml-auto"
                  label="Búsqueda"
                  hide-details
                  single-line
                  style="max-width: 250px"
                />
                <v-data-table
                  :headers="headers"
                  :items="tableData"
                  :search.sync="search"
                  disable-pagination
                  hide-default-footer
                  style="margin-top: 20px"
                >
                  <template v-slot:[`item.Importe`]="{ item }">
                    {{ formato(eFormatos.MONEDA, item.Importe) }}
                  </template>
                  <template v-slot:[`item.ValorUnitario`]="{ item }">
                    {{ formato(eFormatos.MONEDA, item.ValorUnitario) }}
                  </template>
                  <template v-slot:[`item.Base`]="{ item }">
                    {{ formato(eFormatos.MONEDA, item.Base) }}
                  </template>
                  <template slot="body.append">
                    <tr class="Black--text">
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th>
                        <!--<h2 class="total">
                          Total:{{ formato(eFormatos.MONEDA, sumaCampoDet('Total')) }} 
                          {{ formato(eFormatos.MONEDA, totalFinal) }}
                        </h2>-->
                      </th>
                    </tr>
                  </template>
                </v-data-table>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" border="2px solid" text @click="closeModal">Cerrar</v-btn>
            </v-card-actions>
          </v-card>

          <!-- </base-material-card> -->
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
    <errorDialogo
      v-model="dialogoError"
      :title="titleSend"
      :descripcion="textSend"
      @click="cancel"
    />
  </v-dialog>
</template>

<script>
import { getValidToken } from '@/store/helpers.js'
import * as tools from '@/store/modules/tools.store.js'
import errorDialogo from '@/components/general/errorDialog.vue'
//import RecibeFactura from '@/views/sicas/recibeFactura.vue'
export default {
  name: 'CargarFactura',
  props: {
    // osTotalFact: Number,
    isEditing: Boolean,
    osNumDoc: Number,
    osTipoDoc: String,
    ejercicio: Number,
    UUID: String,
    montoDoc: Number,
    proveedor: String,
    osTotalFactura: Number,
    value: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 250,
    },
    height: {
      type: Number,
      default: 250,
    },
  },
  components: {
    errorDialogo,
  },
  data: () => ({
    usuario: JSON.parse(localStorage.getItem('user')),
    eFormatos: tools.formatos,
    editedIndex: -1,
    // isEditing: false,
    isLoading: false,
    dialogoError: false,
    textSend: '',
    titleSend: '',
    isSure: false,
    changed: false,
    overlay: false,
    hasClosedModal: false,
    existeOrden: true,
    existeFactura: false,
    editedItem: {
      sp_ejercicio: '',
    },
    xmlData: {
      cabecero: {
        Fecha: '',
        Folio: '',
        MetodoPago: '',
        Total: '',
        Version: '',
        Moneda: '',
      },
      hijos: {
        emisor: {
          Nombre: '',
          RegimenFiscal: '',
          Rfc: '',
        },
        receptor: {
          Nombre: '',
          RegimenFiscalReceptor: '',
          Rfc: '',
          UsoCFDI: '',
        },
      },
      complemento: {
        Version: '',
        UUID: '',
        FechaTimbrado: '',
        RfcProvCertif: '',
      },
      impuesto: {
        TotalImpuestosTrasladados: '',
      },
      trasData1: {
        Base: '',
      },
      trasData2: {
        Base: '',
      },
    },
    defaultItem: {
      complemento: {
        Version: '',
        UUID: '',
        FechaTimbrado: '',
        RfcProvCertif: '',
      },
    },
    ejercicios: [],
    conceptosData: [],
    trasladosData: [],
    arregloTrasData1: [],
    tableData: [],
    facturasPrincipal: [],
    facturasDetalle: [],
    headersPrincipal: [
      { text: 'Fecha', value: 'Fecha' },
      { text: 'Folio', value: 'Folio' },
      { text: 'UUID', value: 'UUID' },
      { text: 'Emisor', value: 'NombreEmisor' },
      { text: 'Receptor', value: 'NombreReceptor' },
      { text: 'Total', value: 'Total' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headers: [
      { text: 'Cantidad', value: 'Cantidad' },
      { text: 'ClaveProdServ', value: 'ClaveProdServ' },
      { text: 'Descripcion', value: 'Descripcion' },
      { text: 'Unidad', value: 'Unidad' },
      { text: 'ValorUnitario', value: 'ValorUnitario' },
      { text: 'Base', value: 'Base' },
      { text: 'Impuesto', value: 'Impuesto' },
      { text: 'TasaOCuota', value: 'TasaOCuota' },
      {
        text: 'ImporteImpuesto',
        value: typeof ImporteImpuesto !== 'undefined' ? 'ImporteImpuesto' : 'Importe',
      },
    ],
    fileLoaded: false,
    showModal: false,
    search: undefined,
    ocultarCampo: false,
    tabs: 0,
    fileInputValue: null,
    totalFinal: 0,
    totalResta: 0,
  }),
  watch: {
    value(newValue) {
      if (!newValue) {
        // Cuando cierra el diálogo, restablece isEditing a false
        this.isEditing = false
      }
    },
    fileInputValue(newValue) {
      if (!newValue) {
        this.clearData()
      }
    },
    /* UUID: function(newUUID) {
      this.xmlData.complemento.UUID = newUUID;
    },*/
    isEditing(newValue) {
      if (newValue) {
        //Se manada isEditing nuevamente
        // Si isEditing es true, ejecuta la función obtenerFacturasDet
        this.obtenerFacturas(this.UUID)
        this.obtenerFacturasDet(this.UUID)
      }
    },
  },
  async created() {
    this.Refresca()
    this.obtenerFacturas(this.UUID)
    this.obtenerFacturasDet(this.UUID)
  },

  methods: {
    async Refresca() {
      let jwt = await getValidToken(this)
      //await this.obtenerFacturas(jwt)
      await this.obtenerEjercicios(jwt)
      this.EjercicioValido()

      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerFacturas(jwt, this.ejercicio)
    },
    EjercicioValido() {
      // console.log(this.ejercicio)
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      if (this.ejercicio == 0) {
        var currentTime = new Date()
        this.ejercicio = currentTime.getFullYear()
      }
      this.editedItem.sp_ejercicio = this.ejercicio
    },
    closeModal() {
      this.$emit('input', false)
      this.clearData()
      this.isEditing = false
      this.fileInputValue = null
    },

    async obtenerEjercicios(jwt) {
      //this.isLoading = true
      let params = null
      //params = 'solicitud_pagos/sp_ejercicio/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.ejercicios = []
        await this.$store
          .dispatch('consulta/fetchGetEjerciciosFact', payload)
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
    async validaExisteFactura(UUID, osNumDoc, montoDoc, muestraMensaje = true) {
      //let existe = false
      let { resultadoFac } = await this.verificarFactura(UUID)
      if (UUID != '') {
        if (resultadoFac && osNumDoc > 0) {
          if (!muestraMensaje) {
            this.$store.commit('ALERT', {
              color: 'error',
              text: 'Error',
            })
          }
          // this.existeFactura = true
          //this.existeOrden = false
        } else if (resultadoFac) {
          /*   else  if (resultado  && saldoFac < this.montoDoc) {
          if (muestraMensaje) {
            this.$store.commit('ALERT', {
              color: 'error',
              text: 'Error de saldo',
            })
          }
        }*/
          if (muestraMensaje) {
            this.$store.commit('ALERT', {
              color: 'error',
              text: 'Ya Existe la factura: ' + UUID,
            })
          }
        }
        //aqui
        else {
          this.existeFactura = false
          this.existeOrden = false
        }
      }
    },
    async verificarFactura(UUID) {
      /// console.log("UUID2", UUID )
      let resultadoFac = false
      let saldoFac = 0
      let jwt = await getValidToken(this)
      let param = null
      let payload = {}
      if (UUID != '') {
        //verificar Detalle
        param = 'filtro?campo1=UUID&tipo1=igual&valor1=' + UUID
        payload = { jwt: jwt, params: param }
        await this.$store
          .dispatch('factura/fetchFactura', payload)
          .then((response) => {
            if (response.data.length > 0) {
              resultadoFac = true
              saldoFac = response.data[0].saldoFac
            }
          })
          .catch((err) => {
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
            })
          })
      }
      return { resultadoFac, saldoFac }
    },
    async validaExisteOrden(UUID, osNumDoc, RfcEmisor, montoFac, muestraMensaje = true) {
      let existe = false
      let proveedorValido = false
      let montoValido = false
      let montoTope = false
      let montoMayor = false

      let { resultadoFac, saldoFac } = await this.verificarFactura(UUID)
      /* console.log('saldoFac', saldoFac)
      console.log('saldmontoFacoFac', montoFac)
      console.log('Number(resultadoFac)', Number(resultadoFac))
      console.log('Number(this.montoDoc)', Number(this.montoDoc))
      console.log('Number(this.osTotalFactura)', Number(this.osTotalFactura))*/

      if (Number(osNumDoc) > 0) {
        //devuelve el resultado si la factura existe en una orden
        existe = await this.verificarOrden(UUID, osNumDoc, this.proveedor)
        // console.log("resultado en de verificar orden en factua", existe)
        // Verifica si el proveedor es diferente de RfcEmisor
        if (this.proveedor != RfcEmisor) {
          // Cambiar "this.proveedor" a "this.proveedor" y usar "!=="
          proveedorValido = true
        }
        if (Number(resultadoFac) && Number(saldoFac) < Number(this.montoDoc)) {
          montoValido = true
        }
        if (!existe && saldoFac == 0) {
          montoValido = false
        }
        if (Number(this.osTotalFactura) === Number(this.montoDoc)) {
          montoTope = true
        }
        if (Number(montoFac) > Number(this.montoDoc)) {
          montoMayor = true
        }
        /*  if (Number(montoFac) < Number(this.montoDoc)) {
          montoFacInicial = true
        } else if (Number(montoFac) > Number(this.montoDoc)) {
          montoFacInicial2 = false
        }*/
      }
      if (existe) {
        if (muestraMensaje) {
          this.dialogoError = true
          this.titleSend = 'No se puede continuar'
          this.textSend = 'La factura seleccionada ya se encuentra registrado en esta orden'
        }
        this.existeOrden = true
      } else if (proveedorValido) {
        if (muestraMensaje) {
          this.dialogoError = true
          this.titleSend = 'No se puede continuar'
          this.textSend = 'El RFC del proveedor no coincide con el RFC de la factura'
        }
        this.existeOrden = true
      } else if (montoValido) {
        if (muestraMensaje) {
          this.dialogoError = true
          this.titleSend = 'No se puede continuar'
          this.textSend =
            'El monto de la orden supera al saldo de la factura registrada, ' +
            'Saldo disponible: ' +
            saldoFac
        }
        this.existeOrden = true
      } else if (montoTope) {
        if (muestraMensaje) {
          this.dialogoError = true
          this.titleSend = 'No se puede continuar'
          this.textSend = 'La orden ya cuenta con todo su total facturado'
        }
        this.existeOrden = true
      } else if (montoMayor) {
        if (muestraMensaje) {
          this.dialogoError = true
          this.titleSend = 'No se puede continuar'
          this.textSend = 'El total de la factura supera al total de la orden'
        }
        this.existeOrden = true
      } else {
        this.existeOrden = false
      }
    },
    async verificarOrden(UUID, osNumDoc, RfcEmisor, montoFac) {
      let resultado = false
      let jwt = await getValidToken(this)
      let param = null

      let payload = {}

      if (UUID !== '' && osNumDoc > 0) {
        // Verificar Detalle
        param =
          'filtro?campo1=UUID&tipo1=igual&valor1=' +
          UUID +
          '&logico2=and&campo2=numDoc&tipo2=igual&valor2=' +
          this.osNumDoc
        payload = { jwt: jwt, params: param }
        await this.$store
          .dispatch('factura/fetchFacturaDoc', payload)
          .then((response) => {
            if (response.data.length > 0) {
              resultado = true
            } else if (this.proveedor != RfcEmisor) {
              resultado = true
            } else if (montoFac > this.montoDoc) {
              resultado = true
            }
          })
          .catch((err) => {
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
            })
          })
      } else {
        // Verificar Cabecero
        param =
          'filtro?campo1=UUID&tipo1=igual&valor1=' +
          UUID +
          '&logico2=and&campo2=numDoc&tipo2=igual&valor2=' +
          this.osNumDoc
        payload = { jwt: jwt, params: param }
        await this.$store
          .dispatch('factura/fetchFacturaDoc', payload)
          .then((response) => {
            if (response.data.length > 0) {
              resultado = true
            } else if (this.proveedor != RfcEmisor) {
              resultado = true
            } else if (montoFac > this.montoDoc) {
              resultado = true
            }
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
            })
          })
      }
      return resultado
    },
    async obtenerFacturas() {
      let jwt = await getValidToken(this)
      this.overlay = true
      //this.isLoading = true
      let params = 'filtro?campo1=UUID&tipo1=igual&valor1=' + this.UUID

      if (jwt != null) {
        this.facturasPrincipal = []
        let payload = { jwt: jwt, params: params }

        await this.$store
          .dispatch('factura/fetchFactura', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.facturasPrincipal = response.data
              // e facturasPrincipal y asignar valores a xmlData
              this.facturasPrincipal.forEach((factura) => {
                this.xmlData.cabecero.Version = factura.Version
                this.xmlData.cabecero.Serie = factura.Serie
                this.xmlData.cabecero.Folio = factura.Folio
                this.xmlData.cabecero.Fecha = factura.Fecha
                this.xmlData.cabecero.FormaPago = factura.FormaPago
                this.xmlData.cabecero.NoCertificado = factura.NoCertificado
                this.xmlData.cabecero.SubTotal = factura.Subtotal
                this.xmlData.cabecero.Moneda = factura.Moneda
                this.xmlData.cabecero.Total = factura.Total
                this.TotalImpuestosTrasladados = factura.TotalImpuestosTrasladados
                this.xmlData.cabecero.TipoDeComprobante = factura.TipoDeComprobante
                this.xmlData.cabecero.Exportacion = factura.Exportacion
                this.xmlData.cabecero.MetodoPago = factura.MetodoPago
                this.xmlData.cabecero.LugarExpedicion = factura.LugarExpedicion
                this.xmlData.hijos.emisor.Rfc = factura.RfcEmisor
                this.xmlData.hijos.emisor.Nombre = factura.NombreEmisor
                this.xmlData.hijos.emisor.RegimenFiscal = factura.RegimenFiscalEmisor
                this.xmlData.hijos.receptor.Rfc = factura.RfcReceptor
                this.xmlData.hijos.receptor.Nombre = factura.NombreReceptor
                this.xmlData.hijos.receptor.DomicilioFiscalReceptor =
                  factura.DomicilioFiscalReceptor
                this.xmlData.hijos.receptor.RegimenFiscalReceptor = factura.RegimenFiscalReceptor
                this.xmlData.hijos.receptor.UsoCFDI = factura.UsoCFDI
                this.xmlData.complemento.UUID = factura.UUID
                this.xmlData.complemento.FechaTimbrado = factura.Fecha
                this.xmlData.complemento.RfcProvCertif = factura.RfcProvCertif
                this.xmlData.hijos.receptor.UsoCFDI = factura.UsoCFDI
                this.xmlData.trasData1.Base = factura.Base
                this.xmlData.trasData1.Impuesto = factura.Impuesto
                this.xmlData.trasData1.TipoFactor = factura.TipoFactor
                this.xmlData.trasData1.TasaOCuota = factura.TasaOCuota
                this.xmlData.trasData1.Importe = factura.Importe
                this.xmlData.trasData2.Base2 = factura.Base2
                this.xmlData.trasData2.Impuesto2 = factura.Impuesto2
                this.xmlData.trasData2.TipoFactor2 = factura.TipoFactor2
                this.xmlData.trasData2.TasaOCuota2 = factura.TasaOCuota2
                this.xmlData.trasData2.Importe2 = factura.Importe2
              })
            }
            this.overlay = false
            //this.isLoading = false
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

    nuevaCaptura() {
      /*this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1*/
      this.EjercicioValido()
    },
    /* editItem(item) {
      console.log('ENTRA A: editItem(item)', 'item: ', item)
      this.isEditing = true
      this.editedIndex = this.facturasPrincipal.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.xmlData.cabecero.Version = this.editedItem.Version
      this.xmlData.Serie = this.editedItem.Serie
      this.xmlData.cabecero.Folio = this.editedItem.Folio
      this.xmlData.cabecero.Fecha = this.editedItem.Fecha
      this.xmlData.cabecero.FormaPago = this.editedItem.FormaPago
      this.xmlData.cabecero.NoCertificado = this.editedItem.NoCertificado
      this.xmlData.cabecero.SubTotal = this.editedItem.Subtotal
      this.xmlData.cabecero.Moneda = this.editedItem.Moneda
      this.xmlData.cabecero.Total = this.editedItem.Total
      this.TotalImpuestosTrasladados = this.editedItem.TotalImpuestosTrasladados
      this.xmlData.cabecero.TipoDeComprobante = this.editedItem.TipoDeComprobante
      this.xmlData.cabecero.Exportacion = this.editedItem.Exportacion
      this.xmlData.cabecero.MetodoPago = this.editedItem.MetodoPago
      this.xmlData.cabecero.LugarExpedicion = this.editedItem.LugarExpedicion
      this.xmlData.hijos.emisor.Rfc = this.editedItem.RfcEmisor
      this.xmlData.hijos.emisor.Nombre = this.editedItem.NombreEmisor
      this.xmlData.hijos.emisor.RegimenFiscal = this.editedItem.RegimenFiscalEmisor
      this.xmlData.hijos.receptor.Rfc = this.editedItem.RfcReceptor
      this.xmlData.hijos.receptor.Nombre = this.editedItem.NombreReceptor
      this.xmlData.hijos.receptor.DomicilioFiscalReceptor = this.editedItem.DomicilioFiscalReceptor
      this.xmlData.hijos.receptor.RegimenFiscalReceptor = this.editedItem.RegimenFiscalReceptor
      this.xmlData.hijos.receptor.UsoCFDI = this.editedItem.UsoCFDI
      this.xmlData.complemento.UUID = this.editedItem.UUID
      this.xmlData.complemento.FechaTimbrado = this.editedItem.Fecha
      this.xmlData.complemento.RfcProvCertif = this.editedItem.RfcProvCertif
      this.xmlData.hijos.receptor.UsoCFDI = this.editedItem.UsoCFDI
      this.xmlData.trasData1.Base = this.editedItem.Base
      this.xmlData.trasData1.Impuesto = this.editedItem.Impuesto
      this.xmlData.trasData1.TipoFactor = this.editedItem.TipoFactor
      this.xmlData.trasData1.TasaOCuota = this.editedItem.TasaOCuota
      this.xmlData.trasData1.Importe = this.editedItem.Importe
      this.xmlData.trasData2.Base2 = this.editedItem.Base2
      this.xmlData.trasData2.Impuesto2 = this.editedItem.Impuesto2
      this.xmlData.trasData2.TipoFactor2 = this.editedItem.TipoFactor2
      this.xmlData.trasData2.TasaOCuota2 = this.editedItem.TasaOCuota2
      this.xmlData.trasData2.Importe2 = this.editedItem.Importe2
      this.UUID =  this.editedItem.UUID
      this.obtenerFacturasDet(this.UUID)
      this.showModal = true
    },*/
    async obtenerFacturasDet(UUID) {
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=UUID&tipo1=igual&valor1=' + UUID
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.tableData = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('factura/fetchFacturaDet', payload)
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
    async onChangeEjercicio(value) {
      let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await this.obtenerFacturas(jwt, value.sp_ejercicio)
    },
    async onChangeEjercicioPrinc(value) {
      //let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
    },
    deleteItem(item) {
      // console.log('item-text', item)
      const index = this.facturasPrincipal.indexOf(item)
      //console.log('det.UUID', this.facturasPrincipal)
      const userConfirm =
        confirm('¿Está seguro que desea eliminar este registro?, Se perderan todos los datos') &&
        this.facturasPrincipal.splice(index, 1)
      if (!userConfirm) {
        return
      }
      this.BorrarOrDet(item.UUID)
      this.BorrarRegistro(item.UUID)
    },
    async BorrarRegistro(index) {
      let body = {
        UUID: index,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('ordencompra/deleteOrden', payload)
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
    async BorrarOrDet(index) {
      let body = {
        UUID: index,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('ordencompra/deleteOrdenDet', payload)
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
    onFileSelected(file) {
      //verifica que file no sea null ni undefined antes de intentar leer su contenido
      if (file) {
        const reader = new FileReader()
        reader.readAsText(file)

        reader.onload = () => {
          const parser = new DOMParser()
          const xml = parser.parseFromString(reader.result, 'text/xml')
          // Filtrar los elementos que deseas mostrar del componente raíz
          const rootElements = xml.getElementsByTagName('cfdi:Comprobante')[0]
          const cabeceroData = {
            Version: rootElements.getAttribute('Version'),
            Fecha: rootElements.getAttribute('Fecha'),
            FormaPago: rootElements.getAttribute('FormaPago'),
            NoCertificado: rootElements.getAttribute('NoCertificado'),
            Folio: rootElements.getAttribute('Folio'),
            SubTotal: rootElements.getAttribute('SubTotal'),
            Moneda: rootElements.getAttribute('Moneda'),
            Total: rootElements.getAttribute('Total'),
            Serie: rootElements.getAttribute('Serie'),
            TipoDeComprobante: rootElements.getAttribute('TipoDeComprobante'),
            Exportacion: rootElements.getAttribute('Exportacion'),
            MetodoPago: rootElements.getAttribute('MetodoPago'),
            LugarExpedicion: rootElements.getAttribute('LugarExpedicion'),
          }

          // Declarar la variable totalFactura si aún no existe o inicializarla en 0
          /*let totalFactura = 0;
            let totalFinal = 0;
            // Supongamos que rootElements representa los datos de la factura
            // Obtener el valor del campo 'Total' de la factura
            const totalFacturaActual = parseFloat(rootElements.getAttribute('Total'));
            // Verificar si el valor de 'Total' es un número válido
            if (!isNaN(totalFacturaActual)) {
            // Acumular el valor en la variable totalFactura
              totalFactura += totalFacturaActual;
            } else {
              console.error('El valor de "Total" no es un número válido.');
              totalFactura = 0;
            }
            // Supongamos que tienes una variable llamada this.osTotalFactura que quieres actualizar
            if (typeof this.osTotalFactura === 'number') {
              this.osTotalFactura += totalFactura;
            } else {
              this.osTotalFactura = totalFactura;
            }
            // Actualizar la variable totalFinal con el valor acumulado de this.osTotalFactura
            if (typeof this.osTotalFactura === 'number') {
              totalFinal = this.osTotalFactura;
            }
            this.$store.commit('SET_TOTAL_FINAL', totalFinal);
            // Mostrar el resultado en la consola
            console.log('Valor acumulado en this.osTotalFactura: ' + this.osTotalFactura);
            // Mostrar el resultado en la consola
            console.log('Valor acumulado en this.osTotalFactura: ' + this.osTotalFactura);
            // Mostrar el total final en la consola
            console.log('Total final: ' + totalFinal);
            this.saveTotal = {
              osTotalFact : this.osTotalFactura
            }*/
          const complementos = xml.getElementsByTagName('tfd:TimbreFiscalDigital')[0]
          const complementoData = {
            Version: complementos.getAttribute('Version'),
            UUID: complementos.getAttribute('UUID'),
            FechaTimbrado: complementos.getAttribute('FechaTimbrado'),
            RfcProvCertif: complementos.getAttribute('RfcProvCertif'),
          }

          //let TotalImpuestosTrasladados
          const trasData1 = {} //variable para almacenar TotalImpuestosTrasladados
          const trasData2 = {}
          const impuestos = xml.getElementsByTagName('cfdi:Impuestos')

          for (let i = 0; i < impuestos.length; i++) {
            // const impuesto = impuestos[i]
            //console.log('impuesto', impuesto)
            if (i === impuestos.length - 1) {
              // Obtener el último elemento de Impuestos
              const impuestosTotal = impuestos[i]
              // Obtener el atributo TotalImpuestosTrasladados
              this.TotalImpuestosTrasladados = impuestosTotal.getAttribute(
                'TotalImpuestosTrasladados'
              )
              //console.log('TotalImpuestosTrasladados', TotalImpuestosTrasladados)
              // Obtener elementos de Traslados dentro del último Impuestos
              const Traslados = impuestosTotal.getElementsByTagName('cfdi:Traslado')
              // Verificar si existen al menos dos elementos en Traslados
              if (Traslados.length >= 1) {
                const primerTraslado = Traslados[0] // Obtener el primer Traslado (índice 0)
                // Obtener datos del primer Traslado
                trasData1.Base = primerTraslado.getAttribute('Base')
                trasData1.Importe = primerTraslado.getAttribute('Importe')
                trasData1.Impuesto = primerTraslado.getAttribute('Impuesto')
                trasData1.TasaOCuota = primerTraslado.getAttribute('TasaOCuota')
                trasData1.TipoFactor = primerTraslado.getAttribute('TipoFactor')
                // console.log('Primer Traslado', trasData1)
              }
              if (Traslados.length >= 2) {
                const segundoTraslado = Traslados[1] // Obtener el segundo Traslado (índice 1)
                // Obtener datos del segundo Traslado
                trasData2.Base2 = segundoTraslado.getAttribute('Base')
                trasData2.Importe2 = segundoTraslado.getAttribute('Importe')
                trasData2.Impuesto2 = segundoTraslado.getAttribute('Impuesto')
                trasData2.TasaOCuota2 = segundoTraslado.getAttribute('TasaOCuota')
                trasData2.TipoFactor2 = segundoTraslado.getAttribute('TipoFactor')
                //console.log('Segundo Traslado', trasData2)
              }
              //this.validaExisteFactura(false)
            }
          }
          // Filtrar los elementos que deseas mostrar de los componentes hijos
          const hijosData = {
            emisor: {},
            receptor: {},
          }
          const emisor = xml.getElementsByTagName('cfdi:Emisor')[0]
          hijosData.emisor.Nombre = emisor.getAttribute('Nombre')
          hijosData.emisor.RegimenFiscal = emisor.getAttribute('RegimenFiscal')
          hijosData.emisor.Rfc = emisor.getAttribute('Rfc')

          const receptor = xml.getElementsByTagName('cfdi:Receptor')[0]
          hijosData.receptor.Nombre = receptor.getAttribute('Nombre')
          hijosData.receptor.RegimenFiscalReceptor = receptor.getAttribute('RegimenFiscalReceptor')
          hijosData.receptor.Rfc = receptor.getAttribute('Rfc')
          hijosData.receptor.UsoCFDI = receptor.getAttribute('UsoCFDI')
          hijosData.receptor.DomicilioFiscalReceptor =
            receptor.getAttribute('DomicilioFiscalReceptor')

          const conceptos = xml.getElementsByTagName('cfdi:Concepto')
          //  const conceptosDatos = {}
          for (let i = 0; i < conceptos.length; i++) {
            const concepto = conceptos[i]
            //conceptosDatos.Cantidad = concepto.getAttribute('Cantidad');
            this.conceptosData.push({
              Cantidad: concepto.getAttribute('Cantidad'),
              ClaveProdServ: concepto.getAttribute('ClaveProdServ'),
              ClaveUnidad: concepto.getAttribute('ClaveUnidad'),
              Descripcion: concepto.getAttribute('Descripcion'),
              Unidad: concepto.getAttribute('Unidad'),
              ValorUnitario: concepto.getAttribute('ValorUnitario'),
              Importe: concepto.getAttribute('Importe'),
              ObjetoImp: concepto.getAttribute('ObjetoImp'),
              NoIdentificacion: concepto.getAttribute('NoIdentificacion'),
            })
          }
          this.validaExisteOrden(
            complementoData.UUID,
            this.osNumDoc,
            hijosData.emisor.Rfc,
            cabeceroData.Total
          )
          this.verificarOrden(
            complementoData.UUID,
            this.osNumDoc,
            hijosData.emisor.Rfc,
            cabeceroData.Total
          )

          this.verificarFactura(complementoData.UUID)
          this.validaExisteFactura(complementoData.UUID, this.osNumDoc, this.montoDoc)
          this.sumaCampo('Total', cabeceroData)
          this.restaSaldo('Total', complementoData.UUID, cabeceroData)
          /*let sumaImporte = 0

          for (let i = 0; i < this.conceptosData.length; i++) {
            const importe = Number(this.conceptosData.Importe)
            sumaImporte = +importe
          }
          console.log('La suma de Importe es: ', sumaImporte)*/

          const traslados = xml.getElementsByTagName('cfdi:Traslado')
          for (let i = 0; i < traslados.length; i++) {
            const traslado = traslados[i]
            this.trasladosData.push({
              Base: traslado.getAttribute('Base'),
              Importe: traslado.getAttribute('Importe'),
              Impuesto: traslado.getAttribute('Impuesto'),
              TipoFactor: traslado.getAttribute('TipoFactor'),
              TasaOCuota: traslado.getAttribute('TasaOCuota'),
            })
          }
          this.tableData = this.conceptosData
            .map((concepto, index) => {
              return {
                ...concepto,
                ...this.trasladosData[index],
              }
            })
            .map((obj) => Object.assign({}, obj))
          // console.log('arregloTrasData1', trasData1)
          this.xmlData = {
            cabecero: cabeceroData,
            hijos: hijosData,
            complemento: complementoData,
            trasData1: trasData1,
            trasData2: trasData2,
          }
          // console.log(this.xmlData)
          //console.log('padre', this.padre)

          this.fileLoaded = true
          /*console.log('Fila concepto:', conceptos)
          console.log('Fila concepto 2:', this.conceptosData)
           console.log('Datos escaneados detalle:', this.tableData )
           console.log('Primera fila: ', cabeceroData )
           console.log('Fila emisor: ', emisor )
           console.log('Fila receptor: ', receptor )
           console.log('Fila traslado Detalñle:', this.trasladosData)
           console.log('Fila conplemento:', complementoData)
           console.log('Fila Traslado 1:', this.trasData1)*/
        }
      }
    },
    clearData() {
      this.xmlData = {
        fileInputValue: null,
        complemento: [],
        cabecero: [],
        hijos: {
          emisor: [],
          receptor: [],
        },
        trasData1: [],
        trasData2: [],
      }
      this.conceptosData = []
      this.trasladosData = []
      this.tableData = []
      this.fileLoaded = false
    },
    async Guardar() {
      await this.validaExisteFactura(this.xmlData.complemento.UUID)
      this.conceptosData.entries()
      if (!this.existeOrden && this.existeFactura) {
        // Ejecuta el código si existeFactura es true
        let jwt = await getValidToken(this)
        let body2 = {
          UUID: this.xmlData.complemento.UUID,
          ejercicio: this.ejercicio,
          RFC: this.xmlData.hijos.emisor.Rfc,
          numDoc: this.osNumDoc,
          tipo: 'ORD',
          tipoDoc: this.osTipoDoc,
          importeFactura: this.xmlData.cabecero.Total,
          importeDocumento: this.montoDoc,
        }
        let payload2 = { jwt: jwt, body: body2 }
        try {
          await this.$store.dispatch('factura/addFactDoc', payload2)
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se registro con éxito',
          })
          //this.validaExisteOrden(false)
        } catch (err) {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
          this.overlay = false
        }
        let body3 = {
          osTotalFact: this.totalFinal,
        }
        let payload3 = { jwt: jwt, body: body3 }
        payload3.id = this.osNumDoc
        await this.$store
          .dispatch('factura/editFactMonto', payload3)
          /* .then(() => {
             this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se actualizo con éxito',
              })
            })*/
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.msg,
            })
          })
        let bodyDoc = {
          saldoFac: this.totalResta,
        }
        let payloadDoc = { jwt: jwt, body: bodyDoc }
        payloadDoc.id = this.xmlData.complemento.UUID
        await this.$store
          .dispatch('factura/editSaldo', payloadDoc)
          /*.then(() => {
             this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se actualizo con éxito',
              })
            })*/
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.msg,
            })
          })

        this.$root.$emit('guardado-exitoso')
        this.close(this.checkbox)
      }
      if (!this.existeOrden && !this.existeFactura) {
        // Ejecuta el código si existeFactura es false
        this.save()
        this.saveDet()
      }
    },
    async saveDet() {
      this.overlay = true
      let consecutivo = 1
      let jwt = await getValidToken(this)
      const payloads = [] // Un arreglo para almacenar todos los payloads

      for (const [index, concepto] of this.conceptosData.entries()) {
        const payload = {
          jwt: jwt,
          body: {
            UUID: this.xmlData.complemento.UUID,
            Consecutivo: consecutivo++,
            Importe: concepto.Importe,
            Cantidad: concepto.Cantidad,
            ClaveProdServ: concepto.ClaveProdServ,
            ClaveUnidad: concepto.ClaveUnidad,
            Descripcion: concepto.Descripcion,
            NoIdentificacion: concepto.NoIdentificacion,
            Unidad: concepto.Unidad,
            ValorUnitario: concepto.ValorUnitario,
            ObjetoImp: concepto.ObjetoImp,
            Base: this.trasladosData[index].Base,
            ImporteImpuesto: this.trasladosData[index].Importe,
            Impuesto: this.trasladosData[index].Impuesto,
            TipoFactor: this.trasladosData[index].TipoFactor,
            TasaOCuota: this.trasladosData[index].TasaOCuota,
          },
        }

        payloads.push(payload)
      }

      try {
        if (this.editedIndex > -1) {
          await Promise.all(
            payloads.map((payload) => this.$store.dispatch('factura/addFactDet', payload))
          )
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'Los registros se crearon con éxito',
          })
          this.overlay = false
          //Object.assign(this.proveedores[this.editedIndex], this.editedItem);
        } else {
          const responses = await Promise.all(
            payloads.map((payload) => this.$store.dispatch('factura/addFactDet', payload))
          )
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'Los registros se crearon con éxito',
          })
          this.tableData.push(...responses.map((response) => response.data))
        }
      } catch (err) {
        this.$store.commit('ALERT', {
          color: 'error',
          text: err.response.data.msg,
          // Enviar a inicio de sesión
        })
      }

      this.overlay = false
      this.close(this.checkbox)
      this.changed = false
    },
    sumaCampoDet(key) {
      let suma = 0
      for (let x in this.tableData) {
        if (key == 'osDetCantidad') {
          suma += Number(this.tableData[x].Base)
        } else if (key == 'Total') {
          suma += Number(this.tableData[x].ImporteImpuesto) + Number(this.tableData[x].Base)
        }
      }

      return suma
    },
    sumaCampo(key, cabeceroData) {
      let suma = 0
      if (key === 'Total') {
        suma = Number(this.osTotalFactura) + Number(cabeceroData.Total)
      } else if (key === 'TotalDetalle') {
        suma = Number(this.osTotalFactura).toFixed(2)
        ;+Number(cabeceroData.Total).toFixed(2)
      }

      this.totalFinal = suma // Actualiza osTotalFactura con el nuevo valor de suma
      console.log('SUMA FINAL', this.totalFinal)
      //return suma; //
    },
    async restaSaldo(key, UUID, cabeceroData) {
      let resta = 0
      let { saldoFac } = await this.verificarFactura(UUID)
      if (saldoFac === 0) {
        if (key === 'Total') {
          const totalDoc = Number(this.montoDoc)
          const totalFact = Number(cabeceroData.Total)
          //resta = Number(cabeceroData.Total) - Number(this.montoDoc)
          const resultado = totalDoc - totalFact
          resta = resultado.toFixed(2)
        }
        // console.log('SaldoFactura', resta)
      } else if (saldoFac > 0) {
        if (key === 'Total') {
          resta = saldoFac - this.montoDoc
        }
        // console.log('else if(saldoFac > 0 )', resta)
      }
      /*if (saldoFac == this.montoDoc){
     if (key === 'Total') {
      resta = 0;
    }
    console.log("la resta queda en 0.", resta);
  }*/
      this.totalResta = resta
    },

    async save() {
      this.overlay = true
      let body = {
        UUID: this.xmlData.complemento.UUID,
        Version: this.xmlData.cabecero.Version,
        Serie: this.xmlData.cabecero.Serie,
        Folio: this.xmlData.cabecero.Folio,
        Fecha: this.xmlData.cabecero.Fecha,
        FormaPago: this.xmlData.cabecero.FormaPago,
        NoCertificado: this.xmlData.cabecero.NoCertificado,
        Subtotal: this.xmlData.cabecero.SubTotal,
        Moneda: this.xmlData.cabecero.Moneda,
        Total: this.xmlData.cabecero.Total,
        TotalImpuestosTrasladados: this.TotalImpuestosTrasladados,
        TipoDeComprobante: this.xmlData.cabecero.TipoDeComprobante,
        Exportacion: this.xmlData.cabecero.Exportacion,
        MetodoPago: this.xmlData.cabecero.MetodoPago,
        LugarExpedicion: this.xmlData.cabecero.LugarExpedicion,
        RfcEmisor: this.xmlData.hijos.emisor.Rfc,
        NombreEmisor: this.xmlData.hijos.emisor.Nombre,
        RegimenFiscalEmisor: this.xmlData.hijos.emisor.RegimenFiscal,
        RfcReceptor: this.xmlData.hijos.receptor.Rfc,
        NombreReceptor: this.xmlData.hijos.receptor.Nombre,
        DomicilioFiscalReceptor: this.xmlData.hijos.receptor.DomicilioFiscalReceptor,
        RegimenFiscalReceptor: this.xmlData.hijos.receptor.RegimenFiscalReceptor,
        UsoCFDI: this.xmlData.hijos.receptor.UsoCFDI,
        Base: this.xmlData.trasData1.Base || 0,
        Impuesto: this.xmlData.trasData1.Impuesto || 0,
        TipoFactor: this.xmlData.trasData1.TipoFactor || 0,
        TasaOCuota: this.xmlData.trasData1.TasaOCuota || 0,
        Importe: this.xmlData.trasData1.Importe || 0,
        Base2: this.xmlData.trasData2.Base2 || 0,
        Impuesto2: this.xmlData.trasData2.Impuesto2 || 0,
        TipoFactor2: this.xmlData.trasData2.TipoFactor2 || 0,
        TasaOCuota2: this.xmlData.trasData2.TasaOCuota2 || 0,
        Importe2: this.xmlData.trasData2.Importe2 || 0,
        osTipoDoc: this.osTipoDoc,
        osNumDoc: this.osNumDoc,
        sp_id: 0,
        sp_ejercicio: this.ejercicio,
        saldoFac: this.totalResta || 0,
        Activo: 1,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      await this.$store
        .dispatch('factura/addFact', payload)
        .then((response) => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se creó con éxito',
          })
          this.facturasPrincipal.push(response.data)
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
      //}
      let body2 = {
        UUID: this.xmlData.complemento.UUID,
        ejercicio: this.ejercicio,
        RFC: this.xmlData.hijos.emisor.Rfc,
        numDoc: this.osNumDoc || 0,
        tipo: 'ORD',
        tipoDoc: this.osTipoDoc,
        importeFactura: this.xmlData.cabecero.Total,
        importeDocumento: this.montoDoc || 0,
      }
      let payload2 = { jwt: jwt, body: body2 }
      await this.$store
        .dispatch('factura/addFactDoc', payload2)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se actualizo con éxito',
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
      let body3 = {
        osTotalFact: this.totalFinal,
      }
      let payload3 = { jwt: jwt, body: body3 }
      payload3.id = this.osNumDoc
      await this.$store
        .dispatch('factura/editFactMonto', payload3)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se actualizo con éxito',
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
      let bodyEstatus = {
        osEstatus: 'FAC',
      }
      let payloadEstatus = { jwt: jwt, body: bodyEstatus }
      payloadEstatus.id = this.osNumDoc
      try {
        await this.$store.dispatch('ordencompra/editEstatus', payloadEstatus)
        this.$store.commit('ALERT', {
          color: 'success',
          text: 'El registro se actualizo con éxito',
        })
      } catch (err) {
        this.$store.commit('ALERT', {
          color: 'error',
          text: err.response.data.msg,
        })
        this.overlay = false
      }
      var fecha = new Date()
      const os_fecha_fac = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      //guarda ACTUALIZA SEGUIMIENTO AL EDITAR
      let bodyEnv = {
        osNumDoc: this.osNumDoc,
        osEjercicio: this.ejercicio,
        os_fecha_fac: os_fecha_fac,
        os_user_fac: this.usuario.usr_id,
      }
      let payloadEnv = { jwt: jwt, body: bodyEnv }
      await this.$store
        .dispatch('ordencompra/editSeguimiento', payloadEnv)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se creó con éxito',
          })
          this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
        })
      this.$root.$emit('guardado-exitoso')
      this.close(this.checkbox)
      this.changed = false
    },

    close(checkbox) {
      this.isSure = false
      this.checkbox = checkbox
      if (!this.checkbox) {
        //this.value = false
        this.$emit('input', false)
        this.isEditing = false
      }
      this.$nextTick(() => {
        /*this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1*/
        //this.resetWatchValues()
      })
      this.clearData()
      this.fileInputValue = null
    },
    //Cancelar dialogo Principal
    cancel(isSure) {
      this.isSure = isSure
      if (this.isSure) {
        this.close(false)
        this.changed = false
      }
    },
    checkChanges() {
      console.log('checkChanges', this.checkChanges)
      if (this.changed) {
        this.isSure = true
      } else {
        this.close(false)
        this.changed = false
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
  },
  computed: {
    formTitle() {
      if (this.isEditing) {
        return 'Descripción de factura: ' + this.UUID
      } else if (this.xmlData.complemento && this.xmlData.complemento.UUID) {
        return 'Se cargo la Factura: ' + this.xmlData.complemento.UUID
      } else {
        // Manejar el caso en el que this.xmlData.complemento.UUID sea nulo o indefinido
        return 'Cargar nueva factura XML'
      }
    },
  },
}
</script>
<style lang="scss">
.right {
  float: right;
  //background: red;
}
.label {
  font-size: 15px;
  white-space: pre;
}
.valor {
  font-size: 20px;
  font-weight: 500;

  margin-top: -6px;
}
.left {
  float: left;
  //background: blue;
}
.center {
  background: green;
  display: inline-block;
}
</style>
