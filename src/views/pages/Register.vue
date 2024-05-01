<template>
  <v-container id="register" class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col cols="12" md="9">
        <!-- v-card Registro -->
        <v-slide-y-transition appear>
          <v-card class="pa-3 pa-md-5 mx-auto" light>
            <pages-heading class="text-center display-3"> Ivey </pages-heading>

            <v-row>
              <!-- Sistemas columna izquierda -->
              <v-col cols="12" md="6">
                <v-row no-gutters>
                  <v-col v-for="(section, i) in sections" :key="i" cols="12">
                    <v-list-item three-line>
                      <v-list-item-icon class="mr-4 mt-5 mt-md-4">
                        <v-icon
                          :large="$vuetify.breakpoint.mdAndUp"
                          :color="section.iconColor"
                          v-text="section.icon"
                        />
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title
                          class="font-weight-light mb-4 mt-3"
                          v-text="section.title"
                        />

                        <v-list-item-subtitle v-text="section.text" />
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-col>

              <!-- Datos del usuario columna derecha -->
              <v-col cols="12" md="6" v-show="isRegister">
                <div class="text-center">
                  <!-- Nombre -->
                  <v-text-field
                    color="secondary"
                    label="Nombre..."
                    prepend-icon="mdi-face"
                    v-model="$v.editedItem.nombre.$model"
                    required
                    maxlength="50"
                    :error-messages="nombreErrors"
                    @input="$v.editedItem.nombre.$reset()"
                    @blur="$v.editedItem.nombre.$touch()"
                  />
                  <!-- Celular -->
                  <v-text-field
                    color="secondary"
                    label="Celular..."
                    prepend-icon="mdi-cellphone-iphone"
                    v-model="$v.editedItem.celular.$model"
                    required
                    maxlength="10"
                    :error-messages="celularErrors"
                    @keypress="isNumber($event)"
                    @input="$v.editedItem.celular.$reset()"
                    @blur="$v.editedItem.celular.$touch()"
                  />
                  <!-- Contraseña -->
                  <v-text-field
                    color="secondary"
                    label="Contraseña..."
                    v-model="$v.editedItem.password.$model"
                    prepend-icon="mdi-lock-outline"
                    :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPwd ? 'text' : 'password'"
                    required
                    maxlength="16"
                    counter="16"
                    @click:append="showPwd = !showPwd"
                    :error-messages="passwordErrors"
                    @input="$v.editedItem.password.$reset()"
                    @blur="$v.editedItem.password.$touch()"
                  />
                  <!-- Confirmar Contraseña -->
                  <v-text-field
                    class="mb-8"
                    color="secondary"
                    label="Confirmar Contraseña..."
                    v-model="$v.editedItem.repassword.$model"
                    prepend-icon="mdi-lock-outline"
                    :append-icon="showRePwd ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showRePwd ? 'text' : 'password'"
                    required
                    maxlength="16"
                    counter="16"
                    @click:append="showRePwd = !showRePwd"
                    :error-messages="rePasswordErrors"
                    @input="$v.editedItem.repassword.$reset()"
                    @blur="$v.editedItem.repassword.$touch()"
                  />
                  <!-- Terminos y condiciones -->
                  <v-checkbox
                    :input-value="true"
                    color="secondary"
                    v-model="terms"
                    @change="$v.terms.$touch"
                  >
                    <template v-slot:label>
                      <span class="text-no-wrap">Acepto los &nbsp;</span>
                      <a class="secondary--text ml-6 ml-sm-0" href="#"> Términos y condiciones </a>.
                    </template>
                  </v-checkbox>

                  <pages-btn color="success" @click="registraUsuario" :disabled="$v.$invalid">
                    Registrarse
                  </pages-btn>
                </div>
              </v-col>
              <!-- Mesaje de exito columna Derecha -->
              <v-col cols="12" md="6" v-show="isSuccess">
                <div class="text-center">
                  <template v-for="(plan, i) in success">
                    <v-col :key="i" cols="12">
                      <pages-register-card :plan="plan" />
                    </v-col>
                  </template>
                </div>
              </v-col>
              <!-- Mesaje de error columna Derecha -->
              <v-col cols="12" md="6" v-show="isFail">
                <div class="text-center">
                  <template v-for="(plan, i) in unsuccess">
                    <v-col :key="i" cols="12">
                      <pages-register-card :plan="plan" />
                    </v-col>
                  </template>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'

// Valida que la cadena contenga al menos un numero
const oneNumber = (value) => {
  if (value != '') {
    return /[0-9]/.test(value)
  } else {
    return true
  }
}

// Valida que la cadena contenga al menos una letra mayúscula
const oneUpperCase = (value) => {
  if (value != '') {
    return /[A-Z]/.test(value)
  } else {
    return true
  }
}

// Valida que la cadena contenga al menos una letra minúscula
const oneLowerCase = (value) => {
  if (value != '') {
    return /[a-z]/.test(value)
  } else {
    return true
  }
}

export default {
  name: 'PagesRegister',

  components: {
    PagesBtn: () => import('./components/Btn'),
    PagesHeading: () => import('./components/Heading'),
    PagesRegisterCard: () => import('./components/RegisterCard'),
  },

  data: () => ({
    isRegister: true,
    isFail: false,
    isSuccess: false,
    showPwd: false,
    showRePwd: false,
    terms: false,
    success: [
      {
        best: true,
        heading: 'Registro Exitoso',
        icon: 'mdi-check',
        title: 'Ok',
        text: 'Ahora puede usted iniciar sesión en la aplicación, haga click en el botón de abajo',
        buttonText: 'Ir al Sitio',
      },
    ],
    unsuccess: [
      {
        best: false,
        heading: 'Error en el registro',
        icon: 'mdi-close',
        title: 'Error',
        text:
          'Ocurrio un error al registrarse, probablemente la invitación haya caducado o el correo ya este en uso',
        buttonText: 'Contactar al Administrador',
      },
    ],
    sections: [
      {
        icon: 'mdi-point-of-sale',
        iconColor: 'primary',
        title: 'Sistema de Ventas',
        text:
          'Hemos creado un sistema de ventas para poder gestionar traslados, paseos y circuitos.',
      },
      {
        icon: 'mdi-cart-outline',
        iconColor: 'secondary',
        title: 'Sistema de Almacén',
        text: 'Hemos creado un sistema para control de entradas y salidas de productos.',
      },
      {
        icon: 'mdi-chart-timeline-variant',
        iconColor: 'cyan',
        title: 'Inteligencia de Negocios',
        text:
          'Aquí podras encontrar información estadistica de todo lo relacionado con ambos sistemas.',
      },
    ],
    editedItem: {
      id: '',
      nombre: '',
      correo: '',
      celular: '',
      password: '',
      repassword: '',
    },
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      nombre: { required, minLength: minLength(3), maxLength: maxLength(20) },
      celular: { required, minLength: minLength(10), maxLength: maxLength(10) },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(15),
        oneNumber,
        oneUpperCase,
        oneLowerCase,
      },
      repassword: {
        sameAsPassword: sameAs('password'),
      },
    },
    terms: {
      checked(val) {
        return val
      },
    },
  },
  created() {
    this.verificaInvitacion()
  },
  computed: {
    nombreErrors() {
      const errors = []
      if (!this.$v.editedItem.nombre.$dirty) return errors
      !this.$v.editedItem.nombre.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.nombre.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.nombre.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    celularErrors() {
      const errors = []
      if (!this.$v.editedItem.celular.$dirty) return errors
      !this.$v.editedItem.celular.minLength &&
        errors.push('El número de celular debe de tener una longitud de 10 caracteres.')
      !this.$v.editedItem.celular.maxLength &&
        errors.push('El número de celular debe de tener una longitud de 10 caracteres.')
      !this.$v.editedItem.celular.required && errors.push('El número celular es requerido')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.editedItem.password.$dirty) return errors
      !this.$v.editedItem.password.minLength &&
        errors.push('La contraseña debe de tener un mínimo de 6 caracteres.')
      !this.$v.editedItem.password.maxLength &&
        errors.push('La contraseña debe de tener un máximo de 15 caracteres.')
      !this.$v.editedItem.password.required && errors.push('La contraseña es requerida.')
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
  methods: {
    // Verifica si la invitacion existe y esta vigente
    async verificaInvitacion() {
      if (this.$route.query.key) {
        let payload = this.$route.query.key
        await this.$store
          .dispatch('user/checkInvitation', payload)
          .then((response) => {
            this.editedItem.correo = response.data.correo
            this.editedItem.id = this.$route.query.key
            console.log(response.data.valid)
          })
          .catch(() => {
            this.unsuccess[0].text =
              'Ocurrio un error, es probable que su enlace haya caducado. Contacte al administrador'
            this.isRegister = false
            this.isFail = true
          })
      }
    },
    // Registra al usuario con los datos minimos necesarios
    async registraUsuario() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let body = {
          nombre: this.editedItem.nombre,
          correo: this.editedItem.correo,
          contacto: { celular: this.editedItem.celular },
          login: { password: this.editedItem.password },
        }
        let payload = {
          id: this.editedItem.id,
          body: body,
        }
        await this.$store
          .dispatch('user/registerUser', payload)
          .then((response) => {
            console.log(response.data)
            if (response.data) {
              this.isRegister = false
              this.isSuccess = true
            }
          })
          .catch(() => {
            this.isRegister = false
            this.isFail = true
          })
      }
    },
    // Evalua el caracter para saber si es un numero
    isNumber: function (evt) {
      evt = evt ? evt : window.event
      var charCode = evt.which ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
        evt.preventDefault()
      } else {
        return true
      }
    },
  },
}
</script>

<style lang="sass">
#register
  .v-list-item__subtitle
    -webkic-line-clamp: initial
    -webkit-box-orient: initial
</style>
