<template>
  <v-tabs fixed-tabs background-color="indigo" dark>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab @change="refreshGenerales">
      <v-icon left> mdi-file-document-edit-outline </v-icon>Generales
    </v-tab>
    <v-tab @change="refreshPresupuestos">
      <v-icon left> mdi-application-edit-outline </v-icon>Firmas Presupuesto
    </v-tab>
    <v-tab @change="refreshAutoriza">
      <v-icon left> mdi-application-edit </v-icon>Firmas Administrador
    </v-tab>
    <v-tab @change="refreshPagos"> <v-icon left> mdi-account-cash </v-icon>Pagos Tesoreria </v-tab>
    <v-tab @change="refreshEjercidos">
      <v-icon left> mdi-clipboard-list-outline </v-icon>Ejercidos
    </v-tab>
    <v-tab @change="refreshEnvioConta">
      <v-icon left> mdi-clipboard-arrow-right-outline </v-icon>Envio a Contabilidad
    </v-tab>
    <!-- Datos Generales -->
    <v-tab-item>
      <base-material-card color="blue" icon="mdi-file-find-outline" inline class="px-5 py-3">
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>
        <template v-slot:corner-button>
          <v-btn
            small
            class="ma-2"
            elevation="2"
            color="blue"
            :disabled="resultado.length == 0"
            @click="exportar"
            >Exportar -> {{ resultado.length }}</v-btn
          >

          <v-btn small class="ma-2" elevation="2" color="blue" @click="filtrar">Filtrar</v-btn>
        </template>
        <v-card flat>
          <v-row>
            <!-- F I L A        1-->
            <!-- Campo sp_ejercicio -->
            <v-col cols="2" class="v-text">
              <v-select
                v-model="editedItem.sp_ejercicio"
                :items="ejercicios"
                :menu-props="{ top: true, offsetY: true }"
                label="Ejercicio"
                item-text="sp_ejercicio"
                item-value="sp_ejercicio"
                persistent-hint
                multiple
                dense
                hint="Seleciona Ejercicio"
                return-object
                clearable
              >
              </v-select>
            </v-col>
            <!-- Campo sp_id -->
            <v-col cols="2" class="v-text">
              <v-select
                v-model="editedItem.sp_id"
                :items="folios"
                :menu-props="{ top: true, offsetY: true }"
                label="Folios"
                item-text="sp_id"
                item-value="sp_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Folios"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_estatus -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_estatus"
                :items="estatus"
                :menu-props="{ top: true, offsetY: true }"
                item-text="tipo_descripcion"
                item-value="tipo_clave"
                persistent-hint
                multiple
                dense
                clearable
                label="Estatus"
                hint="Seleciona Estatus"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo TIPO DE SOLICITUD -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_tipo_sol"
                :items="tipos"
                :menu-props="{ top: true, offsetY: true }"
                label="Tipo de solicitud"
                item-text="tipo_descripcion"
                item-value="tipo_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Tipo de solicitud"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo CONCEPTO -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_concepto"
                :items="conceptos"
                :menu-props="{ top: true, offsetY: true }"
                label="Concepto"
                item-text="tipo_descripcion"
                item-value="tipo_id"
                persistent-hint
                multiple
                clearable
                dense
                hint="Seleciona Concepto"
                return-object
              >
              </v-select>
            </v-col>
            <!-- F I L A        2-->
            <!-- Campo Proveedores -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.prov_id"
                :items="proveedores"
                :menu-props="{ top: true, offsetY: true }"
                label="Proveedor"
                item-text="prov_razon_social"
                item-value="prov_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Proveedor"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo Cuenta -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.cuecon_cuenta"
                :items="cuentas"
                :menu-props="{ top: true, offsetY: true }"
                label="Cuenta"
                item-text="cuecon_cuenta"
                item-value="cuecon_cuenta"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Cuenta"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo Importe -->
            <v-col cols="2" class="v-text">
              <v-select
                v-model="editedItem.operadores"
                :items="operadores"
                :menu-props="{ top: true, offsetY: true }"
                label="Operador"
                :item-text="(item) => item.simbol + ' ' + item.text"
                item-value="clave"
                persistent-hint
                dense
                clearable
                hint="Seleciona Operador"
                return-object
                @input="setfilterOperadores"
              >
              </v-select>
            </v-col>
            <v-col cols="2" class="v-text" v-if="operador">
              <v-text-field v-model="editedItem.sp_importe" label="Importe" dense clearable>
              </v-text-field>
            </v-col>
            <v-col cols="2" class="v-text" v-if="rango">
              <v-text-field v-model="editedItem.sp_importe2" label="Importe2" dense clearable>
              </v-text-field>
            </v-col>
            <!-- F I L A     3  -->
            <!-- Campo Descripcion -->
            <v-col cols="12" class="v-text">
              <v-text-field
                v-model="editedItem.sp_descripcion"
                label="Descripción"
                dense
                @input="$v.editedItem.sp_descripcion.$reset(), (changed = true)"
                @blur="$v.editedItem.sp_descripcion.$touch()"
              >
              </v-text-field>
            </v-col>
            <!-- F I L A     4  -->
            <!-- Campo Fecha Solicitud -->
            <v-col cols="3" class="v-text">
              <v-menu
                v-model="fromDateMenuFecSolic"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFsol" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_solicitud"
                    label="Fecha Solicitud"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFsol == false"
                  :range="esRangoFsol == true"
                  v-model="editedItem.sp_fecha_solicitud"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo Folio Comprobacion -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_folio_comprobacion"
                :items="foliosComprobacion"
                :menu-props="{ top: true, offsetY: true }"
                label="Folio Comprobación"
                item-text="sp_folio_comprobacion"
                item-value="sp_folio_comprobacion"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Folio Comprobación"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_num_oficio -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_num_oficio"
                :items="numsOficios"
                :menu-props="{ top: true, offsetY: true }"
                label="Numero de Oficio"
                item-text="sp_num_oficio"
                item-value="sp_num_oficio"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Número de Oficio"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fuente_fin -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_fuente_fin"
                :items="fuentesfin"
                :menu-props="{ top: true, offsetY: true }"
                label="Fuente Financiamiento"
                :item-text="(item) => item.tipo_clave + ' - ' + item.tipo_descripcion"
                item-value="tipo_clave"
                multiple
                persistent-hint
                dense
                clearable
                hint="Seleciona Fuente de financiamiento"
                return-object
              >
              </v-select>
            </v-col>
            <!-- F I L A     5  -->
            <!-- Campo sp_user_elabora -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_user_elabora"
                :items="usuariosElabora"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Elaboró"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Elaboró"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fecha_elabora -->
            <v-col cols="3" class="v-text">
              <v-menu
                v-model="fromDateMenuFecElabora"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFelabora" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_elabora"
                    label="Fecha Elaboró"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFelabora == false"
                  :range="esRangoFelabora == true"
                  v-model="editedItem.sp_fecha_elabora"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_no_factura -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_no_factura"
                :items="facturas"
                :menu-props="{ top: true, offsetY: true }"
                label="Factura"
                item-text="sp_no_factura"
                item-value="sp_no_factura"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Factura"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fecha_factura -->
            <v-col cols="3" class="v-text">
              <v-menu
                v-model="fromDateMenuFecFact"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFfac" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_factura"
                    label="Fecha Factura"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFfac == false"
                  :range="esRangoFfac == true"
                  v-model="editedItem.sp_fecha_factura"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_fecha_factura_prob_pago -->
            <v-col cols="3" class="v-text">
              <v-menu
                v-model="fromDateMenuFecProb"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFprob" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_factura_prob_pago"
                    label="Fecha Probable de Pago"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFprob == false"
                  :range="esRangoFprob == true"
                  v-model="editedItem.sp_fecha_factura_prob_pago"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_emp_id_sol-->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_emp_id_sol"
                :items="empleadosSolicita"
                :menu-props="{ top: true, offsetY: true }"
                label="Empleado solicitó"
                item-text="emp_nombre"
                item-value="emp_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Empleado solicitó"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_direccion_sol -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_direccion_sol"
                :items="direccionSolicita"
                :menu-props="{ top: true, offsetY: true }"
                label="Dirección solicita"
                item-text="sp_direccion_sol"
                item-value="sp_direccion_sol"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Dirección Solicita"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </v-card>
        <v-spacer></v-spacer>
        <v-data-table
          :headers="headers"
          :items="resultado"
          dense
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <!--  <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
            <div class="name-info-title">
              {{ formato(eFormatos.FECHA, item.sp_fecha_solicitud) }}
            </div>
          </template>
          <template v-slot:item.sp_importe="{ item }">
            {{ formato(eFormatos.MONEDA, item.sp_importe) }}
          </template> -->

          <template v-slot:no-data> ¡No hay datos para mostrar! </template>
        </v-data-table>
      </base-material-card>
    </v-tab-item>
    <!-- Firmas Presupuesto -->
    <v-tab-item>
      <base-material-card color="blue" icon="mdi-file-find-outline" inline class="px-5 py-3">
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>
        <template v-slot:corner-button>
          <v-btn
            small
            class="ma-2"
            elevation="2"
            color="blue"
            :disabled="resultado.length == 0"
            @click="exportar"
            >Exportar -> {{ resultado.length }}</v-btn
          >
          <v-btn small class="ma-2" elevation="2" color="blue" @click="f">Filtrar</v-btn>
        </template>
        <v-card flat>
          <v-row>
            <!-- F I L A        1-->
            <!-- Campo sp_id_gpo_firma_sol -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_id_gpo_firma_sol"
                :items="gpoEnvFirSol"
                :menu-props="{ top: true, offsetY: true }"
                label="Grupo Envia Firma Solicitante"
                item-text="sp_id_gpo_firma_sol"
                item-value="sp_id_gpo_firma_sol"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Grupo Envia Firma Solicitante"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fecha_firma_sol_ida -->
            <v-col cols="3" class="v-text">
              <v-menu
                v-model="fromDateMenuFecEnvFirSol"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFfsida" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_firma_sol_ida"
                    label="Fecha Envia Firma Solicita"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFfsida == false"
                  :range="esRangoFfsida == true"
                  v-model="editedItem.sp_fecha_firma_sol_ida"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_firma_sol_ida -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_user_firma_sol_ida"
                :items="usuariosEnvSolFirma"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Envia Firma de Solicitante"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Envia Firma de Solicitante"
                return-object
              >
              </v-select>
            </v-col>
            <!-- F I L A   2  -->
            <!-- Campo sp_fecha_firma_sol_vuelta -->
            <v-col cols="6">
              <v-menu
                v-model="fromDateMenuFecRecFirSol"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFrfs" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_firma_sol_vuelta"
                    label="Fecha Recibe Firma Solicita"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFrfs == false"
                  :range="esRangoFrfs == true"
                  v-model="editedItem.sp_fecha_firma_sol_vuelta"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_firma_sol_vuelta -->
            <v-col cols="6">
              <v-select
                v-model="editedItem.sp_user_firma_sol_vuelta"
                :items="usuariosRecSolFirma"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Envia Firma de Solicitante"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Envia Firma de Solicitante"
                return-object
              >
              </v-select>
            </v-col>
            <!-- F I L A   3  -->
            <!-- Campo sp_id_gpo_firma_aut_ida -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_id_gpo_firma_aut_ida"
                :items="gpoEnvFirAut"
                :menu-props="{ top: true, offsetY: true }"
                label="Grupo Envia Firma Autoriza"
                item-text="sp_id_gpo_firma_aut_ida"
                item-value="sp_id_gpo_firma_aut_ida"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Grupo Envia Firma Autoriza"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fecha_firma_aut_ida -->
            <v-col cols="4" class="v-text">
              <v-menu
                v-model="fromDateMenuFecEnvFirAut"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFefa" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_firma_aut_ida"
                    label="Fecha Envia Firma Autoriza"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFefa == false"
                  :range="esRangoFefa == true"
                  v-model="editedItem.sp_fecha_firma_aut_ida"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_firma_aut_ida -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_user_firma_aut_ida"
                :items="usuariosEnvSolAutoriza"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Envia Firma de Autoriza"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Envia Firma de Autoriza"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </v-card>
        <v-spacer></v-spacer>
        <v-data-table
          :headers="headers"
          :items="resultado"
          dense
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:no-data> ¡No hay datos para mostrar! </template>
        </v-data-table>
      </base-material-card>
    </v-tab-item>
    <!-- Firmas Administrador -->
    <v-tab-item>
      <base-material-card color="blue" icon="mdi-file-find-outline" inline class="px-5 py-3">
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>
        <template v-slot:corner-button>
          <v-btn
            small
            class="ma-2"
            elevation="2"
            color="blue"
            :disabled="resultado.length == 0"
            @click="exportar"
            >Exportar -> {{ resultado.length }}</v-btn
          >
          <v-btn small class="ma-2" elevation="2" color="blue" @click="filtrar">Filtrar</v-btn>
        </template>
        <v-card flat>
          <v-row>
            <!-- F I L A        1-->
            <!-- Campo sp_id_gpo_firma_aut_vuelta -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_id_gpo_firma_aut_vuelta"
                :items="gpoEnvFirAutVta"
                :menu-props="{ top: true, offsetY: true }"
                label="Grupo Envia Firma Autoriza"
                item-text="sp_id_gpo_firma_aut_vuelta"
                item-value="sp_id_gpo_firma_aut_vuelta"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Grupo Envia Firma Autoriza"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fecha_firma_aut_vuelta -->
            <v-col cols="4" class="v-text">
              <v-menu
                v-model="fromDateMenuFecEnvFirAutVta"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFfav" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_firma_aut_vuelta"
                    label="Fecha Envia Firma Autoriza"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFfav == false"
                  :range="esRangoFfav == true"
                  v-model="editedItem.sp_fecha_firma_aut_vuelta"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_firma_aut_vuelta -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_user_firma_aut_vuelta"
                :items="usuariosEnvSolAutorizaVta"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Envia Firma de Autoriza Vuelta"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Envia Firma de Autoriza Vuelta"
                return-object
              >
              </v-select>
            </v-col>
            <!-- F I L A        2-->
            <!-- Campo sp_id_gpo_firma_aut_vuelta_gxc -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_id_gpo_firma_aut_vuelta_gxc"
                :items="gpoEnvFirAutVtaGxc"
                :menu-props="{ top: true, offsetY: true }"
                label="Grupo Envia Gastos x Comprobar"
                item-text="sp_id_gpo_firma_aut_vuelta_gxc"
                item-value="sp_id_gpo_firma_aut_vuelta_gxc"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Grupo Envia Gastos x Comprobar"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fecha_conta_gasxcomp -->
            <v-col cols="4" class="v-text">
              <v-menu
                v-model="fromDateMenuFecEnvFirAutVtaGxc"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFcgxc" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_conta_gasxcomp"
                    label="Fecha Envia Gastos x Comprobar"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFcgxc == false"
                  :range="esRangoFcgxc == true"
                  v-model="editedItem.sp_fecha_conta_gasxcomp"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_conta_gasxcomp -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_user_conta_gasxcomp"
                :items="usuariosEnvSolAutorizaVtaGxc"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Elaboró"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Elaboró"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </v-card>
        <v-spacer></v-spacer>
        <v-data-table
          :headers="headers"
          :items="resultado"
          dense
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:no-data> ¡No hay datos para mostrar! </template>
        </v-data-table>
      </base-material-card>
    </v-tab-item>
    <!-- Pagos Tesoreria -->
    <v-tab-item>
      <base-material-card color="blue" icon="mdi-file-find-outline" inline class="px-5 py-3">
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>
        <template v-slot:corner-button>
          <v-btn
            small
            class="ma-2"
            elevation="2"
            color="blue"
            :disabled="resultado.length == 0"
            @click="exportar"
            >Exportar -> {{ resultado.length }}</v-btn
          >
          <v-btn small class="ma-2" elevation="2" color="blue" @click="filtrar">Filtrar</v-btn>
        </template>
        <v-card flat>
          <v-row>
            <!-- F I L A    1  -->
            <!-- Campo  sp_fecha_autoriza_vuelta -->
            <v-col cols="6" class="v-text">
              <v-menu
                v-model="fromDateMenuFecAutorizaVta"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFauv" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_autoriza_vuelta"
                    label="Fecha Autoriza Vuelta"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFauv == false"
                  :range="esRangoFauv == true"
                  v-model="editedItem.sp_fecha_autoriza_vuelta"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_autoriza_vuelta -->
            <v-col cols="6" class="v-text">
              <v-select
                v-model="editedItem.sp_user_autoriza_vuelta"
                :items="usuariosAutorizaVuelta"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Autoriza Vuelta"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Autoriza Vuelta"
                return-object
              >
              </v-select>
            </v-col>
            <!-- F I L A    3  -->
            <!-- Campo  sp_tipo_pago -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_tipo_pago"
                :items="tipospago"
                :menu-props="{ top: true, offsetY: true }"
                item-text="tipo_descripcion"
                item-value="tipo_id"
                persistent-hint
                multiple
                dense
                clearable
                label="Tipos de Pago"
                hint="Seleciona Tipos de PAgo"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_banco_pago -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_banco_pago"
                :items="bancos"
                :menu-props="{ top: true, offsetY: true }"
                label="Banco"
                item-text="tipo_descripcion"
                item-value="tipo_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Banco"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_no_cuenta_pago -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_no_cuenta_pago"
                :items="cuentasPago"
                :menu-props="{ top: true, offsetY: true }"
                label="Cuenta de Pago"
                item-text="tipo_descripcion"
                item-value="tipo_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Cuenta de Pago"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_no_folio_pago -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_no_folio_pago"
                :items="foliospago"
                :menu-props="{ top: true, offsetY: true }"
                label="Folios de Pago"
                item-text="sp_no_folio_pago"
                item-value="sp_no_folio_pago"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Folios de Pago"
                return-object
              >
              </v-select>
            </v-col>
            <!-- F I L A    4  -->
            <!-- Campo sp_fecha_pago_cap -->
            <v-col cols="3" class="v-text">
              <v-menu
                v-model="fromDateMenuFecPagoCap"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFpagcap" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_pago_cap"
                    label="Fecha Pago"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFpagcap == false"
                  :range="esRangoFpagcap == true"
                  v-model="editedItem.sp_fecha_pago_cap"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_fecha_pago -->
            <v-col cols="3" class="v-text">
              <v-menu
                v-model="fromDateMenuFecPago"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFpag" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_pago"
                    label="Fecha Captura de Pago"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFpag == false"
                  :range="esRangoFpag == true"
                  v-model="editedItem.sp_fecha_pago"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_pago -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_user_pago"
                :items="usuariosPago"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Pagó"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Pagó"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_no_poliza_pago -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_no_poliza_pago"
                :items="polizaspago"
                :menu-props="{ top: true, offsetY: true }"
                label="Poliza de Pago"
                item-text="sp_no_poliza_pago"
                item-value="sp_no_poliza_pago"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Poliza de Pago"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </v-card>
        <v-spacer></v-spacer>
        <v-data-table
          :headers="headers"
          :items="resultado"
          dense
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:no-data> ¡No hay datos para mostrar! </template>
        </v-data-table>
      </base-material-card>
    </v-tab-item>
    <!-- Ejercidos -->
    <v-tab-item>
      <base-material-card color="blue" icon="mdi-clipboard-list-outline" inline class="px-5 py-3">
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>
        <template v-slot:corner-button>
          <v-btn
            small
            class="ma-2"
            elevation="2"
            color="blue"
            :disabled="resultado.length == 0"
            @click="exportar"
            >Exportar -> {{ resultado.length }}</v-btn
          >
          <v-btn small class="ma-2" elevation="2" color="blue" @click="filtrar">Filtrar</v-btn>
        </template>
        <v-card flat>
          <v-row>
            <!-- F I L A    1  -->
            <!-- Campo sp_folio_ejercido -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_folio_ejercido"
                :items="foliosEjercidos"
                :menu-props="{ top: true, offsetY: true }"
                label="Folio Ejercido"
                item-text="sp_folio_ejercido"
                item-value="sp_folio_ejercido"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Folio Ejercido"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_poliza_ejercido -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_poliza_ejercido"
                :items="polizasEjercidos"
                :menu-props="{ top: true, offsetY: true }"
                label="Poliza Ejercido"
                item-text="sp_poliza_ejercido"
                item-value="sp_poliza_ejercido"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Poliza Ejercido"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_user_ejercido -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_user_ejercido"
                :items="usuariosEjercido"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Ejercio"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Ejercio"
                return-object
              >
              </v-select>
            </v-col>
            <!-- F I L A    2  -->
            <!-- Campo sp_fecha_ejercido_cap -->
            <v-col cols="6" class="v-text">
              <v-menu
                v-model="fromDateMenuFecEjercidoCap"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFejecap" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_ejercido_cap"
                    label="Fecha Ejercido"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFejecap == false"
                  :range="esRangoFejecap == true"
                  v-model="editedItem.sp_fecha_ejercido_cap"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_fecha_ejercido -->
            <v-col cols="6" class="v-text">
              <v-menu
                v-model="fromDateMenuFecEjercido"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFeje" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_ejercido"
                    label="Fecha Captura Ejercido"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFeje == false"
                  :range="esRangoFeje == true"
                  v-model="editedItem.sp_fecha_ejercido"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- F I L A    3  -->
            <!-- Campo sp_id_gpo_ejercido -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_id_gpo_ejercido"
                :items="gpoEjercido"
                :menu-props="{ top: true, offsetY: true }"
                label="Grupo Envia Ejercido"
                item-text="sp_id_gpo_ejercido"
                item-value="sp_id_gpo_ejercido"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Grupo Envia Ejercido"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fecha_envia_ejercido -->
            <v-col cols="4" class="v-text">
              <v-menu
                v-model="fromDateMenuFecEnvEjercido"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFenveje" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_envia_ejercido"
                    label="Fecha Envia Ejercido"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFenveje == false"
                  :range="esRangoFenveje == true"
                  v-model="editedItem.sp_fecha_envia_ejercido"
                  @input=";(fromDateMenu = false), (changed = true)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_envia_ejercido -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_user_envia_ejercido"
                :items="usuariosEnvEjercido"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Envio Ejercido"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Envio Ejercido"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </v-card>
        <v-spacer></v-spacer>
        <v-data-table
          :headers="headers"
          :items="resultado"
          dense
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:no-data> ¡No hay datos para mostrar! </template>
        </v-data-table>
      </base-material-card>
    </v-tab-item>
    <!-- Envios a contabilidad -->
    <v-tab-item>
      <base-material-card color="blue" icon="mdi-file-find-outline" inline class="px-5 py-3">
        <v-spacer></v-spacer>
        <template v-slot:after-heading></template>
        <template v-slot:corner-button>
          <v-btn
            small
            class="ma-2"
            elevation="2"
            color="blue"
            :disabled="resultado.length == 0"
            @click="exportar"
            >Exportar -> {{ resultado.length }}</v-btn
          >
          <v-btn small class="ma-2" elevation="2" color="blue" @click="filtrar">Filtrar</v-btn>
        </template>
        <v-card flat>
          <v-row>
            <!-- F I L A    1  -->
            <!-- Campo sp_id_gpo_gxc_ent_conta -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_id_gpo_gxc_ent_conta"
                :items="gpoGxcEnvConta"
                :menu-props="{ top: true, offsetY: true }"
                label="Grupo Envia GxC a Contabilidad"
                item-text="sp_id_gpo_gxc_ent_conta"
                item-value="sp_id_gpo_gxc_ent_conta"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Grupo Envia GxC a Contabilidad"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fecha_gxc_ent_conta -->
            <v-col cols="4" class="v-text">
              <v-menu
                v-model="fromDateMenuFecGxcEnvCont"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFgxcec" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_gxc_ent_conta"
                    label="Fecha Envia Gxc a Contabilidad"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFgxcec == false"
                  :range="esRangoFgxcec == true"
                  v-model="editedItem.sp_fecha_gxc_ent_conta"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_gxc_ent_conta -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_user_gxc_ent_conta"
                :items="usuariosGxcEnvCont"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Envia Gxc a Contabilidad"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Envia Gxc a Contabilidad"
                return-object
              >
              </v-select>
            </v-col>
            <!-- F I L A    2  -->
            <!-- Campo sp_id_gpo_envio_cont_np -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_id_gpo_envio_cont_np"
                :items="gpoEnvContNP"
                :menu-props="{ top: true, offsetY: true }"
                label="Grupo Envia a Contabilidad NP"
                item-text="sp_id_gpo_envio_cont_np"
                item-value="sp_id_gpo_envio_cont_np"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Grupo Envia a Contabilidad NP"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fecha_envio_cont_np -->
            <v-col cols="4" class="v-text">
              <v-menu
                v-model="fromDateMenuFecEnvContNP"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFenvconp" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_envio_cont_np"
                    label="Fecha Envio a Contabilidad NP"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFenvconp == false"
                  :range="esRangoFenvconp == true"
                  v-model="editedItem.sp_fecha_envio_cont_np"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_envio_cont_np -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_user_envio_cont_np"
                :items="usuariosEnvContNP"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Envio a Contabilidad NP"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Envio a Contabilidad NP"
                return-object
              >
              </v-select>
            </v-col>
            <!-- F I L A    3  -->
            <!-- Campo sp_folios_comprometido -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_folios_comprometido"
                :items="foliosComprometidos"
                :menu-props="{ top: true, offsetY: true }"
                label="Folios Comprometidos"
                item-text="folio_num"
                item-value="folio_num"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Folios Comprometidos"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_folios_devengado -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_folios_devengado"
                :items="foliosDevengados"
                :menu-props="{ top: true, offsetY: true }"
                label="Folios Devengados"
                item-text="folio_num"
                item-value="folio_num"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Folios Devengados"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fecha_folios -->
            <v-col cols="3" class="v-text">
              <v-menu
                v-model="fromDateMenuFecFolios"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFfolios" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_folios"
                    label="Fecha Folios"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFfolios == false"
                  :range="esRangoFfolios == true"
                  v-model="editedItem.sp_fecha_folios"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_folios -->
            <v-col cols="3" class="v-text">
              <v-select
                v-model="editedItem.sp_user_folios"
                :items="usuariosFolios"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Folios"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Folios"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_id_gpo_folios -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_id_gpo_folios"
                :items="gpoGxcEnvFolios"
                :menu-props="{ top: true, offsetY: true }"
                label="Grupo Envia Folios"
                item-text="sp_id_gpo_folios"
                item-value="sp_id_gpo_folios"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Grupo Envia Folios"
                return-object
              >
              </v-select>
            </v-col>
            <!-- Campo sp_fecha_gpo_folios -->
            <v-col cols="4" class="v-text">
              <v-menu
                v-model="fromDateMenuFecEnvFolios"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <v-checkbox v-model="esRangoFgpofolios" label="Selecciona Rango ?"></v-checkbox>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.sp_fecha_gpo_folios"
                    label="Fecha Envia Folios"
                    prepend-icon="mdi-calendar-month"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="minDate"
                  :max="maxDate"
                  :multiple="esRangoFgpofolios == false"
                  :range="esRangoFgpofolios == true"
                  v-model="editedItem.sp_fecha_gpo_folios"
                  @input=";(fromDateMenu = false), (changed = true)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- Campo sp_user_gpo_folios -->
            <v-col cols="4" class="v-text">
              <v-select
                v-model="editedItem.sp_user_gpo_folios"
                :items="usuariosEnvFolios"
                :menu-props="{ top: true, offsetY: true }"
                label="Usuario Envio Folios"
                item-text="usr_nombres"
                item-value="usr_id"
                persistent-hint
                multiple
                dense
                clearable
                hint="Seleciona Usuario Envio Folios"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
        </v-card>
        <v-spacer></v-spacer>
        <v-data-table
          :headers="headers"
          :items="resultado"
          dense
          :loading="isLoading"
          loading-text="Cargando... Espere por favor"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:no-data> ¡No hay datos para mostrar! </template>
        </v-data-table>
      </base-material-card>
    </v-tab-item>
    <v-dialog v-model="dialog" max-width="1024px">
      <v-divider class="mt-3" />
      <v-card>
        <v-card-title>
          <span class="headline">Exportar </span>
          <!-- <v-img src="@/assets/logo.png" width="70%" height="70%"></v-img> -->
          <v-img src="@/assets/logo_ivey.jpg" width="20%" height="20%"></v-img>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="editedItem.fields"
            :items="fieldsAllExportar"
            :menu-props="{ maxHeight: '400' }"
            label="Campos a Exportar"
            item-text="text"
            item-value="campo"
            persistent-hint
            multiple
            dense
            clearable
            hint="Seleciona Campos a Exportar"
            @input="setfilterCampos"
            return-object
          >
          </v-select>
          <!-- <v-data-table
            :headers="headers"
            :items="resultado"
            dense
            :loading="isLoading"
            loading-text="Cargando... Espere por favor"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:[`item.sp_fecha_solicitud`]="{ item }">
              <div class="name-info-title">
                {{ formato(eFormatos.FECHA, item.sp_fecha_solicitud) }}
              </div>
            </template>
            <template v-slot:item.sp_importe="{ item }">
              {{ formato(eFormatos.MONEDA, item.sp_importe) }}
            </template>

            <template v-slot:no-data> ¡No hay datos para mostrar! </template>
          </v-data-table> -->
        </v-card-text>
        <!-- Empieza DataExporter CAPTURA-->
        <DataExporter
          :dataArray="resultado"
          :dataFields="fieldsExportar"
          fileName="consulta"
          pdfView="none"
        />
      </v-card>
    </v-dialog>
  </v-tabs>
</template>
<script>
import { getValidToken } from '@/store/helpers.js'
import * as tools from '@/store/modules/tools.store.js'
import DataExporter from '@/components/general/DataExporter.vue'
export default {
  components: {
    //ConfirmationDialog,
    //Status,
    DataExporter,
  },
  data: () => ({
    eFormatos: tools.formatos,
    dialog: false,
    isLoading: false,
    fromDateMenuFecElabora: false,
    fromDateMenuFecAutorizaVta: false,
    fromDateMenuFecEnvContNP: false,
    fromDateMenuFecEnvEjercido: false,
    fromDateMenuFecEnvFirAut: false,
    fromDateMenuFecEnvFirAutVta: false,
    fromDateMenuFecEnvFirAutVtaGxc: false,
    fromDateMenuFecEnvFirSol: false,
    fromDateMenuFecEnvFolios: false,
    fromDateMenuFecEjercido: false,
    fromDateMenuFecEjercidoCap: false,
    fromDateMenuFecFact: false,
    fromDateMenuFecFirmaAutorizaVuelta: false,
    fromDateMenuFecFolios: false,
    fromDateMenuFecGxcEnvCont: false,
    fromDateMenuFecPago: false,
    fromDateMenuFecPagoCap: false,
    fromDateMenuFecProb: false,
    fromDateMenuFecRecFirSol: false,
    fromDateMenuFecSolic: false,
    minDate: '2021-01-01',
    maxDate: '2050-01-31',
    esRangoFelabora: true,
    esRangoFsol: true,
    esRangoFfac: true,
    esRangoFprob: true,
    esRangoFfsida: true,
    esRangoFrfs: true,
    esRangoFefa: true,
    esRangoFfav: true,
    esRangoFcgxc: true,
    esRangoFauv: true,
    esRangoFiauvta: true,
    esRangoFpagcap: true,
    esRangoFpag: true,
    esRangoFeje: true,
    esRangoFejecap: true,
    esRangoFenveje: true,
    esRangoFgxcec: true,
    esRangoFenvconp: true,
    esRangoFfolios: true,
    esRangoFgpofolios: true,
    bancos: [],
    conceptos: [],
    cuentas: [],
    cuentasPago: [],
    direccionSolicita: [],
    empleadosSolicita: [],
    estatus: [],
    facturas: [],
    folios: [],
    foliosComprobacion: [],
    foliosComprometidos: [],
    foliosDevengados: [],
    foliosEjercidos: [],
    foliospago: [],
    fuentesfin: [],
    gpoEjercido: [],
    gpoEnvContNP: [],
    gpoEnvFirmaAutorizaVuelta: [],
    gpoEnvFirSol: [],
    gpoEnvFirAut: [],
    gpoEnvFirAutVta: [],
    gpoEnvFirAutVtaGxc: [],
    gpoGxcEnvConta: [],
    gpoGxcEnvFolios: [],
    numsOficios: [],
    polizaspago: [],
    polizasEjercidos: [],
    proveedores: [],
    rango: false,
    operador: false,
    resultado: [],
    tipos: [],
    tipospago: [],
    usuariosEnviaPagos: [],
    usuariosAutorizaVuelta: [],
    usuariosElabora: [],
    usuariosEjercido: [],
    usuariosEnvContNP: [],
    usuariosEnvEjercido: [],
    usuariosEnvFolios: [],
    usuariosEnvSolAutoriza: [],
    usuariosEnvSolAutorizaVta: [],
    usuariosEnvSolAutorizaVtaGxc: [],
    usuariosEnvSolFirma: [],
    usuariosFolios: [],
    usuariosGxcEnvCont: [],
    usuariosPago: [],
    usuariosRecSolFirma: [],
    ejercicio: 0,
    ejercicios: [],

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
      sp_fecha_elabora: '',
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
      sp_user_elabora: 0,
      operadores: 0,
      sp_id_gpo_firma_sol: 0,
      sp_fecha_firma_sol_ida: '',
      sp_user_firma_sol_ida: 0,
      sp_fecha_firma_sol_vuelta: '',
      sp_user_firma_sol_vuelta: 0,
      sp_id_gpo_firma_aut_ida: 0,
      sp_fecha_firma_aut_ida: '',
      sp_user_firma_aut_ida: 0,
      sp_id_gpo_firma_aut_vuelta: 0,
      sp_fecha_firma_aut_vuelta: '',
      sp_user_firma_aut_vuelta: 0,
      sp_id_gpo_firma_aut_vuelta_gxc: 0,
      sp_fecha_conta_gasxcomp: '',
      sp_user_conta_gasxcomp: 0,
      sp_fecha_autoriza_vuelta: '',
      sp_user_autoriza_vuelta: 0,
      sp_tipo_pago: 0,
      sp_banco_pago: 0,
      sp_no_cuenta_pago: 0,
      sp_no_folio_pago: 0,
      sp_fecha_pago_cap: '',
      sp_fecha_pago: '',
      sp_user_pago: 0,
      sp_no_poliza_pago: 0,
      sp_folio_ejercido: 0,
      sp_poliza_ejercido: 0,
      sp_user_ejercido: 0,
      sp_fecha_ejercido_cap: '',
      sp_fecha_ejercido: '',
      sp_id_gpo_ejercido: 0,
      sp_fecha_envia_ejercido: '',
      sp_user_envia_ejercido: 0,
      sp_id_gpo_gxc_ent_conta: 0,
      sp_fecha_gxc_ent_conta: '',
      sp_user_gxc_ent_conta: 0,
      sp_id_gpo_envio_cont_np: 0,
      sp_fecha_envio_cont_np: '',
      sp_user_envio_cont_np: 0,
      sp_folios_comprometido: 0,
      sp_folios_devengado: 0,
      sp_fecha_folios: '',
      sp_user_folios: 0,
      sp_id_gpo_folios: 0,
      sp_fecha_gpo_folios: '',
      sp_user_gpo_folios: 0,
    },
    headers: [
      { text: 'Ejercicio', align: 'start', value: 'sp_ejercicio' },
      { text: 'Folio', align: 'start', value: 'sp_id' },
      { text: 'Tipo Sol.', value: 'nom_tipo_sol' },
      { text: 'Concepto', value: 'nom_concepto' },
      { text: 'Pago a Nombre de', value: 'sp_pago_nombre_de' },
      { text: 'Fecha Solicitud', value: 'sp_fecha_solicitud' },
      { text: '$ Importe', value: 'sp_importe' },
      { text: 'Estatus', value: 'estatus_nombre' },
      //{ text: 'Activo', value: 'cta_activo' },
    ],
    fieldsExportar: {},
    fieldsAllExportar: [
      //Generales
      { text: 'Ejercicio', campo: 'sp_ejercicio' },
      { text: 'Folio', campo: 'sp_id' },
      { text: 'Estatus', campo: 'estatus_nombre' },
      { text: 'Tipo_Solicitud', campo: 'nom_tipo_sol' },
      { text: 'Concepto', campo: 'nom_concepto' },
      { text: 'Razon_Social', campo: 'prov_razon_social' },
      { text: 'Pago_Nombre', campo: 'sp_pago_nombre_de' },
      { text: 'Cuenta_Contable', campo: 'cuecon_cuenta' },
      { text: 'Descripción', campo: 'sp_descripcion' },
      { text: 'Importe', campo: 'sp_importe' },
      { text: 'Fecha_Solicitud', campo: 'sp_fecha_solicitud' },
      { text: 'Folio_Comprobacion', campo: 'sp_folio_comprobacion' },
      { text: 'Numero_Oficio', campo: 'sp_num_oficio' },
      { text: 'Fuente_Financiamiento', campo: 'sp_fuente_fin' },
      { text: 'Nombre_Fuente_Financiamiento', campo: 'nom_fuente_fin' },
      { text: 'User_Elabora', campo: 'nom_user_elabora' },
      { text: 'Fecha_Elabora', campo: 'sp_fecha_elabora' },
      { text: 'Numero_Factura', campo: 'sp_no_factura' },
      { text: 'Fecha_Factura', campo: 'sp_fecha_factura' },
      { text: 'Fecha_Probable_Pago', campo: 'sp_fecha_factura_prob_pago' },
      { text: 'Empleado_Autoriza', campo: 'nombre_aut' },
      { text: 'Empleado_Solicita', campo: 'nombre_sol' },
      { text: 'Direccion_Solicita', campo: 'direccion_sol' },
      //Firmas Presupuesto
      { text: 'Grupo_Envia_Fir_Sol', campo: 'sp_id_gpo_firma_sol' },
      { text: 'Fecha_Envia_Fir_Sol', campo: 'sp_fecha_firma_sol_ida' },
      { text: 'Usuario_Envia_Fir_Sol', campo: 'nombre_firma_sol_ida' },
      { text: 'Fecha_Vuelta_Fir_Sol', campo: 'sp_fecha_firma_sol_vuelta' },
      { text: 'Usuario_Vuelta_Fir_Sol', campo: 'nombre_firma_sol_vuelta' },
      { text: 'Grupo_Envia_Fir_Aut', campo: 'sp_id_gpo_firma_aut_ida' },
      { text: 'Fecha_Envia_Fir_Aut', campo: 'sp_fecha_firma_aut_ida' },
      { text: 'Usuario_Envia_Fir_Aut', campo: 'nombre_firma_aut_ida' },
      //Firmas Administrador
      { text: 'Grupo_Vuelta_Firma_Autoriza', campo: 'sp_id_gpo_firma_aut_vuelta' },
      { text: 'Fecha_Vuelta_Firma_Autoriza', campo: 'sp_fecha_firma_aut_vuelta' },
      { text: 'Usuario_Vuelta_Firma_Autoriza', campo: 'nombre_firma_aut_vuelta' },
      { text: 'Grupo_Vuelta_Firma_Autoriza_Gxc', campo: 'sp_id_gpo_firma_aut_vuelta_gxc' },
      { text: 'Fecha_Vuelta_Firma_Autoriza_Gxc', campo: 'sp_fecha_conta_gasxcomp' },
      { text: 'Usuario_Vuelta_Firma_Autoriza_Gxc', campo: 'nombre_conta_gasxcomp' },
      //Pagos Tesoreria
      { text: 'Fecha_Recibe_Firma_Autoriza', campo: 'sp_fecha_autoriza_vuelta' },
      { text: 'Usuario_Recibe_Firma_Autoriza', campo: 'nombre_autoriza_vuelta' },
      { text: 'Tipo_Pago', campo: 'Nom_tipo_pago' },
      { text: 'Banco', campo: 'NomBanco' },
      { text: 'Cuenta_Pago', campo: 'CuentaBancaria' },
      { text: 'Folio_Pago', campo: 'sp_no_folio_pago' },
      { text: 'Poliza_Pago', campo: 'sp_no_poliza_pago' },
      { text: 'Fecha_Pago', campo: 'sp_fecha_pago_cap' },
      { text: 'Fecha_Captura_Pago', campo: 'sp_fecha_pago' },
      { text: 'Usuario_Captura_Pago', campo: 'nombre_pago' },
      //Ejercidos
      { text: 'Folio_Ejercido', campo: 'sp_folio_ejercido' },
      { text: 'Poliza_Ejercido', campo: 'sp_poliza_ejercido' },
      { text: 'Fecha_Ejercido', campo: 'sp_fecha_ejercido_cap' },
      { text: 'Fecha_Captura_Ejercido', campo: 'sp_fecha_ejercido' },
      { text: 'Usuario_Captura_Ejercido', campo: 'nombre_ejercido' },
      { text: 'Grupo_Envia_Ejercido', campo: 'sp_id_gpo_ejercido' },
      { text: 'Fecha_Envia_Ejercido', campo: 'sp_fecha_envia_ejercido' },
      { text: 'Usuario_Envia_Ejercido', campo: 'nombre_envia_ejercido' },
      //Envio a Contabilidad
      { text: 'Grupo_Entrega_Gxc_Cont', campo: 'sp_id_gpo_gxc_ent_conta' },
      { text: 'Fecha_Entrega_Gxc_Cont', campo: 'sp_fecha_gxc_ent_conta' },
      { text: 'Usuario_Entrega_Gxc_Cont', campo: 'nombre_usr_fingxc' },
      { text: 'Grupo_Envia_NP_Cont', campo: 'sp_id_gpo_envio_cont_np' },
      { text: 'Fecha_Envia_NP_Cont', campo: 'sp_fecha_envio_cont_np' },
      { text: 'Usuario_Envia_NP_Cont', campo: 'nombre_envio_cont_np' },
      { text: 'Folios_Comprometidos', campo: 'foliosComprometidos' },
      { text: 'Folios_Devengados', campo: 'foliosDevengados' },
      { text: 'Fecha_Captura_Folios', campo: 'sp_fecha_folios' },
      { text: 'Usuario_Captura_Folios', campo: 'nombre_folios' },
      { text: 'Grupo_Envia_Folios', campo: 'sp_id_gpo_folios' },
      { text: 'Fecha_Envia_Folios', campo: 'sp_fecha_gpo_folios' },
      { text: 'Usuario_Envia_Folios', campo: 'nombre_gpo_folios' },
    ],
    operadores: [
      { simbol: '>', text: 'Mayor', clave: 'MAY' },
      { simbol: '>=', text: 'Mayor Igual', clave: 'MAYEQL' },
      { simbol: '=', text: 'Igual', clave: 'EQL' },
      { simbol: '<>', text: 'Diferente', clave: 'DIF' },
      { simbol: '<', text: 'Menor', clave: 'MEN' },
      { simbol: '<=', text: 'Menor Igual', clave: 'MENEQL' },
      { simbol: '><', text: 'Entre', clave: 'RANGE' },
    ],
  }),
  async created() {
    await this.iniciando()
  },
  methods: {
    //Exportar folios
    async exportar() {
      //console.log('Exportar')
      if (this.resultado.length > 0) {
        this.dialog = true
      }
    },
    //Consultar Folios
    async filtrar() {
      let jwt = await getValidToken(this)
      let filtro = ''
      let filtroFecha = ''
      let valores = ''
      let valor = ''
      var i

      //Datos Generales
      // Campo sp_ejercicio
      if (this.editedItem.sp_ejercicio.length > 0) {
        for (i in this.editedItem.sp_ejercicio) {
          if (this.editedItem.sp_ejercicio[i].sp_ejercicio != '') {
            valores = valores + this.editedItem.sp_ejercicio[i].sp_ejercicio + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          filtro = 'sp_ejercicio in (' + valores + ')'
        }
      }
      // Campo sp_id
      if (this.editedItem.sp_id.length > 0) {
        for (i in this.editedItem.sp_id) {
          if (this.editedItem.sp_id[i].sp_id != '') {
            valores = valores + this.editedItem.sp_id[i].sp_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          filtro = 'sp_id in (' + valores + ')'
        }
      }
      // Campo sp_estatus
      if (this.editedItem.sp_estatus.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_estatus) {
          if (this.editedItem.sp_estatus[i].tipo_clave != '') {
            //En caso de filtrar con cadena se le agrega ''
            valor = "'" + this.editedItem.sp_estatus[i].tipo_clave + "'"
            valores = valores + valor + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND sp_estatus in (' + valores + ')'
          } else {
            filtro = 'sp_estatus in (' + valores + ')'
          }
        }
      }
      // Campo sp_tipo_sol
      if (this.editedItem.sp_tipo_sol.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_tipo_sol) {
          if (this.editedItem.sp_tipo_sol[i].tipo_id != '') {
            valores = valores + this.editedItem.sp_tipo_sol[i].tipo_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND sp_tipo_sol in (' + valores + ')'
          } else {
            filtro = 'sp_tipo_sol in (' + valores + ')'
          }
        }
      }
      // Campo sp_concepto
      if (this.editedItem.sp_concepto.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_concepto) {
          if (this.editedItem.sp_concepto[i].tipo_id != '') {
            valores = valores + this.editedItem.sp_concepto[i].tipo_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND sp_concepto in (' + valores + ')'
          } else {
            filtro = 'sp_concepto in (' + valores + ')'
          }
        }
      }
      // Campo prov_id
      if (this.editedItem.prov_id.length > 0) {
        valores = ''
        for (i in this.editedItem.prov_id) {
          if (this.editedItem.prov_id[i].prov_id != '') {
            valores = valores + this.editedItem.prov_id[i].prov_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.prov_id in (' + valores + ')'
          } else {
            filtro = 's.prov_id in (' + valores + ')'
          }
        }
      }
      // Campo cuecon_cuenta
      if (this.editedItem.cuecon_cuenta.length > 0) {
        valores = ''
        for (i in this.editedItem.cuecon_cuenta) {
          if (this.editedItem.cuecon_cuenta[i].cuecon_cuenta != '') {
            //En caso de filtrar con cadena se le agrega ''
            valor = "'" + this.editedItem.cuecon_cuenta[i].cuecon_cuenta + "'"
            valores = valores + valor + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.cuecon_cuenta in (' + valores + ')'
          } else {
            filtro = 's.cuecon_cuenta in (' + valores + ')'
          }
        }
      }
      // Campo Descripcion
      if (this.editedItem.sp_descripcion != '') {
        valor = this.editedItem.sp_descripcion
        if (filtro != '') {
          //filtro = filtro + '/s.sp_descripcion/LIKE/' + valor
          filtro = 'LIKE/s.sp_descripcion/' + valor + '/' + filtro
        } else {
          //filtro = "s.sp_descripcion like '%" + valor + "%'"
          filtro = 'LIKE/s.sp_descripcion/' + valor
        }
      }
      // Campo sp_importe
      if (this.editedItem.operadores != undefined) {
        //console.log('Entro a filtra Sp_importe')
        let filtroImporte = ''
        if (this.editedItem.operadores.clave == 'RANGE') {
          //console.log('RANGE')
          if (this.editedItem.sp_importe > 0 && this.editedItem.sp_importe2 > 0) {
            if (this.editedItem.sp_importe < this.editedItem.sp_importe2) {
              filtroImporte =
                'sp_importe >= ' +
                this.editedItem.sp_importe +
                ' and sp_importe <=  ' +
                this.editedItem.sp_importe2
            }
          }
        } else {
          if (this.editedItem.sp_importe > 0) {
            filtroImporte =
              'sp_importe ' + this.editedItem.operadores.simbol + ' ' + this.editedItem.sp_importe
          }
        }
        if (filtro != '') {
          if (filtroImporte != '') {
            filtro = filtro + ' AND ' + filtroImporte
          }
        } else {
          filtro = filtroImporte
        }
      }
      // Campo sp_fecha_solicitud
      if (this.editedItem.sp_fecha_solicitud.length > 0) {
        if (this.esRangoFsol) {
          //Rango de Fechas
          if (this.editedItem.sp_fecha_solicitud[0] > this.editedItem.sp_fecha_solicitud[1]) {
            filtroFecha =
              "s.sp_fecha_solicitud >= '" +
              this.editedItem.sp_fecha_solicitud[1] +
              "' and s.sp_fecha_solicitud <= '" +
              this.editedItem.sp_fecha_solicitud[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_solicitud >= '" +
              this.editedItem.sp_fecha_solicitud[0] +
              "' and s.sp_fecha_solicitud <= '" +
              this.editedItem.sp_fecha_solicitud[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_solicitud) {
            if (this.editedItem.sp_fecha_solicitud[i] != '') {
              filtroFecha =
                filtroFecha +
                "s.sp_fecha_solicitud = '" +
                this.editedItem.sp_fecha_solicitud[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      // Campo sp_folio_comprobacion
      if (this.editedItem.sp_folio_comprobacion.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_folio_comprobacion) {
          if (this.editedItem.sp_folio_comprobacion[i].sp_folio_comprobacion != '') {
            //En caso de filtrar con cadena se le agrega ''
            valor = "'" + this.editedItem.sp_folio_comprobacion[i].sp_folio_comprobacion + "'"
            valores = valores + valor + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_folio_comprobacion in (' + valores + ')'
          } else {
            filtro = 's.sp_folio_comprobacion in (' + valores + ')'
          }
        }
      }
      // Campo sp_num_oficio
      if (this.editedItem.sp_num_oficio.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_num_oficio) {
          if (this.editedItem.sp_num_oficio[i].sp_num_oficio != '') {
            //En caso de filtrar con cadena se le agrega ''
            valor = "'" + this.editedItem.sp_num_oficio[i].sp_num_oficio + "'"
            valores = valores + valor + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_num_oficio in (' + valores + ')'
          } else {
            filtro = 's.sp_num_oficio in (' + valores + ')'
          }
        }
      }
      // Campo sp_fuente_fin
      if (this.editedItem.sp_fuente_fin.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_fuente_fin) {
          if (this.editedItem.sp_fuente_fin[i].tipo_clave != '') {
            valores = valores + this.editedItem.sp_fuente_fin[i].tipo_clave + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_fuente_fin in (' + valores + ')'
          } else {
            filtro = 's.sp_fuente_fin in (' + valores + ')'
          }
        }
      }
      // Campo sp_user_elabora
      if (this.editedItem.sp_user_elabora.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_elabora) {
          if (this.editedItem.sp_user_elabora[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_elabora[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_elabora in (' + valores + ')'
          } else {
            filtro = 's.sp_user_elabora in (' + valores + ')'
          }
        }
      }
      // Campo sp_fecha_elabora
      if (this.editedItem.sp_fecha_elabora.length > 0) {
        if (this.esRangoFelabora) {
          //Rango de Fechas
          if (this.editedItem.sp_fecha_elabora[0] > this.editedItem.sp_fecha_elabora[1]) {
            filtroFecha =
              "s.sp_fecha_elabora >= '" +
              this.editedItem.sp_fecha_elabora[1] +
              "' and s.sp_fecha_elabora <= '" +
              this.editedItem.sp_fecha_elabora[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_elabora >= '" +
              this.editedItem.sp_fecha_elabora[0] +
              "' and s.sp_fecha_elabora <= '" +
              this.editedItem.sp_fecha_elabora[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_elabora) {
            if (this.editedItem.sp_fecha_elabora[i] != '') {
              filtroFecha = /*                 filtroFecha +
                "s.sp_fecha_elabora = '" +
                this.editedItem.sp_fecha_elabora[i] +
                "' or "
 */ filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_elabora,date) = '" +
                this.editedItem.sp_fecha_elabora[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      // Campo sp_no_factura
      if (this.editedItem.sp_no_factura.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_no_factura) {
          if (this.editedItem.sp_no_factura[i].sp_no_factura != '') {
            //En caso de filtrar con cadena se le agrega ''
            valor = "'" + this.editedItem.sp_no_factura[i].sp_no_factura + "'"
            valores = valores + valor + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_no_factura in (' + valores + ')'
          } else {
            filtro = 's.sp_no_factura in (' + valores + ')'
          }
        }
      }
      // Campo sp_fecha_factura
      if (this.editedItem.sp_fecha_factura.length > 0) {
        if (this.esRangoFsol) {
          //Rango de Fechas
          if (this.editedItem.sp_fecha_factura[0] > this.editedItem.sp_fecha_factura[1]) {
            filtroFecha =
              "s.sp_fecha_factura >= '" +
              this.editedItem.sp_fecha_factura[1] +
              "' and s.sp_fecha_factura <= '" +
              this.editedItem.sp_fecha_factura[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_factura >= '" +
              this.editedItem.sp_fecha_factura[0] +
              "' and s.sp_fecha_factura <= '" +
              this.editedItem.sp_fecha_factura[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_factura) {
            if (this.editedItem.sp_fecha_factura[i] != '') {
              filtroFecha =
                filtroFecha +
                "s.sp_fecha_factura = '" +
                this.editedItem.sp_fecha_factura[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      // Campo sp_fecha_factura_prob_pago
      if (this.editedItem.sp_fecha_factura_prob_pago.length > 0) {
        if (this.esRangoFsol) {
          //Rango de Fechas
          if (
            this.editedItem.sp_fecha_factura_prob_pago[0] >
            this.editedItem.sp_fecha_factura_prob_pago[1]
          ) {
            filtroFecha =
              "s.sp_fecha_factura_prob_pago >= '" +
              this.editedItem.sp_fecha_factura_prob_pago[1] +
              "' and s.sp_fecha_factura_prob_pago <= '" +
              this.editedItem.sp_fecha_factura_prob_pago[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_factura_prob_pago >= '" +
              this.editedItem.sp_fecha_factura_prob_pago[0] +
              "' and s.sp_fecha_factura_prob_pago <= '" +
              this.editedItem.sp_fecha_factura_prob_pago[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_factura_prob_pago) {
            if (this.editedItem.sp_fecha_factura_prob_pago[i] != '') {
              filtroFecha =
                filtroFecha +
                "s.sp_fecha_factura_prob_pago = '" +
                this.editedItem.sp_fecha_factura_prob_pago[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      // Campo sp_emp_id_sol
      if (this.editedItem.sp_emp_id_sol.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_emp_id_sol) {
          if (this.editedItem.sp_emp_id_sol[i].emp_id != '') {
            valores = valores + this.editedItem.sp_emp_id_sol[i].emp_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_emp_id_sol in (' + valores + ')'
          } else {
            filtro = 's.sp_emp_id_sol in (' + valores + ')'
          }
        }
      }
      // Campo sp_direccion_sol
      if (this.editedItem.sp_direccion_sol.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_direccion_sol) {
          if (this.editedItem.sp_direccion_sol[i].sp_direccion_sol != '') {
            //En caso de filtrar con cadena se le agrega ''
            valor = "'" + this.editedItem.sp_direccion_sol[i].sp_direccion_sol + "'"
            valores = valores + valor + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_direccion_sol in (' + valores + ')'
          } else {
            filtro = 's.sp_direccion_sol in (' + valores + ')'
          }
        }
      }

      //  FIRMAS PRESUPUESTO
      //  sp_id_gpo_firma_sol
      if (this.editedItem.sp_id_gpo_firma_sol.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_id_gpo_firma_sol) {
          if (this.editedItem.sp_id_gpo_firma_sol[i].sp_id_gpo_firma_sol != '') {
            valores = valores + this.editedItem.sp_id_gpo_firma_sol[i].sp_id_gpo_firma_sol + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_id_gpo_firma_sol in (' + valores + ')'
          } else {
            filtro = 's.sp_id_gpo_firma_sol in (' + valores + ')'
          }
        }
      }
      //  sp_fecha_firma_sol_ida
      if (this.editedItem.sp_fecha_firma_sol_ida.length > 0) {
        if (this.esRangoFfsida) {
          //Rango de Fechas
          if (
            this.editedItem.sp_fecha_firma_sol_ida[0] > this.editedItem.sp_fecha_firma_sol_ida[1]
          ) {
            filtroFecha =
              "s.sp_fecha_firma_sol_ida >= '" +
              this.editedItem.sp_fecha_firma_sol_ida[1] +
              "' and s.sp_fecha_firma_sol_ida <= '" +
              this.editedItem.sp_fecha_firma_sol_ida[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_firma_sol_ida >= '" +
              this.editedItem.sp_fecha_firma_sol_ida[0] +
              "' and s.sp_fecha_firma_sol_ida <= '" +
              this.editedItem.sp_fecha_firma_sol_ida[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_firma_sol_ida) {
            if (this.editedItem.sp_fecha_firma_sol_ida[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_firma_sol_ida,date) = '" +
                this.editedItem.sp_fecha_firma_sol_ida[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_user_firma_sol_ida
      if (this.editedItem.sp_user_firma_sol_ida.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_firma_sol_ida) {
          if (this.editedItem.sp_user_firma_sol_ida[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_firma_sol_ida[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_firma_sol_ida in (' + valores + ')'
          } else {
            filtro = 's.sp_user_firma_sol_ida in (' + valores + ')'
          }
        }
      }
      //  sp_fecha_firma_sol_vuelta
      if (this.editedItem.sp_fecha_firma_sol_vuelta.length > 0) {
        if (this.esRangoFrfs) {
          //Rango de Fechas
          if (
            this.editedItem.sp_fecha_firma_sol_vuelta[0] >
            this.editedItem.sp_fecha_firma_sol_vuelta[1]
          ) {
            filtroFecha =
              "s.sp_fecha_firma_sol_vuelta >= '" +
              this.editedItem.sp_fecha_firma_sol_vuelta[1] +
              "' and s.sp_fecha_firma_sol_vuelta <= '" +
              this.editedItem.sp_fecha_firma_sol_vuelta[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_firma_sol_vuelta >= '" +
              this.editedItem.sp_fecha_firma_sol_vuelta[0] +
              "' and s.sp_fecha_firma_sol_vuelta <= '" +
              this.editedItem.sp_fecha_firma_sol_vuelta[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_firma_sol_vuelta) {
            if (this.editedItem.sp_fecha_firma_sol_vuelta[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_firma_sol_vuelta,date) = '" +
                this.editedItem.sp_fecha_firma_sol_vuelta[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_user_firma_sol_vuelta
      if (this.editedItem.sp_user_firma_sol_vuelta.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_firma_sol_vuelta) {
          if (this.editedItem.sp_user_firma_sol_vuelta[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_firma_sol_vuelta[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_firma_sol_vuelta in (' + valores + ')'
          } else {
            filtro = 's.sp_user_firma_sol_vuelta in (' + valores + ')'
          }
        }
      }
      //  sp_id_gpo_firma_aut_ida
      if (this.editedItem.sp_id_gpo_firma_aut_ida.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_id_gpo_firma_aut_ida) {
          if (this.editedItem.sp_id_gpo_firma_aut_ida[i].sp_id_gpo_firma_aut_ida != '') {
            valores =
              valores + this.editedItem.sp_id_gpo_firma_aut_ida[i].sp_id_gpo_firma_aut_ida + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_id_gpo_firma_aut_ida in (' + valores + ')'
          } else {
            filtro = 's.sp_id_gpo_firma_aut_ida in (' + valores + ')'
          }
        }
      }
      //  sp_fecha_firma_aut_ida
      if (this.editedItem.sp_fecha_firma_aut_ida.length > 0) {
        if (this.esRangoFfsida) {
          //Rango de Fechas
          if (
            this.editedItem.sp_fecha_firma_aut_ida[0] > this.editedItem.sp_fecha_firma_aut_ida[1]
          ) {
            filtroFecha =
              "s.sp_fecha_firma_aut_ida >= '" +
              this.editedItem.sp_fecha_firma_aut_ida[1] +
              "' and s.sp_fecha_firma_aut_ida <= '" +
              this.editedItem.sp_fecha_firma_aut_ida[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_firma_aut_ida >= '" +
              this.editedItem.sp_fecha_firma_aut_ida[0] +
              "' and s.sp_fecha_firma_aut_ida <= '" +
              this.editedItem.sp_fecha_firma_aut_ida[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_firma_aut_ida) {
            if (this.editedItem.sp_fecha_firma_aut_ida[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_firma_aut_ida,date) = '" +
                this.editedItem.sp_fecha_firma_aut_ida[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_user_firma_aut_ida
      if (this.editedItem.sp_user_firma_aut_ida.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_firma_aut_ida) {
          if (this.editedItem.sp_user_firma_aut_ida[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_firma_aut_ida[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_firma_aut_ida in (' + valores + ')'
          } else {
            filtro = 's.sp_user_firma_aut_ida in (' + valores + ')'
          }
        }
      }

      //  Firmas Administrador
      //  sp_id_gpo_firma_aut_vuelta
      if (this.editedItem.sp_id_gpo_firma_aut_vuelta.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_id_gpo_firma_aut_vuelta) {
          if (this.editedItem.sp_id_gpo_firma_aut_vuelta[i].sp_id_gpo_firma_aut_vuelta != '') {
            valores =
              valores +
              this.editedItem.sp_id_gpo_firma_aut_vuelta[i].sp_id_gpo_firma_aut_vuelta +
              ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_id_gpo_firma_aut_vuelta in (' + valores + ')'
          } else {
            filtro = 's.sp_id_gpo_firma_aut_vuelta in (' + valores + ')'
          }
        }
      }
      //  sp_fecha_firma_aut_vuelta
      if (this.editedItem.sp_fecha_firma_aut_vuelta.length > 0) {
        if (this.esRangoFfav) {
          //Rango de Fechas
          if (
            this.editedItem.sp_fecha_firma_aut_vuelta[0] >
            this.editedItem.sp_fecha_firma_aut_vuelta[1]
          ) {
            filtroFecha =
              "s.sp_fecha_firma_aut_vuelta >= '" +
              this.editedItem.sp_fecha_firma_aut_vuelta[1] +
              "' and s.sp_fecha_firma_aut_vuelta <= '" +
              this.editedItem.sp_fecha_firma_aut_vuelta[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_firma_aut_vuelta >= '" +
              this.editedItem.sp_fecha_firma_aut_vuelta[0] +
              "' and s.sp_fecha_firma_aut_vuelta <= '" +
              this.editedItem.sp_fecha_firma_aut_vuelta[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_firma_aut_vuelta) {
            if (this.editedItem.sp_fecha_firma_aut_vuelta[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_firma_aut_vuelta,date) = '" +
                this.editedItem.sp_fecha_firma_aut_vuelta[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_user_firma_aut_vuelta
      if (this.editedItem.sp_user_firma_aut_vuelta.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_firma_aut_vuelta) {
          if (this.editedItem.sp_user_firma_aut_vuelta[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_firma_aut_vuelta[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_firma_aut_vuelta in (' + valores + ')'
          } else {
            filtro = 's.sp_user_firma_aut_vuelta in (' + valores + ')'
          }
        }
      }
      //  sp_id_gpo_firma_aut_vuelta_gxc
      if (this.editedItem.sp_id_gpo_firma_aut_vuelta_gxc.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_id_gpo_firma_aut_vuelta_gxc) {
          if (
            this.editedItem.sp_id_gpo_firma_aut_vuelta_gxc[i].sp_id_gpo_firma_aut_vuelta_gxc != ''
          ) {
            valores =
              valores +
              this.editedItem.sp_id_gpo_firma_aut_vuelta_gxc[i].sp_id_gpo_firma_aut_vuelta_gxc +
              ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_id_gpo_firma_aut_vuelta_gxc in (' + valores + ')'
          } else {
            filtro = 's.sp_id_gpo_firma_aut_vuelta_gxc in (' + valores + ')'
          }
        }
      }
      //  sp_fecha_conta_gasxcomp
      if (this.editedItem.sp_fecha_conta_gasxcomp != undefined) {
        if (this.editedItem.sp_fecha_conta_gasxcomp.length > 0) {
          if (this.esRangoFcgxc) {
            //Rango de Fechas
            if (
              this.editedItem.sp_fecha_conta_gasxcomp[0] >
              this.editedItem.sp_fecha_conta_gasxcomp[1]
            ) {
              filtroFecha =
                "s.sp_fecha_conta_gasxcomp >= '" +
                this.editedItem.sp_fecha_conta_gasxcomp[1] +
                "' and s.sp_fecha_conta_gasxcomp <= '" +
                this.editedItem.sp_fecha_conta_gasxcomp[0] +
                "'"
            } else {
              filtroFecha =
                "s.sp_fecha_conta_gasxcomp >= '" +
                this.editedItem.sp_fecha_conta_gasxcomp[0] +
                "' and s.sp_fecha_conta_gasxcomp <= '" +
                this.editedItem.sp_fecha_conta_gasxcomp[1] +
                "'"
            }
          } else {
            //Fechas indviuales
            filtroFecha = ''
            for (i in this.editedItem.sp_fecha_conta_gasxcomp) {
              if (this.editedItem.sp_fecha_conta_gasxcomp[i] != '') {
                filtroFecha =
                  filtroFecha +
                  "CONVERT(s.sp_fecha_conta_gasxcomp,date) = '" +
                  this.editedItem.sp_fecha_conta_gasxcomp[i] +
                  "' or "
              }
            }
            //quitar el ultimo or
            filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
          }
          if (filtro != '') {
            if (filtroFecha != '') {
              filtro = filtro + ' AND ' + filtroFecha
            }
          } else {
            filtro = filtroFecha
          }
        }
      }
      //  sp_user_conta_gasxcomp
      if (this.editedItem.sp_user_conta_gasxcomp.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_conta_gasxcomp) {
          if (this.editedItem.sp_user_conta_gasxcomp[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_conta_gasxcomp[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_conta_gasxcomp in (' + valores + ')'
          } else {
            filtro = 's.sp_user_conta_gasxcomp in (' + valores + ')'
          }
        }
      }

      //   PAGOS TESORERIA
      //  sp_fecha_autoriza_vuelta
      if (this.editedItem.sp_fecha_autoriza_vuelta.length > 0) {
        if (this.esRangoFauv) {
          //Rango de Fechas
          if (
            this.editedItem.sp_fecha_autoriza_vuelta[0] >
            this.editedItem.sp_fecha_autoriza_vuelta[1]
          ) {
            filtroFecha =
              "s.sp_fecha_autoriza_vuelta >= '" +
              this.editedItem.sp_fecha_autoriza_vuelta[1] +
              "' and s.sp_fecha_autoriza_vuelta <= '" +
              this.editedItem.sp_fecha_autoriza_vuelta[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_autoriza_vuelta >= '" +
              this.editedItem.sp_fecha_autoriza_vuelta[0] +
              "' and s.sp_fecha_autoriza_vuelta <= '" +
              this.editedItem.sp_fecha_autoriza_vuelta[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_autoriza_vuelta) {
            if (this.editedItem.sp_fecha_autoriza_vuelta[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_autoriza_vuelta,date) = '" +
                this.editedItem.sp_fecha_autoriza_vuelta[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_user_autoriza_vuelta
      if (this.editedItem.sp_user_autoriza_vuelta.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_autoriza_vuelta) {
          if (this.editedItem.sp_user_autoriza_vuelta[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_autoriza_vuelta[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_autoriza_vuelta in (' + valores + ')'
          } else {
            filtro = 's.sp_user_autoriza_vuelta in (' + valores + ')'
          }
        }
      }
      //  sp_tipo_pago
      if (this.editedItem.sp_tipo_pago.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_tipo_pago) {
          if (this.editedItem.sp_tipo_pago[i].tipo_id != '') {
            valores = valores + this.editedItem.sp_tipo_pago[i].tipo_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_tipo_pago in (' + valores + ')'
          } else {
            filtro = 's.sp_tipo_pago in (' + valores + ')'
          }
        }
      }
      //  sp_banco_pago
      if (this.editedItem.sp_banco_pago.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_banco_pago) {
          if (this.editedItem.sp_banco_pago[i].tipo_id != '') {
            valores = valores + this.editedItem.sp_banco_pago[i].tipo_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_banco_pago in (' + valores + ')'
          } else {
            filtro = 's.sp_banco_pago in (' + valores + ')'
          }
        }
      }
      //  sp_no_cuenta_pago
      if (this.editedItem.sp_no_cuenta_pago.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_no_cuenta_pago) {
          if (this.editedItem.sp_no_cuenta_pago[i].tipo_id != '') {
            valores = valores + this.editedItem.sp_no_cuenta_pago[i].tipo_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_no_cuenta_pago in (' + valores + ')'
          } else {
            filtro = 's.sp_no_cuenta_pago in (' + valores + ')'
          }
        }
      }
      //  sp_no_folio_pago
      if (this.editedItem.sp_no_folio_pago.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_no_folio_pago) {
          if (this.editedItem.sp_no_folio_pago[i].sp_no_folio_pago != '') {
            valores = valores + this.editedItem.sp_no_folio_pago[i].sp_no_folio_pago + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_no_folio_pago in (' + valores + ')'
          } else {
            filtro = 's.sp_no_folio_pago in (' + valores + ')'
          }
        }
      }
      //  sp_fecha_pago_cap
      if (this.editedItem.sp_fecha_pago_cap.length > 0) {
        if (this.esRangoFpagcap) {
          //Rango de Fechas
          if (this.editedItem.sp_fecha_pago_cap[0] > this.editedItem.sp_fecha_pago_cap[1]) {
            filtroFecha =
              "s.sp_fecha_pago_cap >= '" +
              this.editedItem.sp_fecha_pago_cap[1] +
              "' and s.sp_fecha_pago_cap <= '" +
              this.editedItem.sp_fecha_pago_cap[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_pago_cap >= '" +
              this.editedItem.sp_fecha_pago_cap[0] +
              "' and s.sp_fecha_pago_cap <= '" +
              this.editedItem.sp_fecha_pago_cap[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_pago_cap) {
            if (this.editedItem.sp_fecha_pago_cap[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_pago_cap,date) = '" +
                this.editedItem.sp_fecha_pago_cap[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_fecha_pago
      if (this.editedItem.sp_fecha_pago.length > 0) {
        if (this.esRangoFpag) {
          //Rango de Fechas
          if (this.editedItem.sp_fecha_pago[0] > this.editedItem.sp_fecha_pago[1]) {
            filtroFecha =
              "s.sp_fecha_pago >= '" +
              this.editedItem.sp_fecha_pago[1] +
              "' and s.sp_fecha_pago <= '" +
              this.editedItem.sp_fecha_pago[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_pago >= '" +
              this.editedItem.sp_fecha_pago[0] +
              "' and s.sp_fecha_pago <= '" +
              this.editedItem.sp_fecha_pago[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_pago) {
            if (this.editedItem.sp_fecha_pago[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_pago,date) = '" +
                this.editedItem.sp_fecha_pago[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_user_pago
      if (this.editedItem.sp_user_pago.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_pago) {
          if (this.editedItem.sp_user_pago[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_pago[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_pago in (' + valores + ')'
          } else {
            filtro = 's.sp_user_pago in (' + valores + ')'
          }
        }
      }
      //  sp_no_poliza_pago
      if (this.editedItem.sp_no_poliza_pago.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_no_poliza_pago) {
          if (this.editedItem.sp_no_poliza_pago[i].sp_no_poliza_pago != '') {
            valores = valores + this.editedItem.sp_no_poliza_pago[i].sp_no_poliza_pago + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_no_poliza_pago in (' + valores + ')'
          } else {
            filtro = 's.sp_no_poliza_pago in (' + valores + ')'
          }
        }
      }

      //  EJERCIDOS
      //  sp_folio_ejercido
      if (this.editedItem.sp_folio_ejercido.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_folio_ejercido) {
          if (this.editedItem.sp_folio_ejercido[i].sp_folio_ejercido != '') {
            valores = valores + this.editedItem.sp_folio_ejercido[i].sp_folio_ejercido + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_folio_ejercido in (' + valores + ')'
          } else {
            filtro = 's.sp_folio_ejercido in (' + valores + ')'
          }
        }
      }
      //  sp_poliza_ejercido
      if (this.editedItem.sp_poliza_ejercido.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_poliza_ejercido) {
          if (this.editedItem.sp_poliza_ejercido[i].sp_poliza_ejercido != '') {
            valores = valores + this.editedItem.sp_poliza_ejercido[i].sp_poliza_ejercido + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_poliza_ejercido in (' + valores + ')'
          } else {
            filtro = 's.sp_poliza_ejercido in (' + valores + ')'
          }
        }
      }
      //  sp_user_ejercido
      if (this.editedItem.sp_user_ejercido.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_ejercido) {
          if (this.editedItem.sp_user_ejercido[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_ejercido[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_ejercido in (' + valores + ')'
          } else {
            filtro = 's.sp_user_ejercido in (' + valores + ')'
          }
        }
      }
      //  sp_fecha_ejercido_cap
      if (this.editedItem.sp_fecha_ejercido_cap.length > 0) {
        if (this.esRangoFejecap) {
          //Rango de Fechas
          if (this.editedItem.sp_fecha_ejercido_cap[0] > this.editedItem.sp_fecha_ejercido_cap[1]) {
            filtroFecha =
              "s.sp_fecha_ejercido_cap >= '" +
              this.editedItem.sp_fecha_ejercido_cap[1] +
              "' and s.sp_fecha_ejercido_cap <= '" +
              this.editedItem.sp_fecha_ejercido_cap[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_ejercido_cap >= '" +
              this.editedItem.sp_fecha_ejercido_cap[0] +
              "' and s.sp_fecha_ejercido_cap <= '" +
              this.editedItem.sp_fecha_ejercido_cap[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_ejercido_cap) {
            if (this.editedItem.sp_fecha_ejercido_cap[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_ejercido_cap,date) = '" +
                this.editedItem.sp_fecha_ejercido_cap[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_fecha_ejercido
      if (this.editedItem.sp_fecha_ejercido.length > 0) {
        if (this.esRangoFeje) {
          //Rango de Fechas
          if (this.editedItem.sp_fecha_ejercido[0] > this.editedItem.sp_fecha_ejercido[1]) {
            filtroFecha =
              "s.sp_fecha_ejercido >= '" +
              this.editedItem.sp_fecha_ejercido[1] +
              "' and s.sp_fecha_ejercido <= '" +
              this.editedItem.sp_fecha_ejercido[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_ejercido >= '" +
              this.editedItem.sp_fecha_ejercido[0] +
              "' and s.sp_fecha_ejercido <= '" +
              this.editedItem.sp_fecha_ejercido[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_ejercido) {
            if (this.editedItem.sp_fecha_ejercido[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_ejercido,date) = '" +
                this.editedItem.sp_fecha_ejercido[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_id_gpo_ejercido
      if (this.editedItem.sp_id_gpo_ejercido.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_id_gpo_ejercido) {
          if (this.editedItem.sp_id_gpo_ejercido[i].sp_id_gpo_ejercido != '') {
            valores = valores + this.editedItem.sp_id_gpo_ejercido[i].sp_id_gpo_ejercido + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_id_gpo_ejercido in (' + valores + ')'
          } else {
            filtro = 's.sp_id_gpo_ejercido in (' + valores + ')'
          }
        }
      }
      //  sp_fecha_envia_ejercido
      if (this.editedItem.sp_fecha_envia_ejercido.length > 0) {
        if (this.esRangoFenveje) {
          //Rango de Fechas
          if (
            this.editedItem.sp_fecha_envia_ejercido[0] > this.editedItem.sp_fecha_envia_ejercido[1]
          ) {
            filtroFecha =
              "s.sp_fecha_envia_ejercido >= '" +
              this.editedItem.sp_fecha_envia_ejercido[1] +
              "' and s.sp_fecha_envia_ejercido <= '" +
              this.editedItem.sp_fecha_envia_ejercido[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_envia_ejercido >= '" +
              this.editedItem.sp_fecha_envia_ejercido[0] +
              "' and s.sp_fecha_envia_ejercido <= '" +
              this.editedItem.sp_fecha_envia_ejercido[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_envia_ejercido) {
            if (this.editedItem.sp_fecha_envia_ejercido[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_envia_ejercido,date) = '" +
                this.editedItem.sp_fecha_envia_ejercido[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_user_envia_ejercido
      if (this.editedItem.sp_user_envia_ejercido.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_envia_ejercido) {
          if (this.editedItem.sp_user_envia_ejercido[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_envia_ejercido[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_envia_ejercido in (' + valores + ')'
          } else {
            filtro = 's.sp_user_envia_ejercido in (' + valores + ')'
          }
        }
      }

      //  ENVIOS A CONTABILIDAD
      //  sp_id_gpo_gxc_ent_conta
      if (this.editedItem.sp_id_gpo_gxc_ent_conta.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_id_gpo_gxc_ent_conta) {
          if (this.editedItem.sp_id_gpo_gxc_ent_conta[i].sp_id_gpo_gxc_ent_conta != '') {
            valores =
              valores + this.editedItem.sp_id_gpo_gxc_ent_conta[i].sp_id_gpo_gxc_ent_conta + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_id_gpo_gxc_ent_conta in (' + valores + ')'
          } else {
            filtro = 's.sp_id_gpo_gxc_ent_conta in (' + valores + ')'
          }
        }
      }
      //  sp_fecha_gxc_ent_conta
      if (this.editedItem.sp_fecha_gxc_ent_conta.length > 0) {
        if (this.esRangoFgxcec) {
          //Rango de Fechas
          if (
            this.editedItem.sp_fecha_gxc_ent_conta[0] > this.editedItem.sp_fecha_gxc_ent_conta[1]
          ) {
            filtroFecha =
              "s.sp_fecha_gxc_ent_conta >= '" +
              this.editedItem.sp_fecha_gxc_ent_conta[1] +
              "' and s.sp_fecha_gxc_ent_conta <= '" +
              this.editedItem.sp_fecha_gxc_ent_conta[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_gxc_ent_conta >= '" +
              this.editedItem.sp_fecha_gxc_ent_conta[0] +
              "' and s.sp_fecha_gxc_ent_conta <= '" +
              this.editedItem.sp_fecha_gxc_ent_conta[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_gxc_ent_conta) {
            if (this.editedItem.sp_fecha_gxc_ent_conta[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_gxc_ent_conta,date) = '" +
                this.editedItem.sp_fecha_gxc_ent_conta[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_user_gxc_ent_conta
      if (this.editedItem.sp_user_gxc_ent_conta.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_gxc_ent_conta) {
          if (this.editedItem.sp_user_gxc_ent_conta[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_gxc_ent_conta[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_gxc_ent_conta in (' + valores + ')'
          } else {
            filtro = 's.sp_user_gxc_ent_conta in (' + valores + ')'
          }
        }
      }
      //  sp_id_gpo_envio_cont_np
      if (this.editedItem.sp_id_gpo_envio_cont_np.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_id_gpo_envio_cont_np) {
          if (this.editedItem.sp_id_gpo_envio_cont_np[i].sp_id_gpo_envio_cont_np != '') {
            valores =
              valores + this.editedItem.sp_id_gpo_envio_cont_np[i].sp_id_gpo_envio_cont_np + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_id_gpo_envio_cont_np in (' + valores + ')'
          } else {
            filtro = 's.sp_id_gpo_envio_cont_np in (' + valores + ')'
          }
        }
      }
      //  sp_fecha_envio_cont_np
      if (this.editedItem.sp_fecha_envio_cont_np.length > 0) {
        if (this.esRangoFenvconp) {
          //Rango de Fechas
          if (
            this.editedItem.sp_fecha_envio_cont_np[0] > this.editedItem.sp_fecha_envio_cont_np[1]
          ) {
            filtroFecha =
              "s.sp_fecha_envio_cont_np >= '" +
              this.editedItem.sp_fecha_envio_cont_np[1] +
              "' and s.sp_fecha_envio_cont_np <= '" +
              this.editedItem.sp_fecha_envio_cont_np[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_envio_cont_np >= '" +
              this.editedItem.sp_fecha_envio_cont_np[0] +
              "' and s.sp_fecha_envio_cont_np <= '" +
              this.editedItem.sp_fecha_envio_cont_np[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_envio_cont_np) {
            if (this.editedItem.sp_fecha_envio_cont_np[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_envio_cont_np,date) = '" +
                this.editedItem.sp_fecha_envio_cont_np[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_user_envio_cont_np
      if (this.editedItem.sp_user_envio_cont_np.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_envio_cont_np) {
          if (this.editedItem.sp_user_envio_cont_np[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_envio_cont_np[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_envio_cont_np in (' + valores + ')'
          } else {
            filtro = 's.sp_user_envio_cont_np in (' + valores + ')'
          }
        }
      }
      //  sp_folios_comprometido
      if (this.editedItem.sp_folios_comprometido.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_folios_comprometido) {
          if (this.editedItem.sp_folios_comprometido[i].folio_num != '') {
            valores = valores + this.editedItem.sp_folios_comprometido[i].folio_num + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + " AND obtenerfolios(s.sp_id,'C') in (" + valores + ')'
          } else {
            filtro = "obtenerfolios(s.sp_id,'C') in (" + valores + ')'
          }
        }
      }
      //  sp_folios_devengado
      if (this.editedItem.sp_folios_devengado.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_folios_devengado) {
          if (this.editedItem.sp_folios_devengado[i].folio_num != '') {
            valores = valores + this.editedItem.sp_folios_devengado[i].folio_num + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + " AND obtenerfolios(s.sp_id,'D') in (" + valores + ')'
          } else {
            filtro = "obtenerfolios(s.sp_id,'D') in (" + valores + ')'
          }
        }
      }
      //  sp_fecha_folios
      if (this.editedItem.sp_fecha_folios.length > 0) {
        if (this.esRangoFfolios) {
          //Rango de Fechas
          if (this.editedItem.sp_fecha_folios[0] > this.editedItem.sp_fecha_folios[1]) {
            filtroFecha =
              "s.sp_fecha_folios >= '" +
              this.editedItem.sp_fecha_folios[1] +
              "' and s.sp_fecha_folios <= '" +
              this.editedItem.sp_fecha_folios[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_folios >= '" +
              this.editedItem.sp_fecha_folios[0] +
              "' and s.sp_fecha_folios <= '" +
              this.editedItem.sp_fecha_folios[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_folios) {
            if (this.editedItem.sp_fecha_folios[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_folios,date) = '" +
                this.editedItem.sp_fecha_folios[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_user_folios
      if (this.editedItem.sp_user_folios.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_folios) {
          if (this.editedItem.sp_user_folios[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_folios[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_folios in (' + valores + ')'
          } else {
            filtro = 's.sp_user_folios in (' + valores + ')'
          }
        }
      }
      //  sp_id_gpo_folios
      if (this.editedItem.sp_id_gpo_folios.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_id_gpo_folios) {
          if (this.editedItem.sp_id_gpo_folios[i].sp_id_gpo_folios != '') {
            valores = valores + this.editedItem.sp_id_gpo_folios[i].sp_id_gpo_folios + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_id_gpo_folios in (' + valores + ')'
          } else {
            filtro = 's.sp_id_gpo_folios in (' + valores + ')'
          }
        }
      }
      //  sp_fecha_gpo_folios
      if (this.editedItem.sp_fecha_gpo_folios.length > 0) {
        if (this.esRangoFgpofolios) {
          //Rango de Fechas
          if (this.editedItem.sp_fecha_gpo_folios[0] > this.editedItem.sp_fecha_gpo_folios[1]) {
            filtroFecha =
              "s.sp_fecha_gpo_folios >= '" +
              this.editedItem.sp_fecha_gpo_folios[1] +
              "' and s.sp_fecha_gpo_folios <= '" +
              this.editedItem.sp_fecha_gpo_folios[0] +
              "'"
          } else {
            filtroFecha =
              "s.sp_fecha_gpo_folios >= '" +
              this.editedItem.sp_fecha_gpo_folios[0] +
              "' and s.sp_fecha_gpo_folios <= '" +
              this.editedItem.sp_fecha_gpo_folios[1] +
              "'"
          }
        } else {
          //Fechas indviuales
          filtroFecha = ''
          for (i in this.editedItem.sp_fecha_gpo_folios) {
            if (this.editedItem.sp_fecha_gpo_folios[i] != '') {
              filtroFecha =
                filtroFecha +
                "CONVERT(s.sp_fecha_gpo_folios,date) = '" +
                this.editedItem.sp_fecha_gpo_folios[i] +
                "' or "
            }
          }
          //quitar el ultimo or
          filtroFecha = filtroFecha.substring(0, filtroFecha.length - 3)
        }
        if (filtro != '') {
          if (filtroFecha != '') {
            filtro = filtro + ' AND ' + filtroFecha
          }
        } else {
          filtro = filtroFecha
        }
      }
      //  sp_user_gpo_folios
      if (this.editedItem.sp_user_gpo_folios.length > 0) {
        valores = ''
        for (i in this.editedItem.sp_user_gpo_folios) {
          if (this.editedItem.sp_user_gpo_folios[i].usr_id != '') {
            valores = valores + this.editedItem.sp_user_gpo_folios[i].usr_id + ','
          }
        }
        if (valores != '') {
          valores = valores.substring(0, valores.length - 1)
          if (filtro != '') {
            filtro = filtro + ' AND s.sp_user_gpo_folios in (' + valores + ')'
          } else {
            filtro = 's.sp_user_gpo_folios in (' + valores + ')'
          }
        }
      }

      //ENVIAR CONSULTA
      //console.log('filtro ->')
      //console.log(filtro)

      await this.obtenerSolPagos(jwt, filtro)

      //this.dialog = false
    },
    // Funcion para utilizar formatos de tools
    formato(opcion, valor) {
      if (opcion == this.eFormatos.IMPORTE) {
        return tools.formatoImporte(valor)
      } else if (opcion == this.eFormatos.MONEDA) {
        return tools.formatoMoneda(valor)
      } else if (opcion == this.eFormatos.FECHA) {
        return tools.convierteNumeroFechaVista(valor)
      }
    },
    //Mapear y Formatear objeto a Exportar para fechas, importes, cadenas largas, etc
    formateoInfoExportar() {
      if (this.resultado.length > 0) {
        for (var i in this.resultado) {
          this.resultado[i].sp_importe = this.formato(
            this.eFormatos.MONEDA,
            this.resultado[i].sp_importe
          )

          this.resultado[i].sp_fecha_solicitud = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_solicitud
          )
          this.resultado[i].cuecon_cuenta = "'" + this.resultado[i].cuecon_cuenta + "'"

          this.resultado[i].sp_fecha_elabora = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_elabora
          )

          this.resultado[i].sp_fecha_factura = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_factura
          )

          this.resultado[i].sp_fecha_factura_prob_pago = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_factura_prob_pago
          )
          this.resultado[i].sp_fecha_firma_sol_ida = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_firma_sol_ida
          )
          this.resultado[i].sp_fecha_firma_sol_vuelta = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_firma_sol_vuelta
          )
          this.resultado[i].sp_fecha_firma_aut_ida = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_firma_aut_ida
          )

          //

          this.resultado[i].sp_fecha_firma_aut_vuelta = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_firma_aut_vuelta
          )

          this.resultado[i].sp_fecha_conta_gasxcomp = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_conta_gasxcomp
          )

          this.resultado[i].sp_fecha_autoriza_vuelta = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_autoriza_vuelta
          )
          this.resultado[i].sp_fecha_pago_cap = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_pago_cap
          )
          this.resultado[i].sp_fecha_pago = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_pago
          )

          this.resultado[i].sp_fecha_ejercido_cap = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_ejercido_cap
          )
          this.resultado[i].sp_fecha_ejercido = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_ejercido
          )
          this.resultado[i].sp_fecha_envia_ejercido = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_envia_ejercido
          )

          this.resultado[i].sp_fecha_gxc_ent_conta = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_gxc_ent_conta
          )
          this.resultado[i].sp_fecha_envio_cont_np = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_envio_cont_np
          )
          this.resultado[i].sp_fecha_folios = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_folios
          )
          this.resultado[i].sp_fecha_gpo_folios = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].sp_fecha_gpo_folios
          )
          this.resultado[i].Fecha_Vuelta_Firma_Autoriza = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].Fecha_Vuelta_Firma_Autoriza
          )
          this.resultado[i].Fecha_Vuelta_Firma_Autoriza_Gxc = this.formato(
            this.eFormatos.FECHA,
            this.resultado[i].Fecha_Vuelta_Firma_Autoriza_Gxc
          )
        }
      }
    },
    //Refresca Datos para la tabla
    async iniciando() {
      this.setfilterCamposIni()

      this.refreshGenerales()
    },
    //Obtiene todos los Bancos capturados
    async obtenerBancos(jwt) {
      this.isLoading = true
      let params = null

      params = 't.tipo_id in (select distinct sp_banco_pago from solicitud_pagos)/tipo_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.bancos = []
        await this.$store
          .dispatch('consulta/fetchGetTipos', payload)
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
    //Obtiene Todos las conceptos para la consulta
    async obtenerConceptos(jwt, filtro) {
      //this.isLoading = true
      let params = null
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
            //this.isLoading = false
          })
          .catch((err) => {
            //this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
            })
          })
      }
    },
    //Obtiene Todas las Cuentas
    async obtenerCuentas(jwt) {
      if (jwt != null) {
        let params = null

        params =
          'c.cuecon_cuenta in (select distinct cuecon_cuenta from solicitud_pagos)/c.cuecon_cuenta'

        let payload = { jwt: jwt, params: params }
        this.cuentas = []
        await this.$store
          .dispatch('consulta/fetchGetCuentas', payload)
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
      }
      /* let params = null
      let opcion = 0
      if (prov == 0 && tipo == 0) {
        opcion = 1
        params = 'filtro?campo1=cuecon_activo&tipo1=igual&valor1=1'
      } else if (prov == 0) {
        opcion = 1
        params = 'filtro?campo1=c.tipo_id&tipo1=igual&valor1=' + tipo
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
            })
            .catch((err) => {
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
            })
            .catch((err) => {
              this.$store.commit('ALERT', {
                color: 'error',
                text: err.response.data.error,
              })
            })
        }
      } */
    },
    //Obtiene todos los usuarios envio firma de solicitante
    async obtenerCuentasPago(jwt) {
      //this.isLoading = true
      let params = null

      params = 't.tipo_id in (select distinct sp_no_cuenta_pago from solicitud_pagos)/tipo_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.cuentasPago = []
        await this.$store
          .dispatch('consulta/fetchGetTipos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.cuentasPago = response.data
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
    //Obtiene todos las direcciones solicitantes capturados
    async obtenerDireccionSolicita(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_direccion_sol/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.direccionSolicita = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.direccionSolicita = response.data
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
    //Obtiene todos los numeros de oficios capturados
    async obtenerEmpleadoSolicita(jwt) {
      //this.isLoading = true
      let params = null

      params = 'emp_id in (select distinct sp_emp_id_sol from solicitud_pagos)/emp_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.empleadosSolicita = []
        await this.$store
          .dispatch('consulta/fetchGetEmpleados', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.empleadosSolicita = response.data
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
    //Obtiene Todos los Estaus capturados
    async obtenerEstatus(jwt) {
      this.isLoading = true
      let params = null

      params = 't.tipo_clave in (select distinct sp_estatus from solicitud_pagos)/tipo_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.estatus = []
        await this.$store
          .dispatch('consulta/fetchGetTipos', payload)
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
    //Obtiene todos las facturas capturados
    async obtenerFacturas(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_no_factura/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.facturas = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.facturas = response.data
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
    //Obtiene todos los folios de comprobacion capturados
    async obtenerFolios(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_id/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.folios = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.folios = response.data
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
    //Obtiene todos los folios de comprobacion capturados
    async obtenerFoliosComprobacion(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_folio_comprobacion/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.foliosComprobacion = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.foliosComprobacion = response.data
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
    //Obtiene todos los folios comprometidos
    async obtenerFoliosComprometidos(jwt) {
      //this.isLoading = true
      let params = null

      params = 'folios/folio_num/and folio_iscomprometido = 1/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.foliosComprometidos = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.foliosComprometidos = response.data
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
    //Obtiene todos los folios Devengados
    async obtenerFoliosDevengados(jwt) {
      //this.isLoading = true
      let params = null

      params = 'folios/folio_num/and folio_isdevengado = 1/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.foliosDevengados = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.foliosDevengados = response.data
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
    //Obtiene todos los folios de Ejercido capturados
    async obtenerFolioEjercido(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_folio_ejercido/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.foliosEjercidos = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.foliosEjercidos = response.data
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
    //Obtiene todas las polizas de pago capturadas
    async obtenerFolioPago(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_no_folio_pago/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.foliospago = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.foliospago = response.data
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
    //Obtiene todos los tipos de fuentes de financiamientos
    async ObtenerFuenteFin(jwt) {
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
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
            })
          })
      }
    },
    //Obtiene todos los grupos de envia forma de solicitante
    async obtenerGrupoEnviaFirmaSolicitante(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_id_gpo_firma_sol/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoEnvFirSol = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoEnvFirSol = response.data
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
    //Obtiene todos los grupos de envia NP a contabilidad
    async obtenerGrupoEnvContNP(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_id_gpo_envio_cont_np/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoEnvContNP = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoEnvContNP = response.data
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
    //Obtiene todos los grupos de envia forma de solicitante
    async obtenerGrupoEjercidos(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_id_gpo_ejercido/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoEjercido = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoEjercido = response.data
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
    //Obtiene todos los grupos de envia firma de solicitante
    async obtenerGrupoEnviaFirmaAutoriza(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_id_gpo_firma_aut_ida/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoEnvFirAut = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoEnvFirAut = response.data
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
    //Obtiene todos los grupos de envia Recibe Pagos
    async obtenerGrupoEnviaFirmaAutorizaVuelta(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_id_gpo_firma_aut_vuelta/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoEnvFirAutVta = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoEnvFirAutVta = response.data
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
    //Obtiene todos los grupos de envia Recibe Pagos
    async obtenerGrupoEnviaFirmaAutorizaVueltaGxc(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_id_gpo_firma_aut_vuelta_gxc/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoEnvFirAutVtaGxc = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoEnvFirAutVtaGxc = response.data
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
    //Obtiene todos los grupos de envia forma de solicitante
    async obtenerGrupoFirmaAutorizaVuelta(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_id_gpo_firma_aut_vuelta/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoEnvFirmaAutorizaVuelta = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoEnvFirmaAutorizaVuelta = response.data
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
    //Obtiene todos los grupos Entrega GXC a Contabilidad
    async obtenerGrupoGxcEntConta(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_id_gpo_gxc_ent_conta/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoGxcEnvConta = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoGxcEnvConta = response.data
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
    //Obtiene todos los grupos Envia Folios
    async obtenerGrupoEnviaFolios(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_id_gpo_folios/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.gpoGxcEnvFolios = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.gpoGxcEnvFolios = response.data
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
    //Obtiene todos los numeros de oficios capturados
    async obtenerNumerosOficios(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_num_oficio/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.numsOficios = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.numsOficios = response.data
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
    //Obtiene todas las polizas de pago capturadas
    async obtenerPolizasEjercido(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_poliza_ejercido/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.polizasEjercidos = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.polizasEjercidos = response.data
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
    //Obtiene todas las polizas de pago capturadas
    async obtenerPolizasPago(jwt) {
      //this.isLoading = true
      let params = null

      params = 'solicitud_pagos/sp_no_poliza_pago/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.polizaspago = []
        await this.$store
          .dispatch('consulta/fetchGetDistinct', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.polizaspago = response.data
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
    //Obtener listado de proveedores
    async obtenerProveedores(jwt) {
      if (jwt != null) {
        let params = null

        params = 'p.prov_id in (select distinct prov_id from solicitud_pagos)/p.prov_razon_social'

        let payload = { jwt: jwt, params: params }
        this.proveedores = []
        await this.$store
          .dispatch('consulta/fetchGetProveedor', payload)
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
    },
    //Obtiene todos los tipos de solicitudes para la consulta
    async obtenerTipos(jwt) {
      //this.isLoading = true
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

            //this.isLoading = false
          })
          .catch((err) => {
            //this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
            })
          })
      }
    },
    //Obtiene todos los tipos de Pago para la consulta
    async obtenerTiposPago(jwt) {
      this.isLoading = true
      let params = null

      params = 't.tipo_id in (select distinct sp_tipo_pago from solicitud_pagos)/tipo_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.tipospago = []
        await this.$store
          .dispatch('consulta/fetchGetTipos', payload)
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
    //Obtiene todos los numeros de oficios capturados
    async obtenerUsuariosEnviaPagos(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_firma_aut_vuelta from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosEnviaPagos = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosEnviaPagos = response.data
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
    //Obtiene todos los numeros de oficios capturados
    async obtenerUsuariosAutorizaVuelta(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_autoriza_vuelta from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosAutorizaVuelta = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosAutorizaVuelta = response.data
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
    //Obtiene todos los numeros de oficios capturados
    async obtenerUsuariosElabora(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_elabora from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosElabora = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosElabora = response.data
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
    //Obtiene todos los numeros de oficios capturados
    async obtenerUsuariosEjercido(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_ejercido from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosEjercido = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosEjercido = response.data
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
    //Obtiene todos los usuarios envio Ejercido
    async obtenerUsuariosEnviaEjercido(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_envia_ejercido from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosEnvEjercido = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosEnvEjercido = response.data
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
    //Obtiene todos los usuarios envio a contabilidad NP
    async obtenerUsuariosEnvContNP(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_envio_cont_np from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosEnvContNP = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosEnvContNP = response.data
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
    //Obtiene todos los usuarios envio firma de Autoriza
    async obtenerUsuariosEnviaFirmaAutoriza(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_firma_aut_ida from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosEnvSolAutoriza = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosEnvSolAutoriza = response.data
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
    //Obtiene todos los usuarios envio firma de Autoriza
    async obtenerUsuariosEnviaFirmaAutorizaVuelta(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_firma_aut_vuelta from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosEnvSolAutorizaVta = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosEnvSolAutorizaVta = response.data
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
    //Obtiene todos los usuarios envio firma de Autoriza
    async obtenerUsuariosEnviaFirmaAutorizaVueltaGxc(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_conta_gasxcomp from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosEnvSolAutorizaVtaGxc = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosEnvSolAutorizaVtaGxc = response.data
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
    //Obtiene todos los usuarios envio firma de solicitante
    async obtenerUsuariosEnviaFirmaSolicitante(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_firma_sol_ida from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosEnvSolFirma = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosEnvSolFirma = response.data
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
    //Obtiene todos los usuarios que pagaron
    async obtenerUsuariosGxcEnvCont(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_gxc_ent_conta from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosGxcEnvCont = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosGxcEnvCont = response.data
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
    //Obtiene todos los usuarios Folios
    async obtenerUsuariosFolios(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_folios from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosFolios = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosFolios = response.data
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
    //Obtiene todos los usuarios Envia Folios
    async obtenerUsuariosEnviaFolios(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_gpo_folios from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosEnvFolios = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosEnvFolios = response.data
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
    //Obtiene todos los usuarios que pagaron
    async obtenerUsuariosPagos(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_pago from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosPago = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosPago = response.data
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
    //Obtiene todos los usuarios envio firma de solicitante
    async obtenerUsuariosRecibeFirmaSolicitante(jwt) {
      //this.isLoading = true
      let params = null

      params = 'usr_id in (select distinct sp_user_firma_sol_vuelta from solicitud_pagos)/usr_id'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.usuariosRecSolFirma = []
        await this.$store
          .dispatch('consulta/fetchGetUsuarios', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuariosRecSolFirma = response.data
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
    //Refresca los elementos de la pestaña Autoriza
    async refreshAutoriza() {
      let jwt = await getValidToken(this)
      await this.obtenerGrupoEnviaFirmaAutorizaVuelta(jwt)
      await this.obtenerUsuariosEnviaFirmaAutorizaVuelta(jwt)

      await this.obtenerGrupoEnviaFirmaAutorizaVueltaGxc(jwt)
      await this.obtenerUsuariosEnviaFirmaAutorizaVueltaGxc(jwt)
    },
    //Refresca los elementos de la pestaña Envio Contabilidad
    async refreshEnvioConta() {
      let jwt = await getValidToken(this)
      await this.obtenerGrupoGxcEntConta(jwt)
      await this.obtenerUsuariosGxcEnvCont(jwt)

      await this.obtenerGrupoEnvContNP(jwt)
      await this.obtenerUsuariosEnvContNP(jwt)

      await this.obtenerFoliosComprometidos(jwt)
      await this.obtenerFoliosDevengados(jwt)
      await this.obtenerUsuariosFolios(jwt)
      await this.obtenerGrupoEnviaFolios(jwt)
      await this.obtenerUsuariosEnviaFolios(jwt)
    },
    //Refresca los elementos de la pestaña Firmas Presupuesto
    async refreshEjercidos() {
      let jwt = await getValidToken(this)
      await this.obtenerFolioEjercido(jwt)
      await this.obtenerPolizasEjercido(jwt)
      await this.obtenerUsuariosEjercido(jwt)
      await this.obtenerGrupoEjercidos(jwt)
      await this.obtenerUsuariosEnviaEjercido(jwt)
    },
    //Refresca los elementos de la pestaña Generales
    async refreshGenerales() {
      let jwt = await getValidToken(this)
      await this.obtenerEjercicios(jwt)
      await this.obtenerFolios(jwt)
      await this.obtenerEstatus(jwt)
      await this.obtenerConceptos(jwt, '')
      await this.obtenerCuentas(jwt)
      await this.obtenerDireccionSolicita(jwt)
      await this.obtenerEmpleadoSolicita(jwt)
      await this.obtenerFacturas(jwt)
      await this.obtenerFoliosComprobacion(jwt)
      await this.ObtenerFuenteFin(jwt)
      await this.obtenerNumerosOficios(jwt)
      await this.obtenerTipos(jwt)
      await this.obtenerProveedores(jwt)
      await this.obtenerUsuariosElabora(jwt)
      await this.obtenerEjercicios(jwt)
    },
    //Refresca los elementos de la pestaña Firmas Presupuesto
    async refreshPagos() {
      let jwt = await getValidToken(this)
      await this.obtenerUsuariosAutorizaVuelta(jwt)
      await this.obtenerGrupoFirmaAutorizaVuelta(jwt)
      await this.obtenerUsuariosEnviaPagos(jwt)

      await this.obtenerTiposPago(jwt)
      await this.obtenerCuentasPago(jwt)
      await this.obtenerBancos(jwt)
      await this.obtenerUsuariosPagos(jwt)

      await this.obtenerPolizasPago(jwt)
      await this.obtenerFolioPago(jwt)
    },
    //Refresca los elementos de la pestaña Firmas Presupuesto
    async refreshPresupuestos() {
      let jwt = await getValidToken(this)
      await this.obtenerGrupoEnviaFirmaSolicitante(jwt)
      await this.obtenerUsuariosEnviaFirmaSolicitante(jwt)
      await this.obtenerUsuariosRecibeFirmaSolicitante(jwt)

      await this.obtenerGrupoEnviaFirmaAutoriza(jwt)
      await this.obtenerUsuariosEnviaFirmaAutoriza(jwt)
    },
    //Obtiene todos los Solicitudes de Pago para la tabla
    async obtenerSolPagos(jwt, filtro) {
      this.isLoading = true
      let params = filtro
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.resultado = []
        await this.$store
          .dispatch('consulta/fetchgetsolpagos', payload)
          .then((response) => {
            this.resultado = []
            if (response.data.mensaje == undefined) {
              this.resultado = response.data
              this.formateoInfoExportar()
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
    //Arma los campos para la exportacion
    setfilterCampos() {
      if (this.editedItem.fields.length > 0) {
        let fieldsExportarNew = {}
        fieldsExportarNew = this.editedItem.fields.map((item) => {
          return {
            [item.text]: item.campo,
          }
        })
        //CONVIERTE   un arreglo a un objeto reduciendolo sin indices
        //podemos usar la función Object.assign y array.reduce para convertir una matriz a un objeto.
        this.fieldsExportar = fieldsExportarNew.reduce((a, b) => Object.assign(a, b), {})
      }
    },
    setfilterCamposIni() {
      if (this.fieldsAllExportar.length > 0) {
        let fieldsExportarNew = {}
        fieldsExportarNew = this.fieldsAllExportar.map((item) => {
          return {
            [item.text]: item.campo,
          }
        })
        //CONVIERTE   un arreglo a un objeto reduciendolo sin indices
        //podemos usar la función Object.assign y array.reduce para convertir una matriz a un objeto.
        this.fieldsExportar = fieldsExportarNew.reduce((a, b) => Object.assign(a, b), {})
      }
    },
    //Para importes
    setfilterOperadores(value) {
      //console.log(value)
      if (this.editedItem.operadores == undefined) {
        this.rango = false
        this.operador = false
        this.editedItem.sp_importe = ''
        this.editedItem.sp_importe2 = ''
      } else {
        if (value.clave == 'RANGE') {
          this.rango = true
          this.operador = true
        } else {
          this.rango = false
          this.operador = true
        }
      }
    },
    async onChangeEjercicio(value) {
      //this.editedItem.sp_vobo_emp_id = 0
      //let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      this.editedItem.sp_ejercicio = value.sp_ejercicio
      //await this.obtenerSolPagos(jwt, 0, value.sp_ejercicio)
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
