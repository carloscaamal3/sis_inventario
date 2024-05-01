<template>
  <v-container id="data-tables" tag="section">
    <base-material-card icon="mdi-monitor-eye" color="blue" inline class="px-5 py-3">
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
              hint="Seleciona Ejercicio"
              @change="onChangeEjercicioPrinc"
              return-object
            >
            </v-select>
          </v-col>
        </v-row>
      </template>
      <v-divider class="mt-3" />

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
        <template v-slot:item.estatus_nombre="{ item }">
          <v-chip class="ma-2" label :color="getColor(item.osEstatus)"  style="color: white;">
            {{ item.estatus_nombre }}
          </v-chip>
        </template>

        <!-- Acciones de la Tabla Principal -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" small @click="editItem(item)">mdi-eye</v-icon>
        </template>
      </v-data-table>
      <!--dialogo para confirmar-->
      <v-dialog v-model="dialogSeguimiento" persistent max-width="950">
        <v-card>
          <v-container>
            <div>
              <v-card-title class="headline font-weight-medium"
                >Seguimiento de órden: {{ editedItem.osNumDoc }}
              </v-card-title>
              <!--<v-card-text class="text-center font-weight-medium">Órden de compra: {{ editedItem.osNumDoc }} </v-card-text>-->
              <v-container>
                <div>
                  <!-- <v-switch v-model="reverse" label="Toggle reverse"></v-switch>-->
                  <v-timeline :reverse="reverse" dense>
                    <v-timeline-item color="#2196F3" icon="mdi-eye">
                      <p class="text-h4">Mostrar:</p>
                      <v-btn color="info" small depressed @click="all"> Todos </v-btn>
                      <v-btn color="info" small depressed @click="none"> Ninguno </v-btn>
                    </v-timeline-item>
                    <!--ESTATUS CAPTURA-->
                    <v-timeline-item :color="getColor('CAP_OS')" icon="mdi-numeric-1">
                      <v-expansion-panels v-model="panel" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_1 }} -
                              {{ itemSeguimiento.os_fecha_cap }}</span
                            >
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: FECHA DE SOLICITUD -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha de captura:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_cap }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: TIPO SOLICITUD -->
                                  <v-col cols="3" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Tipo de orden:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.osTipoOs }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Dirección Solicita: -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Dirección Solicita:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.osDirSolicita }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Dirección recibe: -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Dirección destino:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.osDirDestino }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: usuario solicita: -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Solicita:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.usr_nombres_osEmpSolFir }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: usuario Autoriza: -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Autoriza:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.usr_nombres_osEmpAut }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario Crea:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_cap }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Total-->
                                  <v-col cols="3" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Total:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.osTotal }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <!--ESTATUS ENVPRECAP-->
                    <v-timeline-item
                      icon="mdi-numeric-2"
                      :color="getColor('ENVPRE')"
                      v-if="editedItem.sp_estatus_2 != 'NO_APLICA'"
                    >
                      <v-expansion-panels v-model="panel2" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_2 }} -
                              {{ itemSeguimiento.os_fecha_envpre }}</span
                            >
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: Grupo envia Firma solicitante -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de solicitud creado:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.sp_id }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: FECHA DE SOLICITUD -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha de envio:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_envpre }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="4" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario envio:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_envpre }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <!--ESTATUS PRECAP-->
                    <v-timeline-item
                      icon="mdi-numeric-3"
                      :color="getColor('PRECAPOS')"
                      v-if="editedItem.sp_estatus_3 != 'NO_APLICA'"
                    >
                      <v-expansion-panels v-model="panel3" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_3 }} -
                              {{ itemSeguimiento.os_fecha_precap }}</span
                            >
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: Grupo envia Firma solicitante -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de solicitud:&nbsp;</p>
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
                                      <p class="label">Fecha de precaptura:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_precap }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario recibio solicitud:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_precap }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <!--ESTATUS PRELIB-->
                    <v-timeline-item
                      :color="getColor('PRELIB')"
                      icon="mdi-numeric-4"
                      v-if="editedItem.sp_estatus_4 != 'NO_APLICA'"
                    >
                      <v-expansion-panels v-model="panel4" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_4 }} -
                              {{ itemSeguimiento.os_fecha_prelib }}</span
                            >
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: Grupo envia Firma solicitante -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de solicitud:&nbsp;</p>
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
                                      <p class="label">Fecha de pre liberación:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_prelib }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_prelib }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <!--ESTATUS ENVPROV-->
                    <v-timeline-item
                      :color="getColor('ENVPROV')"
                      icon="mdi-numeric-5"
                      v-if="editedItem.sp_estatus_5 != 'NO_APLICA'"
                    >
                      <v-expansion-panels v-model="panel5" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_5 }} -
                              {{ itemSeguimiento.os_fecha_envprov }}</span
                            >
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: Grupo envia Firma solicitante -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de solicitud:&nbsp;</p>
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
                                      <p class="label">Fecha de envio a proveedor:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_envprov }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_envprov }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Coreeo Enviado-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Enviado a:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ editedItem.prov_razon_social }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <!--ESTATUS FAC-->
                    <v-timeline-item
                      :color="getColor('FAC')"
                      icon="mdi-numeric-6"
                      v-if="editedItem.sp_estatus_6 != 'NO_APLICA'"
                    >
                      <v-expansion-panels v-model="panel6" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_6 }} -
                              {{ itemSeguimiento.os_fecha_fac }}</span
                            >
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: Grupo envia Firma solicitante -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de solicitud:&nbsp;</p>
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
                                      <p class="label">Fecha de carga factura:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_fac }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_fac }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <!--ESTATUS ENVPAG-->
                    <v-timeline-item
                      :color="getColor('ENVPAG')"
                      icon="mdi-numeric-7"
                      v-if="editedItem.sp_estatus_7 != 'NO_APLICA'"
                    >
                      <v-expansion-panels v-model="panel7" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_7 }} -
                              {{ itemSeguimiento.os_fecha_envpag }}</span
                            >
                          </v-expansion-panel-header>
                          <!--envio a pago ENVPAG-->
                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: Grupo envia Firma solicitante -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de solicitud:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ editedItem.sp_id }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: envio a pago-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha de envio a pago:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_envpag }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_envpag }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <!--ESTATUS SOLPAG-->
                    <v-timeline-item
                      :color="getColor('SOLPAG')"
                      icon="mdi-numeric-8"
                      v-if="editedItem.sp_estatus_8 != 'NO_APLICA'"
                    >
                      <v-expansion-panels v-model="panel8" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_8 }} -
                              {{ itemSeguimiento.os_fecha_solpag }}</span
                            >
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: Grupo envia Firma solicitante -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de solicitud:&nbsp;</p>
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
                                      <p class="label">Fecha de solicitud pago:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_solpag }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_solpag }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <!--ESTATUS comp-->
                    <v-timeline-item
                      :color="getColor('COMP')"
                      icon="mdi-numeric-7"
                      v-if="editedItem.sp_estatus_11 != 'NO_APLICA'"
                    >
                      <v-expansion-panels v-model="panel8" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_11 }} -
                              {{ itemSeguimiento.os_fecha_envcomp }}</span
                            >
                          </v-expansion-panel-header>
                          <!--envio a comprobacion-->
                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: Grupo envia Firma solicitante -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de solicitud:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ editedItem.sp_id }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: envio a pago-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha de envio a comprobacion:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_envcomp }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_envcomp }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <!--ESTATUS PAG-->
                    <v-timeline-item
                      :color="getColor('PAG')"
                      icon="mdi-numeric-9"
                      v-if="editedItem.sp_estatus_9 != 'NO_APLICA'"
                    >
                      <v-expansion-panels v-model="panel9" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_9 }} -
                              {{ itemSeguimiento.os_fecha_pag }}</span
                            >
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: Grupo envia Firma solicitante -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de solicitud:&nbsp;</p>
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
                                      <p class="label">Fecha de pago:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_pag }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_pag }}</p>
                                    </div>
                                  </v-col>
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Ejercicio:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_ejercicio }}</p>
                                    </div>
                                  </v-col>
                                  <!---->
                                  <v-spacer></v-spacer>
                                </v-row>

                                <v-row>
                                  <v-divider class="mt-3" />
                                  <!--comienza datos de sol-->

                                  <!-- Campo TIPO DE SOLICITUD -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Tipo de solicitud:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nom_tipo_sol }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Cuenta -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Cuenta:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.cuecon_cuenta }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Fecha Solicitud -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha Solicitud:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_fecha_solicitud }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Importe -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Importe:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        $&nbsp;{{ formatPrice(itemSolPago.sp_importe) }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Fecha Factura -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha Factura:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_fecha_factura }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Numero de factura -->
                                  <v-col cols="4" class="v-text">
                                    <div style="float: left">
                                      <p class="label">No° Factura:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_no_factura }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Folio de comprobacion -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de Comprobacion:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_folio_comprobacion }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Numero de Oficio -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Num. de Oficio:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_num_oficio }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Fecha Probable de pago -->
                                  <v-col cols="12" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha Probable de Pago:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSolPago.sp_fecha_factura_prob_pago }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo CONCEPTO -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Concepto:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nom_concepto }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Proveedor -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Proveedor:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_pago_nombre_de }}</p>
                                    </div>
                                  </v-col>

                                  <!-- Campo Descripcion -->
                                  <v-col cols="12" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Descripción:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_descripcion }}</p>
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

                                  <!-- Campo Fuente financiera -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fuente Financiera:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nom_fuente_fin }}</p>
                                    </div>
                                  </v-col>

                                  <!-- Campo Empleado DIRECCION EMPLEADO SOLICITA -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Direccion Solicita:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_direccion_sol }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Empleado Solicita -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Solicita:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nombre_sol }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Empleado Autoriza -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Autoriza:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nombre_aut }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Empleado Visto Bueno -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Visto Bueno:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nombre_vobo }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Usuario Crea -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario Elaboró:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nom_user_elabora }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Fecha Crea-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha Elaborado:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_fecha_elabora }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <!--ESTATUS COMPROB-->
                    <v-timeline-item
                      :color="getColor('FINGXC')"
                      icon="mdi-numeric-8"
                      v-if="editedItem.sp_estatus_12 != 'NO_APLICA'"
                    >
                      <v-expansion-panels v-model="panel12" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_12 }} -
                              {{ itemSeguimiento.os_fecha_comprob }}</span
                            >
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: Grupo envia Firma solicitante -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de solicitud:&nbsp;</p>
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
                                      <p class="label">Fecha de comprobacion:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_comprob }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_comprob }}</p>
                                    </div>
                                  </v-col>
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Ejercicio:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_ejercicio }}</p>
                                    </div>
                                  </v-col>
                                  <!---->
                                  <v-spacer></v-spacer>
                                </v-row>

                                <v-row>
                                  <v-divider class="mt-3" />
                                  <!--comienza datos de sol-->

                                  <!-- Campo TIPO DE SOLICITUD -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Tipo de solicitud:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nom_tipo_sol }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Cuenta -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Cuenta:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.cuecon_cuenta }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Fecha Solicitud -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha Solicitud:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_fecha_solicitud }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Importe -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Importe:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        $&nbsp;{{ formatPrice(itemSolPago.sp_importe) }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Fecha Factura -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha Factura:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_fecha_factura }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Numero de factura -->
                                  <v-col cols="4" class="v-text">
                                    <div style="float: left">
                                      <p class="label">No° Factura:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_no_factura }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Folio de comprobacion -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de Comprobacion:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_folio_comprobacion }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Numero de Oficio -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Num. de Oficio:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_num_oficio }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Fecha Probable de pago -->
                                  <v-col cols="12" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha Probable de Pago:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSolPago.sp_fecha_factura_prob_pago }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo CONCEPTO -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Concepto:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nom_concepto }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Proveedor -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Proveedor:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_pago_nombre_de }}</p>
                                    </div>
                                  </v-col>

                                  <!-- Campo Descripcion -->
                                  <v-col cols="12" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Descripción:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_descripcion }}</p>
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

                                  <!-- Campo Fuente financiera -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fuente Financiera:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nom_fuente_fin }}</p>
                                    </div>
                                  </v-col>

                                  <!-- Campo Empleado DIRECCION EMPLEADO SOLICITA -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Direccion Solicita:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_direccion_sol }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Empleado Solicita -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Solicita:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nombre_sol }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Empleado Autoriza -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Autoriza:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nombre_aut }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Empleado Visto Bueno -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Visto Bueno:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nombre_vobo }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Usuario Crea -->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario Elaboró:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.nom_user_elabora }}</p>
                                    </div>
                                  </v-col>
                                  <!-- Campo Fecha Crea-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Fecha Elaborado:&nbsp;&nbsp;&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSolPago.sp_fecha_elabora }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <!--ESTATUS CANCELADO-->
                    <v-timeline-item
                      :color="getColor('CAN_OS')"
                      icon="mdi-cancel"
                      v-if="editedItem.sp_estatus_10 != 'NO_APLICA'"
                    >
                      <v-expansion-panels v-model="panel10" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            <span class="text-h5">
                              {{ editedItem.sp_estatus_10 }} -
                              {{ itemSeguimiento.os_fecha_can }}</span
                            >
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-card class="elevation-0">
                              <v-card-text>
                                <v-row>
                                  <!-- Campo: Grupo envia Firma solicitante -->
                                  <v-col cols="3" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Folio de solicitud:&nbsp;</p>
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
                                      <p class="label">Fecha de cancelacion:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">
                                        {{ itemSeguimiento.os_fecha_can }}
                                      </p>
                                    </div>
                                  </v-col>
                                  <!-- Campo: Nombre de usuario envia a firma solicitud-->
                                  <v-col cols="6" class="v-text">
                                    <div style="float: left">
                                      <p class="label">Usuario:&nbsp;</p>
                                    </div>
                                    <div>
                                      <p class="valor">{{ itemSeguimiento.usr_nombres_can }}</p>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-timeline-item>
                    <v-timeline-item color="#2196F3" icon="mdi-alpha-e">
                      <v-row>
                        <v-col cols="12">
                          <p class="label">Estatus actual:</p>
                          <v-chip label :color="getColor(editedItem.osEstatus)">
                            <span class="colorTexEstatus">{{ editedItem.estatus_nombre }}</span>
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-timeline-item>
                    <!--<v-row>
                  <v-col>
                    <p class="label">Estatus actual:</p>
                  </v-col>
                  <v-col>
                    <v-chip class="ma-2" label :color="getColor(editedItem.osEstatus)">
                      <span class="colorTexEstatus">{{ editedItem.estatus_nombre }}</span>
                    </v-chip>
                  </v-col>
                </v-row>-->
                  </v-timeline>
                </div>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="dialogSeguimiento = false">Salír</v-btn>
              </v-card-actions>
            </div>
          </v-container>
        </v-card>
      </v-dialog>
    </base-material-card>
  </v-container>
</template>
<script>
import { getValidToken } from '@/store/helpers.js'
import * as tools from '@/store/modules/tools.store.js'

export default {
  data: () => ({
    usuario: JSON.parse(localStorage.getItem('user')), //obtiene el usuario actual
    eFormatos: tools.formatos,
    dialogSeguimiento: false,
    ejercicio: 0,
    sp_ejercicio: 0,
    isEditing: false,
    reverse: false,
    editedIndex: -1,
    headers: [
      { text: 'Nº Doc', align: 'start', value: 'osNumDoc', sortable: true },
      { text: 'Tipo Doc', align: 'center', value: 'osTipoDoc', sortable: true },
      //    { text: 'Tipo Os', align: 'center', value: 'osTipoOs', sortable: true },
      { text: 'Fecha', align: 'center', value: 'osFecha', sortable: true },
      { text: 'Solicita', align: 'center', value: 'osEmpSolicitaNombre', sortable: true },
      { text: 'Descripción', align: 'center', value: 'osDescripcion', sortable: true },
      //{ text: 'Observación', align: 'center', value: 'osObservacion', sortable: true },
      //{ text: 'Comite', align: 'center', value: 'concom_descripcion', sortable: true },
      //{ text: 'Partida Gobal', align: 'center', value: 'osPartidaGlobal', sortable: true },

      //{ text: 'Partida Generica', align: 'center', value: 'osPartidaGenerica', sortable: true },
      //{ text: 'Dir Solicita', align: 'center', value: 'osDirSolicita', sortable: true },
      //{ text: 'Dir Destino', align: 'center', value: 'osDirDestino', sortable: true },
      { text: 'Total', align: 'center', value: 'osTotal', sortable: true },
      //{ text: 'Descuento', align: 'center', value: 'osDescuento', sortable: true },
      //{ text: 'IVA', align: 'center', value: 'osIva', sortable: true },
      //{ text: 'Tipo Adjudicacion', align: 'center', value: 'osTipoAdjudicacion', sortable: true },
      //{ text: 'OsAdjudicacion', align: 'center', value: 'osgenAdjudicacion', sortable: true },
      // { text: 'Proveedor ID', align: 'center', value: 'prov_razon_social', sortable: true },
      //{ text: 'cuecon_cuenta', align: 'center', value: 'cuecon_cuenta', sortable: true },
      { text: 'Estatus', align: 'center', value: 'estatus_nombre', sortable: true },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
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
      usr_nombres_envpre: '',
      tipo_clave: '',
    },
    itemSeguimiento: {
      usr_nombres_envpre: '',
      sp_id: 0,
      osNumDoc: 0,
      osEjercicio: 0,
      os_fecha_cap: null,
      os_user_cap: null,
      os_fecha_envpre: null,
      os_user_envpre: null,
      os_fecha_precap: null,
      os_user_precap: null,
      os_fecha_prelib: null,
      os_user_prelib: null,
      os_fecha_envprov: null,
      os_user_envprov: null,
      os_fecha_fac: null,
      os_user_fac: null,
      os_fecha_envpag: null,
      os_user_envpag: null,
      os_fecha_solpag: null,
      os_user_solpag: null,
      os_fecha_pag: null,
      os_user_pag: null,
      os_fecha_can: null,
      os_user_can: null,
    },
    itemSolPago: {
      sp_id: '',
      sp_tipo_sol: '',
      sp_concepto: '',
      prov_id: '',
      sp_pago_nombre_de: '',
      cuecon_cuenta: '',
      sp_descripcion: '',
      sp_observacion: '',
      sp_importe: '',
      sp_fecha_solicitud: '',
      sp_folio_comprobacion: '',
      sp_num_oficio: '',
      sp_fuente_fin: '',
      sp_user_elabora: '',
      sp_fecha_elabora: '',
      sp_no_factura: '',
      sp_fecha_factura: '',
      sp_fecha_factura_prob_pago: '',
      sp_emp_id_aut: '',
      sp_emp_id_sol: '',
      sp_direccion_sol: '',
      sp_vobo_emp_id: '',
      sp_id_gpo_firma_sol: '',
      sp_fecha_firma_sol_ida: '',
      sp_user_firma_sol_ida: '',
      sp_fecha_firma_sol_vuelta: '',
      sp_user_firma_sol_vuelta: '',
      sp_id_gpo_firma_aut_ida: '',
      sp_fecha_firma_aut_ida: '',
      sp_user_firma_aut_ida: '',
      sp_id_gpo_firma_aut_vuelta: '',
      sp_fecha_firma_aut_vuelta: '',
      sp_user_firma_aut_vuelta: '',
      sp_id_gpo_firma_aut_vuelta_gxc: '',
      sp_fecha_conta_gasxcomp: '',
      sp_user_conta_gasxcomp: '',
      sp_poliza_ejercido: '',
      sp_fecha_ejercido: '',
      sp_user_ejercido: '',
      sp_tipo_pago: '',
      sp_no_cuenta_pago: '',
      sp_banco_pago: '',
      sp_fecha_pago: '',
      sp_no_poliza_pago: '',
      sp_no_folio_pago: '',
      sp_fecha_cancelacion: '',
      sp_folio_cancela: '',
      sp_user_cancelacion: '',
      sp_poliza_ejercido_cancela: '',
      sp_id_gpo_gxc_ent_conta: '',
      sp_fecha_gxc_ent_conta: '',
      sp_user_gxc_ent_conta: '',
      sp_estatus: '',
      sp_fecha_modifica: '',
      sp_user_modifica: '',
      sp_user_pago: '',
      sp_motivo_cancelacion: '',
      solicitud_pagoscol: '',
      sp_fecha_por_cancelar: '',
      sp_user_por_cancelar: '',
      sp_motivo_por_cancelar: '',
      sp_folios_comprometido: '',
      sp_folios_devengado: '',
      sp_id_gpo_folios: '',
      sp_fecha_folios: '',
      sp_user_folios: '',
      sp_fecha_gpo_folios: '',
      sp_user_gpo_folios: '',
      sp_saldo: '',
      sp_devolucion_efectivo: '',
      sp_id_folio_afecta: '',
      sp_folio_ejercido: '',
      sp_fecha_ejercido_cap: '',
      sp_fecha_pago_cap: '',
      sp_id_gpo_ejercido: '',
      sp_fecha_envia_ejercido: '',
      sp_user_envia_ejercido: '',
      sp_id_gpo_envio_cont_np: '',
      sp_fecha_envio_cont_np: '',
      sp_user_envio_cont_np: '',
      sp_fecha_autoriza_vuelta: '',
      sp_user_autoriza_vuelta: '',
      sp_ejercicio: '',
      sp_ejercicio_afecta: '',
      sp_fecha_precaptura: '',
      sp_id_gpo_envio_cont_pre_comp: '',
      sp_fecha_envio_cont_pre_comp: '',
    },
    ejercicios: [],
    ordenes: [],
    seguimientoOrden: [],
    estatus: [],
    profileUsr: [],
    solpagos: [],
    tipos: [],
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
  }),
  async created() {
    this.Refreesca()
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(',', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    async Refreesca() {
      let jwt = await getValidToken(this)
      await this.obtenerEjercicios(jwt)

      await this.obtenerTipos(jwt)
      this.EjercicioValido()
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      if (this.tipo_clave == undefined || this.tipo_clave == 0) {
        this.tipo_clave = this.tipos[2].tipo_clave
      }
      await this.obtenerOrdenes(this.ejercicio)
      await this.obtenerEstatus(jwt)
    },
    EjercicioValido() {
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      if (this.ejercicio == 0) {
        var currentTime = new Date()
        this.ejercicio = currentTime.getFullYear()
      }
      this.editedItem.sp_ejercicio = this.ejercicio
    },
    editItem(item) {
      console.log('ENTRA A: editItem(item)', 'item: ', item)
      this.isEditing = true
      this.editedIndex = this.ordenes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.osNumDoc = this.editedItem.osNumDoc

      this.obtenerUsuario()
      if (this.profileUsr) {
        this.editedItem.usr_nombres = this.profileUsr[0].usr_nombres
        this.editedItem.usr_correo = this.profileUsr[0].usr_correo
      }
      //DETERMINA ESTATUS DE ORDEN
      this.obtenerSeguimiento(this.osNumDoc)
      this.itemSeguimiento = this.seguimientoOrden[0]
      if (this.editedItem.sp_id === null) {
        this.editedItem.sp_id == 0
      }
      //CONVIERTE FCHAS
      //this.itemSeguimiento.os_fecha_cap = this.formato(this.eFormatos.FECHA, this.itemSeguimiento.os_fecha_cap);
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_cap !== null) {
        this.itemSeguimiento.os_fecha_cap = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_cap
        )
      }
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_envpre !== null) {
        this.itemSeguimiento.os_fecha_envpre = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_envpre
        )
      }
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_precap !== null) {
        this.itemSeguimiento.os_fecha_precap = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_precap
        )
      }
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_prelib !== null) {
        this.itemSeguimiento.os_fecha_prelib = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_prelib
        )
      }
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_envprov !== null) {
        this.itemSeguimiento.os_fecha_envprov = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_envprov
        )
      }
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_fac !== null) {
        this.itemSeguimiento.os_fecha_fac = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_fac
        )
      }
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_envpag !== null) {
        this.itemSeguimiento.os_fecha_envpag = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_envpag
        )
      }
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_solpag !== null) {
        this.itemSeguimiento.os_fecha_solpag = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_solpag
        )
      }
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_pag !== null) {
        this.itemSeguimiento.os_fecha_pag = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_pag
        )
      }
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_can !== null) {
        this.itemSeguimiento.os_fecha_can = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_can
        )
      }
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_envcomp !== null) {
        this.itemSeguimiento.os_fecha_envcomp = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_envcomp
        )
      }
      if (this.itemSeguimiento && this.itemSeguimiento.os_fecha_comprob !== null) {
        this.itemSeguimiento.os_fecha_comprob = this.formato(
          this.eFormatos.FECHA,
          this.itemSeguimiento.os_fecha_comprob
        )
      }
      //this.itemSeguimiento.sp_fecha_precaprec = this.formato(this.eFormatos.FECHA, this.itemSeguimiento.sp_fecha_precaprec);

      //CAPTURA
      this.editedItem.sp_estatus_1 = this.buscarEstatus(1)
      //ENVPRECAP
      if (this.itemSeguimiento.os_fecha_envpre != null) {
        this.editedItem.sp_estatus_2 = this.buscarEstatus(2)
      } else {
        this.editedItem.sp_estatus_2 = 'NO_APLICA'
      }
      //PRECAP
      if (this.itemSeguimiento.os_fecha_precap != null) {
        this.editedItem.sp_estatus_3 = this.buscarEstatus(3)
      } else {
        this.editedItem.sp_estatus_3 = 'NO_APLICA'
      }
      //PRELIB
      if (this.itemSeguimiento.os_fecha_prelib != null) {
        this.editedItem.sp_estatus_4 = this.buscarEstatus(4)
      } else {
        this.editedItem.sp_estatus_4 = 'NO_APLICA'
      }
      //ENVPROV
      if (this.itemSeguimiento.os_fecha_envprov != null) {
        this.editedItem.sp_estatus_5 = this.buscarEstatus(5)
      } else {
        this.editedItem.sp_estatus_5 = 'NO_APLICA'
      }
      //FAC
      if (this.itemSeguimiento.os_fecha_fac != null) {
        this.editedItem.sp_estatus_6 = this.buscarEstatus(6)
      } else {
        this.editedItem.sp_estatus_6 = 'NO_APLICA'
      }
      //ENVPAG
      if (this.itemSeguimiento.os_fecha_envpag != null) {
        this.editedItem.sp_estatus_7 = this.buscarEstatus(7)
      } else {
        this.editedItem.sp_estatus_7 = 'NO_APLICA'
      }
      //SOLPAG
      if (this.itemSeguimiento.os_fecha_solpag != null) {
        this.editedItem.sp_estatus_8 = this.buscarEstatus(8)
      } else {
        this.editedItem.sp_estatus_8 = 'NO_APLICA'
      }
      //PAG
      if (this.itemSeguimiento.os_fecha_pag != null) {
        this.editedItem.sp_estatus_9 = this.buscarEstatus(9)
      } else {
        this.editedItem.sp_estatus_9 = 'NO_APLICA'
      }
      //PAG
      if (this.itemSeguimiento.os_fecha_can != null) {
        this.editedItem.sp_estatus_10 = this.buscarEstatus(10)
      } else {
        this.editedItem.sp_estatus_10 = 'NO_APLICA'
      }
      //envcompr
      if (this.itemSeguimiento.os_fecha_envcomp != null) {
        this.editedItem.sp_estatus_11 = this.buscarEstatus(11)
      } else {
        this.editedItem.sp_estatus_11 = 'NO_APLICA'
      }
      //comprobaion
      if (this.itemSeguimiento.os_fecha_comprob != null) {
        this.editedItem.sp_estatus_12 = this.buscarEstatus(12)
      } else {
        this.editedItem.sp_estatus_12 = 'NO_APLICA'
      }
      this.obtenerSolPagos(this.editedItem.sp_id, this.editedItem.sp_ejercicio)
      this.itemSolPago = this.solpagos[0]
      console.log(' this.itemSolPago', this.itemSolPago)

      this.dialogSeguimiento = true
    },
    buscarEstatus(val) {
      let Estatus = this.estatus.find((elemento) => elemento.tipo_orden == val)
      return Estatus.tipo_descripcion
      //this.editedItem.id_cta = cuenta.id_cta
    },
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

    async obtenerEstatus(jwt) {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=ESTATUSOS&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
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
    async obtenerSolPagos(sp_id, ejercicio) {
      let jwt = await getValidToken(this)
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=sp_ejercicio&tipo1=igual&valor1=' +
        ejercicio +
        '&logico2=and&campo2=sp_id&tipo2=igual&valor2=' +
        sp_id
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
    async onChangeTipoPrinc(value) {
      await this.obtenerEjercicios()
      this.tipo_clave = value.tipo_clave
      await this.obtenerOrdenes(value.sp_ejercicio, value.tipo_clave)
    },
    async onChangeEjercicioPrinc(value) {
      let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await this.obtenerOrdenes(jwt, value.sp_ejercicio)
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
    async obtenerOrdenes(ejercicio, tipo_clave) {
      let jwt = await getValidToken(this)
      //this.isLoading = true
      let params = 'filtro?campo1=sp_ejercicio&tipo1=igual&valor1=' + this.ejercicio
      if (tipo_clave) {
        params += '&logico3=and&campo3=osTipoDoc&tipo3=igual&valor3=' + this.tipo_clave
      }
      if (tipo_clave == 0) {
        params = 'filtro?campo1=sp_ejercicio&tipo1=igual&valor1=' + this.ejercicio
      }
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
    /* async obtenerOrdenes(jwt, ejercicio) {
      //this.isLoading = true
      let params = null
      params =
        'filtro?campo1=osTipoDoc&tipo1=igual&valor1=COMPRA&logico2&campo2=osTipoDoc&tipo2=igual&valor2=SERVICIO&logico3=and&campo3=sp_ejercicio&tipo3=igual&valor3=' +
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
    },*/
    async obtenerSeguimiento(osNumDoc) {
      let jwt = await getValidToken(this)
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=os.osNumDoc&tipo1=igual&valor1=' + osNumDoc
      if (jwt != null) {
        this.seguimientoOrden = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchOrdenSeg', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.seguimientoOrden = response.data
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
    getColor(osEstatus) {
      if (osEstatus == 'CAP_OS') return '#66BB6A '
      else if (osEstatus == 'ENVPRE') return '#FF8F00 '
      else if (osEstatus == 'PRECAPOS') return '#FF3D00'
      else if (osEstatus == 'PRELIB') return '#7C4DFF '
      else if (osEstatus == 'ENVPROV') return '#009688'
      else if (osEstatus == 'FAC') return '#03A9F4 '
      else if (osEstatus == 'ENVPAG') return '#3F51B5'
      else if (osEstatus == 'SOLPAG') return '#8BC34A'
      else if (osEstatus == 'COMP') return '#795548'
      else if (osEstatus == 'PAG') return '#FF5722'
      else if (osEstatus == 'CAN_OS') return '#BDBDBD'
      else if (osEstatus == 'FINGXC') return '#FFC107'
      else return 'yellow'
    },
    //control de paneles de seguimiento
    all() {
      console.log('llama funcion', this.panel)
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
      console.log('llama funcion')
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
  font-size: 14px;
  font-weight: 500;
  float: left;
  margin-top: 0px;
}
.colorTexEstatus {
  color: white;
  font-weight: bold;
}
</style>
