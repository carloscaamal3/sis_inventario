<template>
  <v-tabs fixed-tabs background-color="indigo" dark>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab @change="refrescaCaptura" key="tab1">
      <v-icon left> mdi-file-document-edit-outline </v-icon>Captura Comprometidos y Devengados
    </v-tab>
    <v-tab @change="refrescaxEnviarConta" key="tab2">
      <v-icon left> mdi-clipboard-arrow-right-outline </v-icon>Enviar Comprobaciones a Contabilidad
    </v-tab>
    <v-tab @change="refrescaEnviaConta" key="tab3">
      <v-icon left> mdi-clipboard-arrow-right-outline </v-icon>Enviar No Presupuestales a
      Contabilidad
    </v-tab>
    <v-tab @change="refrescaFolios" key="tab4">
      <v-icon right> mdi-file-document </v-icon>Folios Comprometidos y Devengados
    </v-tab>
    <v-tab @change="refrescaReimpresion1" key="tab5">
      <v-icon right> mdi-printer </v-icon>ReImpresion de Grupos
    </v-tab>
    <!-- CAPTURA COMPROMETIDOS Y DEVENGADOS -->
    <v-tab-item key="tab1">
      <base-material-card
        color="blue"
        icon="mdi-file-document-edit-outline"
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
                v-model="ejercicioCap"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioCap"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </template>
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>

        <v-row>
          <v-col cols="6">
            <!-- Empieza DataExporter CAPTURA-->
            <DataExporter
              :dataArray="solpagosExportar"
              :dataFields="fieldsCaptura"
              fileName="capturacomdev"
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

        <!-- Aqui va progress linear -->
        <v-divider class="mt-3" />
        <v-data-table
          v-model="selected"
          :single-select="singleSelect"
          item-key="sp_id"
          show-select
          :headers="headers"
          :items="solpagos"
          dense
          :search.sync="search"
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          @toggle-select-all="selectAllToggle"
          disable-pagination
          hide-default-footer
        >
          >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="folioNew(item)"> mdi-plus-thick</v-icon>
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
              :readonly="item.sp_user_folios == null"
              :disabled="item.sp_user_folios == undefined"
              @input="select($event)"
            ></v-simple-checkbox>
          </template> -->
          <template v-slot:item.data-table-select="{ item, isSelected, select }">
            <v-simple-checkbox
              :value="isSelected"
              :readonly="item.foliosDevengados != ''"
              :disabled="item.foliosDevengados == ''"
              @input="select($event)"
            ></v-simple-checkbox>
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
    </v-tab-item>
    <!-- ENVIAR A COMPROBACIONES A CONTABILIDAD -->
    <v-tab-item key="tab2">
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
                :disabled="selectedConta.length == 0"
                text
                @click="enviarConta"
                >Enviar</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="ejercicioEnvCom"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioEnvCom"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </template>
        <v-card flat>
          <v-row>
            <v-col cols="6">
              <!-- Empieza DataExporter ENVIA COMPROBACION A CONTABILIDAD-->
              <DataExporter
                :dataArray="solpagoscontaxEnvExportar"
                :dataFields="fieldsEnvCompCont"
                fileName="envcompcont"
                pdfView="none"
              />
              <!-- Termina DataExporter -->
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="search4"
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
            :headers="headers4"
            :items="solpagoscontaxEnv"
            :single-select="singleSelect"
            item-key="sp_id"
            show-select
            v-model="selectedConta"
            dense
            :search.sync="search4"
            :loading="isLoading"
            loading-text="Cargando... Espere por favor"
            class="elevation-5"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:[`item.sp_fecha_conta_gasxcomp`]="{ item }">
              <div class="name-info-title">
                {{ convierteNumeroFechaVista(item.sp_fecha_conta_gasxcomp) }}
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
          <!-- Empieza DataExporter -->
          <!-- <DataExporter :dataArray="tipos" :dataFields="fields" fileName="Tipos" /> -->
        </v-card>
      </base-material-card>
    </v-tab-item>
    <!-- ENVIAR NO PRESUPUESTALES A CONTABILIDAD -->
    <v-tab-item key="tab3">
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
                @click="enviarContaNp"
                >Enviar</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="ejercicioEnvNP"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioEnvNP"
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
                :dataArray="solpagosNpExportar"
                :dataFields="fieldsEnvNpCont"
                fileName="enviarNpCont"
                pdfView="none"
              />
              <!-- Termina DataExporter -->
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="searchNp"
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
            :headers="headersNp"
            :items="solpagosNp"
            :single-select="singleSelect"
            item-key="sp_id"
            show-select
            v-model="selected"
            dense
            :search.sync="searchNp"
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
          <!-- Empieza DataExporter -->
          <!-- <DataExporter :dataArray="tipos" :dataFields="fields" fileName="Tipos" /> -->
        </v-card>
      </base-material-card>
    </v-tab-item>
    <!-- FOLIOS COMPROMETIDOS Y DEVENGADOS -->
    <v-tab-item key="tab4">
      <base-material-card color="blue" icon="mdi-file-document" inline class="px-5 py-3">
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>
        <template v-slot:corner-button>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="ejercicioFolios"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                dense
                hint="Seleciona Ejercicio"
                @change="onChangeEjercicioFolios"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </template>

        <v-row>
          <v-col cols="6">
            <!-- Empieza DataExporter -->
            <DataExporter
              :dataArray="foliosExportar"
              :dataFields="fieldsFolios"
              fileName="folios"
              pdfView="none"
            />
            <!-- Termina DataExporter -->
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="searchf"
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
          :headers="headersf"
          :items="folios"
          dense
          :search.sync="searchf"
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            <v-icon small @click="printItem(item)">mdi-printer</v-icon>
            <v-icon small @click="editarFolio(item)">mdi-pencil</v-icon>
          </template>

          <template v-slot:[`item.folio_fecha`]="{ item }">
            <div class="name-info-title">
              {{ convierteNumeroFecha(item.folio_fecha) }}
            </div>
          </template>
          <template v-slot:item.folio_activo="{ item }">
            <Status :activostr="item.folio_activo" tipo="String" />
          </template>
          <template v-slot:item.folio_iscomprometido="{ item }">
            <Status
              :activostr="item.folio_iscomprometido"
              tipo="String"
              valorTrue="Si"
              valorFalse="No"
            />
          </template>
          <template v-slot:item.folio_isdevengado="{ item }">
            <Status
              :activostr="item.folio_isdevengado"
              tipo="String"
              valorTrue="Si"
              valorFalse="No"
            />
          </template>
          <template v-slot:item.EsComprobacion="{ item }">
            <Status :activostr="item.EsComprobacion" tipo="String" valorTrue="Si" valorFalse="No" />
          </template>

          <template v-slot:no-data>
            <!-- <v-btn color="primary">Reset</v-btn> -->
            ¡No hay datos para mostrar!
          </template>
        </v-data-table>
      </base-material-card>
    </v-tab-item>
    <!-- REIMPRESION DE GRUPOS -->
    <v-tab-item key="tab5">
      <v-tabs>
        <v-tab @change="refrescaReimpresion1"
          ><v-icon left> mdi-printer </v-icon>Enviada a firma de Autoriza</v-tab
        >
        <v-tab @change="refrescaReimpresion2"
          ><v-icon left> mdi-printer </v-icon>Enviar comprometidos y devengados</v-tab
        >
        <v-tab @change="refrescaReimpresion3"
          ><v-icon left> mdi-printer </v-icon>Enviar Gastos x comprobar a contabilidad</v-tab
        >
        <v-tab @change="refrescaReimpresion4"
          ><v-icon left> mdi-printer </v-icon>Enviar no presupuestales a contabilidad</v-tab
        >

        <!-- Enviada a firma de Autoriza -->
        <v-tab-item>
          <base-material-card color="blue" icon="mdi-printer" inline class="px-5 py-3">
            <v-card flat>
              <v-row>
                <v-col cols="6">
                  <!-- Empieza DataExporter -->
                  <DataExporter
                    :dataArray="gpoenvfirautExportar"
                    :dataFields="fieldsReImpfirAut"
                    fileName="gpoEnvFir"
                    pdfView="none"
                  />
                  <!-- Termina DataExporter -->
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="searchRfa"
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
                :headers="headersRfa"
                :items="gpoenvfiraut"
                dense
                :search.sync="searchRfa"
                :loading="isLoading"
                loading-text="Cargando... Espere por favor"
                class="elevation-5"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="printItemReimp(item, 'AUTORIZACION')">mdi-printer</v-icon>
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
        <!-- Enviar comprometidos y devengados -->
        <v-tab-item>
          <base-material-card color="blue" icon="mdi-printer" inline class="px-5 py-3">
            <v-card flat>
              <v-row>
                <v-col cols="6">
                  <!-- Empieza DataExporter -->
                  <DataExporter
                    :dataArray="gpoenvcomdevExportar"
                    :dataFields="fieldsReImpEnvComDev"
                    fileName="enviarcomdev"
                    pdfView="none"
                  />
                  <!-- Termina DataExporter -->
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="searchRcd"
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
                :headers="headersRcd"
                :items="gpoenvcomdev"
                dense
                :search.sync="searchRcd"
                :loading="isLoading"
                loading-text="Cargando... Espere por favor"
                class="elevation-5"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="printItemReimp(item, 'FOLIOS')">mdi-printer</v-icon>
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
        <!-- Enviar Gastos x comprobar a contabilidad -->
        <v-tab-item>
          <base-material-card color="blue" icon="mdi-printer" inline class="px-5 py-3">
            <v-card flat>
              <v-row>
                <v-col cols="6">
                  <!-- Empieza DataExporter -->
                  <DataExporter
                    :dataArray="gpoenvcongxcExportar"
                    :dataFields="fieldsReImpEnvConGxc"
                    fileName="enviarConGxc"
                    pdfView="none"
                  />
                  <!-- Termina DataExporter -->
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="searchRcg"
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
                :headers="headersRcg"
                :items="gpoenvcongxc"
                dense
                :search.sync="searchRcg"
                :loading="isLoading"
                loading-text="Cargando... Espere por favor"
                class="elevation-5"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="printItemReimp(item, 'CONTABILIDAD')">mdi-printer</v-icon>
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
        <!-- Enviar no presupuestales a contabilidad -->
        <v-tab-item>
          <base-material-card color="blue" icon="mdi-printer" inline class="px-5 py-3">
            <v-card flat>
              <v-row>
                <v-col cols="6">
                  <!-- Empieza DataExporter -->
                  <DataExporter
                    :dataArray="gpoenvconnpExportar"
                    :dataFields="fieldsReImpEnvNpCont"
                    fileName="enviarNpCont"
                    pdfView="none"
                  />
                  <!-- Termina DataExporter -->
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="searchRcn"
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
                :headers="headersRcn"
                :items="gpoenvconnp"
                dense
                :search.sync="searchRcn"
                :loading="isLoading"
                loading-text="Cargando... Espere por favor"
                class="elevation-5"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="printItemReimp(item, 'CONTABILIDADNP')">mdi-printer</v-icon>
                </template>

                <template v-slot:[`item.FechaEnviaPago`]="{ item }">
                  <div class="name-info-title">
                    {{ convierteNumeroFecha(item.FechaEnviaContaNp) }}
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
    <!-- Dialogos -->
    <!-- Empieza Dialogo PRINCIPAL -->
    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card class="v-text">
        <v-card-title class="v-text">
          <span class="headline">{{ formTitle }} </span>
          <!-- <v-img src="@/assets/logo_ivey.jpg" width="20%" height="20%"></v-img> -->
        </v-card-title>

        <v-card-text class="v-text">
          <v-container class="v-text">
            <v-row>
              <!-- ********************************************************************* -->
              <!-- DATOS DE CAPTURA **************************************************** -->
              <!-- Campo FOLIO NUMERO -->
              <v-col cols="6" class="v-text">
                <v-text-field
                  v-model="$v.editedItemFolio.folio_num.$model"
                  label="Folio No."
                  :error-messages="folio_numErrors"
                  :disabled="isCompPre"
                  @keypress="isNumber($event)"
                  @input="$v.editedItemFolio.folio_num.$reset(), (changed = true)"
                  @blur="$v.editedItemFolio.folio_num.$touch()"
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
                      v-model="editedItemFolio.folio_fecha"
                      label="Fecha Folio"
                      prepend-icon="mdi-calendar-month"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    locale="en-in"
                    :min="minDate"
                    :max="maxDate"
                    v-model="editedItemFolio.folio_fecha"
                    @input=";(fromDateMenu = false), (changed = true)"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <!-- Campo CONCEPTO -->
              <!-- Campo Es Compremetido -->
              <v-col cols="6" class="v-text">
                <v-checkbox
                  v-model="editedItemFolio.folio_iscomprometido"
                  :disabled="isCompPre"
                  :label="`Es Comprometido ?: ${
                    editedItemFolio.folio_iscomprometido.toString() == 'true' ? 'Si' : 'No'
                  }`"
                  @input="$v.editedItemFolio.folio_iscomprometido.$reset(), (changed = true)"
                  @blur="$v.editedItemFolio.folio_iscomprometido.$touch()"
                >
                </v-checkbox>
              </v-col>
              <!-- Campo Es Devengada -->
              <v-col cols="6" class="v-text">
                <v-checkbox
                  v-model="editedItemFolio.folio_isdevengado"
                  :disabled="isCompPre"
                  :label="`Es Devengado ?: ${
                    editedItemFolio.folio_isdevengado.toString() == 'true' ? 'Si' : 'No'
                  }`"
                  @input="$v.editedItemFolio.folio_isdevengado.$reset(), (changed = true)"
                  @blur="$v.editedItemFolio.folio_isdevengado.$touch()"
                >
                </v-checkbox>
              </v-col>
              <!-- ********************************************************************* -->
              <!-- ********************************************************************* -->
            </v-row>
          </v-container>
          <small class="v-text">*Campo Obligatorio</small>
        </v-card-text>

        <v-card-actions class="v-text">
          <v-spacer></v-spacer>
          <v-checkbox v-model="checkbox" label="Crear otro" :disabled="isEditing"></v-checkbox>
          <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
          <v-btn color="blue darken-1" text :disabled="validado" @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Termina Dialogo -->
  </v-tabs>
</template>
<script>
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { imprimeGrupo, imprimeGrupoCompDev } from '@/store/modules/impresiones.store.js'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import Status from '@/components/general/StatusInfo.vue'
import DataExporter from '@/components/general/DataExporter.vue'
import * as tools from '@/store/modules/tools.store.js'

export default {
  components: {
    ConfirmationDialog,
    Status,
    DataExporter,
  },
  data: () => ({
    eFormatos: tools.formatos,
    //Envia Np a contabilidad
    solpagosNp: [],
    solpagosNpExportar: [],
    //Comprobacion para enviar a contabilidad
    solpagosconta: [],
    solpagoscontaxEnv: [],
    usuario: JSON.parse(localStorage.getItem('user')),
    solpagoscontaxEnvExportar: [],
    sgteGpoEntConta: 0,
    selectedConta: [],
    searchNp: undefined,
    headersNp: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      //{ text: 'Cuenta', value: 'cta_clave' },
      { text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Dirección', value: 'direccion_sol' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: 'Concepto', value: 'nom_concepto' },
      //{ text: 'Fecha Solicitud', value: 'fechasol' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //REIMPRESIONES
    //Enviada a firma de Autoriza
    gpoenvfiraut: [],
    gpoenvfirautExportar: [],
    searchRfa: undefined,
    headersRfa: [
      { text: 'Grupo', align: 'start', value: 'idGrupo' },
      { text: 'Fecha', value: 'FechaEnviaFirmaAutoriza' },
      { text: 'Usuario', value: 'userEnviaFirmaAutoriza' },
      { text: 'Nombre', value: 'nombreEnviaFirmaAutoriza' },
      { text: '# Solicitudes', value: 'numelementos' },
      { text: 'Importe Grupo', value: 'totalGrupo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //Enviar comprometidos y devengados
    gpoenvcomdev: [],
    gpoenvcomdevExportar: [],
    searchRcd: undefined,
    headersRcd: [
      { text: 'Grupo', align: 'start', value: 'idGrupo' },
      { text: 'Fecha', value: 'fechaEnviaComprometidos' },
      { text: 'Usuario', value: 'UserEnviaComprometidos' },
      { text: 'Nombre', value: 'NombreEnviaComprometidos' },
      { text: '# Solicitudes', value: 'numelementos' },
      { text: 'Importe Grupo', value: 'totalGrupo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //Enviar Gastos x comprobar a contabilidad
    gpoenvcongxc: [],
    gpoenvcongxcExportar: [],
    searchRcg: undefined,
    headersRcg: [
      { text: 'Grupo', align: 'start', value: 'idGrupo' },
      { text: 'Fecha', value: 'FechaenviaContaGxC' },
      { text: 'Usuario', value: 'UserEnviaContaGxC' },
      { text: 'Nombre', value: 'NombreEnviaContaGxC' },
      { text: '# Solicitudes', value: 'numelementos' },
      { text: 'Importe Grupo', value: 'totalGrupo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //Enviar no presupuestales a contabilidad
    gpoenvconnp: [],
    gpoenvconnpExportar: [],
    searchRcn: undefined,
    headersRcn: [
      { text: 'Grupo', align: 'start', value: 'idGrupo' },
      { text: 'Fecha', value: 'FechaEnviaContaNp' },
      { text: 'Usuario', value: 'UserEnviaContaNp' },
      { text: 'Nombre', value: 'nombreEnviaContaNp' },
      { text: '# Solicitudes', value: 'numelementos' },
      { text: 'Importe Grupo', value: 'totalGrupo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //Impresiones
    solpagosimp: [],
    //
    disabledCount: 0,
    singleSelect: false,
    //
    checkbox: false,
    fromDateMenu: false,
    minDate: '2021-01-01',
    maxDate: '2050-01-31',
    //fromDateFecPoPago: false,
    //fromDateFecFact: false,
    search: undefined,
    searchf: undefined,
    search4: undefined,
    selected: [],
    dialog: false,
    //dialogxc: false,
    sgteGpoFolio: 0,
    sgteGpoFolioComp: 0,
    solpagos: [],
    solpagosExportar: [],
    folios: [],
    foliosExportar: [],

    ejercicioCap: 0,
    ejercicioEnvCom: 0,
    ejercicioEnvNP: 0,
    ejercicioFolios: 0,
    ejercicios: [],

    isCompPre: false,
    isLoading: false,
    isEditing: false,
    isSure: false,
    error: '',
    headers: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: 'No Concepto', value: 'sp_concepto' },
      { text: 'Concepto', value: 'nom_concepto' },

      //{ text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Comprometido(s)', value: 'foliosComprometidos' },
      { text: 'Devengado(s)', value: 'foliosDevengados' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headersf: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio Doc.', align: 'start', value: 'sp_id' },
      { text: 'Folio Num.', align: 'start', value: 'folio_num' },
      { text: 'Fecha Folio', value: 'folio_fecha' },
      { text: 'Comprometido', value: 'folio_iscomprometido' },
      { text: 'Devengado', value: 'folio_isdevengado' },
      { text: 'Es Comprobación', value: 'EsComprobacion' },
      { text: 'Activo', value: 'folio_activo' },
      { text: 'Grupo', value: 'sp_id_gpo_folios' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headers4: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      //{ text: 'Cuenta', value: 'cta_clave' },
      { text: 'Solicitante', value: 'nombre_sol' },
      { text: 'Concepto', value: 'nom_concepto' },
      { text: 'Recibida', value: 'sp_fecha_conta_gasxcomp' },
      //{ text: 'Fecha Solicitud', value: 'fechasol' },
      { text: 'Proveedor', value: 'sp_pago_nombre_de' },
      { text: 'Importe', value: 'sp_importe' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ], //

    editedFolioIndex: -1,
    editedItemFolio: {
      sp_ejercicio: 0,
      sp_id: 0,
      folio_id: 0,
      folio_num: 0,
      folio_iscomprometido: true,
      folio_isdevengado: true,
      folio_fecha: '',
      folio_activo: true,
    },
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
      sp_poliza_ejercido: 0,
    },
    //Para Exportar
    fieldsCaptura: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Proveedor: 'sp_pago_nombre_de',
      Fecha_Solicita: 'sp_fecha_solicitud',
      No_Concepto: 'sp_concepto',
      Concepto: 'nom_concepto',
      Importe: 'sp_importe',
    },
    fieldsEnvCompCont: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Solicitante: 'nombre_sol',
      Concepto: 'nom_concepto',
      Fecha_Recibida: 'sp_fecha_conta_gasxcomp',
      Proveedor: 'sp_pago_nombre_de',
      Importe: 'sp_importe',
    },
    fieldsEnvNpCont: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Solicitante: 'nombre_sol',
      Direccion: 'direccion_sol',
      Fecha_Solicita: 'sp_fecha_solicitud',
      Concepto: 'nom_concepto',
      Proveedor: 'sp_pago_nombre_de',
      Importe: 'sp_importe',
    },
    fieldsFolios: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      folio_Num: 'folio_num',
      Fecha_folio: 'folio_fecha',
      Comprometido: 'folio_iscomprometido',
      Devengado: 'folio_isdevengado',
      EsComprobacion: 'EsComprobacion',
      Activo: 'folio_activo',
      Grupo: 'sp_id_gpo_folios',
    },
    fieldsReImpfirAut: {
      Grupo: 'idGrupo',
      Fecha: 'FechaEnviaFirmaAutoriza',
      Usuario: 'userEnviaFirmaAutoriza',
      Nombre: 'nombreEnviaFirmaAutoriza',
      Importe_Grupo: 'totalGrupo',
    },
    fieldsReImpEnvComDev: {
      Grupo: 'idGrupo',
      Fecha: 'fechaEnviaComprometidos',
      Usuario: 'UserEnviaComprometidos',
      Nombre: 'NombreEnviaComprometidos',
      Importe_Grupo: 'totalGrupo',
    },
    fieldsReImpEnvConGxc: {
      Grupo: 'idGrupo',
      Fecha: 'FechaenviaContaGxC',
      Usuario: 'UserEnviaContaGxC',
      Nombre: 'NombreEnviaContaGxC',
      Importe_Grupo: 'totalGrupo',
    },
    fieldsReImpEnvNpCont: {
      Grupo: 'idGrupo',
      Fecha: 'FechaEnviaContaNp',
      Usuario: 'UserEnviaContaNp',
      Nombre: 'nombreEnviaContaNp',
      Importe_Grupo: 'totalGrupo',
      Numero_Elementos: 'numelementos',
    },
  }),
  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItemFolio: {
      folio_num: { required, minLength: minLength(1), maxLength: maxLength(10) },
      //folio_isdevengado: { required },
    },
    editedItem: {
      sp_motivo_cancelacion: { required },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      return this.isEditing
        ? 'Editando el Folio # ' + this.editedItem.sp_id
        : 'Captura para el Folio # ' + this.editedItem.sp_id
    },
    folio_numErrors() {
      const errors = []
      if (!this.$v.editedItemFolio.folio_num.$dirty) return errors
      !this.$v.editedItemFolio.folio_num.required && errors.push('Este campo es requerido')
      !this.$v.editedItemFolio.folio_num.minLength &&
        errors.push('Este campo debe de tener un mínimo de 1 caracteres.')
      !this.$v.editedItemFolio.folio_num.maxLength &&
        errors.push('Este campo debe de tener un máximo de 10 caracteres.')
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
    validado() {
      if (this.folio_numErrors.length == 0 && this.editedItemFolio.folio_isdevengado == 1) {
        return false
      } else {
        return true
      }
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  created() {
    this.iniciando()
    const self = this
    this.solpagos.map((item) => {
      if (item.sp_user_folios == undefined) self.disabledCount += 1
    })
  },
  methods: {
    selectAllToggle(props) {
      console.log('selectAllToggle')
      console.log(props)
      if (this.selected.length != this.solpagos.length - this.disabledCount) {
        this.selected = []
        const self = this
        props.items.forEach((item) => {
          if (!item.sp_user_folios == undefined) {
            self.selected.push(item)
          }
        })
      } else this.selected = []
    },
    //para dar formato a la tabla - no esta en uso
    itemRowBackground: function (item) {
      return item.sp_user_folios > 0 ? 'style-1' : 'style-2'
      //return item.sp_user_folios > 0 ? ':disabled:false' : ':disabled:true'
    },

    //Refrescar Captura folios
    async refrescaCaptura() {
      let jwt = await getValidToken(this)
      if (this.ejercicioCap == undefined || this.ejercicioCap == 0) {
        this.ejercicioCap = this.ejercicios[0].sp_ejercicio
      }

      await this.obtenerSolPagos(jwt, this.ejercicioCap)
    },
    //Refrescar Enviar a Contabilidad
    async refrescaEnviaConta() {
      let jwt = await getValidToken(this)
      if (this.ejercicioEnvNP == undefined || this.ejercicioEnvNP == 0) {
        this.ejercicioEnvNP = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerSolPagosNp(jwt, this.ejercicioEnvNP)
    },
    async refrescaxEnviarConta() {
      let jwt = await getValidToken(this)
      if (this.ejercicioEnvCom == undefined || this.ejercicioEnvCom == 0) {
        this.ejercicioEnvCom = this.ejercicios[0].sp_ejercicio
      }

      await this.obtenerSolPagosxEnvCont(jwt, this.ejercicioEnvCom)
    },
    //Refrescar Folios capturados
    async refrescaFolios() {
      let jwt = await getValidToken(this)
      if (this.ejercicioFolios == undefined || this.ejercicioFolios == 0) {
        this.ejercicioFolios = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerFolios(jwt, this.ejercicioFolios)
    },
    //Refrescar Reimpresion
    async refrescaReimpresion1() {
      let jwt = await getValidToken(this)
      await this.obtenerGruposFirAut(jwt)
      //await this.obtenerGruposComDev(jwt)
      //await this.obtenerGruposConGxc(jwt)
      //await this.obtenerGruposConNp(jwt)
    },
    async refrescaReimpresion2() {
      let jwt = await getValidToken(this)
      //await this.obtenerGruposFirAut(jwt)
      await this.obtenerGruposComDev(jwt)
      //await this.obtenerGruposConGxc(jwt)
      //await this.obtenerGruposConNp(jwt)
    },
    async refrescaReimpresion3() {
      let jwt = await getValidToken(this)
      //await this.obtenerGruposFirAut(jwt)
      //await this.obtenerGruposComDev(jwt)
      await this.obtenerGruposConGxc(jwt)
      //await this.obtenerGruposConNp(jwt)
    },
    async refrescaReimpresion4() {
      let jwt = await getValidToken(this)
      //await this.obtenerGruposFirAut(jwt)
      //await this.obtenerGruposComDev(jwt)
      //await this.obtenerGruposConGxc(jwt)
      await this.obtenerGruposConNp(jwt)
    },

    /*
    todosObjetosaCeros() {
      this.solpagos = []
      this.solpagoscontaxEnv = []
      this.solpagosNp = []
      this.folios = []
      this.gpoenvfiraut = []
      this.gpoenvcomdev = []
      this.gpoenvcongxc = []
      this.gpoenvconnp = []
    },
    */
    //Refresca Datos para la tabla
    async iniciando() {
      let jwt = await getValidToken(this)
      //await this.refrescaCaptura()
      while (this.solpagos.length) {
        this.solpagos.pop()
      }

      await this.obtenerEjercicios(jwt)

      if (this.ejercicioCap == undefined || this.ejercicioCap == 0) {
        this.ejercicioCap = this.ejercicios[0].sp_ejercicio
      }

      await this.obtenerSolPagos(jwt, this.ejercicioCap)
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
    //Obtener solicitudes de pago NP
    async obtenerSolPagosNp(jwt, ejercicio) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 2 and sp_estatus not in ("CANCELAR", "XCANCELAR") and ifnull(sp_id_gpo_firma_aut_ida,0) > 0 and ifnull(sp_id_gpo_envio_cont_np,0) = 0/sp_id'

      if (jwt != null) {
        //this.solpagos = []
        let payload = { jwt: jwt, params: params }
        this.solpagosNp = []
        this.selected = []
        await this.$store
          //.dispatch('solpago/fetchSolPagosCreado', payload)
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagosNp = response.data
              this.formateoInfoExportar('ENVIA_NP_CONTA')
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

    //Obtener todos los Grupos a Comprometidos y Devengados
    async obtenerGruposConNp(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params = 'sp_id_gpo_envio_cont_np > 0/sp_id_gpo_envio_cont_np/'

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoenvconnp = []
        await this.$store
          .dispatch('consulta/fetchGetGpoEnvConNp', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoenvconnp = response.data
              this.formateoInfoExportar('REIMPRESION_ENVIA_NPCONT')
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
    //Obtener todos los Grupos a Comprometidos y Devengados
    async obtenerGruposConGxc(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params = 'sp_id_gpo_gxc_ent_conta > 0/sp_id_gpo_gxc_ent_conta/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoenvcongxc = []
        await this.$store
          .dispatch('consulta/fetchGetGpoEnvConGxc', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoenvcongxc = response.data
              this.formateoInfoExportar('REIMPRESION_ENVIA_CONGXC')
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
    //Obtener todos los Grupos a Comprometidos y Devengados
    async obtenerGruposComDev(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params = 'sp_id_gpo_folios > 0/sp_id_gpo_folios/'

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoenvcomdev = []
        await this.$store
          .dispatch('consulta/fetchGetGpoEnvComDev', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoenvcomdev = response.data
              this.formateoInfoExportar('REIMPRESION_ENVIA_COMDEV')
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
    //Obtener todos los Grupos a firmas de Autoriza
    async obtenerGruposFirAut(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params = 'sp_id_gpo_firma_aut_ida > 0/sp_id_gpo_firma_aut_ida/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoenvfiraut = []
        await this.$store
          .dispatch('consulta/fetchGetGpoEnvFirAut', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoenvfiraut = response.data
              this.formateoInfoExportar('REIMPRESION_FIRMA_AUTORIZA')
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
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let solpagos1 = []
      let solpagos2 = []
      let params = null
      let payload = {}
      //console.log('Ejercicio en obtenerSolPagos(): ' + ejercicio)

      //por liberar
      /*
      params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 ' +
        'and sp_estatus not in ("CANCELAR", "XCANCELAR","PRECAP","FINPAGO","FINGXC") ' +
        '/sp_id'
      
*/
/*       params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_concepto not in (23,24) ' +
        'and sp_estatus not in ("CANCELAR", "XCANCELAR") ' +
        'and ifnull(sp_id_gpo_folios,0) = 0 and sp_fecha_precaptura is null/sp_id' */

      //RGP - 14/AGOSTO/2023
      params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_concepto not in (select ce_concepto_p from casos_especiales where ce_activo = 1) ' +
        'and sp_estatus not in ("CANCELAR", "XCANCELAR","PRECAP") ' +
        'and ifnull(sp_id_gpo_folios,0) = 0/sp_id'

      /*
       params =
        'sp_tipo_sol = 1 and sp_concepto not in (23,24) and sp_estatus not in ("CANCELAR", "XCANCELAR") and ifnull(sp_id_gpo_folios,0) = 0 and sp_ejercicio = ' +
        ejercicio +
        '/sp_id'
 */
      if (jwt != null) {
        payload = { jwt: jwt, params: params }
        await this.$store
          //.dispatch('solpago/fetchSolPagosCreado', payload)
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              solpagos1 = response.data
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

        //NUEVO - 11ABR2022

/*         params =
          'sp_ejercicio = ' +
          ejercicio +
          ' and sp_tipo_sol = 1 and sp_concepto not in (23,24) ' +
          'and sp_estatus not in ("CANCELAR", "XCANCELAR") ' +
          'and ifnull(sp_id_gpo_envio_cont_pre_comp,0) > 0 ' +
          'and ifnull(sp_id_gpo_folios,0) = 0 and sp_fecha_precaptura is not null/sp_id'
 */

        // RGP - 14/AGOSTO/2023
                params =
          'sp_ejercicio = ' +
          ejercicio +
          ' and sp_tipo_sol = 1 and sp_concepto not in (select ce_concepto_p from casos_especiales where ce_activo = 1) ' +
          'and sp_estatus not in ("CANCELAR", "XCANCELAR") ' +
          'and ifnull(sp_id_gpo_envio_cont_pre_comp,0) > 0 ' +
          'and ifnull(sp_id_gpo_folios,0) = 0 and sp_fecha_precaptura is not null/sp_id'

        //por liberar - checar
        /*
        params =
          'sp_ejercicio = ' +
          ejercicio +
          ' and sp_tipo_sol = 1  ' +
          'and sp_estatus not in ("CANCELAR", "XCANCELAR","PRECAP","FINPAGO","FINGXC") ' +
          'and ifnull(sp_id_gpo_envio_cont_pre_comp,0) > 0 ' +
          'and ifnull(sp_id_gpo_folios,0) = 0 and sp_fecha_precaptura is not null/sp_id'
*/
        payload = { jwt: jwt, params: params }
        await this.$store
          //.dispatch('solpago/fetchSolPagosCreado', payload)
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              solpagos2 = response.data
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
        //PREGUNTAR OJOOOOOOO
        await this.obtenerSolPagosEnvCont(jwt, ejercicio)

        if (solpagos1.length > 0) {
          this.solpagos = []
          this.selected = []

          if (this.solpagosconta.length > 0) {
            //Une dos objetos
            this.solpagos = Object.assign(solpagos1)
            //this.solpagos = Object.assign(solpagos2)
            this.solpagos = this.solpagos.concat(solpagos2)
            this.solpagos = this.solpagos.concat(this.solpagosconta)
          } else {
            this.solpagos = Object.assign(solpagos1)
            this.solpagos = this.solpagos.concat(solpagos2)
          }

          this.solpagos.sort((a, b) => a.sp_id - b.sp_id)
          this.formateoInfoExportar('CAPTURA')
        }
      }
    },
    async obtenerSolPagosPRECOM(jwt, ejercicio) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      //params = 'filtro?campo1=sp_estatus&tipo1=igual&valor1=GASCOM'
/*       params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_concepto in (23,24) and sp_estatus not in ("CANCELAR", "XCANCELAR") and obtenerfolios(s.sp_id,"D",s.sp_ejercicio) = "" /sp_id'
 */
      //RGP - 14/AGOSTO/2023
      params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_concepto in (select ce_concepto_p from casos_especiales where ce_activo = 1) and sp_estatus not in ("CANCELAR", "XCANCELAR") and obtenerfolios(s.sp_id,"D",s.sp_ejercicio) = "" /sp_id'


      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpagosconta = []
        await this.$store
          //.dispatch('solpago/fetchSolPagosCreado', payload)
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagosconta = response.data
              //this.formateoInfoExportar('ENVIA_COMP_CONT')
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
    async obtenerSolPagosEnvCont(jwt, ejercicio) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      //params = 'filtro?campo1=sp_estatus&tipo1=igual&valor1=GASCOM'
/*       params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_concepto in (23,24) and sp_estatus not in ("CANCELAR", "XCANCELAR") and obtenerfolios(s.sp_id,"D",s.sp_ejercicio) = "" /sp_id'
 */

      //RGP- 14-AGOSTO-2023
      params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_concepto in (select ce_concepto_p from casos_especiales where ce_activo = 1) and sp_estatus not in ("CANCELAR", "XCANCELAR") and obtenerfolios(s.sp_id,"D",s.sp_ejercicio) = "" /sp_id'


      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpagosconta = []
        await this.$store
          //.dispatch('solpago/fetchSolPagosCreado', payload)
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.solpagosconta = response.data
              //this.formateoInfoExportar('ENVIA_COMP_CONT')
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
    async obtenerSolPagosxEnvCont(jwt, ejercicio) {
      //this.isLoading = true
      //this.todosObjetosaCeros()
      this.solpagoscontaxEnv = []
      this.selectedConta = []
      let params = null
/*       params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_concepto  in (23,24) and sp_estatus  in ("GASCOM") and obtenerfolios(s.sp_id,"D",s.sp_ejercicio) != ""/sp_id'
 */
      //RGP - 14/AGOSTO/2023
      params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_concepto  in (select ce_concepto_p from casos_especiales where ce_activo = 1) and sp_estatus  in ("GASCOM") and obtenerfolios(s.sp_id,"D",s.sp_ejercicio) != ""/sp_id'

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }

        await this.$store
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            //console.log(response.data.mensaje)
            if (response.data.mensaje == undefined) {
              this.solpagoscontaxEnv = response.data
              this.formateoInfoExportar('ENVIA_COMP_CONT')
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
    //Obtiene los folios x Documento
    async obtenerFolios(jwt, ejercicio) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=folio_activo&tipo1=igual&valor1=1&logico2=and&campo2=f.sp_ejercicio&tipo2=igual&valor2=' +
        ejercicio

      if (jwt != null) {
        this.solpagos = []
        let payload = { jwt: jwt, params: params }
        this.folios = []
        await this.$store
          .dispatch('folio/fetchFolios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.folios = response.data
              this.formateoInfoExportar('FOLIOS')
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

    convierteNumeroFecha(date) {
      const cadena = date.toString()
      let year = cadena.slice(2, 4)
      let month = cadena.slice(5, 7)
      let day = cadena.slice(8, 10)

      //const fecha = year + '-' + month + '-' + day
      const fecha = day + '-' + month + '-' + year

      return fecha
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
    async close(checkbox) {
      this.isSure = false
      this.checkbox = checkbox
      if (!this.checkbox) {
        this.dialog = false
        //this.dialogxc = false
        this.isEditing = false
      }
      this.$nextTick(() => {
        //this.editedFolioIndex = -1
        var fecha = new Date()
        //this.isEditing = false
        //this.editedItemFolio.folio_id = 0
        this.editedItemFolio.folio_id = 0
        this.editedItemFolio.folio_num = ''
        this.editedItemFolio.folio_iscomprometido = false
        this.editedItemFolio.folio_isdevengado = false
        this.editedItemFolio.folio_fecha = this.fechaformato(fecha)
        //this.dialog = true
      })
      this.$v.$reset()
    },
    fechaformato(f) {
      //console.log(f.getMonth())
      var mes = f.getMonth() + 1
      const fecha = f.getFullYear() + '-' + (mes < 10 ? '0' + mes : mes) + '-' + f.getDate()
      return fecha
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(',', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
    // Eliminar Tipo
    deleteItem(item) {
      const index = this.folios.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.folios.splice(index, 1)
      this.Borrar(item.folio_id)
    },
    //Borrar en BD es desActivar
    async Borrar(index) {
      this.overlay = true
      this.$v.$touch()

      let body = {
        tipo_id: index,
        tipo_activo: 0,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      payload.ejercicio = this.editedItem.sp_ejercicio
      await this.$store
        .dispatch('folio/deleteFolios', payload)
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
      Object.assign(this.folios[this.editedIndex], this.editedItem)
      await this.obtenerFolios(jwt, this.ejercicioFolios)
    },
    //Editar Folio
    editarFolio(item) {
      this.editedIndex = this.folios.indexOf(item)
      this.editedItemFolio = Object.assign({}, item)
      this.editedItem.sp_id = this.editedItemFolio.sp_id
      this.editedItem.sp_ejercicio = this.editedItemFolio.sp_ejercicio
      if (this.editedItemFolio.folio_iscomprometido == 1) {
        this.editedItemFolio.folio_iscomprometido = true
      } else {
        this.editedItemFolio.folio_iscomprometido = false
      }

      if (this.editedItemFolio.folio_isdevengado == 1) {
        this.editedItemFolio.folio_isdevengado = true
      } else {
        this.editedItemFolio.folio_isdevengado = false
      }
      this.isEditing = true
      this.dialog = true
    },

    folioNew(item) {
      var fecha = new Date()
      this.editedIndex = this.solpagos.indexOf(item)
      this.editedItem = Object.assign({}, item)

      console.log(this.editedItem.sp_ejercicio)
      if (this.editedItem.sp_id_gpo_envio_cont_pre_comp > 0) {
        this.isEditing = false
        this.isCompPre = true
        this.editedItemFolio.sp_ejercicio = this.editedItem.sp_ejercicio
        this.editedItemFolio.sp_id = this.editedItem.sp_id
        //se necesita conocer el folio_id ---AQUIIIIIIIIIIIII
        this.editedItemFolio.folio_id = this.editedItem.foliosComprometidos
        this.editedItemFolio.folio_num = this.editedItem.foliosComprometidos
        this.editedItemFolio.folio_iscomprometido = false
        this.editedItemFolio.folio_isdevengado = true
        this.editedItemFolio.folio_fecha = this.fechaformato(fecha)
      } else {
        this.isEditing = false
        this.isCompPre = false
        this.editedItemFolio.sp_ejercicio = this.editedItem.sp_ejercicio
        this.editedItemFolio.sp_id = this.editedItem.sp_id
        this.editedItemFolio.folio_id = 0
        this.editedItemFolio.folio_num = ''
        this.editedItemFolio.folio_iscomprometido = false
        this.editedItemFolio.folio_isdevengado = false
        this.editedItemFolio.folio_fecha = this.fechaformato(fecha)
      }

      this.dialog = true
    },
    //Obtiene todos los Solicitudes de Pago para la tabla
    async obtenerIdGrupoFolios(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.sgteGpoFolio = 0
        await this.$store
          .dispatch('solpago/fetchSgteGpoFolio', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.sgteGpoFolio = response.data[0].sgteGpoFolios
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
    async obtenerIdGrupoEntConta(jwt) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.sgteGpoEntConta = 0
        await this.$store
          .dispatch('solpago/fetchSgteGpoGxcEntCont', payload)
          .then((response) => {
            //this.GpoFirmaSol = response.data
            //this.sgteGpoEntConta = response.data[0].sgteGpoGxcEntCont
            if (response.data.mensaje == undefined) {
              this.sgteGpoEntConta = response.data[0].sgteGpoGxcEntCont
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

    async enviar() {
      //Enviar Comprometidos y devengados a Contabilidad,
      if (this.selected.length > 0) {
        this.sgteGpoFolio = 0
        this.sgteGpoFolioComp = 0
        //obtener el sp_id_gpo_firma_sol
        let jwt = await getValidToken(this)

        let sp_id = 0
        let sp_ejercicio = 0
        let sp_estatus = ''
        //let CompPre = []
        let body = {}
        let payload = {}
        for (var i in this.selected) {
          //console.log('Entro al for')
          sp_id = this.selected[i].sp_id
          sp_ejercicio = this.selected[i].sp_ejercicio
          sp_estatus = this.selected[i].sp_estatus
          //console.log('sgteGpoFolio: ' + this.sgteGpoFolio)

          if (sp_estatus == 'GASCOM') {
            //Enviar a Contabilidad
            console.log('Enviar a Contabilidad')
            if (this.sgteGpoEntConta == 0) {
              await this.obtenerIdGrupoEntConta(jwt)
            }
            if (this.sgteGpoEntConta > 0) {
              console.log('this.sgteGpoFolioComp ' + this.sgteGpoFolioComp)
              body = {
                sp_id_gpo_gxc_ent_conta: this.sgteGpoEntConta,
                sp_estatus: 'FINGXC',
              }
              payload = { jwt: jwt, body: body }
              payload.id = sp_id
              payload.ejercicio = sp_ejercicio
              await this.$store
                .dispatch('solpago/addGpoEnviaConta', payload)
                .then(() => {
                  this.error = ''
                })
                .catch((err) => {
                  this.error = err
                })
            }
          } else {
            if (this.sgteGpoFolio == 0) {
              await this.obtenerIdGrupoFolios(jwt)
            }
            //Enviar a folios
            //FLUJO NORMAL
            if (this.sgteGpoFolio > 0) {
              //VERIFICAR SI ya tuvo COMPROMETIDO ANTERIORMENTE - 12/ABR/2022 _ NO
              /*               if (this.selected[i].sp_id_gpo_envio_cont_pre_comp > 0) {
                CompPre.push(this.selected[i].sp_id_gpo_envio_cont_pre_comp)
              }
 */
              body = {
                sp_id_gpo_folios: this.sgteGpoFolio,
              }
              payload = { jwt: jwt, body: body }
              payload.id = sp_id
              payload.ejercicio = sp_ejercicio
              await this.$store
                .dispatch('solpago/addGpoFolio', payload)
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
          //imprimir
          if (this.sgteGpoFolio > 0) {
            await imprimeGrupoCompDev(this.sgteGpoFolio, 'COMPROMETIDO', this)
            await imprimeGrupoCompDev(this.sgteGpoFolio, 'DEVENGADO', this)

            /*             if (CompPre.length > 0) await imprimeGrupoCompDev(this.sgteGpoFolio, 'DEVENGADO', this)
            else {
            }
 */
          }
          if (this.sgteGpoFolioComp > 0) {
            await imprimeGrupo(this.sgteGpoEntConta, 'CONTABILIDAD', this)
          }

          this.$store.commit('ALERT', {
            color: 'success',
            text: 'Registros enviados correctamente',
          })
        } else {
          this.$store.commit('ALERT', {
            color: 'error',
            text: this.error,
          })
        }
        await this.obtenerSolPagos(jwt, this.ejercicioCap)
      }

      //console.log('imprimeRecibo')
    },
    // Guardar el Pago
    async save() {
      this.overlay = true
      this.$v.$touch()
      if (!this.validado) {
        let body = {
          sp_id: this.editedItem.sp_id,
          sp_ejercicio: this.editedItem.sp_ejercicio,
          folio_num: this.editedItemFolio.folio_num,
          folio_fecha: this.editedItemFolio.folio_fecha,
          folio_iscomprometido: this.editedItemFolio.folio_iscomprometido,
          folio_isdevengado: this.editedItemFolio.folio_isdevengado,
        }

        //Para actualizar Campos de folios en solicitud_pagos
        let folio_comprometido = this.editedItem.sp_folios_comprometido
        if (this.editedItemFolio.folio_iscomprometido) {
          if (folio_comprometido == '') {
            folio_comprometido = this.editedItemFolio.folio_num
          } else {
            folio_comprometido = folio_comprometido + ',' + this.editedItemFolio.folio_num
          }
        }
        let folio_devengado = this.editedItem.sp_folios_devengado
        if (this.editedItemFolio.folio_isdevengado) {
          if (folio_devengado == '') {
            folio_devengado = this.editedItemFolio.folio_num
          } else {
            folio_devengado = folio_devengado + ',' + this.editedItemFolio.folio_num
          }
        }
        let body2 = {
          sp_folios_comprometido: folio_comprometido,
          sp_folios_devengado: folio_devengado,
        }
        /*  console.log(
          'folio_comprometido: ' + folio_comprometido + ' folio_devengado: ' + folio_devengado
        ) */

        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.isEditing) {
          //console.log('Editar')
          payload.id = this.editedItemFolio.folio_id
          await this.$store
            .dispatch('folio/editFolios', payload)
            .then(() => {
              let payload2 = { jwt: jwt, body: body2 }
              payload2.id = this.editedItem.sp_id
              payload.estatus = this.editedItem.sp_estatus
              this.$store
                .dispatch('solpago/addFolios', payload2)
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
            })
            .catch((err) => {
              this.$store.commit('ALERT', {
                color: 'error',
                text: err.response.data.error,
              })
            })
        } else {
          //Nuevo Folio
          if (this.editedIndex > -1) {
            //payload.id = this.editedItem.sp_id
            await this.$store
              //OJO CHECAR ----------------------------->
              .dispatch('folio/addFolios', payload)
              .then(() => {
                let payload2 = { jwt: jwt, body: body2 }
                payload2.id = this.editedItem.sp_id
                payload2.estatus = this.editedItem.sp_estatus
                this.$store
                  .dispatch('solpago/addFolios', payload2)
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
              })
              .catch((err) => {
                this.$store.commit('ALERT', {
                  color: 'error',
                  text: err.response.data.error,
                })
              })
            //Object.assign(this.solpagos[this.editedIndex], this.editedItem)
          }
        }

        //await this.obtenerFolios(jwt, this.ejercicioCap) ???
        await this.obtenerSolPagos(jwt, this.ejercicioCap)

        this.close(this.checkbox)
        this.changed = false
      }
    },

    //mandar a imprimir
    printItem(item) {
      this.editedItem = Object.assign({}, item)
      imprimeGrupoCompDev(this.editedItem.sp_id_gpo_folios, 'COMPROMETIDO', this)
      imprimeGrupoCompDev(this.editedItem.sp_id_gpo_folios, 'DEVENGADO', this)
    },

    async printItemReimp(item, opcion) {
      this.editedItem = Object.assign({}, item)
      if (opcion == 'AUTORIZACION' || opcion == 'CONTABILIDAD' || opcion == 'CONTABILIDADNP') {
        await imprimeGrupo(this.editedItem.idGrupo, opcion, this)
      } else if (opcion == 'FOLIOS') {
        imprimeGrupoCompDev(this.editedItem.idGrupo, 'COMPROMETIDO', this)
        imprimeGrupoCompDev(this.editedItem.idGrupo, 'DEVENGADO', this)
      }
    },
    //Funciones
    convierteNumeroFechaVista(date) {
      const cadena = date.toString()
      let year = cadena.slice(2, 4)
      let month = cadena.slice(5, 7)
      let day = cadena.slice(8, 10)

      //const fecha = year + '-' + month + '-' + day
      const fecha = day + '-' + month + '-' + year

      return fecha
    },
    //Obtiene folio siguiente
    async obtenerIdGrupoContaNp(jwt) {
      this.isLoading = true
      let params = null

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.sgteGpoFolio = 0
        await this.$store
          .dispatch('solpago/fetchSgteGpoContaNp', payload)
          .then((response) => {
            //this.sgteGpoFolio = response.data[0].sgteGpoContNP
            if (response.data.mensaje == undefined) {
              this.sgteGpoFolio = response.data[0].sgteGpoContNP
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
    //Enviar Solicitudes de Pago NP a Contabilidad
    async enviarContaNp() {
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
            await this.obtenerIdGrupoContaNp(jwt)
          }
          //console.log('sgteGpoFolio: ' + this.sgteGpoFolio)
          if (this.sgteGpoFolio > 0) {
            body = {
              sp_id_gpo_envio_cont_np: this.sgteGpoFolio,
            }
            payload = { jwt: jwt, body: body }
            payload.id = sp_id
            payload.ejercicio = sp_ejercicio
            await this.$store
              .dispatch('solpago/addGpoEnviaContaNp', payload)
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
            await imprimeGrupo(this.sgteGpoFolio, 'CONTABILIDADNP', this)
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
        await this.obtenerSolPagosNp(jwt, this.ejercicioEnvNP)
      }
    },
    //Enviar comprobaciones a contabilidad
    async enviarConta() {
   
      //Enviar las solicitudes de pago a solicitud de firma de solicitante
      if (this.selectedConta.length > 0) {
        //obtener el sp_id_gpo_firma_sol
        this.sgteGpoEntConta = 0
        let jwt = await getValidToken(this)
        await this.obtenerIdGrupoEntConta(jwt)
        if (this.sgteGpoEntConta > 0) {
          //console.log(this.sgteGpoEntConta)
          let sp_id = 0
          let sp_ejercicio = 0
          for (var i in this.selectedConta) {
            sp_id = this.selectedConta[i].sp_id
            sp_ejercicio = this.selectedConta[i].sp_ejercicio
            const sp_id_comp = this.selectedConta[i].sp_id_comp
            let body = {
              sp_id_gpo_gxc_ent_conta: this.sgteGpoEntConta,
              sp_estatus: 'FINGXC',
            }
            let payload = { jwt: jwt, body: body }
            payload.id = sp_id
            payload.ejercicio = sp_ejercicio
            await this.$store
              .dispatch('solpago/addGpoEnviaConta', payload)
              .then(() => {
                this.error = ''
              })
              .catch((err) => {
                this.error = err
              })
               //cambia estatus de  orden si tiene orden la sp verifica con conprobacion y fecha de comp en seguimiento

               if(sp_id_comp  > 0){
                body = {
                  osEstatus: 'COMP',
                  sp_ejercicio: sp_ejercicio,
                  sp_id: sp_id,
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
                //ACTUALIZA REGISTRO EN TABLA SEGUIMIENNTO4
                   var fecha = new Date()
                   this.os_fecha_comprob = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
                    console.log(" this.os_fecha_comprob ",    this.os_fecha_comprob  )
                let bodyEnv = {
                  sp_id: sp_id,
                  osEjercicio: sp_ejercicio,
                  os_fecha_comprob: this.os_fecha_comprob,
                  os_user_comprob: this.usuario.usr_id,
                }
                let payloadEnv = { jwt: jwt, body: bodyEnv }
                await this.$store.dispatch('ordencompra/editSeguimiento', payloadEnv)
                .then(() => {
                  this.error = ''
                })
                .catch((err) => {
                  this.error = err
                })
              }
            }
          if (this.error == '') {
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'Se envio correctamente a Contabilidad',
            })
            //await this.imprimeFormato(this.sgteGpoEntConta, 'CONTABILIDAD')

            await imprimeGrupo(this.sgteGpoEntConta, 'CONTABILIDAD', this)
          } else {
            this.$store.commit('ALERT', {
              color: 'error',
              text: this.error,
            })
          }
          await this.obtenerSolPagosxEnvCont(jwt, this.ejercicioEnvCom)
        }
      }

      //console.log('imprimeRecibo')
    },
    formateoInfoExportar(opcion) {
      var i
      if (opcion == 'CAPTURA') {
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
              sp_concepto: this.solpagos[i].sp_concepto,
              nom_concepto: this.solpagos[i].nom_concepto,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagos[i].sp_importe),
            }
            this.solpagosExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'ENVIA_COMP_CONT') {
        //console.log(opcion)
        if (this.solpagoscontaxEnv.length > 0) {
          this.solpagoscontaxEnvExportar = []
          for (i in this.solpagoscontaxEnv) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagoscontaxEnv[i].sp_ejercicio,
              sp_id: this.solpagoscontaxEnv[i].sp_id,
              nombre_sol: this.solpagoscontaxEnv[i].nombre_sol,
              nom_concepto: this.solpagoscontaxEnv[i].nom_concepto,
              sp_fecha_conta_gasxcomp: this.formato(
                this.eFormatos.FECHA,
                this.solpagoscontaxEnv[i].sp_fecha_conta_gasxcomp
              ),

              sp_pago_nombre_de: this.solpagoscontaxEnv[i].sp_pago_nombre_de,

              //nom_concepto: this.solpagoscontaxEnv[i].nom_concepto,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagoscontaxEnv[i].sp_importe),
            }
            this.solpagoscontaxEnvExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'ENVIA_NP_CONTA') {
        this.solpagosNpExportar = []
        if (this.solpagosNp.length > 0) {
          for (i in this.solpagosNp) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagosNp[i].sp_ejercicio,
              sp_id: this.solpagosNp[i].sp_id,
              nombre_sol: this.solpagosNp[i].nombre_sol,
              direccion_sol: this.solpagosNp[i].direccion_sol,
              sp_fecha_solicitud: this.formato(
                this.eFormatos.FECHA,
                this.solpagosNp[i].sp_fecha_solicitud
              ),
              nom_concepto: this.solpagosNp[i].nom_concepto,
              sp_pago_nombre_de: this.solpagosNp[i].sp_pago_nombre_de,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagosNp[i].sp_importe),
            }
            this.solpagosNpExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'FOLIOS') {
        this.foliosExportar = []
        if (this.folios.length > 0) {
          for (i in this.folios) {
            let fieldsPagos = {
              sp_ejercicio: this.folios[i].sp_ejercicio,
              sp_id: this.folios[i].sp_id,
              folio_num: this.folios[i].folio_num,
              folio_fecha: this.formato(this.eFormatos.FECHA, this.folios[i].folio_fecha),
              folio_iscomprometido: this.folios[i].folio_iscomprometido,
              folio_isdevengado: this.folios[i].folio_isdevengado,
              EsComprobacion: this.folios[i].EsComprobacion,
              folio_activo: this.folios[i].folio_activo,
              sp_id_gpo_folios: this.folios[i].sp_id_gpo_folios,
            }
            this.foliosExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'REIMPRESION_FIRMA_AUTORIZA') {
        this.gpoenvfirautExportar = []
        //console.log(this.gpoenvfiraut.length)
        if (this.gpoenvfiraut.length > 0) {
          for (i in this.gpoenvfiraut) {
            let fieldsPagos = {
              idGrupo: this.gpoenvfiraut[i].idGrupo,
              FechaEnviaFirmaAutoriza: this.formato(
                this.eFormatos.FECHA,
                this.gpoenvfiraut[i].FechaEnviaFirmaAutoriza
              ),
              userEnviaFirmaAutoriza: this.gpoenvfiraut[i].userEnviaFirmaAutoriza,
              nombreEnviaFirmaAutoriza: this.gpoenvfiraut[i].nombreEnviaFirmaAutoriza,
              totalGrupo: this.formato(this.eFormatos.MONEDA, this.gpoenvfiraut[i].totalGrupo),
            }
            //  console.log(fieldsPagos)
            this.gpoenvfirautExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'REIMPRESION_ENVIA_COMDEV') {
        this.gpoenvcomdevExportar = []
        //console.log(this.gpoenvcomdev.length)
        if (this.gpoenvcomdev.length > 0) {
          for (i in this.gpoenvcomdev) {
            let fieldsPagos = {
              idGrupo: this.gpoenvcomdev[i].idGrupo,
              fechaEnviaComprometidos: this.formato(
                this.eFormatos.FECHA,
                this.gpoenvcomdev[i].fechaEnviaComprometidos
              ),
              UserEnviaComprometidos: this.gpoenvcomdev[i].UserEnviaComprometidos,
              NombreEnviaComprometidos: this.gpoenvcomdev[i].NombreEnviaComprometidos,
              totalGrupo: this.formato(this.eFormatos.MONEDA, this.gpoenvcomdev[i].totalGrupo),
            }
            //  console.log(fieldsPagos)
            this.gpoenvcomdevExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'REIMPRESION_ENVIA_CONGXC') {
        this.gpoenvcongxcExportar = []
        //console.log(this.gpoenvcongxc.length)
        if (this.gpoenvcongxc.length > 0) {
          for (i in this.gpoenvcongxc) {
            let fieldsPagos = {
              idGrupo: this.gpoenvcongxc[i].idGrupo,
              FechaenviaContaGxC: this.formato(
                this.eFormatos.FECHA,
                this.gpoenvcongxc[i].FechaenviaContaGxC
              ),
              UserEnviaContaGxC: this.gpoenvcongxc[i].UserEnviaContaGxC,
              NombreEnviaContaGxC: this.gpoenvcongxc[i].NombreEnviaContaGxC,
              totalGrupo: this.formato(this.eFormatos.MONEDA, this.gpoenvcongxc[i].totalGrupo),
            }
            //  console.log(fieldsPagos)
            this.gpoenvcongxcExportar.push(fieldsPagos)
          }
        }
      } else if (opcion == 'REIMPRESION_ENVIA_NPCONT') {
        this.gpoenvconnpExportar = []
        //console.log(this.gpoenvconnp.length)
        if (this.gpoenvconnp.length > 0) {
          for (i in this.gpoenvconnp) {
            let fieldsPagos = {
              idGrupo: this.gpoenvconnp[i].idGrupo,
              FechaEnviaContaNp: this.formato(
                this.eFormatos.FECHA,
                this.gpoenvconnp[i].FechaEnviaContaNp
              ),
              UserEnviaContaNp: this.gpoenvconnp[i].UserEnviaContaNp,
              nombreEnviaContaNp: this.gpoenvconnp[i].nombreEnviaContaNp,
              totalGrupo: this.formato(this.eFormatos.MONEDA, this.gpoenvconnp[i].totalGrupo),
            }
            //  console.log(fieldsPagos)
            this.gpoenvconnpExportar.push(fieldsPagos)
          }
        }
      }
    },

    async onChangeEjercicioCap(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioCap = value.sp_ejercicio
      await this.obtenerSolPagos(jwt, value.sp_ejercicio)
    },
    async onChangeEjercicioEnvCom(value) {
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioEnvCom = value.sp_ejercicio
      await this.obtenerSolPagosxEnvCont(jwt, value.sp_ejercicio)
    },
    async onChangeEjercicioEnvNP(value) {
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioEnvNP = value.sp_ejercicio
      await this.obtenerSolPagosNp(jwt, value.sp_ejercicio)
    },
    async onChangeEjercicioFolios(value) {
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioFolios = value.sp_ejercicio
      await this.obtenerFolios(jwt, value.sp_ejercicio)
    },

    formato(opcion, valor) {
      if (opcion == this.eFormatos.IMPORTE) {
        return tools.formatoImporte(valor)
      } else if (opcion == this.eFormatos.MONEDA) {
        return tools.formatoMoneda(valor)
      } else if (opcion == this.eFormatos.FECHA) {
        return tools.convierteNumeroFechaVista(valor)
      }else if (opcion == this.eFormatos.FECHA_FORMATO) {
        return tools.fechaformato(valor)
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
.mytable table tr {
  background-color: lightgoldenrodyellow;
  border-bottom: none;
}
.style-1 {
  //background-color: rgb(215, 215, 44);
  //display: none;
  opacity: 0.2;
}
.style-2 {
  background-color: rgb(114, 114, 67);
}
</style>
