<template>
  <v-tabs fixed-tabs background-color="indigo" dark>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab key="tab0"> <v-icon left> mdi-file-document-edit-outline </v-icon> Recibir </v-tab>
    <v-tab key="tab1"> <v-icon left> mdi-file-document-edit-outline </v-icon> Captura </v-tab>
    <v-tab-item key="tab0">
      <v-container>
        <base-material-card
          color="blue"
          icon="mdi-file-document-edit-outline"
          inline
          class="px-5 py-3"
        >
          <v-spacer></v-spacer>
          <template v-slot:after-heading></template>
          <!-- Texto del boton NUEVO -->
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
                  @click="recibeOrden"
                  >Recibir</v-btn
                >
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
                  :disabled="usuario.nom_rol != 'SUPERVISOR' || isEditing"
                  hint="Seleciona Ejercicio"
                  @change="onChangeEjercicioRec"
                  return-object
                >
                </v-select>
              </v-col>
            </v-row>
          </template>
          <v-divider class="mt-3" />
          <v-data-table
            :headers="headersRecibe"
            :items="solPagosRecibe"
            :single-select="singleSelect"
            item-key="sp_id"
            show-select
            v-model="selected"
            dense
            :search.sync="search"
            :loading="isLoading"
            loading-text="Cargando... Espere por favor"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
              <div class="name-info-title">{{ convierteNumeroFecha(item.sp_fecha_solicitud) }}</div>
            </template>
            <template v-slot:item.sp_importe="{ item }">
              {{ formatPrice(item.sp_importe) }}
            </template>
            <template v-slot:item.sp_saldo="{ item }">
              {{ formatPrice(item.sp_saldo) }}
            </template>
            <template v-slot:[`item.info`]="{ item }">
              <div class="name-info-title">{{ item.nom_tipo_sol }}</div>
              <div class="mail-info-subtitle">{{ item.nom_concepto }}</div>
              <div class="mail-info-subtitle">
                {{ convierteNumeroFechaVista(item.sp_fecha_elabora) }}
              </div>
            </template>

            <template v-slot:[`item.prov`]="{ item }">
              <!-- <div class="name-info-title">{{ item.prov_razon_social }}</div> -->
              <div class="name-info-title">{{ item.sp_pago_nombre_de }}</div>
              <div class="mail-info-subtitle">{{ item.cuecon_cuenta }}</div>
            </template>

            <template v-slot:[`item.desc`]="{ item }">
              <div class="name-info-title">{{ item.sp_descripcion }}</div>
              <div class="mail-info-subtitle">{{ item.nom_user_elabora }}</div>
            </template>

            <template v-slot:no-data>
              <!-- <v-btn color="primary">Reset</v-btn> -->
              ¡No hay datos para mostrar!
            </template>
          </v-data-table>
        </base-material-card>
      </v-container>
    </v-tab-item>
    <v-tab-item key="tab1">
      <v-container id="data-tables" tag="section">
        <base-material-card
          color="blue"
          icon="mdi-file-document-edit-outline"
          inline
          class="px-5 py-3"
        >
          <v-spacer></v-spacer>
          <template v-slot:after-heading></template>
          <!-- Texto del boton NUEVO -->
          <template v-slot:corner-button>
            <v-row>
              <!-- <v-col cols="4">
            <v-btn
              small
              class="ma-2"
              elevation="2"
              color="blue"
              @click="nuevaPreCaptura"
              @click.stop="dialog = true"
              >Nueva Pre Captura</v-btn
            >
          </v-col> -->

              <v-col cols="6">
                <v-btn
                  small
                  class="ma-2"
                  elevation="2"
                  color="blue"
                  @click="nuevaCaptura"
                  @click.stop="dialog = true"
                  >Nueva Captura</v-btn
                >
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
                  :disabled="usuario.nom_rol != 'SUPERVISOR' || isEditing"
                  hint="Seleciona Ejercicio"
                  @change="onChangeEjercicio"
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
              <!-- Empieza DataExporter TABLA PRINC -->
              <DataExporter
                :dataArray="solpagosExportar"
                :dataFields="fieldsCreados"
                fileName="creados"
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

          <!-- Dialogo Resumen antes de  finalizar CE-->
          <v-dialog v-model="dialogfince" max-width="800px">
            <base-material-card
              color="primary"
              icon="mdi-clipboard-arrow-right-outline"
              inline
              class="px-5 py-3"
            >
              <template v-slot:corner-button>
                <v-btn
                  small
                  class="ma-2"
                  elevation="2"
                  color="primary"
                  :disabled="selected.length == 0"
                  text
                  @click="save"
                  >Guardar</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Resumen de Casos Especiales</span>
                  <v-img src="@/assets/logo_ivey.jpg" width="20%" height="20%"></v-img>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <div class="left">
                          <p class="label">Folio(s) de Comprobación:&nbsp;&nbsp;&nbsp;</p>
                        </div>
                        <div>
                          <p class="valor">{{ editedItem.sp_folio_comprobacion }}</p>
                        </div>
                      </v-col>

                      <v-col cols="12">
                        <div class="left">
                          <p class="label">Saldo a Comprobar:&nbsp;&nbsp;&nbsp;</p>
                        </div>
                        <div class="right">
                          <p class="valor">{{ formato(eFormatos.MONEDA, this.saldoxafectar) }}</p>
                        </div>
                      </v-col>

                      <v-col cols="12">
                        <div class="left">
                          <p class="label">Importe a Comprobar:&nbsp;&nbsp;&nbsp;</p>
                        </div>
                        <div>
                          <p class="valor right">
                            {{ formato(eFormatos.MONEDA, editedItem.sp_importe) }}
                          </p>
                        </div>
                      </v-col>

                      <v-col cols="12">
                        <div class="left">
                          <p class="label">Saldo:&nbsp;&nbsp;&nbsp;</p>
                        </div>
                        <div class="right">
                          <p class="valor">
                            {{
                              formato(eFormatos.MONEDA, this.saldoxafectar - editedItem.sp_importe)
                            }}
                          </p>
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <div class="right" v-if="this.saldoxafectar - editedItem.sp_importe > 0">
                          <v-checkbox
                            v-model="checkboxSaldo"
                            label="Devolver Efectivo ?"
                          ></v-checkbox>
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </base-material-card>
          </v-dialog>

          <!-- Dialogo para escoger casos especiales -->
          <v-dialog v-model="dialogce" max-width="800px">
            <base-material-card
              color="primary"
              icon="mdi-clipboard-arrow-right-outline"
              inline
              class="px-5 py-3"
            >
              <template v-slot:corner-button>
                <v-btn
                  small
                  class="ma-2"
                  elevation="2"
                  color="primary"
                  :disabled="selected.length == 0"
                  text
                  @click="aceptarce"
                  >Aceptar</v-btn
                >
              </template>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                class="ml-auto"
                label="Búsqueda"
                hide-details
                single-line
                style="max-width: 250px"
              />
              <v-divider class="mt-3" />
              <v-data-table
                :headers="headersce"
                :items="solpagosAfectar"
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
                <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
                  <div class="name-info-title">
                    {{ convierteNumeroFecha(item.sp_fecha_solicitud) }}
                  </div>
                </template>
                <template v-slot:item.sp_importe="{ item }">
                  {{ formatPrice(item.sp_importe) }}
                </template>
                <template v-slot:item.sp_saldo="{ item }">
                  {{ formatPrice(item.sp_saldo) }}
                </template>
                <template v-slot:[`item.info`]="{ item }">
                  <div class="name-info-title">{{ item.nom_tipo_sol }}</div>
                  <div class="mail-info-subtitle">{{ item.nom_concepto }}</div>
                  <div class="mail-info-subtitle">
                    {{ convierteNumeroFechaVista(item.sp_fecha_elabora) }}
                  </div>
                </template>

                <template v-slot:[`item.prov`]="{ item }">
                  <!-- <div class="name-info-title">{{ item.prov_razon_social }}</div> -->
                  <div class="name-info-title">{{ item.sp_pago_nombre_de }}</div>
                  <div class="mail-info-subtitle">{{ item.cuecon_cuenta }}</div>
                </template>

                <template v-slot:[`item.desc`]="{ item }">
                  <div class="name-info-title">{{ item.sp_descripcion }}</div>
                  <div class="mail-info-subtitle">{{ item.nom_user_elabora }}</div>
                </template>

                <template v-slot:no-data>
                  <!-- <v-btn color="primary">Reset</v-btn> -->
                  ¡No hay datos para mostrar!
                </template>
              </v-data-table>
            </base-material-card>
          </v-dialog>
          <!-- Fin de Dialogo para escoger casos especiales -->
          <!-- Empieza Dialogo Cancelar -->
          <ConfirmationDialog v-model="isSure" @click="cancel" />
          <!-- Termina Dialogo Cancelar -->
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
                        counter="45"
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
                <v-btn color="blue darken-1" text @click="Borrar()" :disabled="validado"
                  >Guardar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Termina Dialogo para motivo de cancelacion -->
          <!-- Empieza Dialogo PRINCIPAL -->
          <v-dialog v-model="dialog" max-width="1024px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }} </span>
                <!-- <v-img src="@/assets/logo.png" width="70%" height="70%"></v-img> -->
                <v-img src="@/assets/logo_ivey.jpg" width="20%" height="20%"></v-img>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <!-- Campo EJERCICIO -->
                    <v-col cols="2">
                      <v-select
                        v-model="$v.editedItem.sp_ejercicio.$model"
                        :items="ejercicios"
                        :menu-props="{ top: true, offsetY: true }"
                        label="Ejercicio*"
                        item-text="sp_ejercicio"
                        item-value="sp_ejercicio"
                        persistent-hint
                        dense
                        :disabled="usuario.nom_rol != 'SUPERVISOR' || isEditing"
                        hint="Seleciona Ejercicio"
                        return-object
                        :error-messages="sp_ejercicioErrors"
                        @change="onChangeEjercicioCap"
                        @blur="$v.editedItem.sp_ejercicio.$touch()"
                      >
                        <!-- @input="changed = true" -->
                      </v-select>
                    </v-col>
                    <!-- Campo TIPO DE SOLICITUD -->
                    <v-col cols="5">
                      <v-select
                        v-model="$v.editedItem.sp_tipo_sol.$model"
                        :items="tipos"
                        :menu-props="{ top: true, offsetY: true }"
                        label="Tipo de solicitud*"
                        item-text="tipo_descripcion"
                        item-value="tipo_id"
                        persistent-hint
                        dense
                        hint="Seleciona Tipo de solicitud"
                        return-object
                        :error-messages="sp_tipo_solErrors"
                        @input="setfilterConcepto"
                        @blur="$v.editedItem.sp_tipo_sol.$touch()"
                      >
                        <!-- @input="changed = true" -->
                      </v-select>
                    </v-col>
                    <!-- Campo CONCEPTO -->
                    <v-col cols="5">
                      <v-select
                        v-model="$v.editedItem.sp_concepto.$model"
                        :items="conceptos"
                        :menu-props="{ top: true, offsetY: true }"
                        label="Concepto*"
                        item-text="tipo_descripcion"
                        item-value="tipo_id"
                        persistent-hint
                        dense
                        :disabled="isTipo"
                        hint="Seleciona Concepto"
                        return-object
                        :error-messages="sp_conceptoErrors"
                        @input="setfilterProveedor"
                        @blur="$v.editedItem.sp_concepto.$touch()"
                      >
                      </v-select>
                      <!-- @input="changed = true" -->
                    </v-col>
                    <!-- Campo Proveedores -->
                    <v-col cols="6">
                      <v-select
                        v-model="$v.editedItem.prov_id.$model"
                        :items="proveedores"
                        :menu-props="{ top: true, offsetY: true }"
                        label="Proveedor*"
                        item-text="prov_razon_social"
                        item-value="prov_id"
                        persistent-hint
                        :disabled="isConcepto"
                        dense
                        hint="Seleciona Proveedor"
                        return-object
                        :error-messages="prov_idErrors"
                        @input="setfilterCuentas"
                        @blur="$v.editedItem.prov_id.$touch()"
                      >
                      </v-select>
                      <!-- @input="changed = true" -->
                    </v-col>
                    <!-- Campo Cuenta -->
                    <v-col cols="6">
                      <v-select
                        v-model="$v.editedItem.cuecon_cuenta.$model"
                        :items="cuentas"
                        :menu-props="{ top: true, offsetY: true }"
                        label="Cuenta*"
                        item-text="cuecon_cuenta"
                        item-value="cuecon_cuenta"
                        persistent-hint
                        dense
                        :disabled="isProveedor"
                        hint="Seleciona Cuenta"
                        return-object
                        :error-messages="cuecon_cuentaErrors"
                        @input="changed = true"
                        @blur="$v.editedItem.cuecon_cuenta.$touch()"
                      >
                      </v-select>
                    </v-col>
                    <!-- Campo pago_nombre_de -->
                    <v-col cols="8">
                      <v-text-field
                        v-model="editedItem.sp_pago_nombre_de"
                        label="Pago a Nombre de"
                        counter="100"
                        dense
                        @input="encodeSpecialCharacters($event.target.value), (changed = true)"
                        @blur="$v.editedItem.sp_pago_nombre_de.$touch()"
                      ></v-text-field>
                    </v-col>

                    <!-- Campo Importe -->
                    <v-col cols="4">
                      <v-text-field
                        class="text-xs-right"
                        v-model="editedItem.sp_importe"
                        label="Importe"
                        @keypress="isNumber($event)"
                        prefix="$"
                        dense
                        @input="$v.editedItem.sp_importe.$reset(), (changed = true)"
                        @blur="$v.editedItem.sp_importe.$touch()"
                      ></v-text-field>
                    </v-col>
                    <!-- Campo Descripcion -->
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.sp_descripcion"
                        label="Descripción"
                        counter="250"
                        dense
                        no-resize
                        rows="1"
                        @input="$v.editedItem.sp_descripcion.$reset(), (changed = true)"
                        @blur="$v.editedItem.sp_descripcion.$touch()"
                      ></v-textarea>
                    </v-col>
                    <!-- Campo Observacion -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.sp_observacion"
                        label="Observaciones"
                        counter="255"
                        dense
                        @input="$v.editedItem.sp_observacion.$reset(), (changed = true)"
                        @blur="$v.editedItem.sp_observacion.$touch()"
                      ></v-text-field>
                    </v-col>
                    <!-- Campo Fecha Inicio Validez -->
                    <v-col cols="3">
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
                            v-model="editedItem.sp_fecha_solicitud"
                            label="Fecha Solicitud"
                            prepend-icon="mdi-calendar-month"
                            v-bind="attrs"
                            v-on="on"
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
                    <!-- Campo Folio de comprobacion -->
                    <v-col cols="3">
                      <v-text-field
                        v-model="editedItem.sp_folio_comprobacion"
                        label="Folio de Comprobacion"
                        disabled
                        counter="100"
                        @input="$v.editedItem.sp_folio_comprobacion.$reset(), (changed = true)"
                        @blur="$v.editedItem.sp_folio_comprobacion.$touch()"
                      ></v-text-field>
                    </v-col>
                    <!-- Campo Numero de Oficio -->
                    <v-col cols="3">
                      <v-text-field
                        v-model="editedItem.sp_num_oficio"
                        label="Num. de Oficio"
                        :disabled="isPreCaptura"
                        counter="50"
                        @input="$v.editedItem.sp_num_oficio.$reset(), (changed = true)"
                        @blur="$v.editedItem.sp_num_oficio.$touch()"
                      ></v-text-field>
                    </v-col>
                    <!-- Campo Fuente financiera -->
                    <v-col cols="3">
                      <!--                   <v-text-field
                    v-model="editedItem.sp_fuente_fin"
                    label="Fuente Financiera"
                    counter="50"
                    @input="$v.editedItem.sp_fuente_fin.$reset(), (changed = true)"
                    @blur="$v.editedItem.sp_fuente_fin.$touch()"
                  ></v-text-field>
 -->
                      <v-select
                        v-model="$v.editedItem.sp_fuente_fin.$model"
                        :items="fuentesfin"
                        :menu-props="{ top: true, offsetY: true }"
                        label="Fuente Financiamiento"
                        :item-text="(item) => item.tipo_clave + ' - ' + item.tipo_descripcion"
                        item-value="tipo_clave"
                        persistent-hint
                        hint="Seleciona Fuente de Financiamiento"
                        return-object
                        :error-messages="sp_fuenteFinErrors"
                        @blur="$v.editedItem.sp_fuente_fin.$touch()"
                      >
                      </v-select>
                    </v-col>
                    <!-- Campo Numero de factura -->
                    <v-col cols="4">
                      <v-text-field
                        v-model="editedItem.sp_no_factura"
                        label="Numero de Factura"
                        :disabled="isPreCaptura"
                        counter="20"
                        @input="$v.editedItem.sp_no_factura.$reset(), (changed = true)"
                        @blur="$v.editedItem.sp_no_factura.$touch()"
                      ></v-text-field>
                    </v-col>
                    <!-- Campo Fecha Factura -->
                    <v-col cols="4">
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
                            v-model="editedItem.sp_fecha_factura"
                            label="Fecha Factura"
                            prepend-icon="mdi-calendar-month"
                            :disabled="isPreCaptura"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          locale="en-in"
                          :min="minDate"
                          :max="maxDate"
                          v-model="editedItem.sp_fecha_factura"
                          @input=";(fromDateFecFact = false), (changed = true)"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <!-- Campo Fecha Probable de pago -->
                    <v-col cols="4">
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
                            v-model="editedItem.sp_fecha_factura_prob_pago"
                            label="Fecha Probable de Pago"
                            prepend-icon="mdi-calendar-month"
                            :disabled="isPreCaptura"
                            v-bind="attrs"
                            v-on="on"
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
                    <!-- Campo Empleado DIRECCION EMPLEADO SOLICITA -->
                    <v-col cols="6">
                      <v-select
                        v-model="$v.editedItem.sp_direccion_sol.$model"
                        :items="direccion"
                        :menu-props="{ top: true, offsetY: true }"
                        label="Direccion Solicita*"
                        item-text="emp_direccion"
                        item-value="emp_direccion"
                        persistent-hint
                        dense
                        :error-messages="sp_direccion_solErrors"
                        hint="Seleciona dirección Solicita"
                        return-object
                        @input="setfilterEmpSol"
                        @change="onChangevobo"
                        @blur="$v.editedItem.sp_direccion_sol.$touch()"
                      >
                      </v-select>
                    </v-col>
                    <!-- Campo Empleado Solicita -->
                    <v-col cols="6">
                      <v-select
                        v-model="$v.editedItem.sp_emp_id_sol.$model"
                        :items="empleadosol"
                        :menu-props="{ top: true, offsetY: true }"
                        label="Solicita*"
                        :item-text="(item) => item.emp_nombre + ' - ' + item.emp_puesto"
                        item-value="emp_id"
                        persistent-hint
                        :disabled="isSolicita"
                        dense
                        hint="Seleciona Solicita"
                        return-object
                        :error-messages="sp_emp_id_solErrors"
                        @input="setfilterVistoBueno"
                        @blur="$v.editedItem.sp_emp_id_sol.$touch()"
                      >
                      </v-select>
                    </v-col>
                    <!-- Campo Empleado Autoriza -->
                    <v-col cols="6">
                      <v-select
                        v-model="$v.editedItem.sp_emp_id_aut.$model"
                        :items="empleadoaut"
                        :menu-props="{ top: true, offsetY: true }"
                        label="Autoriza*"
                        :item-text="(item) => item.emp_nombre + ' - ' + item.emp_puesto"
                        item-value="emp_id"
                        persistent-hint
                        dense
                        hint="Empleado Autoriza"
                        disabled
                        return-object
                        :error-messages="sp_emp_id_autErrors"
                        @input="changed = true"
                        @blur="$v.editedItem.sp_emp_id_aut.$touch()"
                      >
                      </v-select>
                    </v-col>
                    <!-- Campo Empleado Visto Bueno -->
                    <v-col cols="6">
                      <v-select
                        v-model="editedItem.sp_vobo_emp_id"
                        :items="directores"
                        :menu-props="{ top: true, offsetY: true }"
                        label="Visto Bueno"
                        :item-text="(item) => item.emp_nombre + ' - ' + item.emp_puesto"
                        item-value="emp_id"
                        persistent-hint
                        dense
                        disabled
                        hint="Seleciona Visto Bueno"
                        return-object
                        @input="changed = true"
                        @blur="$v.editedItem.sp_vobo_emp_id.$touch()"
                      >
                      </v-select>
                    </v-col>
                    <!-- Campo Usuario Crea -->
                    <v-col cols="4">
                      <v-text-field
                        v-model="editedItem.nom_user_elabora"
                        label="Usuario Elaboro"
                        disabled
                        @input="$v.editedItem.nom_user_elabora.$reset(), (changed = true)"
                        @blur="$v.editedItem.nom_user_elabora.$touch()"
                      ></v-text-field>
                    </v-col>
                    <!-- Campo Fecha Crea-->
                    <v-col cols="3">
                      <v-text-field
                        v-model="editedItem.sp_fecha_elabora"
                        label="Fecha Elaborado"
                        disabled
                        @input="$v.editedItem.sp_fecha_elabora.$reset(), (changed = true)"
                        @blur="$v.editedItem.sp_fecha_elabora.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        v-model="editedItem.estatus_nombre"
                        label="Estatus"
                        disabled
                        @input="$v.editedItem.estatus_nombre.$reset(), (changed = true)"
                        @blur="$v.editedItem.estatus_nombre.$touch()"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <small>*Campo Obligatorio</small>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-checkbox
                  v-model="checkbox"
                  label="Crear otro"
                  :disabled="isEditing"
                ></v-checkbox>
                <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="PreSave" :disabled="$v.$invalid"
                  >Guardar CAP</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Termina Dialogo -->
          <!-- Aqui va progress linear -->
          <v-divider class="mt-3" />
          <!-- TABLA PRINCIPAL -->
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
              <v-icon small @click="printItem(item)">mdi-printer</v-icon>
            </template>

            <!-- Creo el boton de Activo-->
            <template v-slot:item.cta_activo="{ item }">
              <Status :activostr="item.cta_activo" tipo="String" />
            </template>

            <template v-slot:item.sp_importe="{ item }">
              {{ formatPrice(item.sp_importe) }}
            </template>

            <template v-slot:[`item.info`]="{ item }">
              <div class="name-info-title">{{ item.nom_tipo_sol }}</div>
              <div class="mail-info-subtitle">{{ item.nom_concepto }}</div>
              <div class="mail-info-subtitle">
                {{ convierteNumeroFechaVista(item.sp_fecha_elabora) }}
              </div>
            </template>

            <template v-slot:[`item.prov`]="{ item }">
              <!-- <div class="name-info-title">{{ item.prov_razon_social }}</div> -->
              <div class="name-info-title">{{ item.sp_pago_nombre_de }}</div>
              <div class="mail-info-subtitle">{{ item.cuecon_cuenta }}</div>
            </template>

            <template v-slot:[`item.desc`]="{ item }">
              <div class="name-info-title">{{ item.sp_descripcion }}</div>
              <div class="mail-info-subtitle">{{ item.nom_user_elabora }}</div>
            </template>

            <template v-slot:no-data>
              <!-- <v-btn color="primary">Reset</v-btn> -->
              ¡No hay datos para mostrar!
            </template>
          </v-data-table>
          <!-- Termina Tabla de cuentas -->
          <!-- Empieza DataExporter -->
          <!-- <DataExporter :dataArray="cuentas" :dataFields="fields" fileName="cuentas" /> -->
          <!-- Termina DataExporter -->
        </base-material-card>
      </v-container>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
//import impFormatoSolPagos from '@/components/general/formatoSolPagos.vue'
import Status from '@/components/general/StatusInfo.vue'
import { getValidToken } from '@/store/helpers.js'
import { imprimeFormatoSolPag } from '@/store/modules/impresiones.store.js'
import * as tools from '@/store/modules/tools.store.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import DataExporter from '@/components/general/DataExporter.vue'
import he from 'he'

export default {
  components: {
    ConfirmationDialog,
    Status,
    DataExporter,
  },

  data: () => ({
    eFormatos: tools.formatos,
    DisabledPagoNombreDe: false,
    tipo_temp: 0,
    prov_temp: 0,
    clave_temp: '',
    singleSelect: false,
    fromDateMenu: false,
    fromDateFecFact: false,
    fromDateFecPoPago: false,
    minDate: '2021-01-01',
    maxDate: '2050-01-31',
    usuario: JSON.parse(localStorage.getItem('user')),
    search: undefined,
    isLoading: false,
    checkbox: false,
    checkboxSaldo: false,
    isEditing: false,
    dialog: false,
    dialogxc: false,
    dialogce: false,
    dialogfince: false,
    isSure: false,
    overlay: false,
    changed: false,
    //
    isPreCaptura: false,
    //manejo de secuencia de escoger selects
    isTipo: true,
    isConcepto: true,
    isProveedor: true,
    isSolicita: true,
    sgteIdSolPag: 0,
    headers: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      //{ text: 'Cuenta', value: 'cta_clave' },
      { text: 'Info', value: 'info' },
      { text: 'Proveedor', value: 'prov' },
      { text: 'Descripción', value: 'desc' },
      { text: '$ Importe', value: 'sp_importe' },
      { text: 'Estatus', value: 'sp_estatus' },
      //{ text: 'Activo', value: 'cta_activo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headersRecibe: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      //{ text: 'Cuenta', value: 'cta_clave' },
      { text: 'Info', value: 'info' },
      { text: 'Proveedor', value: 'prov' },
      { text: 'Descripción', value: 'desc' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: '$ Importe', value: 'sp_importe' },
      { text: '$ Saldo', value: 'sp_saldo' },
      { text: 'Estatus', value: 'estatus_nombre' },
    ],
    headersce: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      //{ text: 'Cuenta', value: 'cta_clave' },
      { text: 'Info', value: 'info' },
      { text: 'Proveedor', value: 'prov' },
      { text: 'Descripción', value: 'desc' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: '$ Importe', value: 'sp_importe' },
      { text: '$ Saldo', value: 'sp_saldo' },
      //{ text: 'Estatus', value: 'sp_estatus' },
    ],
    //para casos especiales
    msgStore: '',
    isCasoEspecial: false,
    folioxafectar: 0,
    saldoxafectar: 0,
    ce_concepto_NP: 0,
    ce_concepto_P: 0,
    ce_faltante: 0,
    ce_excedente: 0,
    ce_concepto_excedente: 0,
    selected: [],
    value: [],
    solpagos: [],
    solpagosExportar: [],
    solpago: [],
    tipos: [],
    conceptos: [],
    proveedores: [],
    cuentas: [],
    empleadosol: [],
    empleadoaut: [],
    empleadovobo: [],
    directores: [],
    direccion: [],
    casosEspeciales: [],
    solpagosAfectar: [],
    fuentesfin: [],
    generales: [],
    solPagosRecibe: [],
    ejercicio: 0,
    ejercicios: [],
    idEmpleadoAut: 0,
    editedIndex: -1,
    editedItem2: {},
    editedItem: {
      sp_ejercicio: 0,
      sp_id: 0,
      sp_tipo_sol: 0,
      sp_concepto: 0,
      prov_id: 0,
      cuecon_cuenta: '',
      sp_descripcion: '',
      sp_pago_nombre_de: '',
      sp_observacion: '',
      sp_importe: '',
      sp_fecha_solicitud: '',
      sp_folio_comprobacion: '',
      sp_num_oficio: '',
      sp_fuente_fin: '',
      sp_no_factura: '',
      sp_fecha_factura: '',
      sp_fecha_factura_prob_pago: '',
      sp_emp_id_aut: 0,
      sp_emp_id_sol: 0,
      sp_direccion_sol: '',
      sp_vobo_emp_id: 0,
      sp_estatus: '',
      prov_razon_social: '',
      sp_motivo_cancelacion: '',
      sp_folio_cancela: 0,
    },
    defaultItem: {
      sp_ejercicio: 0,
      sp_id: 0,
      sp_tipo_sol: 0,
      sp_concepto: 0,
      prov_id: 0,
      cuecon_cuenta: '',
      sp_descripcion: '',
      sp_pago_nombre_de: '',
      sp_observacion: '',
      sp_importe: '',
      sp_fecha_solicitud: '',
      sp_folio_comprobacion: '',
      sp_num_oficio: '',
      sp_fuente_fin: '',
      sp_no_factura: '',
      sp_fecha_factura: '',
      sp_fecha_factura_prob_pago: '',
      sp_emp_id_aut: 2,
      sp_emp_id_sol: 0,
      sp_direccion_sol: '',
      sp_vobo_emp_id: 0,
      sp_user_elabora: '',
      nom_user_elabora: '',
      sp_fecha_elabora: '',
      sp_estatus: '',
      prov_razon_social: '',
      sp_motivo_cancelacion: '',
      sp_folio_cancela: 0,
    },
    //Para Exportar
    fieldsCreados: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Tipo_solicitud: 'nom_tipo_sol',
      Concepto: 'nom_concepto',
      Proveedor: 'sp_pago_nombre_de',
      Cuenta: 'cuecon_cuenta',
      Descripcion: 'sp_descripcion',
      Importe: 'sp_importe',
      Fecha_Solicita: 'sp_fecha_solicitud',
      Fuente_Financiamiento: 'nom_fuente_fin',
      Usuario_Crea: 'nom_user_elabora',
      Direccion: 'direccion_sol',
      Estatus: 'estatus_nombre',
    },
  }),

  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      sp_ejercicio: { required },
      sp_tipo_sol: { required },
      sp_concepto: { required },
      prov_id: { required },
      sp_emp_id_sol: { required },
      sp_emp_id_aut: { required },
      sp_direccion_sol: { required },
      //ent_nombre: { required, minLength: minLength(3), maxLength: maxLength(255) },
      cuecon_cuenta: { required, minLength: minLength(3), maxLength: maxLength(20) },
      sp_fuente_fin: { required },

      //sp_motivo_cancelacion: { required, minLength: minLength(10), maxLength: maxLength(100) },

      //id_tipo: { required, minLength: minLength(3), maxLength: maxLength(255) },
      //reten_nombre: { required, minLength: minLength(3), maxLength: maxLength(100) },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      return this.editedIndex === -1
        ? 'Nueva Solicitud de Pagos'
        : 'Editar Solicitud de Pagos { ' +
            this.editedItem.sp_ejercicio +
            ' } # ' +
            this.editedItem.sp_id
    },
    cuecon_cuentaErrors() {
      const errors = []
      if (!this.$v.editedItem.cuecon_cuenta.$dirty) return errors
      !this.$v.editedItem.cuecon_cuenta.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.cuecon_cuenta.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.cuecon_cuenta.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    sp_tipo_solErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_tipo_sol.$dirty) return errors
      !this.$v.editedItem.sp_tipo_sol.required && errors.push('Este campo es requerido')
      return errors
    },
    sp_fuenteFinErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_fuente_fin.$dirty) return errors
      !this.$v.editedItem.sp_fuente_fin.required && errors.push('Este campo es requerido')
      return errors
    },
    sp_conceptoErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_concepto.$dirty) return errors
      !this.$v.editedItem.sp_concepto.required && errors.push('Este campo es requerido')
      return errors
    },
    prov_idErrors() {
      const errors = []
      if (!this.$v.editedItem.prov_id.$dirty) return errors
      !this.$v.editedItem.prov_id.required && errors.push('Este campo es requerido')
      return errors
    },
    sp_emp_id_solErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_emp_id_sol.$dirty) return errors
      !this.$v.editedItem.sp_emp_id_sol.required && errors.push('Este campo es requerido')
      return errors
    },
    sp_emp_id_autErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_emp_id_aut.$dirty) return errors
      !this.$v.editedItem.sp_emp_id_aut.required && errors.push('Este campo es requerido')
      return errors
    },
    sp_direccion_solErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_direccion_sol.$dirty) return errors
      !this.$v.editedItem.sp_direccion_sol.required && errors.push('Este campo es requerido')
      return errors
    },
    sp_ejercicioErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_ejercicio.$dirty) return errors
      !this.$v.editedItem.sp_ejercicio.required && errors.push('Este campo es requerido')
      return errors
    },
    /*
    sp_motivo_cancelacionErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_motivo_cancelacion.$dirty) {
        return errors
      }
      !this.$v.editedItem.sp_motivo_cancelacion.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.sp_motivo_cancelacion.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.sp_motivo_cancelacion.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')

      return errors
    },*/
    validado() {
      let retorna = false
      return retorna
      //return this.editedItemFolio.folio_isdevengado
      /*
      if (this.sp_motivo_cancelacion.length == 0 && this.editedItemFolio.folio_isdevengado == 1) {
        return false
      } else {
        return true
      }
      */
      /*
      if (!this.$v.editedItem.sp_motivo_cancelacion.$dirty) {
        return true
      }
      if (!this.$v.editedItem.sp_motivo_cancelacion.required) retorna = true
      if (
        !this.$v.editedItem.sp_motivo_cancelacion.length <
        !this.$v.editedItem.sp_motivo_cancelacion.minLength
      )
        retorna = true
      if (!this.$v.editedItem.sp_motivo_cancelacion.maxLength) retorna = true

      return retorna
      */
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
      await this.ObtenerGenerales(jwt)
      await this.obtenerTipos(jwt)
      await this.obtenerConceptos(jwt, '')
      await this.obtenerProveedores(jwt, 0, '')
      await this.obtenerCuentas(jwt, 0, 0)
      await this.obtenerEmpleadoSolicita(jwt, '')
      await this.obtenerEmpleadoAutoriza(jwt)

      await this.obtenerDireccion(jwt)
      await this.obtenerDirectores(jwt)
      await this.ObtenerCasosEsp(jwt)
      await this.ObtenerFuenteFin(jwt)
      await this.obtenerEjercicios(jwt)

      //var currentTime = new Date()
      //this.ejercicio = currentTime.getFullYear()
      //console.log('this.ejercicio ' + this.ejercicio)
      /* if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      } */
      //25/FEB/2022
      this.EjercicioValido()

      await this.obtenerSolPagos(jwt, 0, this.ejercicio)
      await this.obtenerParaRecib(jwt, 0, this.ejercicio)
      //await this.obtenerParaRecib(jwt, 0, this.ejercicio)
      //var year = currentTime.getFullYear()

      //await this.obtenerIdSolPagos(jwt, year)
      //console.log('this.sgteIdSolPag: ' + this.sgteIdSolPag)
    },
    //Obtiene todos los generales para reglas de negocio
    async ObtenerGenerales(jwt) {
      this.isLoading = true
      let params = null

      params = 'filtro?campo1=id_sistema&tipo1=igual&valor1=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.generales = []
        this.idEmpleadoAut = 0
        await this.$store
          .dispatch('general/fetchGeneral', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.generales = response.data
              this.idEmpleadoAut = this.generales[0].id_emp_aut
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
    //Obtiene todos los tipos de fuentes de financiamientos
    async ObtenerFuenteFin(jwt) {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=FTEFIN&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.fuentesfin = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.fuentesfin = response.data
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
    //Obtiene Solicitudes a afectar
    async ObtenerSolpagosAfectar(jwt, tipo_sol, concepto, prov) {
      this.isLoading = true
      let params = null
      //params = 'filtro?campo1=ce_activo&tipo1=igual&valor1=1'
      //&logico2=and&campo2=tipo_activo&tipo2=igual&valor2=1
      params =
        's.sp_tipo_sol = ' +
        tipo_sol +
        ' and s.sp_concepto = ' +
        concepto +
        ' and s.prov_id = ' +
        prov +
        ' and s.sp_estatus = "FINPAGO" and s.sp_saldo > 0/sp_id'

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.selected = []
        this.solpagosAfectar = []

        await this.$store
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagosAfectar = response.data
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
    //Obtiene las reglas de casos Especiales
    async ObtenerCasosEsp(jwt) {
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=ce_activo&tipo1=igual&valor1=1'
      //&logico2=and&campo2=tipo_activo&tipo2=igual&valor2=1

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.casosEspeciales = []
        await this.$store
          .dispatch('casosesp/fetchCasosEsp', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.casosEspeciales = response.data
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
    async obtenerSolPagos(jwt, sp_id, ejercicio) {
      this.isLoading = true
      let params = null
      if (sp_id > 0) {
        params = sp_id
      } else {
        /*  params =
          'filtro?campo1=sp_estatus&tipo1=igual&valor1=CREADO&logico2=or&campo2=sp_estatus&tipo2=igual&valor2=XCANCELAR&logico3=and&campo3=sp_ejercicio&tipo3=igual&valor3=' +
          ejercicio */

        /*         params =
          'filtro?campo1=sp_ejercicio&tipo1=igual&valor1=' +
          ejercicio +
          '&logico2=and&campo2=sp_estatus&tipo2=igual&valor2=CREADO&logico3=or&campo3=sp_estatus&tipo3=igual&valor3=XCANCELAR'
 */
        /* params =
          `(sp_estatus ='CREADO' or sp_estatus = 'XCANCELAR' or sp_estatus = 'PRECAP' or sp_estatus = 'PRECAPREC' ) and sp_ejercicio = ` +
          ejercicio +
          `/sp_id/`
      }*/
        /*  params = 
          `(sp_estatus ='CREADO' or sp_estatus = 'XCANCELAR'  or sp_estatus = 'PRECAPREC' or sp_estatus = 'PRECAP' and sp_tipo_sol = 2 or sp_estatus = 'ENVPRECAP' AND sp_id_comp > 0 ) and sp_ejercicio = ` +
          ejercicio +
          `/sp_id/`
      }*/
        params =
          `(sp_estatus ='CREADO' or sp_estatus = 'XCANCELAR'  or sp_estatus = 'PRECAPREC' or sp_estatus = 'ENVPRECAP' AND sp_id_comp > 0 ) and sp_ejercicio = ` +
          ejercicio +
          `/sp_id/`
      }

      //&logico2=and&campo2=tipo_activo&tipo2=igual&valor2=1

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpago = []
        this.solpagos = []
        await this.$store
          //.dispatch('solpago/fetchSolPagosCreado', payload)
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (sp_id > 0) {
              if (response.data.mensaje == undefined) {
                this.solpago = response.data
              }
            } else {
              if (response.data.mensaje == undefined) {
                this.solpagos = response.data
                this.formateoInfoExportar('CREADOS')
              }
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
    async obtenerParaRecib(jwt, sp_id, ejercicio) {
      this.isLoading = true
      let params = null
      if (sp_id > 0) {
        params = sp_id
      } else {
        params = `(sp_estatus ='PRECAPXREC' ) and sp_ejercicio = ` + ejercicio + `/sp_id/`
      }

      //&logico2=and&campo2=tipo_activo&tipo2=igual&valor2=1

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solPagosRecibe = []
        this.solPagosRecibe = []
        await this.$store
          //.dispatch('solpago/fetchSolPagosCreado', payload)
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (sp_id > 0) {
              if (response.data.mensaje == undefined) {
                this.solPagosRecibe = response.data
              }
            } else {
              if (response.data.mensaje == undefined) {
                this.solPagosRecibe = response.data
                this.formateoInfoExportar('CREADOS')
              }
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
    //Obtiene todos los tipos de solicitudes para el select
    async obtenerTipos(jwt) {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=TIPSOL&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.tipos = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
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
    async obtenerConceptos(jwt, filtro) {
      this.isLoading = true
      let params = null
      //console.log('filtro: ' + filtro)
      if (filtro === '') {
        //params ='filtro?campo1=clatip_id&tipo1=igual&valor1=SOLP&logico2=and&campo2=tipo_activo&tipo2=igual&valor2=1'
        params =
          'filtro?campo1=t.clatip_id&tipo1=igual&valor1=SOLP&logico2=or&campo2=t.clatip_id&tipo2=igual&valor2=SOLNP'
      } else {
        params = filtro
      }
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.conceptos = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.conceptos = response.data
            }

            /* this.conceptos.sort(function (a, b) {
              return a.tipo_descripcion - b.tipo_descripcion
            }) */
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
    //Obtiene Todas las Proveedores
    async obtenerProveedores(jwt, tipo, clave) {
      this.isLoading = true
      let params = ''
      //console.log('tipo:' + tipo)
      //console.log('clave:' + clave)
      let payload = {}
      if (jwt != null) {
        if (clave == 'penalim') {
          params = 'filtro?campo1=prov_tipo&tipo1=igual&valor1=tipprovpen'
          payload = { jwt: jwt, params: params }
          this.proveedores = []
          await this.$store
            .dispatch('proveedor/fetchProveedor', payload)
            .then((response) => {
              if (response.data.mensaje == undefined) {
                this.proveedores = response.data
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
        } else if (clave == 'devsalemp') {
          params = 'filtro?campo1=prov_tipo&tipo1=igual&valor1=tipprovemp'
          payload = { jwt: jwt, params: params }
          this.proveedores = []
          await this.$store
            .dispatch('proveedor/fetchProveedor', payload)
            .then((response) => {
              if (response.data.mensaje == undefined) {
                this.proveedores = response.data
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
        } else if (tipo == 0) {
          //let params = null
          params = 'filtro?campo1=prov_activo&tipo1=igual&valor1=1'
          payload = { jwt: jwt, params: params }
          this.proveedores = []
          await this.$store
            .dispatch('proveedor/fetchProveedor', payload)
            .then((response) => {
              if (response.data.mensaje == undefined) {
                this.proveedores = response.data
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
        } else {
          let payload2 = { jwt: jwt, params: tipo }
          this.proveedores = []
          await this.$store
            .dispatch('consulta/fetchProvTipo', payload2)
            .then((response) => {
              if (response.data.mensaje == undefined) {
                this.proveedores = response.data
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
      }
    },
    //Obtiene Todas las Cuentas
    async obtenerCuentas(jwt, prov, tipo) {
      this.isLoading = true
      let params = null
      let opcion = 0

      //Se agrego para cuenta multi conceptos
      //if (prov == undefined) prov = 999999

      if (prov == 0 && tipo == 0) {
        opcion = 1
        params = 'filtro?campo1=cuecon_activo&tipo1=igual&valor1=1'
      } else if (prov == 0) {
        opcion = 1
        params = 'filtro?campo1=c.tipo_id&tipo1=igual&valor1=' + tipo
      } else if (tipo == 0) {
        opcion = 1
        params =
          'filtro?campo1=c.prov_id&tipo1=igual&valor1=' +
          prov +
          '&logico2=and&campo2=es_multi_concepto&tipo2=igual&valor2=1'
      } else {
        opcion = 2

        params = prov + '/' + tipo
      }
      //console.log('opcion ' + opcion)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.cuentas = []
        if (opcion == 1) {
          await this.$store
            .dispatch('cuenta/fetchCuenta', payload)
            .then((response) => {
              if (response.data.mensaje == undefined) {
                this.cuentas = response.data
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
        } else {
          await this.$store
            .dispatch('consulta/fetchCuentaxProvxTipo', payload)
            .then((response) => {
              this.cuentas = []
              if (response.data.mensaje == undefined) {
                this.cuentas = response.data
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
      }
    },
    //Obtiene Todas las Empleados solicita
    async obtenerEmpleadoSolicita(jwt, dir) {
      this.isLoading = true
      let params = null
      if (dir === '') {
        params = 'filtro?campo1=emp_activo&tipo1=igual&valor1=1'
      } else {
        params =
          'filtro?campo1=emp_activo&tipo1=igual&valor1=1&logico2=and&campo2=emp_direccion&tipo2=igual&valor2=' +
          dir
      }

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.empleadosol = []
        await this.$store
          .dispatch('empleado/fetchEmpleado', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.empleadosol = response.data
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
    //Obtiene Todas las Empleados Autoria
    async obtenerEmpleadoAutoriza(jwt) {
      this.isLoading = true
      let params = null
      //params = 'filtro?campo1=emp_activo&tipo1=igual&valor1=1'
      //params ='filtro?campo1=emp_activo&tipo1=igual&valor1=1&logico2=and&campo2=emp_codigo&tipo2=igual&valor2=1292'
      params =
        'filtro?campo1=emp_activo&tipo1=igual&valor1=1&logico2=and&campo2=emp_id&tipo2=igual&valor2=' +
        this.idEmpleadoAut

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.empleadoaut = []
        await this.$store
          .dispatch('empleado/fetchEmpleado', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.empleadoaut = response.data
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
    //Obtiene todos los Directores
    async obtenerDireccion(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.direccion = []
        await this.$store
          .dispatch('consulta/fetchDireccion', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.direccion = response.data
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
    //Obtiene todos los Directores
    async obtenerDirectores(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.directores = []
        await this.$store
          .dispatch('consulta/fetchDirectores', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.directores = response.data
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
    //Obtiene todos las facturas capturados
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
    //Nuevo PRE - DAtos iniciales
    nuevaPreCaptura() {
      //Se inicializan los valores de la nueva captura
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      var fecha = new Date()
      this.editedItem.sp_fecha_solicitud = this.fechaformato(fecha)
      this.editedItem.sp_fecha_precaptura = this.fechaformato(fecha)
      //this.editedItem.sp_emp_id_aut = this.empleadoaut[0].emp_id
      this.editedItem.sp_emp_id_aut = this.idEmpleadoAut

      this.editedItem.sp_estatus = 'PRECAP'
      this.isPreCaptura = true
      //console.log(this.ejercicios[0].sp_ejercicio)
      //this.editedItem.sp_ejercicio = this.ejercicios[0].sp_ejercicio
      this.EjercicioValido()
    },
    //Nuevo - DAtos iniciales
    nuevaCaptura() {
      //Se inicializan los valores de la nueva captura
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      var fecha = new Date()
      this.editedItem.sp_fecha_solicitud = this.fechaformato(fecha)
      this.editedItem.sp_fecha_precaptura = this.fechaformato(fecha)
      //this.editedItem.sp_emp_id_aut = this.empleadoaut[0].emp_id
      this.editedItem.sp_emp_id_aut = this.idEmpleadoAut

      this.editedItem.sp_estatus = 'CREADO'
      this.isPreCaptura = false
      //console.log(this.ejercicios[0].sp_ejercicio)
      //this.editedItem.sp_ejercicio = this.ejercicios[0].sp_ejercicio
      this.EjercicioValido()
    },
    // Editar Tipo
    async editItem(item) {
      this.isEditing = true
      this.editedIndex = this.solpagos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.sp_fecha_solicitud = this.convierteNumeroFecha(
        this.solpagos[this.editedIndex].sp_fecha_solicitud
      )

      if (this.editedItem.sp_fecha_factura == null) {
        this.editedItem.sp_fecha_factura == ''
      } else {
        this.editedItem.sp_fecha_factura = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_factura
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
      let jwt = await getValidToken(this)
      this.obtenerEmpleadoSolicita(jwt, this.editedItem.sp_direccion_sol)

      this.editedItem.sp_estatus = 'CREADO'
      this.estatusOrden = 'PAG'
      console.log('this.editedItem.sp_tipo_sol ', this.editedItem.sp_tipo_sol)
      console.log('this.editedItem.sp_id_comp', this.editedItem.sp_id_comp)
      if (this.editedItem.sp_tipo_sol === 1 && this.editedItem.sp_id_comp > 0) {
        this.estatusOrden = 'COMP'
      }

      this.dialog = true
    },
    // Eliminar Tipo
    deleteItem(item) {
      this.isEditing = true
      this.editedIndex = this.solpagos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      //this.editedItem.rec_estatus = 'CAN'
      this.editedItem.sp_motivo_cancelacion = ''

      this.dialogxc = true
    },
    //Borrar en BD es desActivar
    async Borrar() {
      this.overlay = true
      this.$v.$touch()
      var fecha = new Date()
      this.os_fecha_can = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      let body = {
        //_id: this.editedItem.id_tipo,
        sp_motivo_cancelacion: this.editedItem.sp_motivo_cancelacion,
        sp_folio_cancela: this.editedItem.sp_folio_cancela,
        sp_estatus: 'CANCELAR',
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = this.editedItem.sp_id
      //payload.id = this.editedItem.sp_id
      payload.ejercicio = this.editedItem.sp_ejercicio
      //console.log(this.editedItem)
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
          })
          this.overlay = false
        })
        //cancela orden si tiene orden la sp verifica con fecha enprecap fue enviado desde orden
      if(this.editedItem.sp_fecha_envprecap != null){
      body = {
        osEstatus: 'CAN_OS',
        sp_ejercicio: this.editedItem.sp_ejercicio,
        sp_id: this.editedItem.sp_id,
      }
      payload = { jwt: jwt, body: body }
      await this.$store
        .dispatch('ordencompra/editEstatusSP', payload)
        .then(() => {
          this.error = ''
        })
        .catch((err) => {
          this.error = err
        })
      //ACTUALIZA REGISTRO EN TABLA SEGUIMIENNTO
      let bodyEnv = {
        sp_id: this.editedItem.sp_id,
        osEjercicio: this.editedItem.sp_ejercicio,
        os_fecha_can: this.os_fecha_can,
        os_user_can: this.usuario.usr_id,
      }
      let payloadEnv = { jwt: jwt, body: bodyEnv }
      try {
        await this.$store.dispatch('ordencompra/editSeguimiento', payloadEnv)
        this.$store.commit('ALERT', {
          color: 'success',
          text: 'El registro se cancelo satisfactoriamente',
        })
      } catch (err) {
        this.$store.commit('ALERT', {
          color: 'error',
          text: err.response.data.msg,
        })
      }
    }
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
    //Cancelar dialogo
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
        var fecha = new Date()
        this.editedItem.sp_fecha_solicitud = this.fechaformato(fecha)
      })
      this.$v.$reset()
    },
    //formateando fechas
    fechaformato(f) {
      //console.log(f.getMonth())
      var mes = f.getMonth() + 1
      var dia = f.getDate()
      const fecha =
        f.getFullYear() + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia)
      return fecha
    },
    //CONVIERTE NUMERO A FECHA
    convierteNumeroFecha(date) {
      const cadena = date.toString()
      let year = cadena.slice(0, 4)
      //let year = cadena.slice(2, 4)
      let month = cadena.slice(5, 7)
      let day = cadena.slice(8, 10)

      const fecha = year + '-' + month + '-' + day
      //const fecha = day + '-' + month + '-' + year

      return fecha
    },

    convierteNumeroFechaVista(date) {
      const cadena = date.toString()
      //let year = cadena.slice(0, 4)
      let year = cadena.slice(2, 4)
      let month = cadena.slice(5, 7)
      let day = cadena.slice(8, 10)

      //const fecha = year + '-' + month + '-' + day
      const fecha = day + '-' + month + '-' + year

      return fecha
    },
    encodeSpecialCharacters(value) {
      this.editedItem.sp_pago_nombre_de = encodeURIComponent(value)
    },
    // Guardar el formulario
    async save() {
      this.overlay = true
      this.$v.$touch()
      let jwt = await getValidToken(this)
      let pagoNombreDecodificado = he.decode(this.editedItem.sp_pago_nombre_de)
      var fecha = new Date()
      const os_fecha_prelib = this.fechaformato(fecha)
      const sp_fecha_creado = this.fechaformato(fecha)
      this.editedItem.os_fecha_pag = this.fechaformato(fecha)
      this.editedItem.sp_fecha_precaptura = this.fechaformato(fecha)
      this.editedItem.sp_fechaCreado = this.fechaformato(fecha)
      if (!this.$v.$invalid) {
        let tiposol = 0
        if (this.editedItem.sp_tipo_sol.tipo_id == null) {
          tiposol = this.editedItem.sp_tipo_sol
        } else {
          tiposol = this.editedItem.sp_tipo_sol.tipo_id
        }
        let concepto = 0
        if (this.editedItem.sp_concepto.tipo_id == null) {
          concepto = this.editedItem.sp_concepto
        } else {
          concepto = this.editedItem.sp_concepto.tipo_id
        }
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
        let ftefin = 0
        if (this.editedItem.sp_fuente_fin.tipo_clave == null) {
          ftefin = this.editedItem.sp_fuente_fin
        } else {
          ftefin = this.editedItem.sp_fuente_fin.tipo_clave
        }
        //console.log('ftefin: ' + ftefin)

        let solicita = 0
        if (this.editedItem.sp_emp_id_sol.emp_id == null) {
          solicita = this.editedItem.sp_emp_id_sol
        } else {
          solicita = this.editedItem.sp_emp_id_sol.emp_id
        }
        let autoriza = this.idEmpleadoAut
        /*         if (this.editedItem.sp_emp_id_aut.emp_id == null) {
          autoriza = this.editedItem.sp_emp_id_aut
        } else {
          autoriza = this.editedItem.sp_emp_id_aut.emp_id
        }
        */
        let dirsolicita = 0
        if (this.editedItem.sp_direccion_sol.emp_direccion == null) {
          dirsolicita = this.editedItem.sp_direccion_sol
        } else {
          dirsolicita = this.editedItem.sp_direccion_sol.emp_direccion
        }
        let vistobueno = 0
        if (this.editedItem.sp_vobo_emp_id.emp_id == null) {
          vistobueno = this.editedItem.sp_vobo_emp_id
        } else {
          vistobueno = this.editedItem.sp_vobo_emp_id.emp_id
        }

        //Verificar si es un caso especial NP, si aplica se guarda el saldo
        let saldo = 0
        let saldofolioafecta = 0
        let devEfectivo = 0
        let isCasoEspecial = false
        let diferencia = 0
        let ce_concepto_excedente = 0
        let desc_concepto_excedente = ''
        let cuenta_excedente = ''
        let importeTot = this.editedItem.sp_importe
        for (var i in this.casosEspeciales) {
          //caso especial NP solo considera
          if (this.casosEspeciales[i].ce_concepto_NP == concepto) {
            saldo = this.editedItem.sp_importe
            saldofolioafecta = this.editedItem.sp_importe
            break
          }
          //caso Especial P de comprobador
          if (this.casosEspeciales[i].ce_concepto_P == concepto) {
            isCasoEspecial = true
            saldo = this.saldoxafectar - this.editedItem.sp_importe
            //Concepto de excedente
            ce_concepto_excedente = this.casosEspeciales[i].ce_concepto_excedente
            desc_concepto_excedente = this.casosEspeciales[i].desc_concepto_excedente
            //si saldo es cero mundo ideal, si no depende del caso
            //Hay faltante
            if (saldo > 0) {
              if (this.casosEspeciales[i].ce_faltante) {
                //diferencia = saldo
                //Desea devolver Efectivo ??
                if (this.checkboxSaldo) {
                  devEfectivo = saldo
                  saldo = 0
                }
              }
            }

            //Hay sobrante
            else if (saldo < 0) {
              if (this.casosEspeciales[i].ce_excedente) {
                diferencia = saldo
                await this.obtenerCuentas(jwt, prov, ce_concepto_excedente)
                //console.log('Hay sobrante')
                //console.log(this.cuentas.length)
                if (this.cuentas.length > 0) {
                  cuenta_excedente = this.cuentas[0].cuecon_cuenta
                }
                saldofolioafecta = 0
                saldo = 0
              }
            }
            break
          }
        }

        let folio_afecta = 0
        for (var j in this.casosEspeciales) {
          if (this.casosEspeciales[j].ce_concepto_P == concepto) {
            folio_afecta = this.folioxafectar
          }
        }

        let folio_comprobacion = ''
        folio_comprobacion = this.editedItem.sp_folio_comprobacion
        //***********************
        //CREAR P o NP PRINCIPAL
        //***********************
        let body = {}
        if (this.isPreCaptura) {
          body = {
            sp_tipo_sol: tiposol,
            sp_concepto: concepto,
            prov_id: prov,
            cuecon_cuenta: cuenta,
            sp_descripcion: this.editedItem.sp_descripcion,
            sp_pago_nombre_de: pagoNombreDecodificado,
            sp_importe: this.editedItem.sp_importe,
            sp_observacion: this.editedItem.sp_observacion,
            sp_fuente_fin: ftefin,
            sp_emp_id_sol: solicita,
            sp_emp_id_aut: autoriza,
            sp_direccion_sol: dirsolicita,
            sp_vobo_emp_id: vistobueno,
            sp_estatus: this.editedItem.sp_estatus,
          }
        } else {
          body = {
            sp_tipo_sol: tiposol,
            sp_concepto: concepto,
            prov_id: prov,
            cuecon_cuenta: cuenta,
            sp_descripcion: this.editedItem.sp_descripcion,
            sp_pago_nombre_de: pagoNombreDecodificado,
            sp_importe: this.editedItem.sp_importe,
            sp_observacion: this.editedItem.sp_observacion,
            sp_fecha_solicitud: this.editedItem.sp_fecha_solicitud,
            //sp_folio_comprobacion: this.editedItem.sp_folio_comprobacion,
            sp_folio_comprobacion: folio_comprobacion,
            sp_num_oficio: this.editedItem.sp_num_oficio,
            sp_fuente_fin: ftefin,
            sp_no_factura: this.editedItem.sp_no_factura,
            sp_fecha_factura: this.editedItem.sp_fecha_factura,
            //sp_fecha_factura: fecha_factura,
            sp_fecha_factura_prob_pago: this.editedItem.sp_fecha_factura_prob_pago,
            //sp_fecha_factura_prob_pago: fecha_factura_prob,
            sp_emp_id_sol: solicita,
            sp_emp_id_aut: autoriza,
            sp_direccion_sol: dirsolicita,
            sp_vobo_emp_id: vistobueno,
            //sp_estatus: 'CREADO',
            sp_estatus: this.editedItem.sp_estatus,
            //sp_saldo: saldo,
            sp_saldo: saldofolioafecta,
            sp_id_folio_afecta: folio_afecta,
            sp_devolucion_efectivo: devEfectivo,
            sp_fechaCreado: this.editedItem.sp_fechaCreado,
            sp_user_elabora: this.usuario.usr_id
           // sp_fecha_precaptura: this.editedItem.sp_fecha_precaptura,
          }
        }
        //console.log('Estatus: ' + this.editedItem.sp_estatus)
        let payload = {
          jwt: jwt,
          body: body,
        }
        //console.log(this.editedItem)

        this.editedItem2 = Object.assign({}, this.editedItem)
        //*********************************
        // CREAR O EDITAR
        //*********************************
        if (this.editedIndex > -1) {
          //EDITAR SOLICITUD DE PAGOS
          payload.id = this.editedItem.sp_id
          payload.ejercicio = this.editedItem.sp_ejercicio
          await this.$store
            .dispatch('solpago/editSolPagos', payload)
            .then(() => {
              this.msgStore = 'El registro se actualizo con éxito'
              /*  var opcion = confirm('Desea Imprimir la solicitud: ' + this.editedItem2.sp_id + ' ?')
              if (opcion) {
                this.imprimeFormato(this.editedItem2.sp_id, null, this.editedItem2)
              } */
              this.overlay = false
            })
            .catch((err) => {
              this.$store.commit('ALERT', {
                color: 'error',
                text: err.response.data.msg,
              })
              this.overlay = false
            })
          if (this.editedItem.sp_tipo_sol == 1) {
            let bodyos = {}
            let payloados = {}
            bodyos = {
              osEstatus: this.estatusOrden,
              sp_ejercicio: this.editedItem.sp_ejercicio,
              sp_id: this.editedItem.sp_id,
            }
            payloados = { jwt: jwt, body: bodyos }
            await this.$store
              .dispatch('ordencompra/editEstatusSP', payloados)
              .then(() => {
                this.msgStore = 'El registro se actualizo con éxito'
                this.overlay = false
              })
              .catch((err) => {
                this.error = err
              })
            //actuliza fecha de pago en seguiiento orden
            let bodySol = {
              sp_id: this.editedItem.sp_id,
              osEjercicio: this.editedItem.sp_ejercicio,
              os_fecha_pag: this.editedItem.os_fecha_pag,
              os_user_pag: this.usuario.usr_id,
            }
            let payloadSol = { jwt: jwt, body: bodySol }
            await this.$store.dispatch('ordencompra/editSeguimiento', payloadSol)

            // Editar fecha de seguimiento de solicitud
            let payload3 = {}
            let body3 = {
              sp_id: this.editedItem.sp_id,
              sp_ejercicio: this.editedItem.sp_ejercicio,
              sp_fechaCreado: sp_fecha_creado,
            }
            payload3 = { jwt: jwt, body: body3 }
            await this.$store
              .dispatch('solpago/editCampoSol', payload3)

              .then(() => {
                this.msgStore = 'El registro se actualizo con éxito'
                this.overlay = false
              })
              .catch((err) => {
                this.error = err
              })
          }

          /****************************************/
          if (this.editedItem.sp_tipo_sol == 1 && this.editedItem.sp_id_comp > 0) {
            let bodyos = {}
            let payloados = {}
            bodyos = {
              osEstatus: this.estatusOrden,
              sp_ejercicio: this.editedItem.sp_ejercicio,
              sp_id: this.editedItem.sp_id,
            }
            payloados = { jwt: jwt, body: bodyos }
            await this.$store
              .dispatch('ordencompra/editEstatusSP', payloados)
              .then(() => {
                this.msgStore = 'El registro se actualizo con éxito'
                this.overlay = false
              })
              .catch((err) => {
                this.error = err
              })
            //actuliza fecha de comprobacion en seguiiento orden
            let bodySol = {
              sp_id: this.editedItem.sp_id,
              osEjercicio: this.editedItem.sp_ejercicio,
              os_fecha_comprob: this.editedItem.sp_fecha_pag,
              os_user_comprob: this.usuario.usr_id,
            }
            let payloadSol = { jwt: jwt, body: bodySol }
            await this.$store.dispatch('ordencompra/editSeguimiento', payloadSol)

            // Editar fecha de seguimiento de solicitud
            let payload3 = {}
            let body3 = {
              sp_id: this.editedItem.sp_id,
              sp_ejercicio: this.editedItem.sp_ejercicio,
              sp_fechaCreado: sp_fecha_creado,
            }
            payload3 = { jwt: jwt, body: body3 }
            await this.$store
              .dispatch('solpago/editCampoSol', payload3)

              .then(() => {
                this.msgStore = 'El registro se actualizo con éxito'
                this.overlay = false
              })
              .catch((err) => {
                this.error = err
              })
          }

          /*********************************************/
          if (this.editedItem.sp_tipo_sol == 2) {
            // Editar ESTATUS DE COMPRA CUANDO ES TIPO NP
            body = {
              osEstatus: 'PRELIB',
              sp_ejercicio: this.editedItem.sp_ejercicio,
              sp_id: this.editedItem.sp_id,
            }
            payload = { jwt: jwt, body: body }
            await this.$store.dispatch('ordencompra/editEstatusSP', payload)

            // Editar seguimiento DE ORDEN DE COMPRA ACTUALIZA FECHA PRELIB
            let payload2 = {}
            let body2 = {
              sp_id: this.editedItem.sp_id,
              osEjercicio: this.editedItem.sp_ejercicio,
              os_fecha_prelib: os_fecha_prelib,
              os_user_prelib: this.usuario.usr_id,
            }
            payload2 = { jwt: jwt, body: body2 }
            await this.$store.dispatch('ordencompra/editSeguimiento', payload2)

            // Editar fecha de seguimiento de solicitud
            let payload3 = {}
            let body3 = {
              sp_id: this.editedItem.sp_id,
              sp_ejercicio: this.editedItem.sp_ejercicio,
              sp_fechaCreado: sp_fecha_creado,
            }
            payload3 = { jwt: jwt, body: body3 }
            await this.$store
              .dispatch('solpago/editCampoSol', payload3)

              .then(() => {
                this.msgStore = 'El registro se actualizo con éxito'
                this.overlay = false
              })
              .catch((err) => {
                this.error = err
              })
          }
          Object.assign(this.solpagos[this.editedIndex], this.editedItem)
        } else {
          //********************************************************** */
          // A G R E G A R
          //********************************************************** */
          //AGREGAR SOLICITUD DE PAGOS
          //OBTENER FOLIO SIGUIENTE POR AÑO - 23/Dic/2021
          //var currentTime = new Date()
          //var year = currentTime.getFullYear()
          //Obtener Folio Siguiente
          var year = this.editedItem.sp_ejercicio

          //console.log('year ' + year)
          await this.obtenerIdSolPagos(jwt, year)
          let sp_folio = parseInt(this.sgteIdSolPag)
          body.sp_ejercicio = year
          body.sp_id = sp_folio

          if (this.isPreCaptura) {
            //ES PRECAPTURA
            //console.log('year ' + year)
            await this.$store
              .dispatch('solpago/addPreSolPagos', payload)
              .then(() => {
                this.msgStore = 'El registro se creó con éxito'
              })
              .catch((err) => {
                this.$store.commit('ALERT', {
                  color: 'error',
                  text: err.response.data.msg,
                })
                this.overlay = false
              })
          } else {
            //ES CAPTURA NORMAL
            let sp_id_exedente = 0
            await this.$store
              .dispatch('solpago/addSolPagos', payload)
              .then(() => {
                this.msgStore = 'El registro se creó con éxito'
                //sp_folio = response.data.id
                //********************************************************** */
                //Si es caso especial actualizar saldos de los folios x comprobar
                //********************************************************** */
                if (isCasoEspecial) {
                  let sp_id = 0
                  let body2 = {}

                  let SalfoTot = saldo
                  let saldoUnitario = 0
                  let sp_ejercicio_afecta = 0
                  for (var i in this.selected) {
                    sp_id = this.selected[i].sp_id
                    //2/ENE/2021
                    //folio_afecta = response.data.id
                    folio_afecta = sp_folio
                    //sp_ejercicio_afecta = response.data.sp_ejercicio
                    sp_ejercicio_afecta = this.selected[i].sp_ejercicio

                    //folio_afecta = sp_folio
                    //console.log('importeTot: ' + importeTot)
                    //console.log('saldoUnitario: ' + saldoUnitario)
                    if (importeTot > parseFloat(this.selected[i].sp_saldo)) {
                      saldoUnitario = 0
                      importeTot = importeTot - parseFloat(this.selected[i].sp_saldo)
                    } else {
                      saldoUnitario = SalfoTot
                    }

                    body2 = {
                      sp_saldo: saldoUnitario,
                      sp_devolucion_efectivo: 0,
                      //sp_id_folio_afecta: response.data.id,
                      sp_id_folio_afecta: sp_folio,
                      //sp_ejercicio_afecta: response.data.sp_ejercicio_afecta,
                      sp_ejercicio_afecta: year,
                    }
                    /*
                  console.log('saldo ' + saldo)
                  console.log('body2')
                  console.log(body2)
                  */

                    let payload2 = { jwt: jwt, body: body2 }
                    payload2.id = sp_id
                    payload2.ejercicio = sp_ejercicio_afecta
                    this.$store
                      .dispatch('solpago/addActualizaSaldo', payload2)
                      .then(() => {
                        //console.log('cuenta_excedente: ' + cuenta_excedente)

                        this.error = ''
                      })
                      .catch((err) => {
                        this.error = err
                      })
                  }
                  //console.log('diferencia ' + diferencia)
                  //console.log('ce_concepto_excedente ' + ce_concepto_excedente)
                  //console.log('cuenta_excedente ' + cuenta_excedente)

                  if (diferencia != 0 && ce_concepto_excedente > 0 && cuenta_excedente != '') {
                    //****************************************** */
                    // CREAR SOLICITUD DE EXCEDENTE EN CASO ESPECIAL
                    //****************************************** *
                    //
                    let body3 = {
                      sp_tipo_sol: 1,
                      sp_concepto: ce_concepto_excedente,
                      prov_id: prov,
                      cuecon_cuenta: cuenta_excedente,
                      sp_descripcion: desc_concepto_excedente,
                      sp_pago_nombre_de: pagoNombreDecodificado,
                      sp_importe: diferencia * -1,
                      sp_observacion: '',
                      sp_fecha_solicitud: this.editedItem.sp_fecha_solicitud,
                      sp_folio_comprobacion: '',
                      sp_num_oficio: this.editedItem.sp_num_oficio,
                      sp_fuente_fin: ftefin,
                      sp_no_factura: this.editedItem.sp_no_factura,
                      sp_fecha_factura: this.editedItem.sp_fecha_factura,
                      sp_fecha_factura_prob_pago: this.editedItem.sp_fecha_factura_prob_pago,
                      sp_emp_id_sol: solicita,
                      sp_emp_id_aut: autoriza,
                      sp_direccion_sol: dirsolicita,
                      sp_vobo_emp_id: vistobueno,
                      sp_estatus: 'CREADO',
                      sp_saldo: 0,
                      sp_id_folio_afecta: folio_afecta,
                      sp_ejercicio_afecta: sp_ejercicio_afecta,
                      sp_devolucion_efectivo: 0,
                      sp_fecha_precaptura: this.editedItem.sp_fecha_precaptura,
                    }
                    //Se Crea otro folio del que ya se obtuvo + 1
                    let sp_folio2 = sp_folio + 1
                    body3.sp_ejercicio = year
                    body3.sp_id = sp_folio2

                    //console.log('cuenta_excedente:' + cuenta_excedente)
                    let payload3 = {
                      jwt: jwt,
                      body: body3,
                    }
                    this.$store
                      .dispatch('solpago/addSolPagos', payload3)
                      .then(() => {
                        this.error = ''
                        //sp_id_exedente = response2.data.id
                        sp_id_exedente = sp_folio2
                        //imprimir folio excedente
                        var opcion2 = confirm(
                          'Desea Imprimir la solicitud de : ' +
                            desc_concepto_excedente +
                            ': ' +
                            sp_id_exedente +
                            ' ?'
                        )
                        if (opcion2) {
                          imprimeFormatoSolPag(sp_id_exedente, this, year)
                        }

                        //****************************************** */
                        // ACTUALIZA EL FOLIO DE COMPROBACION PARA NUEVA
                        // SOLICITUD EXCEDENTE DE CASOS ESPECIALES
                        //****************************************** */

                        let body4 = {
                          sp_folio_comprobacion:
                            folio_comprobacion + ',' + year + ' ' + sp_id_exedente,
                        }
                        //console.log('body4')
                        //console.log(body4)
                        let payload4 = { jwt: jwt, body: body4 }
                        payload4.id = sp_folio
                        payload.ejercicio = year
                        this.$store
                          .dispatch('solpago/addActualizaFolComp', payload4)
                          .then(() => {
                            this.error = ''
                          })
                          .catch((err) => {
                            this.error = err
                          })
                      })
                      .catch((err) => {
                        this.error = err
                      })
                  }
                }

                //this.solpagos.push(response.data)
                //Preguntar  si Imprime

                var opcion = confirm('Desea Imprimir la solicitud: ' + sp_folio + ' ?')
                if (opcion) {
                  //this.imprimeFormato(response.data.id, null, this.editedItem2)
                  imprimeFormatoSolPag(sp_folio, this, year)
                }
                this.overlay = false
              })
              .catch((err) => {
                this.$store.commit('ALERT', {
                  color: 'error',
                  text: err.response.data.msg,
                })
                this.overlay = false
              })
          }
        }

        //Mensaje Final
        this.$store.commit('ALERT', {
          color: 'success',
          text: this.msgStore,
        })

        this.msgStore = ''
        this.close(this.checkbox)
        this.changed = false
        this.dialogfince = false
        this.checkboxSaldo = false
        //jwt = await getValidToken(this)
        //this.obtenerSolPagos(jwt, 0, this.ejercicio)
        await this.iniciando()
      }
    },
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
    // al escoger un tipo de solicitud
    async setfilterConcepto(value) {
      // secuencia : 1
      let jwt = await getValidToken(this)
      let tipo = ''
      if (value.tipo_descripcion === 'Presupuestal') {
        tipo = 'SOLP'
      } else {
        tipo = 'SOLNP'
      }
      let filtro =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=' +
        tipo +
        '&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      await this.obtenerConceptos(jwt, filtro)
      //Nullos Proveedores y cuentas
      //console.log('value en setfilterConcepto: ')
      //console.log('value.tipo_clave:' + value.tipo_clave)
      await this.obtenerProveedores(jwt, value.tipo_id, value.tipo_clave)
      //console.log('value.prov_id ' + value.prov_id)
      await this.obtenerCuentas(jwt, value.prov_id, this.tipo_temp)
      this.editedItem.sp_pago_nombre_de = ''

      this.isTipo = false
      this.isConcepto = true
      this.isProveedor = true
      /* if (this.conceptos.length > 0) {
        this.isTipo = false
        this.isConcepto = true
        this.isProveedor = true
      } else {
        this.isTipo = true
        this.isConcepto = true
        this.isProveedor = true
      }
      console.log(
        'this.conceptos.length = ' +
          this.conceptos.length +
          ' this.isTipo = ' +
          this.isTipo +
          ' this.isConcepto = ' +
          this.isConcepto +
          ' this.isProveedor = ' +
          this.isProveedor
      ) */

      //this.obtenerCuentas(jwt, 0, 0)

      //let cuenta = this.cuentas.find((elemento) => elemento.id_tipo_reten == value.id_tipo_reten)
      //this.editedItem.id_cta = cuenta.id_cta
    },
    // al escoger un tipo de concepto
    async setfilterProveedor(value) {
      // secuencia : 2
      let jwt = await getValidToken(this)

      this.tipo_temp = value.tipo_id
      this.clave_temp = value.tipo_clave
      //console.log('value.tipo_id', value.tipo_id, 'value.tipo_clave', value.tipo_clave)
      await this.obtenerProveedores(jwt, value.tipo_id, value.tipo_clave)
      this.editedItem.sp_pago_nombre_de = ''
      this.isTipo = false
      this.isConcepto = false
      this.isProveedor = true
      await this.obtenerCuentas(jwt, this.editedItem.prov_id.prov_id, this.tipo_temp)

      //console.log('this.cuentas :')
      //console.log(this.cuentas)

      //await this.obtenerCuentas(jwt, null, null)
      /* if (this.proveedores.length > 0) {
        this.isTipo = false
        this.isConcepto = false
        this.isProveedor = true
      } else {
        this.isTipo = false
        this.isConcepto = true
        this.isProveedor = true
      }

      console.log(
        'this.proveedores.length = ' +
          this.proveedores.length +
          ' this.isTipo = ' +
          this.isTipo +
          ' this.isConcepto = ' +
          this.isConcepto +
          ' this.isProveedor = ' +
          this.isProveedor
      ) */
      //let cuenta = this.cuentas.find((elemento) => elemento.id_tipo_reten == value.id_tipo_reten)
      //this.editedItem.id_cta = cuenta.id_cta
    },
    // al escoger un Proveedor
    async setfilterCuentas(value) {
      // secuencia : 3
      //console.log('ENTRO A: setfilterCuentas')
      let jwt = await getValidToken(this)
      //let casoEspecial = false
      //verificar si es caso especial, para poder escoger que folio aplica
      //let tipo_sol = this.editedItem.sp_tipo_sol.tipo_id

      //Concepto aplicando
      //Seleccionar un
      let conceptoP = this.editedItem.sp_concepto.tipo_id
      if (this.editedItem.sp_tipo_sol.tipo_descripcion === 'Presupuestal') {
        for (var i in this.casosEspeciales) {
          if (this.casosEspeciales[i].ce_concepto_P == conceptoP) {
            this.ce_concepto_NP = this.casosEspeciales[i].ce_concepto_NP
            this.ce_faltante = this.casosEspeciales[i].ce_faltante
            this.ce_excedente = this.casosEspeciales[i].ce_excedente
            this.ce_concepto_excedente = this.casosEspeciales[i].ce_concepto_excedente
            this.isCasoEspecial = true
            await this.ObtenerSolpagosAfectar(jwt, 2, this.ce_concepto_NP, value.prov_id)
            //verificar que hay solpagos por afectar
            console.log('solpagosAfectar ' + this.solpagosAfectar.length)
            if (this.solpagosAfectar.length > 0) {
              //Abrir nuevo modal para escoger
              this.dialogce = true
            }
          }
        }
      }

      this.prov_temp = value.prov_id
      //console.log('value.cuecon_cuenta:' + value.cuecon_cuenta)
      //console.log(' this.clave_temp:' + this.clave_temp)
      //console.log(' this.tipo_temp:' + this.tipo_temp)

      //console.log('value en setfilterCuentas')
      if (value.cuecon_cuenta == undefined) {
        //console.log('Entro else if (value.cuecon_cuenta == undefined)')

        this.editedItem.sp_pago_nombre_de = value.prov_razon_social
        //console.log('value.tipo_clave:' + value.tipo_clave)
        if (this.clave_temp == 'finlaboral') {
          await this.obtenerCuentas(jwt, value.prov_id, this.tipo_temp)
          this.DisabledPagoNombreDe = false
        } else if (this.clave_temp == 'devsalemp') {
          await this.obtenerCuentas(jwt, 0, this.tipo_temp)
          this.DisabledPagoNombreDe = true
        } else if (this.clave_temp == 'concdevror') {
          await this.obtenerCuentas(jwt, 0, this.tipo_temp)
          this.editedItem.sp_pago_nombre_de = ''
          this.DisabledPagoNombreDe = false
        } else if (this.clave_temp == 'penalim') {
          await this.obtenerCuentas(jwt, 0, this.tipo_temp)
          this.editedItem.sp_pago_nombre_de = value.prov_razon_social
          this.DisabledPagoNombreDe = true
        } else {
          await this.obtenerCuentas(jwt, value.prov_id, this.tipo_temp)
          //console.log('this.cuentas.length =' + this.cuentas.length)
          if (this.cuentas.length == 0) {
            await this.obtenerCuentas(jwt, this.prov_temp, 0)
            //console.log('this.cuentas.length =' + this.cuentas.length)
          }
          this.DisabledPagoNombreDe = true
        }
      } else if (value.cuecon_cuenta != '') {
        //penalim
        //await this.obtenerCuentas(jwt, 0, this.tipo_temp)

        await this.obtenerCuentas(jwt, this.prov_temp, this.tipo_temp)
        //console.log('this.cuentas.length =' + this.cuentas.length)
        if (this.cuentas.length == 0) {
          await this.obtenerCuentas(jwt, this.prov_temp, 0)
        }

        this.editedItem.sp_pago_nombre_de = value.prov_razon_social
        this.DisabledPagoNombreDe = true
      }

      this.editedItem.cuecon_cuenta = this.cuentas[0].cuecon_cuenta
      this.isTipo = false
      this.isConcepto = false
      this.isProveedor = false
    },
    // al escoger direccion solicita
    async setfilterEmpSol(value) {
      let jwt = await getValidToken(this)
      //this.prov_temp = value.prov_id
      await this.obtenerEmpleadoSolicita(jwt, value.emp_direccion)
      this.isSolicita = false
    },
    // al escoger empleado que solicita
    setfilterVistoBueno(value) {
      if (value.emp_codigo_director != this.empleadoaut[0].emp_codigo_director) {
        if (value.emp_codigo_director != value.emp_codigo) {
          let empId = this.directores.find(
            (elemento) => elemento.emp_codigo_director == value.emp_codigo_director
          )

          this.editedItem.sp_vobo_emp_id = empId.emp_id
        }
      }
    },
    //al cambiar direccion que solicita
    onChangevobo() {
      this.editedItem.sp_vobo_emp_id = 0
    },

    /*   onChangecancela() {
      //this.editedItem.sp_vobo_emp_id = 0
      console.log(this.sp_motivo_cancelacionErrors)
    }, */

    // Eliminar Tipo
    async printItem(item) {
      this.editedItem = Object.assign({}, item)
      imprimeFormatoSolPag(this.editedItem.sp_id, this, this.editedItem.sp_ejercicio)
    },

    async fince() {
      this.dialogfince = true
    },

    imprimir() {
      this.overlay = true
      this.$v.$touch()
      //this.imprimeFormato(this.editedItem.sp_id, this.editedItem)
      imprimeFormatoSolPag(this.editedItem.sp_id, this, this.editedItem.sp_ejercicio)
      /*       if (!this.$v.$invalid) {
      }
 */
    },

    async aceptarce() {
      if (this.selected.length > 0) {
        //Recorrer los seleccionados
        let sp_id = 0
        let sp_ejercicio = 0
        let folios = ''
        let desc = ''
        let fecPago = ''
        let saldo = 0
        let empsol = 0
        let dirsol = 0
        var i = 0

        for (i in this.selected) {
          sp_id = this.selected[i].sp_id
          sp_ejercicio = this.selected[i].sp_ejercicio
          folios = folios + sp_ejercicio + '-' + sp_id + ','
          saldo = saldo + parseFloat(this.selected[i].sp_saldo)
          desc = this.selected[i].sp_descripcion
          fecPago = this.selected[i].sp_fecha_pago
          empsol = this.selected[i].sp_emp_id_sol
          dirsol = this.selected[i].sp_direccion_sol
        }
        //this.folioxafectar = this.selected[0].sp_id
        this.saldoxafectar = saldo
        this.editedItem.sp_folio_comprobacion = folios.substring(0, folios.length - 1)
        //this.editedItem.sp_folio_comprobacion = folios.slice(0, -1)
        this.editedItem.sp_importe = this.saldoxafectar
        this.editedItem.sp_descripcion = 'Comprobacion de ' + desc
        var fecha = new Date(fecPago)
        this.editedItem.sp_fecha_factura_prob_pago = this.fechaformato(fecha)
        this.editedItem.sp_fecha_precaptura = this.fechaformato(fecha)
         this.editedItem.sp_fechaCreado = this.fechaformato(fecha)
        this.editedItem.sp_fecha_pag = this.fechaformato(fecha)
        this.editedItem.sp_direccion_sol = dirsol
        this.editedItem.sp_emp_id_sol = empsol

        //ANterior solo se escogia 1
        /* this.folioxafectar = this.selected[0].sp_id
        this.saldoxafectar = this.selected[0].sp_saldo
        this.editedItem.sp_folio_comprobacion = this.selected[0].sp_id
        this.editedItem.sp_importe = this.saldoxafectar
        this.editedItem.sp_descripcion = 'Comprobacion de ' + this.selected[0].sp_descripcion
        var fecha = new Date(this.selected[0].sp_fecha_pago)
        this.editedItem.sp_fecha_factura_prob_pago = this.fechaformato(fecha)
        this.editedItem.sp_direccion_sol = this.selected[0].sp_direccion_sol
        this.editedItem.sp_emp_id_sol = this.selected[0].sp_emp_id_sol */
        this.dialogce = false
      }
    },
    // Evalua el caracter para saber si es un numero
    isNumber: function (evt) {
      evt = evt ? evt : window.event
      var charCode = evt.which ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
        evt.preventDefault()
      } else {
        return true
      }
    },

    async PreSave() {
      //console.log('Entro a Presave')
      let isCasoEspecial = false
      let concepto = 0
      if (this.editedItem.sp_concepto.tipo_id == null) {
        concepto = this.editedItem.sp_concepto
      } else {
        concepto = this.editedItem.sp_concepto.tipo_id
      }

      for (var i in this.casosEspeciales) {
        if (this.casosEspeciales[i].ce_concepto_P == concepto) {
          isCasoEspecial = true
          //await this.save()
          break
        }
      }
      if (isCasoEspecial) {
        await this.fince()
      } else {
        await this.save()
      }
    },
    MASK(form, n, mask, format) {
      //      console.log('form: ' + form)
      //     console.log('n: ' + n)
      //   console.log('mask: ' + mask)
      // console.log('format: ' + format)
      if (format == 'undefined') format = false
      let XMASK = ''
      if (format || this.NUM(n)) {
        let dec = 0
        let point = 0
        let x = mask.indexOf('.') + 1
        if (x) {
          dec = mask.length - x
        }

        if (dec) {
          n = this.NUM(n, dec) + ''
          x = n.indexOf('.') + 1
          if (x) {
            point = n.length - x
          } else {
            n += '.'
          }
        } else {
          n = this.NUM(n, 0) + ''
        }
        for (x = point; x < dec; x++) {
          n += '0'
        }
        x = n.length
        let y = mask.length

        while (x || y) {
          if (x) {
            while (y && '#0.'.indexOf(mask.charAt(y - 1)) == -1) {
              if (n.charAt(x - 1) != '-') XMASK = mask.charAt(y - 1) + XMASK
              y--
            }
            ;(XMASK = n.charAt(x - 1) + XMASK), x--
          } else if (y && '$0'.indexOf(mask.charAt(y - 1)) + 1) {
            XMASK = mask.charAt(y - 1) + XMASK
          }
          if (y) {
            y--
          }
        }
      } else {
        XMASK = ''
      }
      if (form) {
        form.value = XMASK
        if (this.NUM(n) < 0) {
          form.style.color = '#FF0000'
        } else {
          form.style.color = '#000000'
        }
      }
      //console.log('XMASK: ' + XMASK)
      this.editedItem.sp_importe = XMASK
      return XMASK
    },
    NUM(s1, dec) {
      for (var s = s1 + '', num = '', x = 0; x < s.length; x++) {
        let c = s.charAt(x)
        if ('.-+/*'.indexOf(c) + 1 || (c != ' ' && !isNaN(c))) {
          num += c
        }
      }
      if (isNaN(num)) {
        num = eval(num)
      }
      if (num == '') {
        num = 0
      } else {
        num = parseFloat(num)
      }
      if (dec != undefined) {
        let r = 0.5
        if (num < 0) r = -r
        let e = Math.pow(10, dec > 0 ? dec : 0)
        return parseInt(num * e + r) / e
      } else {
        return num
      }
    },
    formateoInfoExportar(opcion) {
      var i
      if (opcion == 'CREADOS') {
        if (this.solpagos.length > 0) {
          this.solpagosExportar = []
          for (i in this.solpagos) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagos[i].sp_ejercicio,
              sp_id: this.solpagos[i].sp_id,
              nombre_sol: this.solpagos[i].nombre_sol,
              nom_tipo_sol: this.solpagos[i].nom_tipo_sol,
              nom_concepto: this.solpagos[i].nom_concepto,
              sp_pago_nombre_de: this.solpagos[i].sp_pago_nombre_de,
              cuecon_cuenta: "'" + this.solpagos[i].cuecon_cuenta + "'",
              sp_descripcion: this.solpagos[i].sp_descripcion,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagos[i].sp_importe),
              sp_fecha_solicitud: this.formato(
                this.eFormatos.FECHA,
                this.solpagos[i].sp_fecha_solicitud
              ),
              nom_fuente_fin: this.solpagos[i].nom_fuente_fin,
              nom_user_elabora: this.solpagos[i].nom_user_elabora,
              direccion_sol: this.solpagos[i].direccion_sol,
              estatus_nombre: this.solpagos[i].estatus_nombre,
            }
            this.solpagosExportar.push(fieldsPagos)
          }
        }
      }
    },
    async recibeOrden() {
      try {
        if (this.selected.length > 0) {
          let jwt = await getValidToken(this)
          let sp_id = 0
          let sp_ejercicio = 0
          let body = {}
          let payload = {}

          for (var i in this.selected) {
            sp_id = this.selected[i].sp_id
            sp_ejercicio = this.selected[i].sp_ejercicio
            var fecha = new Date()
            const sp_fecha_precaprec = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
            const os_fecha_solpag = this.formato(this.eFormatos.FECHA_FORMATO, fecha)

            // Editar solpago
            body = {
              sp_estatus: 'PRECAPREC',
              sp_ejercicio: sp_ejercicio,
              sp_id: sp_id,
            }
            payload = { jwt: jwt, body: body }
            await this.$store.dispatch('solpago/editEstSol', payload)

            // Editar ordencompra
            body = {
              osEstatus: 'SOLPAG',
              sp_ejercicio: sp_ejercicio,
              sp_id: sp_id,
            }
            payload = { jwt: jwt, body: body }
            await this.$store.dispatch('ordencompra/editEstatusSP', payload)

            // Editar seguimiento
            let payload2 = {}
            let body2 = {
              sp_id: sp_id,
              osEjercicio: sp_ejercicio,
              os_fecha_solpag: os_fecha_solpag,
              os_user_solpag: this.usuario.usr_id,
            }
            payload2 = {
              jwt: jwt,
              body: body2,
            }
            await this.$store.dispatch('ordencompra/editSeguimiento', payload2)

            // Editar fecha de seguimiento de solicitud
            let payload3 = {}
            let body3 = {
              sp_id: sp_id,
              sp_ejercicio: sp_ejercicio,
              sp_fecha_precaprec: sp_fecha_precaprec,
              sp_user_precaprec: this.usuario.usr_id,
            }
            payload3 = { jwt: jwt, body: body3 }
            await this.$store.dispatch('solpago/editCampoSol', payload3)
          }

          this.$store.commit('ALERT', {
            color: 'success',
            text: 'Registro actualizado correctamente',
          })
          this.$root.$emit('guardado-exitoso')
          await this.iniciando()
        }
      } catch (error) {
        this.$store.commit('ALERT', {
          color: 'error',
          text: error.response ? error.response.data.msg : error.message,
        })
      }
    },

    async onChangeEjercicioRec(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await this.obtenerParaRecib(jwt, 0, value.sp_ejercicio)
    },

    async onChangeEjercicio(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await this.obtenerSolPagos(jwt, 0, value.sp_ejercicio)
    },
    async onChangeEjercicioCap(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      this.editedItem.sp_ejercicio = value.sp_ejercicio
    },
    formato(opcion, valor) {
      if (opcion == this.eFormatos.IMPORTE) {
        return tools.formatoImporte(valor)
      } else if (opcion == this.eFormatos.MONEDA) {
        return tools.formatoMoneda(valor)
      } else if (opcion == this.eFormatos.FECHA) {
        return tools.convierteNumeroFechaVista(valor)
      } else if (opcion == this.eFormatos.FECHA_FORMATO) {
        return tools.fechaformato(valor)
      }
    },
    //25/FEB/2022
    EjercicioValido() {
      //console.log(this.ejercicio)
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      if (this.ejercicio == 0) {
        var currentTime = new Date()
        this.ejercicio = currentTime.getFullYear()
      }
      this.editedItem.sp_ejercicio = this.ejercicio
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
