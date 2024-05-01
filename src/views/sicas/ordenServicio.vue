<template>
  <v-tabs fixed-tabs background-color="indigo" dark>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab key="tab0">
      <v-icon left> mdi-file-document-edit-outline </v-icon>Capturar Orden de Servicio
    </v-tab>
    <v-tab key="tab1">
      <v-icon left> mdi-file-document-edit-outline </v-icon>Ordenes Enviadas</v-tab
    >
    <v-tab-item key="tab0">
      <v-container id="ordenes" tag="section">
        <base-material-card
          v-model="tabPrincial"
          v-show="tabPrincipal"
          class="px-5 py-3"
          color="primary"
          icon="mdi-car-wrench"
          inline
        >
          <v-spacer></v-spacer>
          <template v-slot:after-heading></template>

          <!-- Boton nuevo registro -->
          <template v-slot:corner-button>
            <v-row>
              <v-col cols="6">
                <v-btn
                  class="ma-2"
                  color="primary"
                  elevation="2"
                  small
                  @click="nuevaCaptura"
                  @click.stop="dialog = true"
                  >Nueva órden de servicio</v-btn
                >
              </v-col>
              <!--  <v-col cols="6">
                <v-btn
                  class="ma-2"
                  color="primary"
                  elevation="2"
                  small 
                  @click="nuevaCaptura"
                 
                  >Nueva órden de servicio 2</v-btn
                > 
              </v-col>-->
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
                  hint="Seleciona Ejercicio"
                  @change="onChangeEjercicio"
                  return-object
                >
                </v-select>
              </v-col>
            </v-row>
          </template>

          <!-- Overlay para retroalimentar al usuario -->
          <v-overlay :value="overlay">
            <v-progress-circular color="success" indeterminate :size="50"></v-progress-circular>
          </v-overlay>
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

          <!-- Dialogo -->
          <v-dialog v-model="dialog" max-width="1200px">
            <v-tabs v-model="tabs" fixed-tabs background-color="indigo" dark>
              <v-tabs-slider color="yellow"></v-tabs-slider>
              <v-tab> <v-icon left> mdi-card-bulleted-outline</v-icon>Cabecero </v-tab>
              <v-tab> <v-icon right> mdi-format-list-bulleted-type </v-icon>Detalle </v-tab>
              <v-tabs-items v-model="tabs">
                <!-- Cabecero -->
                <v-tab-item>
                  <base-material-card
                    color="blue"
                    icon="mdi-card-bulleted-outline"
                    inline
                    class="px-5 py-3"
                  >
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        <v-img src="@/assets/logo_ivey.jpg" width="20%" height="20%"></v-img>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <!--<v-row>
                      <v-col cols="2" >   
                      <v-btn
                    color="primary"
                    elevation="2"
                    small @click="cargarFactura">Cargar Factura</v-btn>
                  </v-col>
                </v-row>-->
                          <v-divider class="mt-3" />
                          <v-row class="mt-3">
                            <v-col cols="1" class="v-text">
                              <v-select
                                v-model="editedItem.sp_ejercicio"
                                :items="ejercicios"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Ejercicio*"
                                item-text="sp_ejercicio"
                                item-value="sp_ejercicio"
                                persistent-hint
                                dense
                                return-object
                                @change="onChangeEjercicioCap"
                                @blur="$v.editedItem.sp_ejercicio.$touch()"
                              >
                                <!-- @input="changed = true" -->
                              </v-select>
                            </v-col>
                            <!-- Nº Orden -->
                            <v-col cols="2" class="v-text">
                              <v-text-field
                                class="DocumentoId"
                                id="osNumDoc"
                                autofocus
                                dense
                                :disabled="!existeOrden"
                                label="Nº Orden de Servicio*"
                                maxlength="20"
                                required
                                v-model="editedItem.osNumDoc"
                                @blur="$v.editedItem.osNumDoc.$touch()"
                                @input="$v.editedItem.osNumDoc.$reset()"
                                @change="validaExisteOrden()"
                              ></v-text-field>
                            </v-col>
                            <!-- Fecha de Orden -->
                            <v-col cols="2" class="v-text">
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
                                    v-model="editedItem.osFecha"
                                    label="Fecha Orden"
                                    prepend-icon="mdi-calendar-month"
                                    v-bind="attrs"
                                    v-on="on"
                                    dense
                                    id="osFecha"
                                    :disabled="existeOrden"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  locale="en-in"
                                  :min="minDate"
                                  :max="maxDate"
                                  v-model="editedItem.osFecha"
                                  @input=";(fromDateMenu = false), (changed = true)"
                                ></v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="2" class="v-text">
                              <v-select
                                v-model="$v.editedItem.osgenAdjudicacion.$model"
                                :items="genAdjudicacion"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Género de Adjudicacion*"
                                item-text="tipo_descripcion"
                                item-value="tipo_clave"
                                persistent-hint
                                dense
                                disabled
                                return-object
                                :error-messages="osgenAdjudicacionErrors"
                                @blur="$v.editedItem.osgenAdjudicacion.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- Tipo de Servicio -->
                            <v-col cols="2" class="v-text">
                              <v-select
                                v-model="$v.editedItem.sp_tipoServicio.$model"
                                :items="servicios"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Tipo de Servicio*"
                                item-text="tipo_descripcion"
                                item-value="tipo_clave"
                                persistent-hint
                                dense
                                :disabled="existeOrden"
                                @input="setfilterServicio"
                                return-object
                                :error-messages="sp_conceptoErrors"
                                @blur="$v.editedItem.sp_tipoServicio.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- Tipo Adjudicacion -->
                            <v-col cols="3" class="v-text">
                              <v-select
                                v-model="editedItem.osTipoAdjudicacion"
                                :items="tipoAdjudicacion"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Tipo de Adjudicacion*"
                                item-text="tipo_descripcion"
                                item-value="tipo_clave"
                                persistent-hint
                                dense
                                disabled
                                return-object
                                :error-messages="osTipoAdjudicacionErrors"
                                @blur="$v.editedItem.osTipoAdjudicacion.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- Tipo Placas -->
                            <v-col cols="2" class="v-text" v-if="mostrarAnioVehiculo">
                              <v-select
                                v-model="editedItem.vh_placas"
                                :items="tipoVehiculos"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Placa de Vehiculo*"
                                :item-text="(item) => item.veh_placas"
                                item-value="veh_placas"
                                persistent-hint
                                dense
                                :disabled="isTipo"
                                @change="setfilterModelo"
                                return-object
                                @blur="$v.editedItem.veh_placas.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- Modelo -->
                            <v-col cols="2" class="v-text" v-if="mostrarAnioVehiculo">
                              <v-select
                                v-model="editedItem.vh_modelo"
                                :items="tipoVehiculos"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Modelo Vehiculo*"
                                :item-text="(item) => item.veh_modelo"
                                item-value="veh_modelo"
                                persistent-hint
                                dense
                                disabled
                                :error-messages="osTipoAdjudicacionErrors"
                                return-object
                                @blur="$v.editedItem.veh_modelo.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- Año vehiculo-->
                            <v-col cols="1" class="v-text" v-if="mostrarAnioVehiculo">
                              <v-select
                                v-model="editedItem.vh_anio"
                                :items="tipoVehiculos"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Año Vehiculo*"
                                :item-text="(item) => item.veh_anio"
                                item-value="veh_anio"
                                persistent-hint
                                dense
                                disabled
                                :error-messages="osTipoAdjudicacionErrors"
                                return-object
                                @blur="$v.editedItem.veh_anio.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="3" class="v-text" v-if="mostrarAnioVehiculo">
                              <v-select
                                v-model="editedItem.nombre_sol"
                                :items="tipoVehiculos"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Asignado a:*"
                                :item-text="(item) => item.emp_nombre"
                                item-value="emp_nombre"
                                persistent-hint
                                dense
                                disabled
                                :error-messages="osTipoAdjudicacionErrors"
                                return-object
                                @blur="$v.editedItem.nombre_sol.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!---SERIE---->
                            <v-col cols="2" class="v-text" v-if="mostrarAnioVehiculo">
                              <v-select
                                v-model="editedItem.osVeh_id"
                                :items="tipoVehiculos"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Serie Vehiculo"
                                item-text="veh_id"
                                item-value="veh_id"
                                persistent-hint
                                dense
                                disabled
                                return-object
                                @blur="$v.editedItem.osVeh_id.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- Tipo Adjudicacion -->
                            <!-- <v-col cols="3" class="v-text">
                          <v-select
                            v-model="editedItem.osTipoAdjudicacion"
                            :items="tipoAdjudicacion"
                            :menu-props="{ top: true, offsetY: true }"
                            label="Tipo de Adjudicacion*"
                            item-text="tipo_descripcion"
                            item-value="tipo_clave"
                            persistent-hint
                            dense
                            :disabled="existeOrden"
                            return-object
                            :error-messages="osTipoAdjudicacionErrors"
                            @blur="$v.editedItem.osTipoAdjudicacion.$touch()"
                          >
                          </v-select>
                        </v-col>-->
                            <!-- Genero Adjudicacion -->
                            <!-- Solicitud de Servicio -->
                            <v-col cols="1" class="v-text">
                              <v-text-field
                                dense
                                :disabled="isTipo"
                                label="Solicitud de Servicio*"
                                maxlength="20"
                                type="number"
                                required
                                :error-messages="solicitudServErrors"
                                v-model="$v.editedItem.osSolicitudServicio.$model"
                                @blur="$v.editedItem.osSolicitudServicio.$touch()"
                              ></v-text-field>
                            </v-col>
                            <!-- Conceptos para solicitud -->
                            <v-col cols="4" class="v-text">
                              <v-select
                                v-model="$v.editedItem.sp_concepto.$model"
                                :items="conceptos"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Concepto*"
                                item-text="tipo_descripcion"
                                item-value="tipo_clave"
                                persistent-hint
                                dense
                                :disabled="existeOrden"
                                @input="setfilterProveedor"
                                return-object
                                :error-messages="sp_conceptoErrors"
                                @blur="$v.editedItem.sp_concepto.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- Proveedor -->
                            <v-col cols="5" class="v-text">
                              <v-autocomplete
                                v-model="$v.editedItem.prov_id.$model"
                                :items="proveedores"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Proveedor*"
                                item-text="prov_razon_social"
                                item-value="prov_id"
                                persistent-hint
                                append-outer-icon="mdi-pencil"
                                dense
                                :disabled="existeOrden"
                                return-object
                                :error-messages="prov_idErrors"
                                @input="setfilterCuentas"
                                @blur="$v.editedItem.prov_id.$touch()"
                                @click:append-outer="editarProveedor"
                              >
                              </v-autocomplete>
                              <!-- @input="changed = true" -->
                            </v-col>
                            <v-col cols="2" class="v-text">
                              <v-text-field
                                dense
                                label="Proveedor RFC"
                                disabled
                                maxlength="100"
                                return-object
                                required
                                :error-messages="provRFCErrors"
                                v-model="$v.editedItem.prov_RFC.$model"
                                @blur="$v.editedItem.prov_RFC.$touch()"
                                @input="$v.editedItem.prov_RFC.$reset()"
                              ></v-text-field>
                            </v-col>
                            <!-- Cuenta Contable -->
                            <v-col cols="3" class="v-text">
                              <v-select
                                v-model="$v.editedItem.cuecon_cuenta.$model"
                                :items="cuentas"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Cuenta*"
                                item-text="cuecon_cuenta"
                                item-value="cuecon_cuenta"
                                persistent-hint
                                dense
                                :disabled="existeOrden"
                                return-object
                                :error-messages="cuecon_cuentaErrors"
                                @input="changed = true"
                                @blur="$v.editedItem.cuecon_cuenta.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- Direccion Proveedor -->
                            <v-col cols="5" class="v-text">
                              <v-text-field
                                dense
                                :disabled="existeOrden"
                                label="Direccion"
                                maxlength="300"
                                v-model="editedItem.prov_direccion"
                                @blur="$v.editedItem.prov_direccion.$touch()"
                                @input="$v.editedItem.prov_direccion.$reset()"
                              ></v-text-field>
                            </v-col>
                            <!-- Ciudad Proveedor-->
                            <v-col cols="4" class="v-text">
                              <v-text-field
                                dense
                                :disabled="existeOrden"
                                label="Ciudad"
                                maxlength="100"
                                v-model="editedItem.prov_ciudad"
                                @blur="$v.editedItem.prov_ciudad.$touch()"
                                @input="$v.editedItem.prov_ciudad.$reset()"
                              ></v-text-field>
                            </v-col>

                            <!-- Fecha Limite de Entrega -->
                            <v-col cols="2" class="v-text" v-if="mostrarCampo">
                              <v-menu
                                v-model="fromDateMenuFLM"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="editedItem.osFechaLimEntrega"
                                    label="Fecha Limite de Entrega"
                                    prepend-icon="mdi-calendar-month"
                                    v-bind="attrs"
                                    v-on="on"
                                    dense
                                    id="osFechaLimEntrega"
                                    :disabled="existeOrden"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  locale="en-in"
                                  :min="minDate"
                                  :max="maxDate"
                                  v-model="editedItem.osFechaLimEntrega"
                                  @input=";(fromDateMenuFLM = false), (changed = true)"
                                ></v-date-picker>
                              </v-menu>
                            </v-col>
                            <!-- Lugar de Entrega -->
                            <!--<v-col cols="6" class="v-text">
                          <v-autocomplete
                            v-model="$v.editedItem.osLugarEntrega.$model"
                            :items="lugaresEntrega"
                            :menu-props="{ top: true, offsetY: true }"
                            label="Lugar de Entrega*"
                            item-text="tipo_descripcion"
                            item-value="tipo_descripcion"
                            persistent-hint
                            dense
                            :disabled="existeOrden"
                            return-object
                            :error-messages="osLugarEntregaErrors"
                            @blur="$v.editedItem.osLugarEntrega.$touch()"
                          >
                          </v-autocomplete>
                        </v-col>
                        
                      <v-col cols="2" class="v-text">
                          <v-text-field
                            dense
                            :disabled="existeOrden"
                            type="number"
                            label="Dias de Credito"
                            v-model="editedItem.osDiasCredito"
                            @blur="$v.editedItem.osDiasCredito.$touch()"
                            @input="$v.editedItem.osDiasCredito.$reset()"
                          ></v-text-field>
                        </v-col>-->
                            <!-- Descripcion -->
                            <v-col cols="12" class="v-text">
                              <v-textarea
                                v-model="editedItem.osDescripcion"
                                label="Descripción"
                                :disabled="existeOrden"
                                counter="250"
                                dense
                                no-resize
                                rows="1"
                                @input="$v.editedItem.osDescripcion.$reset(), (changed = true)"
                                @blur="$v.editedItem.osDescripcion.$touch()"
                              ></v-textarea>
                            </v-col>
                            <!-- Campo Observacion -->
                            <v-col cols="12" class="v-text">
                              <v-text-field
                                v-model="editedItem.osObservacion"
                                label="Observaciones"
                                counter="255"
                                :disabled="existeOrden"
                                dense
                                @input="$v.editedItem.osObservacion.$reset(), (changed = true)"
                                @blur="$v.editedItem.osObservacion.$touch()"
                              ></v-text-field>
                            </v-col>
                            <!-- Empleado Solicita -->
                            <v-col cols="4" class="v-text">
                              <v-select
                                v-model="$v.editedItem.osEmpSolicita.$model"
                                :items="empSolicita"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Empleado Solicita*"
                                :item-text="(item) => item.emp_nombre + ' - ' + item.emp_puesto"
                                item-value="emp_id"
                                persistent-hint
                                dense
                                :disabled="existeOrden"
                                :error-messages="osEmpSolicitaErrors"
                                hint="Seleciona Empleado Solicita"
                                @input="setfilterDirSolicita"
                                return-object
                                @blur="$v.editedItem.osEmpSolicita.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- direccion Solicita -->
                            <v-col cols="4" class="v-text">
                              <v-select
                                v-model="$v.editedItem.osDirSolicita.$model"
                                :items="dirSolicita"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Direccion Solicita*"
                                item-text="emp_direccion"
                                item-value="emp_direccion"
                                persistent-hint
                                dense
                                :disabled="existeOrden"
                                :error-messages="osDirSolicitaErrors"
                                return-object
                                @change="onChangeDirSolicita"
                                @blur="$v.editedItem.osDirSolicita.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- Departamento Solicita -->
                            <v-col cols="4" class="v-text">
                              <v-select
                                v-model="$v.editedItem.osDeptoSolicita.$model"
                                :items="deptoSolicita"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Departamento Solicita*"
                                item-text="emp_departamento"
                                item-value="emp_departamento"
                                persistent-hint
                                dense
                                :disabled="existeOrden"
                                :error-messages="osDeptoSolicitaErrors"
                                return-object
                                @blur="$v.editedItem.osDeptoSolicita.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- direccion Destino -->
                            <v-col cols="6" class="v-text" v-if="mostrarCampo">
                              <v-select
                                v-model="$v.editedItem.osDirDestino.$model"
                                :items="dirDestino"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Direccion Destino*"
                                item-text="emp_direccion"
                                item-value="emp_direccion"
                                persistent-hint
                                dense
                                hidden
                                :disabled="existeOrden"
                                :error-messages="osDirDestinoErrors"
                                return-object
                                @blur="$v.editedItem.osDirDestino.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <!-- Departamento Destino -->
                            <v-col cols="6" class="v-text" v-if="mostrarCampo">
                              <v-select
                                v-model="$v.editedItem.osDeptoDestino.$model"
                                :items="deptoDestino"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Departamento Destino*"
                                item-text="emp_departamento"
                                item-value="emp_departamento"
                                persistent-hint
                                dense
                                hidde
                                :disabled="existeOrden"
                                :error-messages="osdeptoDestinoErrors"
                                return-object
                                @blur="$v.editedItem.osDeptoDestino.$touch()"
                              >
                              </v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-checkbox
                          v-model="checkbox"
                          label="Crear otro"
                          :disabled="isEditing"
                        ></v-checkbox>
                        <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text @click="save" :disabled="validando"
                          >Guardar</v-btn
                        >
                        <!-- <v-btn color="blue darken-1" text @click="save" :disabled="validando"
                      >Guardar</v-btn
                    >-->
                      </v-card-actions>
                    </v-card>
                  </base-material-card>
                </v-tab-item>
                <!-- Detalle -->
                <v-tab-item>
                  <base-material-card
                    color="blue"
                    icon="mdi-format-list-bulleted-type"
                    inline
                    class="px-5 py-3"
                  >
                    <v-spacer></v-spacer>
                    <template v-slot:after-heading></template>

                    <!-- Boton nuevo registro Detalle -->
                    <template v-slot:corner-button>
                      <v-btn
                        class="ma-2"
                        color="primary"
                        elevation="2"
                        small
                        @click="nuevaCapturaDet"
                        @click.stop="dialog = true"
                        :disabled="existeOrden"
                        >nuevo Detalle</v-btn
                      >
                    </template>
                    <!-- Tabla de DETALLE de Ordenes de compra-->
                    <v-data-table
                      class="Black--text"
                      dense
                      loading-text="Cargando... Espere por favor"
                      :headers="headersDet"
                      :items="ordenesDet"
                      :loading="isLoading"
                      :search.sync="search"
                      hide-default-footer
                    >
                      <template v-slot:item.osDetPrecio="{ item }">
                        {{ formato(eFormatos.MONEDA, item.osDetPrecio) }}
                      </template>
                      <template v-slot:item.osDetDescuento="{ item }">
                        {{ formato(eFormatos.MONEDA, item.osDetDescuento) }}
                      </template>
                      <template v-slot:item.osDetIVA="{ item }">
                        {{ formato(eFormatos.MONEDA, item.osDetIVA) }}
                      </template>
                      <template v-slot:item.osDetTotal="{ item }">
                        {{ formato(eFormatos.MONEDA, item.osDetTotal) }}
                      </template>

                      <!-- Acciones de la Tabla Principal -->
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-icon class="mr-2" small @click="editItemDet(item)">mdi-pencil</v-icon>
                        <v-icon small @click="deleteItemDet(item)">mdi-delete</v-icon>
                      </template>

                      <!-- FOOTER -->
                      <template v-slot:footer
                        >Orden de servicio: {{ editedItem.osNumDoc }}</template
                      >
                      <template slot="body.append">
                        <tr class="Black--text">
                          <th></th>
                          <th></th>
                          <th>
                            <h2 class="centrado">TOTAL</h2>
                          </th>
                          <th class="total">
                            <h2>
                              {{ formato(eFormatos.IMPORTE, sumaCampo('osDetCantidad')) }}
                            </h2>
                          </th>
                          <th></th>
                          <th class="total">
                            <h2 class="total">
                              {{ formato(eFormatos.MONEDA, sumaCampo('osDetDescuento')) }}
                            </h2>
                          </th>
                          <th>
                            <h2 class="total">
                              {{ formato(eFormatos.MONEDA, sumaCampo('osDetSubtotal')) }}
                            </h2>
                          </th>
                          <th>
                            <h2 class="total">
                              {{ formato(eFormatos.MONEDA, sumaCampo('osDetIVA')) }}
                            </h2>
                          </th>
                          <th>
                            <h2 class="total">
                              {{ formato(eFormatos.MONEDA, sumaCampo('osDetTotal')) }}
                            </h2>
                          </th>
                        </tr>
                      </template>
                    </v-data-table>
                  </base-material-card>

                  <!-- dialogo Detalle -->
                  <v-dialog v-model="dialogDet" persistent max-width="800px">
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        <v-img src="@/assets/logo_ivey.jpg" width="20%" height="20%"></v-img>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <!-- Producto, Marca y unidad -->
                          <v-row>
                            <!-- Nº Posicion -->
                            <v-col cols="1" class="v-text">
                              <v-text-field
                                background-color="##E0E0E0"
                                label="Nº Posición*"
                                maxlength="20"
                                required
                                model-value="Grocery delivery"
                                disabled
                                v-model="editedItemDet.osDetPosicion"
                                @blur="$v.editedItemDet.osDetPosicion.$touch()"
                                @input="$v.editedItemDet.osDetPosicion.$reset()"
                              ></v-text-field>
                            </v-col>
                            <!-- Familias -->
                            <!-- <v-col cols="3" class="v-text">
                          <v-autocomplete
                            autofocus
                            v-model="editedItemDet.familia_id"
                            :items="familias"
                            :menu-props="{ top: true, offsetY: true }"
                            label="Familias*"
                            item-text="tipo_descripcion"
                            item-value="tipo_clave"
                            persistent-hint
                            hint="Seleciona Familia"
                            return-object
                            @change="setfilterFamilias"
                            @input="changedDet = true"
                            @blur="$v.editedItemDet.familia_id.$touch()"
                          >
                          </v-autocomplete>
                        </v-col>-->
                            <!-- Producto -->
                            <v-col cols="6" class="v-text">
                              <v-autocomplete
                                v-model="$v.editedItemDet.prod_id.$model"
                                :items="productos"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Servicio*"
                                item-text="prod_descripcion"
                                item-value="prod_id"
                                persistent-hint
                                hint="Seleciona servicio"
                                return-object
                                :error-messages="prod_idErrors"
                                @change="setfilterProductos"
                                @input="changedDet = true"
                                @blur="$v.editedItemDet.prod_id.$touch()"
                              >
                              </v-autocomplete>
                            </v-col>
                            <!-- Unidades -->
                            <v-col cols="5" class="v-text">
                              <v-select
                                v-model="$v.editedItemDet.unidad_id_det.$model"
                                :items="unidades"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Unidad*"
                                item-text="tipo_descripcion"
                                item-value="tipo_clave"
                                persistent-hint
                                disabled
                                hint="Seleciona la Unidad"
                                return-object
                                :error-messages="unidad_idErrors"
                                @blur="$v.editedItemDet.unidad_id_det.$touch()"
                                @input="changedDet = true"
                              >
                              </v-select>
                            </v-col>
                            <!-- Ciudad Proveedor-->
                            <v-col cols="12" class="v-text">
                              <v-text-field
                                dense
                                label="Concepto"
                                maxlength="350"
                                counter="350"
                                v-model="editedItemDet.osDescripcion"
                                @blur="$v.eeditedItemDet.osDescripcion.$touch()"
                                @input="$v.editedItemDet.osDescripcion.$reset()"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- Cantidad  justify="end"-->
                          <v-row justify="end">
                            <v-col class="v-text" cols="3">
                              <v-text-field
                                class="v-text-Right"
                                label="Cantidad*"
                                maxlength="20"
                                required
                                dense
                                v-model="editedItemDet.osDetCantidad"
                                @blur="$v.editedItemDet.osDetCantidad.$touch()"
                                @input="
                                  ;(changedDet = true), $v.editedItemDet.osDetCantidad.$reset()
                                "
                                id="osDetCantidad"
                                ref="input"
                                @change="CalcularDetalle"
                                @focus="focusField('osDetCantidad')"
                                v-on:keyup.enter="NextField('osDetPrecio')"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- Precio -->
                          <v-row justify="end">
                            <v-col class="v-text" cols="3">
                              <v-text-field
                                class="v-text-Right"
                                label="Precio*"
                                maxlength="20"
                                required
                                dense
                                id="osDetPrecio"
                                v-model="editedItemDet.osDetPrecio"
                                @blur="$v.editedItemDet.osDetPrecio.$touch()"
                                @input=";(changedDet = true), $v.editedItemDet.osDetPrecio.$reset()"
                                v-on:keyup.enter="NextField('osPorcDcto')"
                                @change="CalcularDetalle"
                                @focus="focusField('osDetPrecio')"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- CAMPOS Descuento -->
                          <v-row justify="end">
                            <!-- Porcentaje -->
                            <v-col class="v-text" cols="3">
                              <v-text-field
                                class="v-text-Right"
                                label="Porcentaje Descuento"
                                maxlength="20"
                                dense
                                id="osPorcDcto"
                                v-model="editedItemDet.osPorcDcto"
                                @input="changedDet = true"
                                v-on:keyup.enter="NextField('osDetDescuento')"
                                @change="CalcularDetalle"
                                @focus="focusField('osPorcDcto')"
                              ></v-text-field>
                            </v-col>
                            <!-- Descuento -->
                            <v-col class="v-text" cols="3">
                              <v-text-field
                                class="v-text-Right"
                                label="Descuento"
                                maxlength="20"
                                dense
                                id="osDetDescuento"
                                v-model="editedItemDet.osDetDescuento"
                                @input="changedDet = true"
                                v-on:keyup.enter="NextField('osDetSubtotal')"
                                @change="CalcularDetalle"
                                @focus="focusField('osDetDescuento')"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- SubTotal -->
                          <v-row justify="end">
                            <v-col class="v-text" cols="3">
                              <v-text-field
                                class="v-text-Right"
                                label="Sub Total"
                                maxlength="20"
                                readonly
                                dense
                                id="osDetSubtotal"
                                v-model="editedItemDet.osDetSubtotal"
                                @blur="$v.editedItemDet.osDetSubtotal.$touch()"
                                @input="
                                  ;(changedDet = true), $v.editedItemDet.osDetSubtotal.$reset()
                                "
                                v-on:keyup.enter="NextField('osDetIVA')"
                                @change="CalcularDetalle"
                                @focus="focusField('osDetSubtotal')"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <!-- CAMPOS IVA -->
                          <v-row justify="end">
                            <v-col class="v-text" cols="3">
                              <v-select
                                id="osDetTasaIVA"
                                v-model="$v.editedItemDet.osDetTasaIVA.$model"
                                :items="tasaIvas"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Tasa IVA*"
                                item-text="tipo_descripcion"
                                item-value="tipo_clave"
                                persistent-hint
                                dense
                                hint="Seleciona la Tasa de IVA"
                                return-object
                                :error-messages="osDetTasaIVAErrors"
                                @blur="$v.editedItemDet.osDetTasaIVA.$touch()"
                                v-on:keyup.enter="NextField('osDetIVA')"
                                @input="CalcularDetalle, (changedDet = true)"
                                @change="CalcularDetalle"
                                @focus="focusField('osDetTasaIVA')"
                              >
                              </v-select>
                            </v-col>
                            <v-col class="v-text" cols="3">
                              <v-text-field
                                class="v-text-Right"
                                label="IVA*"
                                maxlength="20"
                                required
                                dense
                                id="osDetIVA"
                                v-model="editedItemDet.osDetIVA"
                                @blur="$v.editedItemDet.osDetIVA.$touch()"
                                @input=";(changedDet = true), $v.editedItemDet.osDetIVA.$reset()"
                                @change="CalcularDetalle"
                                @focus="focusField('osDetIVA')"
                                v-on:keyup.enter="NextField('osDetTotal')"
                              ></v-text-field>
                            </v-col>
                          </v-row>

                          <v-row justify="end">
                            <!--boton-->
                            <v-col class="v-text" cols="2">
                              <v-btn color="info" small depressed @click="clean">
                                Limpiar Campos
                              </v-btn>
                            </v-col>
                            <!-- Total -->
                            <v-col class="v-text" cols="3">
                              <p class="font-weight-black">
                                <v-text-field
                                  class="v-text-Right"
                                  label="Total"
                                  background-color="#E0E0E0"
                                  maxlength="20"
                                  required
                                  id="osDetTotal"
                                  readonly
                                  dense
                                  v-model="editedItemDet.osDetTotal"
                                  @blur="$v.editedItemDet.osDetTotal.$touch()"
                                  @input="
                                    ;(changedDet = true), $v.editedItemDet.osDetTotal.$reset()
                                  "
                                  @focus="focusField('osDetIVA')"
                                ></v-text-field>
                              </p>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-checkbox
                          v-model="checkboxDet"
                          label="Crear otro"
                          :disabled="isEditingDet"
                        ></v-checkbox>
                        <v-btn color="red darken-1" text @click="checkChangesDet">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text @click="SaveDet" :disabled="validandoDet"
                          >Guardar</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <ConfirmationDialog v-model="isSureDet" @click="cancelDet" />
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-dialog>
          <!-- Fin dialogo -->

          <ConfirmationDialog v-model="isSure" @click="cancel" />

          <!-- Dialogo Editar Proveedor-->
          <EditaProveedor
            v-model="dialogEditProv"
            @click="cancel"
            :esEdicion="true"
            :proveedor="editedItem.prov_id"
            :editaCorreo1="false"
            :editaCorreo2="false"
            :editaDireccion="false"
            :editaCiudad="false"
            :editaRFC="false"
            :editaEmpYuc="false"
            :editaRegPad="false"
          />
          <CargarFactura
            v-model="dialogCargarFactura"
            @click="cancel"
            :osNumDoc="osNumDocEnCargarFactura"
            :osTipoDoc="osTipoDocEnCargarFactura"
            :ejercicio="ejercicioEnCargarFactura"
          />
          <v-divider class="mt-3" />

          <!-- Tabla de Ordenes de compra-->
          <v-data-table
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
            <template v-slot:[`item.info`]="{ item }">
              <div class="name-info-title">{{ item.sp_concepto_desc }}</div>
              <div class="mail-info-subtitle">{{ item.prov_razon_social }}</div>
            </template>
            <template v-slot:[`item.osTotal`]="{ item }">
              {{ formato(eFormatos.MONEDA, item.osTotal) }}
            </template>

            <!-- Acciones de la Tabla Principal -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon class="mr-2" small @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon class="mr-2" :disabled="item.osTotal === null  || item.osTotal == 0.0" small @click="crearSolic(item)"
                >mdi-check-bold</v-icon
              >
              <v-icon class="mr-2" small :disabled="item.osTotal === null || item.osTotal == 0.0" @click="printItem(item)">mdi-printer</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
          <v-snackbar v-model="snackbar" color="red" :timeout="timeout">
            El proveedor requiere un RFC, favor de editar e ingresarlo y vuelva a seleccionarlo
            <template v-slot:action="{ attrs }">
              <v-btn color="white" text v-bind="attrs" @click="snackbar = false"> Cerrar </v-btn>
            </template>
          </v-snackbar>
          <!--dialogo para confirmar-->
          <v-dialog v-model="dialogConfirmar" persistent max-width="500">
            <v-card>
              <v-card-title class="font-weight-bold">{{ tittleConfirm }} </v-card-title>
              <v-card-text class="text-center mb-4">
                {{ notificacionDialog }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  id="ConfirmaSi"
                  :disabled="!ConfirmaSi"
                  text
                  @click="enviarOrden()"
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
      <!--DEMO-->
      <v-container v-show="tabForm" v-model="tabForm" class="px-5 py-3">
        <v-card-title>
          <span class="text-center">{{ formTitle }}</span>
          <!--<v-img src="@/assets/logo_ivey.jpg" width="20px" height="20px"></v-img>-->
        </v-card-title>
        <v-card>
          <v-card-text>
            <v-container> </v-container>
          </v-card-text>
        </v-card>
      </v-container>
    </v-tab-item>
    <!--PESTAÑA DE ORDENES ENVIADAS-->
    <v-tab-item key="tab1">
      <v-container id="ordenes" tag="section">
        <base-material-card class="px-5 py-3" color="primary" icon="mdi-car-wrench" inline>
          <v-spacer></v-spacer>
          <template v-slot:after-heading></template>

          <!-- Boton nuevo registro -->
          <template v-slot:corner-button>
            <v-row>
              <!-- <v-col cols="6">
            <v-btn
              class="ma-2"
              color="primary"
              elevation="2"
              small
              @click="nuevaCaptura"
              @click.stop="dialog = true"
              >Nueva órden de compra</v-btn
            >
          </v-col>-->
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
                  hint="Seleciona Ejercicio"
                  @change="onChangeEjericioOrdEnv"
                  return-object
                >
                </v-select>
              </v-col>
            </v-row>
          </template>

          <!-- Overlay para retroalimentar al usuario -->
          <v-overlay :value="overlay">
            <v-progress-circular color="success" indeterminate :size="50"></v-progress-circular>
          </v-overlay>

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

          <ConfirmationDialog v-model="isSure" @click="cancel" />

          <!-- Dialogo Editar Proveedor-->
          <EditaProveedor
            v-model="dialogEditProv"
            @click="cancel"
            :esEdicion="true"
            :proveedor="editedItem.prov_id"
            :editaCorreo1="false"
            :editaCorreo2="false"
            :editaDireccion="false"
            :editaCiudad="false"
            :editaRFC="false"
            :editaEmpYuc="false"
            :editaRegPad="false"
          />
          <CargarFactura
            v-model="dialogCargarFactura"
            @click="cancel"
            :osNumDoc="osNumDocEnCargarFactura"
            :osTipoDoc="osTipoDocEnCargarFactura"
            :ejercicio="ejercicioEnCargarFactura"
          />

          <v-divider class="mt-3" />

          <!-- Tabla de Ordenes de compra-->
          <v-data-table
            dense
            loading-text="Cargando... Espere por favor"
            :headers="headers"
            :items="ordenesEnv"
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

            <!-- Acciones de la Tabla Principal -->
            <!--<template v-slot:[`item.actions`]="{ item }">
               <v-icon class="mr-2" small @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon class="mr-2" small @click="editItemDet(item)">mdi-view-grid-outline</v-icon> 
              <v-icon class="mr-2" small @click="crearSolic(item)">mdi-check-bold</v-icon>
              <v-icon class="mr-2" small @click="printItem(item)">mdi-printer</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>-->
          </v-data-table>
          <v-snackbar v-model="snackbar" color="red" :timeout="timeout">
            El proveedor requiere un RFC, favor de editar e ingresarlo y vuelva a seleccionarlo
            <template v-slot:action="{ attrs }">
              <v-btn color="white" text v-bind="attrs" @click="snackbar = false"> Cerrar </v-btn>
            </template>
          </v-snackbar>
          <!--dialogo para confirmar-->
          <v-dialog v-model="dialogConfirmar" persistent max-width="500">
            <v-card>
              <v-card-title class="font-weight-bold">{{ tittleConfirm }} </v-card-title>
              <v-card-text class="text-center mb-4">
                {{ notificacionDialog }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  id="ConfirmaSi"
                  :disabled="!ConfirmaSi"
                  text
                  @click="enviarOrden()"
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
    </v-tab-item>
  </v-tabs>
</template>

<script>
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
import EditaProveedor from '@/components/general/EditaProveedor.vue'
import CargarFactura from '@/components/general/CargarFactura.vue'
import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import * as tools from '@/store/modules/tools.store.js'
import { imprimeFormatoOrdenServ } from '@/store/modules/sica/impresionesSicaServ.store.js'

import Vue from 'vue'
export default {
  components: {
    ConfirmationDialog,
    EditaProveedor,
    CargarFactura,
    //DataExporter,
  },
  data: () => ({
    usuario: JSON.parse(localStorage.getItem('user')),
    mostrarCampo: false,
    eFormatos: tools.formatos,
    tabForm: false,
    tabPrincipal: true,
    dialog: false,
    dialogDet: false,
    dialogEditProv: false,
    dialogCargarFactura: false,
    editedIndex: -1,
    editedIndexDet: -1,
    snackbar: false,
    fromDateMenu: false,
    fromDateMenuFLM: false,
    idEmpleadoAut: 0,
    idEmpleadoSolFirma: 0,
    isEditing: false,
    isEditingDet: false,
    isLoading: false,
    timeout: 10000,
    isSure: false,
    isSureDet: false,
    chkAllProd: false,
    checkboxDet: false,
    checkbox: false,
    changed: false,
    changedDet: false,
    existeOrden: true,
    tipo_temp: 0,
    clave_temp: '',
    familiaAct: '',
    //dialogo confirmar
    dialogConfirmar: false,
    notificacionDialog: '',
    tittleConfirm: '',
    confirmarBoton: '',
    ConfirmaSi: true,
    opcionSelect: '',
    //Detalle
    contPosiciones: 0,
    subTotalCalculado: 0,
    descuentoCalculado: 0,
    ivaCalculado: 0,
    TotalCalculado: 0,
    minDate: '2021-01-01',
    maxDate: '2050-01-31',
    overlay: false,
    search: null,
    bandValidaCampos: false,
    isTipo: true,
    tabs: 0,
    headers: [
      { text: 'Nº Doc', align: 'start', value: 'osNumDoc', sortable: true },
      { text: 'Fecha', align: 'start', value: 'osFecha', sortable: true },
      { text: 'Info', value: 'info' },
      //{ text: 'Solicita', align: 'center', value: 'osEmpSolicitaNombre', sortable: true },
      { text: 'Descripción', align: 'start', value: 'osDescripcion', sortable: true },
      //{ text: 'Comite', align: 'center', value: 'concom_descripcion', sortable: true },
      { text: 'Total', align: 'start', value: 'osTotal', sortable: true },
      //{ text: 'Proveedor ID', align: 'center', value: 'prov_razon_social', sortable: true },
      { text: 'Estatus', align: 'start', value: 'estatus_nombre', sortable: true },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headersDet: [
      { text: 'Posicion', align: 'start', value: 'osDetPosicion', sortable: true },
      { text: 'Descripcion', align: 'start', value: 'prod_descripcion', sortable: true },
      { text: 'Unidad', align: 'start', value: 'unidad_id_det_desc', sortable: true },
      { text: 'Cantidad', align: 'start', value: 'osDetCantidad', sortable: true },
      { text: 'Precio  ', align: 'start', value: 'osDetPrecio', sortable: true },
      { text: 'Descuento', align: 'start', value: 'osDetDescuento', sortable: true },
      { text: 'osDetSubTotal', align: 'start', value: 'osDetSubtotal', sortable: true },
      { text: 'IVA', align: 'start', value: 'osDetIVA', sortable: true },
      { text: 'TOTAL', align: 'start', value: 'osDetTotal', sortable: true },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    defaultItem: {
      osNumDoc: '',
      osTipoDoc: '',
      osTipoOs: '',
      osFecha: '',
      veh_id: '',
      osEmpSolicita: '',
      osUserCrea: '',
      osFechaElabora: '',
      osDescripcion: '',
      osObservacion: '',
      osDirSolicita: '',
      osDeptoSolicita: '',
      osDirDestino: '',
      osDeptoDestino: '',
      osSubTotal: 0,
      osDescuento: 0,
      osIva: 0,
      osTipoVehiculo: '',
      osMarcaVehiculo: '',
      osModeloVehiculo: '',
      osSolicitudServicio: 0,
      osgenAdjudicacion: '',
      sp_ejercicio: 0,
      sp_id: 0,
      sp_tipo_sol: 0,
      sp_concepto: 0,
      sp_tipoServicio: 0,
      prov_id: 0,
      cuecon_cuenta: '',
      osEstatus: '',
      osUserMod: '',
      osFechaMod: '',
      osFechaLimEntrega: '',
      osLugarEntrega: '',
      osDiasCredito: '',
      prov_direccion: '',
      prov_ciudad: '',
    },
    defaultItemDet: {
      osNumDoc: '',
      prod_id: '',
      unidad_id_det: '',
      marca_id: '',
      osDetCantidad: 0,
      osDetPrecio: 0,
      osPorcDcto: 0,
      osDetDescuento: 0,
      osDetSubtotal: 0,
      osDetTasaIVA: '',
      osDetIVA: 0,
      osDetTotal: 0,
      osDetActivo: '',
      familia_id: '',
    },
    editedItem: {
      osNumDoc: '',
      osTipoDoc: '',
      osTipoOs: '',
      osFecha: '',
      osEmpSolicita: '',
      osUserCrea: '',
      osFechaElabora: '',
      osDescripcion: '',
      osObservacion: '',
      osDirSolicita: '',
      osDeptoSolicita: '',
      osDirDestino: '',
      osDeptoDestino: '',
      osSubTotal: 0,
      osDescuento: 0,
      osIva: 0,
      osTipoVehiculo: '',
      osMarcaVehiculo: '',
      osModeloVehiculo: '',
      osSolicitudServicio: 0,
      osgenAdjudicacion: '',
      sp_ejercicio: 0,
      sp_id: 0,
      sp_tipo_sol: 0,
      sp_concepto: 0,
      prov_id: 0,
      cuecon_cuenta: '',
      osEstatus: '',
      osUserMod: '',
      osFechaMod: '',
      osFechaLimEntrega: '',
      osLugarEntrega: '',
      osDiasCredito: '',
      prov_direccion: '',
      prov_ciudad: '',
      veh_id: '',
    },
    editedItemDet: {
      osNumDoc: '',
      prod_id: '',
      unidad_id_det: '',
      marca_id: '',
      osDetCantidad: 0,
      osDetPrecio: 0,
      osPorcDcto: 0,
      osDetDescuento: 0,
      osDetSubtotal: 0,
      osDetTasaIVA: '',
      osDetIVA: 0,
      osDetTotal: 0,
      osDetActivo: '',
      familia_id: '',
    },
    editedItemProv: {
      prov_id: 0,
      prov_razon_social: '',
      prov_tipo: 0,
      prov_activo: true,
      prov_RFC: '',
      prov_empresayuc: false,
      prov_NumRegPadProv: '',
      prov_email: '',
      prov_email2: '',
      prov_direccion: '',
      prov_ciudad: '',
    },
    conceptos: [],
    servicios: [],
    cuentas: [],
    deptoDestino: [],
    deptoSolicita: [],
    dirDestino: [],
    dirSolicita: [],
    empSolicita: [],
    familias: [],
    genAdjudicacion: [],
    generales: [],
    tasaIvas: [],
    marcas: [],
    ordenesEnv: [],
    ordenes: [],
    ordenesDet: [],
    tipoAdjudicacion: [],
    productos: [],
    proveedores: [],
    tipoVehiculos: [],
    marcaCoches: [],
    modeloCoches: [],
    unidades: [],
    lugaresEntrega: [],
    ejercicios: [],
  }),
  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      osNumDoc: { required },
      prov_id: { required },
      osDirSolicita: { required },
      osDeptoSolicita: { required },
      osDirDestino: { required },
      osDeptoDestino: { required },
      osEmpSolicita: { required },
      osTipoVehiculo: { required },
      osMarcaVehiculo: { required },
      osModeloVehiculo: { required },
      osSolicitudServicio: { required },
      osgenAdjudicacion: { required },
      sp_concepto: { required },
      sp_tipoServicio: { required },
      prov_RFC: { required },
      osLugarEntrega: { required },
      cuecon_cuenta: { required, minLength: minLength(3), maxLength: maxLength(20) },
    },
    editedItemDet: {
      osNumDoc: { required },
      prod_id: { required },
      unidad_id_det: { required },
      marca_id: { required },
      osDetTasaIVA: { required },
      osDetCantidad: { required },
      osDetPrecio: { required },
      osDetIVA: { required },
    },
  },
  watch: {
    dialogDet(val) {
      val || this.closeDet()
    },
    async dialogEditProv(val) {
      console.log('Watch', 'dialogEditProv(val)', val)
    },
    async dialogCargarFactura(val) {
      console.log('Watch', 'dialogCargarFactura(val)', val)
    },
  },
  async created() {
    this.Refreesca()
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'Nueva Órden de Servicio'
        : 'Editar Órden de Servicio: ' + this.editedItem.osNumDoc
    },
    sp_conceptoErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_concepto.$dirty) return errors
      !this.$v.editedItem.sp_concepto.required && errors.push('Este campo es requerido')
      return errors
    },
    solicitudServErrors() {
      const errors = []
      if (!this.$v.editedItem.osSolicitudServicio.$dirty) return errors

      // Verificar si el campo es requerido
      if (!this.$v.editedItem.osSolicitudServicio.required) {
        errors.push('Este campo es requerido')
      }

      // Verificar si el campo es igual a cero
      if (this.$v.editedItem.osSolicitudServicio.$model <= 0) {
        errors.push('El valor no puede ser cero')
      }

      return errors
    },
    prov_idErrors() {
      const errors = []
      if (!this.$v.editedItem.prov_id.$dirty) return errors
      !this.$v.editedItem.prov_id.required && errors.push('Este campo es requerido')
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
    osDirDestinoErrors() {
      const errors = []
      if (!this.$v.editedItem.osDirDestino.$dirty) return errors
      !this.$v.editedItem.osDirDestino.required && errors.push('Este campo es requerido')
      return errors
    },
    osDirSolicitaErrors() {
      const errors = []
      if (!this.$v.editedItem.osDirSolicita.$dirty) return errors
      !this.$v.editedItem.osDirSolicita.required && errors.push('Este campo es requerido')
      return errors
    },
    osDeptoSolicitaErrors() {
      const errors = []
      if (!this.$v.editedItem.osDeptoSolicita.$dirty) return errors
      !this.$v.editedItem.osDeptoSolicita.required && errors.push('Este campo es requerido')
      return errors
    },
    osdeptoDestinoErrors() {
      const errors = []
      if (!this.$v.editedItem.osDeptoDestino.$dirty) return errors
      !this.$v.editedItem.osDeptoDestino.required && errors.push('Este campo es requerido')
      return errors
    },
    osEmpSolicitaErrors() {
      const errors = []
      if (!this.$v.editedItem.osEmpSolicita.$dirty) return errors
      !this.$v.editedItem.osEmpSolicita.required && errors.push('Este campo es requerido')
      return errors
    },
    osLugarEntregaErrors() {
      const errors = []
      if (!this.$v.editedItem.osLugarEntrega.$dirty) return errors
      !this.$v.editedItem.osLugarEntrega.required && errors.push('Este campo es requerido')
      return errors
    },

    prod_idErrors() {
      const errors = []
      if (!this.$v.editedItemDet.prod_id.$dirty) return errors
      !this.$v.editedItemDet.prod_id.required && errors.push('Este campo es requerido')
      return errors
    },
    osTipoAdjudicacionErrors() {
      const errors = []
      if (!this.$v.editedItem.osTipoVehiculo.$dirty) return errors
      !this.$v.editedItem.osTipoVehiculo.required && errors.push('Este campo es requerido')
      return errors
    },
    provRFCErrors() {
      const errors = []
      if (!this.$v.editedItem.prov_RFC.$dirty) return errors
      !this.$v.editedItem.prov_RFC.required &&
        errors.push('El proveedor debe tener un RFC registrado')
      return errors
    },
    osgenAdjudicacionErrors() {
      const errors = []
      if (!this.$v.editedItem.osgenAdjudicacion.$dirty) return errors
      !this.$v.editedItem.osgenAdjudicacion.required && errors.push('Este campo es requerido')
      return errors
    },
    unidad_idErrors() {
      const errors = []
      if (!this.$v.editedItemDet.unidad_id_det.$dirty) return errors
      !this.$v.editedItemDet.unidad_id_det.required && errors.push('Este campo es requerido')
      return errors
    },
    marca_idErrors() {
      const errors = []
      if (!this.$v.editedItemDet.marca_id.$dirty) return errors
      !this.$v.editedItemDet.marca_id.required && errors.push('Este campo es requerido')
      return errors
    },
    osDetTasaIVAErrors() {
      const errors = []
      if (!this.$v.editedItemDet.osDetTasaIVA.$dirty) return errors
      !this.$v.editedItemDet.osDetTasaIVA.required && errors.push('Este campo es requerido')
      return errors
    },
    validando() {
      let valida = true

      if (
        this.$v.editedItem.sp_tipoServicio.$model === 'Vehiculos' &&
        this.$v.editedItem.osSolicitudServicio.$model <= 0 &&
        this.$v.editedItem.osNumDoc.$model != '' &&
        this.$v.editedItem.sp_concepto.$model != '' &&
        this.$v.editedItem.prov_id.$model != '' &&
        this.$v.editedItem.prov_RFC.$model != null &&
        this.$v.editedItem.cuecon_cuenta.$model != null
      ) {
        valida = false
      } else if (
        this.$v.editedItem.osNumDoc.$model != '' &&
        this.$v.editedItem.sp_tipoServicio.$model != '' &&
        this.$v.editedItem.sp_concepto.$model != '' &&
        this.$v.editedItem.prov_id.$model != '' &&
        this.$v.editedItem.prov_RFC.$model != null &&
        this.$v.editedItem.cuecon_cuenta.$model != null
      ) {
        valida = false
      }
      return valida
    },
    validandoDet() {
      let valida = true
      if (
        (this.$v.editedItemDet.prod_id.$model.prod_id != '' ||
          this.$v.editedItemDet.prod_id.$model != '') &&
        this.$v.editedItemDet.unidad_id_det.$model != '' &&
        Number(this.editedItemDet.osDetCantidad) > 0 &&
        Number(this.editedItemDet.osDetPrecio) > 0 &&
        Number(this.editedItemDet.osDetTasaIVA) > 0 &&
        Number(this.editedItemDet.osDetIVA) > 0
      ) {
        valida = false
      }

      return valida
    },
  },
  methods: {
    //Cancelar dialogo Principal
    cancel(isSure) {
      this.isSure = isSure
      if (this.isSure) {
        this.close(false)
        this.changed = false
      }
    },
    // Revisar los cambios en el formulario Principal
    checkChanges() {
      if (this.changed) {
        this.isSure = true
      } else {
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
        this.dialogConfirmar = false
        this.dialogCargarFactura = false
        this.isEditing = false
        //this.tabForm = false
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        var fecha = new Date()
        this.editedItem.osFecha = this.formato(this.eFormatos.FECHA_NUM, fecha)
        this.editedItem.osFechaLimEntrega = this.formato(this.eFormatos.FECHA_NUM, fecha)
      })
      this.$v.$reset()
    },
    //Obtiene el indice del elemento seleccionado y lo signa al array editedItem
    editItem(item) {
      console.log('ENTRA A: editItem(item)', 'item: ', item)
      this.isEditing = true
      this.editedIndex = this.ordenes.indexOf(item)
      console.log('this.editedIndex: ', this.editedIndex)
      this.editedItem = Object.assign({}, item)
      const osNumDocValue = this.editedItem.osNumDoc
      this.osNumDocEnCargarFactura = osNumDocValue
      const osTipoDocValue = this.editedItem.osTipoDoc
      this.osTipoDocEnCargarFactura = osTipoDocValue
      const ejercicioValue = this.editedItem.sp_ejercicio
      this.ejercicioEnCargarFactura = ejercicioValue
      console.log('this.editedItem: ', this.editedItem)
      this.editedItem.osFecha = this.formato(this.eFormatos.FECHA_NUM, this.editedItem.osFecha)
      this.editedItem.osFechaLimEntrega = this.formato(
        this.eFormatos.FECHA_NUM,
        this.editedItem.osFecha
      )
      if (this.editedItem.prov_RFC === '' || this.editedItem.prov_RFC === null) {
        // Mostrar una alerta o mensaje
        alert('El proveedor seleccionado en la orden  no cuenta con RFC, debe ser actualizado')

        // Salir de la función si el RFC es nulo
      }
      console.log('tipos', this.editedItem.osModeloVehiculo)
      this.veh_id = this.editedItem.osModeloVehiculo
      this.obtenerOrdenesDet(this.editedItem.osNumDoc)
      this.existeOrden = false
      this.mostrarAnioVehiculo = this.editedItem.sp_tipoServicio === 'VEH'
      this.dialog = true
      //this.tabForm = true
    },
    async crearSolic(item) {
      console.log('ENTRA A: editItem(item)', 'item: ', item)
      this.isEditing = true
      this.editedIndex = this.ordenes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      var fecha = new Date()
      this.editedItem.sp_fecha_solicitud = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.editedItem.os_fecha_envpre = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.sp_fecha_envprecap = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      // Verificar si prov_RFC es nulo o vacio
      if (this.editedItem.prov_RFC === '' || this.editedItem.prov_RFC === null) {
        this.dialogConfirmar = true
        this.notificacionDialog =
          'No se puede continuar, porque el proveedor seleccionado no cuenta con RFC valído'
        this.opcionSelect = 'Salír'
        this.ConfirmaSi = false
        return
      }
      const osNumDocValue = this.editedItem.osNumDoc
      this.osNumDocEnCargarFactura = osNumDocValue
      const osTipoDocValue = this.editedItem.osTipoDoc
      this.osTipoDocEnCargarFactura = osTipoDocValue
      const ejercicioValue = this.editedItem.sp_ejercicio
      this.ejercicioEnCargarFactura = ejercicioValue
      this.editedItem.osFecha = this.formato(this.eFormatos.FECHA_NUM, this.editedItem.osFecha)
      this.editedItem.osFechaLimEntrega = this.formato(
        this.eFormatos.FECHA_NUM,
        this.editedItem.osFecha
      )

      //conbierte el valor de tipo de solicitud en id //PENDIENTE DE CAMBIO
      if (this.editedItem.sp_tipo_sol === 'P') {
        this.editedItem.tipoSol = 1
      } else if (this.editedItem.sp_tipo_sol === 'NP') {
        this.editedItem.tipoSol = 2
      }
      this.obtenerConceptos()
      this.EjercicioValido()
      //obtiene el tipo_id del concepto registrado en la orden de compra
      if (this.conceptos && this.editedItem.sp_concepto) {
        const conceptoEncontrado = this.conceptos.find(
          (concepto) => concepto.tipo_clave === this.editedItem.sp_concepto
        )

        if (conceptoEncontrado) {
          this.sp_concepto_id = conceptoEncontrado.tipo_id
        }
      }
      this.editedItem.osEstatus = 'ENVPRE'
      var year = this.editedItem.sp_ejercicio
      let jwt = await getValidToken(this)
      await this.obtenerIdSolPagos(jwt, year)
      let sp_folio = parseInt(this.sgteIdSolPag)
      this.sp_id = sp_folio
      //console.log("this.sp_folio_nuev",sp_folio)
      this.sp_folio_nuevo = sp_folio
      console.log('this.sp_folio_nuev', this.sp_folio_nuevo)
      this.estatus_sol = 'ENVPRECAP'
      this.editedItem.sp_fecha_precaptura = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.obtenerOrdenesDet(this.editedItem.osNumDoc)
      this.tittleConfirm = 'Enviar a solicitud de pago'
      this.notificacionDialog =
        'Se enviara la orden: ' + this.editedItem.osNumDoc + ' ¿Seguro quiere continuar?'
      this.existeOrden = false
      this.dialogConfirmar = true
    },
    enviarOrden() {
      if (this.ConfirmaSi) {
        this.save()
        this.savePreCap()
      }
    },
    async save() {
      this.overlay = true

      let ejercicio = ''
      if (this.editedItem.sp_ejercicio.sp_ejercicio == null) {
        ejercicio = this.editedItem.sp_ejercicio
      } else {
        ejercicio = this.editedItem.sp_ejercicio.sp_ejercicio
      }
      let vehiculoID = ''
      if (this.editedItem.osVeh_id.veh_id == null) {
        vehiculoID = this.editedItem.osVeh_id
      } else {
        vehiculoID = this.editedItem.osVeh_id.veh_id
      }
      let generoAdjudicacion = ''
      if (this.editedItem.osgenAdjudicacion.tipo_clave == null) {
        generoAdjudicacion = this.editedItem.osgenAdjudicacion
      } else {
        generoAdjudicacion = this.editedItem.osgenAdjudicacion.tipo_clave
      }
      let tipoAdjudicacion = ''
      if (this.editedItem.osTipoAdjudicacion.tipo_clave == null) {
        tipoAdjudicacion = this.editedItem.osTipoAdjudicacion
      } else {
        tipoAdjudicacion = this.editedItem.osTipoAdjudicacion.tipo_clave
      }
      let concepto = ''
      if (this.editedItem.sp_concepto.tipo_clave == null) {
        concepto = this.editedItem.sp_concepto
      } else {
        concepto = this.editedItem.sp_concepto.tipo_clave
      }
      let servicios = ''
      if (this.editedItem.sp_tipoServicio.tipo_clave == null) {
        servicios = this.editedItem.sp_tipoServicio
      } else {
        servicios = this.editedItem.sp_tipoServicio.tipo_clave
      }
      let tipo_sol = ''
      if (this.editedItem.sp_concepto.sp_tipo_sol == null) {
        tipo_sol = this.editedItem.sp_tipo_sol
      } else {
        tipo_sol = this.editedItem.sp_concepto.sp_tipo_sol
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
      let solicita = 0
      if (this.editedItem.osEmpSolicita.emp_id == null) {
        solicita = this.editedItem.osEmpSolicita
      } else {
        solicita = this.editedItem.osEmpSolicita.emp_id
      }
      let dirSolicita = 0
      if (this.editedItem.osDirSolicita.emp_direccion == null) {
        dirSolicita = this.editedItem.osDirSolicita
      } else {
        dirSolicita = this.editedItem.osDirSolicita.emp_direccion
      }
      let deptoSolicita = 0
      if (this.editedItem.osDeptoSolicita.emp_departamento == null) {
        deptoSolicita = this.editedItem.osDeptoSolicita
      } else {
        deptoSolicita = this.editedItem.osDeptoSolicita.emp_departamento
      }
      let dirDestino = 0
      if (this.editedItem.osDirDestino.emp_direccion == null) {
        dirDestino = this.editedItem.osDirDestino
      } else {
        dirDestino = this.editedItem.osDirDestino.emp_direccion
      }
      let deptoDestino = 0
      if (this.editedItem.osDeptoDestino.emp_departamento == null) {
        deptoDestino = this.editedItem.osDeptoDestino
      } else {
        deptoDestino = this.editedItem.osDeptoDestino.emp_departamento
      }
      /*  let lugEntrega = ''
      if (this.editedItem.osLugarEntrega.tipo_descripcion == null) {
        lugEntrega = this.editedItem.osLugarEntrega
      } else {
        lugEntrega = this.editedItem.osLugarEntrega.tipo_descripcion
      }*/
      let body = {}
      let payload = {}
      let jwt = await getValidToken(this)

      if (this.editedIndex > -1) {
        //MODIFICAR
        await this.obtenerOrdenesDet(this.editedItem.osNumDoc)
        console.log(
          "let subtotal = Number(this.sumaCampo('osDetSubtotal'))",
          Number(this.sumaCampo('osDetSubtotal'))
        )
        let descuento = Number(this.sumaCampo('osDetDescuento'))
        let iva = Number(this.sumaCampo('osDetIVA'))
        let subtotal = Number(this.sumaCampo('osDetSubtotal'))
        let total = Number(this.sumaCampo('osDetTotal'))
      

        if (!Number.isFinite(descuento)) descuento = 0
        if (!Number.isFinite(iva)) iva = 0
        if (!Number.isFinite(subtotal)) subtotal = 0
        if (!Number.isFinite(total)) total = 0

          //imprime solo si la orden tiene detalle
      if(total > 0){
       var opcion = confirm(
        'Desea Imprimir la orden de servicio: ' + this.editedItem.osNumDoc + ' ?'
      )
      var opcion2 = confirm('Desea Salir de la captura de Orden de servicio?')
      if (opcion) {
        imprimeFormatoOrdenServ(this.editedItem.osNumDoc, this)
        if (opcion2) {
          this.close(this.checkbox)
        }
      } else if (opcion2) {
        this.close(this.checkbox)
      }
    }
        body = {
          sp_id: this.sp_id || 0,
          osNumDoc: this.editedItem.osNumDoc,
          osTipoDoc: this.editedItem.osTipoDoc,
          osTipoOs: this.editedItem.osTipoOs,
          osFecha: this.editedItem.osFecha,
          osVeh_id: vehiculoID,
          osEmpSolicita: solicita,
          sp_ejercicio: ejercicio,
          osDescripcion: this.editedItem.osDescripcion,
          osObservacion: this.editedItem.osObservacion,
          osDirSolicita: dirSolicita,
          osDeptoSolicita: deptoSolicita,
          osDirDestino: dirDestino,
          osSubTotal: subtotal == undefined ? 0 : subtotal,
          osDescuento: descuento == undefined ? 0 : descuento,
          osIva: iva == undefined ? 0 : iva,
          osTotal: total == undefined ? 0 : total,
          osDeptoDestino: deptoDestino,
          osSolicitudServicio: this.editedItem.osSolicitudServicio,
          //osSolicitudServicio: ordenesServicio,
          osgenAdjudicacion: generoAdjudicacion,
          osTipoAdjudicacion: tipoAdjudicacion,
          prov_id: prov,
          cuecon_cuenta: cuenta,
          sp_tipo_sol: tipo_sol,
          sp_concepto: concepto,
          sp_tipoServicio: servicios,
          osEstatus: this.editedItem.osEstatus,
          osFechaLimEntrega: this.editedItem.osFechaLimEntrega,
          //osLugarEntrega: lugEntrega,
          prov_direccion: this.editedItem.prov_direccion,
          prov_ciudad: this.editedItem.prov_ciudad,
          osEmpSolFir: this.idEmpleadoSolFirma,
          osEmpAut: this.idEmpleadoAut,
        }
        payload = {
          jwt: jwt,
          body: body,
        }
        payload.id = this.editedItem.osNumDoc
        await this.$store
          .dispatch('ordencompra/editOrden', payload)
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
      } else {
        //NUEVO
        body = {
          osNumDoc: this.editedItem.osNumDoc,
          osTipoDoc: this.editedItem.osTipoDoc,
          osTipoOs: this.editedItem.osTipoOs,
          osFecha: this.editedItem.osFecha,
          osVeh_id: vehiculoID,
          osEmpSolicita: solicita,
          sp_ejercicio: ejercicio,
          osDescripcion: this.editedItem.osDescripcion,
          osObservacion: this.editedItem.osObservacion,
          osDirSolicita: dirSolicita,
          osDeptoSolicita: deptoSolicita,
          osDirDestino: dirDestino,
          osDeptoDestino: deptoDestino,
          osSolicitudServicio: this.editedItem.osSolicitudServicio,
          //osSolicitudServicio: ordenesServicio,
          osgenAdjudicacion: generoAdjudicacion,
          osTipoAdjudicacion: tipoAdjudicacion,
          prov_id: prov,
          cuecon_cuenta: cuenta,
          sp_tipo_sol: tipo_sol,
          sp_concepto: concepto,
          sp_tipoServicio: servicios,
          osEstatus: this.editedItem.osEstatus,
          osFechaLimEntrega: this.editedItem.osFechaLimEntrega,
          // osLugarEntrega: lugEntrega,
          prov_direccion: this.editedItem.prov_direccion,
          prov_ciudad: this.editedItem.prov_ciudad,
          osEmpSolFir: this.idEmpleadoSolFirma,
          osEmpAut: this.idEmpleadoAut,
          osSubTotal: 0,
          osDescuento: 0,
          osIva: 0,
          osTotal: 0,
        }
        //CREA EL PRIMER REGISTRO EN TABLA SEGUIMIENTO FECHA_CAPTURA
        let bodyCap = {
          osNumDoc: this.editedItem.osNumDoc,
          osEjercicio: this.editedItem.sp_ejercicio,
          os_fecha_cap: this.editedItem.os_fecha_cap,
          os_user_cap: this.usuario.usr_id,
        }
        let payloadCap = { jwt: jwt, body: bodyCap }
        await this.$store.dispatch('ordencompra/addSeguimiento', payloadCap)
        //DISTPACH PARA CREAR ORDEN
        payload = { jwt: jwt, body: body }
        await this.$store
          .dispatch('ordenServicio/addOrdenServ', payload)
          .then(() => {
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'El registro se Inserto con éxito',
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
      }
      this.overlay = false
      this.changed = false
      this.Refreesca()
    
      await this.validaExisteOrden(false)
      if (this.existeOrden) {
        //this.editItem(this.editedItem)
        this.editedIndex = this.editedItem.osNumDoc
        this.existeOrden = false
        this.isEditing = true
      }
      await this.obtenerOrdenes(jwt, this.ejercicio)
      this.close(this.checkbox)

      //}
    },
    async savePreCap() {
      console.log('sp_folio_nuevo s', this.sp_folio_nuevo)
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
      let fecha_envpre = ''
      if (this.editedItem.os_fecha_envpre.os_fecha_envpre == null) {
        fecha_envpre = this.editedItem.os_fecha_envpre
      } else {
        fecha_envpre = this.editedItem.os_fecha_envpre.os_fecha_envpre
      }
      let osNumDoc = ''
      if (this.editedItem.osNumDoc.osNumDoc == null) {
        osNumDoc = this.editedItem.osNumDoc
      } else {
        osNumDoc = this.editedItem.osNumDoc.osNumDoc
      }
      //***********************
      //CREAR P o NP PRINCIPAL
      //***********************
      let body = {}
      body = {
        sp_tipo_sol: this.editedItem.tipoSol,
        sp_concepto: this.sp_concepto_id,
        prov_id: prov,
        cuecon_cuenta: cuenta,
        sp_descripcion: this.editedItem.osDescripcion || 'ENVIDADO PARA SOLICITUD',
        sp_pago_nombre_de: pagoNombreDe,
        sp_observacion: this.editedItem.osObservacion,
        sp_emp_id_sol: solicita,
        sp_emp_id_aut: this.editedItem.osEmpAut,
        sp_direccion_sol: dirSolicita,
        sp_estatus: this.estatus_sol,
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
      var year = this.editedItem.sp_ejercicio

      await this.obtenerIdSolPagos(jwt, year)
      let sp_folio = parseInt(this.sgteIdSolPag)
      body.sp_ejercicio = year
      body.sp_id = sp_folio
      //guarda  envprecap en seguimiento de solicitud de pagos
      let bodySol = {
        sp_id: sp_folio,
        sp_ejercicio: year,
        sp_fecha_envprecap: this.sp_fecha_envprecap,
        sp_user_envprecap: this.usuario.usr_id,
      }
      let payloadSol = { jwt: jwt, body: bodySol }
      //guarda ACTUALIZA SEGUIMIENTO AL EDITAR
      let bodyOrd = {
        osNumDoc: osNumDoc,
        osEjercicio: year,
        os_fecha_envpre: fecha_envpre,
        os_user_envpre: this.usuario.usr_id,
        sp_id: sp_folio,
      }
      let payloadOrd = { jwt: jwt, body: bodyOrd }
      await this.$store.dispatch('solpago/addPreSolPagos', payload)

      await this.$store.dispatch('solpago/editCampoSol', payloadSol)

      await this.$store
        .dispatch('ordencompra/editSeguimiento', payloadOrd)
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
    //Editar Proveedor
    async editarProveedor() {
      this.dialogEditProv = false
      console.log('this.dialogEditProv', this.dialogEditProv)
      /* NO BORRAR
      this.editedItemProv = Object.assign({}, this.editedItem.prov_id)
      this.editedItem.prov_email = this.editedItemProv.prov_email
      this.editedItem.prov_email2 = this.editedItemProv.prov_email2
      this.editedItem.prov_direccion = this.editedItemProv.prov_direccion
      this.editedItem.prov_ciudad = this.editedItemProv.prov_ciudad
      */
      if (this.editedItem.prov_id.prov_id != undefined || this.editedItem.prov_id != undefined) {
        console.log('Proveedor valido !!!')
        this.dialogEditProv = true
        console.log('this.dialogEditProv', this.dialogEditProv)
      }
    },
    async cargarFactura() {
      this.dialogCargarFactura = false
      if (this.editedItem.osNumDoc && this.editedItem.osNumDoc > 0) {
        this.dialogCargarFactura = true // Abre el diálogo solo si osNumDoc es mayor que 0
      }
    },
    //Elimina una orden de compra
    /*deleteItem(item) {
      const index = this.ordenes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      //Confirma cerrar formulario
      if (confirm('Esta seguro que desea eliminar este registro?')) {
        this.BorrarRegistro()
        this.ordenes.splice(index, 1)
      }
    },*/
    deleteItem(item) {
      const index = this.ordenes.indexOf(item)
      const userConfirm =
        confirm('¿Está seguro que desea eliminar este registro?, Se perderan todos los datos') &&
        this.ordenes.splice(index, 1)
      if (!userConfirm) {
        return
      }
      for (let i = this.ordenesDet.length - 1; i >= 0; i--) {
        const det = this.ordenesDet[i]
        if (det.osNumDoc === item.osNumDoc && det.osDetPosicion) {
          this.BorrarOrDet(item.osNumDoc + '/' + det.osDetPosicion)
        }
      }
      this.BorrarRegistro(item.osNumDoc)
    },
    async BorrarRegistro(index) {
      this.overlay = true
      this.$v.$touch()
      var fecha = new Date()
      this.os_fecha_can = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      let body = {
        osNumDoc: index,
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
        //ACTUALIZA REGISTRO cancelado EN TABLA SEGUIMIENNTO
      let bodyEnv = {
        osNumDoc: index, //numero de documento
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
    },
    deleteItemDet(item) {
      const index = this.ordenesDet.indexOf(item)
      const userConfirm =
        confirm('¿Está seguro que desea eliminar este registro?') &&
        this.ordenesDet.splice(index, 1)
      if (!userConfirm) {
        return
      }
      this.BorrarOrDet(item.osNumDoc + '/' + item.osDetPosicion)
    },
    async BorrarOrDet(index) {
      this.overlay = true
      this.$v.$touch()
      let body = {
        osNumDoc: index,
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

    async Refreesca() {
      let jwt = await getValidToken(this)
      /// this.obtenerOrdenes(jwt,'')
      this.ObtenerGenerales()
      this.obtenerConceptos()
      this.ObtenerServicios()
      this.obtenerProveedores()
      await this.obtenerCuentas(jwt, 0, 0)
      this.obtenerEmpleadoSolicita()
      this.obtenerDirSolicita()
      this.obtenerDeptoSolicita('')
      this.obtenerDirDestino()
      this.obtenerDeptoDestino()
      this.obtenerTipoVehiculo()
      this.obtenerTipoMarca()
      this.obtenerTipoModelo()
      this.obtenerGeneroAdjudica()
      this.obtenerLugaresEntrega()
      this.obtenerTipoAdjudicacion()
      await this.obtenerEjercicios(jwt)

      //Detalle
      this.obtenerFamilias()
      this.obtenerUnidades()
      this.obtenerMarcas()
      this.obtenerTasaIvas()
      console.log('ejercicio', this.sp_iejercicio)
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerOrdenes(jwt, this.ejercicio)
      await this.obtenerOrdenesEnv(jwt, this.ejercicio)
      this.EjercicioValido()
    },
    //Preparar para nueva Captura de Orden de Compra
    nuevaCaptura() {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      var fecha = new Date()
      this.editedItem.osFecha = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.editedItem.osFechaLimEntrega = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.editedItem.os_fecha_cap = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.editedItem.osEstatus = 'CAP_OS'
      this.editedItem.osTipoDoc = 'SERVICIO'
      this.editedItem.osTipoOs = 'ADQUI'
      this.editedItem.osgenAdjudicacion = 'S'
      this.editedItem.osTipoAdjudicacion = 'AD'
      this.existeOrden = true
      this.ordenesDet = []
      this.EjercicioValido()
      // this.tabForm = true
      //this.tabPrincipal = false
    },

    //Obtiene los conceptos para la solicitud de pago
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
            })
          })
      }
    },
    async setfilterServicio(value) {
      // secuencia : 1
      let jwt = await getValidToken(this)
      let tipo = ''
      if (value.tipo_descripcion === 'Vehiculos') {
        tipo = 'tipser'
        this.isTipo = false
      } else {
        tipo = 'RENT'
        this.isTipo = true
        // Vacía el campo editedItem cuando se selecciona otro tipo_descripcion
        this.editedItem.vh_placas = ''
        this.editedItem.vh_modelo = ''
        this.editedItem.osVeh_id = ''
        this.editedItem.marca = ''
        this.editedItem.nombre_sol = ''
        this.editedItem.vh_anio = ''
      }
      // Actualiza la variable mostrarAnioVehiculo en función de tipo
      this.mostrarAnioVehiculo = tipo === 'tipser'
      let filtro =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=' +
        tipo +
        '&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      await this.ObtenerServicios(jwt, filtro)
    },
    async ObtenerServicios() {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=t.tipo_clave&tipo1=igual&valor1=RENT&logico2=or&campo2=t.tipo_clave&tipo2=igual&valor2=VEH&logico3=or&campo3=t.tipo_clave&tipo3=igual&valor3=MTOGRAL'
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.servicios = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            this.servicios = response.data
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
    //Obtiene Todas las Cuentas
    async obtenerCuentas(prov, tipo) {
      let jwt = await getValidToken(this)
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
    // async setfilterConcepto(value) {
    //   // secuencia : 1
    //   let jwt = await getValidToken(this)
    //   let tipo = ''
    //   if (value.tipo_descripcion === 'Presupuestal') {
    //     tipo = 'SOLP'
    //   } else {
    //     tipo = 'SOLNP'
    //   }
    //   let filtro =
    //     'filtro?campo1=t.clatip_id&tipo1=igual&valor1=' +
    //     tipo +
    //     '&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
    //   await this.obtenerConceptos(jwt, filtro)
    //   this.editedItem.sp_pago_nombre_de = ''

    //   this.isTipo = false
    //   this.isConcepto = true
    //   this.isProveedor = true
    // },
    //Obtiene las departamentos para Destino
    async obtenerDeptoDestino() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: null }
        this.$store
          .dispatch('consulta/fetchGetDepartamentos', payload)
          .then((response) => {
            this.deptoDestino = response.data
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
    //Obtiene las departamentos que solicitan
    async obtenerDeptoSolicita(direccion) {
      this.isLoading = true
      let jwt = await getValidToken(this)
      let params = null
      if (direccion != '') {
        params = `emp_direccion = '` + direccion + `'`
      }
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.$store
          .dispatch('consulta/fetchGetDepartamentos', payload)
          .then((response) => {
            this.deptoSolicita = response.data
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
    //Obtiene las direcciones que solicitan
    async obtenerDirDestino() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: null }
        this.$store
          .dispatch('consulta/fetchDireccion', payload)
          .then((response) => {
            this.dirDestino = response.data
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
    //Obtiene las Direcciones que solicitan
    async obtenerDirSolicita() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: null }
        this.$store
          .dispatch('consulta/fetchDireccion', payload)
          .then((response) => {
            this.dirSolicita = response.data
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
    //Obtiene Loe empleados que solicitan
    async obtenerEmpleadoSolicita() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: null }
        this.$store
          .dispatch('empleado/fetchEmpleado', payload)
          .then((response) => {
            this.empSolicita = response.data
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
    //Obtiene los Generos de Adjudicacion
    async obtenerGeneroAdjudica() {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=GENADJ&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'

      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            this.genAdjudicacion = response.data
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
    async obtenerTipoAdjudicacion() {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=ADJUDICA&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            this.tipoAdjudicacion = response.data
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
    //Obtiene Lugares de Emtrega para Ordenes de compra
    async obtenerLugaresEntrega() {
      this.isLoading = true
      let params = null
      params = "t.clatip_id = 'LUGENT'/t.tipo_orden"
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.lugaresEntrega = []
        await this.$store
          .dispatch('consulta/fetchGetTipos', payload)
          .then((response) => {
            this.lugaresEntrega = response.data
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
    //Obtiene los Proveedores
    async obtenerProveedores(tipo) {
      this.isLoading = true
      let jwt = await getValidToken(this)
      let param = tipo
      if (jwt != null) {
        let payload = { jwt: jwt, params: param }
        await this.$store
          .dispatch('consulta/fetchProvTipo', payload)
          .then((response) => {
            this.proveedores = response.data
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
    //Obtiene los tipos de vehiculos
    async obtenerTipoVehiculo() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: null }
        this.$store
          .dispatch('vehiculo/fetchVehiculos', payload)
          .then((response) => {
            this.tipoVehiculos = response.data
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
    async obtenerTipoMarca() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: null }
        this.$store
          .dispatch('vehiculo/fetchVehiculos', payload)
          .then((response) => {
            this.marcaCoches = response.data
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
    async obtenerTipoModelo() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: null }
        this.$store
          .dispatch('vehiculo/fetchVehiculos', payload)
          .then((response) => {
            this.modeloCoches = response.data
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
    //al cambiar direccion que solicita
    onChangeDirSolicita(value) {
      this.obtenerDeptoSolicita(value.emp_direccion)
    },
    async onChangeEjercicioCap(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      this.editedItem.sp_ejercicio = value.sp_ejercicio
    },
    async onChangeEjericioOrdEnv(value) {
      let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await this.obtenerOrdenesEnv(jwt, value.sp_ejercicio)
    },
    //cambi y filtra por ejercicio
    async onChangeEjercicio(value) {
      let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await this.obtenerOrdenes(jwt, value.sp_ejercicio)
    },
    async obtenerOrdenesEnv(jwt, ejercicio) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=osTipoDoc&tipo1=igual&valor1=SERVICIO&logico2=and&campo2=osEstatus&tipo2=igual&valor2=ENVPAG&logico3=and&campo3=sp_ejercicio&tipo3=igual&valor3=' +
        ejercicio
      if (jwt != null) {
        this.ordenesEnv = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchOrden', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ordenesEnv = response.data
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

    async validaExisteOrden(muestraMensaje = true) {
      let existe = false
      if (Number(this.editedItem.osNumDoc) > 0)
        existe = await this.verificarOrden(this.editedItem.osNumDoc)
      if (existe) {
        if (muestraMensaje) {
          this.$store.commit('ALERT', {
            color: 'error',
            text: 'Ya Existe el Documento: ' + this.editedItem.osNumDoc,
          })
        }
        this.existeOrden = true
        this.focusField('osNumDoc')
      } else {
        this.existeOrden = false
        this.focusField('osFecha')
      }
    },

    async verificarOrden(osNumDoc, osDetPosicion) {
      let resultado = false
      let jwt = await getValidToken(this)
      let param = null

      let payload = {}
      if (osDetPosicion != null && osDetPosicion > 0) {
        //verificar Detalle
        param =
          'filtro?campo1=osDetPosicion&tipo1=igual&valor1=' +
          osDetPosicion +
          '&logico2=and&campo2=osNumDoc&tipo2=igua&valor2=' +
          osNumDoc
        payload = { jwt: jwt, params: param }
        await this.$store
          .dispatch('ordencompra/fetchOrdenDet', payload)
          .then((response) => {
            if (response.data.length > 0) resultado = true
          })
          .catch((err) => {
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
            })
          })
      } else {
        //Verificar Cabecero
        param = osNumDoc
        payload = { jwt: jwt, params: param }
        await this.$store
          .dispatch('ordencompra/fetchOrden', payload)
          .then((response) => {
            if (response.data.length > 0) resultado = true
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

    //filtra las cuentas del proveedor
    async setfilterFamilias(value) {
      await this.obtenerProuctos(value.tipo_clave)
    },

    //filtra las cuentas del proveedor
    async setfilterCuentas(value) {
      //C H E C A R
      let jwt = await getValidToken(this)
      this.editedItem.prov_email = ''
      this.editedItem.prov_email2 = ''
      this.editedItem.prov_direccion = ''
      this.editedItem.prov_ciudad = ''
      this.editedItem.prov_RFC = ''

      this.prov_temp = value.prov_id
      if (value.cuecon_cuenta == undefined) {
        this.editedItem.sp_pago_nombre_de = value.prov_razon_social
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
          await this.obtenerCuentas(value.prov_id, this.tipo_temp)

          if (this.cuentas.length == 0) {
            await this.obtenerCuentas(jwt, this.prov_temp, 0)
          }
          this.DisabledPagoNombreDe = true
        }
      } else if (value.cuecon_cuenta != '') {
        await this.obtenerCuentas(jwt, this.prov_temp, this.tipo_temp)
        if (this.cuentas.length == 0) {
          await this.obtenerCuentas(jwt, this.prov_temp, 0)
        }
        this.editedItem.sp_pago_nombre_de = value.prov_razon_social
        this.DisabledPagoNombreDe = true
      }
      this.editedItem.cuecon_cuenta = this.cuentas[0].cuecon_cuenta
      if (this.editedItem.prov_email == '') this.editedItem.prov_email = value.prov_email
      if (this.editedItem.prov_email2 == '') this.editedItem.prov_email2 = value.prov_email2
      if (this.editedItem.prov_direccion == '')
        this.editedItem.prov_direccion = value.prov_direccion
      if (this.editedItem.prov_ciudad == '') this.editedItem.prov_ciudad = value.prov_ciudad
      if (this.editedItem.prov_RFC == '') {
        this.editedItem.prov_RFC = value.prov_RFC
      }
      if (value.prov_RFC === null) {
        this.snackbar = true
      }
      console.log('valiue', value.prov_RFC)
    },
    async setfilterModelo(value) {
      //asigna campos de vehiculo
      this.editedItem.vh_placas = value.veh_placas
      this.editedItem.vh_anio = value.veh_anio
      this.editedItem.marca = value.marca
      this.editedItem.nombre_sol = value.emp_nombre
      this.editedItem.vh_modelo = value.veh_modelo
      this.editedItem.osVeh_id = value.veh_id
      console.log('mode', value)
    },
    // al escoger direccion solicita
    async setfilterDirSolicita(value) {
      this.editedItem.osDirSolicita = value.emp_direccion
      this.obtenerDeptoSolicita(value.emp_direccion)
      this.editedItem.osDeptoSolicita = value.emp_departamento
      this.editedItem.osDirDestino = value.emp_direccion
      this.editedItem.osDeptoDestino = value.emp_departamento
    },
    // al escoger direccion solicita
    async setIngresaPartida(value) {
      if (this.editedItem.osPartidaGlobal == '') {
        this.editedItem.osPartidaGlobal = value.concom_partida_global
      }
      if (this.editedItem.osPartidaGenerica == '') {
        this.editedItem.osPartidaGenerica = value.concom_partida_especifica
      }
    },
    async setfilterProveedor(value) {
      let jwt = await getValidToken(this)
      this.tipo_temp = value.tipo_id
      this.clave_temp = value.tipo_clave
      await this.obtenerProveedores(value.tipo_id)
      await this.obtenerCuentas(jwt, this.editedItem.prov_id.prov_id, this.tipo_temp)
    },

    validandoCampos() {
      this.validaCampos = true
      if (
        this.editedItem.osNumDoc != '' &&
        this.$v.editedItem.prov_id.$model != '' &&
        this.$v.editedItem.osDirSolicita.$model != '' &&
        this.$v.editedItem.osDeptoSolicita.$model != '' &&
        this.$v.editedItem.osDirDestino.$model != '' &&
        this.$v.editedItem.osDeptoDestino.$model != '' &&
        this.$v.editedItem.osEmpSolicita.$model != '' &&
        this.$v.editedItem.osSolicitudServicio.$model != '' &&
        this.$v.editedItem.osgenAdjudicacion.$model != ''
      ) {
        this.validaCampos = false
      }
    },
    //D  E  T  A  L  L  E
    //Cancelar dialogo Detalle
    cancelDet(isSure) {
      console.log('cancelDet(isSure)')
      console.log(isSure, isSure)
      this.isSureDet = isSure
      if (this.isSureDet) {
        this.closeDet(false)
        this.changedDet = false
      }
    },
    //Verificar Cambios en el Dialog Detalle
    checkChangesDet() {
      console.log('checkChangesDet()')
      if (this.changedDet) {
        this.isSureDet = true
      } else {
        this.closeDet(false)
        this.changedDet = false
      }
    },
    // Cerrar el formulario del Dialogo Detalle
    async closeDet(checkbox) {
      if (checkbox == undefined) checkbox = false
      this.isSureDet = false
      this.checkboxDet = checkbox
      if (!this.checkboxDet) {
        this.dialogDet = false
        this.isEditingDet = false
      }
      await this.$nextTick(() => {
        if (this.editedItem.osNumDoc != undefined) {
          this.nuevaCapturaDet(this.dialogDet)
        }
      })
      this.$nextTick(() => {
        if (this.editedItem.veh_placas != undefined) {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }
      })
      this.$v.$reset()
    },
    //Calcular el detalle
    CalcularDetalle() {
      //CALCULOS
      if (
        !(
          Number(this.editedItemDet.osPorcDcto) == 0 &&
          Number(this.editedItemDet.osDetDescuento) == 0
        )
      ) {
        if (Number(this.editedItemDet.osPorcDcto) != 0) {
          this.editedItemDet.osDetDescuento =
            (Number(this.editedItemDet.osPorcDcto) / 100) *
            (Number(this.editedItemDet.osDetCantidad) * Number(this.editedItemDet.osDetPrecio))
        }
        if (Number(this.editedItemDet.osDetDescuento) != 0) {
          this.editedItemDet.osPorcDcto =
            (Number(this.editedItemDet.osDetDescuento) /
              (Number(this.editedItemDet.osDetCantidad) * Number(this.editedItemDet.osDetPrecio))) *
            100
        }
      }
      this.descuentoCalculado = this.editedItemDet.osDetDescuento
      this.editedItemDet.osDetSubtotal =
        Number(this.editedItemDet.osDetCantidad) * Number(this.editedItemDet.osDetPrecio) -
        Number(this.editedItemDet.osDetDescuento)

      let tasaIVA = 0
      if (this.editedItemDet.osDetTasaIVA) {
        tasaIVA = this.editedItemDet.osDetTasaIVA
      }
      if (this.editedItemDet.osDetTasaIVA.tipo_clave) {
        tasaIVA = this.editedItemDet.osDetTasaIVA.tipo_clave
      }

      this.subTotalCalculado = this.editedItemDet.osDetSubtotal
      this.editedItemDet.osDetIVA =
        (Number(tasaIVA) / 100) * Number(this.editedItemDet.osDetSubtotal)

      this.ivaCalculado = this.editedItemDet.osDetIVA
      this.editedItemDet.osDetTotal =
        Number(this.editedItemDet.osDetSubtotal) + Number(this.editedItemDet.osDetIVA)

      this.TotalCalculado = this.editedItemDet.osDetTotal
      this.formatoDetalle()
    },

    editItemDet(item) {
      this.isEditingDet = true
      this.editedIndexDet = this.ordenesDet.indexOf(item)
      this.editedItemDet = Object.assign({}, item)
      this.obtenerProuctos(this.editedItem.familiaComite)
      this.formatoDetalle()
      this.dialogDet = true

      Vue.nextTick().then(() => {
        document.getElementById('osDetCantidad').select()
        document.getElementById('osDetCantidad').focus()
      })
    },
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
    formatoDetalle() {
      //SubTotal
      this.editedItemDet.osDetSubtotal = this.formato(
        this.eFormatos.MONEDA_RIGHT,
        this.editedItemDet.osDetSubtotal
      )

      //Total
      this.editedItemDet.osDetTotal = this.formato(
        this.eFormatos.MONEDA_RIGHT,
        this.editedItemDet.osDetTotal
      )
    },
    async nuevaCapturaDetFin(valorDialog) {
      if (valorDialog == undefined) valorDialog = true
      this.editedItemDet = Object.assign({}, this.defaultItemDet)
      this.editedIndexDet = -1
      this.editedItemDet.osDetActivo = 1
      await this.obtenerUltimaPosicion(this.editedItem.osNumDoc)
      this.contPosiciones = Number(this.contPosiciones) + 1
      this.editedItemDet.osDetPosicion = this.contPosiciones
      this.isEditingDet = false

      this.editedItemDet.osDetTasaIVA = '16.00'
      console.log('editedItemDet', this.editedItemDet.osDetTasaIVA)
      this.editedItemDet.familia_id = 'FAMSERV'
      await this.obtenerProuctos(this.editedItemDet.familia_id) // Llamada a obtenerProductos con el valor 'FAMSERV'
      this.chkAllProd = false
      this.dialogDet = valorDialog
      this.formatoDetalle()
    },

    async nuevaCapturaDet(valorDialog) {
      await this.validaExisteOrden(false)
      if (!this.existeOrden) {
        this.validandoCampos()
        if (this.bandValidaCampos) {
          console.log('GRABAR SIN MENSJAES')
          this.nuevaCapturaDetFin(valorDialog)
        } else {
          this.tabs = 0
          this.focusField('osNumDoc')
        }
      } else {
        this.nuevaCapturaDetFin(valorDialog)
      }
    },
    async obtenerFamilias() {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=FAMSERV&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'

      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.familias = []
        this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            this.familias = response.data
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
    async obtenerTasaIvas() {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=IVAS&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'

      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            this.tasaIvas = response.data
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
    async obtenerMarcas() {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=MARCAPROD&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'

      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            this.marcas = response.data
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
    /* async obtenerOrdenesDet(osNumDoc) {
      this.isLoading = true
      let params = null
      params = osNumDoc
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordenServicio/fetchOrdenServDet', payload)
          .then((response) => {
            this.ordenesDet = response.data
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
    },*/
    async obtenerOrdenesDet(osNumDoc) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=osDetActivo&tipo1=igual&valor1=1&logico2=and&campo2=osNumDoc&tipo2=igual&valor2=' +
        osNumDoc
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.ordenesDet = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordenServicio/fetchOrdenServDet', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ordenesDet = response.data
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
    /*  async obtenerOrdenes(jwt, ejercicio) {
      this.isLoading = true
      let params = null
      if (filtro === '') {
        params =
          'filtro?campo1=osTipoDoc&tipo1=igual&valor1=SERVICIO&logico2=and&campo2=sp_ejercicio&tipo2=igual&valor2=' + ejercicio
      }
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordenServicio/fetchOrdenServ', payload)
          .then((response) => {
              this.ordenes = response.data
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
    },*/
    async obtenerOrdenes(jwt, ejercicio) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=osTipoDoc&tipo1=igual&valor1=SERVICIO&logico2=and&campo2=osEstatus&tipo2=igual&valor2=CAP_OS&logico3=and&campo3=sp_ejercicio&tipo3=igual&valor3=' +
        ejercicio
      if (jwt != null) {
        this.ordenes = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordenServicio/fetchOrdenServ', payload)
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
    async obtenerProuctos(familia) {
      this.isLoading = true
      let params = null
      let jwt = await getValidToken(this)
      if (familia != null) {
        if (familia != 'FAMTOD') {
          params = 'filtro?campo1=familia_id&tipo1=igual&valor1=' + familia
        }
      }
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.$store
          .dispatch('producto/fetchProducto', payload)
          .then((response) => {
            this.productos = response.data
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

    async obtenerUltimaPosicion(numdoc) {
      this.isLoading = true
      let params = numdoc
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchUltimaPosicion', payload)
          .then((response) => {
            this.contPosiciones = response.data[0].ultimaposicion
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
    async obtenerUnidades() {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=UNISERV&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            this.unidades = response.data
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
    //Grabar Detalle de Orden de compra
    async SaveDet() {
      this.overlay = true
      let jwt = await getValidToken(this)

      this.familiaAct = this.editedItemDet.familia_id.tipo_clave

      if (this.changedDet) {
        let producto = ''
        if (this.editedItemDet.prod_id.prod_id == null) {
          producto = this.editedItemDet.prod_id
        } else {
          producto = this.editedItemDet.prod_id.prod_id
        }
        let unidad = ''
        if (this.editedItemDet.unidad_id_det.tipo_clave == null) {
          unidad = this.editedItemDet.unidad_id_det
        } else {
          unidad = this.editedItemDet.unidad_id_det.tipo_clave
        }
        let marca = ''
        if (this.editedItemDet.marca_id.tipo_clave == null) {
          marca = this.editedItemDet.marca_id
        } else {
          marca = this.editedItemDet.marca_id.tipo_clave
        }

        let body = {}
        body = {
          osNumDoc: this.editedItem.osNumDoc,
          osDetPosicion: this.editedItemDet.osDetPosicion,
          prod_id: producto,
          osDescripcion: this.editedItemDet.osDescripcion,
          unidad_id: unidad,
          marca_id: marca,
          osDetCantidad: this.editedItemDet.osDetCantidad,
          osDetPrecio: this.editedItemDet.osDetPrecio,
          osPorcDcto: this.editedItemDet.osPorcDcto,
          osDetDescuento: this.editedItemDet.osDetDescuento,
          osDetSubtotal: this.subTotalCalculado,
          osDetTasaIVA: this.editedItemDet.osDetTasaIVA,
          osDetIVA: this.editedItemDet.osDetIVA,
          osDetTotal: this.TotalCalculado,
          osDetActivo: this.editedItemDet.osDetActivo,
        }

        let payload = {
          jwt: jwt,
          body: body,
        }
        if (this.editedIndexDet > -1) {
          //MODIFICAR
          body = {
            prod_id: producto,
            osDescripcion: this.editedItemDet.osDescripcion,
            unidad_id: unidad,
            marca_id: marca,
            osDetCantidad: this.editedItemDet.osDetCantidad,
            osDetPrecio: this.editedItemDet.osDetPrecio,
            osPorcDcto: this.editedItemDet.osPorcDcto,
            osDetDescuento: this.editedItemDet.osDetDescuento,
            osDetSubtotal: this.subTotalCalculado,
            osDetTasaIVA: this.editedItemDet.osDetTasaIVA,
            osDetIVA: this.editedItemDet.osDetIVA,
            osDetTotal: this.TotalCalculado,
            osDetActivo: this.editedItemDet.osDetActivo,
          }

          payload = {
            jwt: jwt,
            body: body,
          }
          payload.id = this.editedItem.osNumDoc
          payload.posicion = this.editedItemDet.osDetPosicion
          await this.$store
            .dispatch('ordencompra/editOrdenDet', payload)
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
        } else {
          //NUEVO
          await this.$store
            .dispatch('ordencompra/addCreaDet', payload)
            .then(() => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se Inserto con éxito',
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
        }

        //Actualiza Productos
        let prov = 0
        if (this.editedItem.prov_id.prov_id == null) {
          prov = this.editedItem.prov_id
        } else {
          prov = this.editedItem.prov_id.prov_id
        }
        body = {
          prod_ultMarca: marca,
          prod_ultProv: prov,
          prod_ultPrecio: this.editedItemDet.osDetPrecio,
        }
        payload = {
          jwt: jwt,
          body: body,
        }
        payload.id = producto
        this.$store
          .dispatch('producto/editUltimoProducto', payload)
          .then(() => {
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'Producto actualizado con Exito',
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

        await this.obtenerOrdenesDet(this.editedItem.osNumDoc)
        this.closeDet(this.checkboxDet)
        this.changedDet = false
      }
    },
    async setfilterProductos(value) {
      console.log(value)
      if (!this.isEditingDet) {
        this.editedItemDet.unidad_id_det = value.unidad_id
        if (value.prod_ultMarca != null) {
          this.editedItemDet.marca_id = value.prod_ultMarca
        }
      }
    },
    onChangeAllProd(value) {
      if (value) {
        this.obtenerProuctos('FAMTOD')
      } else {
        this.obtenerProuctos(this.editedItem.familiaComite)
      }
    },

    //G E N E R A L E S
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
    focusField(id) {
      document.getElementById(id).select()
      document.getElementById(id).focus()
    },

    NextField(id) {
      if (id == 'submit') {
        console.log('para grabar ???')
      } else {
        document.getElementById(id).select()
        document.getElementById(id).focus()
      }
      //}
    },
    sumaCampo(key) {
      let suma = 0
      for (let x in this.ordenesDet) {
        if (key == 'osDetCantidad') {
          suma += Number(this.ordenesDet[x].osDetCantidad)
        } else if (key == 'osDetDescuento') {
          suma += Number(this.ordenesDet[x].osDetDescuento)
        } else if (key == 'osDetIVA') {
          suma += Number(this.ordenesDet[x].osDetIVA)
        } else if (key == 'osDetTotal') {
          suma += Number(this.ordenesDet[x].osDetTotal)
        } else if (key == 'osDetSubtotal') {
          suma +=
            Number(this.ordenesDet[x].osDetCantidad) * Number(this.ordenesDet[x].osDetPrecio) -
            Number(this.ordenesDet[x].osDetDescuento)
        }
      }
      return suma
    },
    clean() {
      this.editedItemDet.osDetCantidad = 0
      this.editedItemDet.osDetPrecio = 0
      this.editedItemDet.osPorcDcto = 0
      this.editedItemDet.osDetDescuento = 0
      this.editedItemDet.osDetSubtotal = 0
      //this.editedItemDet.osDetTasaIVA = 0
      this.editedItemDet.osDetTotal = 0
    },
    async printItem(item) {
      this.editedItem = Object.assign({}, item)
      console.log('this.editedItem.osNumDoc', this.editedItem.osNumDoc)
      imprimeFormatoOrdenServ(this.editedItem.osNumDoc, this)
    },
    async ObtenerGenerales() {
      this.isLoading = true
      let params = null
      let jwt = await getValidToken(this)
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
              this.idEmpleadoSolFirma = this.generales[0].id_emp_sol_sicas
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
  },
}
</script>
<style lang="scss" scoped>
.v-text {
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}

.v-text-Right {
  //text-align: right;
  direction: rtl;
}

.totales {
  font-size: 20px;
}

.total {
  text-align: end;
}

.centrado {
  text-align: center;
}
</style>
