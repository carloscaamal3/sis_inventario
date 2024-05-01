<template>
  <v-app-bar id="app-bar" absolute app color="transparent" flat height="75">
    <!-- Empieza Dialogo -->
    <v-dialog v-model="changePwd" persistent max-width="480">
      <v-card>
        <v-card-title>
          <span class="headline">Cambio de contraseña</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="$v.password.$model"
                  label="Contraseña*"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  :counter="15"
                  required
                  :error-messages="passwordErrors"
                  @click:append.prevent="show1 = !show1"
                  @input="$v.newPassword.$reset()"
                  @blur="$v.newPassword.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="$v.newPassword.$model"
                  label="Nueva contraseña*"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show2 ? 'text' : 'password'"
                  :counter="15"
                  required
                  :error-messages="newPasswordErrors"
                  @click:append.prevent="show2 = !show2"
                  @input="$v.newPassword.$reset()"
                  @blur="$v.newPassword.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="$v.confirmNewPassword.$model"
                  label="Confirmar Nueva contraseña*"
                  :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show3 ? 'text' : 'password'"
                  :counter="15"
                  required
                  :error-messages="confirmNewPasswordErrors"
                  @click:append.prevent="show3 = !show3"
                  @input="$v.newPassword.$reset()"
                  @blur="$v.newPassword.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*Campo Obligatorio</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="closeForm">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="changePassword" :disabled="$v.$invalid"
            >Cambiar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Termina Dialogo -->
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="$vuetify.breakpoint.smAndDown ? setDrawer(!drawer) : $emit('input', !value)"
    >
      <v-icon v-if="value">mdi-view-quilt</v-icon>

      <v-icon v-else>mdi-dots-vertical</v-icon>
    </v-btn>

    <v-toolbar-title class="hidden-sm-and-down font-weight-light" v-text="$route.name" />

    <v-spacer />

    <!-- Boton para el dashboard -->
    <v-btn class="ml-2" min-width="0" text @click="dashboard" :disabled="$route.path === '/'">
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>
    <!-- Termina Boton para el dashboard -->

    <!-- Menú Badges -->
    <v-menu bottom left offset-y origin="top right" transition="scale-transition">
      <!-- <template v-slot:activator="{ attrs, on }">
        <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
          <v-badge color="red" overlap bordered>
            <template v-slot:badge>
              <span>5</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template> -->

      <v-list :tile="false" nav>
        <div>
          <app-bar-item v-for="(n, i) in notifications" :key="`item-${i}`">
            <v-list-item-title v-text="n" />
          </app-bar-item>
        </div>
      </v-list>
    </v-menu>
    <!-- Termina Menú Badges -->

    <!-- Menu Configuracion -->
    <v-menu bottom left min-width="200" offset-y origin="top right" transition="scale-transition">
      <!--  <template v-slot:activator="{ attrs, on }">
        <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template> -->

      <v-list :tile="false" flat nav>
        <!-- <template v-for="(item, index) in profile">
          <v-divider v-if="item.divider" :key="`divider-${index}`" class="mb-2 mt-2" />

          <app-bar-item v-else :key="`item-${index}`" to="/">
            <v-list-item-content @click="middleman(item.action)">
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </app-bar-item>
        </template>-->
        <template>
          <app-bar-item>
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title @click="userSettings">Administración de Usuarios</v-list-item-title>
          </app-bar-item>
          <app-bar-item>
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title @click="userGroups">Administración de Grupos</v-list-item-title>
          </app-bar-item>
        </template>
      </v-list>
    </v-menu>
    <!-- Termina menu configuracion  -->
    <!-- Menu usuario -->
    <v-menu bottom left offset-y origin="top right" transition="scale-transition">
      <template v-slot:activator="{ attrs, on }">
        <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list :tile="false" nav>
        <template>
          <app-bar-item>
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title @click="userProfile">Mi Perfil</v-list-item-title>
          </app-bar-item>
          <app-bar-item>
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-lock-reset</v-icon>
            </v-list-item-icon>
            <v-list-item-title @click="changePwd = true">Cambiar Contraseña</v-list-item-title>
          </app-bar-item>
          <v-divider class="mb-2 mt-2" />
          <app-bar-item>
            <v-list-item-icon class="mr-2" @click="userLogout">
              <v-icon>mdi-power</v-icon>
            </v-list-item-icon>
            <v-list-item-title @click="userLogout">Cerrar Sesión</v-list-item-title>
          </app-bar-item>
        </template>
      </v-list>
    </v-menu>
    <!-- Termina menu usuario -->
  </v-app-bar>
</template>

<script>
// Components
import { VHover, VListItem } from 'vuetify/lib'

// Utilities
import { mapState, mapMutations } from 'vuex'

import { required, minLength, maxLength, sameAs, not } from 'vuelidate/lib/validators'

const oneNumber = (value) => /[0-9]/.test(value)
const oneUpperCase = (value) => /[A-Z]/.test(value)
const oneLowerCase = (value) => /[a-z]/.test(value)

export default {
  name: 'DashboardCoreAppBar',

  validations: {
    password: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(15),
      oneNumber,
      oneUpperCase,
      oneLowerCase,
    },
    newPassword: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(15),
      oneNumber,
      oneUpperCase,
      oneLowerCase,
      notSameAsPassword: not(sameAs('password')),
    },
    confirmNewPassword: {
      sameAsNewPassword: sameAs('newPassword'),
    },
  },
  components: {
    AppBarItem: {
      render(h) {
        return h(VHover, {
          scopedSlots: {
            default: ({ hover }) => {
              return h(
                VListItem,
                {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text secondary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                },
                this.$slots.default
              )
            },
          },
        })
      },
    },
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    notifications: [
      'Mike John Responded to your email',
      'You have 5 new tasks',
      "You're now friends with Andrew",
      'Another Notification',
      'Another one',
    ],
    changePwd: false,
    // profile: [
    //   { title: 'Profile', action: 'userProfile' },
    //   { title: 'Settings', action: 'userSettings' },
    //   { divider: true },
    //   { title: 'Log out', action: 'userLogout' },
    // ],
    show1: false,
    show2: false,
    show3: false,
    password: '',
    newPassword: '',
    confirmNewPassword: '',
    user: JSON.parse(localStorage.getItem('user')),
  }),

  computed: {
    ...mapState(['drawer']),

    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.minLength && errors.push('Contraseña Incorrecta.')
      !this.$v.password.maxLength && errors.push('Contraseña Incorrecta.')
      !this.$v.password.required && errors.push('Contraseña Incorrecta.')
      !this.$v.password.oneNumber && errors.push('Contraseña Incorrecta.')
      !this.$v.password.oneUpperCase && errors.push('Contraseña Incorrecta.')
      !this.$v.password.oneLowerCase && errors.push('Contraseña Incorrecta.')
      return errors
    },

    newPasswordErrors() {
      const errors = []
      if (!this.$v.newPassword.$dirty) return errors
      !this.$v.newPassword.minLength &&
        errors.push('La nueva contraseña debe de tener un mínimo de 6 caracteres.')
      !this.$v.newPassword.maxLength &&
        errors.push('La nueva contraseña debe de tener un máximo de 15 caracteres.')
      !this.$v.newPassword.required && errors.push('La nueva contraseña es requerida.')
      !this.$v.newPassword.oneNumber &&
        errors.push('La nueva contraseña debe de tener al menos un número')
      !this.$v.newPassword.oneUpperCase &&
        errors.push('La nueva contraseña debe de tener al menos una letra mayúscula')
      !this.$v.newPassword.oneLowerCase &&
        errors.push('La nueva contraseña debe de tener al menos una letra minúscula')
      !this.$v.newPassword.notSameAsPassword &&
        errors.push('La nueva contraseña no puede ser igual a la actual')
      return errors
    },

    confirmNewPasswordErrors() {
      const errors = []
      if (!this.$v.confirmNewPassword.$dirty) return errors
      !this.$v.confirmNewPassword.sameAsNewPassword && errors.push('La contraseña debe ser igual.')
      return errors
    },
  },

  methods: {
    dashboard() {
      this.$router.push('/')
    },
    userProfile() {
      this.$router.push({ name: 'Perfil de Usuario' })
    },
    userSettings() {
      this.$router.push('/admon/usuarios')
    },
    userGroups() {
      this.$router.push('/admon/grupos')
    },

    changePassword() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$store
          .dispatch('auth/changePassword', {
            id: this.user.id,
            password: this.password,
            new_password: this.newPassword,
          })
          .then(() => {
            console.log('Entró')
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'La contraseña se cambió con éxito',
            })
            this.closeForm()
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.msg,
            })
            this.closeForm()
            this.errorMessage = err.response.data.msg
          })
      }
      this.changePwd = false
    },

    userLogout() {
      this.$store
        .dispatch('auth/logout')
        .then(() => {
          this.$router.push({ name: 'Login' })
          //console.log('Devolvio algo')
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // middleman(action) {
    //   switch (action) {
    //     case 'userProfile':
    //       this.userProfile()
    //       break
    //     case 'userSettings':
    //       this.$router.push('/configuracion/users')
    //       break
    //     case 'userLogout':
    //       this.userLogout()
    //       break
    //   }
    // },
    ...mapMutations({
      setDrawer: 'SET_DRAWER',
    }),

    closeForm() {
      ;(this.changePwd = false),
        (this.show1 = false),
        (this.show2 = false),
        (this.show3 = false),
        this.clearForm()
    },

    clearForm() {
      this.$v.$reset()
      ;(this.password = ''), (this.newPassword = ''), (this.confirmNewPassword = '')
    },
  },
}
</script>
