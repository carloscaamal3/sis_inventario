<template>
  <v-container id="data-tables" tag="section">
    <base-material-card color="blue" icon="mdi-cog-transfer" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading></template>

      <!-- Boton de Nuevo Permiso -->
      <template v-slot:corner-button>
        <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog = true"
          >Nuevo Permiso</v-btn
        >
      </template>

      <!-- OJO ACTIVAR LUEGO-->
      <!-- <v-overlay :value="overlay">
        <v-progress-circular :size="50" color="green" indeterminate></v-progress-circular>
      </v-overlay> -->

      <!-- Texto de Busqueda -->
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
      <ConfirmationDialog
        v-model="isSure"
        @click="cancel"
        :width="420"
        title="¡Se perderan todos los cambios!"
        text="Seguro quiere cancelar?"
        buttonColor1="red"
        buttonText1="NO"
        buttonColor2="blue"
        buttonText2="SI"
      />
      <!-- Termina Dialogo Cancelar -->

      <!-- Empieza Dialogo Nuevo o Editar-->
      <v-dialog v-model="dialog" max-width="500px" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <!-- Campos a Editar o Crear -->
                <!-- Campo PERMISO -->
                <v-col cols="12">
                  <v-text-field
                    v-model="$v.editedItem.permiso.$model"
                    label="permiso*"
                    required
                    :error-messages="permisoErrors"
                    @input="$v.editedItem.permiso.$reset(), (changed = true)"
                    @blur="$v.editedItem.permiso.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo DESCRIPCION -->
                <v-col cols="12">
                  <v-text-field
                    v-model="$v.editedItem.descripcion.$model"
                    label="Descripción*"
                    counter="50"
                    required
                    :error-messages="descripcionErrors"
                    @input="$v.editedItem.descripcion.$reset(), (changed = true)"
                    @blur="$v.editedItem.descripcion.$touch()"
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
            <v-btn color="blue darken-1" text @click="save" :disabled="$v.$invalid">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Termina Dialogo -->

      <!-- Aqui va progress linear -->
      <v-divider class="mt-3" />
      <!-- Inicia Tabla de Permisos -->
      <v-data-table
        :headers="headers"
        :items="permisos"
        dense
        :search.sync="search"
        :loading="isLoading"
        loading-text="Cargando... Espere por favor"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>

        <!-- Creo el boton de Activo-->
        <template v-slot:item.activo="{ item }">
          <Status :activo="item.activo" />
        </template>

        <template v-slot:no-data>
          <!-- <v-btn color="primary">Reset</v-btn> -->
          ¡No hay datos para mostrar!
        </template>
      </v-data-table>
      <!-- Termina Tabla de Permisos -->
      <!-- Empieza DataExporter -->
      <DataExporter :dataArray="permisos" :dataFields="fields" fileName="Permisos" />
      <!-- Termina DataExporter -->

    </base-material-card>
  </v-container>
</template>

<script>
import Status from '@/components/general/StatusInfo.vue'
import { validationMixin } from 'vuelidate'
import { getValidToken } from '@/store/helpers.js'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
import DataExporter from '@/components/general/DataExporter.vue'
export default {
  components: {
    Status,
    ConfirmationDialog,
    DataExporter,
  },
  data: () => ({
    search: undefined,
    isLoading: false,
    isSure: false,
    dialog: false,
    isEditing: false,
    checkbox: false,
    overlay: false,
    headers: [
      { text: 'Permiso', align: 'start', sortable: false, value: 'permiso' },
      { text: 'Descripción', value: 'descripcion' },
      { text: 'Activo', value: 'activo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    permisos: [],
    editedIndex: -1,
    editedItem: {
      _id: '',
      activo: true,
      descripcion: '',
      permiso: '',
    },
    defaultItem: {
      _id: '',
      activo: true,
      descripcion: '',
      permiso: '',
    },
    fields: {
      Permiso: 'permiso',
      Descripción: 'descripcion',
      Activo: 'activo',
    },
  }),
  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      permiso: { required, minLength: minLength(3), maxLength: maxLength(20) },
      descripcion: { required, minLength: minLength(3), maxLength: maxLength(50) },
    },
  },
  computed: {
    //Titulo del Modal si es Nuevo o Editar
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Permiso' : 'Editar Permiso'
    },
    permisoErrors() {
      const errors = []
      if (!this.$v.editedItem.permiso.$dirty) return errors
      !this.$v.editedItem.permiso.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.permiso.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.permiso.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    descripcionErrors() {
      const errors = []
      if (!this.$v.editedItem.descripcion.$dirty) return errors
      !this.$v.editedItem.descripcion.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.descripcion.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.descripcion.maxLength &&
        errors.push('Este campo debe de tener un máximo de 50 caracteres.')
      return errors
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  created() {
    this.iniciando()
  },
  methods: {
    //Refresca Datos para la tabla
    async iniciando() {
      let jwt = await getValidToken(this)
      this.obtenerPermisos(jwt)
    },
    //Obtiene Todos los Permisos para la tabla
    async obtenerPermisos(jwt) {
      this.isLoading = true
      //let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt }
        this.$store
          .dispatch('permit/fetchPermits', payload)
          .then((response) => {
            this.permisos = response.data
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
    // Editar Permiso
    editItem(item) {
      this.isEditing = true
      this.editedIndex = this.permisos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    // Eliminar Permiso
    deleteItem(item) {
      const index = this.permisos.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.permisos.splice(index, 1)
      //this.BorrarPermiso()
    },
    //Borrar en BD no funciona por el momento
    async BorrarPermiso() {
      this.overlay = true
      this.$v.$touch()

      let body = {
        _id: this.editedItem._id,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = this.editedItem._id
      this.$store
        .dispatch('permit/deleteImageService', payload)
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
      Object.assign(this.permisos[this.editedIndex], this.editedItem)
    },
    // Guardar el formulario
    async save() {
      this.overlay = true
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let body = {
          _id: this.editedItem._id,
          permiso: this.editedItem.permiso,
          descripcion: this.editedItem.descripcion,
          activo: true,
        }
        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.editedIndex > -1) {
          payload.id = this.editedItem._id
          this.$store
            .dispatch('permit/editPermit', payload)
            .then(() => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se actualizo con éxito',
              })
              this.obtenerPermisos(jwt)
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
          Object.assign(this.permisos[this.editedIndex], this.editedItem)
        } else {
          this.$store
            .dispatch('permit/addPermit', payload)
            .then((response) => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se creó con éxito',
              })
              this.permisos.push(response.data)
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
        //this.iniciando()
        //this.obtenerPermisos(jwt)
        this.close((this.checkbox = true))
      }
    },
    //Implementacion de ConfirmationDialog
    //Revisar si hay cambios en el formulario
    checkChanges() {
      if (this.changed) {
        this.isSure = true
      } else {
        this.close(false)
        this.changed = false
      }
    },
    //confirmcacion de cancelacion
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
  },
}
</script>

<style></style>
