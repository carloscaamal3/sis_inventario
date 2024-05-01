<template>
  <v-container id="data-tables" tag="section">
    <base-material-card color="blue" icon="mdi-car-pickup" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading></template>
      <!-- Texto del boton NUEVO -->
      <template v-slot:corner-button>
        <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog = true"
          >Nuevo Vehiculo</v-btn
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
                <v-col cols="12">
                  <v-text-field
                    v-model="$v.editedItem.veh_id.$model"
                    label="Serie*"
                    counter="20"
                    @keypress="isLetter($event)"
                    :error-messages="veh_idErrors"
                    @input="
                      $v.editedItem.veh_id.$reset(),
                        (editedItem.veh_id = editedItem.veh_id.toUpperCase())
                      changed = true
                    "
                    @blur="$v.editedItem.veh_id.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo veh_modelo -->
                <v-col cols="12">
                  <v-text-field
                    v-model="$v.editedItem.veh_modelo.$model"
                    label="Modelo*"
                    counter="50"
                    required
                    :error-messages="veh_modeloErrors"
                    @input="$v.editedItem.veh_modelo.$reset(), (changed = true)"
                    @blur="$v.editedItem.veh_modelo.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo veh_marca_id -->
                <v-col cols="12">
                  <v-select
                    v-model="$v.editedItem.veh_marca_id.$model"
                    :items="marcas"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Marca*"
                    hint="Selecciona una marca"
                    item-text="tipo_descripcion"
                    item-value="tipo_clave"
                    persistent-hint
                    dense
                    return-object
                    :error-messages="veh_marca_idErrors"
                    @input="changed = true"
                    @blur="$v.editedItem.veh_marca_id.$touch()"
                  >
                  </v-select>
                </v-col>
                <!-- Campo veh_anio -->
                <v-col cols="4">
                  <v-text-field
                    class="text-xs-right"
                    v-model="editedItem.veh_anio"
                    label="Año"
                    @keypress="isNumber($event)"
                    dense
                    @input="$v.editedItem.veh_anio.$reset(), (changed = true)"
                    @blur="$v.editedItem.veh_anio.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo veh_placas -->
                <v-col cols="8">
                  <v-text-field
                    v-model="editedItem.veh_placas"
                    label="Placas*"
                    counter="15"
                    dense
                    @input="$v.editedItem.veh_placas.$reset(), (changed = true)"
                    @blur="$v.editedItem.veh_placas.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo veh_tipo_id -->
                <v-col cols="6">
                  <v-select
                    v-model="$v.editedItem.veh_tipo_id.$model"
                    :items="tipoVehiculo"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Tipo Vehículo*"
                    hint="Selecciona un tipo"
                    item-text="tipo_descripcion"
                    item-value="tipo_clave"
                    persistent-hint
                    dense
                    return-object
                    :error-messages="veh_tipo_idErrors"
                    @input="changed = true"
                    @blur="$v.editedItem.veh_tipo_id.$touch()"
                  >
                  </v-select>
                </v-col>
                <!-- Campo veh_placas -->
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.veh_propiedad_de"
                    label="Propiedad de"
                    counter="45"
                    dense
                    @input="$v.editedItem.veh_propiedad_de.$reset(), (changed = true)"
                    @blur="$v.editedItem.veh_propiedad_de.$touch()"
                  ></v-text-field>
                </v-col>

                <!-- Campo Empleado ASignado -->
                <v-col cols="12">
                  <v-select
                    v-model="$v.editedItem.veh_emp_id.$model"
                    :items="empleado"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Empleado*"
                    :item-text="(item) => item.emp_nombre + ' - ' + item.emp_puesto"
                    item-value="emp_codigo"
                    persistent-hint
                    dense
                    hint="Seleciona Empleado"
                    return-object
                    :error-messages="veh_emp_idErrors"
                    @blur="$v.editedItem.veh_emp_id.$touch()"
                  >
                  </v-select>
                </v-col>
                <!-- Campo ACTIVO -->
                <v-col cols="12">
                  <v-checkbox
                    v-model="editedItem.veh_activo"
                    :label="`Estatus: ${
                      editedItem.veh_activo.toString() == 'true' ? 'Activo' : 'Inactivo'
                    }`"
                    @input="$v.editedItem.veh_activo.$reset(), (changed = true)"
                    @blur="$v.editedItem.veh_activo.$touch()"
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
        :items="vehiculos"
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
        <template v-slot:item.veh_activo="{ item }">
          <Status :activostr="item.veh_activo" tipo="String" />
        </template>

        <template v-slot:no-data>
          <!-- <v-btn color="primary">Reset</v-btn> -->
          ¡No hay datos para mostrar!
        </template>
      </v-data-table>
      <!-- Termina Tabla de Clasificación de Tipos -->
      <!-- Empieza DataExporter -->
      <DataExporter
        :dataArray="vehiculos"
        :dataFields="fields"
        fileName="vehiculos"
        pdfView="none"
      />
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
      { text: 'Serie', align: 'start', value: 'veh_id' },
      { text: 'Modelo', value: 'veh_modelo' },
      { text: 'Marca', value: 'marca' },
      { text: 'Año', value: 'veh_anio' },
      { text: 'Placas', value: 'veh_placas' },
      { text: 'Asignado A', value: 'emp_nombre' },
      { text: 'Activo', value: 'veh_activo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //
    value: [],
    vehiculos: [],
    marcas: [],
    tipoVehiculo: [],
    empleado: [],
    editedIndex: -1,
    editedItem: {
      veh_id: '',
      veh_modelo: '',
      veh_marca_id: '',
      veh_anio: 0,
      veh_placas: '',
      veh_tipo_id: '',
      veh_emp_id: 0,
      veh_activo: true,
      veh_propiedad_de: '',
    },
    defaultItem: {
      veh_id: '',
      veh_modelo: '',
      veh_marca_id: '',
      veh_anio: 0,
      veh_placas: '',
      veh_tipo_id: '',
      veh_emp_id: 0,
      veh_activo: true,
      veh_propiedad_de: '',
    },
    //Para Exportar
    fields: {
      Serie: 'veh_id',
      Modelo: 'veh_modelo',
      Marca: 'marca',
      Año: 'veh_anio',
      Placas: 'veh_placas',
      Tipo_Vehiculo: 'tipoVehiculo',
      Asignado_A: 'emp_nombre',
      Puesto: 'emp_puesto',
      Direccion: 'emp_direccion',
      Propiedad_de: 'veh_propiedad_de',
      Activo: 'veh_activo',
    },
  }),

  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      veh_id: { required, minLength: minLength(3), maxLength: maxLength(20) },
      veh_modelo: { required, minLength: minLength(3), maxLength: maxLength(50) },
      veh_marca_id: { required },
      veh_tipo_id: { required },
      veh_emp_id: { required },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Vehículo' : 'Editar Vehículo'
    },
    veh_idErrors() {
      const errors = []
      if (!this.$v.editedItem.veh_id.$dirty) return errors
      !this.$v.editedItem.veh_id.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.veh_id.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.veh_id.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    veh_modeloErrors() {
      const errors = []
      if (!this.$v.editedItem.veh_modelo.$dirty) return errors
      !this.$v.editedItem.veh_modelo.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.veh_modelo.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.veh_modelo.maxLength &&
        errors.push('Este campo debe de tener un máximo de 50 caracteres.')
      return errors
    },
    veh_marca_idErrors() {
      const errors = []
      if (!this.$v.editedItem.veh_marca_id.$dirty) return errors
      !this.$v.editedItem.veh_marca_id.required && errors.push('Este campo es requerido')
      return errors
    },
    veh_tipo_idErrors() {
      const errors = []
      if (!this.$v.editedItem.veh_tipo_id.$dirty) return errors
      !this.$v.editedItem.veh_tipo_id.required && errors.push('Este campo es requerido')
      return errors
    },
    veh_emp_idErrors() {
      const errors = []
      if (!this.$v.editedItem.veh_emp_id.$dirty) return errors
      !this.$v.editedItem.veh_emp_id.required && errors.push('Este campo es requerido')
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
      await this.obtenerVehiculos(jwt)
      await this.obtenerMarcas(jwt)
      await this.obtenerTipoVehiculo(jwt)
      await this.obtenerEmpleado(jwt)
    },
    //Obtiene Todas las Clasificacion de Tipos para la tabla
    async obtenerVehiculos(jwt) {
      this.isLoading = true
      //let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt }
        this.vehiculos = []
        await this.$store
          .dispatch('vehiculo/fetchVehiculos', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.vehiculos = response.data
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
    //Obtiene las marcas de vehiculos
    async obtenerMarcas(jwt) {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=MARCAVEH&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.marcas = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.marcas = response.data
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
    //Obtiene las marcas de vehiculos
    async obtenerTipoVehiculo(jwt) {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=TIPVEH&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.tipoVehiculo = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.tipoVehiculo = response.data
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
    //Obtiene Todas las Empleados
    async obtenerEmpleado(jwt) {
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=emp_activo&tipo1=igual&valor1=1'

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.empleado = []
        await this.$store
          .dispatch('empleado/fetchEmpleado', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.empleado = response.data
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
      this.editedIndex = this.vehiculos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.veh_activo = this.editedItem.veh_activo == 1 ? true : false
      this.dialog = true
    },
    // Eliminar Tipo
    deleteItem(item) {
      const index = this.clastipos.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.clastipos.splice(index, 1)
      this.Borrar(item.clatip_id)
    },
    //Borrar en BD es desActivar
    async Borrar(index) {
      this.overlay = true
      this.$v.$touch()

      let body = {
        veh_id: index,
        veh_activo: 0,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('vehiculo/deleteVehiculos', payload)
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
      Object.assign(this.clastipos[this.editedIndex], this.editedItem)
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
        let marca = ''
        if (this.editedItem.veh_marca_id.tipo_clave == null) {
          marca = this.editedItem.veh_marca_id
        } else {
          marca = this.editedItem.veh_marca_id.tipo_clave
        }
        let tipo = ''
        if (this.editedItem.veh_tipo_id.tipo_clave == null) {
          tipo = this.editedItem.veh_tipo_id
        } else {
          tipo = this.editedItem.veh_tipo_id.tipo_clave
        }
        let empleado = 0
        if (this.editedItem.veh_emp_id.emp_codigo == null) {
          empleado = this.editedItem.veh_emp_id
        } else {
          empleado = this.editedItem.veh_emp_id.emp_codigo
        }

        let body = {
          veh_id: this.editedItem.veh_id,
          veh_modelo: this.editedItem.veh_modelo,
          veh_marca_id: marca,
          veh_anio: this.editedItem.veh_anio,
          veh_placas: this.editedItem.veh_placas,
          veh_tipo_id: tipo,
          veh_emp_id: empleado,
          veh_activo: this.editedItem.veh_activo == true ? 1 : 0,
          veh_propiedad_de: this.editedItem.veh_propiedad_de,
        }
        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.editedIndex > -1) {
          payload.id = this.editedItem.veh_id
          console.log(payload.id)
          await this.$store
            .dispatch('vehiculo/editVehiculos', payload)
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
          Object.assign(this.vehiculos[this.editedIndex], this.editedItem)
        } else {
          await this.$store
            .dispatch('vehiculo/addVehiculos', payload)
            .then((response) => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se creó con éxito',
              })
              this.vehiculos.push(response.data)
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
        //await this.obtenerClasTipos(jwt)
        await this.iniciando()
      }
    },
    // Evalua el caracter para saber si es una letra
    isLetter: function (e) {
      let char = String.fromCharCode(e.keyCode)
      if (/^[a-zA-Z\u00C0-\u00FF ]*$/.test(char)) return true
      else e.preventDefault()
    },
  },
}
</script>
