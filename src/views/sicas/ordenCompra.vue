<template>
  <v-tabs fixed-tabs background-color="indigo" dark>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab key="tab0"> <v-icon left> mdi-file-document-edit-outline </v-icon>Capturar Orden </v-tab>
    <v-tab key="tab1"> <v-icon left> mdi-file-document-edit-outline </v-icon>ENVIADO A PAGO </v-tab>
    <!--capturar orden-->
    <v-tab-item key="tab0">
      <v-container id="ordenes" tag="section">
        <base-material-card
          class="px-5 py-3"
          color="primary"
          icon="mdi-cart-outline"
          inline
          :title="$t('orders')"
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
                  @click.stop="dialogLista = true"
                  >Lista de precios</v-btn
                >
                <v-btn
                  class="ma-2"
                  color="primary"
                  elevation="2"
                  small
                  @click="nuevaCaptura"
                  @click.stop="dialogDetalle = true"
                  >Nueva órden de compra</v-btn
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
                  hint="Seleciona Ejercicio"
                  @change="onChangeEjercicioPrinc"
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
          <!--dialogo nuevo-->
          <v-dialog v-model="dialogDetalle" persistent max-width="1500px">
            <el-card class="text item">
              <v-container>
                <!-- Overlay para retroalimentar al usuario -->
                <v-overlay :value="overlay">
                  <v-progress-circular
                    color="success"
                    indeterminate
                    :size="50"
                  ></v-progress-circular>
                </v-overlay>
                <span>Órden de compra: {{ editedItem.osNumDoc }} </span>
                <el-tabs
                  type="card"
                  v-model="activeTab"
                  @tab-click="handleTabClickPrincipal"
                  :tab-position="tabPosition"
                >
                  <!--Orden-->
                  <el-tab-pane label="Orden" name="primero">
                    <el-card class="text item">
                      <div slot="header" class="clearfix">
                        <span>{{ formTitle }}</span>
                      </div>
                      <!--<v-card-text>-->
                      <!--<v-container>-->
                      <div style="display: flex; justify-content: center">
                        <v-col cols="10">
                          <el-card shadow="never">
                            <template>
                              <div>
                                <el-row :gutter="20">
                                  <el-col :span="6">
                                    <div>
                                      <el-statistic title="Cantidad de productos">
                                        <template slot="prefix">
                                          <i
                                            class="el-icon-shopping-cart-full"
                                            style="color: blue"
                                          ></i>
                                        </template>
                                        <template slot="formatter">
                                          {{
                                            formato(eFormatos.IMPORTE, sumaCampo('osDetCantidad'))
                                          }}</template
                                        >
                                      </el-statistic>
                                    </div>
                                  </el-col>
                                  <el-col :span="6">
                                    <div>
                                      <el-statistic title="Subtotal">
                                        <template slot="formatter">
                                          {{
                                            formato(eFormatos.MONEDA, sumaCampo('osDetSubtotal'))
                                          }}</template
                                        >

                                        <template slot="prefix">
                                          <i class="el-icon-money" style="color: green"></i>
                                        </template>
                                      </el-statistic>
                                    </div>
                                  </el-col>
                                  <el-col :span="6">
                                    <div>
                                      <el-statistic title="IVA">
                                        <template slot="prefix">
                                          <i class="el-icon-money" style="color: green"></i>
                                        </template>
                                        <template slot="formatter">
                                          {{ formato(eFormatos.MONEDA, sumaCampo('osDetIVA')) }}
                                        </template>
                                      </el-statistic>
                                    </div>
                                  </el-col>
                                  <el-col :span="6">
                                    <div>
                                      <el-statistic title="Total">
                                        <template slot="prefix">
                                          <i class="el-icon-money" style="color: green"></i>
                                        </template>
                                        <template slot="formatter">
                                          {{ formato(eFormatos.MONEDA, sumaCampo('osDetTotal')) }}
                                        </template>
                                      </el-statistic>
                                    </div>
                                  </el-col>
                                </el-row>
                              </div>
                            </template>
                          </el-card>
                        </v-col>
                      </div>
                      <div style="display: flex; justify-content: center">
                        <!--datos orden-->
                        <v-col cols="10">
                          <el-card shadow="never">
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
                              <v-col cols="1" class="v-text">
                                <v-text-field
                                  class="DocumentoId"
                                  id="osNumDoc"
                                  autofocus
                                  dense
                                  :disabled="!existeOrden"
                                  label="Nº Orden de Compra*"
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
                              <!-- Tipo Adjudicacion -->
                              <v-col cols="2" class="v-text">
                                <v-select
                                  v-model="$v.editedItem.osTipoAdjudicacion.$model"
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
                              </v-col>
                              <!-- Genero Adjudicacion -->
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
                              <v-col cols="6" class="v-text">
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
                              <!--Prov RFC -->
                              <v-col cols="2" class="v-text">
                                <v-text-field
                                  dense
                                  disabled
                                  label="Proveedor RFC"
                                  maxlength="100"
                                  :error-messages="provRFCErrors"
                                  v-model="$v.editedItem.prov_RFC.$model"
                                  @blur="$v.editedItem.prov_RFC.$touch()"
                                  @input="$v.editedItem.prov_RFC.$reset()"
                                ></v-text-field>
                              </v-col>
                              <!-- Cuenta Contable -->
                              <v-col cols="4" class="v-text">
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
                              <!-- Correo Electronico Proveedor -->
                              <!--  <v-col cols="6" class="v-text">
                                  <!- Direccion Proveedor -->
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
                              <v-col cols="5" class="v-text">
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
                              <v-col cols="4" class="v-text">
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
                              <v-col cols="6" class="v-text">
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
                              <!-- Dias de Credito -->
                              <v-col cols="2" class="v-text">
                                <v-text-field
                                  dense
                                  :disabled="existeOrden"
                                  type="number"
                                  required
                                  :error-messages="diasCreditoErrors"
                                  return-object
                                  label="Dias de Credito"
                                  v-model="$v.editedItem.osDiasCredito.$model"
                                  @blur="$v.editedItem.osDiasCredito.$touch()"
                                  @input="$v.editedItem.osDiasCredito.$reset()"
                                ></v-text-field>
                              </v-col>
                              <!-- Descripcion -->
                              <!-- <v-col cols="12" class="v-text">
                                          <v-textarea
                                            v-model="editedItem.osDescripcion"
                                            label="Descripción"
                                            :disabled="existeOrden"
                                            counter="250"
                                            dense
                                            no-resize
                                            rows="1"
                                            @input="
                                              $v.editedItem.osDescripcion.$reset(), (changed = true)
                                            "
                                            @blur="$v.editedItem.osDescripcion.$touch()"
                                          ></v-textarea>
                                        </v-col>-->
                              <!-- Campo Observacion -->
                              <v-col cols="10" class="v-text">
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
                              <v-col cols="4" class="v-text">
                                <v-select
                                  v-model="$v.editedItem.osDirDestino.$model"
                                  :items="dirDestino"
                                  :menu-props="{ top: true, offsetY: true }"
                                  label="Direccion Destino*"
                                  item-text="emp_direccion"
                                  item-value="emp_direccion"
                                  persistent-hint
                                  dense
                                  :disabled="existeOrden"
                                  :error-messages="osDirDestinoErrors"
                                  return-object
                                  @blur="$v.editedItem.osDirDestino.$touch()"
                                >
                                </v-select>
                              </v-col>
                              <!-- Departamento Destino -->
                              <v-col cols="4" class="v-text">
                                <v-select
                                  v-model="$v.editedItem.osDeptoDestino.$model"
                                  :items="deptoDestino"
                                  :menu-props="{ top: true, offsetY: true }"
                                  label="Departamento Destino*"
                                  item-text="emp_departamento"
                                  item-value="emp_departamento"
                                  persistent-hint
                                  dense
                                  :disabled="existeOrden"
                                  :error-messages="osdeptoDestinoErrors"
                                  return-object
                                  @blur="$v.editedItem.osDeptoDestino.$touch()"
                                >
                                </v-select>
                              </v-col>
                            </v-row>
                          </el-card>
                        </v-col>
                        <!--resumen-->
                        <!-- <v-col cols="3">
                              <el-card shadow="never">
                                <template>
                                  <v-simple-table class="resumen-table">
                                    <template v-slot:default>
                                      <tbody>
                                        <tr>
                                          <th class="text-left">
                                            <h1>Resumen de la orden:</h1>
                                          </th>
                                          <th class="text-left"></th>
                                        </tr>
                                        <tr>
                                          <th class="text-left">
                                            <h2>Cantidad:</h2>
                                          </th>
                                          <th class="text-left">
                                            <h2>
                                              {{
                                                formato(eFormatos.IMPORTE, sumaCampo('osDetCantidad'))
                                              }}
                                            </h2>
                                          </th>
                                        </tr>
    
                                        <tr>
                                          <th class="text-left">
                                            <h2>Descuento:</h2>
                                          </th>
                                          <th class="text-left">
                                            <h2>
                                              {{
                                                formato(eFormatos.MONEDA, sumaCampo('osDetDescuento'))
                                              }}
                                            </h2>
                                          </th>
                                        </tr>
    
                                        <tr>
                                          <th class="text-left">
                                            <h2>Subtotal:</h2>
                                          </th>
                                          <th class="text-left">
                                            <h2>
                                              {{
                                                formato(eFormatos.MONEDA, sumaCampo('osDetSubtotal'))
                                              }}
                                            </h2>
                                          </th>
                                        </tr>
    
                                        <tr>
                                          <th class="text-left">
                                            <h2>IVA:</h2>
                                          </th>
                                          <th class="text-left">
                                            <h2>
                                              {{ formato(eFormatos.MONEDA, sumaCampo('osDetIVA')) }}
                                            </h2>
                                          </th>
                                        </tr>
    
                                        <tr>
                                          <th class="text-left">
                                            <h1>Total:</h1>
                                          </th>
                                          <th class="text-left">
                                            <h2>
                                              {{ formato(eFormatos.MONEDA, sumaCampo('osDetTotal')) }}
                                            </h2>
                                          </th>
                                        </tr>
                                      </tbody>
                                    </template>
                                  </v-simple-table>
                                </template>
                              </el-card>
                            </v-col>--->
                      </div>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-checkbox
                          v-model="checkboxDet"
                          label="Crear otro"
                          :disabled="isEditingDet"
                        ></v-checkbox>
                        <v-btn color="red darken-1" text @click="checkChangesDet">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text @click="save" :disabled="validando"
                          >Guardar</v-btn
                        >
                      </v-card-actions>
                      <!--tabla-->
                      <div style="display: flex; justify-content: center"></div>
                      <!--</v-container>-->
                      <!--</v-card-text>-->
                    </el-card>
                  </el-tab-pane>
                  <!--Detalle de orden-->
                  <el-tab-pane v-if="isEditing" label="Detalle de orden" name="segundo">
                    <!--tabla detalle-->

                    <el-card type="border-card">
                      <template>
                        <el-tabs v-model="activeNameDet" @tab-click="handleTabClick">
                          <el-tab-pane label="Detalle de la orden" name="firstDet">
                            <v-col cols="12">
                              <el-card shadow="never">
                                <v-spacer></v-spacer>
                                <div slot="header" class="clearfix">
                                  <span
                                    >Productos registrados en la orden:
                                    {{ editedItem.osNumDoc }}</span
                                  >
                                </div>

                                <el-progress
                                  v-show="barraProceso"
                                  :percentage="percentage"
                                ></el-progress>
                                <div style="display: flex; justify-content: center">
                                  <el-card shadow="never">
                                    <div style="margin-top: 20px">
                                      <el-button
                                        :disabled="seleccionDet.length == 0"
                                        type="primary"
                                        size="mini"
                                        plain
                                        @click="guarDaCambiosOrdenDet()"
                                        >Guardar Cambios</el-button
                                      >
                                      <el-button
                                        :disabled="seleccionDet.length == 0"
                                        type="danger"
                                        size="mini"
                                        plain
                                        @click="eliminaDatosTabla()"
                                        >Eliminar</el-button
                                      >
                                    </div>
                                    <el-divider></el-divider>
                                    <el-table
                                      v-loading="loading"
                                      element-loading-text="Cargando... Espere por favor"
                                      element-loading-spinner="el-icon-loading"
                                      element-loading-background="rgba(255, 255, 255, 0.9)"
                                      size="small"
                                      height="400"
                                      ref="multipleTableDetalleOrden"
                                      style="width: 100%"
                                      @selection-change="handleSelectionChangeDetalleOrden"
                                      :data="filteredOrdenesDet"
                                      highlight-current-row
                                      border
                                      :summary-method="getSummaries"
                                      show-summary
                                      :row-key="(row) => row.id"
                                      @current-change="handleCurrentChangeDetalleOrden"
                                      @row-click="handleRowDblClickDetalleOrden"
                                    >
                                      <!-- Slot para mostrar cuando la tabla está vacía -->
                                      <template v-slot:empty>
                                        <div style="text-align: center; padding: 20px">
                                          <span>No hay datos disponibles</span>
                                        </div>
                                      </template>
                                      <el-table-column type="selection" width="55px">
                                      </el-table-column>
                                      <el-table-column prop="osDetPosicion" label="#" width="45px">
                                      </el-table-column>
                                      <el-table-column
                                        prop="prod_descripcion"
                                        label="Descripcion"
                                        width="250px"
                                        sortable
                                      ></el-table-column>
                                      <el-table-column
                                        prop="unidad_id_det_desc"
                                        label="Unidad"
                                        width="95px"
                                      ></el-table-column>
                                      <el-table-column
                                        prop="osDetCantidad"
                                        @change="llamaCambiosCalculo"
                                        label="Cantidad"
                                        width="95px"
                                        sortable
                                      >
                                        <editable-cell
                                          slot-scope="{ row }"
                                          :show-input="row.editable"
                                          v-model="row.osDetCantidad"
                                          placeholder="Cantidad"
                                          @input="editaCelda"
                                          @change="llamaCambiosCalculo(row)"
                                        >
                                          <span slot="content">{{ row.osDetCantidad }}</span>
                                        </editable-cell>
                                      </el-table-column>
                                      <el-table-column
                                        @change="llamaCambiosCalculo"
                                        prop="osDetPrecio"
                                        label="Precio"
                                        width="95px"
                                        sortable
                                        :sort-method="sortCantidad"
                                      >
                                        <editable-cell
                                          slot-scope="{ row }"
                                          :show-input="row.editable"
                                          v-model="row.osDetPrecio"
                                          @change="llamaCambiosCalculo(row)"
                                          placeholder="Precio"
                                        >
                                          <span slot="content">
                                            <span slot="content">{{
                                              formato(eFormatos.MONEDA, row.osDetPrecio)
                                            }}</span>
                                          </span>
                                        </editable-cell>
                                      </el-table-column>
                                      <!--<el-table-column prop="osDetDescuento" label="Descuento" width="95px">
                                               </el-table-column>-->
                                      <el-table-column
                                        prop="osDetSubtotal"
                                        label="Subtotal"
                                        width="95px"
                                        :disabled="true"
                                      >
                                        <template slot-scope="{ row }">
                                          <span>{{
                                            formato(eFormatos.MONEDA, row.osDetSubtotal)
                                          }}</span>
                                          <!-- Formatear aquí -->
                                        </template>
                                      </el-table-column>

                                      <el-table-column prop="osDetIVA" label="IVA" width="95px">
                                        <template slot-scope="{ row }">
                                          <span>{{ formato(eFormatos.MONEDA, row.osDetIVA) }}</span>
                                          <!-- Formatear aquí -->
                                        </template>
                                      </el-table-column>
                                      <el-table-column prop="osDetTotal" label="Total" width="95px">
                                        <editable-cell
                                          slot-scope="{ row }"
                                          :show-input="row.editable"
                                          v-model="row.osDetTotal"
                                          placeholder="Total"
                                        >
                                          <span slot="content">{{
                                            formato(eFormatos.MONEDA, row.osDetTotal)
                                          }}</span>
                                        </editable-cell>
                                      </el-table-column>

                                      <el-table-column width="200px">
                                        <template slot="header">
                                          <!-- Campo de entrada para filtrar -->
                                          <el-input
                                            v-model="filter"
                                            size="mini"
                                            placeholder="Buscar..."
                                          />
                                        </template>
                                        <!--<template slot-scope="scope">
                                              <el-button
                                                size="mini"
                                                :disabled="desactivaBoton"
                                                @click="recibeItemDet(scope.row)"
                                                >Editar</el-button
                                              >
                                              <el-button
                                                size="mini"
                                                type="danger"
                                                @click="deleteItemDet(scope.row)"
                                                >Eliminar</el-button
                                              >
                                            </template>-->
                                      </el-table-column>
                                    </el-table>
                                  </el-card>
                                </div>
                              </el-card>
                            </v-col></el-tab-pane
                          >

                          <el-tab-pane label="Listado de proveedor" name="secondDet">
                            <!--PRODUCTO DESING-->

                            <v-col cols="12">
                              <el-card shadow="never">
                                <v-spacer></v-spacer>
                                <div slot="header" class="clearfix">
                                  <span>Productos Disponibles</span>
                                </div>

                                <el-progress
                                  v-show="barraProceso"
                                  :percentage="percentage"
                                ></el-progress>

                                <div style="display: flex; justify-content: center">
                                  <!--TABLA DE LISTA DE PRECIO CUANDO EL PROVEEDOR CUENTA CON UNA-->
                                  <el-card shadow="never" v-show="showTableList">
                                    <div style="margin-top: 20px">
                                      <v-row>
                                        <v-col cols="2" class="v-text">
                                          <el-button
                                            size="mini"
                                            plain
                                            type="primary"
                                            @click="agregarProductoOrdenDiv()"
                                            >Agregar Seleccion detalle</el-button
                                          >
                                        </v-col>
                                      </v-row>
                                    </div>
                                    <el-divider></el-divider>

                                    <el-table
                                      v-loading="loading"
                                      element-loading-text="Cargando... Espere por favor"
                                      element-loading-spinner="el-icon-loading"
                                      element-loading-background="rgba(255, 255, 255, 0.9)"
                                      ref="multipleTableProductoListaEnDetalle"
                                      size="small"
                                      :data="filteredListadoDet"
                                      highlight-current-row
                                      border
                                      :summary-method="getSummariesServ"
                                      show-summary
                                      height="400"
                                      style="width: 100%"
                                      :row-key="(row) => row.id"
                                      @selection-change="handleSelectionChangeListProv"
                                      @current-change="handleCurrentChangeListProv"
                                      @row-click="handleRowDblClickListProv"
                                    >
                                      <!-- Slot para mostrar cuando la tabla está vacía -->
                                      <template v-slot:empty>
                                        <div style="text-align: center; padding: 20px">
                                          <span>No hay datos disponibles</span>
                                        </div>
                                      </template>
                                      <el-table-column type="selection" width="60">
                                      </el-table-column>
                                      <el-table-column
                                        prop="nombre_producto"
                                        label="Descripcion"
                                        width="300px"
                                        sortable
                                      ></el-table-column>
                                      <!--   <el-table-column
                                             prop="unidad_id"
                                             label="Unidad"
                                             width="95px"
                                           ></el-table-column>-->
                                      <el-table-column
                                        prop="DetCantidad"
                                        label="Cantidad"
                                        width="95px"
                                        sortable
                                      >
                                        <editable-cell
                                          slot-scope="{ row }"
                                          :show-input="row.editable"
                                          v-model="row.DetCantidad"
                                          placeholder="Cantidad"
                                          @change="calculaTotal(row)"
                                        >
                                          <span slot="content">{{ row.DetCantidad || 0 }}</span>
                                        </editable-cell>
                                      </el-table-column>
                                      <el-table-column
                                        @change="guardaCambiosPestañasDetLista;"
                                        prop="precio"
                                        label="Precio"
                                        width="95px"
                                        sortable
                                      >
                                        <editable-cell
                                          slot-scope="{ row }"
                                          :show-input="row.editable"
                                          v-model="row.precio"
                                          @change="calculaTotal(row)"
                                          placeholder="Precio"
                                        >
                                          <span slot="content">
                                            <span slot="content">{{
                                              formato(eFormatos.MONEDA, row.precio || 0)
                                            }}</span>
                                          </span>
                                        </editable-cell>
                                      </el-table-column>
                                      <!-- <el-table-column prop="DetDescuento" label="Descuento" width="95px"
                                               >{{ 0 }}
                                             </el-table-column>-->
                                      <el-table-column
                                        prop="DetSubtotal"
                                        label="Subtotal"
                                        width="95px"
                                      >
                                        <template slot-scope="{ row }">
                                          <span>{{
                                            formato(eFormatos.MONEDA, row.DetSubtotal || 0)
                                          }}</span>
                                        </template>
                                      </el-table-column>

                                      <el-table-column prop="DetIVA" label="IVA" width="95px">
                                        <template slot-scope="{ row }">
                                          {{ formato(eFormatos.MONEDA, row.DetIVA || 0) }}
                                        </template></el-table-column
                                      >
                                      <el-table-column prop="total" label="Total" width="95px">
                                        <template slot-scope="{ row }">
                                          {{ formato(eFormatos.MONEDA, row.total || 0) }}
                                        </template>
                                      </el-table-column>
                                      <el-table-column width="260">
                                        <template slot="header">
                                          <el-input
                                            v-model="filterListadoDet"
                                            size="mini"
                                            placeholder="Buscar..."
                                          />
                                        </template>
                                        <!--<template slot-scope="scope">
                                            <el-button size="mini" @click="recibeItemDet(scope.row)"
                                                >Editar</el-button
                                              >
                                              <el-button
                                                size="mini"
                                                type="danger"
                                                @click="deleteItemDet(scope.row)"
                                                >Eliminar</el-button
                                              >
                                            </template>-->
                                      </el-table-column>
                                    </el-table>
                                  </el-card>
                                </div>
                              </el-card>
                            </v-col>
                          </el-tab-pane>
                          <el-tab-pane label="Todos los productos" name="treeDet">
                            <v-col cols="12">
                              <el-card shadow="never">
                                <v-spacer></v-spacer>
                                <div slot="header" class="clearfix">
                                  <v-row>
                                    <v-col cols="10">
                                      <span>Productos Disponibles</span>
                                    </v-col>
                                    <v-col>
                                      <el-button type="primary" @click="crearProducto"
                                        >Crear Producto</el-button
                                      >
                                    </v-col>
                                  </v-row>
                                </div>
                                <el-progress
                                  v-show="barraProceso"
                                  :percentage="percentage"
                                ></el-progress>

                                <div style="display: flex; justify-content: center">
                                  <!---TODOS LOS PRODUCTOS CUANDO NO TIENE LISTA EL PROVEEDOR-->
                                  <!--<el-card shadow="never" v-show="showTablePro">-->
                                  <el-card shadow="never">
                                    <div style="margin-top: 20px">
                                      <v-row>
                                        <v-col cols="2" class="v-text">
                                          <el-button
                                            size="mini"
                                            plain
                                            type="primary"
                                            @click="agregarProductoOrdenDivTodos()"
                                            :disabled="multipleSelectionProd.length == 0"
                                            >Agregar Seleccion detalle</el-button
                                          >
                                        </v-col>

                                        <v-col cols="2" class="v-text">
                                          <v-autocomplete
                                            class="d-flex"
                                            autofocus
                                            v-model="editedItemDet.familia_id"
                                            :items="familias"
                                            :menu-props="{ top: true, offsetY: true }"
                                            label="Seleciona Familia*"
                                            item-text="tipo_descripcion"
                                            item-value="tipo_clave"
                                            persistent-hint
                                            dense
                                            return-object
                                            @change="setfilterFamilias"
                                            @input="changedDet = true"
                                            @blur="$v.editedItemDet.familia_id.$touch()"
                                          >
                                          </v-autocomplete>
                                        </v-col>
                                      </v-row>
                                    </div>
                                    <el-divider></el-divider>

                                    <!--tabla de todos productos en ordene detalle-->
                                    <el-table
                                      v-loading="loading"
                                      element-loading-text="Cargando... Espere por favor"
                                      element-loading-spinner="el-icon-loading"
                                      element-loading-background="rgba(255, 255, 255, 0.9)"
                                      ref="ProductoTodsDetalle"
                                      size="small"
                                      :summary-method="getSummariesTodos"
                                      show-summary
                                      :data="filteredProductos"
                                      highlight-current-row
                                      border
                                      height="400"
                                      style="width: 100%"
                                      @selection-change="ChangeProdTodosEnDet"
                                      :row-key="(row) => row.id"
                                      @current-change="CurrentChangeProdTodosEnDet"
                                      @row-click="RowDblClickProdTodosEnDet"
                                    >
                                      <!-- Slot para mostrar cuando la tabla está vacía -->
                                      <template v-slot:empty>
                                        <div style="text-align: center; padding: 20px">
                                          <span>No hay datos disponibles</span>
                                        </div>
                                      </template>
                                      <el-table-column type="selection" width="60">
                                      </el-table-column>
                                      <el-table-column
                                        prop="prod_descripcion"
                                        label="Descripcion"
                                        width="300px"
                                        sortable
                                      ></el-table-column>
                                      <el-table-column
                                        prop="cantidad"
                                        label="Cantidad"
                                        width="95px"
                                        sortable
                                      >
                                        <editable-cell
                                          slot-scope="{ row }"
                                          :show-input="row.editable"
                                          v-model="row.cantidad"
                                          placeholder="Cantidad"
                                          @change="calculaTotalTodos(row)"
                                        >
                                          <span slot="content">{{ row.cantidad || 0 }}</span>
                                        </editable-cell>
                                      </el-table-column>
                                      <el-table-column
                                        @change="guardarCambios"
                                        prop="prod_ultPrecio"
                                        label="Precio"
                                        width="95px"
                                        sortable
                                      >
                                        <editable-cell
                                          slot-scope="{ row }"
                                          :show-input="row.editable"
                                          v-model="row.prod_ultPrecio"
                                          @change="calculaTotalTodos(row)"
                                          placeholder="Precio"
                                        >
                                          <span slot="content">
                                            <span slot="content">{{
                                              formato(eFormatos.MONEDA, row.prod_ultPrecio || 0)
                                            }}</span>
                                          </span>
                                        </editable-cell>
                                      </el-table-column>
                                      <!-- <el-table-column prop="DetDescuento" label="Descuento" width="95px"
                                               >{{ 0 }}
                                             </el-table-column>-->
                                      <el-table-column
                                        prop="DetSubtotal"
                                        label="Subtotal"
                                        width="95px"
                                      >
                                        <template slot-scope="{ row }">
                                          <span>{{
                                            formato(eFormatos.MONEDA, row.DetSubtotal || 0)
                                          }}</span>
                                        </template>
                                      </el-table-column>

                                      <el-table-column prop="DetIVA" label="IVA" width="95px">
                                        <template slot-scope="{ row }">
                                          {{ formato(eFormatos.MONEDA, row.DetIVA || 0) }}
                                        </template></el-table-column
                                      >
                                      <el-table-column prop="total" label="Total" width="95px">
                                        <template slot-scope="{ row }">
                                          {{ formato(eFormatos.MONEDA, row.total || 0) }}
                                        </template>
                                      </el-table-column>
                                      <el-table-column width="260">
                                        <template slot="header">
                                          <el-input
                                            v-model="filterProductos"
                                            size="mini"
                                            placeholder="Buscar..."
                                          />
                                        </template>
                                        <!--<template slot-scope="scope">
                                            <el-button size="mini" @click="recibeItemDet(scope.row)"
                                                >Editar</el-button
                                              >
                                              <el-button
                                                size="mini"
                                                type="danger"
                                                @click="deleteItemDet(scope.row)"
                                                >Eliminar</el-button
                                              >
                                            </template>-->
                                      </el-table-column>
                                    </el-table>
                                  </el-card>
                                </div>
                              </el-card>
                            </v-col>
                          </el-tab-pane>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red darken-1" text @click="checkChangesDet">Salír</v-btn>
                            <!--<v-btn color="blue darken-1" text @click="save" :disabled="validando"
                                    >Guardar Cambios</v-btn
                                  >-->
                          </v-card-actions>
                        </el-tabs>
                      </template>
                      <v-row> </v-row>
                    </el-card>
                  </el-tab-pane>
                  <!--Lista de precios-->
                  <el-tab-pane label="Lista de precios" name="tercero">
                    <el-card>
                      <div slot="header" class="clearfix">
                        <span>Lista de precios</span>
                      </div>
                      <!--cabecero-->
                      <div style="display: flex; justify-content: center">
                        <v-col cols="9">
                          <el-card v-show="muestraPanelList" shadow="never">
                            <div slot="header" class="clearfix">
                              <v-row>
                                <v-col cols="10"><span>Listado por proveedor</span></v-col>
                                <v-col
                                  ><el-button @click="crearLista" type="primary"
                                    >Crear Lista</el-button
                                  ></v-col
                                >
                              </v-row>
                            </div>
                            <!-- Proveedor -->
                            <v-row>
                              <v-col cols="6" class="v-text">
                                <v-autocomplete
                                  v-model="item.proveedorList"
                                  :items="ListadoCabPrincipal"
                                  :menu-props="{ top: true, offsetY: true }"
                                  label="Proveedor"
                                  item-text="nombre_prov"
                                  item-value="idLista"
                                  persistent-hint
                                  hint="Seleccione una opción"
                                  dense
                                  return-object
                                  @input="setfilterListado"
                                  @blur="$v.editedItem.prov_id.$touch()"
                                >
                                </v-autocomplete>
                                <!-- @input="changed = true" -->
                              </v-col>

                              <v-col cols="1" class="v-text">
                                <el-button size="small" @click="setfilterListado2()">
                                  <i class="el-icon-refresh-left"></i
                                ></el-button>
                              </v-col>
                              <v-col cols="2" class="v-text">
                                <el-button
                                  size="small"
                                  :disabled="desactivaBoton"
                                  plain
                                  type="success"
                                  @click="agregarProducto"
                                  >Agregar Productos</el-button
                                >
                              </v-col>
                            </v-row>
                          </el-card>

                          <el-card v-show="muestraPanel" shadow="never">
                            <div slot="header" class="clearfix">
                              <v-row>
                                <v-col>
                                  <el-button @click="backPanel">
                                    <i class="el-icon-back"></i>
                                    Volver</el-button
                                  >
                                  <el-divider direction="vertical"></el-divider>
                                </v-col>
                                <v-col cols="7">
                                  <span
                                    style="
                                      text-align: center;
                                      word-wrap: break-word;
                                      display: block;
                                    "
                                  >
                                    Agregar producto a lista proveedor: "{{
                                      item.proveedorList.nombre_prov
                                    }}"
                                  </span>
                                </v-col>

                                <v-col
                                  ><el-divider direction="vertical"></el-divider>
                                  <el-button type="primary" @click="crearProducto"
                                    >Crear Producto</el-button
                                  ></v-col
                                >
                              </v-row>
                            </div>
                            <v-row>
                              <v-col cols="2" class="v-text">
                                <v-autocomplete
                                  class="d-flex"
                                  autofocus
                                  v-model="editedItemDet.familia_id"
                                  :items="familias"
                                  :menu-props="{ top: true, offsetY: true }"
                                  label="Seleciona Familia*"
                                  item-text="tipo_descripcion"
                                  item-value="tipo_clave"
                                  persistent-hint
                                  dense
                                  return-object
                                  @change="setfilterFamilias"
                                  @input="changedDet = true"
                                  @blur="$v.editedItemDet.familia_id.$touch()"
                                >
                                </v-autocomplete>
                              </v-col>
                              <!--<v-col cols="6" class="v-text">
                                    <el-button size="small" type="primary" @click="crearProducto"
                                      >Crear Producto</el-button
                                    >
                                  </v-col>-->
                            </v-row>
                          </el-card>
                        </v-col>
                      </div>
                      <!--tabla detalle de lista en lista precios-->
                      <div style="display: flex; justify-content: center">
                        <v-col cols="9">
                          <el-card shadow="never" v-show="muestraPanelList">
                            <div style="margin-top: 20px">
                              <el-button
                                :disabled="PorductoSelected.length == 0"
                                @click="guardaCambiosProdLista"
                                type="primary"
                                plain
                                size="mini"
                                >Guardar Cambios Lista Prod</el-button
                              >
                              <el-button
                                size="mini"
                                type="danger"
                                plain
                                :disabled="PorductoSelected.length == 0"
                                @click="deleteItemProducto()"
                                >Eliminar</el-button
                              >
                            </div>
                            <el-progress
                              v-show="barraProceso"
                              :percentage="percentage"
                            ></el-progress>
                            <el-divider></el-divider>
                            <el-table
                              v-loading="loading"
                              element-loading-text="Cargando... Espere por favor"
                              element-loading-spinner="el-icon-loading"
                              element-loading-background="rgba(255, 255, 255, 0.9)"
                              size="small"
                              height="400"
                              ref="multipleTableProductos"
                              style="width: 100%"
                              :data="filteredListadoDetTablaLista"
                              highlight-current-row
                              border
                              :row-key="(row) => row.id"
                              @selection-change="handleSeelectionProducto"
                              @current-change="handleCurrentChangeProducto"
                              @row-click="handleRowDblClickProductos"
                            >
                              <!-- Slot para mostrar cuando la tabla está vacía -->
                              <template v-slot:empty>
                                <div style="text-align: center; padding: 20px">
                                  <span>No hay datos disponibles</span>
                                </div>
                              </template>
                              <!--<el-table-column prop="idLista" label="#" width="30px">
                                    </el-table-column>-->
                              <el-table-column type="selection" width="40"> </el-table-column>
                              <el-table-column
                                prop="nombre_producto"
                                label="Descripcion"
                                sortable
                                width="350px"
                              ></el-table-column>
                              <el-table-column
                                prop="nombre_marca"
                                label="Marca"
                                sortable
                                width="95px"
                              ></el-table-column>
                              <el-table-column
                                prop="unidad_id"
                                label="Unidad"
                                width="95px"
                                sortable
                              ></el-table-column>
                              <el-table-column
                                @change="guardarCambios"
                                prop="precio"
                                label="Precio"
                                sortable
                                width="95px"
                              >
                                <editable-cell
                                  slot-scope="{ row }"
                                  :show-input="row.editable"
                                  v-model="row.precio"
                                  @change="guardarCambios(row)"
                                  placeholder="Precio"
                                >
                                  <span slot="content">
                                    <span slot="content">{{
                                      formato(eFormatos.MONEDA, row.precio)
                                    }}</span>
                                  </span>
                                </editable-cell>
                              </el-table-column>
                              <el-table-column prop="activo" label="Estatus" width="100">
                                <template slot-scope="scope">
                                  <el-tag
                                    effect="dark"
                                    :type="scope.row.activo === '1' ? 'success' : 'danger'"
                                    disable-transitions
                                  >
                                    {{ scope.row.activo === '1' ? 'Activo' : 'Inactivo' }}
                                  </el-tag>
                                </template>
                              </el-table-column>
                              <el-table-column width="190px">
                                <template slot="header">
                                  <!-- Campo de entrada para filtrar -->
                                  <el-input
                                    v-model="filterListadoDetTabla"
                                    size="mini"
                                    placeholder="Buscar..."
                                  />
                                </template>
                                <!--<template slot-scope="scope">
                                      <el-button
                                        size="mini"
                                        :disabled="!isEditing || editingRowId !== scope.row.id"
                                        @click="toggleEdit(scope.row)"
                                      >
                                        {{
                                          isEditing && editingRowId === scope.row.id
                                            ? 'Guardar'
                                            : 'Editar'
                                        }}
                                      </el-button>
                                      <el-button size="mini" type="danger" @click="deleteItemProducto()"
                                        >Eliminar Pro</el-button
                                      >
                                    </template>-->
                              </el-table-column>
                            </el-table>
                          </el-card>

                          <el-card v-show="muestraPanel" shadow="never">
                            <!--<div slot="header" class="clearfix">
                                  <el-divider direction="vertical"></el-divider>
                                  <span>Tabla Productos</span>
                                  <el-divider direction="vertical"></el-divider>
                                </div>-->
                            <div style="margin-top: 10px">
                              <el-button
                                size="small"
                                type="success"
                                :disabled="PorductoSelected.length == 0"
                                plain
                                @click="agregaALista()"
                                >Agregar Selección</el-button
                              >
                            </div>

                            <el-divider></el-divider>

                            <el-progress
                              v-show="barraProceso"
                              :percentage="percentage"
                            ></el-progress>
                            <!--TABLA PRODUCCTOS-->
                            <el-table
                              v-loading="loading"
                              element-loading-text="Cargando... Espere por favor"
                              element-loading-spinner="el-icon-loading"
                              element-loading-background="rgba(255, 255, 255, 0.9)"
                              size="small"
                              ref="multipleTableProductoTable"
                              :data="filteredProductosTablaLista"
                              @selection-change="SelectionProductoTable"
                              highlight-current-row
                              border
                              height="400"
                              style="width: 100%"
                              @current-change="CurrentChangeProductoTable"
                              @row-click="RowDblClickProductoTable"
                            >
                              <!-- Slot para mostrar cuando la tabla está vacía -->
                              <template v-slot:empty>
                                <div style="text-align: center; padding: 20px">
                                  <span>No hay datos disponibles</span>
                                </div>
                              </template>
                              <el-table-column type="selection" width="55"> </el-table-column>
                              <el-table-column prop="prod_id" label="Producto" width="90px">
                              </el-table-column>
                              <el-table-column
                                prop="prod_descripcion"
                                label="Nombre"
                                sortable
                                width="300px"
                              ></el-table-column>
                              <el-table-column
                                prop="UltimaMarca"
                                label="Marca"
                                width="95px"
                                sortable
                              ></el-table-column>
                              <el-table-column
                                prop="Unidad"
                                label="Unidad"
                                sortable
                                width="95px"
                              ></el-table-column>
                              <el-table-column
                                prop="Familia"
                                label="Familia"
                                width="95px"
                              ></el-table-column>
                              <el-table-column
                                prop="prod_activo"
                                label="Estatus"
                                width="100"
                                :filters="[
                                  { text: 'Activo', value: '1' },
                                  { text: 'Inactivo', value: '0' },
                                ]"
                                :filter-method="filterTag"
                                filter-placement="bottom-end"
                              >
                                <template slot-scope="scope">
                                  <el-tag
                                    effect="dark"
                                    :type="scope.row.prod_activo === '1' ? 'success' : 'danger'"
                                    disable-transitions
                                    >{{
                                      scope.row.prod_activo === '1' ? 'Activo' : 'Inactivo'
                                    }}</el-tag
                                  >
                                </template>
                              </el-table-column>
                              -<el-table-column width="120px">
                                <template slot="header">
                                  <el-input
                                    v-model="filterProductosTabla"
                                    size="mini"
                                    placeholder="Buscar..."
                                  />
                                </template>
                                <!--  <template slot-scope="scope">
                                        <el-button size="mini" @click="recibeItemProdcuto(scope.row)"
                                          >EditarprOD</el-button
                                        >
                                        <el-button
                                          size="mini"
                                          type="danger"
                                          @click="deleteItemDet(scope.row)"
                                          >Eliminar</el-button
                                        >
                                      </template>-->
                              </el-table-column>
                            </el-table>
                          </el-card>
                        </v-col>
                      </div>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" text @click="checkChangesDet">Salír</v-btn>
                        <!--<v-btn color="blue darken-1" text @click="save" :disabled="validando"
                                >Guardar Cambios</v-btn
                              >-->
                      </v-card-actions>
                    </el-card>
                  </el-tab-pane>
                </el-tabs>
              </v-container>
            </el-card>
          </v-dialog>
          <v-dialog v-model="dialogLista" persistent max-width="1500px">
            <el-card class="text item">
              <v-container>
                <!-- Overlay para retroalimentar al usuario -->
                <v-overlay :value="overlay">
                  <v-progress-circular
                    color="success"
                    indeterminate
                    :size="50"
                  ></v-progress-circular>
                </v-overlay>
                <el-tabs
                  type="card"
                  v-model="activeTabLista"
                  @tab-click="handleTabClickPrincipal"
                  :tab-position="tabPosition"
                >
                  <!--Lista de precios-->
                  <el-tab-pane label="Lista de precios" name="tercero">
                    <el-card>
                      <div slot="header" class="clearfix">
                        <span>Lista de precios</span>
                      </div>
                      <!--cabecero-->
                      <div style="display: flex; justify-content: center">
                        <v-col cols="9">
                          <el-card v-show="muestraPanelList" shadow="never">
                            <div slot="header" class="clearfix">
                              <v-row>
                                <v-col cols="10"><span>Listado por proveedor</span></v-col>
                                <v-col
                                  ><el-button @click="crearLista" type="primary"
                                    >Crear Lista</el-button
                                  ></v-col
                                >
                              </v-row>
                            </div>
                            <!-- Proveedor -->
                            <v-row>
                              <v-col cols="6" class="v-text">
                                <v-autocomplete
                                  v-model="item.proveedorList"
                                  :items="ListadoCabPrincipal"
                                  :menu-props="{ top: true, offsetY: true }"
                                  label="Proveedor"
                                  item-text="nombre_prov"
                                  item-value="idLista"
                                  persistent-hint
                                  hint="Seleccione una opción"
                                  dense
                                  return-object
                                  @input="setfilterListado"
                                  @blur="$v.editedItem.prov_id.$touch()"
                                >
                                </v-autocomplete>
                                <!-- @input="changed = true" -->
                              </v-col>

                              <v-col cols="1" class="v-text">
                                <el-button size="small" @click="setfilterListado2()">
                                  <i class="el-icon-refresh-left"></i
                                ></el-button>
                              </v-col>
                              <v-col cols="2" class="v-text">
                                <el-button
                                  size="small"
                                  :disabled="desactivaBoton"
                                  plain
                                  type="success"
                                  @click="agregarProducto"
                                  >Agregar Productos</el-button
                                >
                              </v-col>
                              <v-col cols="2" class="v-text">
                                <el-button
                                  size="small"
                                  :disabled="desactivaBoton"
                                  plain
                                  type="danger"
                                  @click="eliminarLista"
                                  >Eliminar Lista</el-button
                                >
                              </v-col>
                            </v-row>
                          </el-card>

                          <el-card v-show="muestraPanel" shadow="never">
                            <div slot="header" class="clearfix">
                              <v-row>
                                <v-col>
                                  <el-button @click="backPanel">
                                    <i class="el-icon-back"></i>
                                    Volver</el-button
                                  >
                                  <el-divider direction="vertical"></el-divider>
                                </v-col>
                                <v-col cols="7">
                                  <span
                                    style="
                                      text-align: center;
                                      word-wrap: break-word;
                                      display: block;
                                    "
                                  >
                                    Agregar producto a lista proveedor: "{{
                                      item.proveedorList.nombre_prov
                                    }}"
                                  </span>
                                </v-col>

                                <v-col
                                  ><el-divider direction="vertical"></el-divider>
                                  <el-button type="primary" @click="crearProducto"
                                    >Crear Producto</el-button
                                  ></v-col
                                >
                              </v-row>
                            </div>
                            <v-row>
                              <v-col cols="2" class="v-text">
                                <v-autocomplete
                                  class="d-flex"
                                  autofocus
                                  v-model="editedItemDet.familia_id"
                                  :items="familias"
                                  :menu-props="{ top: true, offsetY: true }"
                                  label="Seleciona Familia*"
                                  item-text="tipo_descripcion"
                                  item-value="tipo_clave"
                                  persistent-hint
                                  dense
                                  return-object
                                  @change="setfilterFamilias"
                                  @input="changedDet = true"
                                  @blur="$v.editedItemDet.familia_id.$touch()"
                                >
                                </v-autocomplete>
                              </v-col>
                              <!--<v-col cols="6" class="v-text">
                                    <el-button size="small" type="primary" @click="crearProducto"
                                      >Crear Producto</el-button
                                    >
                                  </v-col>-->
                            </v-row>
                          </el-card>
                        </v-col>
                      </div>
                      <!--tabla detalle de lista en lista precios-->
                      <div style="display: flex; justify-content: center">
                        <v-col cols="9">
                          <el-card shadow="never" v-show="muestraPanelList">
                            <div style="margin-top: 20px">
                              <el-button
                                :disabled="PorductoSelected.length == 0"
                                @click="guardaCambiosProdLista"
                                type="primary"
                                plain
                                size="mini"
                                >Guardar Cambios Lista Prod</el-button
                              >
                              <el-button
                                size="mini"
                                type="danger"
                                plain
                                :disabled="PorductoSelected.length == 0"
                                @click="deleteItemProducto()"
                                >Eliminar</el-button
                              >
                            </div>
                            <el-progress
                              v-show="barraProceso"
                              :percentage="percentage"
                            ></el-progress>
                            <el-divider></el-divider>
                            <el-table
                              v-loading="loading"
                              element-loading-text="Cargando... Espere por favor"
                              element-loading-spinner="el-icon-loading"
                              element-loading-background="rgba(255, 255, 255, 0.9)"
                              size="small"
                              height="400"
                              ref="multipleTableProductos"
                              style="width: 100%"
                              :data="filteredListadoDetTablaLista"
                              highlight-current-row
                              border
                              :row-key="(row) => row.id"
                              @selection-change="handleSeelectionProducto"
                              @current-change="handleCurrentChangeProducto"
                              @row-click="handleRowDblClickProductos"
                            >
                              <!-- Slot para mostrar cuando la tabla está vacía -->
                              <template v-slot:empty>
                                <div style="text-align: center; padding: 20px">
                                  <span>No hay datos disponibles</span>
                                </div>
                              </template>
                              <!--<el-table-column prop="idLista" label="#" width="30px">
                                    </el-table-column>-->
                              <el-table-column type="selection" width="40"> </el-table-column>
                              <el-table-column
                                prop="nombre_producto"
                                label="Descripcion"
                                sortable
                                width="350px"
                              ></el-table-column>
                              <el-table-column
                                prop="nombre_marca"
                                label="Marca"
                                sortable
                                width="95px"
                              ></el-table-column>
                              <el-table-column
                                prop="unidad_id"
                                label="Unidad"
                                width="95px"
                                sortable
                              ></el-table-column>
                              <el-table-column
                                @change="guardarCambios"
                                prop="precio"
                                label="Precio"
                                sortable
                                width="95px"
                              >
                                <editable-cell
                                  slot-scope="{ row }"
                                  :show-input="row.editable"
                                  v-model="row.precio"
                                  @change="guardarCambios(row)"
                                  placeholder="Precio"
                                >
                                  <span slot="content">
                                    <span slot="content">{{
                                      formato(eFormatos.MONEDA, row.precio)
                                    }}</span>
                                  </span>
                                </editable-cell>
                              </el-table-column>
                              <el-table-column
                                prop="activo"
                                label="Estatus"
                                width="100"
                                :filters="[
                                  { text: 'Activo', value: '1' },
                                  { text: 'Inactivo', value: '0' },
                                ]"
                                :filter-method="filterTag"
                                filter-placement="bottom-end"
                              >
                                <template slot-scope="scope">
                                  <el-tag
                                    effect="dark"
                                    :type="scope.row.activo === '1' ? 'success' : 'danger'"
                                    disable-transitions
                                  >
                                    {{ scope.row.activo === '1' ? 'Activo' : 'Inactivo' }}
                                  </el-tag>
                                </template>
                              </el-table-column>
                              <el-table-column width="190px">
                                <template slot="header">
                                  <!-- Campo de entrada para filtrar -->
                                  <el-input
                                    v-model="filterListadoDetTabla"
                                    size="mini"
                                    placeholder="Buscar..."
                                  />
                                </template>
                                <!--<template slot-scope="scope">
                                      <el-button
                                        size="mini"
                                        :disabled="!isEditing || editingRowId !== scope.row.id"
                                        @click="toggleEdit(scope.row)"
                                      >
                                        {{
                                          isEditing && editingRowId === scope.row.id
                                            ? 'Guardar'
                                            : 'Editar'
                                        }}
                                      </el-button>
                                      <el-button size="mini" type="danger" @click="deleteItemProducto()"
                                        >Eliminar Pro</el-button
                                      >
                                    </template>-->
                              </el-table-column>
                            </el-table>
                          </el-card>

                          <el-card v-show="muestraPanel" shadow="never">
                            <!--<div slot="header" class="clearfix">
                                  <el-divider direction="vertical"></el-divider>
                                  <span>Tabla Productos</span>
                                  <el-divider direction="vertical"></el-divider>
                                </div>-->
                            <div style="margin-top: 10px">
                              <el-button
                                size="small"
                                type="success"
                                :disabled="PorductoSelected.length == 0"
                                plain
                                @click="agregaALista()"
                                >Agregar Selección</el-button
                              >
                            </div>

                            <el-divider></el-divider>

                            <el-progress
                              v-show="barraProceso"
                              :percentage="percentage"
                            ></el-progress>
                            <!--TABLA PRODUCCTOS-->
                            <el-table
                              v-loading="loading"
                              element-loading-text="Cargando... Espere por favor"
                              element-loading-spinner="el-icon-loading"
                              element-loading-background="rgba(255, 255, 255, 0.9)"
                              size="small"
                              ref="multipleTableProductoTable"
                              :data="filteredProductosTablaLista"
                              @selection-change="SelectionProductoTable"
                              highlight-current-row
                              border
                              height="400"
                              style="width: 100%"
                              @current-change="CurrentChangeProductoTable"
                              @row-click="RowDblClickProductoTable"
                            >
                              <!-- Slot para mostrar cuando la tabla está vacía -->
                              <template v-slot:empty>
                                <div style="text-align: center; padding: 20px">
                                  <span>No hay datos disponibles</span>
                                </div>
                              </template>
                              <el-table-column type="selection" width="55"> </el-table-column>
                              <el-table-column prop="prod_id" label="Producto" width="90px">
                              </el-table-column>
                              <el-table-column
                                prop="prod_descripcion"
                                label="Nombre"
                                sortable
                                width="300px"
                              ></el-table-column>
                              <el-table-column
                                prop="UltimaMarca"
                                label="Marca"
                                width="95px"
                                sortable
                              ></el-table-column>
                              <el-table-column
                                prop="Unidad"
                                label="Unidad"
                                sortable
                                width="95px"
                              ></el-table-column>
                              <el-table-column
                                prop="Familia"
                                label="Familia"
                                width="95px"
                              ></el-table-column>
                              <el-table-column prop="prod_activo" label="Estatus" width="100">
                                <template slot-scope="scope">
                                  <el-tag
                                    effect="dark"
                                    :type="scope.row.prod_activo === '1' ? 'success' : 'danger'"
                                    disable-transitions
                                    >{{
                                      scope.row.prod_activo === '1' ? 'Activo' : 'Inactivo'
                                    }}</el-tag
                                  >
                                </template>
                              </el-table-column>
                              -<el-table-column width="120px">
                                <template slot="header">
                                  <el-input
                                    v-model="filterProductosTabla"
                                    size="mini"
                                    placeholder="Buscar..."
                                  />
                                </template>
                                <!--  <template slot-scope="scope">
                                        <el-button size="mini" @click="recibeItemProdcuto(scope.row)"
                                          >EditarprOD</el-button
                                        >
                                        <el-button
                                          size="mini"
                                          type="danger"
                                          @click="deleteItemDet(scope.row)"
                                          >Eliminar</el-button
                                        >
                                      </template>-->
                              </el-table-column>
                            </el-table>
                          </el-card>
                        </v-col>
                      </div>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" text @click="checkChangesDet">Salír</v-btn>
                        <!--<v-btn color="blue darken-1" text @click="save" :disabled="validando"
                                >Guardar Cambios</v-btn
                              >-->
                      </v-card-actions>
                    </el-card>
                  </el-tab-pane>
                </el-tabs>
              </v-container>
            </el-card>
          </v-dialog>

          <!-- Dialogo -->
          <v-dialog v-model="dialog" width="1800">
            <v-tabs v-model="tabs" fixed-tabs background-color="indigo" dark>
              <v-tabs-slider color="yellow"></v-tabs-slider>
              <v-tab> <v-icon left> mdi-card-bulleted-outline</v-icon>Cabecero </v-tab>
              <v-tab> <v-icon right> mdi-format-list-bulleted-type </v-icon>Detalle </v-tab>
              <v-tabs-items v-model="tabs">
                <!-- Cabecero -->
                <v-tab-item>
                  <!--   <base-material-card
                          color="blue"
                          icon="mdi-card-bulleted-outline"
                          inline
                          class="px-5 py-3"
                        >-->

                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                      <!-- <v-img src="@/assets/logo_ivey.jpg" width="20%" height="20%"></v-img>-->
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
                        <v-row>
                          <v-col cols="7">
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
                              <v-col cols="1" class="v-text">
                                <v-text-field
                                  class="DocumentoId"
                                  id="osNumDoc"
                                  autofocus
                                  dense
                                  :disabled="!existeOrden"
                                  label="Nº Orden de Compra*"
                                  maxlength="20"
                                  required
                                  v-model="editedItem.osNumDoc"
                                  @blur="$v.editedItem.osNumDoc.$touch()"
                                  @input="$v.editedItem.osNumDoc.$reset()"
                                  @change="validaExisteOrden()"
                                ></v-text-field>
                              </v-col>
                              <!-- Fecha de Orden -->
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
                              <!-- Tipo Adjudicacion -->
                              <v-col cols="4" class="v-text">
                                <v-select
                                  v-model="$v.editedItem.osTipoAdjudicacion.$model"
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
                              </v-col>
                              <!-- Genero Adjudicacion -->
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
                              <v-col cols="6" class="v-text">
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
                              <!-- Cuenta Contable -->
                              <v-col cols="2" class="v-text">
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
                              <!-- Correo Electronico Proveedor -->
                              <!--  <v-col cols="6" class="v-text">
                                <v-text-field
                                  dense
                                  disabled
                                  label="Correo Electrónico"
                                  maxlength="200"
                                  v-model="editedItem.prov_email"
                                  @blur="$v.editedItem.prov_email.$touch()"
                                  @input="$v.editedItem.prov_email.$reset()"
                                ></v-text-field>
                              </v-col> -->
                              <!-- Correo Electronico Proveedor 2-->
                              <!--  <v-col cols="6" class="v-text">
                                <v-text-field
                                  dense
                                  disabled
                                  label="Correo Electrónico 2"
                                  maxlength="200"
                                  v-model="editedItem.prov_email2"
                                  @blur="$v.editedItem.prov_email2.$touch()"
                                  @input="$v.editedItem.prov_email2.$reset()"
                                ></v-text-field>
                              </v-col> -->
                              <!-- CR/FF-->
                              <!-- <v-col cols="2" class="v-text">
                              <v-text-field
                                dense
                                disabled
                                label="CR/FF"
                                maxlength="45"
                                v-model="editedItem.osCRFF"
                                @blur="$v.editedItem.osCRFF.$touch()"
                                @input="$v.editedItem.osCRFF.$reset()"
                              ></v-text-field>
                            </v-col> -->
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
                              <v-col cols="5" class="v-text">
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
                              <v-col cols="2" class="v-text">
                                <v-text-field
                                  dense
                                  disabled
                                  label="Proveedor RFC"
                                  maxlength="100"
                                  :error-messages="provRFCErrors"
                                  v-model="$v.editedItem.prov_RFC.$model"
                                  @blur="$v.editedItem.prov_RFC.$touch()"
                                  @input="$v.editedItem.prov_RFC.$reset()"
                                ></v-text-field>
                              </v-col>

                              <!-- Fecha Limite de Entrega -->
                              <v-col cols="4" class="v-text">
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
                              <v-col cols="6" class="v-text">
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
                              <!-- Dias de Credito -->
                              <v-col cols="2" class="v-text">
                                <v-text-field
                                  dense
                                  :disabled="existeOrden"
                                  type="number"
                                  required
                                  :error-messages="diasCreditoErrors"
                                  return-object
                                  label="Dias de Credito"
                                  v-model="$v.editedItem.osDiasCredito.$model"
                                  @blur="$v.editedItem.osDiasCredito.$touch()"
                                  @input="$v.editedItem.osDiasCredito.$reset()"
                                ></v-text-field>
                              </v-col>
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
                              <v-col cols="10" class="v-text">
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
                              <!--  <v-col cols="4" class="v-text">
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
                                      @input="setfilterDirSolicita"
                                      return-object
                                      @blur="$v.editedItem.osEmpSolicita.$touch()"
                                    >
                                    </v-select>
                                  </v-col>-->
                              <!-- direccion Solicita -->
                              <!--<v-col cols="4" class="v-text">
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
                                  </v-col>-->
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
                              <v-col cols="6" class="v-text">
                                <v-select
                                  v-model="$v.editedItem.osDirDestino.$model"
                                  :items="dirDestino"
                                  :menu-props="{ top: true, offsetY: true }"
                                  label="Direccion Destino*"
                                  item-text="emp_direccion"
                                  item-value="emp_direccion"
                                  persistent-hint
                                  dense
                                  :disabled="existeOrden"
                                  :error-messages="osDirDestinoErrors"
                                  return-object
                                  @blur="$v.editedItem.osDirDestino.$touch()"
                                >
                                </v-select>
                              </v-col>
                              <!-- Departamento Destino -->
                              <v-col cols="6" class="v-text">
                                <v-select
                                  v-model="$v.editedItem.osDeptoDestino.$model"
                                  :items="deptoDestino"
                                  :menu-props="{ top: true, offsetY: true }"
                                  label="Departamento Destino*"
                                  item-text="emp_departamento"
                                  item-value="emp_departamento"
                                  persistent-hint
                                  dense
                                  :disabled="existeOrden"
                                  :error-messages="osdeptoDestinoErrors"
                                  return-object
                                  @blur="$v.editedItem.osDeptoDestino.$touch()"
                                >
                                </v-select>
                              </v-col>
                            </v-row>
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
                      <v-btn color="blue darken-1" text @click="SaveDet" :disabled="validando"
                        >Guardar</v-btn
                      >
                    </v-card-actions>
                  </v-card>

                  <v-card>
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
                  </v-card>
                  <!--  </base-material-card>-->
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
                    <!-- <v-data-table
                            class="Black--text"
                            dense
                            loading-text="Cargando... Espere por favor"
                            :headers="headersDet"
                            :items="ordenesDet"
                            :loading="isLoading"
                            :search.sync="search"
                            hide-default-footer
                            >
                           
                           <template v-slot:item="{ item }">
                              <tr>
                                <td v-for="(header, index) in headersDet" :key="index">
                                  <template v-if="editableFields.includes(header.value)">
                                    <v-text-field
                                    v-model="item[header.value]"
                                    outlined
                                    dense
                                    ></v-text-field>
                                  </template>
                                  <template v-else>
                                    {{ item[header.value] }}
                                  </template>
                                </td>
                       
              <td>
                    <v-icon class="mr-2" small @click="editItemDet(item)">mdi-pencil</v-icon>
                              <v-icon small @click="deleteItemDet(item)">mdi-delete</v-icon>
                <v-icon small @click="toggleDescriptionColumn">{{ showDescriptionColumn ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
              </td>
                              </tr>
                            </template>
                      
                                <template v-slot:[`item.osDescripcion`]="{ item }">
                        <td v-if="showDescriptionColumn">{{ item.osDescripcion }}</td>
                          </template>
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
      
                         
                          <template v-slot:[`item.actions`]="{ item }">
                              <v-icon class="mr-2" small @click="editItemDet(item)">mdi-pencil</v-icon>
                              <v-icon small @click="deleteItemDet(item)">mdi-delete</v-icon>
      
                            </template>-->

                    <!-- FOOTER -->
                    <!--<template v-slot:footer>Orden de Compra: {{ editedItem.osNumDoc }}</template>
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
                          </v-data-table>-->
                    <!-- <v-btn @click="addNewRow">Agregar fila nueva</v-btn>-->

                    <!--grid-->
                  </base-material-card>

                  <!--termina dialgo nuevo -->
                  <!-- dialogo Detalle -->
                  <v-dialog v-model="dialogDet" max-width="800px">
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
                                background-color="yellow"
                                label="Nº Posición*"
                                maxlength="20"
                                required
                                disabled
                                v-model="editedItemDet.osDetPosicion"
                                @blur="$v.editedItemDet.osDetPosicion.$touch()"
                                @input="$v.editedItemDet.osDetPosicion.$reset()"
                              ></v-text-field>
                            </v-col>
                            <!-- Familias -->
                            <v-col cols="3" class="v-text">
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
                            </v-col>
                            <!-- Producto -->
                            <v-col cols="8" class="v-text">
                              <v-autocomplete
                                v-model="$v.editedItemDet.prod_id.$model"
                                :items="productos"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Producto*"
                                item-text="prod_descripcion"
                                item-value="prod_id"
                                persistent-hint
                                hint="Seleciona Producto"
                                return-object
                                :error-messages="prod_idErrors"
                                @change="setfilterProductos"
                                @input="changedDet = true"
                                @blur="$v.editedItemDet.prod_id.$touch()"
                              >
                              </v-autocomplete>
                            </v-col>
                            <!-- <v-col cols="3">
                                <v-checkbox
                                  dense
                                  label="Todos"
                                  v-model="chkAllProd"
                                  @change="onChangeAllProd"
                                ></v-checkbox>
                              </v-col> -->
                            <!-- Unidades -->
                            <v-col cols="6" class="v-text">
                              <v-select
                                v-model="$v.editedItemDet.unidad_id_det.$model"
                                :items="unidades"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Unidad*"
                                item-text="tipo_descripcion"
                                item-value="tipo_clave"
                                persistent-hint
                                dense
                                hint="Seleciona la Unidad"
                                return-object
                                :error-messages="unidad_idErrors"
                                @blur="$v.editedItemDet.unidad_id_det.$touch()"
                                @input="changedDet = true"
                              >
                              </v-select>
                            </v-col>
                            <!-- Marcas -->
                            <v-col cols="6" class="v-text">
                              <v-autocomplete
                                v-model="$v.editedItemDet.marca_id.$model"
                                :items="marcas"
                                :menu-props="{ top: true, offsetY: true }"
                                label="Marca*"
                                item-text="tipo_descripcion"
                                item-value="tipo_clave"
                                persistent-hint
                                dense
                                hint="Seleciona la Marca"
                                return-object
                                :error-messages="marca_idErrors"
                                @blur="$v.editedItemDet.marca_id.$touch()"
                                @input="changedDet = true"
                              >
                              </v-autocomplete>
                            </v-col>
                          </v-row>
                          <!-- Cantidad -->
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
                          <!-- Total -->
                          <v-row justify="end">
                            <v-col class="v-text" cols="3">
                              <p class="font-weight-black">
                                <v-text-field
                                  class="v-text-Right"
                                  label="Total"
                                  background-color="yellow"
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
          <CreaProducto v-model="dialogCreaProducto" />

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
              <!--<v-icon class="mr-2" small @click="editItemDet(item)">mdi-view-grid-outline</v-icon> -->
              <v-icon
                class="mr-2"
                :disabled="item.osTotal == 0 || item.osTotal == 0.0"
                small
                @click="crearSolic(item)"
                >mdi-check-bold</v-icon
              >
              <v-icon
                class="mr-2"
                small
                :disabled="item.osTotal == 0 || item.osTotal == 0.0"
                @click="printItem(item)"
                >mdi-printer</v-icon
              >
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
    </v-tab-item>

    <!--ordenes enviadas-->
    <v-tab-item key="tab1">
      <v-container id="ordenes" tag="section">
        <base-material-card
          class="px-5 py-3"
          color="primary"
          icon="mdi-cart-outline"
          inline
          :title="$t('orders')"
        >
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
            <template v-slot:[`item.actions`]="{ item }">
              <!-- <v-icon class="mr-2" small @click="editItem(item)">mdi-pencil</v-icon>-->
              <!--<v-icon class="mr-2" small @click="editItemDet(item)">mdi-view-grid-outline</v-icon> -->
              <!--<v-icon class="mr-2" small @click="crearSolic(item)">mdi-check-bold</v-icon>-->
              <v-icon class="mr-2" small @click="printItem(item)">mdi-printer</v-icon>
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
    </v-tab-item>
    <v-dialog v-model="dialogCreaLista" persistent max-width="600px">
      <el-card>
        <div slot="header" class="clearfix">
          <span>Nueva Lista</span>
        </div>
        <v-container>
          <!-- Proveedor -->
          <v-row>
            <v-col cols="12" class="v-text">
              <v-autocomplete
                v-model="$v.item.proveedorList.$model"
                :items="proveedores"
                item-text="prov_razon_social"
                item-value="prov_id"
                :menu-props="{ top: true, offsetY: true }"
                label="Proveedor"
                persistent-hint
                required
                hint="Seleccione una opción"
                dense
                return-object
                @input="setfilterProvNewList"
                @blur="$v.item.proveedorList.$touch()"
              >
              </v-autocomplete>
              <!-- @input="changed = true" -->
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="checkChangesCreaLista()">Salír</v-btn>
          <v-btn
            style="float: right; padding: 3px 0"
            color="success"
            text
            :disabled="!isProveedorListValid || desactivaBoton"
            @click="saveLista"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </el-card>
    </v-dialog>
  </v-tabs>
</template>

<script>
/**
 * @fileoverview Pantalla para Captura de Ordenes de Compra
 *
 * @version 1.0
 *
 * @author Roger Paulino Gala Pacheo rogapa@hotmail.com
 *
 * @copyright DesignSoft
 *
 * Historial
 * ---------
 * La primera versión fue escrita por Roger Gala Pacheco
 */
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
import EditaProveedor from '@/components/general/EditaProveedor.vue'
import CargarFactura from '@/components/general/CargarFactura.vue'
import CreaProducto from '@/components/general/creaProducto.vue'
//import cardProductos from '@/components/general/cardProductos.vue'
import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import * as tools from '@/store/modules/tools.store.js'
import { imprimeFormatoOrdenCompra } from '@/store/modules/sica/impresionesSica.store.js'
//import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
//import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
//import { AgGridVue } from "ag-grid-vue"; // AG Grid Component
//import 'ag-grid-community';
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import EditableCell from 'editable-cell'
Vue.use(ElementUI)

Vue.component('custom-button', {
  template: `
    <button @click="handleClick">{{ params.value }}</button>
  `,
  methods: {
    handleClick() {
      // Lógica para manejar el clic del botón
      console.log('Botón clickeado')
    },
  },
})

export default {
  components: {
    ConfirmationDialog,
    EditaProveedor,
    CargarFactura,
    // cardProductos,
    CreaProducto,
    EditableCell,
    //preCaptura,
    //DataExporter,
  },
  data: () => ({
    totalCantidad: 0,
    totalDescuento: 0,
    totalSubtotal: 0,
    totalIVA: 0,
    total: 0,

    percentage: 0,
    barraProceso: false,
    customColor: '#409eff',
    activeTab: 'primero', // Variable para almacenar la pestaña activa7
    activeTabLista: 'tercero',
    editingIndex: -1,
    selectedIds: new Set(),
    showDetalleOrden: false,
    showTablePro: false,
    showTableList: false,
    showCardProducto: false,
    activeNameDet: 'firstDet',
    activeName: 'first',
    dialogCreaLista: false,
    loading: false,
    editingRowId: null,
    editModeEnabled: false,
    tabPosition: 'top',
    dialogDetalle: false,
    dialogLista: false,
    filter: '',
    filterListadoDet: '',
    filterProductos: '',
    filterProductosTabla: '',
    filterListadoDetTabla: '',
    muestraPanel: false,
    muestraPanelList: true,
    dialogCreaProducto: false,
    desactivaBoton: true,
    tamañoGrupo: 20,
    // Column Definitions: Defines the columns to be displayed.
    colDefs: [
      {
        field: 'osNumDoc',
        headerName: 'Nº Doc',
        flex: 1,
        cellEditor: 'agTextCellEditor',
        cellEditorParams: { maxLength: 20 },
        editable: true,
      },
      { field: 'osFecha', headerName: 'Fecha', flex: 1 },
      { field: 'info', headerName: 'Info', flex: 1 },
      { field: 'osDescripcion', headerName: 'Descripción', flex: 1 },
      { field: 'osTotal', headerName: 'Total', flex: 1 },
      { field: 'estatus_nombre', headerName: 'Estatus', flex: 1 },
      { field: 'actions', headerName: 'Acciones', flex: 1, sortable: false },
    ],
    usuario: JSON.parse(localStorage.getItem('user')),
    eFormatos: tools.formatos,
    dialog: false,
    dialogDet: false,
    dialogEditProv: false,
    dialogCargarFactura: false,
    dialogConfirmar: false,
    editedIndex: -1,
    editedIndexDet: -1,
    editedIndexProd: -1,
    // Estado interno para almacenar temporalmente la pestaña seleccionada
    selectedTab: '',
    notificacionDialog: '',
    tittleConfirm: '',
    confirmarBoton: '',
    ConfirmaSi: true,
    opcionSelect: '',
    confirmLeave: false,
    fromDateMenu: false,
    fromDateMenuFLM: false,

    idEmpleadoAut: 0,
    idEmpleadoSolFirma: 0,

    isEditing: false,
    isEditingDet: false,
    isLoading: false,
    snackbar: false,
    timeout: 3000,

    isSure: false,
    isSureDet: false,

    chkAllProd: false,
    checkboxDet: false,
    checkbox: false,
    pendingTab: null,
    changed: false,
    changedDet: false,

    existeOrden: true,

    tipo_temp: 0,
    clave_temp: '',
    familiaAct: '',
    contPosicionesDoc: 0,
    //Detalle
    contPosiciones: 0,
    subTotalCalculado: 0,
    descuentoCalculado: 0,
    ivaCalculado: 0,
    TotalCalculado: 0,
    //manejo de secuencia de escoger selects
    //isTipo: true,
    minDate: '2021-01-01',
    maxDate: '2050-01-31',

    overlay: false,
    search: '',
    bandValidaCampos: false,

    tabs: 0,
    showDescriptionColumn: true,
    contentClass: 'table-copyable',
    editableFields: ['osDetCantidad', 'osDetPrecio', 'osTotal'],
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
      //{ text: 'Producto', align: 'center', value: 'prod_id', sortable: true },
      { text: 'Descripcion', align: 'center', value: 'prod_descripcion', sortable: true },
      { text: 'Unidad', align: 'center', value: 'unidad_id_det_desc', sortable: true },
      //{ text: 'Familia', align: 'center', value: 'familia_desc', sortable: true },
      //{ text: 'Marca', align: 'center', value: 'marca_desc', sortable: true },

      { text: 'Cantidad', align: 'start', value: 'osDetCantidad', sortable: true },
      { text: 'Precio  ', align: 'start', value: 'osDetPrecio', sortable: true },
      { text: 'Descuento', align: 'right', value: 'osDetDescuento', sortable: true },
      { text: 'osDetSubTotal', align: 'right', value: 'osDetSubtotal', sortable: true },
      //{ text: 'subTotal', align: 'right', value: 'osDetSubTotal', sortable: true },

      { text: 'IVA', align: 'right', value: 'osDetIVA', sortable: true },
      { text: 'TOTAL', align: 'right', value: 'osDetTotal', sortable: true },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    colDefsDet: [
      { headerName: 'Row ID', valueGetter: 'node.id' },
      {
        field: 'osDetPosicion',
        headerName: '#',
        flex: 1,
        cellEditor: 'agTextCellEditor',
        cellEditorParams: { maxLength: 20 },
      },
      { field: 'prod_descripcion', headerName: 'Descripción', flex: 1 },
      { field: 'unidad_id_det_desc', headerName: 'Unidad', flex: 1 },
      { field: 'osDetCantidad', headerName: 'Cantidad', flex: 1, editable: true },
      { field: 'osDetPrecio', headerName: 'Precio', flex: 1, editable: true },
      { field: 'osDetDescuento', headerName: 'Descuento', flex: 1 },
      { field: 'osDetSubtotal', headerName: 'Sub Total', flex: 1, sortable: false },
      { field: 'osDetIVA', headerName: 'IVA', flex: 1, sortable: false },
      {
        field: 'osDetTotal',
        headerName: 'TOTAL',
        flex: 1,
        sortable: false,
        valueFormatter: (p) => '£' + Math.floor(p.value).toLocaleString(),
      },
      { field: 'actions', headerName: 'actions', sortable: false },
      { field: 'button', headerName: 'boton', cellRenderer: 'custom-button', flex: 1 },
    ],
    defaultItem: {
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
      osTipoAdjudicacion: '',
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
      //prov_email: '',
      //prov_email2: '',
      osFechaLimEntrega: '',
      osLugarEntrega: '',
      osDiasCredito: '',
      prov_direccion: '',
      prov_ciudad: '',
      proveedorList: '',
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
      //familiaComite: '',
      osDirSolicita: '',
      osDeptoSolicita: '',
      osDirDestino: '',
      osDeptoDestino: '',
      osSubTotal: 0,
      osDescuento: 0,
      osIva: 0,
      osTipoAdjudicacion: '',
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
      //prov_email: '',
      //prov_email2: '',
      osFechaLimEntrega: '',
      osLugarEntrega: '',
      osDiasCredito: '',
      prov_direccion: '',
      prov_ciudad: '',
      os_fecha_envpre: '',
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

      DetCantidad: 0,
      DetPrecio: 0,
      PorcDcto: 0,
      DetDescuento: 0,
      DetSubtotal: 0,
      DetTasaIVA: '',
      DetIVA: 0,
      DetTotal: 0,
      Total: 0,
      total: 0,
      prod_ultPrecio: 0,
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
    editedItemProd: {
      idLista: 0,
      idProducto: 0,
      idMarca: 0,
      precio: 0,
      activo: 0,
      fechaCreado: 0,
      creadoPor: 0,
      modificadoPor: 0,
      modificadoEl: 0,
    },
    item: {
      proveedorList: '',
    },
    itemSelect: {
      total: 0,
    },
    itemUser: {
      usr_nombres: '',
    },
    conceptos: [],
    //ctaContable: [],
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
    ordenes: [],
    ordenesEnv: [],
    ordenesDet: [],
    productos: [],
    proveedores: [],
    tipoAdjudicacion: [],
    unidades: [],
    lugaresEntrega: [],
    ejercicios: [],
    profileUsr: [],
    ListadoDet: [],
    ListadoCab: [],
    ListadoCabSelect: [],
    multipleSelection: [],
    PorductoSelected: [],
    seleccionDet: [],
    ListadoCabPrincipal: [],
    multipleSelectionProd: [],
    productosTodos: [],
    ListadoDetLista: [],
  }),
  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      osNumDoc: { required },
      prov_id: { required },
      //osDirSolicita: { required },
      osDiasCredito: { required },
      osDeptoSolicita: { required },
      osDirDestino: { required },
      osDeptoDestino: { required },
      //osEmpSolicita: { required },
      osTipoAdjudicacion: { required },
      osgenAdjudicacion: { required },
      sp_concepto: { required },
      osLugarEntrega: { required },
      prov_RFC: { required },
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
    item: {
      proveedorList: { required },
    },
  },
  watch: {
    dialogDet(val) {
      val || this.closeDet()
    },
    async dialogEditProv(val) {
      console.log('Watch', 'dialogEditProv(val)', val)
      /*if (!val) {
        await this.actualizaProveedor()
      }
      */
    },
    async dialogCargarFactura(val) {
      console.log('Watch', 'dialogCargarFactura(val)', val)
    },
    async dialogCreaProducto(val) {
      console.log('Watch', 'dialogCreaProducto(val)', val)
    },
    async showCardProducto(val) {
      console.log('Watch', 'shoCardProducto(val)', val)
    },
  },
  async created() {
    await this.Refreesca()
    this.$root.$on('guardado-exitoso', () => {
      console.log('envia')
    })
  },
  computed: {
    isProveedorListValid() {
      const proveedorList = this.$v.item.proveedorList.$model
      return proveedorList && Object.keys(proveedorList).length !== 0
    },
    // Datos filtrados basados en el texto de filtrado
    filteredListadoDet() {
      // Filtrar los datos basados en el texto de filtrado y que no estén en ordenesDet
      return this.ListadoDet.filter(
        (item) =>
          item.nombre_producto.toLowerCase().includes(this.filterListadoDet.toLowerCase()) &&
          !this.ordenesDet.some((order) => order.prod_id === item.idProducto)
      )
    },
    filteredProductos() {
      return this.productos.filter(
        (item) =>
          item.prod_descripcion.toLowerCase().includes(this.filterProductos.toLowerCase()) &&
          !this.ordenesDet.some((orders) => orders.prod_id === item.prod_id)
      )
    },
    /*filteredProductos() {
      // Filtrar los datos basados en el texto de filtrado
      return this.productosTodos.filter((item) =>
        item.prod_descripcion.toLowerCase().includes(this.filterProductos.toLowerCase())
      )
    },*/

    filteredOrdenesDet() {
      // Filtrar los datos basados en el texto de filtrado
      return this.ordenesDet.filter((item) =>
        item.prod_descripcion.toLowerCase().includes(this.filter.toLowerCase())
      )
    },

    //FILTROS PARA TABLAS NO DE DETALLE
    /* filteredProductosTablaLista() {
      // Filtrar los datos basados en el texto de filtrado
      return this.productos.filter((item) =>
        item.prod_descripcion.toLowerCase().includes(this.filterProductosTabla.toLowerCase())
      )
    },
    */
    //FILTRA OBJETOS EXISTENTES EN LA TABLA DE DETALLE DE LISTA DE PRECIOS
    filteredProductosTablaLista() {
      return this.productos.filter(
        (item) =>
          item.prod_descripcion.toLowerCase().includes(this.filterProductosTabla.toLowerCase()) &&
          !this.ListadoDetLista.some((orders) => orders.idProducto === item.prod_id)
      )
    },
    filteredListadoDetTablaLista() {
      // Filtrar los datos basados en el texto de filtrado
      return this.ListadoDetLista.filter((item) =>
        item.nombre_producto.toLowerCase().includes(this.filterListadoDetTabla.toLowerCase())
      )
    },
    /* filteredListadoDet() {
      // Filtrar los datos basados en el texto de filtrado
      return this.ListadoDet.filter((item) =>
        item.nombre_producto.toLowerCase().includes(this.filterListadoDet.toLowerCase())
      )
    },*/

    formTitle() {
      return this.editedIndex === -1
        ? 'Nueva Órden de Compra'
        : 'Editar Órden de Compra: ' + this.editedItem.osNumDoc
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
    provRFCErrors() {
      const errors = []
      if (!this.$v.editedItem.prov_RFC.$dirty) return errors
      !this.$v.editedItem.prov_RFC.required &&
        errors.push('El proveedor debe tener un RFC registrado')
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
    diasCreditoErrors() {
      const errors = []
      if (!this.$v.editedItem.osDiasCredito.$dirty) return errors
      !this.$v.editedItem.osDiasCredito.required && errors.push('Debe tener un valor mayo a 0')
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
      if (!this.$v.editedItem.osTipoAdjudicacion.$dirty) return errors
      !this.$v.editedItem.osTipoAdjudicacion.required && errors.push('Este campo es requerido')
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

      /* console.log('***************************************************************')
      console.log('this.editedItem.osNumDoc', this.editedItem.osNumDoc)

      console.log(
        'this.$v.editedItem.osTipoAdjudicacion.$model',
        this.$v.editedItem.osTipoAdjudicacion.$model
      )

      console.log(
        'this.$v.editedItem.osTipoAdjudicacion.$model.tipo_clave',
        this.$v.editedItem.osTipoAdjudicacion.$model.tipo_clave
      )

      console.log('this.$v.editedItem.prov_id.$model', this.$v.editedItem.prov_id.$model)
      console.log(
        'this.$v.editedItem.osDirSolicita.$model',
        this.$v.editedItem.osDirSolicita.$model
      )

            console.log(
        'this.$v.editedItem.osDeptoSolicita.$model',
        this.$v.editedItem.osDeptoSolicita.$model
      )
       console.log(
        'this.$v.editedItem.osDirDestino.$model',
        this.$v.editedItem.osDirDestino.$model
      )
       console.log(
        'this.$v.editedItem.osDeptoDestino.$model',
        this.$v.editedItem.osDeptoDestino.$model
      )
console.log(
        ' this.$v.editedItem.osEmpSolicita.$model',
         this.$v.editedItem.osEmpSolicita.$model
      )
console.log(
        ' this.$v.editedItem.osEmpSolicita.$model',
         this.$v.editedItem.osEmpSolicita.$model
      ) */

      if (
        this.editedItem.osNumDoc != '' &&
        (this.$v.editedItem.osTipoAdjudicacion.$model != '' ||
          this.$v.editedItem.osTipoAdjudicacion.$model.tipo_clave != '') &&
        this.$v.editedItem.prov_id.$model != '' &&
        //this.$v.editedItem.osDirSolicita.$model != '' &&
        this.$v.editedItem.osDeptoSolicita.$model != '' &&
        this.$v.editedItem.osDirDestino.$model != '' &&
        this.$v.editedItem.osDeptoDestino.$model != '' &&
        //this.$v.editedItem.osEmpSolicita.$model != '' &&
        this.$v.editedItem.osgenAdjudicacion.$model != '' &&
        this.$v.editedItem.osLugarEntrega.$model != '' &&
        this.$v.editedItem.osDiasCredito.$model > 0 &&
        this.$v.editedItem.prov_RFC.$model != null
        //&& this.editedItem.osDescripcion != ''
      ) {
        valida = false
      }

      //valida = false
      return valida
    },
    validandoDet() {
      let valida = true
      if (
        /*(this.$v.editedItemDet.prod_id.$model.prod_id != '' ||
          this.$v.editedItemDet.prod_id.$model != '') */
        this.$v.editedItemDet.prod_id.$model.prod_id != '' &&
        this.$v.editedItemDet.unidad_id_det.$model != '' &&
        (this.$v.editedItemDet.marca_id.$dirty || this.$v.editedItemDet.marca_id.$model != '') &&
        Number(this.editedItemDet.osDetCantidad) > 0 &&
        Number(this.editedItemDet.osDetPrecio) > 0 &&
        Number(this.editedItemDet.osDetTasaIVA) > 0 &&
        Number(this.editedItemDet.osDetIVA) > 0
      ) {
        valida = false

        //valida = false
      }

      return valida
    },
  },

  methods: {
    /* handleSelectionChangePodcuto(val) {
      val.forEach((selectedObj) => {
        const exists = this.filteredOrdenesDet.some((det) => det.prod_id === selectedObj.prod_id)
        if (exists) {
          this.$message.error(
            `El producto ${selectedObj.prod_descripcion} ya está registrado en la orden.`
          )
        }
      })

      // Actualizar multipleSelection con todos los elementos seleccionados, excluyendo los que ya están en filteredOrdenesDet
      this.multipleSelection = val.filter(
        (selectedObj) => !this.filteredOrdenesDet.some((det) => det.prod_id === selectedObj.prod_id)
      )
    },*/

    /* desmarcarObjetoSeleccionadoPRod(objeto) {
      // Desmarcar el objeto seleccionado
      console.log(objeto.prod_id)
      if (this.multipleSelection.some((obj) => obj.prod_id === objeto.prod_id)) {
        this.$refs.multipleTableProd.toggleRowSelection(objeto)
      }
    },*/

    /* handleRowDblClickPrinProd(row) {
      // Establecer el ID de la fila en edición
      this.editingRowId = row.id

      // Insertar 1 como valor predeterminado en caso de que la cantidad esté vacía
      if (!row.DetCantidad && row.DetCantidad !== 0) {
        this.$set(row, 'DetCantidad', 1) // Usamos $set para que Vue detecte el cambio
      }

      // Desmarcar el objeto seleccionado si ya está presente en filteredOrdenesDet
      if (this.filteredOrdenesDet.some((det) => det.prod_id === row.prod_id)) {
        this.$refs.multipleTableProd.toggleRowSelection(row)
      } else {
        // Mantener marcados los elementos que ya están seleccionados
        this.multipleSelection.forEach((selectedObj) => {
          if (!this.$refs.multipleTableProd.selection.includes(selectedObj)) {
            this.$refs.multipleTableProd.toggleRowSelection(selectedObj)
          }
        })

        // Seleccionar la fila actual
        this.$nextTick(() => {
          this.$refs.multipleTableProd.toggleRowSelection(row)
        })
      }
    },*/

    /*  handleSelectionChange(val) {
      console.log('forceUpdate', this.multipleSelection)
      const prevSelection = [...this.multipleSelection] // Guardar la selección previa

      // Actualizar la selección múltiple
      this.multipleSelection = val

      // Restaurar la selección previa después de la actualización
      this.$nextTick(() => {
        prevSelection.forEach((selectedObj) => {
          // Si el objeto no está en la nueva selección, deseleccionarlo
          if (!val.some((obj) => obj.idProducto === selectedObj.idProducto)) {
            this.$refs.multipleTable.toggleRowSelection(selectedObj)
          }
        })
      })

      // Iterar sobre los objetos seleccionados
      this.multipleSelection.forEach((selectedObj) => {
        const exists = this.filteredOrdenesDet.some((det) => det.prod_id === selectedObj.idProducto)
        if (exists) {
          // Si el objeto ya existe, mostrar un anuncio
          this.$message.error(
            `El producto ${selectedObj.nombre_producto} ya está registrado en la orden.`
          )
          // Desmarcar el objeto seleccionado después de que la vista se actualice
          this.$nextTick(() => {
            this.desmarcarObjetoSeleccionado(selectedObj)
          })
          return
        }

        // Si el objeto no existe, asignar 1 a osDetCantidad
        if (!selectedObj.osDetCantidad) {
          this.$set(selectedObj, 'osDetCantidad', 1) // Asignar 1 a osDetCantidad si no está definido
        }
      })
    },
*/
    /*desmarcarObjetoSeleccionado(objeto) {
      // Desmarcar el objeto seleccionado
      this.$refs.multipleTable.toggleRowSelection(objeto)
    },
    /*handleRowDblClickPrin(row) {
      // Establecer el ID de la fila en edición
      this.editingRowId = row.id

      // Insertar 1 como valor predeterminado en caso de que la cantidad esté vacía
      if (!row.DetCantidad && row.DetCantidad !== 0) {
        this.$set(row, 'DetCantidad', 1) // Usamos $set para que Vue detecte el cambio
      }
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },*/

    editaCelda() {
      this.desactivaBoton = false
    },

    async setfilterProvNewList(value) {
      await this.obtenerListaCab(value.prov_id)
      const currentItem = this.ListadoCab[0]

      const isAlreadyAdded = this.ListadoCab.some(
        (item) => item.idProveedor === currentItem.idProveedor
      )
      if (isAlreadyAdded) {
        /* this.$confirm(`El producto  "${currentItem.prod_descripcion}" , ya existe en la lista.`, {
          confirmButtonText: 'OK',
          cancelButtonText: '',
          type: 'warning',
        })*/
        this.desactivaBoton = false
        this.$alert(`El proveedor  "${currentItem.nombre_prov}" , ya cuenta con una lista.`, {
          confirmButtonText: 'OK',
          callback: (action) => {
            this.$message({
              type: 'info',
              message: `action: ${action}`,
            })
          },
        })
        //continue // Saltar este elemento y pasar al siguiente
      }
    },
    async crearLista() {
      /* await this.obtenerUltimaPosicionList(this.editedItem.osNumDoc)
      this.contPosiciones = Number(this.contPosiciones) + 1
      this.listPosicion = this.contPosiciones*/
      var fecha = new Date()
      this.item.fechaCap = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.dialogCreaLista = true
    },
    agregarProducto() {
      console.log('ListadoCabSelect', this.item.proveedorList)

      this.muestraPanel = true
      this.muestraPanelList = false
    },
    crearProducto() {
      console.log('crear')
      this.dialogCreaProducto = true
    },
    backPanel() {
      console.log('volver')
      this.muestraPanel = false
      this.muestraPanelList = true
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },

    /*handleCurrentChangePrin(val) {
      this.currentRow = val
    },
*/
    toggleEdit(row) {
      if (this.isEditing && this.editingRowId === row.id) {
        // Si está editando y el ID coincide, guardar y salir de la edición
        this.recibeItemProdcuto(row)
      } else {
        // Entrar en modo de edición para esta fila
        this.isEditing = true
        this.editingRowId = row.id
      }
    },

    handleCellBlur(row) {
      // Restablecer el estado del botón cuando la celda pierde el foco
      if (this.isEditing && this.editingRowId === row.id) {
        this.isEditing = false
        this.editingRowId = null // Restablecer el ID de la fila en edición
      }
    },
    //C A B E C E R O
    addNewRow() {
      // Agrega una fila nueva con datos por defecto o vacíos
      this.ordenesDet.push({
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
      })
    },
    toggleDescriptionColumn() {
      this.showDescriptionColumn = !this.showDescriptionColumn
    },
    //Actualizar Proveedor
    async actualizaProveedor() {
      await this.obtenerProveedores(this.tipo_temp)
      this.editedItemProv = Object.assign({}, this.editedItem.prov_id)
      console.log('this.editedItemProv', this.editedItemProv)
      this.editedItem.prov_email = this.editedItemProv.prov_email
      this.editedItem.prov_email2 = this.editedItemProv.prov_email2
      this.editedItem.prov_direccion = this.editedItemProv.prov_direccion
      this.editedItem.prov_ciudad = this.editedItemProv.prov_ciudad
    },

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
        this.dialogConfirmar = false
        this.dialog = false
        this.dialogDetalle = false
        this.isEditing = false
        //this.$emit("input", false);
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        var fecha = new Date()
        //this.editedItem.osFecha = this.fechaformato(fecha)
        this.editedItem.osFecha = this.formato(this.eFormatos.FECHA_NUM, fecha)
        this.editedItem.osFechaLimEntrega = this.formato(this.eFormatos.FECHA_NUM, fecha)
      })
      this.$v.$reset()
    },

    cancelCreaLista(isSure) {
      this.isSure = isSure
      if (this.isSure) {
        this.closeCreaLista(false)
        this.changed = false
      }
    },
    // Revisar los cambios en el formulario Principal
    checkChangesCreaLista() {
      if (this.changed) {
        this.isSure = true
      } else {
        this.closeCreaLista(false)
        this.changed = false
      }
    },
    // Cerrar el formulario
    closeCreaLista(checkbox) {
      this.isSure = false
      this.checkbox = checkbox
      if (!this.checkbox) {
        this.dialogCreaLista = false
      }
      this.$nextTick(() => {
        this.item.proveedorList = ''
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$v.$reset()
    },
    /**
     * @description Obtiene el indice del elemento seleccionado y lo signa al array editedItem
     * @param {object} item elemento seleccionado
     */
    //Obtiene el indice del elemento seleccionado y lo signa al array editedItem
    async editItem(item) {
      console.log('ENTRA A: editItem(item)', 'item: ', item)
      this.overlay = true
      this.isEditing = true
      this.editedIndex = this.ordenes.indexOf(item)

      this.editedItem = Object.assign({}, item)
      // Verificar si prov_RFC es nulo o vacio
      if (this.editedItem.prov_RFC === '' || this.editedItem.prov_RFC === null) {
        // Mostrar una alerta o mensaje
        alert('El proveedor seleccionado en la orden  no cuenta con RFC, debe ser actualizado')

        // Salir de la función si el RFC es nulo
      }
      const startTime = performance.now() // Inicia el cronómetro
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
      this.obtenerOrdenesDet(this.editedItem.osNumDoc)
      this.obtenerListaSelect()
      this.existeOrden = false
      //this.isTipo = false;
      //this.dialog = true
      this.obtenerListaCabTodos()
      if (this.familia == undefined || this.familia == 0) {
        this.familia = 'FAMTOD'
      }
      await this.obtenerProuctos(this.familia)
      await this.obtenerProuctosTodos(this.familia)

      //this.obtenerProuctos()
      await this.obtenerListaCab(this.editedItem.prov_id)
      this.ListID = this.ListadoCab.length > 0 ? this.ListadoCab[0].idLista : 0
      if (this.ListID === 0) {
        this.showTableList = false
        this.showTablePro = true // Si no hay elementos, podrías establecer showTablePro a true si necesitas mostrar el componente.
      } else {
        this.showTableList = true
        this.showTablePro = false
      }
      await this.obtenerListaDet(this.ListID)
      this.showDetalleOrden = true

      const endTime = performance.now() // Detiene el cronómetro
      const executionTime = endTime - startTime // Calcula el tiempo total de ejecución
      setTimeout(() => (this.overlay = false), executionTime) // Establece el timeout con el tiempo de ejecución
      setTimeout(() => (this.dialogDetalle = true), executionTime + 1) //
      //this.dialogDetalle = true
      //this.showCardProducto = true
    },
    /**
     * @description Obtiene el indice del elemento seleccionado y lo signa al array editedItem
     * @param {object} item elemento seleccionado
     */
    editItemDet(item) {
      console.log('items det', item)
      this.isEditingDet = true
      this.editedIndexDet = this.ordenesDet.indexOf(item)
      this.editedItemDet = Object.assign({}, item)

      //se filtra por familia comite
      //this.obtenerProuctos('FAMTOD')
      this.obtenerProuctos(this.editedItem.familiaComite)

      this.formatoDetalle()
      this.dialogDet = true
      console.log('dialog', this.dialogDet)
      ///Para posicionarse en el Campo Cantidad
      /*Vue.nextTick().then(() => {
        document.getElementById('osDetCantidad').select()
        document.getElementById('osDetCantidad').focus()
        //this.$refs.input.focus()
      })*/
      console.log('items det', document.getElementById('osDetCantidad').select())
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
        //this.ConfirmaSi = true
        return
        // Mostrar una alerta o mensaje
        /*const userConfirm = alert(

          'No se puede procesar, porque el proveedor seleccionado no cuenta con RFC valído'
        )
        if (!userConfirm) {
          return
        }*/
        // Salir de la función si el RFC es nulo
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
      this.estatus_sol = 'ENVPRECAP'
      this.editedItem.sp_fecha_precaptura = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.obtenerOrdenesDet(this.editedItem.osNumDoc)
      this.tittleConfirm = 'Enviar a solicitud de pago'
      this.notificacionDialog =
        'Se enviara la orden de compra: ' + this.editedItem.osNumDoc + ' ¿Seguro quiere continuar?'

      this.existeOrden = false
      this.dialogConfirmar = true
    },
    enviarOrden() {
      if (this.ConfirmaSi) {
        this.save()
        this.savePreCap()
      }
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

    async Refreesca() {
      try {
        let jwt = await getValidToken(this)

        await this.obtenerEjercicios(jwt)

        if (this.ejercicio == undefined || this.ejercicio == 0) {
          this.ejercicio = this.ejercicios[0].sp_ejercicio
        }

        await Promise.all([
          this.obtenerOrdenes(jwt, this.ejercicio),
          this.obtenerOrdenesEnv(jwt, this.ejercicio),
        ])

        await Promise.all([
          this.ObtenerGenerales(),
          this.obtenerConceptos(),
          this.obtenerProveedores(),
          this.obtenerCuentas(0, 0),
          this.obtenerEmpleadoSolicita(),
          this.obtenerDirSolicita(),
          this.obtenerDeptoSolicita(''),
          this.obtenerDirDestino(),
          this.obtenerDeptoDestino(),
          this.obtenerTipoAdjudica(),
          this.obtenerGeneroAdjudica(),
          this.obtenerLugaresEntrega(),
          this.obtenerFamilias(),
          this.obtenerUnidades(),
          this.obtenerMarcas(),
          this.obtenerTasaIvas(),
        ])

        this.EjercicioValido()
      } catch (error) {
        console.error('Error en Refreesca:', error)
        // Manejar el error según sea necesario
      }
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
    //Preparar para nueva Captura de Orden de Compra
    nuevaCaptura() {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      var fecha = new Date()
      //this.editedItem.osFecha = this.fechaformato(fecha)
      this.editedItem.osFecha = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.editedItem.osFechaLimEntrega = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.editedItem.os_fecha_cap = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.editedItem.osEstatus = 'CAP_OS'
      this.editedItem.osTipoDoc = 'COMPRA'
      this.editedItem.osTipoOs = 'ADQUI'
      this.editedItem.osgenAdjudicacion = 'B'
      this.existeOrden = true
      this.ordenesDet = []
      if (this.editedItem.prov_RFC === null) {
        this.snackbar = true
        this.editedItem.osDiasCredito = 0
      }
      this.EjercicioValido()
      this.obtenerListaCabTodos()
    },
    /*******funciones edicion de celdas******** */
    formatter(row) {
      return row.address
    },
    async obtenerUltimaPosicionList(idLista) {
      this.isLoading = true
      let params = idLista
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        //this.contPosiciones = 0
        await this.$store
          .dispatch('ordencompra/fetchUltimaPosicion', payload)
          .then((response) => {
            //console.log('response.data', response.data)
            //console.log('response.data.ultimaposicion', response.data[0].ultimaposicion)
            this.contPosiciones = response.data[0].ultimaposicion
            //this.unidades = response.data
            this.isLoading = false
          })
          .catch((err) => {
            //console.log('err', err)
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },

    recibeItemDet(row) {
      //this.editedItemDet = row
      this.isEditing = true
      this.editedIndexDet = this.filteredOrdenesDet.findIndex((item) => item.id === row.id)
      this.editedItemDet = Object.assign({}, row)
      this.SaveDet()
    },

    guardarTotoDet() {
      if (this.seleccionDet.length > 0) {
        console.log('Iniciando proceso de guardado para todos los objetos seleccionados...')
        for (let i = 0; i < this.seleccionDet.length; i++) {
          const currentSelection = this.seleccionDet[i]
          // Buscar el índice del elemento actual en ordenesDet
          const indexInOrdenesDet = this.ordenesDet.findIndex(
            (item) =>
              item.osNumDoc === currentSelection.osNumDoc &&
              item.osDetPosicion === currentSelection.osDetPosicion
          )

          // Si el elemento actual existe en ordenesDet, llamar a SaveDet con su índice correspondiente
          if (indexInOrdenesDet !== -1) {
            // Clonar el elemento para evitar modificar el original
            const editedItemDet = Object.assign({}, this.ordenesDet[indexInOrdenesDet])
            // Actualizar los valores del elemento clonado con los valores de currentSelection
            editedItemDet.prod_id = currentSelection.idProducto
            editedItemDet.unidad_id = currentSelection.unidad_id
            editedItemDet.marca_id = currentSelection.idMarca
            editedItemDet.osDetCantidad = currentSelection.DetCantidad || 0
            editedItemDet.osDetPrecio = currentSelection.precio || 0
            editedItemDet.osDetDescuento = currentSelection.DetDescuento || 0.0
            editedItemDet.osDetSubtotal = currentSelection.DetSubtotal || 0
            editedItemDet.osDetIVA = currentSelection.DetIVA || 0
            editedItemDet.osDetTotal = currentSelection.total || 0
            editedItemDet.osDetActivo = currentSelection.activo

            // Asignar el índice actual al editedIndexDet
            this.editedIndexDet = indexInOrdenesDet
            // Asignar el elemento actualizado a editedItemDet
            this.editedItemDet = editedItemDet

            // Llamar a la función SaveDet con el objeto actualizado
            this.SaveDet(editedItemDet)
            // Imprimir un mensaje en la consola para indicar que se llamó a SaveDet para el objeto actual
            console.log(`SaveDet llamado para el objeto ${i + 1}:`, editedItemDet)
          }
        }
        console.log('Proceso de guardado finalizado para todos los objetos seleccionados.')
      }
    },
    ///guarda cambios en la seleccion

    /* async guardaCambiosProdLista() {
      this.isEditing = true
      this.editedIndexProd = this.PorductoSelected.length // Asignando el conteo de objetos
      if (this.PorductoSelected.length > 0) {
        for (let i = 0; i < this.PorductoSelected.length; i++) {
          this.editedItemProd = Object.assign({}, this.PorductoSelected[i]) // Clonando el objeto seleccionado en cada iteración
          await this.guardaEnLista() // Llama a la función guardaEnLista() con las propiedades de editedItemProd
        }
        await this.obtenerListaDet(this.editedItemProd.idLista)
      }
    },*/

    //FUNCIONES PARA TABLA DETALLE DE ORDEN
    /*EDITA CAMBIOS DE LOS OBJETOS SELECCIONADOS*/
    async guardaCambiiosProdCelda(row) {
      let jwt = await getValidToken(this)
      this.error = ''
      this.editedItemDet.osNumDoc = row.osNumDoc
      let prod_id = row.prod_id
      let osDescripcion = row.osDescripcion
      let unidad_id = row.unidad_id_det
      let marca_id = row.marca_id
      let osDetCantidad = row.osDetCantidad
      let osDetPrecio = row.osDetPrecio
      let osPorcDcto = row.osPorcDcto
      let osDetDescuento = row.osDetDescuento
      let osDetSubTotal = row.osDetSubtotal
      let osDetIVA = row.osDetIVA
      let osDetTasaIVA = row.osDetTasaIVA
      let osDetTotal = row.osDetTotal
      let osDetActivo = row.osDetActivo

      let body = {
        prod_id: prod_id,
        osDescripcion: osDescripcion,
        unidad_id: unidad_id,
        marca_id: marca_id,
        osDetCantidad: osDetCantidad,
        osDetPrecio: osDetPrecio,
        osPorcDcto: osPorcDcto,
        osDetDescuento: osDetDescuento,
        osDetSubtotal: osDetSubTotal,
        osDetTasaIVA: osDetTasaIVA,
        osDetIVA: osDetIVA,
        osDetTotal: osDetTotal,
        osDetActivo: osDetActivo,
      }

      let payload = {
        jwt: jwt,
        body: body,
        id: this.editedItemDet.osNumDoc,
        posicion: row.osDetPosicion,
      }
      let body2 = {
        prod_ultMarca: marca_id,
        prod_ultProv: this.editedItem.prov_id,
        prod_ultPrecio: osDetPrecio,
      }
      let payload2 = {
        jwt: jwt,
        body: body2,
        id: prod_id,
      }
      /// payload.id = prod_id
      this.$store.dispatch('producto/editUltimoProducto', payload2)

      this.$store
        .dispatch('ordencompra/editOrdenDet', payload)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se actualizo con éxito',
          })
        })
        .catch((err) => {
          this.error = err
        })

      ///////////////////////

      if (this.error === '') {
        //this.loading = true
        await this.obtenerOrdenesDet(this.editedItemDet.osNumDoc)
        this.$nextTick(() => {
          this.$refs.multipleTableDetalleOrden.clearSelection()
          this.seleccionDet = []
        })
      } else {
        this.$store.commit('ALERT', {
          color: 'error',
          text: this.error,
        })
      }
    },
    async guarDaCambiosOrdenDet() {
      if (this.seleccionDet.length > 0) {
        this.loading = true
        let jwt = await getValidToken(this)
        this.error = ''
        this.editedItemDet.osNumDoc = this.seleccionDet[0].osNumDoc
        for (var i in this.seleccionDet) {
          let prod_id = this.seleccionDet[i].prod_id
          let osDescripcion = this.seleccionDet[i].osDescripcion
          let unidad_id = this.seleccionDet[i].unidad_id_det
          let marca_id = this.seleccionDet[i].marca_id
          let osDetCantidad = this.seleccionDet[i].osDetCantidad
          let osDetPrecio = this.seleccionDet[i].osDetPrecio
          let osPorcDcto = this.seleccionDet[i].osPorcDcto
          let osDetDescuento = this.seleccionDet[i].osDetDescuento
          let osDetSubTotal = this.seleccionDet[i].osDetSubtotal
          let osDetIVA = this.seleccionDet[i].osDetIVA
          let osDetTasaIVA = this.seleccionDet[i].osDetTasaIVA
          let osDetTotal = this.seleccionDet[i].osDetTotal
          let osDetActivo = this.seleccionDet[i].osDetActivo

          let body = {
            prod_id: prod_id,
            osDescripcion: osDescripcion,
            unidad_id: unidad_id,
            marca_id: marca_id,
            osDetCantidad: osDetCantidad,
            osDetPrecio: osDetPrecio,
            osPorcDcto: osPorcDcto,
            osDetDescuento: osDetDescuento,
            osDetSubtotal: osDetSubTotal,
            osDetTasaIVA: osDetTasaIVA,
            osDetIVA: osDetIVA,
            osDetTotal: osDetTotal,
            osDetActivo: osDetActivo,
          }

          let payload = {
            jwt: jwt,
            body: body,
            id: this.seleccionDet[i].osNumDoc,
            posicion: this.seleccionDet[i].osDetPosicion,
          }
          let body2 = {
            prod_ultMarca: this.editedItemDet.marca_id,
            prod_ultProv: this.editedItem.prov_id,
            prod_ultPrecio: osDetPrecio,
          }
          let payload2 = {
            jwt: jwt,
            body: body2,
            id: prod_id,
          }
          /// payload.id = prod_id
          this.$store.dispatch('producto/editUltimoProducto', payload2)
          this.$store
            .dispatch('ordencompra/editOrdenDet', payload)
            .then(() => {
              if (this.PorductoSelected.length > 1) {
                this.$store.commit('ALERT', {
                  color: 'success',
                  text: 'Los registros se actualizaron con éxito',
                })
              } else {
                this.$store.commit('ALERT', {
                  color: 'success',
                  text: 'El registro se actualizo con éxito',
                })
              }
            })
            .catch((err) => {
              this.error = err
            })

          this.loading = true
        }
        ///////////////////////

        if (this.error === '') {
          this.loading = true
          await this.obtenerOrdenesDet(this.editedItemDet.osNumDoc)
          this.$nextTick(() => {
            this.$refs.multipleTableDetalleOrden.clearSelection()
            this.seleccionDet = []
          })
        } else {
          this.$store.commit('ALERT', {
            color: 'error',
            text: this.error,
          })
        }
      }
    },
    /******************************************* */
    /*   FUNCIONES SELECCION OBJETOS EN TABLAS  */
    /***************************************** */
    /*SELECCION DE CELDA DETALLE DE ORDEN*/
    handleCurrentChangeDetalleOrden(val) {
      this.currentRow = val
    },
    /*SELECCIONA Y ALACENA OBJETOS DE LA TABLA DETALLE DE ORDEN*/
    handleSelectionChangeDetalleOrden(val) {
      this.seleccionDet = val
      console.log(this.seleccionDet)
    },
    /*SELECCIONA OBJETO AL HACER CLICK PARA EDITAR CELDA DE LA TABLAD ETALLE DE ORDEN*/
    handleRowDblClickDetalleOrden(row) {
      this.editingRowId = row.id
      this.isEditing = true

      this.$nextTick(() => {
        this.$refs.multipleTableDetalleOrden.toggleRowSelection(row)
      })
    },
    //PESTAÑA PRODUCTOS EN LISTADO DE PROVEEDOR
    handleSelectionChangeListProv(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length > 0) {
        if (this.filteredOrdenesDet.length >= this.tamañoGrupo) {
          this.$message.error('La orden ya tiene el límite máximo de productos.')
          // Desmarcar el objeto seleccionado
          this.$refs.multipleTableProductoListaEnDetalle.toggleRowSelection(
            this.multipleSelection[0]
          )
          this.multipleSelection = []
          return
        }
      }
      //console.log('multipleSelection det', this.multipleSelection)
    },

    handleCurrentChangeListProv(val) {
      this.currentRow = val
    },
    handleRowDblClickListProv(row) {
      //
      if (this.multipleSelection.length > 0) {
        if (this.filteredOrdenesDet.length >= this.tamañoGrupo) {
          this.$message.error('La orden ya tiene el límite máximo de productos.')
          // Desmarcar el objeto seleccionado
          this.$refs.multipleTableProductoListaEnDetalle.toggleRowSelection(row)
          return
        }
      }
      this.$nextTick(() => {
        this.$refs.multipleTableProductoListaEnDetalle.toggleRowSelection(row)
      })

      this.calculaTotal(row)
    },
    ///TODOS LOS PRODUCTO EN PESTAÑA DETALLE DE ORDEN
    ChangeProdTodosEnDet(val) {
      this.multipleSelectionProd = val
      if (this.multipleSelectionProd.length > 0) {
        if (this.filteredOrdenesDet.length >= this.tamañoGrupo) {
          this.$message.error('La orden ya tiene el límite máximo de productos.')
          // Desmarcar el objeto seleccionado
          this.$refs.ProductoTodsDetalle.toggleRowSelection(this.multipleSelectionProd[0])
          return
        }
      }
    },
    CurrentChangeProdTodosEnDet(val) {
      this.currentRow = val
    },
    RowDblClickProdTodosEnDet(row) {
      if (this.multipleSelectionProd.length > 0) {
        if (this.filteredOrdenesDet.length >= this.tamañoGrupo) {
          this.$message.error('La orden ya tiene el límite máximo de productos.')
          // Desmarcar el objeto seleccionado
          this.$refs.ProductoTodsDetalle.toggleRowSelection(row)
          return
        }
      }
      this.$nextTick(() => {
        this.$refs.ProductoTodsDetalle.toggleRowSelection(row)
      })
      this.calculaTotalTodos(row)
    },
    /*RowDblClickProdTodosEnDet(row) {
    // Verificar si el prod_id ya existe en ordenesDet
    const existe = this.ordenesDet.some(detalle => detalle.prod_id === row.prod_id);

    if (existe) {
        // Mostrar un mensaje indicando que el prod_id ya existe en ordenesDet
        alert("El producto ya ha sido seleccionado en la orden.");

        // No permitir la selección del objeto
        return;
    }

    // Permitir la selección del objeto si no existe en ordenesDet
    this.$nextTick(() => {
        this.$refs.ProductoTodsDetalle.toggleRowSelection(row);
    });
},*/
    /*RowDblClickProdTodosEnDet(row) {
      this.$nextTick(() => {
        this.$refs.multipleTableProductoTodDet.toggleRowSelection(row)
      })
      /*if (row.DetCantidad > 0) {
        // Verifica si el objeto ya existe en this.multipleSelectionProd
        const index = this.multipleSelectionProd.findIndex((item) => item.id === row.id)
        console.log('totdos productos pestaña detalle', this.multipleSelectionProd)
        if (index === -1) {
          // Si el objeto no existe, agrégalo a this.multipleSelectionProd
          this.multipleSelectionProd.push(row)
          //this.$refs.multipleTableProductoTodDet.toggleRowSelection(row)
        }
      } else {
        // Si DetCantidad es 0 o vacío, elimina el objeto de this.multipleSelectionProd
        this.multipleSelectionProd = this.multipleSelectionProd.filter((item) => item.id !== row.id)
        console.log('eliminado', this.multipleSelectionProd)
      }*/
    //},

    ///PESTAÑA  LOS PRODUCTOS EN Listado por proveedor
    handleSeelectionProducto(val) {
      this.PorductoSelected = val
      console.log('   handleSeelectionProducto en lista', this.PorductoSelected)
    },
    handleCurrentChangeProducto(val) {
      this.currentRow = val
    },
    handleRowDblClickProductos(row) {
      this.editingRowId = row.id
      this.isEditing = true
      // Seleccionar automáticamente la fila
      this.$nextTick(() => {
        this.$refs.multipleTableProductos.toggleRowSelection(row)
      })
    },
    //TODOS LOR PRODUCTOS EN TABLA AGREGAR PRODUCTOS A LISTA DE PROVEEDOR
    SelectionProductoTable(val) {
      this.PorductoSelected = val
    },
    CurrentChangeProductoTable(val) {
      this.currentRow = val
    },
    RowDblClickProductoTable(row) {
      this.editingRowId = row.id
      this.isEditing = true
      this.$nextTick(() => {
        this.$refs.multipleTableProductoTable.toggleRowSelection(row)
      })
    },

    /********************************* ****/
    /*   FUNCIONES DE CAMBIO DE PESTAÑAS  */
    /************************************ */
    //verificar cerrar pestaña tab principal
    handleTabClickPrincipal() {
      // Si hay selección múltiple activa y el usuario intenta cambiar de pestaña
      //PESTAÑA DETALLE DE ORDEN
      if (this.seleccionDet.length > 0) {
        // Mostrar mensaje de advertencia
        this.$confirm(
          '¿Estás seguro de cambiar de pestaña? Se perderá la selección anterior.',
          'Advertencia',
          {
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            type: 'warning',
          }
        )
          .then(() => {
            this.seleccionDet = []
            this.$refs.multipleTableDetalleOrden.clearSelection()
            this.$message({
              type: 'success',
              message: 'Se limpio la selección...',
            })
          })
          .catch(() => {
            // Cancelado, mantener pestaña actual
            this.activeTab = 'segundo'
            this.$message({
              type: 'info',
              message: 'Selección conservada...',
            })
          })
      }
      //PESTAÑA PRODUCTOS EN PROVEEDOR
      if (this.multipleSelection.length > 0) {
        // Mostrar mensaje de advertencia
        this.$confirm(
          '¿Estás seguro de cambiar de pestaña? Se perderá la selección anterior.',
          'Advertencia',
          {
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            type: 'warning',
          }
        )
          .then(() => {
            // Confirmado, limpiar selección múltiple y cambiar de pestaña
            //selecion de productos disponibles en lsita de proveedor
            this.multipleSelection = []
            this.$refs.multipleTableProductoListaEnDetalle.clearSelection()

            this.$message({
              type: 'success',
              message: 'Se limpio la selección...',
            })
          })
          .catch(() => {
            // Cancelado, mantener pestaña actual
            this.activeTab = 'segundo'
            this.$message({
              type: 'info',
              message: 'Selección conservada...',
            })
          })
      }
      //PESTAÑA TODOS PRODUCTOS EN DETALLE
      if (this.multipleSelectionProd.length > 0) {
        // Mostrar mensaje de advertencia
        this.$confirm(
          '¿Estás seguro de cambiar de pestaña? Se perderá la selección anterior.',
          'Advertencia',
          {
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            type: 'warning',
          }
        )
          .then(() => {
            this.multipleSelectionProd = []
            this.$refs.ProductoTodsDetalle.clearSelection()
            this.$message({
              type: 'success',
              message: 'Se limpio la selección...',
            })
          })
          .catch(() => {
            // Cancelado, mantener pestaña actual
            this.activeTab = 'segundo'
            this.$message({
              type: 'info',
              message: 'Selección conservada...',
            })
          })
      }
      //PESTAÑA LISTA PRECIOS PRINCIPAL
      if (this.PorductoSelected.length > 0) {
        // Mostrar mensaje de advertencia
        this.$confirm(
          '¿Estás seguro de cambiar de pestaña? Se perderá la selección anterior.',
          'Advertencia',
          {
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            type: 'warning',
          }
        )
          .then(() => {
            this.multipleSelectionProd = []
            this.$refs.multipleTableProductos.clearSelection()
            this.$refs.multipleTableProductoTable.clearSelection()
            this.$message({
              type: 'success',
              message: 'Se limpio la selección...',
            })
          })
          .catch(() => {
            // Cancelado, mantener pestaña actual
            this.activeTab = 'tercero'
            this.$message({
              type: 'info',
              message: 'Selección conservada...',
            })
          })
      }
    },
    //verificar cerrar pestaña dentro detalle
    handleTabClick() {
      // Si hay selección múltiple activa y el usuario intenta cambiar de pestaña
      //PESTAÑA DETALLE DE ORDEN
      if (this.seleccionDet.length > 0) {
        // Mostrar mensaje de advertencia
        this.$confirm(
          '¿Estás seguro de cambiar de pestaña? Se perderá la selección anterior.',
          'Advertencia',
          {
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            type: 'warning',
          }
        )
          .then(() => {
            this.seleccionDet = []
            this.$refs.multipleTableDetalleOrden.clearSelection()
            this.$message({
              type: 'success',
              message: 'Se limpio la selección...',
            })
          })
          .catch(() => {
            // Cancelado, mantener pestaña actual
            this.activeNameDet = 'firstDet'
            this.$message({
              type: 'info',
              message: 'Selección conservada...',
            })
          })
      }
      //PESTAÑA PRODUCTOS EN PROVEEDOR
      if (this.multipleSelection.length > 0) {
        // Mostrar mensaje de advertencia
        this.$confirm(
          '¿Estás seguro de cambiar de pestaña? Se perderá la selección anterior.',
          'Advertencia',
          {
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            type: 'warning',
          }
        )
          .then(() => {
            // Confirmado, limpiar selección múltiple y cambiar de pestaña
            //selecion de productos disponibles en lsita de proveedor
            this.multipleSelection = []
            this.$refs.multipleTableProductoListaEnDetalle.clearSelection()

            this.$message({
              type: 'success',
              message: 'Se limpio la selección...',
            })
          })
          .catch(() => {
            // Cancelado, mantener pestaña actual
            this.activeNameDet = 'secondDet'
            this.$message({
              type: 'info',
              message: 'Selección conservada...',
            })
          })
      }
      //PESTAÑA TODOS PRODUCTOS EN DETALLE
      if (this.multipleSelectionProd.length > 0) {
        // Mostrar mensaje de advertencia
        this.$confirm(
          '¿Estás seguro de cambiar de pestaña? Se perderá la selección anterior.',
          'Advertencia',
          {
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            type: 'warning',
          }
        )
          .then(() => {
            this.multipleSelectionProd = []
            this.$refs.ProductoTodsDetalle.clearSelection()
            this.$message({
              type: 'success',
              message: 'Se limpio la selección...',
            })
          })
          .catch(() => {
            // Cancelado, mantener pestaña actual
            this.activeNameDet = 'treeDet'
            this.$message({
              type: 'info',
              message: 'Selección conservada...',
            })
          })
      }
    },
    async guardaCambiosProdLista() {
      // console.log("llama")
      if (this.PorductoSelected.length > 0) {
        try {
          this.loading = true
          let jwt = await getValidToken(this)
          this.editedItemProd.idLista = this.PorductoSelected[0].idLista
          this.error = ''

          for (let i in this.PorductoSelected) {
            let idLista = this.PorductoSelected[i].idLista
            let idProducto = this.PorductoSelected[i].idProducto
            let idMarca = this.PorductoSelected[i].idMarca
            let precio = this.PorductoSelected[i].precio

            let body = {
              idLista: idLista,
              idProducto: idProducto,
              idMarca: idMarca,
              precio: precio,
            }

            let payload = { jwt: jwt, body: body }

            await this.$store.dispatch('ordencompra/editDetList', payload)

            if (this.PorductoSelected.length > 1) {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'Los registros se actualizaron con éxito',
              })
            } else {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se actualizo con éxito',
              })
            }
          }
          this.$nextTick(() => {
            this.$refs.multipleTableProductoTable.clearSelection()
            this.PorductoSelected = []
            this.loading = false // Set loading to false after finished loading
          })
        } catch (err) {
          this.error = err
          this.$store.commit('ALERT', {
            color: 'error',
            text: this.error,
          })
          this.loading = false // Set loading to false if error occurs
        }
        console.log('this.editedItemProd.idLista', this.editedItemProd.idLista)
        await this.obtenerListaDet(this.editedItemProd.idLista)
      }
    },
    deleteItemProducto() {
      if (this.PorductoSelected.length > 0) {
        this.barraProceso = true
        const totalElementos = this.PorductoSelected.length
        let elementosProcesados = 0

        const idLista = this.PorductoSelected[0].idLista
        const deletePromises = []
        const userConfirm = confirm(
          '¿Está seguro que desea eliminar estos registros? Se perderán todos los datos'
        )
        if (!userConfirm) {
          return
        }
        this.loading = true // Establecer loading a true antes de eliminar los datos
        for (let i = this.PorductoSelected.length - 1; i >= 0; i--) {
          const det = this.PorductoSelected[i]
          const index = this.ListadoDetLista.findIndex(
            (item) => item.idLista === det.idLista && item.idProducto === det.idProducto
          )
          if (index !== -1) {
            deletePromises.push(this.BorraProductoLista(det.idLista, det.idProducto))
            this.ListadoDetLista.splice(index, 1)
            elementosProcesados++
            this.percentage = Math.floor((elementosProcesados / totalElementos) * 100)
          }
        }
        Promise.all(deletePromises)
          .then(() => {
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'Los registros se eliminaron con éxito',
            })
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.msg,
            })
          })
          .finally(() => {
            this.obtenerListaDetLista(idLista)
            // Establecer loading a false después de que se completa la operación
            this.PorductoSelected = []
            this.$refs.multipleTableProductos.clearSelection()
            this.loading = false
          })
      }
      this.barraProceso = false
      this.percentage = 0
    },
    async BorraProductoLista(idLista, idProducto) {
      // this.overlay = true
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt }
      payload.id = idLista + '/' + idProducto
      await this.$store
        .dispatch('ordencompra/deleteDetLis', payload)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se eliminó con éxito',
          })
          //  this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
        })
    },

    async deleteItemProductoTodo() {
      var fecha = new Date()
      this.item.fechaModifica = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      if (this.PorductoSelected.length > 0) {
        this.item = this.PorductoSelected
        const userConfirm = confirm(
          '¿Está seguro que desea eliminar este registro?, Se perderan todos los datos'
        )
        if (!userConfirm) {
          return
        }
        for (let i = this.PorductoSelected.length - 1; i >= 0; i--) {
          const det = this.PorductoSelected[i]
          if (det.idLista === det.idLista && det.idProducto) {
            let body = {
              idLista: det.idLista,
              idProducto: det.idProducto,
              activo: 0,
              modificadoPor: this.item.fechaModifica,
              modificadoEl: this.usuario.usr_id,
            }
            this.BorraProductoListaTodo(body)
          }
        }
        //this.BorraProductoLista(body)
      }
    },
    async BorraProductoListaTodo(body) {
      this.overlay = true
      this.$v.$touch()
      /*let body = {
        osNumDoc: index,
      }*/
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      // payload.id = index
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

    async saveLista() {
      this.overlay = true
      let jwt = await getValidToken(this)

      let prov = 0
      if (this.item.proveedorList.prov_id == null) {
        prov = this.item.proveedorList
      } else {
        prov = this.item.proveedorList.prov_id
      }
      //if (this.editedItemDet) {
      if (this.editedIndexProd > -1) {
        let body = {}
        //MODIFICAR
        body = {
          idProveedor: prov,
        }
        let payload = {
          jwt: jwt,
          body: body,
        }
        await this.$store
          .dispatch('ordencompra/editCabList', payload)
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
      } else {
        let body = {}
        body = {
          idProveedor: prov,
          activo: 1,
          fechaCreado: this.item.fechaCap,
          creadoPor: this.usuario.usr_id,
        }
        let payload = {
          jwt: jwt,
          body: body,
        }
        await this.$store
          .dispatch('ordencompra/addCabList', payload)
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
              // Enviar a inicio de sesión
            })
            this.overlay = false
          })
        this.closeNuevList()
        await this.obtenerListaCabTodos()
      }
      //}
    },
    recibeItemProdcuto(row) {
      // Restablecer el estado de edición

      // Resto del código para editar el ítem
      this.editingIndex = this.filteredListadoDet.indexOf(row)
      this.isEditing = true
      this.editedIndexProd = this.ListadoDet.findIndex((item) => item.id === row.id)
      this.editedItemProd = Object.assign({}, row)
      this.guardaEnLista()
      this.isEditing = false
      this.editingRowId = null // Rest
    },
    async agregaALista() {
      ///this.barraProceso = true
      // const totalElementos = this.PorductoSelected.length
      //let elementosProcesados = 0

      var fecha = new Date()
      this.item.fechaCap = this.formato(this.eFormatos.FECHA_FORMATO, fecha)

      if (this.PorductoSelected.length > 0) {
        for (let i = 0; i < this.PorductoSelected.length; i++) {
          let currentSelection = this.PorductoSelected[i]

          // Verificar si el prod_id ya está presente en ordendesDet
          const isAlreadyAdded = this.ListadoDetLista.some(
            (item) => item.idProducto === currentSelection.prod_id
          )

          if (isAlreadyAdded) {
            this.$confirm(
              `El producto  "${currentSelection.prod_descripcion}" , no se ha insertado porque ya existe en la lista.`,
              {
                confirmButtonText: 'OK',
                cancelButtonText: '',
                type: 'warning',
              }
            )
            continue // Saltar este elemento y pasar al siguiente
          }

          let Body = {
            idLista: this.item.proveedorList.idLista,
            idProducto: currentSelection.prod_id,
            idMarca: currentSelection.UltimaMarca,
            precio: currentSelection.prod_ultPrecio,
            activo: 1,
            fechaCreado: this.item.fechaCap,
            creadoPor: this.usuario.usr_id,
          }
          this.guardaEnLista(Body)

          //elementosProcesados++
          //this.percentage = Math.floor((elementosProcesados / totalElementos) * 100)
          //console.log(' this.percentage', this.percentage)
        }
        this.$refs.multipleTableProductos.clearSelection()
        this.PorductoSelected = []
        await this.obtenerListaCabTodos()
        await this.obtenerListaDetLista(this.item.proveedorList.idLista)
      } else {
        console.log('No hay elementos seleccionados.')
      }
    },
    async guardaEnLista(Body) {
      // console.log('conteo body', Object.keys(Body).length)

      // this.overlay = true
      let jwt = await getValidToken(this)
      //if (this.editedItemDet) {
      /*console.log('this.editedItemProd guarda ', this.editedItemProd)
      console.log('idLista:', this.editedItemProd.idLista)
      console.log('idProducto', this.editedItemProd.idProducto)
      console.log('this.editedIndexProd ', this.editedIndexProd)*/
      if (this.editedIndexProd > -1) {
        let body = {
          idLista: this.editedItemProd.idLista,
          idProducto: this.editedItemProd.idProducto,
          idMarca: this.editedItemProd.idMarca,
          precio: this.editedItemProd.precio,
        }
        let payload = {
          jwt: jwt,
          body: body,
        }
        await this.$store
          .dispatch('ordencompra/editDetList', payload)
          .then(() => {
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'El registro se actualizo con éxito',
            })
            //  this.overlay = false
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.msg,
              // Enviar a inicio de sesión
            })
            //this.overlay = false
          })
      } else if (Object.keys(Body).length > 0) {
        let payload = {
          jwt: jwt,
          body: Body,
        }
        await this.$store
          .dispatch('ordencompra/addDetList', payload)
          .then(() => {
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'El registro se Inserto con éxito',
            })
            //this.overlay = false
            this.$refs.multipleTableProductoTable.clearSelection()
            this.PorductoSelected = []
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.msg,
              // Enviar a inicio de sesión
            })
            // this.overlay = false
          })
      }
      // await this.obtenerListaCabTodos()
      //await this.obtenerListaDetLista(Body.idLista)

      //}
    },
    /*********************
     * DIVIDE ORDENES
     */
    async agregarProductoOrdenDiv() {
      // Seleccionar automáticamente la fila
      let cantidadNueva = Number(this.sumaCampoLista('DetCantidad'))
      let cantidadOrden = this.filteredOrdenesDet.length
      let totalCantidad = cantidadOrden + cantidadNueva
      let sobrante = totalCantidad - this.tamañoGrupo
      //console.log('cantidadNueva', cantidadNueva)
      //console.log('cantidadOrden', cantidadOrden)
      //console.log('totalCantidad', totalCantidad)

      if (this.filteredOrdenesDet.length > 0) {
        if (totalCantidad > this.tamañoGrupo) {
          if (sobrante > 1) {
            this.$message.error(
              `La selección supera por ${sobrante} productos el maximo  permitido en la orden`
            )
          }
          this.$message.error(
            `La selección supera por ${sobrante} producto el maximo permitido en la orden`
          )
          // console.log('supera', totalCantidad)
          return
        } else {
          console.log('no supera', totalCantidad)
        }
      }
      if (this.multipleSelection.length <= 0) {
        this.$message.error('Debe seleccionar al menos 1 producto.')
        return
      }
      if (this.multipleSelection.length > 0) {
        if (this.filteredOrdenesDet.length >= this.tamañoGrupo) {
          this.$message.error('La orden ya tiene el límite máximo de productos.')
          // Desmarcar el objeto seleccionado
          this.$refs.multipleTableProductoListaEnDetalle.toggleRowSelection(
            this.multipleSelection[0]
          )
          return
        }
      }
      if (this.multipleSelection.length > 0 && this.multipleSelection.length <= this.tamañoGrupo) {
        //this.overlay = true
        if (this.editedItem.osNumDoc) {
          // Si hay un osNumDoc actual
          await this.asignarElementosOS(this.multipleSelection, this.editedItem.osNumDoc)
        }
      }
      if (this.multipleSelection.length > this.tamañoGrupo) {
        const grupos = []
        // Dividir multipleSelection en grupos de 5 elementos
        for (let i = 0; i < this.multipleSelection.length; i += this.tamañoGrupo) {
          grupos.push(this.multipleSelection.slice(i, i + this.tamañoGrupo))
        }
        let nuevoOsNumDoc = this.editedItem.osNumDoc
        // Asignar los primeros 5 elementos al osNumDoc actual
        const primerGrupo = grupos.shift()
        if (primerGrupo.length > 0 && this.editedItem.osNumDoc) {
          await this.asignarElementosOS(primerGrupo, this.editedItem.osNumDoc)
          // console.log('primerGrupo', primerGrupo)
        }

        // grupos restantes
        for (const grupo of grupos) {
          // console.log('grupo restante', grupo)
          nuevoOsNumDoc++
          // console.log("nuevoOsNumDoc". nuevoOsNumDoc)
          await this.creaOrdenNueva(nuevoOsNumDoc)
          await this.asignarElementosOS(grupo, nuevoOsNumDoc)

          //let nuevoOsNumDoc = await this.obtenerUltimaPosicionDoc(nuevoOsNumDoc)
          //this.contPosicionesDoc = Number(nuevoOsNumDoc) + 1
          // nuevoOsNumDoc = this.contPosicionesDoc
        }
      }
    },
    async reinciaRow(row) {
      console.log('reincia row', row)
      if (!row.DetCantidad && row.DetCantidad > 0) {
        row.DetCantidad = 0
        this.$refs.multipleTableProductoListaEnDetalle.toggleRowSelection(row)
      }

      /*this.$nextTick(() => {
        row.DetCantidad = 0
        this.$refs.multipleTableProductoListaEnDetalle.toggleRowSelection(this.multipleSelection[0])
      })*/
    },

    async agregarProductoOrdenDivTodos() {
      let cantidadNueva = Number(this.sumaCampoListaProd('cantidad'))
      let cantidadOrden = this.filteredOrdenesDet.length
      let totalCantidad = cantidadOrden + cantidadNueva
      let sobrante = totalCantidad - this.tamañoGrupo
      // console.log('cantidadNueva', cantidadNueva)
      // console.log('cantidadOrden', cantidadOrden)
      //  console.log('totalCantidad', totalCantidad)

      if (this.filteredOrdenesDet.length > 0) {
        if (totalCantidad > this.tamañoGrupo) {
          if (sobrante > 1) {
            this.$message.error(
              `La selección supera por ${sobrante} productos el maximo  permitido en la orden`
            )
          }
          this.$message.error(
            `La selección supera por ${sobrante} producto el maximo permitido en la orden`
          )
          this.$refs.ProductoTodsDetalle.toggleRowSelection(this.multipleSelectionProd[0])
          // console.log('supera', totalCantidad)
          return
        } else {
          console.log('no supera', totalCantidad)
        }
      }
      if (this.multipleSelectionProd.length > 0) {
        if (this.filteredOrdenesDet.length >= this.tamañoGrupo) {
          this.$message.error('La orden ya tiene el límite máximo de productos.')
          // Desmarcar el objeto seleccionado
          this.$refs.ProductoTodsDetalle.toggleRowSelection(this.multipleSelectionProd[0])
          return
        }
      }
      if (
        this.multipleSelectionProd.length > 0 &&
        this.multipleSelectionProd.length <= this.tamañoGrupo
      ) {
        //this.overlay = true
        if (this.editedItem.osNumDoc) {
          // Si hay un osNumDoc actual
          await this.asignarElementosOS(this.multipleSelectionProd, this.editedItem.osNumDoc)
        }
      }

      if (this.multipleSelectionProd.length > this.tamañoGrupo) {
        const grupos = []
        // Dividir multipleSelection en grupos de 5 elementos
        for (let i = 0; i < this.multipleSelectionProd.length; i += this.tamañoGrupo) {
          grupos.push(this.multipleSelectionProd.slice(i, i + this.tamañoGrupo))
        }
        let nuevoOsNumDoc = this.editedItem.osNumDoc
        // Asignar los primeros 5 elementos al osNumDoc actual
        const primerGrupo = grupos.shift()
        if (primerGrupo.length > 0 && this.editedItem.osNumDoc) {
          await this.asignarElementosOS(primerGrupo, this.editedItem.osNumDoc)
        }

        // grupos restantes
        for (const grupo of grupos) {
          nuevoOsNumDoc++
          await this.creaOrdenNueva(nuevoOsNumDoc)
          await this.asignarElementosOS(grupo, nuevoOsNumDoc)
        }
      }
    },
    async asignarElementosOS(elementos, nuevoOsNumDoc) {
      console.log('elementos', elementos)
      //this.overlay = true
      this.barraProceso = true
      const totalElementos = elementos.length
      let elementosProcesados = 0

      for (const elemento of elementos) {
        await this.obtenerUltimaPosicion(nuevoOsNumDoc)
        if (this.contPosiciones === null) {
          this.contPosiciones = 0
        }
        this.contPosiciones = Number(this.contPosiciones) + 1
        this.osDetPosicion = this.contPosiciones

        elementosProcesados++
        this.percentage = Math.floor((elementosProcesados / totalElementos) * 100)

        const bodySelect = {
          osNumDoc: nuevoOsNumDoc,
          osDetPosicion: this.osDetPosicion,
          prod_id: elemento.idProducto || elemento.prod_id,
          unidad_id: elemento.unidad_id,
          marca_id: elemento.idMarca || elemento.UltimaMarca,
          osDetCantidad: elemento.DetCantidad || elemento.cantidad,
          osDetPrecio: elemento.precio || elemento.prod_ultPrecio,
          osPorcDcto: elemento.osPorcDcto || elemento.PorcDcto,
          osDetDescuento: elemento.osDetDescuento || elemento.DetDescuento,
          osDetSubtotal: elemento.osDetSubtotal || elemento.DetSubtotal,
          osDetTasaIVA: 16.0,
          osDetIVA: elemento.DetIVA || elemento.osDetIVA,
          osDetTotal: elemento.total || 0,
          osDetActivo: elemento.activo || elemento.prod_activo,
        }

        // Guardar el elemento
        await this.SaveDet(bodySelect)
        this.reinciaRow(elementos)
      }
      // this.overlay = false
      this.barraProceso = false
      this.percentage = 0
    },
    async creaOrdenNueva(newOsNumDoc) {
      //  this.overlay = true
      let ejercicio = ''
      if (this.editedItem.sp_ejercicio.sp_ejercicio == null) {
        ejercicio = this.editedItem.sp_ejercicio
      } else {
        ejercicio = this.editedItem.sp_ejercicio.sp_ejercicio
      }
      let tipoAdjudicacion = ''
      if (this.editedItem.osTipoAdjudicacion.tipo_clave == null) {
        tipoAdjudicacion = this.editedItem.osTipoAdjudicacion
      } else {
        tipoAdjudicacion = this.editedItem.osTipoAdjudicacion.tipo_clave
      }
      let generoAdjudicacion = ''
      if (this.editedItem.osgenAdjudicacion.tipo_clave == null) {
        generoAdjudicacion = this.editedItem.osgenAdjudicacion
      } else {
        generoAdjudicacion = this.editedItem.osgenAdjudicacion.tipo_clave
      }
      let concepto = ''
      if (this.editedItem.sp_concepto.tipo_clave == null) {
        concepto = this.editedItem.sp_concepto
      } else {
        concepto = this.editedItem.sp_concepto.tipo_clave
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
      /* let solicita = 0
      if (this.editedItem.osEmpSolicita.emp_id == null) {
        solicita = this.editedItem.osEmpSolicita
      } else {
        solicita = this.editedItem.osEmpSolicita.emp_id
      }*/
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
      let lugEntrega = ''
      if (this.editedItem.osLugarEntrega.tipo_descripcion == null) {
        lugEntrega = this.editedItem.osLugarEntrega
      } else {
        lugEntrega = this.editedItem.osLugarEntrega.tipo_descripcion
      }
      let body = {}
      let payload = {}
      let jwt = await getValidToken(this)

      /**/
      //MODIFICAR
      await this.obtenerOrdenesDet(newOsNumDoc)

      let descuento = Number(this.sumaCampo('osDetDescuento'))
      let iva = Number(this.sumaCampo('osDetIVA'))
      let subtotal = Number(this.sumaCampo('osDetSubtotal'))
      let total = Number(this.sumaCampo('osDetTotal'))

      if (!Number.isFinite(descuento)) descuento = 0
      if (!Number.isFinite(iva)) iva = 0
      if (!Number.isFinite(subtotal)) subtotal = 0
      if (!Number.isFinite(total)) total = 0

      body = {
        sp_id: this.sp_id || 0,
        osNumDoc: newOsNumDoc,
        osTipoDoc: this.editedItem.osTipoDoc,
        osTipoOs: this.editedItem.osTipoOs,
        osFecha: this.editedItem.osFecha,
        osEmpSolicita: 1,
        sp_ejercicio: ejercicio,
        osDescripcion: this.editedItem.osDescripcion,
        osObservacion: this.editedItem.osObservacion,
        osDirSolicita: dirSolicita,
        osDeptoSolicita: deptoSolicita,
        osDirDestino: dirDestino,
        osDeptoDestino: deptoDestino,
        osSubTotal: subtotal == undefined ? 0 : subtotal,
        osDescuento: descuento == undefined ? 0 : descuento,
        /*osIva: iva == undefined ? 0 : iva,
          osTotal: total == undefined ? 0 : total,*/
        osIva: iva == undefined ? 0 : iva,
        osTotal: total == undefined ? 0 : total,
        /*osIva: this.ivaCalculado,
          osTotal: this.TotalCalculado,*/
        osTipoAdjudicacion: tipoAdjudicacion,
        osgenAdjudicacion: generoAdjudicacion,
        prov_id: prov,
        cuecon_cuenta: cuenta,
        sp_tipo_sol: tipo_sol,
        sp_concepto: concepto,
        osEstatus: this.editedItem.osEstatus,
        osFechaLimEntrega: this.editedItem.osFechaLimEntrega,
        osLugarEntrega: lugEntrega,
        osDiasCredito: this.editedItem.osDiasCredito,
        prov_direccion: this.editedItem.prov_direccion,
        prov_ciudad: this.editedItem.prov_ciudad,
        //prov_email: this.editedItem.prov_email,
        //prov_email2: this.editedItem.prov_email2,
        //osCRFF: this.editedItem.osCRFF,
        osEmpSolFir: this.idEmpleadoSolFirma,
        osEmpAut: this.idEmpleadoAut,
      }
      payload = {
        jwt: jwt,
        body: body,
      }
      payload.id = this.editedItem.osNumDoc
      await this.$store
        .dispatch('ordencompra/addOrden', payload)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se actualizo con éxito',
          })
          this.$notify({
            title: 'Success',
            message: `Se creo una orden de compra nueva: N°: ${newOsNumDoc}`,
            type: 'success',
          })
          // this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
            // Enviar a inicio de sesión
          })
          // this.overlay = false
        })
      //CREA EL PRIMER REGISTRO EN TABLA SEGUIMIENTO FECHA_CAPTURA
      body = {
        osNumDoc: newOsNumDoc,
        osEjercicio: this.editedItem.sp_ejercicio,
        os_fecha_cap: this.editedItem.os_fecha_cap,
        os_user_cap: this.usuario.usr_id,
      }
      payload = {
        jwt: jwt,
        body: body,
      }
      await this.$store
        .dispatch('ordencompra/addSeguimiento', payload)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se Inserto con éxito',
          })
          // this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
            // Enviar a inicio de sesión
          })
          //this.overlay = false
        })
      await this.obtenerOrdenes(jwt, this.ejercicio)
      //  }
    },
    /************** */
    /* async agregarProductoOrdenDiv() {
      if (this.isEditing) {
        if (this.ordenesDet.length >= 22) {
          this.$message.error('La orden ya tiene el límite máximo de objetos.')
          return
        }
      }
      let osNumDoc = this.isEditing ? this.editedItem.osNumDoc : null
      let orderCount = 0

      while (this.multipleSelection.length > 0) {
        if (!this.isEditing || (this.isEditing && this.ordenesDet.length < 22)) {
          if (!this.isEditing || orderCount === 0) {
            orderCount++
            await this.obtenerUltimaPosicionDoc(this.editedItem.osNumDoc)
            // Crea una nueva orden con el número de orden incrementado
            this.contPosicionesDoc = Number(this.contPosicionesDoc) + 1
            let newOsNumDoc = this.contPosicionesDoc
            // Actualiza el número de orden en editedItem
            await this.creaOrdenNueva(newOsNumDoc)

            //obtiene posicion det
            await this.obtenerUltimaPosicion(this.editedItem.osNumDoc)
            if (this.contPosiciones === null) {
              this.contPosiciones = 0
            }
            this.contPosiciones = Number(this.contPosiciones) + 1
            this.osDetPosicion = this.contPosiciones
            //this.osDetPosicion = 1
          } else {
            osNumDoc++
           // await this.creaOrdenNueva(osNumDoc)
            await this.obtenerUltimaPosicion(osNumDoc)
            this.contPosiciones = Number(this.contPosiciones) + 1
            this.osDetPosicion = this.contPosiciones
            //this.osDetPosicion = 1
          }
        }
        let count = 0
        while (count < 22 && this.multipleSelection.length > 0) {
          let currentSelection = this.multipleSelection.shift()
          /*  const isAlreadyAdded = this.ordenesDet.some(
            (item) => item.prod_id === currentSelection.idProducto || currentSelection.prod_id
          )
          if (isAlreadyAdded) {
            this.$message.error(
              `El producto ${
                currentSelection.nombre_producto || currentSelection.prod_descripcion
              } ya está registrado en la orden.`
            )
            return
          }*/

    /*let BodySelect = {
            osNumDoc: osNumDoc,
            osDetPosicion: this.osDetPosicion,
            prod_id: currentSelection.idProducto || currentSelection.prod_id,
            unidad_id: currentSelection.unidad_id,
            marca_id: currentSelection.idMarca || currentSelection.UltimaMarca,
            osDetCantidad: currentSelection.DetCantidad || 0,
            osDetPrecio: currentSelection.precio || 0,
            osPorcDcto: 0,
            osDetDescuento: currentSelection.DetDescuento || 0.0,
            osDetSubtotal: currentSelection.DetSubtotal || 0,
            osDetTasaIVA: 16.0,
            osDetIVA: currentSelection.DetIVA || 0,
            osDetTotal: currentSelection.total || 0,
            osDetActivo: currentSelection.activo || currentSelection.prod_activo,
          }

          this.SaveDet(BodySelect)
          count++
          this.osDetPosicion++
        }
      }
      // Vaciar la matriz multipleSelection
      this.multipleSelection = []

      // Desmarcar las filas seleccionadas
      this.$refs.multipleTable.clearSelection()
      this.$refs.multipleTableProd.clearSelection()

      await this.obtenerOrdenesDet(this.editedItem.osNumDoc)
      //this.$refs.multipleTable.$off('row-click')
      //this.$refs.multipleTable.$on('row-click', (row) => this.handleRowDblClickPrin(row))
    },*/

    async guardaNuevoDet() {
      if (this.multipleSelection.length > 0) {
        await this.agregarProductoOrdenDiv()
      }
      if (this.multipleSelectionProd.length > 0) {
        console.log('llamaa a agregar prodcuto todo')
        await this.agregarProductoOrdenDivTodos()
      }
    },
    handleCellEdit(row) {
      // Almacena el valor editado en una propiedad del componente
      this.editedValue = row.osDetTotal
      console.log('editeValue', this.editedValue)
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      // Índices de las columnas que quieres sumar
      const columnsToSum = [
        'osDetCantidad',
        'osDetPrecio',
        'osDetDescuento',
        'osDetSubtotal',
        'osDetIVA',
        'osDetTotal',
      ]

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Total:'
          return
        }
        if (columnsToSum.includes(column.property)) {
          const values = data.map((item) => Number(item[column.property]))

          if (!values.every((value) => isNaN(value))) {
            if (column.property === 'osDetCantidad') {
              sums[index] = values.reduce((prev, curr) => {
                return prev + curr
              }, 0)
            } else {
              sums[index] =
                '$ ' +
                values
                  .reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                      return prev + curr
                    } else {
                      return prev
                    }
                  }, 0)
                  .toFixed(2) // Limitar a dos decimales
            }
          } else {
            sums[index] = 'N/A'
          }
        } else {
          sums[index] = '' // Dejar en blanco para las columnas que no se suman
        }
      })

      return sums
    },
    getSummariesServ(param) {
      const { columns, data } = param
      const sums = []
      const columnsToSum = [
        'DetCantidad',
        //'precio',
        'DetDescuento',
        'DetSubtotal',
        'DetIVA',
        'total',
      ]

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Total:'
          return
        }
        if (columnsToSum.includes(column.property)) {
          const values = data
            .filter((item) => this.multipleSelection.includes(item)) // Filter based on selection
            .map((item) => Number(item[column.property]))

          if (!values.every((value) => isNaN(value))) {
            if (column.property === 'DetCantidad') {
              sums[index] = values.reduce((prev, curr) => prev + curr, 0)
            } else {
              sums[index] =
                '$ ' +
                values
                  .reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                      return prev + value // Sum numbers, not strings
                    } else {
                      return prev
                    }
                  }, 0)
                  .toFixed(2) // Limit to two decimals
            }
          } else {
            sums[index] = '0'
          }
        } else {
          sums[index] = '' // Leave blank for columns that are not summed
        }
      })

      return sums
    },
    getSummariesTodos(param) {
      const { columns, data } = param
      const sums = []
      const columnsToSum = [
        'cantidad',
        //'prod_ultPrecio',
        'DetDescuento',
        'DetSubtotal',
        'DetIVA',
        'total',
      ]

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Total:'
          return
        }
        if (columnsToSum.includes(column.property)) {
          const values = data
            .filter((item) => this.multipleSelectionProd.includes(item)) // Filter based on selection
            .map((item) => Number(item[column.property]))

          if (!values.every((value) => isNaN(value))) {
            if (column.property === 'cantidad') {
              sums[index] = values.reduce((prev, curr) => prev + curr, 0)
            } else {
              sums[index] =
                '$ ' +
                values
                  .reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                      return prev + value // Sum numbers, not strings
                    } else {
                      return prev
                    }
                  }, 0)
                  .toFixed(2) // Limit to two decimals
            }
          } else {
            sums[index] = '0'
          }
        } else {
          sums[index] = '' // Leave blank for columns that are not summed
        }
      })

      return sums
    },
    /************** */

    /********CHANGE FILTROS********** */
    //al cambiar direccion que solicita
    onChangeDirSolicita(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      this.obtenerDeptoSolicita(value.emp_direccion)
    },
    async onChangeEjercicioCap(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      this.editedItem.sp_ejercicio = value.sp_ejercicio
    },
    async onChangeEjercicioPrinc(value) {
      let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await this.obtenerOrdenes(jwt, value.sp_ejercicio)
    },
    async onChangeEjericioOrdEnv(value) {
      let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await this.obtenerOrdenesEnv(jwt, value.sp_ejercicio)
    },
    /**
     * @description filtra los productos dependiendo de la familia
     * @return {array} arreglo
     */
    //filtra las cuentas del proveedor
    async setfilterFamilias(value) {
      //console.log('value:', value)
      await this.obtenerProuctos(value.tipo_clave)
    },

    async setfilterListado2() {
      console.log('this.item.proveedorList.idLista', this.item.proveedorList.idLista)
      const idLista = this.item.proveedorList.idLista
      await this.obtenerListaDetLista(idLista)
    },
    async setfilterListado(value) {
      //let jwt = await getValidToken(this)
      await this.obtenerListaDetLista(value.idLista)
      this.desactivaBoton = false
    },
    /**
     * @description filtra las cuentas del proveedor
     * @return {array} arreglo
     */
    //filtra las cuentas del proveedor
    async setfilterCuentas(value) {
      //C H E C A R
      // secuencia : 3
      let jwt = await getValidToken(this)
      await this.obtenerListaCab(value.prov_id)
      this.ListID = this.ListadoCab.length > 0 ? this.ListadoCab[0].idLista : 0
      this.selectionMultiple = [] // Desmarcar la selección en cada caso
      if (this.ListID === 0) {
        this.showTableList = false
        this.showTablePro = true // Si no hay elementos, podrías establecer showTablePro a true si necesitas mostrar el componente.
        this.$nextTick(() => {
          // this.selectionMultiple = []
          this.obtenerListaDet(this.ListID)
        })
      } else {
        this.showTableList = true
        this.showTablePro = false
        //this.selectionMultiple = []
        this.obtenerListaDet(this.ListID)
      }
      this.editingRowId = null

      //let casoEspecial = false
      //verificar si es caso especial, para poder escoger que folio aplica
      //let tipo_sol = this.editedItem.sp_tipo_sol.tipo_id

      //Concepto aplicando
      //Seleccionar un

      /*
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
            if (this.solpagosAfectar.length > 0) {
              //Abrir nuevo modal para escoger
              this.dialogce = true
            }
          }
        }
      }
      */

      //this.dialogEditProv = false
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
        //penalim
        //await this.obtenerCuentas(jwt, 0, this.tipo_temp)

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
      if (this.editedItem.prov_RFC == null) this.editedItem.prov_RFC = value.prov_RFC
      if (value.prov_RFC === null) {
        this.snackbar = true
        this.editedItem.osDiasCredito = 0
      }
      //this.isTipo = false
      //this.isConcepto = false
      //this.isProveedor = false
    },
    // al escoger direccion solicita
    async setfilterDirSolicita(value) {
      //let jwt = await getValidToken(this)

      //Segun elnombre del empleado debe de determinar:
      //la emp_direccion a la que pertenece y el departamento
      //await this.obtenerEmpleadoSolicita(jwt, value.emp_direccion)
      this.editedItem.osDirSolicita = value.emp_direccion
      //se obtiene los departamentos de la direccion
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
      // secuencia : 2
      let jwt = await getValidToken(this)

      this.tipo_temp = value.tipo_id
      this.clave_temp = value.tipo_clave
      await this.obtenerProveedores(value.tipo_id)

      //this.editedItem.sp_pago_nombre_de = ''
      //this.isTipo = false
      //this.isConcepto = false
      //this.isProveedor = true
      await this.obtenerCuentas(jwt, this.editedItem.prov_id.prov_id, this.tipo_temp)
    },
    // al escoger familia
    async setfilterProductos(value) {
      console.log(value)
      if (!this.isEditingDet) {
        this.editedItemDet.unidad_id_det = value.unidad_id

        //console.log('value.UltimaMarca', value.UltimaMarca)
        //console.log('this.editedItemDet.marca_id', this.editedItemDet.marca_id)
        /* console.log(
          'this.editedItemDet.marca_id.tipo_clave',
          this.editedItemDet.marca_id.tipo_clave
        ) */
        if (value.prod_ultMarca != null) {
          this.editedItemDet.marca_id = value.prod_ultMarca
        }
      }
    },
    //al cambiar CheckBox de Productos en el Detalle
    onChangeAllProd(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      //if (this.chkAllProd) {
      if (value) {
        this.obtenerProuctos('FAMTOD')
      } else {
        this.obtenerProuctos(this.editedItem.familiaComite)
      }
    },
    /*********************** */
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
      //if (this.editedIndex > -1) {
      //EDITAR SOLICITUD DE PAGOS
      // payload.id = this.editedItem.sp_id
      //payload.ejercicio = this.editedItem.sp_ejercicio
      var year = this.editedItem.sp_ejercicio

      //console.log('year ' + year)
      await this.obtenerIdSolPagos(jwt, year)
      let sp_folio = parseInt(this.sgteIdSolPag)
      body.sp_ejercicio = year
      body.sp_id = sp_folio
      //if (this.isPreCaptura) {
      //payload.body.sp_fecha_solicitud = this.editedItem.sp_fecha_solicitud
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
      //guarda  envprecap en seguimiento de solicitud de pagos
      body = {
        sp_id: sp_folio,
        sp_ejercicio: year,
        sp_fecha_envprecap: this.sp_fecha_envprecap,
        sp_user_envprecap: this.usuario.usr_id,
      }
      payload = {
        jwt: jwt,
        body: body,
      }
      await this.$store
        .dispatch('solpago/editCampoSol', payload)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se realizo con éxito',
          })
          this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
        })
      //guarda ACTUALIZA SEGUIMIENTO AL EDITAR
      body = {
        osNumDoc: osNumDoc,
        osEjercicio: year,
        os_fecha_envpre: fecha_envpre,
        os_user_envpre: this.usuario.usr_id,
        sp_id: sp_folio,
      }
      payload = {
        jwt: jwt,
        body: body,
      }
      await this.$store.dispatch('ordencompra/editSeguimiento', payload).then(() => {
        this.$store.commit('ALERT', {
          color: 'success',
          text: 'El registro se realizo con éxito',
        })
      })
      try {
        await this.obtenerOrdenes(jwt, this.ejercicio)
        this.close()
      } catch (error) {
        console.error('Error:', error)
      }

      //}
    },

    async validaExisteOrden(muestraMensaje = true) {
      let existe = false
      if (Number(this.editedItem.osNumDoc) > 0)
        existe = await this.verificarOrden(this.editedItem.osNumDoc)

      if (existe) {
        //Indicar que ya existe, seleccionar y regregresar foco
        if (muestraMensaje) {
          this.$store.commit('ALERT', {
            color: 'error',
            text: 'Ya Existe el Documento: ' + this.editedItem.osNumDoc,
            // Enviar a inicio de sesión
          })
        }
        this.existeOrden = true
        this.focusField('osNumDoc')

        //this.existeOrden = false
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
              // Enviar a inicio de sesión
            })
          })
      } else {
        //Verificar Cabecero
        param = osNumDoc
        payload = { jwt: jwt, params: param }
        await this.$store
          .dispatch('ordencompra/fetchOrden', payload)
          .then((response) => {
            //this.ordenes = response.data
            if (response.data.length > 0) resultado = true

            //this.isLoading = false
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }

      return resultado
    },
    checkValidation() {
      console.log('Proveedor List Validation:', this.$v.item.proveedorList)
    },
    validandoCamposCreaLista() {
      this.validaCampos = true
      if (!this.$v.item.proveedorList.$dirty) {
        // Si el campo no ha sido modificado, no lo marcamos como inválido
        return
      }
      if (
        Array.isArray(this.$v.item.proveedorList.$model) &&
        this.$v.item.proveedorList.$model.length === 0
      ) {
        this.validaCampos = false
      }
    },
    validandoCampos() {
      this.validaCampos = true
      if (
        this.editedItem.osNumDoc != '' &&
        (this.$v.editedItem.osTipoAdjudicacion.$model != '' ||
          this.$v.editedItem.osTipoAdjudicacion.$model.tipo_clave != '') &&
        this.$v.editedItem.prov_id.$model != '' &&
        //this.$v.editedItem.osDirSolicita.$model != '' &&
        this.$v.editedItem.osDeptoSolicita.$model != '' &&
        this.$v.editedItem.osDirDestino.$model != '' &&
        this.$v.editedItem.osDeptoDestino.$model != '' &&
        // this.$v.editedItem.osEmpSolicita.$model != '' &&
        this.$v.editedItem.osgenAdjudicacion.$model != '' &&
        this.$v.editedItem.prov_RFC.$model != ''
        //&& this.editedItem.osDescripcion != ''
      ) {
        this.validaCampos = false
      }
    },
    /**
     * @description Elimina una orden de compra
     * @param {object} item elemento seleccionado
     */
    //Elimina una orden de compra

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
      var fecha = new Date()
      this.os_fecha_can = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      this.$v.$touch()
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
        osNumDoc: index,
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

    /*eliminaDatosTabla() {
      if (this.seleccionDet.length > 0) {
        this.item = this.seleccionDet
        const index = this.seleccionDet
        const userConfirm =
          confirm('¿Está seguro que desea eliminar este registro?, Se perderan todos los datos') &&
          this.ordenesDet.splice(index, 1)
        if (!userConfirm) {
          return
        }
        for (let i = this.seleccionDet.length - 1; i >= 0; i--) {
          const det = this.seleccionDet[i]
          if (det.osNumDoc === det.osNumDoc && det.osDetPosicion) {
            this.BorrarOrDet(det.osNumDoc + '/' + det.osDetPosicion)
              this.loading = true;
          }
        }
        this.BorrarOrDet(this.item.osNumDoc + '/' + this.item.osDetPosicion)
      }
    },*/
    eliminaDatosTabla() {
      this.barraProceso = true
      const totalElementos = this.seleccionDet.length
      let elementosProcesados = 0

      if (this.seleccionDet.length > 0) {
        const deletePromises = []

        const userConfirm = confirm(
          '¿Está seguro que desea eliminar estos registros?, Se perderán todos los datos'
        )
        if (!userConfirm) {
          return
        }

        this.loading = true // Establecer loading a true antes de eliminar los datos
        for (let i = this.seleccionDet.length - 1; i >= 0; i--) {
          const det = this.seleccionDet[i]
          const index = this.ordenesDet.findIndex(
            (item) => item.osNumDoc === det.osNumDoc && item.osDetPosicion === det.osDetPosicion
          )
          if (index !== -1) {
            deletePromises.push(this.BorrarOrDet(det.osNumDoc + '/' + det.osDetPosicion))
            this.ordenesDet.splice(index, 1)
            elementosProcesados++
            this.percentage = Math.floor((elementosProcesados / totalElementos) * 100)
          }
        }

        Promise.all(deletePromises)
          .then(() => {
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'Los registros se eliminaron con éxito',
            })
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.msg,
            })
          })
          .finally(() => {
            this.loading = false // Establecer loading a false después de que se completa la operación
            this.$refs.multipleTableDetalleOrden.clearSelection()
            this.obtenerOrdenesDet(this.editedItem.osNumDoc)
            this.barraProceso = false
            this.percentage = 0
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

          this.$refs.multipleTableDetalleOrden.clearSelection()
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
        })
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
    cancelNLista(isSure) {
      console.log('cancelDet(isSure)')
      console.log(isSure, isSure)
      this.isSureDet = isSure
      if (this.isSureDet) {
        this.closeDet(false)
        this.changedDet = false
      }
    },
    async closeNuevList(checkbox) {
      if (checkbox == undefined) checkbox = false
      this.isSureDet = false
      this.checkboxDet = checkbox
      if (!this.checkboxDet) {
        this.dialogCreaLista = false
        this.isEditingDet = false
      }
      this.$nextTick(() => {
        this.item = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$v.$reset()
    },

    //Verificar Cambios en el Dialog Detalle
    checkChangesDet() {
      console.log('checkChangesDet()')
      if (this.changedDet) {
        this.isSureDet = true
      } else {
        this.dialogDetalle = false
        this.isEditing = false
        //this.closeDet(false)
        this.changedDet = false
      }
    },
    // Cerrar el formulario del Dialogo Detalle
    async closeDet(checkbox) {
      //console.log('closeDet(checkbox)')
      //console.log('checkbox', checkbox)

      if (checkbox == undefined) checkbox = false
      this.isSureDet = false
      this.checkboxDet = checkbox
      if (!this.checkboxDet) {
        //this.dialogDet = false
        //this.isEditingDet = false
        this.multipleSelection = []
        this.multipleSelectionProd = []
        //await this.obtenerOrdenesDet(this.editedItem.osNumDoc)
      }
      await this.$nextTick(() => {
        if (this.editedItem.osNumDoc != undefined) {
          this.nuevaCapturaDet(this.dialogDet)
        }

        //this.editedItemDet = Object.assign({}, this.defaultItemDet)
        //this.editedIndexDet = -1
        //this.nuevaCapturaDet()
        //var fecha = new Date()
        //this.editedItem.sp_fecha_solicitud = this.fechaformato(fecha)
      })
      this.$v.$reset()
    },

    /********************************
     * ACTUALIZA OBJETOS AL EDITAR DESDE CELDA
     */
    guardaCambiosPestañasDetLista(row) {
      this.ActualizaProducto(row)
      this.calculaTotal(row)
    },
    guardarCambios(row) {
      this.ActualizaProducto(row)
      this.calculaTotalTodos(row)
    },
    //GUARDA CAMBIOS DE DETALLE DE ORDEN AL EDITAR CELDA Y HACER CLICK
    llamaCambiosCalculo(row) {
      this.CalcularDetalle(row)
      this.guardaCambiiosProdCelda(row)
    },
    async ActualizaProducto(row) {
      let jwt = await getValidToken(this)
      let body = {
        prod_ultMarca: null,
        prod_ultProv: 0,
        prod_ultPrecio: row.precio || row.prod_ultPrecio,
      }
      //console.log('body Actualiza Articulo', body2)
      let payload = {
        jwt: jwt,
        body: body,
      }
      payload.id = row.idProducto || row.prod_id
      this.$store.dispatch('producto/editUltimoProducto', payload)
      await this.obtenerListaDetLista(this.editedItem.prov_id)
      let bodyProd = {
        idLista: row.idLista || this.ListadoDet[0].idLista,
        idProducto: row.idProducto || row.prod_id,
        precio: row.precio || row.prod_ultPrecio,
      }

      let payloadProd = { jwt: jwt, body: bodyProd }

      await this.$store
        .dispatch('ordencompra/editDetList', payloadProd)

        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'Producto actualizado con Exito',
          })
          this.refs.multipleTableProductoListaEnDetalle.clearSelection()
          this.multipleSelection = []
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
            // Enviar a inicio de sesión
          })
        })
      this.muestraPanel = false
    },

    /*************** */
    //Calcular el detalle
    CalcularDetalle(row) {
      this.editedItemDet = row
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
    //calcula de tabla todos productos en detalle
    calculaTotalTodos(row) {
      this.editedItemDet = row
      this.editedItemDet.DetDescuento = 0
      this.editedItemDet.PorcDcto = 0
      this.editedItemDet.total = 0

      if (!row.cantidad && row.cantidad !== 0) {
        this.$set(row, 'cantidad', 1)
        this.$refs.ProductoTodsDetalle.toggleRowSelection(row)
      }
      if (
        !(Number(this.editedItemDet.PorcDcto) == 0 && Number(this.editedItemDet.DetDescuento) == 0)
      ) {
        if (Number(this.editedItemDet.PorcDcto) != 0) {
          this.editedItemDet.DetDescuento =
            (Number(this.editedItemDet.PorcDcto) / 100) *
            (Number(this.editedItemDet.cantidad) * Number(this.editedItemDet.prod_ultPrecio))
        }
        if (Number(this.editedItemDet.DetDescuento) != 0) {
          this.editedItemDet.PorcDcto =
            (Number(this.editedItemDet.DetDescuento) /
              (Number(this.editedItemDet.cantidad) * Number(this.editedItemDet.prod_ultPrecio))) *
            100
        }
      }
      this.descuentoCalculado = this.editedItemDet.DetDescuento
      this.editedItemDet.DetSubtotal =
        Number(this.editedItemDet.cantidad) * Number(this.editedItemDet.prod_ultPrecio) -
        Number(this.editedItemDet.DetDescuento)
      let tasaIVA = 16
      if (this.editedItemDet.DetTasaIVA) {
        tasaIVA = this.editedItemDet.DetTasaIVA
      }

      this.subTotalCalculado = this.editedItemDet.DetSubtotal
      this.editedItemDet.DetIVA = (Number(tasaIVA) / 100) * Number(this.editedItemDet.DetSubtotal)

      this.ivaCalculado = this.editedItemDet.DetIVA
      this.editedItemDet.total =
        Number(this.editedItemDet.DetSubtotal) + Number(this.editedItemDet.DetIVA)

      this.TotalCalculado = this.editedItemDet.total
      row.total = this.TotalCalculado

      /*if (!this.multipleSelectionProd.push(row)) {
        this.multipleSelectionProd.push(row)
        console.log('seleccion calculo Prod', this.multipleSelectionProd)
      }*/
    },
    //calcula de tabla lista proveedor con productos en detalle

    calculaTotal(row) {
      this.editedItemDet = row
      this.editedItemDet.DetDescuento = 0
      this.editedItemDet.PorcDcto = 0
      this.editedItemDet.total = 0

      //this.totalTotal = Number(this.sumaCampoLista('tot'))
      if (!row.DetCantidad && row.DetCantidad !== 0) {
        row.DetCantidad = 1
        this.$refs.multipleTableProductoListaEnDetalle.toggleRowSelection(row)
      }

      if (
        !(Number(this.editedItemDet.PorcDcto) == 0 && Number(this.editedItemDet.DetDescuento) == 0)
      ) {
        if (Number(this.editedItemDet.PorcDcto) != 0) {
          this.editedItemDet.DetDescuento =
            (Number(this.editedItemDet.PorcDcto) / 100) *
            (Number(this.editedItemDet.DetCantidad) * Number(this.editedItemDet.precio))
        }
        if (Number(this.editedItemDet.DetDescuento) != 0) {
          this.editedItemDet.PorcDcto =
            (Number(this.editedItemDet.DetDescuento) /
              (Number(this.editedItemDet.DetCantidad) * Number(this.editedItemDet.precio))) *
            100
        }
      }
      this.descuentoCalculado = this.editedItemDet.DetDescuento
      this.editedItemDet.DetSubtotal =
        Number(this.editedItemDet.DetCantidad) * Number(this.editedItemDet.precio) -
        Number(this.editedItemDet.DetDescuento)
      let tasaIVA = 16
      if (this.editedItemDet.DetTasaIVA) {
        tasaIVA = this.editedItemDet.DetTasaIVA
      }

      this.subTotalCalculado = this.editedItemDet.DetSubtotal
      this.editedItemDet.DetIVA = (Number(tasaIVA) / 100) * Number(this.editedItemDet.DetSubtotal)

      this.ivaCalculado = this.editedItemDet.DetIVA
      this.editedItemDet.total =
        Number(this.editedItemDet.DetSubtotal) + Number(this.editedItemDet.DetIVA)

      this.TotalCalculado = this.editedItemDet.total
      row.total = this.TotalCalculado

      /*if (!this.multipleSelection.push(row)) {
        this.multipleSelection.push(row)
      }
      /*this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })*/
      /*if (!this.multipleSelectionProd.push(row)) {
        this.multipleSelectionProd.push(row)
        console.log('seleccion calculo Prod', this.multipleSelectionProd)
      }
      /* this.$nextTick(() => {
        this.$refs.multipleTableProductoTodDet.toggleRowSelection(row)
      })*/
    },
    formatoDetalle() {
      //FORMATOS
      //Precio
      /*
      this.editedItemDet.osDetPrecio = this.formato(
        this.eFormatos.MONEDA_RIGHT,
        this.editedItemDet.osDetPrecio
      )
      //Descuento
      this.editedItemDet.osDetDescuento = this.formato(
        this.eFormatos.MONEDA_RIGHT,
        this.editedItemDet.osDetDescuento
      )
      //Iva
      this.editedItemDet.osDetIVA = this.formato(
        this.eFormatos.MONEDA_RIGHT,
        this.editedItemDet.osDetIVA
      )
      */
      //SubTotal
      /* this.editedItemDet.osDetSubtotal = this.formato(
        this.eFormatos.MONEDA_RIGHT,
        this.editedItemDet.osDetSubtotal
      )

      //Total
      this.editedItemDet.osDetTotal = this.formato(
        this.eFormatos.MONEDA_RIGHT,
        this.editedItemDet.osDetTotal
      )*/
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

      console.log('this.familiaAct: ', this.familiaAct)
      if (this.familiaAct != '') {
        this.editedItemDet.familia_id = this.familiaAct
        this.obtenerProuctos(this.familiaAct)
      } else {
        this.obtenerProuctos()
      }
      this.chkAllProd = false
      this.dialogDet = valorDialog
      this.formatoDetalle()
    },

    async nuevaCapturaDet(valorDialog) {
      //Verificar si esta guardada la orden de compra
      await this.validaExisteOrden(false)
      //console.log('this.existeOrden', this.existeOrden)
      if (!this.existeOrden) {
        //validaciones
        //let band = this.$computed.validando
        this.validandoCampos()
        //console.log('bandValidaCampos', this.bandValidaCampos)
        if (this.bandValidaCampos) {
          //Datos Capturados completos
          //Grabar
          console.log('GRABAR SIN MENSJAES')
          this.nuevaCapturaDetFin(valorDialog)
        } else {
          //mandar a pestaña de captura !
          this.tabs = 0
          //focus a N° de orden de compra
          this.focusField('osNumDoc')
          //console.log('this.tab', this.tabs)
        }
      } else {
        this.nuevaCapturaDetFin(valorDialog)
      }
    },

    /***********************
     * FUNCIONES PARA OBTENER
     */
    async obtenerUsuario() {
      let jwt = await getValidToken(this)
      let payload = {
        jwt: jwt,
        //id: this.usuario.id,
        id: this.usuario.usr_id,
      }
      if (jwt !== null) {
        this.$store
          .dispatch('user/fetchUsersId', payload)
          .then((response) => {
            //this.usuarios = response.data
            //console.log(response.data)
            this.profileUsr = response.data
            //console.log(this.profileUsr)
            //this.isLoading = false
            //console.log(this.editedItem.imagen.avatar)
            /*             if (this.editedItem.imagen.avatar == undefined) {
              this.editedItem.imagen.avatar = this.urlSinImagen
            }
 */
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    /**
     * @description Obtiene los conceptos para la solicitud de pago
     * @return {array} arreglo con todaos los conceptos
     */
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene los conceptos de comite
     * @return {array} arreglo con todaos los conceptos de comite
     */
    //Obtiene Todas las Cuentas
    async obtenerCuentas(prov, tipo) {
      this.isLoading = true
      let params = null
      let opcion = 0
      let jwt = await getValidToken(this)
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
    /**
     * @description Obtiene las departamentos que Destino
     * @return {array} arreglo con todas los departamentos que Destino
     */
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene las departamentos que solicitan
     * @return {array} arreglo con todas los departamentos que solicitan
     */
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene las direcciones que solicitan
     * @return {array} arreglo con todas las direcciones que solicitan
     */
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene las Direcciones que solicitan
     * @return {array} arreglo con todas las Direcciones
     */
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
    /**
     * @description Obtiene Loe empleados que solicitan
     * @return {array} arreglo con todas las Empleados
     */
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene los Generos de Adjudicacion
     * @return {array} arreglo con todos los generos de adjudicacion
     */
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene lugares de entrega para  Ordenes de compra
     * @return {array} arreglo con todas los lugares para las Ordendes de compra
     */
    //Obtiene Lugares de Emtrega para Ordenes de compra
    async obtenerLugaresEntrega() {
      this.isLoading = true
      let params = null

      //params ='filtro?campo1=t.clatip_id&tipo1=igual&valor1=LUGENT&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      params = "t.clatip_id = 'LUGENT'/t.tipo_orden"

      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.lugaresEntrega = []
        await this.$store
          //.dispatch('tipo/fetchTipo', payload)
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene las Ordenes de compra
     * @return {array} arreglo con todaos las Ordendes de compra
     */
    async obtenerOrdenes(jwt, ejercicio) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=osTipoDoc&tipo1=igual&valor1=COMPRA&logico2=and&campo2=osEstatus&tipo2=igual&valor2=CAP_OS&logico3=and&campo3=sp_ejercicio&tipo3=igual&valor3=' +
        ejercicio
      if (jwt != null) {
        this.ordenes = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchOrden', payload)
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
    /**
     * @description Obtiene las Ordenes de compra enviadas a pago
     * @return {array} arreglo con todaos las Ordendes de compra
     */
    async obtenerOrdenesEnv(jwt, ejercicio) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=osTipoDoc&tipo1=igual&valor1=COMPRA&logico2=and&campo2=osEstatus&tipo2=igual&valor2=ENVPAG&logico3=and&campo3=sp_ejercicio&tipo3=igual&valor3=' +
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
    /**
     * @description Obtiene los Proveedores
     * @return {array} arreglo con todos los proveedores
     */
    //Obtiene los Proveedores
    async obtenerProveedores(tipo) {
      this.isLoading = true
      let jwt = await getValidToken(this)
      //solo los proveedores que tengan el tipo = proveedor
      //let param = 'filtro?campo1=prov_tipo&tipo1=igual&valor1=tipproveed'
      let param = tipo
      if (jwt != null) {
        let payload = { jwt: jwt, params: param }
        await this.$store
          //.dispatch('proveedor/fetchProveedor', payload)
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene los tipos de adjudicacion
     * @return {array} arreglo con todos los tipos de adjudicacion
     */
    //Obtiene los tipos de adjudicacion
    async obtenerTipoAdjudica() {
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene las Marcas
     * @return {array} arreglo con todos las Marcas
     */
    async obtenerFamilias() {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=FAMPROD&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'

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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene las tasa de ivas activas
     * @return {array} arreglo con todas las tasa de ivas
     */
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene las Marcas
     * @return {array} arreglo con todos las Marcas
     */
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
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene las Ordenes de compra Detalle
     * @return {array} arreglo con todaos las Ordendes de compra Detalle de un folio especifico
     */
    async obtenerOrdenesDet(osNumDoc) {
      this.loading = true
      let params = null
      params =
        'filtro?campo1=osDetActivo&tipo1=igual&valor1=1&logico2=and&campo2=osNumDoc&tipo2=igual&valor2=' +
        osNumDoc
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.ordenesDet = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchOrdenDet', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ordenesDet = response.data
            }

            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene los productos
     * @return {array} arreglo con todos los productos
     */
    async obtenerProuctos(familia) {
      this.loading = true
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
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    async obtenerProuctosTodos(familia) {
      this.loading = true
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
            this.productosTodos = response.data
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    async obtenerListaDet(idLista) {
      this.loading = true
      let params = null
      params =
        'filtro?campo1=idLista&tipo1=igual&valor1=' +
        idLista +
        '&logico2=and&campo2=activo&tipo2=igual&valor2=1'
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.ListadoDet = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchListDet', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ListadoDet = response.data
            }

            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    async obtenerListaDetLista(idLista) {
      this.loading = true
      let params = null
      params =
        'filtro?campo1=idLista&tipo1=igual&valor1=' +
        idLista +
        '&logico2=and&campo2=activo&tipo2=igual&valor2=1'
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.ListadoDetLista = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchListDet', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ListadoDetLista = response.data
            }

            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    async obtenerListaSelect() {
      this.loading = true
      let params = null
      params = 'filtro?campo1=activo&tipo1=igual&valor1=1'
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.ListadoCabSelect = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchListCab', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ListadoCabSelect = response.data
            }

            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    async obtenerListaCabTodos() {
      this.loading = true
      let params = null
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.ListadoCabPrincipal = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchListCab', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ListadoCabPrincipal = response.data
            }

            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    async obtenerListaCab(idProv) {
      this.loading = true
      let params = null
      params =
        'filtro?campo1=idProveedor&tipo1=igual&valor1=' +
        idProv +
        '&logico2=and&campo2=activo&tipo2=igual&valor2=1'
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.ListadoCab = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchListCab', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ListadoCab = response.data
            }

            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    async obtenerUltimaPosicion(numdoc) {
      //console.log('obtenerUltimaPosicion()', numdoc)
      //console.log('this.contPosiciones', this.contPosiciones)
      this.isLoading = true
      let params = numdoc

      //params ='filtro?campo1=t.clatip_id&tipo1=igual&valor1=UNIPROD&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'

      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        //this.contPosiciones = 0
        await this.$store
          .dispatch('ordencompra/fetchUltimaPosicion', payload)
          .then((response) => {
            //console.log('response.data', response.data)
            //console.log('response.data.ultimaposicion', response.data[0].ultimaposicion)
            this.contPosiciones = response.data[0].ultimaposicion
            //this.unidades = response.data
            this.isLoading = false
          })
          .catch((err) => {
            //console.log('err', err)
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    async obtenerUltimaPosicionDoc(numdoc) {
      //console.log('obtenerUltimaPosicion()', numdoc)
      //console.log('this.contPosiciones', this.contPosiciones)
      this.isLoading = true
      let params = numdoc

      //params ='filtro?campo1=t.clatip_id&tipo1=igual&valor1=UNIPROD&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'

      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        //this.contPosiciones = 0
        await this.$store
          .dispatch('ordencompra/fetchUltimaPosicionDoc', payload)
          .then((response) => {
            //console.log('response.data', response.data)
            //console.log('response.data.ultimaposicion', response.data[0].ultimaposicion)
            this.contPosicionesDoc = response.data[0].ultimaposicion
            //this.unidades = response.data
            this.isLoading = false
          })
          .catch((err) => {
            //console.log('err', err)
            this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
    },
    /**
     * @description Obtiene las unidades
     * @return {array} arreglo con todos las unidades
     */
    async obtenerUnidades() {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=UNIPROD&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'

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
              // Enviar a inicio de sesión
            })
          })
      }
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
              // Enviar a inicio de sesión
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
    /********************************************* */
    async save() {
      //this.overlay = true

      //if (this.changed) {

      // this.dialogDetalle = false
      setTimeout(() => {
        this.overlay = true
        //this.dialogDetalle = true
        this.isEditing = true
      }, 1000)
      setTimeout(() => (this.overlay = false), 2000)
      let ejercicio = ''
      if (this.editedItem.sp_ejercicio.sp_ejercicio == null) {
        ejercicio = this.editedItem.sp_ejercicio
      } else {
        ejercicio = this.editedItem.sp_ejercicio.sp_ejercicio
      }
      let tipoAdjudicacion = ''
      if (this.editedItem.osTipoAdjudicacion.tipo_clave == null) {
        tipoAdjudicacion = this.editedItem.osTipoAdjudicacion
      } else {
        tipoAdjudicacion = this.editedItem.osTipoAdjudicacion.tipo_clave
      }
      let generoAdjudicacion = ''
      if (this.editedItem.osgenAdjudicacion.tipo_clave == null) {
        generoAdjudicacion = this.editedItem.osgenAdjudicacion
      } else {
        generoAdjudicacion = this.editedItem.osgenAdjudicacion.tipo_clave
      }
      let concepto = ''
      if (this.editedItem.sp_concepto.tipo_clave == null) {
        concepto = this.editedItem.sp_concepto
      } else {
        concepto = this.editedItem.sp_concepto.tipo_clave
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
      /* let solicita = 0
      if (this.editedItem.osEmpSolicita.emp_id == null) {
        solicita = this.editedItem.osEmpSolicita
      } else {
        solicita = this.editedItem.osEmpSolicita.emp_id
      }*/
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
      let lugEntrega = ''
      if (this.editedItem.osLugarEntrega.tipo_descripcion == null) {
        lugEntrega = this.editedItem.osLugarEntrega
      } else {
        lugEntrega = this.editedItem.osLugarEntrega.tipo_descripcion
      }

      console.log('this.TotalCalculado,', this.TotalCalculado)
      console.log('this.editedItemDet.osDetIVA', this.ivaCalculado)
      let body = {}
      let payload = {}
      let jwt = await getValidToken(this)

      if (this.multipleSelection.length > this.tamañoGrupo) {
        console.log('llama funcion')
      }

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
        if (total > 0) {
          var opcion = confirm(
            'Desea Imprimir la orden de servicio: ' + this.editedItem.osNumDoc + ' ?'
          )
          var opcion2 = confirm('Desea Salir de la captura de Orden de servicio?')
          if (opcion) {
            imprimeFormatoOrdenCompra(this.editedItem.osNumDoc, this)
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
          osEmpSolicita: 1,
          sp_ejercicio: ejercicio,
          osDescripcion: this.editedItem.osDescripcion,
          osObservacion: this.editedItem.osObservacion,
          osDirSolicita: dirSolicita,
          osDeptoSolicita: deptoSolicita,
          osDirDestino: dirDestino,
          osDeptoDestino: deptoDestino,
          osSubTotal: subtotal == undefined ? 0 : subtotal,
          osDescuento: descuento == undefined ? 0 : descuento,
          /*osIva: iva == undefined ? 0 : iva,
          osTotal: total == undefined ? 0 : total,*/
          osIva: iva == undefined ? 0 : iva,
          osTotal: total == undefined ? 0 : total,
          /*osIva: this.ivaCalculado,
          osTotal: this.TotalCalculado,*/
          osTipoAdjudicacion: tipoAdjudicacion,
          osgenAdjudicacion: generoAdjudicacion,
          prov_id: prov,
          cuecon_cuenta: cuenta,
          sp_tipo_sol: tipo_sol,
          sp_concepto: concepto,
          osEstatus: this.editedItem.osEstatus,
          osFechaLimEntrega: this.editedItem.osFechaLimEntrega,
          osLugarEntrega: lugEntrega,
          osDiasCredito: this.editedItem.osDiasCredito,
          prov_direccion: this.editedItem.prov_direccion,
          prov_ciudad: this.editedItem.prov_ciudad,
          //prov_email: this.editedItem.prov_email,
          //prov_email2: this.editedItem.prov_email2,
          //osCRFF: this.editedItem.osCRFF,
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
              // Enviar a inicio de sesión
            })
            //this.overlay = false
          })
      } else {
        //NUEVO
        body = {
          osNumDoc: this.editedItem.osNumDoc,
          osTipoDoc: this.editedItem.osTipoDoc,
          osTipoOs: this.editedItem.osTipoOs,
          osFecha: this.editedItem.osFecha,
          osEmpSolicita: 1,
          sp_ejercicio: ejercicio,
          osDescripcion: this.editedItem.osDescripcion,
          osObservacion: this.editedItem.osObservacion,
          osDirSolicita: dirSolicita,
          osDeptoSolicita: deptoSolicita,
          osDirDestino: dirDestino,
          osDeptoDestino: deptoDestino,
          osSubTotal: 0,
          osDescuento: 0,
          osIva: 0,
          osTotal: 0,
          osTipoAdjudicacion: tipoAdjudicacion,
          osgenAdjudicacion: generoAdjudicacion,
          prov_id: prov,
          cuecon_cuenta: cuenta,
          sp_tipo_sol: tipo_sol,
          sp_concepto: concepto,
          osEstatus: this.editedItem.osEstatus,
          //osCRFF: this.editedItem.osCRFF,
          osFechaLimEntrega: this.editedItem.osFechaLimEntrega,
          osLugarEntrega: lugEntrega,
          osDiasCredito: this.editedItem.osDiasCredito,
          prov_direccion: this.editedItem.prov_direccion,
          prov_ciudad: this.editedItem.prov_ciudad,
          osEmpSolFir: this.idEmpleadoSolFirma,
          osEmpAut: this.idEmpleadoAut,
        }
        payload = {
          jwt: jwt,
          body: body,
        }
        //console.log('body en CREAR', body)
        await this.$store
          .dispatch('ordencompra/addOrden', payload)
          .then(() => {
            //this.editedItem.osNumDoc = response.data.id
            //this.editedItem= response.data
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'El registro se Inserto con éxito',
            })
            //this.overlay = false
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.msg,
              // Enviar a inicio de sesión
            })
            this.overlay = false
          })
        //CREA EL PRIMER REGISTRO EN TABLA SEGUIMIENTO FECHA_CAPTURA
        body = {
          osNumDoc: this.editedItem.osNumDoc,
          osEjercicio: this.editedItem.sp_ejercicio,
          os_fecha_cap: this.editedItem.os_fecha_cap,
          os_user_cap: this.usuario.usr_id,
        }
        payload = {
          jwt: jwt,
          body: body,
        }
        await this.$store
          .dispatch('ordencompra/addSeguimiento', payload)
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
              // Enviar a inicio de sesión
            })
            //this.overlay = false
          })
        //enviar item a editItem(item) para cargar el dialogo en forma de edicion
        let item = {
          osNumDoc: this.editedItem.osNumDoc,
          osTipoDoc: this.editedItem.osTipoDoc,
          osTipoOs: this.editedItem.osTipoOs,
          osFecha: this.editedItem.osFecha,
          osEmpSolicita: 1,
          sp_ejercicio: ejercicio,
          osDescripcion: this.editedItem.osDescripcion,
          osObservacion: this.editedItem.osObservacion,
          osDirSolicita: dirSolicita,
          osDeptoSolicita: deptoSolicita,
          osDirDestino: dirDestino,
          osDeptoDestino: deptoDestino,
          osSubTotal: 0,
          osDescuento: 0,
          osIva: 0,
          osTotal: 0,
          osTipoAdjudicacion: tipoAdjudicacion,
          osgenAdjudicacion: generoAdjudicacion,
          prov_id: prov,
          cuecon_cuenta: cuenta,
          sp_tipo_sol: tipo_sol,
          sp_concepto: concepto,
          osEstatus: this.editedItem.osEstatus,
          osFechaLimEntrega: this.editedItem.osFechaLimEntrega,
          osLugarEntrega: lugEntrega,
          osDiasCredito: this.editedItem.osDiasCredito,
          prov_direccion: this.editedItem.prov_direccion,
          prov_ciudad: this.editedItem.prov_ciudad,
          osEmpSolFir: this.idEmpleadoSolFirma,
          osEmpAut: this.idEmpleadoAut,
        }
        this.editItem(item)
      }

      //  this.overlay = false
      this.changed = false
      //this.obtenerOrdenes()
      //NO SALIR
      console.log('SE CUMPLE EL NO SALIR')
      await this.validaExisteOrden(false)
      if (this.existeOrden) {
        //this.editItem(this.editedItem)
        this.editedIndex = this.editedItem.osNumDoc
        this.existeOrden = false
        this.isEditing = true
      }
      await this.obtenerOrdenes(jwt, this.ejercicio)

      /*if (this.isEditing) {
        setTimeout(() => {
          this.overlay = true
        }, 1000)
        setTimeout(() => {
          this.overlay = false
          this.close(this.checkbox)
        }, 2000)
      }*/
      // this.close(this.checkbox)
      //}
    },
    //Grabar Detalle de Orden de compra
    async SaveDet(BodySelect) {
      //console.log('bodt', BodySelect)
      //this.overlay = true
      let jwt = await getValidToken(this)
      //this.familiaAct = this.editedItemDet.familia_id.tipo_clave
      if (this.editedItemDet) {
        /*   let producto = ''
       if (this.editedItemDet.prod_id.prod_id == null || 0) {
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
        }*/
        // console.log('this.TotalCalculado,', this.TotalCalculado)
        // console.log('this.editedItemDet.osDetIVA', this.editedItemDet.osDetIVA)
        let body = {}
        // console.log('this.TotalCalculado,', this.TotalCalculado)

        let payload = {
          jwt: jwt,
          body: body,
        }
        if (this.editedIndexDet > -1) {
          //MODIFICAR
          body = {
            prod_id: this.editedItemDet.prod_id,
            unidad_id: this.editedItemDet.unidad_id_det,
            marca_id: this.editedItemDet.marca_id,
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
              // this.overlay = false
            })
            .catch((err) => {
              this.$store.commit('ALERT', {
                color: 'error',
                text: err.response.data.msg,
                // Enviar a inicio de sesión
              })
              //this.overlay = false
            })
        } else if (Object.keys(BodySelect).length > 0) {
          // console.log('body en if', BodySelect)

          let prov = 0
          if (this.editedItem.prov_id.prov_id == null) {
            prov = this.editedItem.prov_id
          } else {
            prov = this.editedItem.prov_id.prov_id
          }
          let body = {
            prod_ultMarca: this.editedItemDet.marca_id,
            prod_ultProv: prov,
            prod_ultPrecio: BodySelect.osDetPrecio,
          }
          //console.log('body Actualiza Articulo', body2)
          let payload2 = {
            jwt: jwt,
            body: body,
          }
          payload2.id = BodySelect.prod_id
          this.$store.dispatch('producto/editUltimoProducto', payload2)
          let payload = {
            jwt: jwt,
            body: BodySelect,
          }
          await this.$store
            .dispatch('ordencompra/addCreaDet', payload)
            .then(() => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se Inserto con éxito',
              })
              // this.overlay = false
            })
            .catch((err) => {
              this.$store.commit('ALERT', {
                color: 'error',
                text: err.response.data.msg,
                // Enviar a inicio de sesión
              })
              // this.overlay = false
            })
        }
      }
      //Actualiza Productos
      /*let prov = 0
      if (this.editedItem.prov_id.prov_id == null) {
        prov = this.editedItem.prov_id
      } else {
        prov = this.editedItem.prov_id.prov_id
      }
      console.log(" elemento.idMarca || elemento.UltimaMarca,", BodySelect.precio )
      let body = {
        prod_ultMarca: this.editedItemDet.marca_id,
        prod_ultProv: prov,
        prod_ultPrecio:  BodySelect.precio || BodySelect.prod_ultPrecio,
      }
      //console.log('body Actualiza Articulo', body2)
      let payload = {
        jwt: jwt,
        body: body,
      }
      payload.id = BodySelect.idProducto   || BodySelect.prod_id
      this.$store
        .dispatch('producto/editUltimoProducto', payload)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'El registro se Inserto con éxito',
          })
          //this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
            // Enviar a inicio de sesión
          })
          //this.overlay = false
        })*/
      await this.obtenerOrdenesDet(this.editedItem.osNumDoc)

      //console.log('DEspues de grabar')
      //await this.obtenerOrdenesDet(this.editedItem.osNumDoc)
      this.closeDet(this.checkboxDet)

      //this.changedDet = false

      //await this.iniciando()
      // }
    },

    //G E N E R A L E S
    /**
     * @description Diferentes Formatos para los campos
     * @param {object} item elemento seleccionado
     */
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
      //Al ejecutarse el focus del campo se selecciona y tomar el foco
      //Seleccionar todo el Campo
      document.getElementById(id).select()
      // nos posicionamos en el siguiente input
      document.getElementById(id).focus()
    },
    /**
     * @description Selecciona y obtiene Focus de campo
     * @param {object} item elemento seleccionado
     */
    NextField(id) {
      // Obtenemos la tecla pulsada
      //var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode
      // Si la tecla pulsada es enter (codigo ascii 13)
      //if (keyCode == 13) {
      // Si la variable id contiene "submit" salvar()
      if (id == 'submit') {
        //document.forms[0].submit()
        console.log('para grabar ???')
      } else {
        //Seleccionar todo el Campo
        document.getElementById(id).select()
        // nos posicionamos en el siguiente input
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
      //var totalAges = arr.reduce((sum, value) => (typeof value.Edad == "number" ? sum + value.Edad : sum), 0);
    },
    sumaCampoLista(key) {
      let suma = 0
      for (let x in this.multipleSelection) {
        if (key == 'DetCantidad') {
          suma += Number(this.multipleSelection[x].DetCantidad || 0)
        } else if (key == 'DetDescuento') {
          suma += Number(this.multipleSelection[x].DetDescuento)
        } else if (key == 'DetIVA') {
          suma += Number(this.multipleSelection[x].DetIVA)
        } else if (key == 'tot') {
          suma += Number(this.multipleSelection[x].total)
        } else if (key == 'DetSubtotal') {
          suma +=
            Number(this.multipleSelection[x].DetCantidad) *
              Number(this.multipleSelection[x].precio) -
            Number(this.multipleSelection[x].DetDescuento)
        }
      }
      return suma
    },
    sumaCampoListaProd(key) {
      let suma = 0
      for (let x in this.multipleSelectionProd) {
        if (key == 'cantidad') {
          suma += Number(this.multipleSelectionProd[x].cantidad || 0)
        } else if (key == 'DetDescuento') {
          suma += Number(this.multipleSelectionProd[x].DetDescuento)
        } else if (key == 'DetIVA') {
          suma += Number(this.multipleSelectionProd[x].DetIVA)
        } else if (key == 'total') {
          suma += Number(this.multipleSelectionProd[x].total)
        } else if (key == 'DetSubtotal') {
          suma +=
            Number(this.multipleSelectionProd[x].cantidad) *
              Number(this.multipleSelectionProd[x].prod_ultPrecio) -
            Number(this.multipleSelectionProd[x].DetDescuento)
        }
      }
      console.log('total', suma)
      return suma
      //var totalAges = arr.reduce((sum, value) => (typeof value.Edad == "number" ? sum + value.Edad : sum), 0);
    },
    async printItem(item) {
      this.editedItem = Object.assign({}, item)
      console.log('this.editedItem.osNumDoc', this.editedItem.osNumDoc)
      imprimeFormatoOrdenCompra(this.editedItem.osNumDoc, this)
    },

    sortCantidad(a, b) {
      return a.prod_descripcion - b.prod_descripcion
    },
  },
}
</script>

<style lang="scss" scoped>
.el-table-column.disabled {
  opacity: 0.5;
  /* ajusta la opacidad según tu preferencia */
  pointer-events: none;
  /* evita interacciones con la columna */
}

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

.resumen-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

.resumen-table {
  flex: 1;
  overflow-x: auto;
}

.total {
  text-align: end;
}

.centrado {
  text-align: center;
}

tr.custom-row {
  width: 400px;
  margin-right: 10px;
  margin-bottom: 20px;
}
</style>
