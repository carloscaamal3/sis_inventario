<template>
  <v-container id="data-tables" tag="section">
    <base-material-card color="blue" icon="mdi-account-tie" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading></template>
      <!-- Texto del boton NUEVO -->
      <template v-slot:corner-button>
        <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog = true"
          >Nuevo Proveedor</v-btn
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
                <!-- Campo TIPO -->
                <v-col cols="12">
                  <v-select
                    v-model="$v.editedItem.prov_tipo.$model"
                    :items="tipos"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Tipo*"
                    item-text="tipo_descripcion"
                    item-value="tipo_clave"
                    persistent-hint
                    dense
                    hint="Seleciona Tipo"
                    return-object
                    :error-messages="TipoErrors"
                    @input="changed = true"
                    @blur="$v.editedItem.prov_tipo.$touch()"
                  >
                  </v-select>
                </v-col>

                <!-- Campo NOMBRE -->
                <v-col cols="12">
                  <v-text-field
                    v-model="$v.editedItem.prov_razon_social.$model"
                    label="Nombre*"
                    counter="255"
                    required
                    :error-messages="Razon_SocialErrors"
                    @input="$v.editedItem.prov_razon_social.$reset(), (changed = true)"
                    @blur="$v.editedItem.prov_razon_social.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo Correo Electronico -->
                <v-col cols="6">
                  <v-text-field
                    v-model="$v.editedItem.prov_email.$model"
                    label="Correo Electrónico"
                    counter="200"
                    :error-messages="emailErrors"
                    @input="$v.editedItem.prov_email.$reset(), (changed = true)"
                    @blur="$v.editedItem.prov_email.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo Correo Electronico 2-->
                <v-col cols="6">
                  <v-text-field
                    v-model="$v.editedItem.prov_email2.$model"
                    label="Correo Electrónico 2"
                    counter="200"
                    :error-messages="email2Errors"
                    @input="$v.editedItem.prov_email2.$reset(), (changed = true)"
                    @blur="$v.editedItem.prov_email2.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- DIRECCION -->
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.prov_direccion"
                    label="Dirección"
                    counter="200"
                    @input="$v.editedItem.prov_direccion.$reset(), (changed = true)"
                    @blur="$v.editedItem.prov_direccion.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- CIUDAD -->
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.prov_ciudad"
                    label="Ciudad"
                    counter="200"
                    @input="$v.editedItem.prov_ciudad.$reset(), (changed = true)"
                    @blur="$v.editedItem.prov_ciudad.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo prov_RFC -->
                <v-col cols="5">
                  <v-text-field
                    v-model="editedItem.prov_RFC"
                    label="RFC"
                    counter="13"
                    dense
                    @input="$v.editedItem.prov_RFC.$reset(), (changed = true)"
                    @blur="$v.editedItem.prov_RFC.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo prov_empresayuc -->
                <v-col cols="7">
                  <v-checkbox
                    v-model="editedItem.prov_empresayuc"
                    :label="`Empresa Yucateca?: ${
                      editedItem.prov_empresayuc.toString() == 'true' ? 'SI' : 'NO'
                    }`"
                    @input="$v.editedItem.prov_empresayuc.$reset(), (changed = true)"
                    @blur="$v.editedItem.prov_empresayuc.$touch()"
                  >
                  </v-checkbox>
                </v-col>
                <!-- Campo prov_NumRegPadProv -->
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.prov_NumRegPadProv"
                    label="Num. Registro Padrón Proveedores"
                    counter="13"
                    dense
                    @input="$v.editedItem.prov_NumRegPadProv.$reset(), (changed = true)"
                    @blur="$v.editedItem.prov_NumRegPadProv.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo ACTIVO -->
                <v-col cols="6">
                  <v-checkbox
                    v-model="editedItem.prov_activo"
                    :label="`Estatus: ${
                      editedItem.prov_activo.toString() == 'true' ? 'Activo' : 'Inactivo'
                    }`"
                    @input="$v.editedItem.prov_activo.$reset(), (changed = true)"
                    @blur="$v.editedItem.prov_activo.$touch()"
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
        :items="proveedores"
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
        <template v-slot:item.prov_activo="{ item }">
          <Status :activostr="item.prov_activo" tipo="String" />
        </template>

        <template v-slot:no-data>
          <!-- <v-btn color="primary">Reset</v-btn> -->
          ¡No hay datos para mostrar!
        </template>
      </v-data-table>
      <!-- Termina Tabla de Entidades -->
      <!-- Empieza DataExporter -->
      <DataExporter :dataArray="proveedores" :dataFields="fields" fileName="Proveedores" />
      <!-- Termina DataExporter -->
    </base-material-card>
  </v-container>
</template>

<script>
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
import Status from '@/components/general/StatusInfo.vue'
import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'
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
      { text: 'Proveedor', align: 'start', value: 'prov_id' },
      { text: 'Razón Social', value: 'prov_razon_social' },
      { text: 'Tipo', value: 'tipo_descripcion' },
      { text: 'Activo', value: 'prov_activo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //
    value: [],
    proveedores: [],
    tipos: [],
    editedIndex: -1,
    editedItem: {
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
    defaultItem: {
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
    //Para Exportar
    fields: {
      Proveedor: 'prov_id',
      Razon_Social: 'prov_razon_social',
      Correo_Electronico: 'prov_email',
      Correo_Electronico2: 'prov_email2',
      Tipo: 'tipo_descripcion',
      Activo: 'prov_activo',
    },
  }),

  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      prov_razon_social: { required, minLength: minLength(3), maxLength: maxLength(100) },
      prov_tipo: { required },
      prov_email: { maxLength: maxLength(200), email },
      prov_email2: { maxLength: maxLength(200), email },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      //return this.editedIndex === -1 ? 'Nuevo Proveedor' : 'Editar Proveedor'
      return this.editedIndex === -1
        ? 'Nuevo Proveedor'
        : 'Editando proveedor : ' + this.editedIndex
    },
    Razon_SocialErrors() {
      const errors = []
      if (!this.$v.editedItem.prov_razon_social.$dirty) return errors
      !this.$v.editedItem.prov_razon_social.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.prov_razon_social.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.prov_razon_social.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    TipoErrors() {
      const errors = []
      if (!this.$v.editedItem.prov_tipo.$dirty) return errors
      !this.$v.editedItem.prov_tipo.required && errors.push('Este campo es requerido')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.editedItem.prov_email.$dirty) return errors
      !this.$v.editedItem.prov_email.email && errors.push('Debe ser un correo electrónico válido')
      return errors
    },
    email2Errors() {
      const errors = []
      if (!this.$v.editedItem.prov_email2.$dirty) return errors
      !this.$v.editedItem.prov_email2.email && errors.push('Debe ser un correo electrónico válido')
      return errors
    },
    /* TiposErrors() {
      const errors = []
      if (!this.$v.editedItem.id_tipo.$dirty) return errors
      !this.$v.editedItem.id_tipo.required && errors.push('Este campo es requerido')
      return errors
    }, */
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
      this.obtenerTipos(jwt)
      await this.obtenerProveedores(jwt)
    },
    //Obtiene todos los tipos para el select
    async obtenerTipos(jwt) {
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=t.clatip_id&tipo1=igual&valor1=TIPPROV'
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
    //Obtiene Todos los proveedores para la tabla principal
    async obtenerProveedores(jwt) {
      this.isLoading = true
      //let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt }
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
    // Editar Tipo
    editItem(item) {
      this.isEditing = true
      console.log('item', item)
      this.editedIndex = this.proveedores.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.prov_activo = this.editedItem.prov_activo == 1 ? true : false
      this.editedItem.prov_empresayuc = this.editedItem.prov_empresayuc == 1 ? true : false
      this.dialog = true
    },
    // Eliminar Tipo
    deleteItem(item) {
      const index = this.proveedores.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.proveedores.splice(index, 1)
      this.Borrar(item.prov_id)
    },
    //Borrar en BD es desActivar
    async Borrar(index) {
      this.overlay = true
      this.$v.$touch()

      let body = {
        //_id: this.editedItem.id_tipo,
        id_entidad: index,
        //tipo_nombre: this.editedItem.tipo_nombre,
        ent_activo: 0,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('proveedor/deleteProveedor', payload)
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
      Object.assign(this.entidades[this.editedIndex], this.editedItem)
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
      if (!this.$v.$invalid) {
        /*
        let tipo = 0
        if (this.editedItem.prov_tipo.tipo_id == null) {
          tipo = this.editedItem.prov_tipo
        } else {
          tipo = this.editedItem.prov_tipo.tipo_id
        }
        */
        let tipo = ''
        if (this.editedItem.prov_tipo.tipo_clave == null) {
          tipo = this.editedItem.prov_tipo
        } else {
          tipo = this.editedItem.prov_tipo.tipo_clave
        }

        //console.log('tipo:' + tipo)
        let body = {
          //id_tipo: this.editedItem.id_tipo,
          //id_tipo: this.editedItem.id_tipo.id_tipo,
          prov_tipo: tipo,
          prov_razon_social: this.editedItem.prov_razon_social,
          prov_email: this.editedItem.prov_email,
          prov_email2: this.editedItem.prov_email2,
          prov_activo: this.editedItem.prov_activo == true ? 1 : 0,
          prov_RFC: this.editedItem.prov_RFC,
          prov_empresayuc: this.editedItem.prov_empresayuc == true ? 1 : 0,
          prov_NumRegPadProv: this.editedItem.prov_NumRegPadProv,
          prov_direccion: this.editedItem.prov_direccion,
          prov_ciudad: this.editedItem.prov_ciudad,
        }
        //console.log(tipo)
        //console.log(body)

        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.editedIndex > -1) {
          payload.id = this.editedItem.prov_id
          await this.$store
            .dispatch('proveedor/editProveedor', payload)
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
          Object.assign(this.proveedores[this.editedIndex], this.editedItem)
        } else {
          await this.$store
            .dispatch('proveedor/addProveedor', payload)
            .then((response) => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se creó con éxito',
              })
              this.proveedores.push(response.data)
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
        await this.obtenerProveedores(jwt)
      }
    },
  },
}
</script>
