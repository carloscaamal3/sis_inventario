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
              <!-- login -->
              <v-row cols="6" md="4">
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.usr_login.$model"
                    dense
                    maxlength="100"
                    label="Login"
                    required
                    :disabled="isEditing"
                    :error-messages="LoginErrors"
                    @input="$v.editedItem.usr_login.$reset(), (changed = true)"
                    @blur="$v.editedItem.usr_login.$touch()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Nombre(s) del Usuario -->
              <v-row cols="6" md="4">
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.usr_nombres.$model"
                    dense
                    maxlength="255"
                    required
                    label="Nombre Completo*"
                    :error-messages="usr_nombresErrors"
                    @input="$v.editedItem.usr_nombres.$reset(), (changed = true)"
                    @blur="$v.editedItem.usr_nombres.$touch()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Correo del Usuario -->
              <v-row cols="6" md="4">
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.usr_correo.$model"
                    dense
                    label="Correo Electrónico*"
                    :error-messages="emailErrors"
                    @input="$v.editedItem.usr_correo.$reset(), (changed = true)"
                    @blur="$v.editedItem.usr_correo.$touch()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row cols="6" md="4">
                <v-col>
                  <v-select
                    v-model="$v.editedItem.usr_rol.$model"
                    :items="roles"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Rol de usuario*"
                    hint="Selecciona un Rol"
                    item-text="tipo_descripcion"
                    item-value="tipo_clave"
                    persistent-hint
                    dense
                    return-object
                    :error-messages="usr_rolErrors"
                    @input="changed = true"
                    @blur="$v.editedItem.usr_rol.$touch()"
                  >
                  </v-select>
                </v-col>
              </v-row>
              <v-row cols="6" md="4">
                <v-col>
                  <v-select
                    v-model="$v.editedItem.id_sistema.$model"
                    :items="sistemas"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Sistema*"
                    hint="Selecciona un Sistema"
                    :item-text="(item) => item.sis_nomsistema + ' ' + item.sis_nomsistema2"
                    item-value="id_sistema"
                    persistent-hint
                    dense
                    return-object
                    :error-messages="id_sistemaErrors"
                    @input="changed = true"
                    @blur="$v.editedItem.id_sistema.$touch()"
                  >
                  </v-select>
                </v-col>
              </v-row>
              <!-- <v-row cols="6" md="4">
                <v-checkbox label="Establecer contraseña" v-model="isPassword" />
              </v-row> -->
              <!-- Contraseña del usuario -->
              <v-row cols="6" md="4">
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.usr_pwd.$model"
                    dense
                    :disabled="isEditing"
                    label="Contraseña"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    :counter="15"
                    :error-messages="passwordErrors"
                    @click:append.prevent="show = !show"
                    @input="$v.editedItem.usr_pwd.$reset(), (changed = true)"
                    @blur="$v.editedItem.usr_pwd.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Confirmación de contraseña del usuario -->
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.repassword.$model"
                    dense
                    :disabled="isEditing"
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
                <!-- Campo ACTIVO -->
                <v-col cols="12">
                  <v-checkbox
                    v-model="editedItem.usr_activo"
                    :label="`Estatus: ${
                      editedItem.usr_activo.toString() == 'true' ? 'Activo' : 'Inactivo'
                    }`"
                    @input="$v.editedItem.usr_activo.$reset(), (changed = true)"
                    @blur="$v.editedItem.usr_activo.$touch()"
                  >
                  </v-checkbox>
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
                    v-model="$v.editedItem.usr_correo.$model"
                    dense
                    label="Correo Electrónico*"
                    required
                    :error-messages="emailErrors"
                    @input="$v.editedItem.usr_correo.$reset()"
                    @blur="$v.editedItem.usr_correo.$touch()"
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
              :disabled="$v.editedItem.usr_correo.$invalid"
              >Aceptar</v-btn
            >
            <v-btn color="red darken-1" text @click="closeForm">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Termina Dialogo2 invitar usuario -->

      <!-- Empieza el dialog de solo cambiar la contraseña-->
      <v-dialog v-model="dialogPwd" max-width="500" max-height="450" persistent>
        <v-card inline title="Usuarios" class="px-2 py-2">
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-form v-model="valid">
            <v-col>
              <!-- login -->
              <v-row cols="6" md="4">
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.usr_login.$model"
                    dense
                    maxlength="100"
                    label="Login"
                    required
                    :disabled="isEditing"
                    :error-messages="LoginErrors"
                    @input="$v.editedItem.usr_login.$reset(), (changed = true)"
                    @blur="$v.editedItem.usr_login.$touch()"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Contraseña del usuario -->
              <v-row cols="6" md="4">
                <v-col>
                  <v-text-field
                    v-model="$v.editedItem.usr_pwd.$model"
                    dense
                    label="Contraseña"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    :counter="15"
                    :error-messages="passwordErrors"
                    @click:append.prevent="show = !show"
                    @input="$v.editedItem.usr_pwd.$reset(), (changed = true)"
                    @blur="$v.editedItem.usr_pwd.$touch()"
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
          </v-form>
          <!-- Botones y checkList -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-checkbox v-model="checkbox" label="Crear otro"></v-checkbox>
            <v-btn color="red darken-1" text @click="checkChanges">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="changePassword" :disabled="$v.$invalid"
              >Guardar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Termina el dialog de solo cambiar la contraseña-->

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
        disable-pagination
        hide-default-footer
      >
        <template v-slot:item.usr_activo="{ item }">
          <Status :activostr="item.usr_activo.toString()" tipo="String" />
        </template>
        <template v-slot:[`item.login`]="{ item }">
          <SessionInfo :loginTimes="item.login_times" :lastLogin="item.last_login" />
        </template>
        <!-- <template #item.login_times="{item}"> <b>Conexiones:</b> {{ item.login_times }} </template> -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
          <v-icon small @click="passwordItem(item)">mdi-lock-plus</v-icon>
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
import ConfirmationDialog from '@/components/general/ConfirmationDialog.vue'
import Status from '@/components/general/StatusInfo.vue'

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
    ConfirmationDialog,
    Status,
  },
  data: () => ({
    search: undefined,
    valid: false,
    isLoading: false,
    isEditing: false,
    checkbox: false,
    dialog: false,
    dialog2: false,
    dialogPwd: false,
    isSure: false,
    show: false,
    reShow: false,
    isPassword: false,
    overlay: false,
    changed: false,
    headers: [
      { text: 'Usuario', align: 'start', value: 'usr_login' },
      { text: 'Nombre', value: 'usr_nombres' },
      //{ text: 'Correo Electrónico', value: 'usr_correo' },
      { text: 'Rol', value: 'nom_rol' },
      { text: 'Sistema', value: 'sistema' },
      { text: 'Activo', value: 'usr_activo' },
      { text: 'Datos de inicio de sesión', value: 'login' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    usuarios: [],
    roles: [],
    sistemas: [],
    editedIndex: -1,
    editedItem: {
      usr_id: '',
      usr_nombres: '',
      usr_correo: '',
      usr_rol: '',
      usr_pwd: '',
      usr_login: '',
      repassword: '',
      usr_activo: true,
      id_sistema: 0,
    },
    defaultItem: {
      usr_id: '',
      usr_nombres: '',
      usr_correo: '',
      usr_rol: '',
      usr_pwd: '',
      usr_login: '',
      repassword: '',
      usr_activo: true,
      id_sistema: 0,
    },
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      usr_nombres: { required, minLength: minLength(3), maxLength: maxLength(255) },
      usr_login: { required, minLength: minLength(3), maxLength: maxLength(100) },
      usr_correo: { email },
      usr_rol: { required },
      id_sistema: { required },
      usr_pwd: {
        checkPassword,
        oneNumber,
        oneUpperCase,
        oneLowerCase,
      },
      repassword: {
        sameAsPassword: sameAs('usr_pwd'),
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
    dialogPwd(val) {
      val || this.closeForm()
    },
  },

  created() {
    this.iniciando()
  },
  methods: {
    //Refresca Datos para la tabla
    async iniciando() {
      let jwt = await getValidToken(this)
      await this.obtenerUsuarios(jwt)
      await this.obtenerRoles(jwt)
      await this.obtenerSistemas(jwt)
    },
    // Obtiene todos los registros
    async obtenerUsuarios(jwt) {
      this.isLoading = true
      //let jwt = await getValidToken(this)
      //console.log(jwt)
      if (jwt !== null) {
        let payload = { jwt: jwt }
        this.usuarios = []
        await this.$store
          .dispatch('user/fetchUsers', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.usuarios = response.data
            }
            this.isLoading = false
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    //Obtiene los roles del usuario
    async obtenerRoles(jwt) {
      this.isLoading = true
      let params = null

      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=ROLUSR&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.roles = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.roles = response.data
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
    //Obtiene los sistemas del usuario
    async obtenerSistemas(jwt) {
      this.isLoading = true
      let params = null

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
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
    // Editar registro
    editItem(item) {
      this.isEditing = true
      this.editedIndex = this.usuarios.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.usr_pwd = ''
      this.editedItem.repassword = ''
      this.editedItem.usr_activo = this.editedItem.usr_activo == 1 ? true : false
      this.dialog = true
    },
    // Eliminar registro
    deleteItem(item) {
      const index = this.usuarios.indexOf(item)
      confirm('Esta seguro que desea eliminar este registro?') && this.usuarios.splice(index, 1)
    },
    //Cambiar solo la contraseña del usuario
    passwordItem(item) {
      this.isEditing = true
      this.editedIndex = this.usuarios.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.usr_pwd = ''
      this.editedItem.repassword = ''
      this.dialogPwd = true
    },
    // Guardar contenido del formulario
    async saveForm() {
      this.overlay = true
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let rol = 0
        if (this.editedItem.usr_rol.tipo_clave == null) {
          rol = this.editedItem.usr_rol
        } else {
          rol = this.editedItem.usr_rol.tipo_clave
        }
        let sistema = 0
        if (this.editedItem.id_sistema.id_sistema == null) {
          sistema = this.editedItem.id_sistema
        } else {
          sistema = this.editedItem.id_sistema.id_sistema
        }
        //console.log('rol :' + rol)
        let body = {
          usr_login: this.editedItem.usr_login,
          usr_nombres: this.editedItem.usr_nombres,
          usr_correo: this.editedItem.usr_correo,
          usr_rol: rol,
          usr_activo: this.editedItem.usr_activo == true ? 1 : 0,
          id_sistema: sistema,
        }
        if (this.editedItem.usr_pwd !== '') {
          //body.login = { usr_pwd: this.editedItem.usr_pwd }
          body.usr_pwd = this.editedItem.usr_pwd
          console.log(body.usr_pwd)

          // Verificar si las contraseñas coinciden
          if (this.editedItem.usr_pwd !== this.editedItem.repassword) {
            this.$store.commit('ALERT', {
              color: 'error',
              text: 'La contraseña y la confirmación de contraseña no coinciden',
            })
            return // Detener el proceso de guardado
          }
        }
        let jwt = await getValidToken(this)

        if (this.editedIndex > -1) {
          // Edicion del registro
          let id = this.editedItem.usr_id
          let body = {
          usr_login: this.editedItem.usr_login,
          usr_nombres: this.editedItem.usr_nombres,
          usr_correo: this.editedItem.usr_correo,
          usr_rol: rol,
          usr_activo: this.editedItem.usr_activo == true ? 1 : 0,
          id_sistema: sistema,
        }
          let payload = { jwt: jwt, id: id, body: body }
          await this.$store
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
        await this.iniciando()
      }
    },
    async changePassword() {
      this.overlay = true
      this.$v.$touch()

      if (!this.$v.$invalid) {
        // Verificar si las contraseñas coinciden
        if (this.editedItem.usr_pwd !== this.editedItem.repassword) {
          this.$store.commit('ALERT', {
            color: 'error',
            text: 'La contraseña y la confirmación de contraseña no coinciden',
          })
          return // Detener el proceso de guardado
        }

        let body = {
          usr_login: this.editedItem.usr_login,
          usr_pwd: this.editedItem.usr_pwd,
        }

        let jwt = await getValidToken(this)
        let id = this.editedItem.usr_id // Agregar la variable 'id' para enviarla en el payload

        let payload = { jwt: jwt, id: id, body: body }

        try {
          await this.$store.dispatch('user/cambioPwd', payload)
          this.$store.commit('ALERT', {
            color: 'success',
            text: 'La contraseña fue actualizada con éxito',
          })
          this.overlay = false
        } catch (err) {
          this.$store.commit('ALERT', {
            color: 'error',
            text: err.response.data.msg,
          })
          this.overlay = false
        }

        this.closeForm()
        await this.iniciando()
      }
    },

    // Invitar Nuevo Usuario (enviar email)
    async sendEmail() {
      this.overlay = true
      this.$v.$touch()
      if (!this.$v.editedItem.usr_correo.$invalid) {
        let body = {
          usr_correo: this.editedItem.usr_correo,
        }
        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        await this.$store
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
      this.dialogPwd = false
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
      ;(this.editedItem.usr_id = 0),
        (this.editedItem.usr_login = ''),
        (this.editedItem.usr_nombres = ''),
        (this.editedItem.usr_activo = true),
        (this.editedItem.usr_correo = ''),
        (this.editedItem.usr_pwd = ''),
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
    usr_rolErrors() {
      const errors = []
      if (!this.$v.editedItem.usr_rol.$dirty) return errors
      !this.$v.editedItem.usr_rol.required && errors.push('Este campo es requerido')
      return errors
    },
    id_sistemaErrors() {
      const errors = []
      if (!this.$v.editedItem.id_sistema.$dirty) return errors
      !this.$v.editedItem.id_sistema.required && errors.push('Este campo es requerido')
      return errors
    },
    usr_nombresErrors() {
      const errors = []
      if (!this.$v.editedItem.usr_nombres.$dirty) return errors
      !this.$v.editedItem.usr_nombres.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.usr_nombres.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.usr_nombres.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    LoginErrors() {
      const errors = []
      if (!this.$v.editedItem.usr_login.$dirty) return errors
      !this.$v.editedItem.usr_login.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.usr_login.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.usr_login.maxLength &&
        errors.push('Este campo debe de tener un máximo de 100 caracteres.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.editedItem.usr_correo.$dirty) return errors
      !this.$v.editedItem.usr_correo.email && errors.push('Debe ser un correo electrónico válido')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.editedItem.usr_pwd.$dirty) return errors
      !this.$v.editedItem.usr_pwd.checkPassword &&
        errors.push('La contraseña debe de tener un mínimo de 6 caracteres y un máximo de 15.')
      !this.$v.editedItem.usr_pwd.oneNumber &&
        errors.push('La contraseña debe de tener al menos un número')
      !this.$v.editedItem.usr_pwd.oneUpperCase &&
        errors.push('La contraseña debe de tener al menos una letra mayúscula')
      !this.$v.editedItem.usr_pwd.oneLowerCase &&
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
