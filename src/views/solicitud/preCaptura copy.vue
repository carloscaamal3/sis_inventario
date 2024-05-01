<template>
  <v-tabs fixed-tabs background-color="indigo" dark>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab @change="refrescaPreCaptura" key="tab0">
      <v-icon left> mdi-file-document-edit-outline </v-icon>Folios Pre Captura
    </v-tab>
    <v-tab @change="refrescaCaptura" key="tab1">
      <v-icon left> mdi-file-document-edit-outline </v-icon>Captura Comprometidos
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
    <!--Folios de Pre Captura -->
    <v-tab-item key="tab0">
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
                @click="nuevaPreCaptura"
                @click.stop="dialogPreCap = true"
                >Nueva Pre Captura</v-btn
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
                @change="onChangeEjercicioPreCap"
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
              :dataFields="fieldsCreados"
              fileName="creados"
              pdfView="none"
            />
            <!-- Termina DataExporter -->
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="searchPreCap"
              append-icon="mdi-magnify"
              class="ml-auto"
              label="Búsqueda"
              hide-details
              single-line
              style="max-width: 250px"
            />
          </v-col>
        </v-row>

        <!-- Aqui va progress linear -->
        <v-divider class="mt-3" />

        <v-data-table
          :headers="headersPreCap"
          :items="solpagosPreCap"
          dense
          :search.sync="searchPreCap"
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItemPreCap(item)">mdi-delete</v-icon>
            <v-icon tag="Hola" small @click="convertItem(item)">mdi-check-bold</v-icon>
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
      </base-material-card>
    </v-tab-item>
    <!-- CAPTURA COMPROMETIDOS  -->
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
    <!-- D I A L O G O S -->
    <!--Dialogo Captura de FOLIO Comprometido -->
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
                  disabled
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
    <!-- Dialogo Cancelar -->
    <ConfirmationDialog v-model="isSure" @click="cancel" />
    <!-- Empieza Dialogo Pre Captura -->
    <v-dialog v-model="dialogPreCap" max-width="1024px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} </span>
          <!-- <v-img src="@/assets/logo.png" width="70%" height="70%"></v-img> -->
          <v-img src="@/assets/logo_ivey.jpg" width="20%" height="20%"></v-img>
        </v-card-title>

        <v-card-text>
          <v-container>
            <!-- CAMPOS -->
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
          <v-checkbox v-model="checkbox" label="Crear otro" :disabled="isEditing"></v-checkbox>
          <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="savePreCap" :disabled="validadoPreCap"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
          <v-btn color="blue darken-1" text @click="BorrarPreCap()" :disabled="validado"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import { imprimeFormatoSolPag } from '@/store/modules/impresiones.store.js'

export default {
  components: {
    ConfirmationDialog,
    Status,
    DataExporter,
  },
  data: () => ({
    eFormatos: tools.formatos,
    //PARA TAB0 FOLIOS PRE CAPTURA
    usuario: JSON.parse(localStorage.getItem('user')),
    DisabledPagoNombreDe: false,
    fromDateFecFact: false,
    fromDateFecPoPago: false,
    ejercicio: 0,
    searchPreCap: undefined,
    dialogPreCap: false,
    dialogxc: false,
    idEmpleadoAut: 0,
    isConcepto: true,
    isPreCaptura: false,
    isProveedor: true,
    isSolicita: true,
    isTipo: true,
    sgteIdSolPag: 0,
    conceptos: [],
    cuentas: [],
    direccion: [],
    directores: [],
    empleadoaut: [],
    empleadosol: [],
    empleadovobo: [],
    fuentesfin: [],
    generales: [],
    proveedores: [],
    solpagosPreCap: [],
    tipos: [],

    headersPreCap: [
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
    fieldsCaptura: {
      Ejercicio: 'sp_ejercicio',
      Folio: 'sp_id',
      Proveedor: 'sp_pago_nombre_de',
      Fecha_Solicita: 'sp_fecha_solicitud',
      No_Concepto: 'sp_concepto',
      Concepto: 'nom_concepto',
      Importe: 'sp_importe',
    },
    //Envia Np a contabilidad
    solpagosNp: [],
    solpagosNpExportar: [],
    //Comprobacion para enviar a contabilidad
    solpagosconta: [],
    solpagoscontaxEnv: [],
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
    /*  editedItem: {
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
    }, */
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
    editedItemFolio: {
      folio_num: { required, minLength: minLength(1), maxLength: maxLength(10) },
      //folio_isdevengado: { required },
    },
    editedItem: {
      sp_motivo_cancelacion: { required },
      sp_ejercicio: { required },
      sp_tipo_sol: { required },
      sp_concepto: { required },
      prov_id: { required },
      sp_emp_id_sol: { required },
      sp_emp_id_aut: { required },
      sp_direccion_sol: { required },
      cuecon_cuenta: { required, minLength: minLength(3), maxLength: maxLength(20) },
      sp_fuente_fin: { required },
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
    sp_ejercicioErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_ejercicio.$dirty) return errors
      !this.$v.editedItem.sp_ejercicio.required && errors.push('Este campo es requerido')
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
    sp_fuenteFinErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_fuente_fin.$dirty) return errors
      !this.$v.editedItem.sp_fuente_fin.required && errors.push('Este campo es requerido')
      return errors
    },
    sp_direccion_solErrors() {
      const errors = []
      if (!this.$v.editedItem.sp_direccion_sol.$dirty) return errors
      !this.$v.editedItem.sp_direccion_sol.required && errors.push('Este campo es requerido')
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
    validado() {
      if (
        this.editedItemFolio.folio_num.length > 0 &&
        this.editedItemFolio.folio_iscomprometido == 1
      ) {
        return false
      } else {
        return true
      }
    },
    validadoPreCap() {
      //if (this.folio_numErrors.length == 0 && this.editedItemFolio.folio_isdevengado == 1) {
      //console.log(this.editedItem)
      if (
        this.editedItem.sp_ejercicio != '' &&
        this.editedItem.sp_tipo_sol != '' &&
        this.editedItem.sp_concepto != '' &&
        this.editedItem.prov_id != '' &&
        this.editedItem.cuecon_cuenta != '' &&
        this.editedItem.sp_descripcion != '' &&
        this.editedItem.sp_pago_nombre_de != '' &&
        this.editedItem.sp_importe != '' &&
        this.editedItem.sp_fecha_solicitud != '' &&
        this.editedItem.sp_fuente_fin != '' &&
        this.editedItem.sp_emp_id_aut != '' &&
        this.editedItem.sp_emp_id_sol != ''
      ) {
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
    /* const self = this
    this.solpagos.map((item) => {
      console.log(item.sp_user_envio_cont_pre_comp)
      if (item.sp_user_envio_cont_pre_comp == undefined) self.disabledCount += 1
    }) */
  },
  methods: {
    selectAllToggle(props) {
      //console.log('selectAllToggle')
      console.log(props)
      console.log(this.selected.length)
      console.log(this.solpagos.length)
      console.log(this.disabledCount)
      if (this.selected.length != this.solpagos.length - this.disabledCount) {
        this.selected = []
        const self = this
        props.items.forEach((item) => {
          console.log(item.sp_user_envio_cont_pre_comp)
          if (!item.sp_user_envio_cont_pre_comp == undefined) {
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

    //Refrescar folios PreCaptura
    async refrescaPreCaptura() {
      let jwt = (await getValidToken(this)) / (await this.obtenerEjercicios(jwt))
      this.EjercicioValido()
      //await this.obtenerSolPagosPreCap(jwt, this.ejercicioCap)
    },
    //Refrescar Captura folios
    async refrescaCaptura() {
      let jwt = await getValidToken(this)
      if (this.ejercicioCap == undefined || this.ejercicioCap == 0) {
        this.ejercicioCap = this.ejercicios[0].sp_ejercicio
      }

      //await this.obtenerSolPagos(jwt, this.ejercicioCap)
      await this.obtenerParaComprometidos(jwt, this.ejercicioCap)

      this.disabledCount = this.solpagos.length
      this.selected = []
      /* const self = this
      this.solpagos.map((item) => {
        //console.log(item.sp_user_envio_cont_pre_comp)
        if (item.sp_user_envio_cont_pre_comp == undefined) self.disabledCount += 1
      }) */
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
      this.EjercicioValido()

      /* if (this.ejercicioCap == undefined || this.ejercicioCap == 0) {
        this.ejercicioCap = this.ejercicios[0].sp_ejercicio
      } */

      //await this.obtenerSolPagos(jwt, this.ejercicioCap)
      //await this.obtenerSolPagosPreCap(jwt, this.ejercicioCap)
      await this.iniciandoPreCap()
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
    //Obtener Solicitud de Pagos con Estatus PRECAPTURA
    async obtenerSolPagosPreCap(jwt, ejercicio) {
      this.isLoading = true
      let params = null
      params = `(sp_estatus = 'PRECAP') and sp_ejercicio = ` + ejercicio + `/sp_id/`
      //console.log(ejercicio)
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.solpagosPreCap = []
        await this.$store
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            //this.formateoInfoExportar('CREADOS')
            if (response.data.mensaje == undefined) {
              //this.solpagos = response.data
              this.solpagosPreCap = response.data
              //this.formateoInfoExportar('CREADOS')
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
    async obtenerParaComprometidos(jwt, ejercicio) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let solpagos1 = []
      let params = null
      let payload = {}
      //console.log('Ejercicio en obtenerSolPagos(): ' + ejercicio)

      /*       params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_concepto not in (23,24) and sp_estatus  in ("PRECAP") and ifnull(sp_id_gpo_folios,0) = 0/sp_id'
 */
      params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_estatus  in ("PRECAP") and ifnull(sp_id_gpo_folios,0) = 0/sp_id'

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
        //PREGUNTAR OJOOOOOOO
        //await this.obtenerSolPagosEnvCont(jwt, ejercicio)

        if (solpagos1.length > 0) {
          this.solpagos = []
          this.selected = []

          if (this.solpagosconta.length > 0) {
            //Une dos objetos
            this.solpagos = Object.assign(solpagos1)
            this.solpagos = this.solpagos.concat(this.solpagosconta)
          } else {
            this.solpagos = Object.assign(solpagos1)
          }

          this.solpagos.sort((a, b) => a.sp_id - b.sp_id)
          this.formateoInfoExportar('CAPTURA')
        }
      }
    },
    async obtenerSolPagosEnvCont(jwt, ejercicio) {
      //async obtenerconceptos(jwt) {
      this.isLoading = true
      let params = null
      //params = 'filtro?campo1=sp_estatus&tipo1=igual&valor1=GASCOM'
      params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_concepto in (23,24) and sp_estatus not in ("CANCELAR", "XCANCELAR") and obtenerfolios(s.sp_id,"D",s.sp_ejercicio) = "" /sp_id'

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
      this.isLoading = true
      //this.todosObjetosaCeros()
      this.solpagoscontaxEnv = []
      this.selectedConta = []
      let params = null
      params =
        'sp_ejercicio = ' +
        ejercicio +
        ' and sp_tipo_sol = 1 and sp_concepto  in (23,24) and sp_estatus  in ("GASCOM") and obtenerfolios(s.sp_id,"D",s.sp_ejercicio) != ""/sp_id'

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
        this.dialogPreCap = false
        this.dialogxc = false
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
      this.isEditing = false
      this.editedIndex = this.solpagos.indexOf(item)
      this.editedItem = Object.assign({}, item)

      this.editedItemFolio.sp_ejercicio = this.editedItem.sp_ejercicio
      this.editedItemFolio.sp_id = this.editedItem.sp_id
      this.editedItemFolio.folio_id = 0
      this.editedItemFolio.folio_num = ''
      this.editedItemFolio.folio_iscomprometido = true
      this.editedItemFolio.folio_isdevengado = false
      this.editedItemFolio.folio_fecha = this.fechaformato(fecha)
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
      //Enviar las solicitudes de pago a solicitud de firma de solicitante
      if (this.selected.length > 0) {
        this.sgteGpoFolio = 0
        this.sgteGpoFolioComp = 0
        //obtener el sp_id_gpo_firma_sol
        let jwt = await getValidToken(this)

        let sp_id = 0
        let sp_ejercicio = 0
        let sp_estatus = ''
        let body = {}
        let payload = {}
        for (var i in this.selected) {
          //console.log('Entro al for')
          sp_id = this.selected[i].sp_id
          sp_ejercicio = this.selected[i].sp_ejercicio
          sp_estatus = this.selected[i].sp_estatus
          //console.log('sgteGpoFolio: ' + this.sgteGpoFolio)
          if (this.sgteGpoFolio == 0) {
            await this.obtenerIdGrupoFolios(jwt)
          }
          if (this.sgteGpoFolioComp == 0) {
            await this.obtenerIdGrupoEntConta(jwt)
          }
          if (sp_estatus == 'GASCOM') {
            //Enviar a Contabilidad
            if (this.sgteGpoFolioComp > 0) {
              console.log('this.sgteGpoFolioComp ' + this.sgteGpoFolioComp)
              body = {
                sp_id_gpo_gxc_ent_conta: this.sgteGpoFolioComp,
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
            //Enviar a folios
            if (this.sgteGpoFolio > 0) {
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
        await this.obtenerParaComprometidos(jwt, this.ejercicioCap)
      }

      //console.log('imprimeRecibo')
    },
    // Guardar el Pago
    async save() {
      this.overlay = true
      this.$v.$touch()
      if (!this.validado) {
        //let exito = false
        //let msgError = ''
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
        await this.obtenerParaComprometidos(jwt, this.ejercicioCap)
        this.dialog = false
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
      } else if (opcion == 'CREADOS') {
        if (this.solpagosPreCap.length > 0) {
          this.solpagosPreCapExportar = []
          for (i in this.solpagosPreCap) {
            let fieldsPagos = {
              sp_ejercicio: this.solpagosPreCap[i].sp_ejercicio,
              sp_id: this.solpagosPreCap[i].sp_id,
              nombre_sol: this.solpagosPreCap[i].nombre_sol,
              nom_tipo_sol: this.solpagosPreCap[i].nom_tipo_sol,
              nom_concepto: this.solpagosPreCap[i].nom_concepto,
              sp_pago_nombre_de: this.solpagosPreCap[i].sp_pago_nombre_de,
              cuecon_cuenta: "'" + this.solpagosPreCap[i].cuecon_cuenta + "'",
              sp_descripcion: this.solpagosPreCap[i].sp_descripcion,
              sp_importe: this.formato(this.eFormatos.MONEDA, this.solpagosPreCap[i].sp_importe),
              sp_fecha_solicitud: this.formato(
                this.eFormatos.FECHA,
                this.solpagosPreCap[i].sp_fecha_solicitud
              ),
              nom_fuente_fin: this.solpagosPreCap[i].nom_fuente_fin,
              nom_user_elabora: this.solpagosPreCap[i].nom_user_elabora,
              direccion_sol: this.solpagosPreCap[i].direccion_sol,
              estatus_nombre: this.solpagosPreCap[i].estatus_nombre,
            }
            this.solpagosExportar.push(fieldsPagos)
          }
        }
      }
    },

    async onChangeEjercicioCap(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      let jwt = await getValidToken(this)
      //console.log('value.sp_ejercicio ' + value.sp_ejercicio)
      this.ejercicioCap = value.sp_ejercicio
      await this.obtenerSolPagosPreCap(jwt, value.sp_ejercicio)
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
      }
    },
    ////////////////////////////////////////////////////////////////////////////////
    //PARA TAB0 - FOLIOS DE PRE CAPTURA
    async iniciandoPreCap() {
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
      //await this.obtenerEjercicios(jwt)

      //this.EjercicioValido()

      await this.obtenerSolPagosPreCap(jwt, this.ejercicio)
    },

    // Editar PreCaptura
    async convertItem(item) {
      this.isEditing = true
      this.isPreCaptura = false
      this.editedIndex = this.solpagosPreCap.indexOf(item)
      this.editedItem = Object.assign({}, item)
      //console.log(this.editedItem)
      this.editedItem.sp_fecha_solicitud = this.convierteNumeroFecha(
        this.solpagosPreCap[this.editedIndex].sp_fecha_solicitud
      )

      if (this.editedItem.sp_fecha_factura == null) {
        this.editedItem.sp_fecha_factura == ''
      } else {
        this.editedItem.sp_fecha_factura = this.convierteNumeroFecha(
          this.solpagosPreCap[this.editedIndex].sp_fecha_factura
        )
      }
      if (this.editedItem.sp_fecha_factura_prob_pago == null) {
        this.editedItem.sp_fecha_factura_prob_pago = ''
      } else {
        this.editedItem.sp_fecha_factura_prob_pago = this.convierteNumeroFecha(
          this.solpagosPreCap[this.editedIndex].sp_fecha_factura_prob_pago
        )
      }
      this.editedItem.sp_fecha_elabora = this.convierteNumeroFecha(
        this.solpagosPreCap[this.editedIndex].sp_fecha_elabora
      )
      let jwt = await getValidToken(this)
      this.obtenerEmpleadoSolicita(jwt, this.editedItem.sp_direccion_sol)

      this.editedItem.sp_estatus = 'CREADO'

      this.dialogPreCap = true
    },

    // Editar PreCaptura
    async editItem(item) {
      this.isEditing = false
      this.isPreCaptura = true
      this.editedIndex = this.solpagosPreCap.indexOf(item)
      this.editedItem = Object.assign({}, item)
      //console.log(this.editedItem)
      this.editedItem.sp_fecha_solicitud = this.convierteNumeroFecha(
        this.solpagosPreCap[this.editedIndex].sp_fecha_solicitud
      )

      if (this.editedItem.sp_fecha_factura == null) {
        this.editedItem.sp_fecha_factura == ''
      } else {
        this.editedItem.sp_fecha_factura = this.convierteNumeroFecha(
          this.solpagosPreCap[this.editedIndex].sp_fecha_factura
        )
      }
      if (this.editedItem.sp_fecha_factura_prob_pago == null) {
        this.editedItem.sp_fecha_factura_prob_pago = ''
      } else {
        this.editedItem.sp_fecha_factura_prob_pago = this.convierteNumeroFecha(
          this.solpagosPreCap[this.editedIndex].sp_fecha_factura_prob_pago
        )
      }
      this.editedItem.sp_fecha_elabora = this.convierteNumeroFecha(
        this.solpagosPreCap[this.editedIndex].sp_fecha_elabora
      )
      let jwt = await getValidToken(this)
      this.obtenerEmpleadoSolicita(jwt, this.editedItem.sp_direccion_sol)

      this.editedItem.sp_estatus = 'PRECAP'

      this.dialogPreCap = true
    },
    deleteItemPreCap(item) {
      this.isEditing = true
      this.editedIndex = this.solpagos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      //this.editedItem.rec_estatus = 'CAN'
      this.editedItem.sp_motivo_cancelacion = ''
      this.dialogxc = true
    },
    //Borrar en BD es desActivar
    async BorrarPreCap() {
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
      //Object.assign(this.solpagos[this.editedIndex], this.editedItem)
      this.close(this.checkbox)
      this.changed = false
      this.iniciando()
    },
    EjercicioValido() {
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
        //this.ejercicioCap = this.ejercicios[0].sp_ejercicio
      }
      if (this.ejercicio == 0) {
        var currentTime = new Date()
        this.ejercicio = currentTime.getFullYear()
        //this.ejercicioCap = currentTime.getFullYear()
      }
      this.editedItem.sp_ejercicio = this.ejercicio
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
    //Obtiene todos direcciones
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
    //Obtiene Todas las Proveedores
    async obtenerProveedores(jwt, tipo, clave) {
      this.isLoading = true
      let params = ''
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
    //Nuevo PRE - DAtos iniciales
    nuevaPreCaptura() {
      //Se inicializan los valores de la nueva captura
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      var fecha = new Date()
      this.editedItem.sp_fecha_solicitud = this.fechaformato(fecha)
      //this.editedItem.sp_emp_id_aut = this.empleadoaut[0].emp_id
      this.editedItem.sp_emp_id_aut = this.idEmpleadoAut

      this.editedItem.sp_estatus = 'PRECAP'
      this.isPreCaptura = true
      this.EjercicioValido()
    },
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
    // al escoger un tipo de concepto
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
            //console.log('solpagosAfectar ' + this.solpagosAfectar.length)
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
      //console.log(value)
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
    //Al cambiar Ejercicio
    async onChangeEjercicioPreCap(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      //console.log(this.ejercicio)
      let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      //console.log(this.ejercicio)
      await this.obtenerSolPagosPreCap(jwt, this.ejercicio)
    },
    // Guardar el formulario
    async savePreCap() {
      this.overlay = true
      //this.$v.$touch()
      let jwt = await getValidToken(this)
      //if (!this.$v.$invalid) {
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

      //console.log(this.isPreCaptura)
      if (this.isPreCaptura) {
        body = {
          sp_tipo_sol: tiposol,
          sp_concepto: concepto,
          prov_id: prov,
          cuecon_cuenta: cuenta,
          sp_descripcion: this.editedItem.sp_descripcion,
          sp_pago_nombre_de: this.editedItem.sp_pago_nombre_de,
          sp_importe: this.editedItem.sp_importe,
          sp_observacion: this.editedItem.sp_observacion,
          //sp_fecha_solicitud: this.editedItem.sp_fecha_solicitud,
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
          sp_estatus: this.editedItem.sp_estatus,
          //sp_saldo: saldo,
          sp_saldo: saldofolioafecta,
          sp_id_folio_afecta: folio_afecta,
          sp_devolucion_efectivo: devEfectivo,
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
        if (this.isPreCaptura) {
          payload.body.sp_fecha_solicitud = this.editedItem.sp_fecha_solicitud
          await this.$store
            .dispatch('solpago/editPreSolPagos', payload)
            .then(() => {
              this.msgStore = 'El registro se actualizo con éxito'
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
          await this.$store
            .dispatch('solpago/editSolPagos', payload)
            .then(() => {
              this.msgStore = 'El registro se actualizo con éxito'
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

        //Object.assign(this.solpagos[this.editedIndex], this.editedItem)
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
                    sp_ejercicio_afecta: sp_ejercicio_afecta,
                    sp_devolucion_efectivo: 0,
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
      this.dialogPreCap = false
      this.isPreCaptura = false
      this.checkboxSaldo = false
      //jwt = await getValidToken(this)
      //this.obtenerSolPagos(jwt, 0, this.ejercicio)
      await this.iniciando()
      //}
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
