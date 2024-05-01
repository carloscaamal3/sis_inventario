<template>
  <!-- Empieza Dialogo -->
  <!-- <v-dialog v-model="dialog" max-width="500px"> -->

  <v-dialog v-model="value" persistent :max-width="width">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <!-- Campo TIPO -->
            <v-col cols="12" class="v-text">
              <v-select
                v-model="$props.proveedor.prov_tipo"
                disabled
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
              >
              </v-select>
            </v-col>
            <!-- Campo NOMBRE -->
            <v-col cols="12" class="v-text">
              <v-text-field
                disabled
                v-model="$props.proveedor.prov_razon_social"
                label="Nombre*"
                counter="255"
                required
                :error-messages="Razon_SocialErrors"
              ></v-text-field>
            </v-col>
            <!-- Campo Correo Electronico -->
            <v-col cols="6" class="v-text">
              <v-text-field
                :disabled="editaCorreo1"
                v-model="$props.proveedor.prov_email"
                label="Correo Electrónico"
                counter="200"
                :error-messages="emailErrors"
                @input="changed = true"
              ></v-text-field>
            </v-col>
            <!-- Campo Correo Electronico 2-->
            <v-col cols="6" class="v-text">
              <v-text-field
                :disabled="editaCorreo2"
                v-model="$props.proveedor.prov_email2"
                label="Correo Electrónico 2"
                counter="200"
                :error-messages="email2Errors"
                @input="changed = true"
              ></v-text-field>
            </v-col>
            <!-- DIRECCION -->
            <v-col cols="12" class="v-text">
              <v-text-field
                :disabled="editaDireccion"
                v-model="$props.proveedor.prov_direccion"
                label="Dirección"
                counter="200"
                @input="changed = true"
              ></v-text-field>
            </v-col>
            <!-- CIUDAD -->
            <v-col cols="12" class="v-text">
              <v-text-field
                :disabled="editaCiudad"
                v-model="$props.proveedor.prov_ciudad"
                label="Ciudad"
                counter="200"
                @input="changed = true"
              ></v-text-field>
            </v-col>
            <!-- Campo prov_RFC -->
            <v-col cols="5" class="v-text">
              <v-text-field
                :disabled="editaRFC"
                v-model="$props.proveedor.prov_RFC"
                label="RFC"
                counter="13"
                dense
                @input="changed = true"
              ></v-text-field>
            </v-col>
            <!-- Campo prov_empresayuc -->
            <v-col cols="7" class="v-text">
              <v-checkbox
                :disabled="editaEmpYuc"
                v-model="$props.proveedor.prov_empresayuc"
                :label="`Empresa Yucateca?: ${
                  $props.proveedor.prov_empresayuc.toString() == 'true' ? 'SI' : 'NO'
                }`"
                @input="changed = true"
              >
              </v-checkbox>
            </v-col>
            <!-- Campo prov_NumRegPadProv -->
            <v-col cols="6" class="v-text">
              <v-text-field
                :disabled="editaRegPad"
                v-model="$props.proveedor.prov_NumRegPadProv"
                label="Num. Registro Padrón Proveedores"
                counter="13"
                dense
                @input="changed = true"
              ></v-text-field>
            </v-col>
            <!-- Campo ACTIVO -->
            <v-col cols="6" class="v-text">
              <v-checkbox
                disabled
                v-model="$props.proveedor.prov_activo"
                :label="`Estatus: ${
                  $props.proveedor.prov_activo.toString() == 'true' ? 'Activo' : 'Inactivo'
                }`"
                @input="changed = true"
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
        <v-btn color="blue darken-1" text @click="save" :disabled="validando">Guardar</v-btn>
      </v-card-actions>
    </v-card>
    <ConfirmationDialog v-model="isSure" @click="cancel" />
  </v-dialog>
  <!-- Termina Dialogo -->

  <!-- Aqui va progress linear -->
</template>
<script>
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
//import ConfirmationDialog from '@/general/ConfirmationDialog.vue'
import { getValidToken } from '@/store/helpers.js'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
export default {
  name: 'EditaProveedor',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 500,
    },
    proveedor: {
      type: Object,
      default: null,
    },
    esEdicion: {
      type: Boolean,
      default: true,
    },
    editaCorreo1: {
      type: Boolean,
      default: true,
    },
    editaCorreo2: {
      type: Boolean,
      default: true,
    },
    editaDireccion: {
      type: Boolean,
      default: true,
    },
    editaCiudad: {
      type: Boolean,
      default: true,
    },
    editaRFC: {
      type: Boolean,
      default: true,
    },
    editaEmpYuc: {
      type: Boolean,
      default: true,
    },
    editaRegPad: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ConfirmationDialog,
  },
  data: () => ({
    isSure: false,
    changed: false,
    isEditing: false,
    editedIndex: -1,
    //dialog: false,
    tipos: [],

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
  created() {
    //this.iniciando()
    //console.log('created() -> Los props son accesibles en: ', this.$props.proveedor)
    //this.editedItem = Object.assign({}, this.$props.proveedor)
    //console.log('this.editedItem en created()', this.editedItem)
  },
  mounted() {
    //console.log('mounted() -> Los props son accesibles en: ', this.$props.proveedor)

    //console.log('this.$props.value', this.$props.value)
    this.iniciando()
    this.editedIndex = this.$props.proveedor.prov_id
    //console.log('this.editedIndex', this.editedIndex)
    //console.log('this.$props.proveedor.prov_id', this.$props.proveedor.prov_id)
    //this.editedItem = Object.assign({}, this.$props.proveedor)
    //console.log('this.editedItem en mounted()', this.editedItem)
    //this.isEditing = this.$props.esEdicion
    this.isEditing = this.esEdicion
  },
  computed: {
    formTitle() {
      //return this.editedIndex === -1 ? 'Nuevo Proveedor' : 'Editar Proveedor'
      return this.editedIndex === -1
        ? 'Nuevo Proveedor'
        : 'Editando proveedor : ' + this.$props.proveedor.prov_id
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
    validando() {
      let valida = true

      //console.log('this.$props.proveedor.prov_email:', this.$props.proveedor.prov_email)
      if (
        this.$props.proveedor.prov_email != '' &&
        this.$props.proveedor.prov_email2 != '' &&
        this.$props.proveedor.prov_direccion != '' &&
        this.$props.proveedor.prov_ciudad != ''
      ) {
        valida = false
      }

      return valida
    },
  },
  methods: {
    async iniciando() {
      //console.log('EditaProveedor', ' async iniciando()')
      await this.obtenerTipos()
      //await this.obtenerProveedores()
      //this.editedItem = Object.assign({}, this.proveedor)
    },

    checkChanges() {
      //console.log('checkChanges()')
      //console.log('this.changed', this.changed)
      if (this.changed) {
        this.isSure = true
      } else {
        this.close(false)
        this.changed = false
      }
    },

    cancel(isSure) {
      //console.log('this.isSure', this.isSure)
      this.isSure = isSure
      if (this.isSure) {
        this.close(false)
        this.changed = false
      }
    },
    // Cerrar el formulario

    close(checkbox) {
      console.log('close(checkbox)')
      console.log('checkbox', checkbox)
      this.isSure = false
      this.checkbox = checkbox
      if (!this.checkbox) {
        //this.value = false
        this.$emit('input', false)
        this.isEditing = false
      }
      this.$nextTick(() => {
        console.log('this.$nextTick(() => {')
        //this.editedItem = Object.assign({}, this.defaultItem)
        //this.editedIndex = -1
      })
      this.$v.$reset()
    },

    async obtenerProveedores() {
      //console.log('EditaProveedor', 'async obtenerProveedores(prov_id)')
      this.isLoading = true
      //let jwt = await getValidToken(this)
      let jwt = await getValidToken(this)
      let params = null
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
    //Obtiene todos los tipos para el select
    async obtenerTipos() {
      //console.log('async obtenerTipos()')
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=t.clatip_id&tipo1=igual&valor1=TIPPROV'
      let jwt = await getValidToken(this)
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
    // Guardar el formulario
    async save() {
      this.overlay = true
      this.$v.$touch()
      //if (!this.$v.$invalid) {
      /*
        let tipo = 0
        if (this.editedItem.prov_tipo.tipo_id == null) {
          tipo = this.editedItem.prov_tipo
        } else {
          tipo = this.editedItem.prov_tipo.tipo_id
        }
        */
      let tipo = ''
      if (this.$props.proveedor.prov_tipo.tipo_clave == null) {
        tipo = this.$props.proveedor.prov_tipo
      } else {
        tipo = this.$props.proveedor.prov_tipo.tipo_clave
      }

      //console.log('tipo:' + tipo)
      let body = {
        //id_tipo: this.$props.proveedor.id_tipo,
        //id_tipo: this.$props.proveedor.id_tipo.id_tipo,
        prov_tipo: tipo,
        prov_razon_social: this.$props.proveedor.prov_razon_social,
        prov_email: this.$props.proveedor.prov_email,
        prov_email2: this.$props.proveedor.prov_email2,
        prov_activo: this.$props.proveedor.prov_activo == true ? 1 : 0,
        prov_RFC: this.$props.proveedor.prov_RFC,
        prov_empresayuc: this.$props.proveedor.prov_empresayuc == true ? 1 : 0,
        prov_NumRegPadProv: this.$props.proveedor.prov_NumRegPadProv,
        prov_direccion: this.$props.proveedor.prov_direccion,
        prov_ciudad: this.$props.proveedor.prov_ciudad,
      }
      //console.log(tipo)
      //console.log(body)

      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      //if (this.editedIndex > -1) {
      if (this.$props.proveedor.prov_id > -1) {
        payload.id = this.$props.proveedor.prov_id
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
        //Object.assign(this.proveedores[this.editedIndex], this.$props.proveedor)
        //this.value = false
        //this.checkChanges()
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
      //jwt = await getValidToken(this)
      //await this.obtenerProveedores(jwt)
      //}
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
</style>
