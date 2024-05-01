<template>
  <v-container id="data-tables" tag="section">
    <base-material-card icon="mdi-email-arrow-right-outline" color="blue" inline class="px-5 py-3">
      <!---filtros-->
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
              hint="Seleciona ejercicio"
              @change="onChangeEjercicioPrinc"
              return-object
            >
            </v-select>
          </v-col>
        </v-row>
      </template>
      <!---termina filtros-->
      <!---campo de busqueda-->
      <v-text-field
        append-icon="mdi-magnify"
        class="ml-auto"
        hide-details
        label="Búsqueda"
        single-line
        style="max-width: 250px"
        v-model="search"
      />
      <!-- termina campo de busqueda-->
      <v-divider class="mt-4" />
      <br />
      <!-- Tabla de Ordenes-->
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
        <template v-slot:[`item.osTotalFact`]="{ item }">
          {{ formato(eFormatos.MONEDA, item.osTotalFact) }}
        </template>
        <!-- Acciones de la Tabla Principal -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon medium @click="uploadFact(item)">mdi-email</v-icon>
          <!-- <v-icon  medium @click="viewList(item)">mdi-eye</v-icon>-->
        </template>
      </v-data-table>
      <v-dialog v-model="dialogMail" :persistent="true" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
            <v-img src="@/assets/logo_ivey.jpg" width="20%" height="20%"></v-img>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6" class="v-text">
                  <v-text-field
                    v-model="editedItem.usr_nombres"
                    :items="profileUsr"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Enviado por:"
                    item-text="usr_nombres"
                    item-value="usr_nombres"
                    persistent-hint
                    append-outer-icon="mdi-account-arrow-right"
                    dense
                    readonly
                    :disabled="existeOrden"
                    return-object
                    :error-messages="prov_idErrors"
                    @input="setfilterCuentas"
                    @blur="$v.editedItem.prov_id.$touch()"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="6" class="v-text">
                  <v-text-field
                    v-model="editedItem.prov_razon_social"
                    :items="proveedores"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Se envia a proveedor*"
                    item-text="prov_razon_social"
                    item-value="prov_id"
                    persistent-hint
                    append-outer-icon="mdi-account-arrow-left"
                    dense
                    readonly
                    return-object
                    :error-messages="prov_idErrors"
                    @input="setfilterCuentas"
                    @blur="$v.editedItem.prov_id.$touch()"
                    @click:append-outer="editarProveedor"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.usr_correo"
                    :items="profileUsr"
                    type="email"
                    label="Correo de remitente:"
                    item-text="usr_correo"
                    item-value="usr_correo"
                    persistent-hint
                    append-outer-icon="mdi-email-arrow-right"
                    dense
                    readonly
                    :disabled="existeOrden"
                    return-object
                    :error-messages="getCorreoValidationErrors"
                     @input="validateCorreo"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="v-text">
                  <span style="color: #514d4d; font-size: medium">Correos de destinatario: </span>
                </v-col>
                <v-col cols="6" class="v-text">
                  <v-text-field
                    v-model="$v.editedItem.prov_email.$model"
                    label="Primer Correo Electrónico"
                    counter="100"
                    :error-messages="getCorreoValidationMessages"
                    dense
                    type="email"
                    required
                    append-outer-icon="mdi-email-arrow-left"
                    @input="changed = true"
                  ></v-text-field>
                </v-col>
                <!-- Campo Correo Electronico 2-->
                <v-col cols="6" class="v-text">
                  <v-text-field
                    type="email"
                    v-model="$v.editedItem.prov_email2.$model"
                    label="Segundo Correo Electrónico"
                    counter="100"
                    dense
                    append-outer-icon="mdi-email-arrow-left"
                    required
                    :error-messages="getCorreoValidationMessages"
                    @input="changed = true"
                  ></v-text-field>
                </v-col>
                <!--<v-col cols="1" class="v-text">
            	<v-btn color="blue darken-1" small @click="editarProveedor">Editar</v-btn>
            </v-col>-->
              </v-row>
              <v-row>
                <v-col cols="12" class="v-text">
                  <v-text-field
                    v-model="$v.editedItemProv.asunto.$model"
                    label="Asunto de correo"
                    counter="100"
                    max-length="100"
                    dense
                    @input="
                      editedItemProv.asunto = editedItemProv.asunto.toUpperCase()
                      changed = true
                    "
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <span style="color: #514d4d; font-size: medium">Descripción </span>
                  <textarea
                    v-model="$v.editedItemProv.descripcion.$model"
                    dense
                    maxlength="150"
                    style="resize: none; border: groove 1.5px #d2d2d2"
                    rows="2"
                    cols="79"
                    outline
                    label="Descripción"
                    persistent-hint
                    counter="300"
                    @input="
                      editedItemProv.descripcion = editedItemProv.descripcion.toUpperCase()
                      changed = true
                    "
                    @blur="$v.editedItemProv.descripcion.$touch()"
                  ></textarea>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    accept=".pdf"
                    label="Cargar documento"
                    class="mi-clase-personalizada"
                    variant="outlined"
                    clearable
                    outlined
                    required
                    @clear="fileInputValue = null"
                    v-model="fileInputValue"
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-row>
                <v-btn
                  color="success darken-1"
                  outlined
                  :disabled="ValidaCorreo()"
                  text
                  @click="GuardarCorreo"
                  ><v-icon medium>mdi-email-arrow-right </v-icon> Enviar Correo</v-btn
                >
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="close()">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    </base-material-card>
  </v-container>
</template>
<script>
import * as tools from '@/store/modules/tools.store.js'
import { getValidToken } from '@/store/helpers.js'
import EditaProveedor from '@/components/general/EditaProveedor.vue'
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import FormData from 'form-data'

export default {
  components: {
    EditaProveedor,
  },
  data: () => ({
    usuario: JSON.parse(localStorage.getItem('user')),
    eFormatos: tools.formatos,
    isLoading: false,
    ejercicio: 0,
    sp_ejercicio: 0,
    tipo_clave: '',
    dialogMail: false,
    editedIndex: -1,
    dialogEditProv: false,
    changed: false,
    isSure: false,
    isEditing: false,
    fileInputValue: null,
    headers: [
      { text: 'Nº Doc', align: 'start', value: 'osNumDoc', sortable: true },
      { text: 'Tipo de orden', align: 'start', value: 'osTipoDoc', sortable: true },
      { text: 'Fecha', align: 'center', value: 'osFecha', sortable: true },
      { text: 'Solicita', align: 'center', value: 'osEmpSolicitaNombre', sortable: true },
      { text: 'Proveedor', align: 'center', value: 'prov_razon_social', sortable: true },
      { text: 'Descripción', align: 'center', value: 'osDescripcion', sortable: true },
      { text: 'Total', align: 'center', value: 'osTotal', sortable: true },
      //{ text: 'Total Facturado', align: 'center', value: 'osTotalFact', sortable: true },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    ordenes: [],
    ejercicios: [],
    tipos: [],
    tableData: [],
    factura: [],
    profileUsr: [],
    proveedores: [],
    defaultItem: {
      prov_email: '',
      prov_email2: '',
      descripcion: '',
      asunto: '',
    },
    editedItem: {
      prov_email: '',
      prov_email2: '',
      descripcion: '',
      asunto: '',
    },
    editedItemProv: {
      descripcion: '',
      asunto: '',
    },
  }),
  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      prov_email: { required },
      prov_email2: { required },
    },
    editedItemProv: {
      asunto: { required },
      descripcion: { required },
      fileInputValue: { required },
    },
    fileInputValue: { required },
  },
  watch: {
    dialogDet(val) {
      val || this.closeDet()
    },
    async dialogEditProv(val) {
      console.log('Watch', 'dialogEditProv(val)', val)
    },
  },
  async created() {
    this.inicia()
  },
  methods: {
    //FUNCIONES PARA OBTENER
    async inicia() {
      let jwt = await getValidToken(this)
      //await this.obtenerOrdenes(jwt, this.ejercicio)
      this.obtenerProveedores()
      await this.obtenerEjercicios(jwt)
      await this.obtenerTipos(jwt)
      if (this.tipo_clave == undefined || this.tipo_clave == '') {
        this.tipo_clave = this.tipos[2].tipo_clave
      }
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerOrdenes(this.ejercicio)

      this.EjercicioValido()
    },
    //OBTIENE EJERCICIO ACTUAL
    EjercicioValido() {
      //console.log("ejercicio", this.ejercicio)
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      if (this.ejercicio == 0) {
        var currentTime = new Date()
        this.ejercicio = currentTime.getFullYear()
      }
      this.editedItem.sp_ejercicio = this.ejercicio
    },
    async onChangeEjercicioPrinc(value) {
      //let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await this.obtenerOrdenes(value.sp_ejercicio)
    },
    async onChangeTipoPrinc(value) {
      await this.obtenerEjercicios()
      this.tipo_clave = value.tipo_clave
      await this.obtenerOrdenes(value.sp_ejercicio, value.tipo_clave)
    },
    //OBTIENE EJERCICIOS DE LA TABLA DE ORDENES
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
    //Obtiene los Proveedores

    async obtenerProveedores(id) {
      let jwt = await getValidToken(this)
      let params = null
      params = 'filtro?campo1=prov_id&tipo1=igual&valor1=' + id
      if (jwt != null) {
        this.proveedores = []
        let payload = { jwt: jwt, params: params }
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
      }
    },
    async obtenerOrdenes(ejercicio, tipo_clave) {
      let jwt = await getValidToken(this)
      this.isLoading = true
      let params =
        'filtro?campo1=sp_ejercicio&tipo1=igual&valor1=' +
        this.ejercicio +
        '&logico2=and&campo2=osEstatus&tipo2=igual&valor2=PRELIB'
      //'&logico2=and&campo2=osEstatus&tipo2=igual&valor2=PRELIB&logico3=and&campo3=osTipoDoc&tipo3=igual&valor3=COMPRA'
      if (tipo_clave) {
        params += '&logico3=and&campo3=osTipoDoc&tipo3=igual&valor3=' + this.tipo_clave
      }
      if (tipo_clave == 0) {
        params =
          'filtro?campo1=sp_ejercicio&tipo1=igual&valor1=' +
          this.ejercicio +
          '&logico2=and&campo2=osEstatus&tipo2=igual&valor2=PRELIB'
      }
      if (jwt != null) {
        this.ordenes = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('ordencompra/fetchordersAll', payload)
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
    async uploadFact(item) {
      console.log('item', item)
      this.editedIndex = this.ordenes.indexOf(item)
      this.editedItem = Object.assign({}, item)

      // Obtener información de proveedores y asignarla a un objeto 'proveedoresData'
      await this.obtenerProveedores(this.editedItem.prov_id)
      console.log(this.proveedores)

      // Copiar las propiedades de 'proveedoresData' en 'this.editedItem'
      if (this.proveedores) {
        this.editedItem.prov_email = this.proveedores[0].prov_email
        this.editedItem.prov_email2 = this.proveedores[0].prov_email2
        // Agrega más propiedades según sea necesario
      }
      await this.obtenerUsuario()
      if (this.profileUsr) {
        this.editedItem.usr_nombres = this.profileUsr[0].usr_nombres
        this.editedItem.usr_correo = this.profileUsr[0].usr_correo
      }
      this.dialogMail = true
    },
    //FINALIZA FUNCIONES PARA OBTENER

    //funciones para guardar
    async GuardarCorreo() {
      await this.obtenerProveedores(this.editedItem.prov_id)
      if (this.proveedores) {
        this.proveedores[0].prov_email
        this.proveedores[0].prov_email2
      }
      if (this.proveedores[0].prov_email === '' && this.proveedores[0].prov_email2 === '') {
        let jwt = await getValidToken(this)
        let body2 = {
          prov_email: this.editedItem.prov_email,
          prov_email2: this.editedItem.prov_email2,
        }
        let payload2 = { jwt: jwt, body: body2 }
        payload2.id = this.editedItem.prov_id
        try {
          await this.$store.dispatch('proveedor/editCorreo', payload2)
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'Los correos se actualizaron con éxito',
          })
        } catch (err) {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
          this.overlay = false
        }
      }
      let jwt = await getValidToken(this)
      let bodyEnvia = new FormData()

      bodyEnvia.append('usr_correo', this.editedItem.prov_email)
      bodyEnvia.append('usr_correo2', this.editedItem.prov_email2)
      bodyEnvia.append('nombre_remitente', this.editedItem.usr_nombres)
      bodyEnvia.append('remitente_correo', this.editedItem.usr_correo)
      bodyEnvia.append('asunto_correo', this.editedItemProv.asunto)
      bodyEnvia.append('descripcion_correo', this.editedItemProv.descripcion)

      if (this.fileInputValue) {
        bodyEnvia.append('archivo_adjunto', this.fileInputValue)
      }

      let payloadEnvia = { jwt: jwt, body: bodyEnvia }
      try {
        await this.$store.dispatch('proveedor/enviaProveedor', payloadEnvia)
        this.$store.commit('ALERT', {
          color: 'success',
          text: 'Correo enviado con éxito',
        })
      } catch (err) {
        this.$store.commit('ALERT', {
          color: 'error',
          text: err.response.data.msg,
        })
      }
      let bodyEstatus = {
        osEstatus: 'ENVPROV',
      }
      let payloadEstatus = { jwt: jwt, body: bodyEstatus }
      payloadEstatus.id = this.editedItem.osNumDoc
      try {
        await this.$store.dispatch('ordencompra/editEstatus', payloadEstatus)
        this.$store.commit('ALERT', {
          color: 'success',
          text: 'Correo enviado con éxito',
        })
      } catch (err) {
        this.$store.commit('ALERT', {
          color: 'error',
          text: err.response.data.msg,
        })
        this.overlay = false
      }
      var fecha = new Date()
      const os_fecha_envprov = this.formato(this.eFormatos.FECHA_FORMATO, fecha)
      //guarda ACTUALIZA SEGUIMIENTO AL EDITAR
      let bodyEnv = {
        osNumDoc: this.editedItem.osNumDoc,
        osEjercicio: this.editedItem.sp_ejercicio,
        os_fecha_envprov: os_fecha_envprov,
        os_user_envprov: this.usuario.usr_id,
      }
      let payloadEnv = { jwt: jwt, body: bodyEnv }
      await this.$store
        .dispatch('ordencompra/editSeguimiento', payloadEnv)
        .then(() => {
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'Correo enviado con éxito',
          })
          this.overlay = false
        })
        .catch((err) => {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.mensaje,
          })
        })
      this.inicia()
      this.close()
    },

    //finaliza funciones para guardar
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
      console.log("this.editedItem.prov_email",this.editedItem.prov_email)*/
      if (this.editedItem.prov_id != undefined || this.editedItem.prov_id != undefined) {
        console.log('Proveedor valido !!!', this.editedItem.prov_id)
        this.dialogEditProv = true
        console.log('this.dialogEditProv', this.dialogEditProv)
      }
    },
    ValidaCorreo() {
      let valida = true
      console.log('aqui', this.editedItemProv.asunto)
      if (
        (this.$v.editedItem.prov_email.$model != '' || this.$v.editedItem.prov_email2.$model) &&
        this.$v.editedItemProv.asunto.$model != '' &&
        this.$v.editedItemProv.descripcion.$model != '' &&
        this.fileInputValue != null
      ) {
        valida = false
      }
      return valida
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
        this.dialogMail = false
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.editedItemProv.asunto = ''
        this.editedItemProv.descripcion = ''
        this.fileInputValue = null
      })
      this.$v.$reset()
    },
  
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva Órden de Servicio' : 'Enviar correo a proveedor: '
    },

  },

}
</script>
