<template>
  <v-container id="data-tables" tag="section">
    <base-material-card color="blue" icon="mdi-account-multiple" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading></template>
      <template v-slot:corner-button>
        <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog = true"
          >Nuevo Grupo</v-btn
        >
      </template>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        label="Búsqueda"
        hide-details
        single-line
        style="max-width: 250px;"
      />
      <!-- Empieza Dialogo -->
      <v-dialog v-model="dialog" max-width="500px">
        <!-- <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
        </template> -->
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.grupo"
                    label="Grupo*"
                    dense
                    required
                    :error-messages="grupoErrors"
                    @input="$v.editedItem.grupo.$reset()"
                    @blur="$v.editedItem.grupo.$touch()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.descripcion"
                    label="Descripción*"
                    dense
                    required
                    :error-messages="descripcionErrors"
                    @input="$v.editedItem.descripcion.$reset()"
                    @blur="$v.editedItem.descripcion.$touch()"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="editedItem.usuarios"
                    label="Usuarios*"
                    dense
                    required
                    :error-messages="usuariosErrors"
                    @input="$v.editedItem.usuarios.$reset()"
                    @blur="$v.editedItem.usuarios.$touch()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <!-- <v-text-field v-model="editedItem.permisos" label="Permisos"></v-text-field> -->
                  <v-select
                    v-model="editedItem.permisos"
                    :items="permisos"
                    :menu-props="{ top: true, offsetY: true }"
                    small-chips
                    label="Permisos"
                    multiple
                    hint="Seleciona permiso(s)"
                    persistent-hint
                  >
                    <template #selection="{ item, parent }">
                      <v-chip color="blue" text-color="white" label small
                        ><span class="pr-2"> {{ item }}</span>
                        <v-icon x-small @click="parent.selectItem(item)">mdi-close</v-icon>
                      </v-chip>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled="$v.$invalid">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Termina Dialogo -->
      <!-- Aqui va progress linear -->
      <v-progress-linear :active="isLoading" :indeterminate="isLoading" color="green" />
      <v-divider class="mt-3" />
      <!-- <v-data-table :headers="headers" :items="desserts" sort-by="calories"></v-data-table> -->
      <v-data-table :headers="headers" :items="grupos" :search.sync="search">
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-account-multiple-plus
          </v-icon>
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:item.permisos="{ item }">
          <!-- <v-chip class="ma-2" label x-small color="blue" text-color="white">
            {{ item.permisos }}
          </v-chip> -->
          <Tags :tags="item.permisos" />
        </template>
        <template v-slot:no-data>
          <!-- <v-btn color="primary">Reset</v-btn> -->
          ¡No hay datos para mostrar!
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
import Tags from '@/components/general/Tags.vue'
import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  components: {
    Tags,
  },
  data: () => ({
    search: undefined,
    isLoading: false,
    dialog: false,
    headers: [
      { text: 'Grupo', align: 'start', sortable: false, value: 'grupo' },
      { text: 'Descripción', value: 'descripcion' },
      { text: 'Usuarios', value: 'usuarios' },
      { text: 'Permisos', value: 'permisos' },
      { text: 'Fechas', value: 'fechas.creado' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    // permisos: ['Admin', 'Admin Ventas', 'Admin Almacén', 'Usr Ventas', 'Usr Almacén'],
    // value:['Admin', 'Admin Ventas', 'Admin Almacén', 'Usr Ventas', 'Usr Almacén'],
    permisos: ['Traslados', 'Tours', 'Circuitos', 'Inventario'],
    value: [],
    grupos: [],
    editedIndex: -1,
    editedItem: {
      grupo: '',
      descripcion: '',
      usuarios: '',
      permisos: [],
      fechas: { creado: '' },
    },
    defaultItem: {
      grupo: '',
      descripcion: '',
      usuarios: '',
      permisos: [],
      fechas: { creado: '' },
    },
  }),

  mixins: [validationMixin],
  validations: {
    editedItem: {
      grupo: { required, minLength: minLength(3), maxLength: maxLength(20) },
      descripcion: { required, minLength: minLength(3), maxLength: maxLength(50) },
      usuarios: { required, minLength: minLength(3), maxLength: maxLength(24) },
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Grupo' : 'Editar Grupo'
    },
    grupoErrors() {
      const errors = []
      if (!this.$v.editedItem.grupo.$dirty) return errors
      !this.$v.editedItem.grupo.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.grupo.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.grupo.maxLength &&
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
    usuariosErrors() {
      const errors = []
      if (!this.$v.editedItem.usuarios.$dirty) return errors
      !this.$v.editedItem.usuarios.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.usuarios.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.usuarios.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    this.obtenerGrupos()
  },

  methods: {
    // Obtiene los grupos
    async obtenerGrupos() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.$store
          .dispatch('group/fetchGroups', jwt)
          .then((response) => {
            this.grupos = response.data
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

    // Editar Grupo
    editItem(item) {
      this.editedIndex = this.grupos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    // Eliminar Grupo
    deleteItem(item) {
      const index = this.grupos.indexOf(item)
      confirm('Esta seguro que quiere eliminar este registro?') && this.grupos.splice(index, 1)
    },

    // Cerrar el formulario
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$v.$reset()
    },

    // Guardar el formulario
    async save() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let body = {
          grupo: this.editedItem.grupo,
          descripcion: this.editedItem.descripcion,
          usuarios: this.editedItem.usuarios,
          permisos: this.editedItem.permisos,
        }
        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.editedIndex > -1) {
          payload.id = this.editedItem._id
          this.$store
            .dispatch('group/editGroup', payload)
            .then(() => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro fue actualizado con éxito',
              })
            })
            .catch((err) => {
              this.$store.commit('ALERT', {
                color: 'error',
                text: err.response.data.error,
                // Enviar a inicio de sesión
              })
            })
          Object.assign(this.grupos[this.editedIndex], this.editedItem)
        } else {
          this.$store
            .dispatch('group/addGroup', payload)
            .then((response) => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se creo con éxito',
              })
              this.grupos.push(response.data)
            })
            .catch((err) => {
              this.$store.commit('ALERT', {
                color: 'error',
                text: err.response.data.errores,
                // Enviar a inicio de sesion
              })
            })
        }
        this.close()
      }
    },
    addUsersToGroup() {
      console.log('Agregar usuarios al grupo')
    },
  },
}
</script>
