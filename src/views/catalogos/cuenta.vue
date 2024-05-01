<template>
  <v-container id="data-tables" tag="section">
    <base-material-card color="blue" icon="mdi-card-bulleted-outline" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading></template>
      <!-- Texto del boton NUEVO -->
      <template v-slot:corner-button>
        <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog = true"
          >Nueva Cuenta</v-btn
        >
      </template>

      <!-- <v-overlay :value="overlay">
        <v-progress-circular :size="50" color="green" indeterminate></v-progress-circular>
      </v-overlay> -->

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        label="Búsqueda"
        hide-details
        single-line
        style="max-width: 250px"
      />
      <!-- Empieza Dialogo Cancelar -->
      <ConfirmationDialog v-model="isSure" @click="cancel" />
      <!-- Termina Dialogo Cancelar -->
      <!-- Empieza Dialogo -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <!-- Campo CUENTA -->
                <v-col cols="6">
                  <v-text-field
                    v-model="$v.editedItem.cuecon_cuenta.$model"
                    label="Cuenta"
                    counter="20"
                    dense
                    required
                    :error-messages="cuecon_cuentaErrors"
                    @input="$v.editedItem.cuecon_cuenta.$reset(), (changed = true)"
                    @blur="$v.editedItem.cuecon_cuenta.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo PROVEEDOR -->
                <v-col cols="12">
                  <v-select
                    v-model="$v.editedItem.prov_id.$model"
                    :items="proveedores"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Proveedor*"
                    item-text="prov_razon_social"
                    item-value="prov_id"
                    persistent-hint
                    dense
                    hint="Seleciona Proveedor"
                    return-object
                    :error-messages="prov_idErrors"
                    @input="changed = true"
                    @blur="$v.editedItem.prov_id.$touch()"
                  >
                  </v-select>
                </v-col>
                <!-- Campo TIPO -->
                <v-col cols="12">
                  <v-select
                    v-model="$v.editedItem.tipo_id.$model"
                    :items="tipos"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Tipo de cuenta*"
                    item-text="tipo_descripcion"
                    item-value="tipo_id"
                    persistent-hint
                    dense
                    hint="Seleciona Tipo de cuenta"
                    return-object
                    :error-messages="tipo_idErrors"
                    @input="changed = true"
                    @blur="$v.editedItem.tipo_id.$touch()"
                  >
                  </v-select>
                </v-col>
                <!-- Campo ACTIVO -->
                <v-col cols="6">
                  <v-checkbox
                    v-model="editedItem.cuecon_activo"
                    :label="`Estatus: ${
                      editedItem.cuecon_activo.toString() == 'true' ? 'Activo' : 'Inactivo'
                    }`"
                    @input="$v.editedItem.cuecon_activo.$reset(), (changed = true)"
                    @blur="$v.editedItem.cuecon_activo.$touch()"
                  >
                  </v-checkbox>
                </v-col>
                <!-- Campo es_multi_concepto -->
                <v-col cols="6">
                  <v-checkbox
                    v-model="editedItem.es_multi_concepto"
                    :label="`es Multi Concepto: ${
                      editedItem.es_multi_concepto.toString() == 'true' ? 'Activo' : 'Inactivo'
                    }`"
                    @input="$v.editedItem.es_multi_concepto.$reset(), (changed = true)"
                    @blur="$v.editedItem.es_multi_concepto.$touch()"
                  >
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-container>
            <small>*Campo Obligatorio</small>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-checkbox v-model="checkbox" label="Crear otro" :disabled="isEditing"></v-checkbox>
            <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled="$v.$invalid">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Termina Dialogo -->
      <!-- Aqui va progress linear -->
      <v-divider class="mt-3" />
      <v-data-table
        :headers="headers"
        :items="cuentas"
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
        </template>

        <!-- Creo el boton de Activo-->
        <template v-slot:item.cuecon_activo="{ item }">
          <Status :activostr="item.cuecon_activo" tipo="String" />
        </template>

        <template v-slot:item.es_multi_concepto="{ item }">
          <Status :activostr="item.es_multi_concepto" tipo="String" />
        </template>

        <template v-slot:no-data>
          <!-- <v-btn color="primary">Reset</v-btn> -->
          ¡No hay datos para mostrar!
        </template>
      </v-data-table>
      <!-- Termina Tabla de cuentas -->
      <!-- Empieza DataExporter -->
      <DataExporter :dataArray="cuentas" :dataFields="fields" fileName="cuentas" />
      <!-- Termina DataExporter -->
    </base-material-card>
  </v-container>
</template>

<script>
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
import Status from '@/components/general/StatusInfo.vue'
import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import DataExporter from '@/components/general/DataExporter.vue'
export default {
  components: {
    ConfirmationDialog,
    Status,
    DataExporter,
  },

  data: () => ({
    search: undefined,
    isLoading: false,
    checkbox: false,
    isEditing: false,
    dialog: false,
    isSure: false,
    overlay: false,
    changed: false,
    headers: [
      { text: 'Cuenta', align: 'start', value: 'cuecon_cuenta' },
      { text: 'Razón Social', value: 'prov_razon_social' },
      { text: 'Tipo', value: 'tipo_descripcion' },
      { text: 'Activo', value: 'cuecon_activo' },
      { text: 'Multi Concepto', value: 'es_multi_concepto' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //
    value: [],
    proveedores: [],
    tipos: [],
    cuentas: [],
    editedIndex: -1,
    editedItem: {
      cuecon_cuenta: '',
      prov_id: 0,
      tipo_id: 0,
      cuecon_activo: true,
      es_multi_concepto: false,
    },
    defaultItem: {
      cuecon_cuenta: '',
      prov_id: 0,
      tipo_id: 0,
      cuecon_activo: true,
      es_multi_concepto: false,
    },
    //Para Exportar
    fields: {
      Cuenta: 'cuecon_cuenta',
      Razon_Social: 'prov_razon_social',
      Tipo: 'tipo_descripcion',
      Activo: 'cuecon_activo',
      Multi_Concepto: 'es_multi_concepto',
    },
  }),

  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      //ent_nombre: { required, minLength: minLength(3), maxLength: maxLength(255) },
      cuecon_cuenta: { required, minLength: minLength(3), maxLength: maxLength(20) },
      //id_tipo: { required, minLength: minLength(3), maxLength: maxLength(255) },
      //reten_nombre: { required, minLength: minLength(3), maxLength: maxLength(100) },
      prov_id: { required },
      tipo_id: { required },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva Entidad' : 'Editar Entidad'
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
    prov_idErrors() {
      const errors = []
      if (!this.$v.editedItem.prov_id.$dirty) return errors
      !this.$v.editedItem.prov_id.required && errors.push('Este campo es requerido')
      return errors
    },
    tipo_idErrors() {
      const errors = []
      if (!this.$v.editedItem.tipo_id.$dirty) return errors
      !this.$v.editedItem.tipo_id.required && errors.push('Este campo es requerido')
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
    //Refresca Datos para la tabla
    async iniciando() {
      let jwt = await getValidToken(this)
      await this.obtenertipos(jwt)
      await this.obtenerproveedores(jwt)
      await this.obtenerCuentas(jwt)
    },
    //Obtiene todos laas tipos para el select
    async obtenertipos(jwt) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=SOLNP&logico2=or&campo2=t.clatip_id&tipo2=igual&valor2=SOLP'

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
    //Obtiene todos laas tipos para el select
    async obtenerproveedores(jwt) {
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=prov_activo&tipo1=igual&valor1=1'

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
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
      }
    },
    //Obtiene Todos las proveedores para la tabla
    async obtenerCuentas(jwt) {
      this.isLoading = true
      //let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt }
        this.cuentas = []
        this.$store
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
      }
    },
    // Editar Tipo
    editItem(item) {
      this.isEditing = true
      this.editedIndex = this.cuentas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.cuecon_activo = this.editedItem.cuecon_activo == 1 ? true : false
      this.editedItem.es_multi_concepto = this.editedItem.es_multi_concepto == 1 ? true : false
      this.dialog = true
    },
    // Eliminar Tipo
    deleteItem(item) {
      const index = this.cuentas.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.cuentas.splice(index, 1)
      this.Borrar(item.cuecon_cuenta)
    },
    //Borrar en BD es desActivar
    async Borrar(index) {
      this.overlay = true
      this.$v.$touch()

      let body = {
        //_id: this.editedItem.id_tipo,
        cuecon_cuenta: index,
        //cta_clave: this.editedItem.cta_clave,
        cuecon_activo: 0,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('cuenta/deleteCuenta', payload)
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
        this.isEditing = false
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$v.$reset()
    },

    // Guardar el formulario
    async save() {
      this.overlay = true
      this.$v.$touch()
      //OJO ARREGLAR
      //if (!this.$v.$invalid) {
      console.log('ENTRO AL IF')
      let proveedor = 0
      if (this.editedItem.prov_id.prov_id == null) {
        proveedor = this.editedItem.prov_id
      } else {
        proveedor = this.editedItem.prov_id.prov_id
      }
      console.log(proveedor)
      let tipo = 0
      if (this.editedItem.tipo_id.tipo_id == null) {
        tipo = this.editedItem.tipo_id
      } else {
        tipo = this.editedItem.tipo_id.tipo_id
      }

      let body = {
        prov_id: proveedor,
        tipo_id: tipo,
        cuecon_cuenta: this.editedItem.cuecon_cuenta,
        cuecon_activo: this.editedItem.cuecon_activo == true ? 1 : 0,
        es_multi_concepto: this.editedItem.es_multi_concepto == true ? 1 : 0,
      }
      //console.log(tipo)
      //console.log(body)

      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      if (this.editedIndex > -1) {
        payload.id = this.editedItem.cuecon_cuenta
        await this.$store
          .dispatch('cuenta/editCuenta', payload)
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
        Object.assign(this.cuentas[this.editedIndex], this.editedItem)
      } else {
        await this.$store
          .dispatch('cuenta/addCuenta', payload)
          .then((response) => {
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'El registro se creó con éxito',
            })
            this.cuentas.push(response.data)
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
      this.close(this.checkbox)
      this.changed = false
      jwt = await getValidToken(this)
      await this.obtenerCuentas(jwt)
      //}
    },
  },
}
</script>
