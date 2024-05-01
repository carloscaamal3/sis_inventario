<template>
  <v-dialog v-model="value" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <!-- Campo familia_id -->
            <v-col cols="6">
              <v-select
                v-model="$v.editedItem.familia_id.$model"
                :items="familias"
                :menu-props="{ top: true, offsetY: true }"
                label="Familia*"
                hint="Selecciona una Familia"
                item-text="tipo_descripcion"
                item-value="tipo_clave"
                persistent-hint
                dense
                return-object
                :error-messages="familia_idErrors"
                @change="onChangeFamiliaNew"
                @input="changed = true"
                @blur="$v.editedItem.familia_id.$touch()"
              >
              </v-select>
            </v-col>
            <!-- Campo  prod_id-->
            <v-col cols="12">
              <v-text-field
                v-model="$v.editedItem.prod_id.$model"
                label="Clave Producto*"
                counter="10"
                @keypress="isLetter($event)"
                :error-messages="prod_idErrors"
                @input="
                  $v.editedItem.prod_id.$reset(),
                    (editedItem.prod_id = editedItem.prod_id.toUpperCase())
                  changed = true
                "
                @blur="$v.editedItem.prod_id.$touch()"
              ></v-text-field>
            </v-col>
            <!-- Campo prod_descripcion -->
            <v-col cols="12">
              <v-text-field
                v-model="$v.editedItem.prod_descripcion.$model"
                label="Descripción*"
                counter="100"
                required
                :error-messages="prod_descripcionErrors"
                @input="$v.editedItem.prod_descripcion.$reset(), (changed = true)"
                @blur="$v.editedItem.prod_descripcion.$touch()"
              ></v-text-field>
            </v-col>
            <!-- Campo unidad_id -->
            <v-col cols="6">
              <v-select
                v-model="$v.editedItem.unidad_id.$model"
                :items="unidades"
                :menu-props="{ top: true, offsetY: true }"
                label="Unidad*"
                hint="Selecciona una Unidad"
                item-text="tipo_descripcion"
                item-value="tipo_clave"
                persistent-hint
                dense
                return-object
                :error-messages="unidad_idErrors"
                @input="changed = true"
                @blur="$v.editedItem.unidad_id.$touch()"
              >
              </v-select>
            </v-col>
            <!-- Campo prod_numparte -->
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.prod_numparte"
                label="Número de Parte"
                counter="45"
                required
                @input="$v.editedItem.prod_numparte.$reset(), (changed = true)"
                @blur="$v.editedItem.prod_numparte.$touch()"
              ></v-text-field>
            </v-col>
            <!-- Campo ACTIVO -->
            <v-col cols="12">
              <v-checkbox
                v-model="editedItem.prod_activo"
                :label="`Estatus: ${
                  editedItem.prod_activo.toString() == 'true' ? 'Activo' : 'Inactivo'
                }`"
                @input="$v.editedItem.prod_activo.$reset(), (changed = true)"
                @blur="$v.editedItem.prod_activo.$touch()"
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
      <ConfirmationDialog v-model="isSure" @click="cancel" />
    </v-card>
  </v-dialog>
</template>
<script>
import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
export default {
  name: 'CreaProducto',
  props: {
    value: {
      type: Boolean,
      default: false,
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
    familiasFiltro: [],
    familias: [],
    familia: 0,
    Proximo_Prod_Id: '',
    unidades: [],
    productos: [],
    editedItem: {
      prod_id: '',
      prod_descripcion: '',
      unidad_id: '',
      prod_numparte: '',
      familia_id: '',
      prod_ultMarca: '',
      prod_ultProv: 0,
      prod_ultPrecio: 0,
      prod_activo: true,
    },
    defaultItem: {
      prod_id: '',
      prod_descripcion: '',
      unidad_id: '',
      prod_numparte: '',
      familia_id: '',
      prod_ultMarca: '',
      prod_ultProv: 0,
      prod_ultPrecio: 0,
      prod_activo: true,
    },
  }),
  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      prod_id: { required, minLength: minLength(3), maxLength: maxLength(10) },
      prod_descripcion: { required, minLength: minLength(3), maxLength: maxLength(100) },
      unidad_id: { required },
      familia_id: { required },
    },
  },
  created() {
    this.iniciando()
  },

  methods: {
    //////////////////////////////////////////////////////////////////////////
    //Borrar en BD es desActivar
    async Borrar(index) {
      this.overlay = true
      this.$v.$touch()

      let body = {
        prod_id: index,
        prod_activo: 0,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      console.log(index)
      payload.id = index
      await this.$store
        .dispatch('producto/deleteProducto', payload)
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
      //Object.assign(this.productos[this.editedIndex], this.editedItem)
      await this.ProductosSelect(jwt, this.familia)
    },
    //Cancelar Formulario
    cancel(isSure) {
      this.isSure = isSure
      if (this.isSure) {
        this.close(false)
        this.changed = false
      }
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
    // Cerrar el formulario
    close(checkbox) {
      this.isSure = false
      this.checkbox = checkbox
      if (!this.checkbox) {
        this.$emit('input', false)
        this.isEditing = false
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$v.$reset()
    },
    // Editar Tipo
    editItem(item) {
      this.isEditing = true
      this.editedIndex = this.productos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.prod_activo = this.editedItem.prod_activo == 1 ? true : false
      this.dialog = true
    },
    // Eliminar Proucto
    deleteItem(item) {
      const index = this.productos.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.productos.splice(index, 1)
      this.Borrar(item.prod_id)
    },
    //Obtiene Todos las Familias para el SELECT
    async FamiliasSelect(jwt) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=FAMPROD&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.familiasFiltro = []
        this.familias = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.familiasFiltro = response.data
              this.familias = response.data
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
    //Refresca Datos para la tabla
    async iniciando() {
      let jwt = await getValidToken(this)
      await this.FamiliasSelect(jwt)
      await this.UnidadesSelect(jwt)
      if (this.familia == undefined || this.familia == 0) {
        this.familia = this.familiasFiltro[0].tipo_clave
      }
      await this.ProductosSelect(jwt, this.familia)
    },
    //Obtiene Todos las Unidades para el SELECT
    async ProductosSelect(jwt, familia) {
      this.isLoading = true
      let params = null
      if (familia != null) {
        //params ='filtro?campo1=prod_activo&tipo1=igual&valor1=1&logico2=and&campo2=familia_id&tipo2=igual&valor2=' +familia
        if (familia != 'FAMTOD') {
          params = 'filtro?campo1=familia_id&tipo1=igual&valor1=' + familia
        }
      }

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.productos = []
        await this.$store
          .dispatch('producto/fetchProducto', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.productos = response.data
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
    //Al cambiar el valor del Filtro de Familia
    async onChangeFamilia(value) {
      let jwt = await getValidToken(this)
      this.familia = value.tipo_clave
      await this.ProductosSelect(jwt, this.familia)
    },
    //Al cambiar el valor del Filtro de Familia en Nuevo
    async onChangeFamiliaNew(value) {
      let jwt = await getValidToken(this)
      this.familia = value.tipo_clave
      //Buscar el proximo producto
      let params = null
      params = this.familia
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        //this.familiasFiltro = []
        //this.familias = []
        await this.$store
          .dispatch('consulta/fetchSgteProd', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.Proximo_Prod_Id = response.data[0].Proximo_Prod_Id
              //this.familiasFiltro = response.data
              //this.familias = response.data
              this.editedItem.prod_id = this.Proximo_Prod_Id
            }
            this.isLoading = false
          })
          .catch((err) => {
            //this.isLoading = false
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
              // Enviar a inicio de sesión
            })
          })
      }
      //await this.ProductosSelect(jwt, this.familia)
    },
    // Guardar el formulario de productos
    async save() {
      this.overlay = true
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let unidad = 0
        if (this.editedItem.unidad_id.tipo_clave == null) {
          unidad = this.editedItem.unidad_id
        } else {
          unidad = this.editedItem.unidad_id.tipo_clave
        }
        let familia = 0
        if (this.editedItem.familia_id.tipo_clave == null) {
          familia = this.editedItem.familia_id
        } else {
          familia = this.editedItem.familia_id.tipo_clave
        }

        let body = {
          prod_id: this.editedItem.prod_id,
          prod_descripcion: this.editedItem.prod_descripcion,
          unidad_id: unidad,
          prod_numparte: this.editedItem.prod_numparte,
          familia_id: familia,
          prod_activo: this.editedItem.prod_activo == true ? 1 : 0,
        }

        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.editedIndex > -1) {
          payload.id = this.editedItem.prod_id
          await this.$store
            .dispatch('producto/editProducto', payload)
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
          //Object.assign(this.tipos[this.editedIndex], this.editedItem)
        } else {
          await this.$store
            .dispatch('producto/addProducto', payload)
            .then(() => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se creó con éxito',
              })
              //this.Tipos.push(response.data)
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
        await this.iniciando()
      }
    },
    //Obtiene Todos las Unidades para el SELECT
    async UnidadesSelect(jwt) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=UNIPROD&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.unidades = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.unidades = response.data
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
    //////////////////////////////////////////////////////////////////////////
  },
  computed: {
    //Titulo de los formularios
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Producto' : 'Editar Producto'
    },

    prod_idErrors() {
      const errors = []
      if (!this.$v.editedItem.prod_id.$dirty) return errors
      !this.$v.editedItem.prod_id.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.prod_id.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.prod_id.maxLength &&
        errors.push('Este campo debe de tener un máximo de 10 caracteres.')
      return errors
    },
    prod_descripcionErrors() {
      const errors = []
      if (!this.$v.editedItem.prod_descripcion.$dirty) return errors
      !this.$v.editedItem.prod_descripcion.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.prod_descripcion.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.prod_descripcion.maxLength &&
        errors.push('Este campo debe de tener un máximo de 100 caracteres.')
      return errors
    },
    unidad_idErrors() {
      const errors = []
      if (!this.$v.editedItem.unidad_id.$dirty) return errors
      !this.$v.editedItem.unidad_id.required && errors.push('Este campo es requerido')
      return errors
    },
    familia_idErrors() {
      const errors = []
      if (!this.$v.editedItem.familia_id.$dirty) return errors
      !this.$v.editedItem.familia_id.required && errors.push('Este campo es requerido')
      return errors
    },
  },
}
</script>
