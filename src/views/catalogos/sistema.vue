<template>
  <v-container id="data-tables" tag="section">
    <base-material-card color="blue" icon="mdi-cube-outline" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading></template>
      <!-- Texto del boton NUEVO -->
      <template v-slot:corner-button>
        <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog = true"
          >Nuevo Sistema</v-btn
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
                <!-- Campo NOMSISTEMA -->
                <v-col cols="12">
                  <v-text-field
                    v-model="$v.editedItem.sis_nomsistema.$model"
                    label="Sistema*"
                    counter="100"
                    required
                    :error-messages="sis_nomsistemaErrors"
                    @input="$v.editedItem.sis_nomsistema.$reset(), (changed = true)"
                    @blur="$v.editedItem.sis_nomsistema.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo SIGLAS -->
                <v-col cols="12">
                  <v-text-field
                    v-model="$v.editedItem.sis_siglas.$model"
                    label="Sistema*"
                    counter="100"
                    required
                    :error-messages="sis_siglasErrors"
                    @input="$v.editedItem.sis_siglas.$reset(), (changed = true)"
                    @blur="$v.editedItem.sis_siglas.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo ACTIVO -->
                <v-col cols="12">
                  <v-checkbox
                    v-model="editedItem.sis_activo"
                    :label="`Estatus: ${
                      editedItem.sis_activo.toString() == 'true' ? 'Activo' : 'Inactivo'
                    }`"
                    @input="$v.editedItem.sis_activo.$reset(), (changed = true)"
                    @blur="$v.editedItem.sis_activo.$touch()"
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
        :items="sistemas"
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
        <template v-slot:item.sis_activo="{ item }">
          <Status :activostr="item.sis_activo" tipo="String" />
        </template>

        <template v-slot:no-data>
          <!-- <v-btn color="primary">Reset</v-btn> -->
          ¡No hay datos para mostrar!
        </template>
      </v-data-table>
      <!-- Termina Tabla de Clasificación de Tipos -->
      <!-- Empieza DataExporter -->
      <DataExporter :dataArray="sistemas" :dataFields="fields" fileName="sistemas" />
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
      { text: 'Id', align: 'start', value: 'id_sistema' },
      { text: 'Sistema', value: 'sis_nomsistema' },
      { text: 'Siglas', value: 'sis_siglas' },
      { text: 'Activo', value: 'sis_activo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //
    value: [],
    sistemas: [],
    editedIndex: -1,
    editedItem: {
      id_sistema: '',
      sis_nomsistema: '',
      sis_activo: true,
    },
    defaultItem: {
      id_sistema: 0,
      sis_nomsistema: '',
      sis_siglas: '',
      sis_activo: true,
    },
    //Para Exportar
    fields: {
      Id_sistema: 'id_sistema',
      Sistema: 'sis_nomsistema',
      Siglas: 'sis_siglas',
      Activo: 'sis_activo',
    },
  }),

  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      sis_siglas: { required, minLength: minLength(3), maxLength: maxLength(10) },
      sis_nomsistema: { required, minLength: minLength(3), maxLength: maxLength(100) },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      return this.editedIndex === -1
        ? 'Nueva Clasificación de Tipo'
        : 'Editar Clasificación de Tipo'
    },
    sis_siglasErrors() {
      const errors = []
      if (!this.$v.editedItem.sis_siglas.$dirty) return errors
      !this.$v.editedItem.sis_siglas.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.sis_siglas.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.sis_siglas.maxLength &&
        errors.push('Este campo debe de tener un máximo de 6 caracteres.')
      return errors
    },
    sis_nomsistemaErrors() {
      const errors = []
      if (!this.$v.editedItem.sis_nomsistema.$dirty) return errors
      !this.$v.editedItem.sis_nomsistema.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.sis_nomsistema.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.sis_nomsistema.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
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
      await this.obtenerSistemas(jwt)
    },
    //Obtiene Todas las Clasificacion de Tipos para la tabla
    async obtenerSistemas(jwt) {
      this.isLoading = true
      //let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt }
        this.sistemas = []
        await this.$store
          .dispatch('sistema/fetchSistema', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.sistemas = response.data
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
      this.editedIndex = this.sistemas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.sis_activo = this.editedItem.sis_activo == 1 ? true : false
      this.dialog = true
    },
    // Eliminar Tipo
    deleteItem(item) {
      const index = this.sistemas.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.sistemas.splice(index, 1)
      this.Borrar(item.id_sistema)
    },
    //Borrar en BD es desActivar
    async Borrar(index) {
      this.overlay = true
      this.$v.$touch()

      let body = {
        id_sistema: index,
        sis_activo: 0,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('sistema/deleteSistema', payload)
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
      Object.assign(this.sistemas[this.editedIndex], this.editedItem)
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
          sis_nomsistema: this.editedItem.sis_nomsistema,
          sis_siglas: this.editedItem.sis_siglas,
          //tipo_activo: this.editedItem.tipo_activo,
          sis_activo: this.editedItem.sis_activo == true ? 1 : 0,
        }
        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.editedIndex > -1) {
          payload.id = this.editedItem.id_sistema
          console.log(payload.id)
          await this.$store
            .dispatch('sistema/editSistema', payload)
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
          Object.assign(this.sistemas[this.editedIndex], this.editedItem)
        } else {
          await this.$store
            .dispatch('sistema/addSistema', payload)
            .then((response) => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se creó con éxito',
              })
              this.sistemas.push(response.data)
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
        await this.obtenerSistemas(jwt)
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
