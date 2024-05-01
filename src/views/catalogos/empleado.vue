<template>
  <v-container id="data-tables" tag="section">
    <base-material-card color="blue" icon="mdi-account-supervisor" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading></template>
      <!-- Texto del boton NUEVO -->
      <template v-slot:corner-button>
        <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog = true"
          >Nuevo Empleado</v-btn
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
                <!-- Campo CODIGO -->
                <v-col cols="2">
                  <v-text-field
                    v-model="$v.editedItem.emp_codigo.$model"
                    label="Empleado"
                    counter="30"
                    @keypress="isLetter($event)"
                    :error-messages="emp_codigoErrors"
                    @input="$v.editedItem.emp_codigo.$reset(), (changed = true)"
                    @blur="$v.editedItem.emp_codigo.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo TITULO -->
                <v-col cols="2">
                  <v-text-field
                    v-model="editedItem.emp_titulo"
                    label="Titulo*"
                    counter="10"
                    required
                    @input="$v.editedItem.emp_titulo.$reset(), (changed = true)"
                    @blur="$v.editedItem.emp_titulo.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo NOMBRE -->
                <v-col cols="8">
                  <v-text-field
                    v-model="$v.editedItem.emp_nombre.$model"
                    label="Nombre*"
                    counter="255"
                    required
                    :error-messages="emp_nombreErrors"
                    @input="$v.editedItem.emp_nombre.$reset(), (changed = true)"
                    @blur="$v.editedItem.emp_nombre.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo PUESTO -->
                <v-col cols="12">
                  <v-text-field
                    v-model="$v.editedItem.emp_puesto.$model"
                    label="Nombre*"
                    counter="255"
                    required
                    :error-messages="emp_puestoErrors"
                    @input="$v.editedItem.emp_puesto.$reset(), (changed = true)"
                    @blur="$v.editedItem.emp_puesto.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo DEPARTAMENTO -->
                <v-col cols="12">
                  <v-text-field
                    v-model="$v.editedItem.emp_departamento.$model"
                    label="Nombre*"
                    counter="255"
                    required
                    :error-messages="emp_departamentoErrors"
                    @input="$v.editedItem.emp_departamento.$reset(), (changed = true)"
                    @blur="$v.editedItem.emp_departamento.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo DIRECTOR -->
                <v-col cols="2">
                  <v-text-field
                    v-model="$v.editedItem.emp_codigo_director.$model"
                    label="Director*"
                    counter="30"
                    required
                    :error-messages="emp_codigo_directorErrors"
                    @input="$v.editedItem.emp_codigo_director.$reset(), (changed = true)"
                    @blur="$v.editedItem.emp_codigo_director.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo DIRECCION -->
                <v-col cols="10">
                  <v-text-field
                    v-model="$v.editedItem.emp_direccion.$model"
                    label="Dirección*"
                    counter="40"
                    required
                    :error-messages="emp_direccionErrors"
                    @input="$v.editedItem.emp_direccion.$reset(), (changed = true)"
                    @blur="$v.editedItem.emp_direccion.$touch()"
                  ></v-text-field>
                </v-col>

                <!-- Campo ACTIVO -->
                <v-col cols="12">
                  <v-checkbox
                    v-model="editedItem.emp_activo"
                    :label="`Estatus: ${
                      editedItem.emp_activo.toString() == 'true' ? 'Activo' : 'Inactivo'
                    }`"
                    @input="$v.editedItem.emp_activo.$reset(), (changed = true)"
                    @blur="$v.editedItem.emp_activo.$touch()"
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
        :items="empleados"
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

        <template v-slot:[`item.info_emp`]="{ item }">
          <div class="name-info-title">{{ item.emp_puesto }}</div>
          <div class="mail-info-subtitle">{{ item.emp_departamento }}</div>
        </template>

        <!-- Creo el boton de Activo-->
        <template v-slot:item.emp_activo="{ item }">
          <Status :activostr="item.emp_activo" tipo="String" />
        </template>

        <template v-slot:no-data>
          <!-- <v-btn color="primary">Reset</v-btn> -->
          ¡No hay datos para mostrar!
        </template>
      </v-data-table>
      <!-- Termina Tabla de Clasificación de Tipos -->
      <!-- Empieza DataExporter -->
      <DataExporter :dataArray="empleados" :dataFields="fields" fileName="empleados" />
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
      { text: 'Empleado', align: 'start', value: 'emp_codigo' },
      { text: 'Nombre', value: 'emp_nombre' },
      { text: 'Puesto', value: 'info_emp' },
      { text: 'Direccion', value: 'emp_direccion' },
      { text: 'emp_activo', value: 'emp_activo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //
    value: [],
    empleados: [],
    editedIndex: -1,
    editedItem: {
      emp_id: 0,
      emp_codigo: '',
      emp_nombre: '',
      emp_puesto: '',
      emp_departamento: '',
      emp_codigo_director: '',
      emp_direccion: '',
      emp_titulo: '',
      emp_activo: true,
    },
    defaultItem: {
      emp_id: 0,
      emp_codigo: '',
      emp_nombre: '',
      emp_puesto: '',
      emp_departamento: '',
      emp_codigo_director: '',
      emp_direccion: '',
      emp_titulo: '',
      emp_activo: true,
    },
    //Para Exportar
    fields: {
      Empleado: 'emp_codigo',
      Nombre: 'emp_nombre',
      Puesto: 'emp_puesto',
      Departamento: 'emp_departamento',
      Direccion: 'emp_direccion',
      Activo: 'emp_activo',
    },
  }),

  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      emp_codigo: { required, minLength: minLength(3), maxLength: maxLength(30) },
      emp_nombre: { required, minLength: minLength(3), maxLength: maxLength(255) },
      emp_puesto: { required, minLength: minLength(3), maxLength: maxLength(100) },
      emp_departamento: { required, minLength: minLength(3), maxLength: maxLength(100) },
      emp_codigo_director: { required, minLength: minLength(3), maxLength: maxLength(30) },
      emp_direccion: { required, minLength: minLength(3), maxLength: maxLength(100) },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Empleado' : 'Editar Empleado'
    },
    emp_codigoErrors() {
      const errors = []
      if (!this.$v.editedItem.emp_codigo.$dirty) return errors
      !this.$v.editedItem.emp_codigo.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.emp_codigo.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.emp_codigo.maxLength &&
        errors.push('Este campo debe de tener un máximo de 30 caracteres.')
      return errors
    },
    emp_nombreErrors() {
      const errors = []
      if (!this.$v.editedItem.emp_nombre.$dirty) return errors
      !this.$v.editedItem.emp_nombre.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.emp_nombre.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.emp_nombre.maxLength &&
        errors.push('Este campo debe de tener un máximo de 255 caracteres.')
      return errors
    },
    emp_puestoErrors() {
      const errors = []
      if (!this.$v.editedItem.emp_puesto.$dirty) return errors
      !this.$v.editedItem.emp_puesto.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.emp_puesto.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.emp_puesto.maxLength &&
        errors.push('Este campo debe de tener un máximo de 40 caracteres.')
      return errors
    },
    emp_departamentoErrors() {
      const errors = []
      if (!this.$v.editedItem.emp_departamento.$dirty) return errors
      !this.$v.editedItem.emp_departamento.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.emp_departamento.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.emp_departamento.maxLength &&
        errors.push('Este campo debe de tener un máximo de 40 caracteres.')
      return errors
    },
    emp_codigo_directorErrors() {
      const errors = []
      if (!this.$v.editedItem.emp_codigo_director.$dirty) return errors
      !this.$v.editedItem.emp_codigo_director.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.emp_codigo_director.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.emp_codigo_director.maxLength &&
        errors.push('Este campo debe de tener un máximo de 30 caracteres.')
      return errors
    },
    emp_direccionErrors() {
      const errors = []
      if (!this.$v.editedItem.emp_direccion.$dirty) return errors
      !this.$v.editedItem.emp_direccion.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.emp_direccion.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.emp_direccion.maxLength &&
        errors.push('Este campo debe de tener un máximo de 40 caracteres.')
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
      await this.obtenerEmpleados(jwt)
    },
    //Obtiene Todas las Clasificacion de Tipos para la tabla
    async obtenerEmpleados(jwt) {
      this.isLoading = true
      //let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt }
        this.empleados = []
        await this.$store
          .dispatch('empleado/fetchEmpleado', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.empleados = response.data
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
      this.editedIndex = this.empleados.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.emp_activo = this.editedItem.emp_activo == 1 ? true : false
      this.dialog = true
    },
    // Eliminar Tipo
    deleteItem(item) {
      const index = this.empleados.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.empleados.splice(index, 1)
      this.Borrar(item.emp_id)
    },
    //Borrar en BD es desActivar
    async Borrar(index) {
      this.overlay = true
      this.$v.$touch()

      let body = {
        clatiemp_idp_id: index,
        emp_activo: 0,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('empleado/deleteEmpleado', payload)
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
      Object.assign(this.empleados[this.editedIndex], this.editedItem)
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
        let body = {
          emp_codigo: this.editedItem.emp_codigo,
          emp_nombre: this.editedItem.emp_nombre,
          emp_puesto: this.editedItem.emp_puesto,
          emp_departamento: this.editedItem.emp_departamento,
          emp_codigo_director: this.editedItem.emp_codigo_director,
          emp_direccion: this.editedItem.emp_direccion,
          emp_titulo: this.editedItem.emp_titulo,
          emp_activo: this.editedItem.emp_activo == true ? 1 : 0,
        }
        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.editedIndex > -1) {
          payload.id = this.editedItem.emp_id
          console.log(payload.id)
          await this.$store
            .dispatch('empleado/editEmpleado', payload)
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
          Object.assign(this.empleados[this.editedIndex], this.editedItem)
        } else {
          await this.$store
            .dispatch('empleado/addEmpleado', payload)
            .then((response) => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se creó con éxito',
              })
              this.empleados.push(response.data)
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
        await this.obtenerEmpleados(jwt)
      }
    },
  },
}
</script>
