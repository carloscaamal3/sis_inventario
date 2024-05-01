<template>
  <v-tabs fixed-tabs background-color="indigo" dark>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab @change="refrescaRecibe">
      <v-icon left> mdi-clipboard-arrow-right-outline </v-icon>Recibir de Autoriza
    </v-tab>
    <v-tab @change="refrescaCaptura">
      <v-icon left> mdi-clipboard-arrow-right-outline </v-icon>Captura Pagos
    </v-tab>
    <v-tab @change="refrescaPagados">
      <v-icon right> mdi-clipboard-arrow-left-outline </v-icon>Folios Pagados
    </v-tab>
    <!-- RECIBIR DE AUTORIZA -->
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
                @click="recibir"
                >Recibir</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="ejercicioRecAut"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioRecAut"
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
                :dataArray="solpagosxRecibirExportar"
                :dataFields="fieldsRecibir"
                fileName="recibeAut"
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

          <v-divider class="mt-3" />
          <v-data-table
            :headers="headersRecibir"
            :items="solpagosxRecibir"
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

            <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
              <div class="name-info-title">
                {{ convierteNumeroFechaVista(item.sp_fecha_solicitud) }}
              </div>
            </template>

            <template v-slot:[`item.sp_fecha_factura_prob_pago`]="{ item }">
              <div class="name-info-title">
                {{ convierteNumeroFechaVista(item.sp_fecha_factura_prob_pago) }}
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
    <!-- CAPTURA PAGOS -->
    <v-tab-item>
      <base-material-card
        color="blue"
        icon="mdi-file-document-edit-outline"
        inline
        class="px-5 py-3"
      >
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>
        <template v-slot:corner-button>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="ejercicioCapPag"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioCapPag"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </template>
        <!-- <v-overlay :value="overlay">
        <v-progress-circular :size="50" color="green" indeterminate></v-progress-circular>
      </v-overlay> -->
        <v-row>
          <v-col cols="6">
            <!-- Empieza DataExporter -->
            <DataExporter
              :dataArray="solpagosExportar"
              :dataFields="fieldsPagos"
              fileName="porpagar"
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
        <!-- Termina Dialogo Cancelar -->
        <!-- Empieza Dialogo Motivo de Cancelacion -->
        <v-dialog v-model="dialogxc" persistent max-width="800px">
          <v-card class="v-text">
            <v-card-title class="v-text">
              <span>Cancelar Documento</span>
            </v-card-title>
            <v-card-text class="v-text">
              <v-container class="v-text">
                <v-row>
                  <v-col cols="12" class="v-text">
                    <v-text-field
                      v-model="$v.editedItem.sp_motivo_cancelacion.$model"
                      label="Motivo de Cancelación"
                      counter="100"
                      :error-messages="motivo_cancela_Errors"
                      @input="$v.editedItem.sp_motivo_cancelacion.$reset(), (changed = true)"
                      @blur="$v.editedItem.sp_motivo_cancelacion.$touch()"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="v-text">
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="Borrar()">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Termina Dialogo Motivo de Cancelacion -->
        <!-- Empieza Dialogo PRINCIPAL -->
        <v-dialog v-model="dialog" persistent max-width="800px">
          <v-card class="v-text">
            <v-card-title class="v-text">
              <span class="headline">{{ formTitle }} </span>
              <!-- <v-img src="@/assets/logo_ivey.jpg" width="20%" height="20%"></v-img> -->
            </v-card-title>

            <v-card-text class="v-text">
              <v-container class="v-text">
                <v-row>
                  <!-- Campo TIPO DE SOLICITUD -->
                  <v-col cols="4" class="v-text">
                    <v-text-field
                      v-model="editedItem.nom_tipo_sol"
                      label="Tipo de solicitud"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <!-- Campo CONCEPTO -->
                  <v-col cols="4" class="v-text">
                    <v-text-field
                      v-model="editedItem.nom_concepto"
                      label="Concepto"
                      readonly
                    ></v-text-field>
                    <!-- @input="changed = true" -->
                  </v-col>
                  <!-- Campo CUENTA CONTABLE -->
                  <v-col cols="4" class="v-text">
                    <v-text-field
                      v-model="editedItem.cuecon_cuenta"
                      label="Cuenta"
                      readonly
                    ></v-text-field>
                  </v-col>

                  <!-- Campo Descripcion -->
                  <v-col cols="12" class="v-text">
                    <v-text-field
                      v-model="editedItem.sp_descripcion"
                      label="Descripción"
                      readonly
                      class="v-text"
                    ></v-text-field>
                  </v-col>

                  <!-- Campo Fecha Inicio Validez -->
                  <v-col cols="4" class="v-text">
                    <v-menu
                      v-model="fromDateMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          disabled
                          v-model="editedItem.sp_fecha_solicitud"
                          label="Fecha Solicitud"
                          prepend-icon="mdi-calendar-month"
                          v-bind="attrs"
                          v-on="on"
                          class="v-text"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        locale="en-in"
                        :min="minDate"
                        :max="maxDate"
                        v-model="editedItem.sp_fecha_solicitud"
                        @input=";(fromDateMenu = false), (changed = true)"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- Campo Fecha Factura -->
                  <v-col cols="4" class="v-text">
                    <v-menu
                      v-model="fromDateFecFact"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          disabled
                          v-model="editedItem.sp_fecha_firma_aut_vuelta"
                          label="Fecha Autorización"
                          prepend-icon="mdi-calendar-month"
                          v-bind="attrs"
                          v-on="on"
                          class="v-text"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        locale="en-in"
                        :min="minDate"
                        :max="maxDate"
                        v-model="editedItem.sp_fecha_firma_aut_vuelta"
                        @input=";(fromDateFecFact = false), (changed = true)"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- Campo Fecha Probable de pago -->
                  <v-col cols="4" class="v-text">
                    <v-menu
                      v-model="fromDateFecPoPago"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          disabled
                          v-model="editedItem.sp_fecha_factura_prob_pago"
                          label="Fecha Probable de Pago"
                          prepend-icon="mdi-calendar-month"
                          v-bind="attrs"
                          v-on="on"
                          class="v-text"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        locale="en-in"
                        :min="minDate"
                        :max="maxDate"
                        v-model="editedItem.sp_fecha_factura_prob_pago"
                        @input=";(fromDateFecPoPago = false), (changed = true)"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- Campo Proveedores -->
                  <v-col cols="8" class="v-text">
                    <v-text-field
                      v-model="editedItem.sp_pago_nombre_de"
                      label="Proveedor"
                      readonly
                      class="v-text"
                    ></v-text-field>
                    <!-- @input="changed = true" -->
                  </v-col>
                  <!-- Campo Importe -->
                  <v-col cols="4" class="v-text">
                    <v-text-field
                      class="text-xs-right v-text"
                      :value="formatPrice(editedItem.sp_importe)"
                      label="Importe"
                      prefix="$"
                      readonly
                    ></v-text-field>
                  </v-col>

                  <!-- ********************************************************************* -->
                  <!-- DATOS DE CAPTURA **************************************************** -->
                  <!-- Campo FORMA DE PAGO -->
                  <v-col cols="4" class="v-text">
                    <v-select
                      v-model="$v.editedItem.sp_tipo_pago.$model"
                      :items="tipospago"
                      :menu-props="{ top: true, offsetY: true }"
                      label="Tipos de Pago*"
                      item-text="tipo_descripcion"
                      item-value="tipo_id"
                      persistent-hint
                      dense
                      :error-messages="sp_tipo_pagoErrors"
                      hint="Seleciona Tipo de Pago"
                      return-object
                      @input="changed = true"
                      @blur="$v.editedItem.sp_tipo_pago.$touch()"
                    >
                    </v-select>
                  </v-col>
                  <!-- Campo BANCO -->
                  <v-col cols="4" class="v-text">
                    <v-select
                      v-model="$v.editedItem.sp_banco_pago.$model"
                      :items="bancos"
                      :menu-props="{ top: true, offsetY: true }"
                      label="Banco*"
                      item-text="tipo_descripcion"
                      item-value="tipo_id"
                      persistent-hint
                      dense
                      hint="Seleciona Banco"
                      return-object
                      :error-messages="sp_banco_pagoErrors"
                      @input="setfilterBanco"
                      @blur="$v.editedItem.sp_banco_pago.$touch()"
                    >
                    </v-select>
                  </v-col>
                  <!-- Campo Cuenta Bancaria -->
                  <v-col cols="4" class="v-text">
                    <v-select
                      v-model="$v.editedItem.sp_no_cuenta_pago.$model"
                      :items="ctasbancos"
                      :menu-props="{ top: true, offsetY: true }"
                      label="Cuenta de Pago*"
                      item-text="tipo_descripcion"
                      item-value="tipo_id"
                      persistent-hint
                      dense
                      hint="Selecciona Cuenta de Pago"
                      return-object
                      :error-messages="sp_no_cuenta_pagoErrors"
                      @input="changed = true"
                      @blur="$v.editedItem.sp_no_cuenta_pago.$touch()"
                    >
                    </v-select>
                  </v-col>
                  <!-- Campo FECHA REAL PAGO -->
                  <v-col cols="4" class="v-text2">
                    <v-menu
                      v-model="fromDateFecPago"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.sp_fecha_pago_cap"
                          label="Fecha Pago"
                          prepend-icon="mdi-calendar-month"
                          v-bind="attrs"
                          v-on="on"
                          class="v-text"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        locale="en-in"
                        :min="minDate"
                        :max="maxDate"
                        v-model="editedItem.sp_fecha_pago_cap"
                        @input=";(fromDateFecPago = false), (changed = true)"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- Campo FOLIO Pago -->
                  <v-col cols="4" class="v-text2">
                    <v-text-field
                      dense
                      v-model="editedItem.sp_no_folio_pago"
                      label="No. de Folio"
                      :error-messages="sp_no_folio_pagoErrors"
                      @input="$v.editedItem.sp_no_folio_pago.$reset(), (changed = true)"
                      @blur="$v.editedItem.sp_no_folio_pago.$touch()"
                    ></v-text-field>
                  </v-col>
                  <!-- Campo NUMERO DE POLIZA -->
                  <v-col cols="4" class="v-text2">
                    <v-text-field
                      dense
                      v-model="editedItem.sp_no_poliza_pago"
                      label="No. de Poliza"
                      :error-messages="sp_no_poliza_pagoErrors"
                      @input="$v.editedItem.sp_no_poliza_pago.$reset(), (changed = true)"
                      @blur="$v.editedItem.sp_no_poliza_pago.$touch()"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small class="v-text">*Campo Obligatorio</small>
            </v-card-text>

            <v-card-actions class="v-text">
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save" :disabled="$v.$invalid"
                >Guardar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Termina Dialogo -->
        <!-- Aqui va progress linear -->
        <v-divider class="mt-3" />
        <v-data-table
          :headers="headers"
          :items="solpagos"
          dense
          :search.sync="search"
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            <v-icon small @click="regresarItem(item)">mdi-reply</v-icon>
          </template>

          <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
            <div class="name-info-title">
              {{ convierteNumeroFechaVista(item.sp_fecha_solicitud) }}
            </div>
          </template>

          <template v-slot:[`item.sp_fecha_factura_prob_pago`]="{ item }">
            <div class="name-info-title">
              {{ convierteNumeroFechaVista(item.sp_fecha_factura_prob_pago) }}
            </div>
          </template>
          <template v-slot:item.sp_importe="{ item }">
            {{ formatPrice(item.sp_importe) }}
          </template>

          <template v-slot:no-data>
            <!-- <v-btn color="primary">Reset</v-btn> -->
            ¡No hay datos para mostrar!
          </template>
        </v-data-table>
        <!-- Termina Tabla de cuentas -->
      </base-material-card>
    </v-tab-item>
    <!-- FOLIOS PAGADOS -->
    <v-tab-item>
      <base-material-card
        color="blue"
        icon="mdi-file-document-edit-outline"
        inline
        class="px-5 py-3"
      >
        <template v-slot:corner-button>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="ejercicioPag"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioPag"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </template>
        <!-- DIALOGO PARA VISTA DE PAGOS -->
        <v-dialog v-model="dialogv" max-width="800px" persistent>
          <v-card class="v-text">
            <v-card-title class="v-text">
              <span class="headline">{{ formTitle }} </span>
            </v-card-title>
            <v-container class="v-text">
              <v-row>
                <!-- Campo: poliza de pago -->
                <v-col cols="6" class="v-text">
                  <div style="float: left">
                    <p class="label">Poliza Pago:&nbsp;&nbsp;&nbsp;</p>
                  </div>
                  <div>
                    <p class="valor">{{ editedItem.sp_no_poliza_pago }}</p>
                  </div>
                </v-col>
                <!-- Campo: tipo de pago -->
                <v-col cols="6" class="v-text">
                  <div style="float: left">
                    <p class="label">Tipo Pago:&nbsp;&nbsp;&nbsp;</p>
                  </div>
                  <div>
                    <p class="valor">{{ editedItem.Nom_tipo_pago }}</p>
                  </div>
                </v-col>
                <!-- Campo: Banco -->
                <v-col cols="6" class="v-text">
                  <div style="float: left">
                    <p class="label">Banco:&nbsp;&nbsp;&nbsp;</p>
                  </div>
                  <div>
                    <p class="valor">{{ editedItem.NomBanco }}</p>
                  </div>
                </v-col>
                <!-- Campo: Folio Pago -->
                <v-col cols="6" class="v-text">
                  <div style="float: left">
                    <p class="label">Folio:&nbsp;&nbsp;&nbsp;</p>
                  </div>
                  <div>
                    <p class="valor">{{ editedItem.sp_no_folio_pago }}</p>
                  </div>
                </v-col>
                <!-- Campo: usuario Pago -->
                <v-col cols="12" class="v-text">
                  <div style="float: left">
                    <p class="label">usuario:&nbsp;&nbsp;&nbsp;</p>
                  </div>
                  <div>
                    <p class="valor">{{ editedItem.nombre_pago }}</p>
                  </div>
                </v-col>
                <!-- Campo: fecha Pago -->
                <v-col cols="6" class="v-text">
                  <div style="float: left">
                    <p class="label">Fecha pago:&nbsp;&nbsp;&nbsp;</p>
                  </div>
                  <div>
                    <p class="valor">{{ editedItem.sp_fecha_pago_cap }}</p>
                  </div>
                </v-col>
                <!-- Campo: fecha Captura -->
                <v-col cols="6" class="v-text">
                  <div style="float: left">
                    <p class="label">Fecha Captura:&nbsp;&nbsp;&nbsp;</p>
                  </div>
                  <div>
                    <p class="valor">{{ editedItem.sp_fecha_pago }}</p>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="checkChanges">Salir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>

        <v-row>
          <v-col cols="6">
            <!-- Empieza DataExporter -->
            <DataExporter
              :dataArray="pagadosExportar"
              :dataFields="fieldsPagados"
              fileName="pagados"
              pdfView="none"
            />
            <!-- Termina DataExporter -->
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="searchfp"
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
          :headers="headersfp"
          :items="pagados"
          dense
          :search.sync="searchfp"
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="viewItem(item)">mdi-eye-settings-outline</v-icon>
            <!-- <v-icon small @click="deleteItem(item)">mdi-delete</v-icon> -->
          </template>
          <template v-slot:item.sp_importe="{ item }">
            {{ formatPrice(item.sp_importe) }}
          </template>

          <template v-slot:[`item.sp_fecha_pago_cap`]="{ item }">
            <div class="name-info-title">
              {{ convierteNumeroFecha(item.sp_fecha_pago_cap) }}
            </div>
          </template>

          <template v-slot:no-data>
            <!-- <v-btn color="primary">Reset</v-btn> -->
            ¡No hay datos para mostrar!
          </template>
        </v-data-table>
      </base-material-card>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
//import Status from '@/components/general/StatusInfo.vue'
import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import DataExporter from '@/components/general/DataExporter.vue'
import * as tools from '@/store/modules/tools.store.js'
export default {
  components: {
    ConfirmationDialog,
    //Status,
    DataExporter,
  },

  data: () => ({
    eFormatos: tools.formatos,
    fromDateMenu: false,
    fromDateFecFact: false,
    fromDateFecPoPago: false,
    fromDateFecPago: false,
    minDate: '2021-01-01',
    maxDate: '2050-01-31',
    usuario: JSON.parse(localStorage.getItem('user')),
    search: undefined,
    search2: undefined,
    searchfp: undefined,
    isLoading: false,
    checkbox: false,
    isEditing: false,
    dialog: false,
    dialogxc: false,
    dialogv: false,
    isSure: false,
    overlay: false,
    changed: false,
    //Encabezado de tabla
    headers: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      //{ text: 'Fecha Autoriza', value: 'sp_fecha_firma_aut_vuelta' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: 'Fecha Probable', value: 'sp_fecha_factura_prob_pago' },
      //{ text: 'Concepto', value: 'nom_concepto' },
      { text: 'Descripcion', value: 'sp_descripcion' },
      { text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headersfp: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Fecha Pago', value: 'sp_fecha_pago_cap' },
      { text: 'Tipo Pago', value: 'Nom_tipo_pago' },
      { text: 'Banco', value: 'NomBanco' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headersRecibir: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: 'Fecha Probable', value: 'sp_fecha_factura_prob_pago' },
      { text: 'Descripcion', value: 'sp_descripcion' },
      { text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ], //
    //Para Exportar
    fieldsPagos: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Proveedor: 'sp_pago_nombre_de',
      Fecha_Solicita: 'sp_fecha_solicitud',
      //Fecha_Autoriza: 'sp_fecha_firma_aut_vuelta',
      Fecha_Probable_Pago: 'sp_fecha_factura_prob_pago',
      Concepto: 'nom_concepto',
      Solicitante: 'nombre_sol',
      Importe: 'sp_importe',
    },
    fieldsRecibir: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Proveedor: 'sp_pago_nombre_de',
      Fecha_Solicita: 'sp_fecha_solicitud',
      Fecha_Probable_Pago: 'sp_fecha_factura_prob_pago',
      Descripcion: 'sp_descripcion',
      Solicitante: 'nombre_sol',
      Importe: 'sp_importe',
    },
    fieldsPagados: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Proveedor: 'sp_pago_nombre_de',
      Fecha_Pago: 'sp_fecha_pago_cap',
      Tipo_Pago: 'Nom_tipo_pago',
      Banco: 'NomBanco',
      Cuenta: 'CuentaBancaria',
      Folio_Pago: 'sp_no_folio_pago',
      Poliza_Pago: 'sp_no_poliza_pago',
      Solicitante: 'nombre_sol',
      Importe: 'sp_importe',
    },
    //
    //value: [],
    singleSelect: false,
    selectedRecibe: [],
    solpagosxRecibir: [],
    solpagosxRecibirExportar: [],
    pagados: [],
    pagadosExportar: [],
    solpagos: [],
    solpagosExportar: [],
    tipospago: [],
    ctasbancos: [],
    bancos: [],
    ejercicioRecAut: 0,
    ejercicioCapPag: 0,
    ejercicioPag: 0,
    ejercicios: [],
    editedIndex: -1,
    editedItem: {
      sp_ejercicio: 0,
      sp_id: 0,
      sp_tipo_sol: 0,
      sp_concepto: 0,
      prov_id: 0,
      cuecon_cuenta: '',
      sp_descripcion: '',
      sp_observacion: '',
      sp_importe: 0,
      sp_fecha_solicitud: '',
      sp_estatus: '',
      sp_pago_nombre_de: '',
      sp_tipo_pago: 0,
      sp_no_cuenta_pago: 0,
      sp_banco_pago: 0,
      sp_no_poliza_pago: 0,
      sp_no_folio_pago: 0,
      sp_fecha_pago_cap: '',
    },
    defaultItem: {
      sp_ejercicio: 0,
      sp_id: 0,
      sp_tipo_sol: 0,
      sp_concepto: 0,
      prov_id: 0,
      cuecon_cuenta: '',
      sp_descripcion: '',
      sp_observacion: '',
      sp_importe: 0,
      sp_fecha_solicitud: '',
      sp_estatus: '',
      sp_pago_nombre_de: '',
      sp_tipo_pago: 0,
      sp_no_cuenta_pago: 0,
      sp_banco_pago: 0,
      sp_no_poliza_pago: 0,
      sp_no_folio_pago: 0,
      sp_fecha_pago_cap: '',
    },
  }),

  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      sp_tipo_pago: { required },
      sp_banco_pago: { required },
      sp_no_cuenta_pago: { required },
      sp_no_poliza_pago: { required, minLength: minLength(3), maxLength: maxLength(20) },
      sp_no_folio_pago: { required, minLength: minLength(3), maxLength: maxLength(20) },
      sp_motivo_cancelacion: { minLength: minLength(10), maxLength: maxLength(100) },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      return this.editedIndex === -1
        ? 'Nueva Solicitud de Pagos'
        : 'Pagar Folio # ' + this.editedItem.sp_id
    },
    sp_tipo_pagoErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_tipo_pago.$dirty) return errors
      !this.$v.editedItem.sp_tipo_pago.required && errors.push('Este campo es requerido')
      return errors
    },
    sp_banco_pagoErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_banco_pago.$dirty) return errors
      !this.$v.editedItem.sp_banco_pago.required && errors.push('Este campo es requerido')
      return errors
    },
    sp_no_cuenta_pagoErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_no_cuenta_pago.$dirty) return errors
      !this.$v.editedItem.sp_no_cuenta_pago.required && errors.push('Este campo es requerido')
      return errors
    },
    sp_no_poliza_pagoErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_no_poliza_pago.$dirty) return errors
      !this.$v.editedItem.sp_no_poliza_pago.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.sp_no_poliza_pago.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.sp_no_poliza_pago.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    sp_no_folio_pagoErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_no_folio_pago.$dirty) return errors
      !this.$v.editedItem.sp_no_folio_pago.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.sp_no_folio_pago.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.sp_no_folio_pago.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    motivo_cancela_Errors() {
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

  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  //1ero
  created() {
    this.iniciando()
  },

  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(',', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    //Refresca Datos para la tabla
    async iniciando() {
      let jwt = await getValidToken(this)
      await this.obtenerTiposPago(jwt)
      await this.obtenerBancos(jwt)

      await this.obtenersolPagados(jwt)

      await this.obtenerEjercicios(jwt)
      if (this.ejercicioRecAut == undefined || this.ejercicioRecAut == 0) {
        this.ejercicioRecAut = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosxRecibir(jwt, this.ejercicioRecAut)

      if (this.ejercicioCapPag == undefined || this.ejercicioCapPag == 0) {
        this.ejercicioCapPag = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosxPagar(jwt, this.ejercicioCapPag)

      if (this.ejercicioPag == undefined || this.ejercicioPag == 0) {
        this.ejercicioPag = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenersolPagados(jwt, this.ejercicioPag)
    },

    async refrescaRecibe() {
      let jwt = await getValidToken(this)
      if (this.ejercicioRecAut == undefined || this.ejercicioRecAut == 0) {
        this.ejercicioRecAut = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosxRecibir(jwt, this.ejercicioRecAut)
    },

    async refrescaCaptura() {
      let jwt = await getValidToken(this)
      await this.obtenerTiposPago(jwt)
      await this.obtenerBancos(jwt)
      if (this.ejercicioCapPag == undefined || this.ejercicioCapPag == 0) {
        this.ejercicioCapPag = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosxPagar(jwt, this.ejercicioCapPag)
    },
    async refrescaPagados() {
      let jwt = await getValidToken(this)
      if (this.ejercicioPag == undefined || this.ejercicioPag == 0) {
        this.ejercicioPag = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenersolPagados(jwt, this.ejercicioPag)
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
    //Obtiene todos los Solicitudes de Pago para la tabla hay que cambiar estatus
    async obtenerSolPagosxPagar(jwt, ejercicio) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=sp_estatus&tipo1=igual&valor1=PAGOS&logico2=and&campo2=sp_ejercicio&tipo2=igual&valor2=' +
        ejercicio

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpagos = []
        await this.$store
          .dispatch('solpago/fetchSolPagosCreado', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagos = response.data
              //this.solpagosExportar = response.data
              this.formateoInfoExportar('PAGOS')
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
    async obtenerSolPagosxRecibir(jwt, ejercicio) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=sp_estatus&tipo1=igual&valor1=AUTFIRVTA&logico2=and&campo2=sp_ejercicio&tipo2=igual&valor2=' +
        ejercicio

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpagosxRecibir = []
        await this.$store
          .dispatch('solpago/fetchSolPagosCreado', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagosxRecibir = response.data
              this.formateoInfoExportar('RECIBE_AUTORIZA')
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
    //Obtiene todos los tipos de solicitudes para el select
    async obtenerTiposPago(jwt) {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=TIPPAG&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.tipospago = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.tipospago = response.data
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
    //Obtiene Todos las cuentas de Pago para la tabla
    async obtenerCuentasPago(jwt, banco) {
      this.isLoading = true
      let params = null
      if (banco > 0) {
        params =
          'filtro?campo1=t.clatip_id&tipo1=igual&valor1=CTAPAG&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1&logico3=and&campo3=t.tipo_relacion1&tipo3=igual&valor3=' +
          banco
      } else {
        params =
          'filtro?campo1=t.clatip_id&tipo1=igual&valor1=CTAPAG&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      }
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.ctasbancos = []

        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ctasbancos = response.data
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
    //Obtiene Todos los Bancos para la tabla
    async obtenerBancos(jwt) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=BANCOS&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.bancos = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.bancos = response.data
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
    //***************************************************************************************************** */
    // Editar Tipo
    async editItem(item) {
      this.isEditing = true
      this.ctasbancos = []
      this.editedIndex = this.solpagos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.sp_fecha_solicitud = this.convierteNumeroFecha(
        this.solpagos[this.editedIndex].sp_fecha_solicitud
      )

      if (this.editedItem.sp_fecha_firma_aut_vuelta == null) {
        this.editedItem.sp_fecha_firma_aut_vuelta == ''
      } else {
        this.editedItem.sp_fecha_firma_aut_vuelta = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_firma_aut_vuelta
        )
      }
      if (this.editedItem.sp_fecha_factura_prob_pago == null) {
        this.editedItem.sp_fecha_factura_prob_pago = ''
      } else {
        this.editedItem.sp_fecha_factura_prob_pago = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_factura_prob_pago
        )
      }
      this.editedItem.sp_fecha_elabora = this.convierteNumeroFecha(
        this.solpagos[this.editedIndex].sp_fecha_elabora
      )

      var fecha = new Date()
      this.editedItem.sp_fecha_pago_cap = this.fechaformato(fecha)

      this.dialog = true
    },

    regresarItem(item) {
      const index = this.solpagos.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea regresar a Autorización este registro?') &&
        this.solpagos.splice(index, 1)
      this.regresar(item.sp_id, item.sp_estatus)
    },

    async regresar(sp_id, sp_estatus) {
      this.overlay = true
      this.$v.$touch()

      let body = {
        //_id: this.editedItem.id_tipo,
        sp_motivo_cancelacion: 'Regresa por equivocación',
        sp_estatus: 'AUTFIR',
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = sp_id
      payload.estatus = sp_estatus
      this.$store
        .dispatch('solpago/addCambioEstatus', payload)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se regreso a Firma de Autorización',
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
    // Eliminar Tipo
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
            text: 'El registro se envio para cancelar',
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
        this.dialogv = false
        this.dialogxc = false
        this.isEditing = false
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$v.$reset()
    },
    //Formatos
    fechaformato(f) {
      //console.log(f.getMonth())
      var mes = f.getMonth() + 1
      const fecha = f.getFullYear() + '-' + (mes < 10 ? '0' + mes : mes) + '-' + f.getDate()
      return fecha
    },
    //CONVIERTE NUMERO A FECHA
    convierteNumeroFecha(date) {
      const cadena = date.toString()
      let year = cadena.slice(0, 4)
      let month = cadena.slice(5, 7)
      let day = cadena.slice(8, 10)

      const fecha = year + '-' + month + '-' + day

      return fecha
    },
    convierteNumeroFechaVista(date) {
      //console.log(date)
      let fecha = ''
      if (date == undefined) {
        fecha = '00-00-00'
      } else {
        const cadena = date.toString()
        let year = cadena.slice(2, 4)
        let month = cadena.slice(5, 7)
        let day = cadena.slice(8, 10)

        fecha = day + '-' + month + '-' + year
      }

      return fecha
    },
    // Guardar el Pago
    async save() {
      this.overlay = true
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let tipopago = 0
        if (this.editedItem.sp_tipo_pago.tipo_id == null) {
          tipopago = this.editedItem.sp_tipo_pago
        } else {
          tipopago = this.editedItem.sp_tipo_pago.tipo_id
        }
        let banco = 0
        if (this.editedItem.sp_banco_pago.tipo_id == null) {
          banco = this.editedItem.sp_banco_pago
        } else {
          banco = this.editedItem.sp_banco_pago.tipo_id
        }
        let cuenta = 0
        if (this.editedItem.sp_no_cuenta_pago.tipo_id == null) {
          cuenta = this.editedItem.sp_no_cuenta_pago
        } else {
          cuenta = this.editedItem.sp_no_cuenta_pago.tipo_id
        }

        let body = {
          //id_tipo: this.editedItem.id_tipo,
          //id_tipo: this.editedItem.id_tipo.id_tipo,
          sp_tipo_pago: tipopago,
          sp_banco_pago: banco,
          sp_no_cuenta_pago: cuenta,
          sp_no_poliza_pago: this.editedItem.sp_no_poliza_pago,
          sp_no_folio_pago: this.editedItem.sp_no_folio_pago,
          sp_fecha_pago_cap: this.editedItem.sp_fecha_pago_cap,
          sp_estatus: 'FINPAGO',
        }

        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.editedIndex > -1) {
          payload.id = this.editedItem.sp_id
          payload.ejercicio = this.editedItem.sp_ejercicio
          await this.$store
            .dispatch('solpago/addPagos', payload)
            .then(() => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El Pago se efectuo con éxito',
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
        }
        await this.refrescaCaptura()
        this.close(this.checkbox)
        this.changed = false
      }
    },
    //Obtiene solicitudes Pagadas
    async obtenersolPagados(jwt, ejercicio) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=sp_estatus&tipo1=igual&valor1=FINPAGO&logico2=and&campo2=sp_ejercicio&tipo2=igual&valor2=' +
        ejercicio

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.pagados = []
        await this.$store
          .dispatch('solpago/fetchSolPagosCreado', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.pagados = response.data
              this.formateoInfoExportar('PAGADOS')
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
    async viewItem(item) {
      this.dialogv = true
      this.isEditing = true
      this.editedIndex = this.pagados.indexOf(item)
      this.editedItem = Object.assign({}, item)
      if (this.pagados[this.editedIndex].sp_fecha_pago == null) {
        this.editedItem.sp_fecha_pago = this.convierteNumeroFecha(
          this.pagados[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_pago = this.convierteNumeroFecha(
          this.pagados[this.editedIndex].sp_fecha_pago
        )
      }
      if (this.pagados[this.editedIndex].sp_fecha_pago_cap == null) {
        this.editedItem.sp_fecha_pago_cap = this.convierteNumeroFecha(
          this.pagados[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_pago_cap = this.convierteNumeroFecha(
          this.pagados[this.editedIndex].sp_fecha_pago_cap
        )
      }
    },
    // al escoger direccion solicita
    async setfilterBanco(value) {
      //console.log('Entro a setfilterBanco')
      let jwt = await getValidToken(this)
      //this.prov_temp = value.prov_id
      //console.log(value)
      await this.obtenerCuentasPago(jwt, value.tipo_id)
      //this.isSolicita = false
    },

    async recibir() {
      //console.log('recibir')
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
            sp_estatus: 'PAGOS',
          }
          let payload = { jwt: jwt, body: body }
          payload.id = sp_id
          payload.ejercicio = sp_ejercicio
          await this.$store
            .dispatch('solpago/addGpoAutVta', payload)
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
            text: 'Se recibio correctamente de firma de Autorizacion',
          })
        } else {
          this.$store.commit('ALERT', {
            color: 'error',
            //text: this.error.response.data.msg,
            text: this.error,
            // Enviar a inicio de sesión
          })
        }
        await this.refrescaRecibe()
      }
    },
    formateoInfoExportar(opcion) {
      var i
      if (opcion == 'RECIBE_AUTORIZA') {
        this.solpagosxRecibirExportar = []
        if (this.solpagosxRecibir.length > 0) {
          for (i in this.solpagosxRecibir) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagosxRecibir[i].sp_ejercicio,
              sp_id: this.solpagosxRecibir[i].sp_id,
              sp_pago_nombre_de: this.solpagosxRecibir[i].sp_pago_nombre_de,
              sp_fecha_solicitud: this.formato(
                this.eFormatos.FECHA,
                this.solpagosxRecibir[i].sp_fecha_solicitud
              ),
              sp_fecha_factura_prob_pago: this.formato(
                this.eFormatos.FECHA,
                this.solpagosxRecibir[i].sp_fecha_factura_prob_pago
              ),
              sp_descripcion: this.solpagosxRecibir[i].sp_descripcion,
              nombre_sol: this.solpagosxRecibir[i].nombre_sol,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagosxRecibir[i].sp_importe),
            }
            this.solpagosxRecibirExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'PAGOS') {
        this.solpagosExportar = []
        if (this.solpagos.length > 0) {
          for (i in this.solpagos) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagos[i].sp_ejercicio,
              sp_id: this.solpagos[i].sp_id,
              sp_pago_nombre_de: this.solpagos[i].sp_pago_nombre_de,
              sp_fecha_solicitud: this.formato(
                this.eFormatos.FECHA,
                this.solpagos[i].sp_fecha_solicitud
              ),
              sp_fecha_firma_aut_vuelta: this.formato(
                this.eFormatos.FECHA,
                this.solpagos[i].sp_fecha_firma_aut_vuelta
              ),
              sp_fecha_factura_prob_pago: this.formato(
                this.eFormatos.FECHA,
                this.solpagos[i].sp_fecha_factura_prob_pago
              ),
              nom_concepto: this.solpagos[i].nom_concepto,
              nombre_sol: this.solpagos[i].nombre_sol,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagos[i].sp_importe),
            }
            this.solpagosExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'PAGADOS') {
        this.pagadosExportar = []
        if (this.pagados.length > 0) {
          for (i in this.pagados) {
            let fieldsPagos = {
              sp_ejercicio: this.pagados[i].sp_ejercicio,
              sp_id: this.pagados[i].sp_id,
              sp_pago_nombre_de: this.pagados[i].sp_pago_nombre_de,
              sp_fecha_pago_cap: this.formato(
                this.eFormatos.FECHA,
                this.pagados[i].sp_fecha_pago_cap
              ),
              Nom_tipo_pago: this.pagados[i].Nom_tipo_pago,
              NomBanco: this.pagados[i].NomBanco,
              CuentaBancaria: this.pagados[i].CuentaBancaria,
              sp_no_folio_pago: this.pagados[i].sp_no_folio_pago,
              sp_no_poliza_pago: this.pagados[i].sp_no_poliza_pago,

              nombre_sol: this.pagados[i].nombre_sol,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.pagados[i].sp_importe),
            }
            this.pagadosExportar.push(fieldsPagos)
          }
        }
      }
    },
    async onChangeEjercicioRecAut(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioRecAut = value.sp_ejercicio
      await this.obtenerSolPagosxRecibir(jwt, value.sp_ejercicio)
    },
    async onChangeEjercicioCapPag(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioCapPag = value.sp_ejercicio
      await this.obtenerSolPagosxPagar(jwt, value.sp_ejercicio)
    },
    async onChangeEjercicioPag(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioPag = value.sp_ejercicio
      await this.obtenersolPagados(jwt, value.sp_ejercicio)
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
<style lang="scss">
.v-text {
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
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
</style>
