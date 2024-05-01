<template>
  <v-container id="data-tables" tag="section">
    <v-overlay :value="overlay"
      ><v-progress-circular indeterminate color="blue"></v-progress-circular
    ></v-overlay>
    <base-material-card color="blue" icon="mdi-eye-settings-outline" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading></template>

      <!-- <v-overlay :value="overlay">
        <v-progress-circular :size="50" color="green" indeterminate></v-progress-circular>
      </v-overlay> -->
      <template v-slot:corner-button>
        <v-row>
          <v-col cols="8">
            <v-select
              v-model="ejercicio"
              :items="ejercicios"
              :menu-props="{ top: true, offsetY: true }"
              label="Ejercicio"
              item-text="sp_ejercicio"
              item-value="sp_ejercicio"
              persistent-hint
              dense
              hint="Seleciona Ejercicio"
              @change="onChangeEjercicio"
              return-object
            >
            </v-select>
          </v-col>
        </v-row>
      </template>

      <v-row>
        <v-col cols="6">
          <!-- Empieza DataExporter SEGUIMIENTO-->
          <DataExporter
            :dataArray="solpagosExportar"
            :dataFields="fieldsTodos"
            fileName="seguimiento"
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
      <v-dialog v-model="dialogEdit" persistent-hint max-width="1024px">
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
                    hint="Seleciona Ejercicio"
                    return-object
                    :error-messages="sp_ejercicioErrors"
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
                    :disabled="DisabledPagoNombreDe"
                    dense
                    @input="$v.editedItem.sp_pago_nombre_de.$reset(), (changed = true)"
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
                    no-resize
                    rows="1"
                    dense
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
                    counter="50"
                    @input="$v.editedItem.sp_folio_comprobacion.$reset(), (changed = true)"
                    @blur="$v.editedItem.sp_folio_comprobacion.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo Numero de Oficio -->
                <v-col cols="3">
                  <v-text-field
                    v-model="editedItem.sp_num_oficio"
                    label="Num. de Oficio"
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
                    hint="Seleciona Concepto"
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
            <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled="$v.$invalid">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Empieza Dialogo PRINCIPAL -->
      <v-dialog v-model="dialog" persistent-hint max-width="1024px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }} </span>
            <!-- <v-img src="@/assets/logo.png" width="70%" height="70%"></v-img> -->
            <v-img src="@/assets/logo_ivey.jpg" width="20%" height="20%"></v-img>
          </v-card-title>
          <v-container>
            <div>
              <v-timeline :reverse="reverse" dense>
                <v-spacer></v-spacer>
                <v-timeline-item icon="mdi-eye">
                  <v-row>
                    <v-col cols="6">
                      <p class="text-h4">Mostrar:</p>
                      <v-btn color="blue" small @click="all"> Todos </v-btn>
                      <v-btn color="blue" small @click="none"> Ninguno </v-btn>
                    </v-col>
                    <div class="text-center d-flex pb-4">
                      <!-- <div>{{ panel }}</div> -->
                    </div>
                    <!--<v-col cols="6">
                      <p class="label">Estatus actual:</p>
                      <v-chip label :color="getColor(editedItem.sp_estatus)">
                        <span>{{ editedItem.estatus_nombre }}</span>
                      </v-chip>
                    </v-col>-->
                  </v-row>
                </v-timeline-item>
                <v-timeline-item
                  :color="getColor('PRECAP')"
                  v-if="editedItem.sp_estatus_20 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">0</span>
                  </template>
                  <v-expansion-panels v-model="panel" multiple>
                    <!-- Campo: precaptura  -->
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        1 - {{ editedItem.sp_estatus_20 }} ({{ editedItem.sp_fecha_precaptura }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Folio creado:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">
                                    {{ editedItem.sp_id }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo: FECHA DE SOLICITUD -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha de precaptura:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">
                                    {{ editedItem.sp_fecha_precaptura }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo: Nombre de usuario envia a firma solicitud-->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nom_user_elabora }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- Campo: enviado a precaptura -->
                <v-timeline-item
                  :color="getColor('ENVPRECAP')"
                  v-if="editedItem.sp_estatus_14 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">1</span>
                  </template>
                  <v-expansion-panels v-model="panel1" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        1 - {{ editedItem.sp_estatus_14 }} ({{ editedItem.sp_fecha_envprecap }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Folio creado:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">
                                    {{ editedItem.sp_id }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo: FECHA DE SOLICITUD -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">
                                    Fecha de envio a precaptura:&nbsp;&nbsp;&nbsp;
                                  </p>
                                </div>
                                <div>
                                  <p class="valor">
                                    {{ editedItem.sp_fecha_envprecap }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo: Nombre de usuario envia a firma solicitud-->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_envprecap }}</p>
                                </div>
                              </v-col>
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Descripcion:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="label">{{ editedItem.sp_descripcion }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- Campo: recibe orden-->
                <v-timeline-item
                  :color="getColor('PRECAPREC')"
                  v-if="editedItem.sp_estatus_15 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">2</span>
                  </template>
                  <v-expansion-panels v-model="panel2" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        2 - {{ editedItem.sp_estatus_15 }} ({{ editedItem.sp_fecha_recibe }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: FECHA DE SOLICITUD -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha de recibido:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">
                                    {{ editedItem.sp_fecha_recibe }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo: Nombre de usuario envia a firma solicitud-->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_recibe }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- Campo: libera orden -->
                <v-timeline-item
                  :color="getColor('PRELIB')"
                  v-if="editedItem.sp_estatus_15 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">3</span>
                  </template>
                  <v-expansion-panels v-model="panel3" multiple>
                    <v-expansion-panel v-if="editedItem.sp_estatus_16 != 'NO_APLICA'">
                      <v-expansion-panel-header>
                        3 - {{ editedItem.sp_estatus_16 }} ({{ editedItem.sp_fecha_libera }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: FECHA DE SOLICITUD -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha de liberado:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">
                                    {{ editedItem.sp_fecha_libera }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo: Nombre de usuario envia a firma solicitud-->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_libera }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- Campo: PRECAPXREC -->
                <v-timeline-item
                  :color="getColor('PRECAPXREC')"
                  v-if="editedItem.sp_estatus_17 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">4</span>
                  </template>
                  <v-expansion-panels v-model="panel4" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        4 - {{ editedItem.sp_estatus_17 }} ({{ editedItem.sp_fecha_precaxrec }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: FECHA DE SOLICITUD -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">
                                    Fecha de precaptura por recibir:&nbsp;&nbsp;&nbsp;
                                  </p>
                                </div>
                                <div>
                                  <p class="valor">
                                    {{ editedItem.sp_fecha_precaxrec }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo: Nombre de usuario envia a firma solicitud-->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_precaxrec }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- Campo: PRECAPREC-->
                <v-timeline-item
                  :color="getColor('PRECAPREC')"
                  v-if="editedItem.sp_estatus_18 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">5</span>
                  </template>
                  <v-expansion-panels v-model="panel5" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        5 - {{ editedItem.sp_estatus_18 }} ({{ editedItem.sp_fecha_precaprec }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: FECHA DE SOLICITUD -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">
                                    Fecha de precaptura recibida:&nbsp;&nbsp;&nbsp;
                                  </p>
                                </div>
                                <div>
                                  <p class="valor">
                                    {{ editedItem.sp_fecha_precaprec }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo: Nombre de usuario envia a firma solicitud-->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_precaprec }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- ESTATUS 1 CREADO -->
                <v-timeline-item
                  :color="getColor('CREADO')"
                  v-if="editedItem.sp_estatus_1 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">6</span>
                  </template>
                  <v-expansion-panels v-model="panel6" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        6 - {{ editedItem.sp_estatus_1 }} ({{ editedItem.sp_fechaCreado }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" class="v-text">
                                <div style="float: left">
                                  <p class="label">Ejercicio:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_ejercicio }}</p>
                                </div>
                              </v-col>

                              <!-- Campo TIPO DE SOLICITUD -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Tipo de solicitud:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nom_tipo_sol }}</p>
                                </div>
                              </v-col>
                              <!-- Campo CONCEPTO -->
                              <v-col cols="8" class="v-text">
                                <div style="float: left">
                                  <p class="label">Concepto:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nom_concepto }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Proveedor -->
                              <v-col cols="8" class="v-text">
                                <div style="float: left">
                                  <p class="label">Proveedor:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_pago_nombre_de }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Cuenta -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Cuenta:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.cuecon_cuenta }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Descripcion -->
                              <v-col cols="9" class="v-text">
                                <div style="float: left">
                                  <p class="label">Descripción:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_descripcion }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Importe -->
                              <v-col cols="3" class="v-text">
                                <div style="float: left">
                                  <p class="label">Importe:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">
                                    $&nbsp;{{ formatPrice(editedItem.sp_importe) }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo Observacion -->
                              <v-col cols="12" class="v-text">
                                <div style="float: left">
                                  <p class="label">Observaciones:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_observacion }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Fecha Solicitud -->
                              <v-col cols="3" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha Solicitud:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_solicitud }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Folio de comprobacion -->
                              <v-col cols="3" class="v-text">
                                <div style="float: left">
                                  <p class="label">Folio de Comprobacion:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_folio_comprobacion }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Numero de Oficio -->
                              <v-col cols="3" class="v-text">
                                <div style="float: left">
                                  <p class="label">Num. de Oficio:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_num_oficio }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Fuente financiera -->
                              <v-col cols="3" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fuente Financiera:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nom_fuente_fin }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Numero de factura -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Numero de Factura:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_no_factura }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Fecha Factura -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha Factura:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_factura }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Fecha Probable de pago -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha Probable de Pago:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_factura_prob_pago }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Empleado DIRECCION EMPLEADO SOLICITA -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Direccion Solicita:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_direccion_sol }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Empleado Solicita -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Solicita:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_sol }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Empleado Autoriza -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Autoriza:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_aut }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Empleado Visto Bueno -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Visto Bueno:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_vobo }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Usuario Crea -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario Elaboró:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nom_user_elabora }}</p>
                                </div>
                              </v-col>
                              <!-- Campo Fecha Crea-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha Elaborado:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_elabora }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- ESTATUS 2 SOLFIRIDA-->
                <v-timeline-item
                  :color="getColor('SOLFIRIDA')"
                  v-if="editedItem.sp_estatus_2 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">7</span>
                  </template>
                  <v-expansion-panels v-model="panel7" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        7 - {{ editedItem.sp_estatus_2 }} ({{ editedItem.sp_fecha_firma_sol_ida }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: Grupo envia Firma solicitante -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Grupo Enviado:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">
                                    {{ editedItem.sp_id_gpo_firma_sol }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo: FECHA DE SOLICITUD -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha de Solicitud:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">
                                    {{ editedItem.sp_fecha_firma_sol_ida }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo: Nombre de usuario envia a firma solicitud-->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_firma_sol_ida }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- ESTATUS 3 SOLFIRVTA-->
                <v-timeline-item
                  :color="getColor('SOLFIRVTA')"
                  v-if="editedItem.sp_estatus_3 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">8</span>
                  </template>
                  <v-expansion-panels v-model="panel8" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        8 - {{ editedItem.sp_estatus_3 }} ({{
                          editedItem.sp_fecha_firma_sol_vuelta
                        }})</v-expansion-panel-header
                      >
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: Fecha vuelta frima de solicitante -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha vuelta:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_firma_sol_vuelta }}</p>
                                </div>
                              </v-col>
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">usuario :&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_firma_sol_vuelta }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- ESTATUS 4 AUTFIR-->
                <v-timeline-item
                  :color="getColor('AUTFIR')"
                  v-if="editedItem.sp_estatus_4 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">9</span>
                  </template>
                  <v-expansion-panels v-model="panel9" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        9 - {{ editedItem.sp_estatus_4 }} ({{ editedItem.sp_fecha_firma_aut_ida }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Grupo Autoriza:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_id_gpo_firma_aut_ida }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: Fecha enviada a Autorizacion-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha Enviada:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_firma_aut_ida }}</p>
                                </div>
                              </v-col>
                              <v-col cols="12" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_firma_aut_ida }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- ESTATUS 5 AUTFIRVTA -->
                <v-timeline-item
                  :color="getColor('AUTFIRVTA')"
                  v-if="editedItem.sp_estatus_5 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">10</span>
                  </template>
                  <v-expansion-panels v-model="panel10" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        10 - {{ editedItem.sp_estatus_5 }} ({{
                          editedItem.sp_fecha_autoriza_vuelta
                        }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: Fecha enviada a Tesoreria-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha Recibida:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_autoriza_vuelta }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_autoriza_vuelta }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- ESTATUS 6 PAGOS -->
                <v-timeline-item
                  :color="getColor('PAGOS')"
                  v-if="editedItem.sp_estatus_6 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">11</span>
                  </template>
                  <v-expansion-panels v-model="panel11" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        11 - {{ editedItem.sp_estatus_6 }} ({{
                          editedItem.sp_fecha_firma_aut_vuelta
                        }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: Grupo enviado a pago -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Grupo Pago:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_id_gpo_firma_aut_vuelta }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: Fecha enviada a Tesoreria-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha Enviada:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_firma_aut_vuelta }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_firma_aut_vuelta }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- ESTATUS 7 GASCOM-->
                <v-timeline-item
                  :color="getColor('GASCOM')"
                  v-if="editedItem.sp_estatus_7 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">12</span>
                  </template>
                  <v-expansion-panels v-model="panel12" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        12 -{{ editedItem.sp_estatus_7 }} ({{ editedItem.sp_fecha_conta_gasxcomp }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: Grupo vuelta gxc-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Grupo Enviado:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">
                                    {{ editedItem.sp_id_gpo_firma_aut_vuelta_gxc }}
                                  </p>
                                </div>
                              </v-col>
                              <!-- Campo: Fecha vuelta gxc -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_conta_gasxcomp }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: usuario gastos x comprobar -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_conta_gasxcomp }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- ESTATUS 8 FINPAGO -->
                <v-timeline-item
                  :color="getColor('FINPAGO')"
                  v-if="editedItem.sp_estatus_8 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">13</span>
                  </template>
                  <v-expansion-panels v-model="panel13" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        13 - {{ editedItem.sp_estatus_8 }} ({{ editedItem.sp_fecha_pago }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
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
                              <!-- Campo: Cuenta de pago -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Cuenta de Pago:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.CuentaBancaria }}</p>
                                </div>
                              </v-col>

                              <!-- Campo: poliza de pago -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Poliza Pago:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_no_poliza_pago }}</p>
                                </div>
                              </v-col>

                              <!-- Campo: Folio Pago -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Folio:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_no_folio_pago }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: usuario Pago -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_pago }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: fecha Pago -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha pago:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_pago_cap }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: fecha Pago -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha Captura pago:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_pago }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- ESTATUS 9 FINGXC-->
                <v-timeline-item
                  :color="getColor('FINGXC')"
                  v-if="editedItem.sp_estatus_9 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">14</span>
                  </template>
                  <v-expansion-panels v-model="panel14" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        14 - {{ editedItem.sp_estatus_9 }} ({{ editedItem.sp_fecha_gxc_ent_conta }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Grupo Entrega:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_id_gpo_gxc_ent_conta }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: Fecha enviada a Autorizacion-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha Enviada:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_gxc_ent_conta }}</p>
                                </div>
                              </v-col>
                              <v-col cols="12" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_usr_fingxc }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- ESTATUS 10 XCANCELAR -->
                <v-timeline-item
                  :color="getColor('XCANCELAR')"
                  v-if="editedItem.sp_estatus_10 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">15</span>
                  </template>
                  <v-expansion-panels v-model="panel15" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        15 - {{ editedItem.sp_estatus_10 }} ({{ editedItem.sp_fecha_por_cancelar }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: fecha x cancelar -->
                              <v-col cols="4" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_por_cancelar }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: usuario x cancelar -->
                              <v-col cols="12" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_xcancelar }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: Motivo x cancelar -->
                              <v-col cols="12" class="v-text">
                                <div style="float: left">
                                  <p class="label">Motivo:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_motivo_por_cancelar }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- ESTATUS 11 CANCELAR -->
                <v-timeline-item
                  :color="getColor('CANCELAR')"
                  icon="mdi-cancel"
                  v-if="editedItem.sp_estatus_11 != 'NO_APLICA'"
                >
                  <!--<template v-slot:icon>
                    <span class="timeNumber">16</span>
                  </template>-->
                  <v-expansion-panels v-model="panel16" multiple>
                    <v-expansion-panel>
                      <v-card class="elevation-0">
                        <v-card-text>
                          <v-expansion-panel-header>
                            {{ editedItem.sp_estatus_11 }} ({{ editedItem.sp_fecha_cancelacion }})
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: folio de cancelacion-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio Cancelacion:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ editedItem.sp_folio_cancela }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha cancela:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ editedItem.sp_fecha_cancelacion }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Numero de Poliza -->
                                  <v-col cols="4" class="v-text">
                                    <div style="float: left">
                                      <p class="label">No. Poliza:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ editedItem.sp_poliza_ejercido_cancela }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Motivo de cancelacion-->
                                  <v-col cols="12" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Motivo:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ editedItem.sp_motivo_cancelacion }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: usuario -->
                                  <v-col cols="12" class="v-text">
                                    <div style="float: left">
                                      <p class="label">usuario:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ editedItem.nombre_cancelo }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- COMPROMETIDO Y DEVENGADO -->
                <v-timeline-item v-if="editedItem.sp_estatus_12 != 'NO_APLICA'">
                  <template v-slot:icon>
                    <span class="timeNumber">17</span>
                  </template>
                  <v-expansion-panels v-model="panel17" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        17 - {{ editedItem.sp_estatus_12 }} ({{ editedItem.sp_fecha_folios }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: Folio comprometidos-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Folio(s) Comprometido(s):&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.foliosComprometidos }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: Folio Devengados-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Folio(s) Devengado(s):&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.foliosDevengados }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: Usuario-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_folios }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: Fecha -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_folios }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: Grupo Envia Folios -->
                              <v-col cols="6" class="v-text" v-show="gpoFolio">
                                <div style="float: left">
                                  <p class="label">Grupo Enviado:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_id_gpo_folios }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: Fecha Envio -->
                              <v-col cols="6" class="v-text" v-show="gpoFolio">
                                <div style="float: left">
                                  <p class="label">Fecha Enviado:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_gpo_folios }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: usuario grupo Envio -->
                              <v-col cols="12" class="v-text" v-show="gpoFolio">
                                <div style="float: left">
                                  <p class="label">Usuario Envia:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_gpo_folios }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <!-- EJERCIDO -->
                <v-timeline-item
                  :color="getColor('PRECAPXREC')"
                  v-if="editedItem.sp_estatus_13 != 'NO_APLICA'"
                >
                  <template v-slot:icon>
                    <span class="timeNumber">18</span>
                  </template>
                  <v-expansion-panels v-model="panel18" multiple>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        18 - {{ editedItem.sp_estatus_13 }} ({{ editedItem.sp_fecha_ejercido }})
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card class="elevation-0">
                          <v-card-text>
                            <v-row>
                              <!-- Campo: Fecha de Captura-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Fecha Ejercido:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_ejercido_cap }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: folio de ejercido-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Folio Ejercido:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_folio_ejercido }}</p>
                                </div>
                              </v-col>
                              <!-- Campo: Poliza de ejercido-->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Poliza Ejercido:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_poliza_ejercido }}</p>
                                </div>
                              </v-col>
                              <!-- Campo nombre Usuario ejercido -->
                              <v-col cols="6" class="v-text">
                                <div style="float: left">
                                  <p class="label">Usuario:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_ejercido }}</p>
                                </div>
                              </v-col>

                              <!-- Campo  grupo Enviado ejercido -->
                              <v-col cols="6" class="v-text" v-show="gpoEjercido">
                                <div style="float: left">
                                  <p class="label">Grupo Enviado:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_id_gpo_ejercido }}</p>
                                </div>
                              </v-col>

                              <!-- Campo nombre Usuario ejercido -->
                              <v-col cols="6" class="v-text" v-show="gpoEjercido">
                                <div style="float: left">
                                  <p class="label">Fecha Envia:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.sp_fecha_envia_ejercido }}</p>
                                </div>
                              </v-col>

                              <!-- Campo nombre Usuario ejercido -->
                              <v-col cols="6" class="v-text" v-show="gpoEjercido">
                                <div style="float: left">
                                  <p class="label">Usuario Envia:&nbsp;&nbsp;&nbsp;</p>
                                </div>
                                <div>
                                  <p class="valor">{{ editedItem.nombre_envia_ejercido }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-timeline-item>
                <v-timeline-item icon="mdi-alpha-e">
                  <v-row>
                    <v-col cols="12">
                      <p class="label">Estatus actual:</p>
                      <v-chip label :color="getColor(editedItem.sp_estatus)">
                       <span class="texto-blanco">{{ editedItem.estatus_nombre }}</span>
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-timeline-item>
                <!--</v-expansion-panels>-->
              </v-timeline>
            </div>
            <!--<v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="5">
                    <v-text-field
                      v-model="editedItem.estatus_nombre"
                      label="Estatus Actual"
                      readonly
                      @input="$v.editedItem.estatus_nombre.$reset(), (changed = true)"
                      @blur="$v.editedItem.estatus_nombre.$touch()"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>-->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="checkChanges">Salir</v-btn>
            </v-card-actions>
          </v-container>
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
          <v-icon small class="mr-2" @click="editItem(item)">mdi-eye-settings-outline</v-icon>
          <v-icon small @click="printItem(item)">mdi-printer</v-icon>
          <v-icon
            :disabled="usuario.nom_rol == 'ADMINISTRACION' || usuario.nom_rol == 'CONTABILIDAD'"
            small
            class="mr-2"
            @click="editarItem(item)"
            >mdi-pencil</v-icon
          >
          <!-- <v-icon small @click="deleteItem(item)">mdi-delete</v-icon> -->
        </template>

        <template v-slot:item.estatus_nombre="{ item }">
         <v-chip label :color="getColor(item.sp_estatus)" style="color: white;">
            {{ item.estatus_nombre }}
          </v-chip>
        </template>

        <template v-slot:item.sp_importe="{ item }">
          {{ formatPrice(item.sp_importe) }}
        </template>

        <template v-slot:[`item.info`]="{ item }">
          <div class="name-info-title">{{ item.nom_tipo_sol }}</div>
          <div class="mail-info-subtitle">{{ item.nom_concepto }}</div>
          <!-- <div class="mail-info-subtitle">{{ item.sp_fecha_elabora }}</div> -->
        </template>

        <!--         <template v-slot:[`item.prov`]="{ item }">
          <div class="name-info-title">{{ item.prov_razon_social }}</div>
          <div class="mail-info-subtitle">{{ item.cuecon_cuenta }}</div>
        </template>
 -->
        <template v-slot:[`item.desc`]="{ item }">
          <div class="name-info-title">{{ item.sp_descripcion }}</div>
          <div class="mail-info-subtitle">{{ item.nom_user_elabora }}</div>
        </template>
        <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
          <div class="name-info-title">
            {{ convierteNumeroFecha(item.sp_fecha_solicitud) }}
          </div>
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
</template>

<script>
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'

import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import * as tools from '@/store/modules/tools.store.js'
import { imprimeFormatoSolPag } from '@/store/modules/impresiones.store.js'
import DataExporter from '@/components/general/DataExporter.vue'

export default {
  components: {
    ConfirmationDialog,
    DataExporter,
  },

  data: () => ({
    eFormatos: tools.formatos,
    usuario: JSON.parse(localStorage.getItem('user')),
    DisabledPagoNombreDe: false,
    gpoFolio: false,
    gpoEjercido: false,
    items: 10,
    date: null,
    trip: {
      name: '',
      location: null,
      start: null,
      end: null,
    },
    tipo_temp: 0,
    prov_temp: 0,
    clave_temp: '',
    fromDateMenu: false,
    fromDateFecFact: false,
    fromDateFecPoPago: false,
    minDate: '2021-01-01',
    maxDate: '2050-01-31',
    search: undefined,
    isLoading: false,
    checkbox: false,
    isEditing: false,
    dialog: false,
    dialogEdit: false,
    isSure: false,
    overlay: false,
    changed: false,
    //manejo de secuencia de escoger selects
    isTipo: true,
    isConcepto: true,
    isProveedor: true,
    isSolicita: true,
    headers: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      { text: 'Info', value: 'info' },
      { text: 'Proveedor', value: 'prov_razon_social' },
      //{ text: 'Descripción', value: 'desc' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: '$ Importe', value: 'sp_importe' },
      { text: 'Estatus', value: 'estatus_nombre' },
      //{ text: 'Activo', value: 'cta_activo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //
    value: [],
    solpagos: [],
    solpagosExportar: [],
    fuentesfin: [],
    generales: [],
    estatus: [],
    tipos: [],
    conceptos: [],
    proveedores: [],
    cuentas: [],
    empleadosol: [],
    empleadoaut: [],
    empleadovobo: [],
    directores: [],
    direccion: [],
    ejercicio: 0,
    ejercicios: [],
    panel: [],
    panel1: [],
    panel2: [],
    panel3: [],
    panel4: [],
    panel5: [],
    panel6: [],
    panel7: [],
    panel8: [],
    panel9: [],
    panel10: [],
    panel11: [],
    panel12: [],
    panel13: [],
    panel14: [],
    panel15: [],
    panel16: [],
    panel17: [],
    panel18: [],

    editedIndex: -1,
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
      sp_importe: 0,
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
      sp_importe: 0,
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
    },
    //Para Exportar
    fieldsTodos: {
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
      sp_tipo_sol: { required },
      sp_concepto: { required },
      prov_id: { required },
      sp_emp_id_sol: { required },
      sp_emp_id_aut: { required },
      sp_direccion_sol: { required },
      sp_descripcion: { required, minLength: minLength(3), maxLength: maxLength(250) },
      cuecon_cuenta: { required, minLength: minLength(3), maxLength: maxLength(20) },
      sp_fuente_fin: { required },
      sp_ejercicio: { required },
      //id_tipo: { required, minLength: minLength(3), maxLength: maxLength(255) },
      //reten_nombre: { required, minLength: minLength(3), maxLength: maxLength(100) },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      return !this.isEditing
        ? 'Ver Solicitud de Pago # ' + this.editedItem.sp_id
        : 'Editar Solicitud de Pagos # ' + this.editedItem.sp_id
    },

    sp_descripcionErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_descripcion.$dirty) return errors
      !this.$v.editedItem.sp_descripcion.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.sp_descripcion.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.sp_descripcion.maxLength &&
        errors.push('Este campo debe de tener un máximo de 250 caracteres.')
      return errors
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
    sp_fuenteFinErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_fuente_fin.$dirty) return errors
      !this.$v.editedItem.sp_fuente_fin.required && errors.push('Este campo es requerido')
      return errors
    },
    sp_ejercicioErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_ejercicio.$dirty) return errors
      !this.$v.editedItem.sp_ejercicio.required && errors.push('Este campo es requerido')
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
    // Create an array the length of our items
    // with all values as true
    all() {
      this.panel = [...Array(this.items).keys()].map((k, i) => i)
      this.panel1 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel2 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel3 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel4 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel5 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel6 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel7 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel8 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel9 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel10 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel11 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel12 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel13 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel14 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel15 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel16 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel17 = [...Array(this.items).keys()].map((k, i) => i)
      this.panel18 = [...Array(this.items).keys()].map((k, i) => i)
    },
    // Reset the panel
    none() {
      ;(this.panel = []),
        (this.panel1 = []),
        (this.panel2 = []),
        (this.panel3 = []),
        (this.panel4 = []),
        (this.panel5 = []),
        (this.panel6 = []),
        (this.panel7 = []),
        (this.panel8 = []),
        (this.panel9 = []),
        (this.panel10 = []),
        (this.panel11 = []),
        (this.panel12 = []),
        (this.panel13 = []),
        (this.panel14 = []),
        (this.panel15 = []),
        (this.panel16 = []),
        (this.panel17 = []),
        (this.panel18 = [])
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(',', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    //Refresca Datos para la tabla
    async iniciando() {
      let jwt = await getValidToken(this)
      //this.obtenerconceptos(jwt, this.usuario.usr_isadmin, this.usuario.id_entidad)
      await this.obtenerTipos(jwt)
      await this.obtenerConceptos(jwt, '')
      await this.obtenerProveedores(jwt, 0, '')
      await this.obtenerCuentas(jwt, 0, 0)
      await this.obtenerEmpleadoSolicita(jwt, '')
      await this.obtenerEmpleadoAutoriza(jwt)
      await this.obtenerSolPagos(jwt, 0)
      await this.obtenerDireccion(jwt)
      await this.obtenerDirectores(jwt)
      await this.obtenerEstatus(jwt)
      await this.ObtenerFuenteFin(jwt)
      await this.ObtenerGenerales(jwt)
      await this.obtenerEjercicios(jwt)

      //this.ejercicio = this.ejercicios[0].sp_ejercicio
      //console.log('this.ejercicio ' + this.ejercicio)
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }

      await this.obtenerSolPagos(jwt, 0, this.ejercicio)

      //await this.obtenerSolPagos(jwt, 0)
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
            this.generales = []
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    //Obtiene todos los Estatus
    async obtenerEstatus(jwt) {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=ESTATUSFOL&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.estatus = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.estatus = response.data
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
    async obtenerSolPagos(jwt, sp_id, ejercicio) {
      this.isLoading = true
      let params = null
      if (sp_id > 0) {
        params = sp_id
      } else {
        params = 'filtro?campo1=sp_ejercicio&tipo1=igual&valor1=' + ejercicio
      }
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpagos = []
        await this.$store
          .dispatch('solpago/fetchSolPagosCreado', payload)
          .then((response) => {
            this.solpagos = []
            if (response.data.mensaje == undefined) {
              this.solpagos = response.data
              this.formateoInfoExportar('SEGUIMIENTO')
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
              // Enviar a inicio de sesión
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
                // Enviar a inicio de sesión
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
                // Enviar a inicio de sesión
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
                // Enviar a inicio de sesión
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
                // Enviar a inicio de sesión
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
                // Enviar a inicio de sesión
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
                // Enviar a inicio de sesión
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    //Obtiene Todas las Empleados Autoria
    async obtenerEmpleadoAutoriza(jwt) {
      this.isLoading = true
      let params = null
      //params = 'filtro?campo1=emp_activo&tipo1=igual&valor1=1'
      params =
        'filtro?campo1=emp_activo&tipo1=igual&valor1=1&logico2=and&campo2=emp_codigo&tipo2=igual&valor2=1292'
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    //Obtiene todos los Solicitudes de Pago para la tabla
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
              // Enviar a inicio de sesión
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
              // Enviar a inicio de sesión
            })
          })
      }
    },

    //Nuevo - DAtos iniciales
    nuevaCaptura() {
      //Se inicializan los valores de la nueva captura
      //const fecha = new Date()
      var fecha = new Date()
      //const hoy = Date.now()
      //const date = hoy.toISOString().substr(0, 10)
      this.editedItem.sp_fecha_solicitud = this.fechaformato(fecha)
      //const hoy = fecha.getDate()
      this.editedItem.sp_emp_id_aut = this.empleadoaut[0].emp_id

      //this.editedItem.id_entidad = this.entidades[0].id_entidad
      //this.editedItem.year_id = this.years[0].year_id
      //this.editedItem.id_tipo_reten = this.retenciones[0].id_tipo_reten
      //let cuenta = this.cuentas.find(
      //(elemento) => elemento.id_tipo_reten == this.editedItem.id_tipo_reten
      //)
      //this.editedItem.id_cta = cuenta.id_cta
      this.editedItem.sp_estatus = 'CREADO'
    },
    // Editar Tipo
    async editItem(item) {
      this.isEditing = false
      this.editedIndex = this.solpagos.indexOf(item)
      //this.editedIndex = -1
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

      if (this.solpagos[this.editedIndex].sp_fecha_firma_sol_ida == null) {
        this.editedItem.sp_fecha_firma_sol_ida = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_firma_sol_ida = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_firma_sol_ida
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_cancelacion == null) {
        this.editedItem.sp_fecha_cancelacion = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_cancelacion = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_cancelacion
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_firma_sol_vuelta == null) {
        this.editedItem.sp_fecha_firma_sol_vuelta = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_firma_sol_vuelta = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_firma_sol_vuelta
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_firma_aut_ida == null) {
        this.editedItem.sp_fecha_firma_aut_ida = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_firma_aut_ida = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_firma_aut_ida
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_firma_aut_vuelta == null) {
        this.editedItem.sp_fecha_firma_aut_vuelta = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_firma_aut_vuelta = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_firma_aut_vuelta
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_conta_gasxcomp == null) {
        this.editedItem.sp_fecha_conta_gasxcomp = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_conta_gasxcomp = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_conta_gasxcomp
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_por_cancelar == null) {
        this.editedItem.sp_fecha_por_cancelar = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_por_cancelar = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_por_cancelar
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_pago == null) {
        this.editedItem.sp_fecha_pago = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_pago = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_pago
        )
      }
      if (this.solpagos[this.editedIndex].sp_fecha_ejercido == null) {
        this.editedItem.sp_fecha_ejercido = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_ejercido = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_ejercido
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_ejercido_cap == null) {
        this.editedItem.sp_fecha_ejercido_cap = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_ejercido_cap = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_ejercido_cap
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_envia_ejercido == null) {
        this.editedItem.sp_fecha_envia_ejercido = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_envia_ejercido = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_envia_ejercido
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_folios == null) {
        this.editedItem.sp_fecha_folios = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_folios = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_folios
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_gpo_folios == null) {
        this.editedItem.sp_fecha_gpo_folios = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_gpo_folios = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_gpo_folios
        )
      }

      if (this.solpagos[this.editedIndex].sp_fecha_autoriza_vuelta == null) {
        this.editedItem.sp_fecha_autoriza_vuelta = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_solicitud
        )
      } else {
        this.editedItem.sp_fecha_autoriza_vuelta = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_autoriza_vuelta
        )
      }

      if (this.editedItem.sp_fecha_envprecap == null) {
        this.editedItem.sp_fecha_envprecap == ''
      } else {
        this.editedItem.sp_fecha_envprecap = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_envprecap
        )
      }

      if (this.editedItem.sp_fecha_recibe == null) {
        this.editedItem.sp_fecha_recibe == ''
      } else {
        this.editedItem.sp_fecha_recibe = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_recibe
        )
      }
      if (this.editedItem.sp_fecha_libera == null) {
        this.editedItem.sp_fecha_libera == ''
      } else {
        this.editedItem.sp_fecha_libera = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_libera
        )
      }
      if (this.editedItem.sp_fecha_precaxrec == null) {
        this.editedItem.sp_fecha_precaxrec == ''
      } else {
        this.editedItem.sp_fecha_precaxrec = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_precaxrec
        )
      }
      if (this.editedItem.sp_fecha_precaprec == null) {
        this.editedItem.sp_fecha_precaprec == ''
      } else {
        this.editedItem.sp_fecha_precaprec = this.convierteNumeroFecha(
          this.solpagos[this.editedIndex].sp_fecha_precaprec
        )
      }
      //console.log("this.editedItem.sp_fecha_precaptura", this.editedItem.sp_fecha_precaptura)
      if (this.editedItem && this.editedItem.sp_fecha_precaptura !== null) {
        this.editedItem.sp_fecha_precaptura = this.formato(
          this.eFormatos.FECHA_NUM,
          this.editedItem.sp_fecha_precaptura
        )
      }
      //console.log("this.editedItem.sp_fecha_precaptura 2", this.editedItem.sp_fecha_precaptura)
      //
      //sp_estatus_1 (CREADO)
      // this.editedItem.sp_estatus_1 = this.buscarEstatus(1)  //ESTATUS ANTERIOR CAPTURA
      //  this.editedItem.sp_estatus_1 = this.buscarEstatus(19)
      //sp_estatus_2 (SOLFIRIDA)
      //console.log('sp_id_gpo_firma_sol: ' + this.editedItem.sp_id_gpo_firma_sol)
      //if (this.editedItem.sp_fecha_precaptura != null)
      //(CREADO)
      if (this.editedItem.sp_fechaCreado != null) {
        this.editedItem.sp_estatus_1 = this.buscarEstatus(1)
      } else {
        this.editedItem.sp_estatus_1 = 'NO_APLICA'
      }
      //(ENVPRECAP)
      if (this.editedItem.sp_id_gpo_firma_sol > 0) {
        this.editedItem.sp_estatus_2 = this.buscarEstatus(2)
      } else {
        this.editedItem.sp_estatus_2 = 'NO_APLICA'
      }
      //sp_estatus_3 (SOLFIRVTA)
      if (this.editedItem.sp_user_firma_sol_vuelta > 0) {
        this.editedItem.sp_estatus_3 = this.buscarEstatus(3)
      } else {
        this.editedItem.sp_estatus_3 = 'NO_APLICA'
      }
      //sp_estatus_4 (AUTFIR)
      if (this.editedItem.sp_id_gpo_firma_aut_ida > 0) {
        this.editedItem.sp_estatus_4 = this.buscarEstatus(4)
      } else {
        this.editedItem.sp_estatus_4 = 'NO_APLICA'
      }
      //sp_estatus_5 (AUTFIRVTA)
      if (this.editedItem.sp_user_autoriza_vuelta > 0) {
        this.editedItem.sp_estatus_5 = this.buscarEstatus(5)
      } else {
        this.editedItem.sp_estatus_5 = 'NO_APLICA'
      }
      //sp_estatus_6 (PAGOS)
      if (this.editedItem.sp_id_gpo_firma_aut_vuelta > 0) {
        this.editedItem.sp_estatus_6 = this.buscarEstatus(6)
      } else {
        this.editedItem.sp_estatus_6 = 'NO_APLICA'
      }
      //sp_estatus_7 (GASCOM)
      if (this.editedItem.sp_id_gpo_firma_aut_vuelta_gxc > 0) {
        this.editedItem.sp_estatus_7 = this.buscarEstatus(7)
      } else {
        this.editedItem.sp_estatus_7 = 'NO_APLICA'
      }
      //sp_estatus_8 (FINPAGO)
      if (this.editedItem.sp_user_pago > 0) {
        this.editedItem.sp_estatus_8 = this.buscarEstatus(8)
      } else {
        this.editedItem.sp_estatus_8 = 'NO_APLICA'
      }
      //sp_estatus_9 (FINGXC)
      //console.log(this.editedItem.sp_id_gpo_gxc_ent_conta)
      if (this.editedItem.sp_id_gpo_gxc_ent_conta > 0) {
        this.editedItem.sp_estatus_9 = this.buscarEstatus(9)
      } else {
        this.editedItem.sp_estatus_9 = 'NO_APLICA'
      }
      //console.log(this.editedItem.sp_estatus_9)
      //sp_estatus_10 (XCANCELAR)
      if (this.editedItem.sp_user_por_cancelar > 0) {
        this.editedItem.sp_estatus_10 = this.buscarEstatus(10)
      } else {
        this.editedItem.sp_estatus_10 = 'NO_APLICA'
      }

      //sp_estatus_11 (CANCELAR)
      if (this.editedItem.sp_user_cancelacion > 0) {
        this.editedItem.sp_estatus_11 = this.buscarEstatus(11)
      } else {
        this.editedItem.sp_estatus_11 = 'NO_APLICA'
      }

      //Devengado y comprometido
      if (this.editedItem.sp_user_folios > 0) {
        this.editedItem.sp_estatus_12 = 'COMPROMETIDOS Y DEVENGADOS'
      } else {
        this.editedItem.sp_estatus_12 = 'NO_APLICA'
      }
      //PARA DETERMINAR LOS ESTATUS DEL DOCUMENTO
      //estatus envprecaqp
      if (this.editedItem.sp_fecha_envprecap != null) {
        this.editedItem.sp_estatus_14 = this.buscarEstatus(14)
      } else {
        this.editedItem.sp_estatus_14 = 'NO_APLICA'
      }

      //estatus recibe orden estatus precaptura
      if (this.editedItem.sp_fecha_recibe != null) {
        this.editedItem.sp_estatus_15 = this.buscarEstatus(15)
      } else {
        this.editedItem.sp_estatus_15 = 'NO_APLICA'
      }
      //fecha libera pero estatus se mantiene en precaptura
      if (this.editedItem.sp_fecha_libera != null) {
        this.editedItem.sp_estatus_16 = this.buscarEstatus(16)
      } else {
        this.editedItem.sp_estatus_16 = 'NO_APLICA'
      }
      if (this.editedItem.sp_fecha_precaxrec != null) {
        this.editedItem.sp_estatus_17 = this.buscarEstatus(17)
      } else {
        this.editedItem.sp_estatus_17 = 'NO_APLICA'
      }
      if (this.editedItem.sp_fecha_precaprec != null) {
        this.editedItem.sp_estatus_18 = this.buscarEstatus(18)
      } else {
        this.editedItem.sp_estatus_18 = 'NO_APLICA'
      }
      //console.log("fecha", this.editedItem.sp_fecha_precaptura)
      //var fecha = new Date()
      this.fecha = '0001-01-01'
      //console.log("fecha", this.fecha)
      /*if (this.editedItem.sp_fecha_precaptura != null || this.editedItem.sp_fecha_solicitud != null) {
      if (this.editedItem.sp_fecha_precaptura > this.fecha || this.editedItem.sp_fecha_solicitud  > this.fecha ) {
        this.editedItem.sp_estatus_20 = this.buscarEstatus(20);
      } else {
        this.editedItem.sp_estatus_20 = 'NO_APLICA';
      }*/
      if (this.editedItem.sp_fecha_precaptura > this.fecha) {
        this.editedItem.sp_estatus_20 = this.buscarEstatus(20)
      } else {
        this.editedItem.sp_estatus_20 = 'NO_APLICA'
      }

      //Grupo Devengado - comprometido
      this.gpoFolio = false
      if (this.editedItem.sp_id_gpo_folios > 0) {
        this.gpoFolio = true
      }

      //Ejercido
      if (this.editedItem.sp_poliza_ejercido > 0) {
        this.editedItem.sp_estatus_13 = 'EJERCIDO'
      } else {
        this.editedItem.sp_estatus_13 = 'NO_APLICA'
      }

      //Grupo Ejercido
      this.gpoEjercido = false
      if (this.editedItem.sp_id_gpo_ejercido > 0) {
        this.gpoEjercido = true
      }

      //PARA DETERMINAR LOS ESTATUS DEL DOCUMENTO

      let jwt = await getValidToken(this)
      this.obtenerEmpleadoSolicita(jwt, this.editedItem.sp_direccion_sol)

      setTimeout(() => (this.overlay = true), 1000)
      setTimeout(() => (this.overlay = false), 2000)
      setTimeout(() => (this.dialog = true), 2001)
    },
    async editarItem(item) {
      this.isEditing = true
      this.DisabledPagoNombreDe = true
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

      this.dialogEdit = true
    },
    // Eliminar Tipo
    deleteItem(item) {
      const index = this.cuentas.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.cuentas.splice(index, 1)
      this.Borrar(item.id_cta)
    },
    //Borrar en BD es desActivar
    async Borrar(index) {
      this.overlay = true
      this.$v.$touch()

      let body = {
        //_id: this.editedItem.id_tipo,
        id_cta: index,
        //cta_clave: this.editedItem.cta_clave,
        cta_activo: 0,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('entidad/deleteEntidad', payload)
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
            // Enviar a inicio de sesión
          })
          this.overlay = false
        })
      Object.assign(this.cuentas[this.editedIndex], this.editedItem)
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
        this.dialogEdit = false
        this.isEditing = false
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
    // Guardar el formulario
    async save() {
      this.overlay = true
      this.$v.$touch()
      let jwt = await getValidToken(this)
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
        let estatus = 'CREADO'
        if (this.editedIndex > -1) {
          estatus = this.editedItem.sp_estatus
        }

        let body = {
          sp_tipo_sol: tiposol,
          sp_concepto: concepto,
          prov_id: prov,
          cuecon_cuenta: cuenta,
          sp_descripcion: this.editedItem.sp_descripcion,
          sp_pago_nombre_de: this.editedItem.sp_pago_nombre_de,
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
          sp_estatus: estatus,
          //sp_saldo: saldo,
          sp_saldo: saldofolioafecta,
          sp_id_folio_afecta: folio_afecta,
          sp_devolucion_efectivo: devEfectivo,
        }
        let payload = {
          jwt: jwt,
          body: body,
        }
        //console.log(this.editedItem)

        this.editedItem2 = Object.assign({}, this.editedItem)
        //console.log(this.editedItemAct)
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
                // Enviar a inicio de sesión
              })
              this.overlay = false
            })
          Object.assign(this.solpagos[this.editedIndex], this.editedItem)
        } else {
          //AGREGAR SOLICITUD DE PAGOS
          let sp_folio = 0
          let sp_id_exedente = 0
          await this.$store
            .dispatch('solpago/addSolPagos', payload)
            .then((response) => {
              this.msgStore = 'El registro se creó con éxito'
              sp_folio = response.data.id
              //********************************************************** */
              //Si es caso especial actualizar saldos de los folios x comprobar
              //********************************************************** */
              if (isCasoEspecial) {
                let sp_id = 0
                let body2 = {}

                let SalfoTot = saldo
                let saldoUnitario = 0
                for (var i in this.selected) {
                  sp_id = this.selected[i].sp_id
                  //folio_afecta = response.data.id
                  folio_afecta = sp_folio
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
                    sp_id_folio_afecta: response.data.id,
                  }
                  /*
                  console.log('saldo ' + saldo)
                  console.log('body2')
                  console.log(body2)
                  */

                  let payload2 = { jwt: jwt, body: body2 }
                  payload2.id = sp_id
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
                if (diferencia != 0 && ce_concepto_excedente > 0 && cuenta_excedente != '') {
                  //****************************************** */
                  // CREAR SOLICITUD DE EXCEDENTE EN CASO ESPECIAL
                  //****************************************** */
                  let body3 = {
                    sp_tipo_sol: 1,
                    sp_concepto: ce_concepto_excedente,
                    prov_id: prov,
                    cuecon_cuenta: cuenta_excedente,
                    sp_descripcion: desc_concepto_excedente,
                    sp_pago_nombre_de: this.editedItem.sp_pago_nombre_de,
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
                    sp_devolucion_efectivo: 0,
                  }
                  //console.log('cuenta_excedente:' + cuenta_excedente)
                  let payload3 = {
                    jwt: jwt,
                    body: body3,
                  }
                  this.$store
                    .dispatch('solpago/addSolPagos', payload3)
                    .then((response2) => {
                      this.error = ''
                      sp_id_exedente = response2.data.id
                      //imprimir folio excedente
                      var opcion2 = confirm(
                        'Desea Imprimir la solicitud de : ' +
                          desc_concepto_excedente +
                          ': ' +
                          sp_id_exedente +
                          ' ?'
                      )
                      if (opcion2) {
                        imprimeFormatoSolPag(sp_id_exedente, this)
                      }

                      //****************************************** */
                      // ACTUALIZA EL FOLIO DE COMPROBACION PARA NUEVA
                      // SOLICITUD EXCEDENTE DE CASOS ESPECIALES
                      //****************************************** */

                      let body4 = {
                        sp_folio_comprobacion: folio_comprobacion + ',' + sp_id_exedente,
                      }
                      //console.log('body4')
                      //console.log(body4)
                      let payload4 = { jwt: jwt, body: body4 }
                      payload4.id = sp_folio
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
                //???
                imprimeFormatoSolPag(sp_folio, this)
              }
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
        }

        //Mensaje Final
        this.$store.commit('ALERT', {
          color: 'success',
          text: this.msgStore,
        })

        this.msgStore = ''
        this.close(this.checkbox)
        this.changed = false
        //this.dialogfince = false
        //jwt = await getValidToken(this)
        //this.obtenerSolPagos(jwt, 0)
        await this.iniciando()
      }
    },

    //
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
      //console.log('value.tipo_clave:' + value.tipo_clave)
      await this.obtenerProveedores(jwt, value.tipo_id, value.tipo_clave)
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
    async setfilterProveedor(value) {
      // secuencia : 2
      let jwt = await getValidToken(this)

      this.tipo_temp = value.tipo_id
      this.clave_temp = value.tipo_clave
      await this.obtenerProveedores(jwt, value.tipo_id, value.tipo_clave)
      this.editedItem.sp_pago_nombre_de = ''
      this.isTipo = false
      this.isConcepto = false
      this.isProveedor = true

      await this.obtenerCuentas(jwt, this.editedItem.prov_id.prov_id, this.tipo_temp)
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
    async setfilterCuentas(value) {
      // secuencia : 3
      let jwt = await getValidToken(this)

      this.prov_temp = value.prov_id
      //console.log('value.cuecon_cuenta:' + value.cuecon_cuenta)
      //console.log(' this.clave_temp:' + this.clave_temp)
      //console.log(' this.tipo_temp:' + this.tipo_temp)

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
          this.DisabledPagoNombreDe = true
        }
      } else if (value.cuecon_cuenta != '') {
        //penalim
        await this.obtenerCuentas(jwt, 0, this.tipo_temp)
        this.editedItem.sp_pago_nombre_de = value.prov_razon_social
        this.DisabledPagoNombreDe = true
      }

      this.isTipo = false
      this.isConcepto = false
      this.isProveedor = false
    },
    async setfilterEmpSol(value) {
      let jwt = await getValidToken(this)

      //this.prov_temp = value.prov_id
      await this.obtenerEmpleadoSolicita(jwt, value.emp_direccion)
      this.isSolicita = false
    },
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
    onChangevobo() {
      this.editedItem.sp_vobo_emp_id = 0
    },
    printItem(item) {
      this.editedItem = Object.assign({}, item)
      //this.imprimeFormato(this.editedItem.sp_id, this.editedItem)
      //console.log(this.editedItem)
      imprimeFormatoSolPag(this.editedItem.sp_id, this, this.editedItem.sp_ejercicio)
    },

    getColor(estatus) {
      if (estatus == 'CREADO') return '#66BB6A'
      else if (estatus == 'PRECAP') return '#BA68C8'
      else if (estatus == 'ENVPRECAP') return '#F06292'
      else if (estatus == 'PRECAPREC') return '#EF5350'
      else if (estatus == 'PRELIB') return '#5C6BC0'
      else if (estatus == 'PRECAPXREC') return '#26A69A'
      else if (estatus == 'SOLREC') return '#FFD54F'
      else if (estatus == 'SOLFIRIDA') return '#FF8F00'
      else if (estatus == 'SOLFIRVTA') return '#FF3D00'
      else if (estatus == 'AUTFIR') return '#7C4DFF'
      else if (estatus == 'AUTFIRVTA') return '#78E18D'
      else if (estatus == 'PAGOS') return '#0277BD'
      else if (estatus == 'GASCOM') return '#A1887F'
      else if (estatus == 'FINPAGO') return '#00B0FF'
      else if (estatus == 'XCANCELAR') return '#AB47BC'
      else if (estatus == 'CANCELAR') return '#BDBDBD'
      else if (estatus == 'FINGXC') return '#2962FF'
      else return 'yellow'
    },

    buscarEstatus(val) {
      let Estatus = this.estatus.find((elemento) => elemento.tipo_orden == val)
      return Estatus.tipo_descripcion
      //this.editedItem.id_cta = cuenta.id_cta
    },
    formateoInfoExportar(opcion) {
      var i
      if (opcion == 'SEGUIMIENTO') {
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
    async onChangeEjercicio(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await this.obtenerSolPagos(jwt, 0, value.sp_ejercicio)
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
.timeNumber {
  color: white;
  font-weight: bold;
}
   .texto-blanco {
        color: white;
    }
</style>
