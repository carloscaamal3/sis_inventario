<template>
  <v-tabs fixed-tabs background-color="indigo" dark>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <!-- <v-tab @change="iniciando"> -->
    <v-tab @change="RefreshSolPagos">
      <v-icon left>mdi-file-document-edit-outline </v-icon>Captura Ejercido
    </v-tab>
    <v-tab @change="RefreshSolPagosxEnviar">
      <v-icon left> mdi-clipboard-arrow-right-outline </v-icon>Envio Ejercido
    </v-tab>
    <v-tab @change="RefreshEjercidos">
      <v-icon right> mdi-file-document </v-icon>Polizas Ejercido
    </v-tab>
    <!-- CAPTURA EJERCIDO -->
    <v-tab-item>
      <base-material-card color="blue" icon="mdi-clipboard-list-outline" inline class="px-5 py-3">
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>
        <template v-slot:corner-button>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="ejercicioCapEje"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioCapEje"
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
            <!-- Empieza DataExporter Captura Ejercido-->
            <DataExporter
              :dataArray="solpagosExportar"
              :dataFields="fieldsCapEje"
              fileName="capturaejercido"
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
        <v-dialog v-model="dialogxc" persistent max-width="800px">
          <v-card class="v-text">
            <v-card-title class="v-text">
              <span>Cancelar Documento: {{ editedItem.sp_id }}</span>
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
              <v-btn color="blue darken-1" text @click="borrar()">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Termina Dialogo para motivo de cancelacion -->
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
                      disabled
                    ></v-text-field>
                  </v-col>
                  <!-- Campo CONCEPTO -->
                  <v-col cols="8" class="v-text">
                    <v-text-field
                      v-model="editedItem.nom_concepto"
                      label="Concepto"
                      disabled
                    ></v-text-field>
                    <!-- @input="changed = true" -->
                  </v-col>

                  <!-- Campo Descripcion -->
                  <v-col cols="12" class="v-text">
                    <v-text-field
                      v-model="editedItem.sp_descripcion"
                      label="Descripción"
                      disabled
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
                      disabled
                      class="v-text"
                    ></v-text-field>
                    <!-- @input="changed = true" -->
                  </v-col>
                  <!-- Campo Importe -->
                  <v-col cols="4" class="v-text">
                    <v-text-field
                      class="text-xs-right v-text"
                      v-model="editedItem.sp_importe"
                      label="Importe"
                      prefix="$"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="v-text">
                    <v-text-field
                      class="text-xs-right v-text"
                      v-model="editedItem.foliosComprometidos"
                      label="Comprometido(s)"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <!-- ********************************************************************* -->
                  <!-- DATOS DE CAPTURA **************************************************** -->
                  <!-- Campo NUMERO DE POLIZA -->
                  <v-col cols="4" class="v-text">
                    <v-text-field
                      v-model="editedItem.sp_poliza_ejercido"
                      dense
                      label="No. de Poliza Ejercido"
                      :error-messages="sp_poliza_ejercidoErrors"
                      @input="$v.editedItem.sp_poliza_ejercido.$reset(), (changed = true)"
                      @blur="$v.editedItem.sp_poliza_ejercido.$touch()"
                    ></v-text-field>
                  </v-col>
                  <!-- Campo NUMERO DE FOLIO -->
                  <v-col cols="4" class="v-text">
                    <v-text-field
                      v-model="editedItem.sp_folio_ejercido"
                      dense
                      label="No. de Ejercido"
                      :error-messages="sp_folio_ejercidoErrors"
                      @input="$v.editedItem.sp_folio_ejercido.$reset(), (changed = true)"
                      @blur="$v.editedItem.sp_folio_ejercido.$touch()"
                    ></v-text-field>
                  </v-col>
                  <!-- Campo Fecha Ejercido Cap -->
                  <v-col cols="4" class="v-text">
                    <v-menu
                      v-model="fromDateFecejercidoCap"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.sp_fecha_ejercido_cap"
                          label="Fecha Ejercido"
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
                        v-model="editedItem.sp_fecha_ejercido_cap"
                        @input=";(fromDateFecejercidoCap = false), (changed = true)"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
              <small class="v-text">*Campo Obligatorio</small>
            </v-card-text>

            <v-card-actions class="v-text">
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
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
            <!-- <v-icon small @click="deleteItem(item)">mdi-delete</v-icon> -->
          </template>

          <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
            <div class="name-info-title">
              {{ convierteNumeroFecha(item.sp_fecha_solicitud) }}
            </div>
          </template>
          <template v-slot:item.sp_importe="{ item }">
            {{ formatPrice(item.sp_importe) }}
          </template>

          <!-- <template v-slot:item.data-table-select="{ item, isSelected, select }">
            <v-simple-checkbox
              :value="isSelected"
              :readonly="item.sp_user_ejercido == undefined"
              :disabled="item.sp_user_ejercido == undefined"
              @input="select($event)"
            ></v-simple-checkbox>
          </template> -->

          <template v-slot:no-data> ¡No hay datos para mostrar! </template>
        </v-data-table>
      </base-material-card>
    </v-tab-item>
    <!-- ENVIO EJERCIDO -->
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
                @click="enviar"
                >Enviar</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="ejercicioEnvEje"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioEnvEje"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>

          <!-- <v-btn small class="ma-2" elevation="2" color="blue" text @click="imprimeFormato(1)">Imprimir</v-btn> -->
        </template>
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>
        <!-- <v-overlay :value="overlay">
        <v-progress-circular :size="50" color="green" indeterminate></v-progress-circular>
      </v-overlay> -->
        <v-row>
          <v-col cols="6">
            <!-- Empieza DataExporter ENVIO EJERCIDO-->
            <DataExporter
              :dataArray="solpagosxEnviarExportar"
              :dataFields="fieldsEnvEje"
              fileName="enviarEjercido"
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
        <v-dialog v-model="dialogxc" persistent max-width="800px">
          <v-card class="v-text">
            <v-card-title class="v-text">
              <span>Cancelar Documento: {{ editedItem.sp_id }}</span>
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
              <v-btn color="blue darken-1" text @click="borrar()">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Termina Dialogo para motivo de cancelacion -->
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
                      disabled
                    ></v-text-field>
                  </v-col>
                  <!-- Campo CONCEPTO -->
                  <v-col cols="8" class="v-text">
                    <v-text-field
                      v-model="editedItem.nom_concepto"
                      label="Concepto"
                      disabled
                    ></v-text-field>
                    <!-- @input="changed = true" -->
                  </v-col>

                  <!-- Campo Descripcion -->
                  <v-col cols="12" class="v-text">
                    <v-text-field
                      v-model="editedItem.sp_descripcion"
                      label="Descripción"
                      disabled
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
                      disabled
                      class="v-text"
                    ></v-text-field>
                    <!-- @input="changed = true" -->
                  </v-col>
                  <!-- Campo Importe -->
                  <v-col cols="4" class="v-text">
                    <v-text-field
                      class="text-xs-right v-text"
                      v-model="editedItem.sp_importe"
                      label="Importe"
                      prefix="$"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="v-text">
                    <v-text-field
                      class="text-xs-right v-text"
                      v-model="editedItem.foliosComprometidos"
                      label="Comprometido(s)"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <!-- ********************************************************************* -->
                  <!-- DATOS DE CAPTURA **************************************************** -->
                  <!-- Campo NUMERO DE POLIZA -->
                  <v-col cols="4" class="v-text">
                    <v-text-field
                      v-model="editedItem.sp_poliza_ejercido"
                      dense
                      label="No. de Poliza Ejercido"
                      :error-messages="sp_poliza_ejercidoErrors"
                      @input="$v.editedItem.sp_poliza_ejercido.$reset(), (changed = true)"
                      @blur="$v.editedItem.sp_poliza_ejercido.$touch()"
                    ></v-text-field>
                  </v-col>
                  <!-- Campo NUMERO DE FOLIO -->
                  <v-col cols="4" class="v-text">
                    <v-text-field
                      v-model="editedItem.sp_folio_ejercido"
                      dense
                      label="No. de Ejercido"
                      :error-messages="sp_folio_ejercidoErrors"
                      @input="$v.editedItem.sp_folio_ejercido.$reset(), (changed = true)"
                      @blur="$v.editedItem.sp_folio_ejercido.$touch()"
                    ></v-text-field>
                  </v-col>
                  <!-- Campo Fecha Ejercido Cap -->
                  <v-col cols="4" class="v-text">
                    <v-menu
                      v-model="fromDateFecejercidoCap"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.sp_fecha_ejercido_cap"
                          label="Fecha Ejercido"
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
                        v-model="editedItem.sp_fecha_ejercido_cap"
                        @input=";(fromDateFecejercidoCap = false), (changed = true)"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
              <small class="v-text">*Campo Obligatorio</small>
            </v-card-text>

            <v-card-actions class="v-text">
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Termina Dialogo -->
        <!-- Aqui va progress linear -->
        <v-divider class="mt-3" />
        <v-data-table
          v-model="selected"
          :single-select="singleSelect"
          item-key="sp_id"
          show-select
          :headers="headersEnv"
          :items="solpagosxEnviar"
          dense
          :search.sync="search"
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <!--           <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon> 
            
          </template>
 -->
          <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
            <div class="name-info-title">
              {{ convierteNumeroFecha(item.sp_fecha_solicitud) }}
            </div>
          </template>
          <template v-slot:item.sp_importe="{ item }">
            {{ formatPrice(item.sp_importe) }}
          </template>

          <!--  <template v-slot:item.data-table-select="{ item, isSelected, select }">
            <v-simple-checkbox
              :value="isSelected"
              :readonly="item.sp_user_ejercido == undefined"
              :disabled="item.sp_user_ejercido == undefined"
              @input="select($event)"
            ></v-simple-checkbox>
          </template> -->

          <template v-slot:no-data> ¡No hay datos para mostrar! </template>
        </v-data-table>
      </base-material-card>
    </v-tab-item>
    <!-- POLIZAS EJERCIDO -->
    <v-tab-item>
      <base-material-card color="blue" icon="mdi-file-document" inline class="px-5 py-3">
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>
        <template v-slot:corner-button>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="ejercicioPolEje"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioPolEje"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </template>
        <v-row>
          <v-col cols="6">
            <!-- Empieza DataExporter POLIZAS EJERCIDO-->
            <DataExporter
              :dataArray="ejercidosExportar"
              :dataFields="fieldsPolizas"
              fileName="polizasEjercido"
              pdfView="none"
            />
            <!-- Termina DataExporter -->
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="searche"
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

        <v-divider class="mt-3" />
        <v-data-table
          :headers="headerse"
          :items="ejercidos"
          dense
          :search.sync="searche"
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <!-- <v-icon small @click="deleteItem(item)">mdi-delete</v-icon> -->
            <v-icon small @click="printItem(item)">mdi-printer</v-icon>
            <v-icon small class="mr-2" @click="Editar(item)">mdi-pencil</v-icon>
          </template>

          <template v-slot:[`item.fecha_ejercido_cap`]="{ item }">
            <div class="name-info-title">
              {{ convierteNumeroFecha(item.sp_fecha_ejercido_cap) }}
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
import { imprimeGrupoEjercido } from '@/store/modules/impresiones.store.js'
import DataExporter from '@/components/general/DataExporter.vue'
import * as tools from '@/store/modules/tools.store.js'

//import DataExporter from '@/components/general/DataExporter.vue
export default {
  components: {
    ConfirmationDialog,
    DataExporter,
    //Status,
    //
  },

  data: () => ({
    eFormatos: tools.formatos,
    //para imprimir
    solpagosimp: [],
    //para marcardo
    disabledCount: 0,
    singleSelect: false,
    //fechas
    fromDateMenu: false,
    fromDateFecFact: false,
    fromDateFecPoPago: false,
    fromDateFecejercidoCap: false,
    minDate: '2021-01-01',
    maxDate: '2050-01-31',
    usuario: JSON.parse(localStorage.getItem('user')),
    search: undefined,
    searche: undefined,
    selected: [],
    isLoading: false,
    checkbox: false,
    //isEditing: false,
    dialog: false,
    dialogxc: false,
    isSure: false,
    overlay: false,
    changed: false,
    //Encabezado de tabla
    headers: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: 'Concepto', value: 'nom_concepto' },
      { text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headersEnv: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: 'Concepto', value: 'nom_concepto' },
      { text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Importe', value: 'sp_importe' },
    ],

    headerse: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      { text: 'Folio Ejercido', value: 'sp_folio_ejercido' },
      { text: 'Poliza', value: 'sp_poliza_ejercido' },
      { text: 'Fecha Ejercido', value: 'sp_fecha_ejercido_cap' },
      { text: 'Usuario', value: 'nombre_ejercido' },
      { text: 'Grupo', value: 'sp_id_gpo_ejercido' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //
    //value: [],
    solpago: [],
    ejercicioCapEje: 0,
    ejercicioEnvEje: 0,
    ejercicioPolEje: 0,
    ejercicios: [],
    solpagos: [],
    solpagosExportar: [],
    solpagosxEnviar: [],
    solpagosxEnviarExportar: [],
    ejercidos: [],
    ejercidosExportar: [],
    sgteGpoFolio: 0,
    //tipospago: [],
    //ctasbancos: [],
    //bancos: [],
    editedIndex: -1,
    editedItem: {
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
      sp_poliza_ejercido: 0,
      sp_folio_ejercido: 0,
    },
    defaultItem: {
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
      sp_poliza_ejercido: 0,
      sp_folio_ejercido: 0,
    },
    //Para Exportar
    fieldsCapEje: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Proveedor: 'sp_pago_nombre_de',
      Fecha_Solicita: 'sp_fecha_solicitud',
      Concepto: 'nom_concepto',
      Solicitante: 'nombre_sol',
      Importe: 'sp_importe',
    },
    fieldsEnvEje: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Proveedor: 'sp_pago_nombre_de',
      Fecha_Solicita: 'sp_fecha_solicitud',
      Concepto: 'nom_concepto',
      Solicitante: 'nombre_sol',
      Importe: 'sp_importe',
    },
    fieldsPolizas: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Folio_Ejercido: 'sp_folio_ejercido',
      Poliza: 'sp_poliza_ejercido',
      Fecha_Ejercido: 'sp_fecha_ejercido_cap',
      Usuario: 'nombre_ejercido',
      Grupo: 'sp_id_gpo_ejercido',
    },
  }),

  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      sp_poliza_ejercido: { required, minLength: minLength(3), maxLength: maxLength(20) },
      sp_motivo_cancelacion: { required, minLength: minLength(10), maxLength: maxLength(100) },
      sp_folio_ejercido: { required, minLength: minLength(3), maxLength: maxLength(20) },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      return this.editedIndex === -1
        ? 'Nueva Solicitud de Pagos'
        : 'Capturar Ejercido al Folio # ' + this.editedItem.sp_id
    },
    sp_poliza_ejercidoErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_poliza_ejercido.$dirty) return errors
      !this.$v.editedItem.sp_poliza_ejercido.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.sp_poliza_ejercido.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.sp_poliza_ejercido.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    sp_folio_ejercidoErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_folio_ejercido.$dirty) return errors
      !this.$v.editedItem.sp_folio_ejercido.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.sp_folio_ejercido.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.sp_folio_ejercido.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
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

  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  //1ero
  created() {
    this.iniciando()
    //const self = this
    //this.solpagos.map((item) => {if (item.sp_user_ejercido == undefined) self.disabledCount += 1})
  },

  methods: {
    //para no seleccionar folios que no tienen captura de ejercido
    /*
    selectAllToggle(props) {
      if (this.selected.length != this.solpagos.length - this.disabledCount) {
        this.selected = []
        const self = this
        props.items.forEach((item) => {
          //console.log(item.sp_user_ejercido)
          if (!item.sp_user_ejercido == undefined) {
            self.selected.push(item)
          }
        })
      } else this.selected = []
    },
    */
    //Formatos
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(',', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    async RefreshSolPagos() {
      let jwt = await getValidToken(this)
      await this.obtenerEjercicios(jwt)
      if (this.ejercicioCapEje == undefined || this.ejercicioCapEje == 0) {
        this.ejercicioCapEje = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagos(jwt, this.ejercicioCapEje)
    },
    async RefreshSolPagosxEnviar() {
      let jwt = await getValidToken(this)
      if (this.ejercicioEnvEje == undefined || this.ejercicioEnvEje == 0) {
        this.ejercicioEnvEje = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosxEnviar(jwt, this.ejercicioEnvEje)
    },
    async RefreshEjercidos() {
      let jwt = await getValidToken(this)
      await this.obtenerSolPagosxEnviar(jwt, this.ejercicioEnvEje)
      if (this.ejercicioPolEje == undefined || this.ejercicioPolEje == 0) {
        this.ejercicioPolEje = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerEjercidos(jwt, this.ejercicioPolEje)
    },

    //Refresca Datos para la tabla
    async iniciando() {
      let jwt = await getValidToken(this)
      await this.obtenerEjercicios(jwt)

      if (this.ejercicioCapEje == undefined || this.ejercicioCapEje == 0) {
        this.ejercicioCapEje = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagos(jwt, this.ejercicioCapEje)

      if (this.ejercicioEnvEje == undefined || this.ejercicioEnvEje == 0) {
        this.ejercicioEnvEje = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosxEnviar(jwt, this.ejercicioEnvEje)
      if (this.ejercicioPolEje == undefined || this.ejercicioPolEje == 0) {
        this.ejercicioPolEje = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerEjercidos(jwt, this.ejercicioPolEje)
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
    //Obtiene Ejercidos de solicitudes
    async obtenerEjercidos(jwt, ejercicio) {
      this.isLoading = true
      let params = null
      params = 'sp_ejercicio = ' + ejercicio + ' and sp_poliza_ejercido > 0/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.ejercidos = []
        await this.$store
          .dispatch('consulta/fetchgetEjercidos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ejercidos = response.data
              this.formateoInfoExportar('POLIZAS_EJERCIDOS')
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
    async obtenerSolPagos(jwt, ejercicio) {
      //console.log('Entro a: obtenerSolPagos')
      this.isLoading = true
      let params = null
/*       params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_estatus not in ("CANCELAR", "XCANCELAR") and ifnull(sp_id_gpo_ejercido,0) = 0 and not sp_concepto in (23,24) and ifnull(sp_folio_ejercido,0) = 0/sp_id' */

      //RGP-14/AGOSTO/2023
      params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_estatus not in ("CANCELAR", "XCANCELAR") and ifnull(sp_id_gpo_ejercido,0) = 0 and not sp_concepto in (select ce_concepto_p from casos_especiales where ce_activo = 1) and ifnull(sp_folio_ejercido,0) = 0/sp_id'

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpagos = []
        await this.$store
          //.dispatch('solpago/fetchSolPagosCreado', payload)
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagos = response.data
              this.formateoInfoExportar('CAPTURA_EJERCIDO')
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
    //Obtiene todos por enviar
    async obtenerSolPagosxEnviar(jwt, ejercicio) {
      //console.log('Entro a: obtenerSolPagosxEnviar')
      this.isLoading = true
      let params = null
      params =
/*         'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_estatus not in ("CANCELAR", "XCANCELAR") and ifnull(sp_id_gpo_ejercido,0) = 0 and not sp_concepto in (23,24) and ifnull(sp_folio_ejercido,0) > 0/sp_id'
 */
//RGP-14/AGOSTO/2023


        params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_estatus not in ("CANCELAR", "XCANCELAR") and ifnull(sp_id_gpo_ejercido,0) = 0 and not sp_concepto in (select ce_concepto_p from casos_especiales where ce_activo = 1) and ifnull(sp_folio_ejercido,0) > 0/sp_id'

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpagosxEnviar = []
        this.selected = []
        await this.$store
          //.dispatch('solpago/fetchSolPagosCreado', payload)
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagosxEnviar = response.data
              this.formateoInfoExportar('ENVIO_EJERCIDO')
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
    async obtenerSolPago(jwt, folio, ejercicio) {
      this.isLoading = true
      let params = null
      if (folio > 0) {
        params = 'sp_id = ' + folio + ' and sp_ejercicio = ' + ejercicio + '/sp_id'
      } else {
/*         params =
          'sp_tipo_sol = 1 and sp_estatus not in ("CANCELAR", "XCANCELAR") and ifnull(sp_id_gpo_ejercido,0) = 0 and not sp_concepto in (23,24)/sp_id'
 */
      //RGP-14/AGOSTO/2023
        params =
          'sp_tipo_sol = 1 and sp_estatus not in ("CANCELAR", "XCANCELAR") and ifnull(sp_id_gpo_ejercido,0) = 0 and not sp_concepto in (select ce_concepto_p from casos_especiales where ce_activo = 1)/sp_id'

      }
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpago = []
        await this.$store
          //.dispatch('solpago/fetchSolPagosCreado', payload)
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpago = response.data
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

    //***************************************************************************************************** */
    //Editar Ejercido
    async Editar(item) {
      let jwt = await getValidToken(this)
      await this.obtenerSolPago(jwt, item.sp_id, item.sp_ejercicio)
      this.editedIndex = 0
      this.editedItem = Object.assign({}, this.solpago[this.editedIndex])

      this.editedItem.sp_fecha_solicitud = this.convierteNumeroFecha(
        this.solpago[this.editedIndex].sp_fecha_solicitud
      )

      if (this.editedItem.sp_fecha_firma_aut_vuelta == null) {
        this.editedItem.sp_fecha_firma_aut_vuelta == ''
      } else {
        this.editedItem.sp_fecha_firma_aut_vuelta = this.convierteNumeroFecha(
          this.solpago[this.editedIndex].sp_fecha_firma_aut_vuelta
        )
      }
      if (this.editedItem.sp_fecha_factura_prob_pago == null) {
        this.editedItem.sp_fecha_factura_prob_pago = ''
      } else {
        this.editedItem.sp_fecha_factura_prob_pago = this.convierteNumeroFecha(
          this.solpago[this.editedIndex].sp_fecha_factura_prob_pago
        )
      }
      this.editedItem.sp_fecha_elabora = this.convierteNumeroFecha(
        this.solpago[this.editedIndex].sp_fecha_elabora
      )

      this.editedItem.sp_fecha_ejercido_cap = this.convierteNumeroFecha(
        this.solpago[this.editedIndex].sp_fecha_ejercido_cap
      )

      this.dialog = true
    },
    // Agregar Ejercido
    async editItem(item) {
      //this.isEditing = true
      this.editedIndex = this.solpagos.indexOf(item)
      //console.log('this.editedIndex' + this.editedIndex)
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
      this.editedItem.sp_fecha_ejercido_cap = this.fechaformato(fecha)

      this.dialog = true
    },
    // Eliminar Tipo
    deleteItem(item) {
      //this.isEditing = true
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
        this.dialogxc = false
        //this.isEditing = false
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$v.$reset()
    },
    fechaformato(f) {
      //console.log(f.getMonth())
      var mes = f.getMonth() + 1
      const fecha = f.getFullYear() + '-' + (mes < 10 ? '0' + mes : mes) + '-' + f.getDate()
      return fecha
    },
    //CONVIERTE NUMERO A FECHA
    convierteNumeroFecha(date) {
      const cadena = date.toString()
      let year = cadena.slice(2, 4)
      let month = cadena.slice(5, 7)
      let day = cadena.slice(8, 10)

      //const fecha = year + '-' + month + '-' + day
      const fecha = day + '-' + month + '-' + year

      return fecha
    },
    // Guardar el Pago
    async save() {
      this.overlay = true
      this.$v.$touch()
      //if (!this.$v.$invalid) {
      let body = {
        //id_tipo: this.editedItem.id_tipo,
        //id_tipo: this.editedItem.id_tipo.id_tipo,
        sp_poliza_ejercido: this.editedItem.sp_poliza_ejercido,
        sp_fecha_ejercido_cap: this.editedItem.sp_fecha_ejercido_cap,
        sp_folio_ejercido: this.editedItem.sp_folio_ejercido,
      }

      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      if (this.editedIndex > -1) {
        payload.id = this.editedItem.sp_id
        payload.ejercicio = this.editedItem.sp_ejercicio
        await this.$store
          .dispatch('solpago/addEjercido', payload)
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
            })
            this.overlay = false
          })
        //Object.assign(this.solpagos[this.editedIndex], this.editedItem)
      }
      await this.RefreshSolPagos()
      this.close(this.checkbox)
      this.changed = false

      //}
    },
    //Enviar Ejercidos
    async enviar() {
      //console.log(this.selected.length)
      if (this.selected.length > 0) {
        this.sgteGpoFolio = 0
        let jwt = await getValidToken(this)
        let sp_id = 0
        let sp_ejercicio = 0
        let body = {}
        let payload = {}
        this.sgteGpoFolio = 0
        for (var i in this.selected) {
          //console.log('Entro al for')
          sp_id = this.selected[i].sp_id
          sp_ejercicio = this.selected[i].sp_ejercicio
          //console.log('sgteGpoFolio: ' + this.sgteGpoFolio)
          if (this.sgteGpoFolio == 0) {
            await this.obtenerIdGrupoEjercido(jwt)
          }
          //console.log('sgteGpoFolio: ' + this.sgteGpoFolio)
          if (this.sgteGpoFolio > 0) {
            body = {
              sp_id_gpo_ejercido: this.sgteGpoFolio,
            }
            payload = { jwt: jwt, body: body }
            payload.id = sp_id
            payload.ejercicio = sp_ejercicio
            await this.$store
              .dispatch('solpago/addGpoEnviaEjercido', payload)
              .then(() => {
                this.error = ''
              })
              .catch((err) => {
                this.error = err
              })
          }
        }
        if (this.error == '') {
          if (this.sgteGpoFolio > 0) {
            imprimeGrupoEjercido(this.sgteGpoFolio, 'EJERCIDO', this)
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
        //await this.iniciando()
        await this.RefreshSolPagosxEnviar()
        //console.log(jwt)
      }
    },
    //Obtiene todos los Solicitudes de Pago para la tabla
    async obtenerIdGrupoEjercido(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('solpago/fetchSgteGpoEjercido', payload)
          .then((response) => {
            //console.log(response)
            this.sgteGpoFolio = response.data[0].sgteGpoEjercidos
            this.isLoading = false
          })
          .catch((err) => {
            this.isLoading = false
            this.error = err
            return 0
          })
      }
    },
    printItem(item) {
      this.editedItem = Object.assign({}, item)
      imprimeGrupoEjercido(this.editedItem.sp_id_gpo_ejercido, 'EJERCIDO', this)
    },
    formateoInfoExportar(opcion) {
      var i
      if (opcion == 'CAPTURA_EJERCIDO') {
        if (this.solpagos.length > 0) {
          this.solpagosExportar = []
          for (i in this.solpagos) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagos[i].sp_ejercicio,
              sp_id: this.solpagos[i].sp_id,
              sp_pago_nombre_de: this.solpagos[i].sp_pago_nombre_de,
              sp_fecha_solicitud: this.formato(
                this.eFormatos.FECHA,
                this.solpagos[i].sp_fecha_solicitud
              ),
              nombre_sol: this.solpagos[i].nombre_sol,
              nom_concepto: this.solpagos[i].nom_concepto,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagos[i].sp_importe),
            }
            this.solpagosExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'ENVIO_EJERCIDO') {
        if (this.solpagosxEnviar.length > 0) {
          this.solpagosxEnviarExportar = []
          for (i in this.solpagosxEnviar) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagosxEnviar[i].sp_ejercicio,
              sp_id: this.solpagosxEnviar[i].sp_id,
              sp_pago_nombre_de: this.solpagosxEnviar[i].sp_pago_nombre_de,
              sp_fecha_solicitud: this.formato(
                this.eFormatos.FECHA,
                this.solpagosxEnviar[i].sp_fecha_solicitud
              ),
              nombre_sol: this.solpagosxEnviar[i].nombre_sol,
              nom_concepto: this.solpagosxEnviar[i].nom_concepto,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagosxEnviar[i].sp_importe),
            }
            this.solpagosxEnviarExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'POLIZAS_EJERCIDOS') {
        this.ejercidosExportar = []
        if (this.ejercidos.length > 0) {
          for (i in this.ejercidos) {
            let fieldsPagos = {
              sp_ejercicio: this.ejercidos[i].sp_ejercicio,
              sp_id: this.ejercidos[i].sp_id,
              sp_folio_ejercido: this.ejercidos[i].sp_folio_ejercido,
              sp_poliza_ejercido: this.ejercidos[i].sp_poliza_ejercido,
              sp_fecha_ejercido_cap: this.formato(
                this.eFormatos.FECHA,
                this.ejercidos[i].sp_fecha_ejercido_cap
              ),

              nombre_ejercido: this.ejercidos[i].nombre_ejercido,
              sp_id_gpo_ejercido: this.ejercidos[i].sp_id_gpo_ejercido,

              //nom_concepto: this.ejercidos[i].nom_concepto,
              //sp_importe: this.formato(this.eFormatos.MONEDA, this.ejercidos[i].sp_importe),
            }
            this.ejercidosExportar.push(fieldsPagos)
          }
        }
      }
    },
    async onChangeEjercicioCapEje(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioCapEje = value.sp_ejercicio
      await this.obtenerSolPagos(jwt, value.sp_ejercicio)
    },
    async onChangeEjercicioEnvEje(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioEnvEje = value.sp_ejercicio
      await this.obtenerSolPagosxEnviar(jwt, value.sp_ejercicio)
    },
    async onChangeEjercicioPolEje(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioPolEje = value.sp_ejercicio
      await this.obtenerEjercidos(jwt, value.sp_ejercicio)
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
  font-weight: 500;
}
</style>
