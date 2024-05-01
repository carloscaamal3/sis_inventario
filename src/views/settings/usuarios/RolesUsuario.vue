<template>
  <v-container id="data-tables" tag="section">
    <base-material-card color="blue" icon="mdi-account-multiple-plus" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading></template>
      <template v-slot:corner-button>
        <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog = true"
          >Nuevo Rol de Usuario</v-btn
        >
      </template>

      <v-overlay :value="overlay">
        <v-progress-circular :size="50" color="green" indeterminate></v-progress-circular>
      </v-overlay>

      <!-- Textfield para la barra de busqueda -->
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        label="Búsqueda"
        hide-details
        single-line
        style="max-width: 250px"
      />
      <!-- Termina textfield para la barra de busqueda -->

      <!-- Empieza dialogo cancelar -->
      <ConfirmationDialog v-model="isSure" @click="close" />
      <!-- Termina dialogo cancelar -->

      <!-- Empieza Dialogo de edicion o creacion de un item (ROL DE USUARIO)-->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <!-- Campo Rol -->
                <v-col cols="12">
                  <v-text-field
                    maxlength="20"
                    v-model="$v.editedItem.rol.$model"
                    label="Rol*"
                    required
                    :error-messages="rolErrors"
                    @input="$v.editedItem.rol.$reset()"
                    @blur="$v.editedItem.rol.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Termina campo Rol -->

                <!-- Campo Descripcion del Rol -->
                <v-col cols="12">
                  <v-text-field
                    maxlength="50"
                    v-model="$v.editedItem.descripcion.$model"
                    label="Descripción*"
                    required
                    :error-messages="descripcionErrors"
                    @input="$v.editedItem.descripcion.$reset()"
                    @blur="$v.editedItem.descripcion.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Termina Descripcion del Rol -->
              </v-row>
            </v-container>
            <small>*Campo obligatorio</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-checkbox v-model="checkbox" label="Crear otro" :disabled="isEditing"></v-checkbox>
            <!-- Botones de guardar y cancelar -->
            <v-btn color="red darken-1" text @click="isSure = true">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled="$v.$invalid">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Termina Dialogo de edicion o creacion de un item (ROL DE USUARIO) -->
      <v-divider class="mt-3" />
      <!-- Tabla de datos del modulo (ROL DE USUARIO)-->
      <v-data-table
        :headers="headers"
        :items="roles"
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
        <template v-slot:no-data>¡No hay datos para mostrar!</template>
      </v-data-table>
      <!-- Termina tabla de datos del modulo (ROL DE USUARIO)-->
    </base-material-card>
  </v-container>
</template>

<script>
import Status from '@/components/general/StatusInfo.vue'
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  components: {
    ConfirmationDialog,
    Status,
  },
  data: () => ({
    search: undefined,
    isLoading: false,
    checkbox: false,
    isEditing: false,
    dialog: false,
    isSure: false,
    overlay: false,
    headers: [
      {
        text: 'Rol de Usuario',
        align: 'start',
        sortable: false,
        value: 'rol',
      },
      { text: 'Descripción', value: 'descripcion' },
      { text: 'Activo', value: 'activo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    value: [],
    roles: [],
    editedIndex: -1,
    editedItem: {
      rol: '',
      descripcion: '',
      activo: true,
    },
    defaultItem: {
      rol: '',
      descripcion: '',
      activo: true,
    },
  }),

  mixins: [validationMixin],
  validations: {
    editedItem: {
      rol: { required, minLength: minLength(3), maxLength: maxLength(20) },
      descripcion: { required, minLength: minLength(3), maxLength: maxLength(50) },
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Rol de Usuario' : 'Editar Rol de Usuario'
    },

    // Errores del campo rol en el formulario
    rolErrors() {
      const errors = []
      if (!this.$v.editedItem.rol.$dirty) return errors
      !this.$v.editedItem.rol.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.rol.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.rol.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    // Errores del campo Descripcion en el formulario
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
  //1ero
  created() {
    this.obtenerRoles()
  },

  methods: {
    // Obtiene ROL DE USUARIO
    async obtenerRoles() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt }
        this.$store
          .dispatch('userRole/fetchUserRole', payload)
          .then((response) => {
            this.roles = response.data
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

    // Editar ROL DE USUARIO
    editItem(item) {
      this.isEditing = true
      this.editedIndex = this.roles.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    // Eliminar ROL DE USUARIO
    deleteItem(item) {
      const index = this.roles.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.grupos.splice(index, 1)
    },

    // Cerrar el formulario
    close(checkbox) {
      this.isSure = false
      this.checkbox = checkbox
      if (this.checkbox) {
        this.dialog = false
        this.isEditing = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
        this.$v.$reset()
      }
    },

    // Guardar el formulario
    async save() {
      this.overlay = true
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let body = {
          rol: this.editedItem.rol,
          descripcion: this.editedItem.descripcion,
        }
        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.editedIndex > -1) {
          payload.id = this.editedItem._id
          this.$store
            .dispatch('userRole/editUserRole', payload)
            .then(() => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se actualizó con éxito',
              })
              this.overlay = false
            })
            .catch((err) => {
              this.$store.commit('ALERT', {
                color: 'error',
                text: err.response.data.msg,
              })
              this.overlay = false
            })
          Object.assign(this.roles[this.editedIndex], this.editedItem)
        } else {
          this.$store
            .dispatch('userRole/addUserRole', payload)
            .then((response) => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se creó con éxito',
              })
              this.roles.push(response.data)
              this.overlay = false
            })
            .catch((err) => {
              this.$store.commit('ALERT', {
                color: 'error',
                text: err.response.data.msg,
              })
              this.overlay = false
            })
        }
        this.close((this.checkbox = true))
      }
    },
  },
}
</script>
