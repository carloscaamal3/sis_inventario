<template>
  <v-container id="data-tables" tag="section">
    <!-- <base-v-component heading="Data Tables" link="components/data-tables" /> -->

    <base-material-card color="blue" icon="mdi-account" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading> </template>
      <template v-slot:corner-button>
        <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog = true"
          >Nuevo Usuario</v-btn
        >
        <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog2 = true">
          <!-- <v-icon left x-small> mdi-email </v-icon> -->
          Invitar Usuario
        </v-btn>
      </template>

      <v-overlay :value="overlay">
        <v-progress-circular :size="50" color="green" indeterminate></v-progress-circular>
      </v-overlay>
      <!-- Textfield para la barra de Búsqueda -->
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        label="Búsqueda"
        hide-details
        single-line
        style="max-width: 250px"
      />
      <!-- Termina extfield para la barra de Búsqueda -->

      <!-- Empieza dialogo cancelar -->
      <ConfirmationDialog v-model="isSure" @click="cancel" />
      <!-- Termina dialogo cancelarº -->

      <!-- Empieza Dialogo nuevo usuario persistent -->
      <v-dialog v-model="dialog" max-width="500" max-height="450" persistent>
        <v-card inline title="Usuarios" class="px-2 py-2">
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-form v-model="valid">
            <!-- <v-container> -->
            <v-col>
              <!-- Nombre(s) del Usuario -->
              <v-row cols="6" md="4">
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.usr_nombre.$model"
                    dense
                    maxlength="20"
                    label="Nombre(s)*"
                    required
                    :error-messages="firstNameErrors"
                    @input="$v.editedItem.nombre.$reset(), (changed = true)"
                    @blur="$v.editedItem.nombre.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Apellidos del Usuario -->
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.apellidos.$model"
                    dense
                    maxlength="20"
                    label="Apellido(s)*"
                    required
                    :error-messages="lastNameErrors"
                    @input="$v.editedItem.apellidos.$reset(), (changed = true)"
                    @blur="$v.editedItem.apellidos.$touch()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Correo del Usuario -->
              <v-row cols="6" md="4">
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.correo.$model"
                    dense
                    label="Correo Electrónico*"
                    required
                    :error-messages="emailErrors"
                    @input="$v.editedItem.correo.$reset(), (changed = true)"
                    @blur="$v.editedItem.correo.$touch()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- <v-row cols="6" md="4">
                <v-checkbox label="Establecer contraseña" v-model="isPassword" />
              </v-row> -->
              <!-- Contraseña del usuario -->
              <v-row cols="6" md="4">
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.password.$model"
                    dense
                    label="Contraseña"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    :counter="15"
                    :error-messages="passwordErrors"
                    @click:append.prevent="show = !show"
                    @input="$v.editedItem.password.$reset(), (changed = true)"
                    @blur="$v.editedItem.password.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Confirmación de contraseña del usuario -->
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.repassword.$model"
                    dense
                    label="Confirmar Contraseña"
                    :append-icon="reShow ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="reShow ? 'text' : 'password'"
                    :counter="15"
                    :error-messages="rePasswordErrors"
                    @click:append.prevent="reShow = !reShow"
                    @input="$v.editedItem.repassword.$reset(), (changed = true)"
                    @blur="$v.editedItem.repassword.$touch()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <div class="body-2 font-weight-thin">*Campo Obligatorio</div>
            <!-- </v-container> -->
          </v-form>
          <!-- Botones y checkList -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-checkbox v-model="checkbox" label="Crear otro"></v-checkbox>
            <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="saveForm" :disabled="$v.$invalid"
              >Guardar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Termina Dialogo nuevo usuario-->

      <!-- Empieza Dialogo2 invitar usuario persistent -->
      <v-dialog v-model="dialog2" max-width="500" max-height="450" persistent>
        <v-card inline title="Usuarios" class="px-2 py-2">
          <v-card-title>
            <span class="headline">Invitar Usuario</span>
          </v-card-title>
          <v-form v-model="valid">
            <!-- <v-container> -->
            <!-- Correo electrónico del usuario a invitar -->
            <v-col>
              <v-row cols="6" md="4">
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.correo.$model"
                    dense
                    label="Correo Electrónico*"
                    required
                    :error-messages="emailErrors"
                    @input="$v.editedItem.correo.$reset()"
                    @blur="$v.editedItem.correo.$touch()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- <v-row cols="6" md="4">
                <v-checkbox label="Establecer contraseña" v-model="isPassword" />
              </v-row>-->
            </v-col>
            <div class="body-2 font-weight-thin">*Campo Obligatorio</div>
            <!-- </v-container> -->
          </v-form>
          <!-- Botones -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="sendEmail"
              :disabled="$v.editedItem.correo.$invalid"
              >Aceptar</v-btn
            >
            <v-btn color="red darken-1" text @click="closeForm">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Termina Dialogo2 invitar usuario -->

      <v-divider class="mt-3" />
      <v-data-table
        :headers="headers"
        :items="usuarios"
        :search.sync="search"
        :sort-by="['nombre']"
        :sort-desc="[false]"
        :loading="isLoading"
        loading-text="Cargando... Espere por favor"
        multi-sort
      >
        <template v-slot:[`item.imagen`]="{ item }">
          <ThumborImage v-if="item.imagen" :imageUrl="item.imagen.avatar" :avatarSize="45" />
          <ThumborImage v-else />
        </template>
        <template v-slot:[`item.nombre`]="{ item }">
          <UserInfo :nombre="item.nombre" :apellidos="item.apellidos" :correo="item.correo" />
        </template>
        <template v-slot:[`item.contacto`]="{ item }">
          <ContactInfo :tel="item.contacto.telefono" :cel="item.contacto.celular" />
        </template>
        <template v-slot:[`item.login`]="{ item }">
          <SessionInfo :loginTimes="item.login.loginTimes" :lastLogin="item.login.lastLogin" />
        </template>
        <!-- <template #item.login_times="{item}"> <b>Conexiones:</b> {{ item.login_times }} </template> -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-5" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { getValidToken } from '@/store/helpers.js'
import { required, minLength, maxLength, email, sameAs } from 'vuelidate/lib/validators'
import SessionInfo from '@/components/general/SessionInfo.vue'
import UserInfo from '@/components/general/UserInfo.vue'
import ContactInfo from '@/components/general/ContactInfo.vue'
import ThumborImage from '@/components/general/ThumborImage.vue'
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'

const checkPassword = (value) => {
  if (!value) {
    return true
  }
  if (String(value).length < 6 || String(value).length > 16) {
    return false
  }
  return true
}

const oneNumber = (value) => {
  if (value != '') {
    return /[0-9]/.test(value)
  } else {
    return true
  }
}

const oneUpperCase = (value) => {
  if (value != '') {
    return /[A-Z]/.test(value)
  } else {
    return true
  }
}

const oneLowerCase = (value) => {
  if (value != '') {
    return /[a-z]/.test(value)
  } else {
    return true
  }
}

// const noWhitespace = (value) => value.indexOf(' ') === -1

export default {
  name: 'DashboardDataTables',

  components: {
    SessionInfo,
    UserInfo,
    ContactInfo,
    ThumborImage,
    ConfirmationDialog,
  },
  data: () => ({
    search: undefined,
    valid: false,
    isLoading: false,
    checkbox: false,
    dialog: false,
    dialog2: false,
    isSure: false,
    show: false,
    reShow: false,
    isPassword: false,
    overlay: false,
    changed: false,
    headers: [
      { text: 'Nombre', align: 'start', sortable: false, value: 'usr_nombre' },
      { text: 'Contacto', value: 'contacto' },
      { text: 'Datos de inicio de sesión', value: 'login' },
      { sortable: false, text: 'Actions', value: 'actions' },
    ],
    usuarios: [],
    editedIndex: -1,
    editedItem: {
      usr_id: '',
      usr_nombre: '',
      usr_correo: '',
      usr_telefono: '',
      password: '',
      login: '',
      repassword: '',
    },
    defaultItem: {
      usr_id: '',
      usr_nombre: '',
      usr_correo: '',
      usr_telefono: '',
      password: '',
      login: '',
      repassword: '',
    },
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      nombre: { required, minLength: minLength(3), maxLength: maxLength(20) },
      apellidos: { required, minLength: minLength(3), maxLength: maxLength(20) },
      correo: { required, email },
      password: {
        checkPassword,
        oneNumber,
        oneUpperCase,
        oneLowerCase,
      },
      repassword: {
        sameAsPassword: sameAs('password'),
      },
    },
  },
  watch: {
    dialog(val) {
      val || this.closeForm()
    },
    dialog2(val) {
      val || this.closeForm()
    },
  },

  created() {
    this.obtenerUsuarios()
  },
  methods: {
    // Obtiene todos los registros
    async obtenerUsuarios() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      console.log(jwt)
      if (jwt !== null) {
        this.$store
          .dispatch('user/fetchUsers', jwt)
          .then((response) => {
            this.usuarios = response.data
            this.isLoading = false
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    // Editar registro
    editItem(item) {
      this.editedIndex = this.usuarios.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.password = ''
      this.editedItem.repassword = ''
      this.dialog = true
    },
    // Eliminar registro
    deleteItem(item) {
      const index = this.usuarios.indexOf(item)
      confirm('Esta seguro que desea eliminar este registro?') && this.usuarios.splice(index, 1)
    },
    // Guardar contenido del formulario
    async saveForm() {
      this.overlay = true
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let body = {
          nombre: this.editedItem.nombre,
          apellidos: this.editedItem.apellidos,
          correo: this.editedItem.correo,
          contacto: this.editedItem.contacto,
        }
        if (this.editedItem.password !== '') {
          body.login = { password: this.editedItem.password }
        }

        if (this.editedIndex > -1) {
          // Edicion del registro
          let id = this.editedItem._id
          let jwt = await getValidToken(this)
          let payload = { jwt: jwt, id: id, body: body }
          this.$store
            .dispatch('user/editUser', payload)
            .then(() => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro fue actualizado con éxito',
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
          Object.assign(this.usuarios[this.editedIndex], this.editedItem)
        } else {
          // Registro nuevo
          // body.login = { password: this.editedItem.password }
          let jwt = await getValidToken(this)
          let payload = { jwt: jwt, body: body }
          await this.$store
            .dispatch('user/addUser', payload)
            .then((response) => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se creo con éxito',
              })
              // Aqui va el response.data
              // this.usuarios.push(this.editedItem)
              this.usuarios.push(response.data)
              this.overlay = false
            })
            .catch((err) => {
              this.$store.commit('ALERT', {
                color: 'error',
                text: err.response.data.errores,
              })
              this.overlay = false
            })
        }
        this.closeForm()
      }
    },
    // Invitar Nuevo Usuario (enviar email)
    async sendEmail() {
      this.overlay = true
      this.$v.$touch()
      if (!this.$v.editedItem.correo.$invalid) {
        let body = {
          correo: this.editedItem.correo,
        }
        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        this.$store
          .dispatch('user/inviteUser', payload)
          .then(() => {
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'Se ha enviado la invitación con éxito',
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
        this.closeForm()
      }
    },
    // Cerrar formulario
    closeForm(checkbox) {
      this.isSure = false
      this.checkbox = checkbox
      if (!this.checkbox) {
        this.dialog = false
        this.isEditing = false
      }
      this.dialog2 = false
      this.show = false
      this.reShow = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.clearForm()
      })
      this.$v.$reset()
    },
    // Limpiar formulario
    clearForm() {
      this.$v.$reset()
      ;(this.editedItem.usr_id = ''),
        (this.editedItem.nombre = ''),
        (this.editedItem.apellidos = ''),
        (this.editedItem.correo = ''),
        (this.editedItem.password = ''),
        (this.editedItem.repassword = '')
    },
    // Revisar si hay cambios en el formulario
    checkChanges() {
      if (this.changed) {
        this.isSure = true
      } else {
        this.closeForm(false)
        this.changed = false
      }
    },
    // Confirmar la cancelación
    cancel(isSure) {
      this.isSure = isSure
      if (this.isSure) {
        this.closeForm(false)
        this.changed = false
      }
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
    },
    firstNameErrors() {
      const errors = []
      if (!this.$v.editedItem.nombre.$dirty) return errors
      !this.$v.editedItem.nombre.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.nombre.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.nombre.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    lastNameErrors() {
      const errors = []
      if (!this.$v.editedItem.apellidos.$dirty) return errors
      !this.$v.editedItem.apellidos.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.apellidos.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.apellidos.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.editedItem.correo.$dirty) return errors
      !this.$v.editedItem.correo.email && errors.push('Debe ser un correo electrónico válido')
      !this.$v.editedItem.correo.required && errors.push('El correo electrónico es requerido')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.editedItem.password.$dirty) return errors
      !this.$v.editedItem.password.checkPassword &&
        errors.push('La contraseña debe de tener un mínimo de 6 caracteres y un máximo de 15.')
      !this.$v.editedItem.password.oneNumber &&
        errors.push('La contraseña debe de tener al menos un número')
      !this.$v.editedItem.password.oneUpperCase &&
        errors.push('La contraseña debe de tener al menos una letra mayúscula')
      !this.$v.editedItem.password.oneLowerCase &&
        errors.push('La contraseña debe de tener al menos una letra minúscula')
      return errors
    },
    rePasswordErrors() {
      const errors = []
      if (!this.$v.editedItem.repassword.$dirty) return errors
      !this.$v.editedItem.repassword.sameAsPassword && errors.push('La contraseña debe ser igual.')
      return errors
    },
  },
}
</script>
