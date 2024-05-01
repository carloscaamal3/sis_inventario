<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- v-if="editedItem.imagen != '' -->
        <base-material-card color="blue">
          <!-- Intento 1 -->
          <!-- <v-file-input
            v-model="files"
            ref="files"
            :items="files"
            @click="$refs.files.click()"
            @click:prepend="$refs.files.click()"
            accept="image/*"
            prepend-icon="mdi-camera"
            label="Cambiar Avatar"
            placeholder="Click para cambiar avatar"
            v-on:change="listFiles"
          ></v-file-input> -->
          <!-- intento 2 -->
          <!-- <input type="file" name="image" @change="getImage" accept="image/*" />
          <a href="" v-show="loaded" class="btn btn-success" @click.prevent="updateAvatar"
            >Upload</a
          >-->
          <!-- Intento 3 -->
          <!-- <input type="text" v-model="productSpect" /> -->
          <ThumborImage
            v-if="editedItem.imagen.avatar"
            :imageUrl="editedItem.imagen.avatar"
            :avatarSize="150"
          />
          <input
            type="file"
            @change="uploadImage"
            name="image"
            id="image"
            accept="image/*"
            ref="myFileInput"
          />
          <!-- <button type="submit" @click.prevent="UploadAvatar">Grabar Avatar</button> -->
          <br />
          <v-btn color="blue darken-1" text @click="UploadAvatar">Actualizar Avatar</v-btn>

          <template v-slot:after-heading>
            <div class="font-weight-light card-title mt-2">
              Editar Perfil
              <span class="body-1">— Complete su Perfil</span>
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.correo"
                    disabled
                    label="Correo Electrónico"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    required
                    v-model="editedItem.nombre"
                    label="Nombre(s)"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.apellidos"
                    label="Apellidos"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editedItem.direccion.calle"
                    label="calle"
                    class="purple-input"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editedItem.direccion.ext"
                    label="Num. Externo"
                    class="purple-input"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editedItem.direccion.int"
                    label="Num. Interno"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="editedItem.direccion.colonia"
                    label="Colonia"
                    class="purple-input"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editedItem.direccion.cp"
                    class="purple-input"
                    label="Postal Code"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editedItem.contacto.telefono"
                    label="Teléfono"
                    class="purple-input"
                    dense
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editedItem.contacto.celular"
                    label="Celular"
                    class="purple-input"
                    dense
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <!-- <v-text-field v-model="editedItem.genero" label="Genero" class="purple-input" /> -->
                  <v-select
                    v-model="editedItem.genero"
                    :items="generos"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Genero"
                    hint="Seleciona Genero"
                    item-text="genero"
                    item-value="_id"
                    persistent-hint
                    dense
                  ></v-select>
                  <!-- {{ editedItem.genero }} -->
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn color="blue darken-1" text @click="saveForm">Actualizar Perfil</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getValidToken } from '@/store/helpers.js'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import ThumborImage from '@/components/general/ThumborImage.vue'
//import axios from 'axios'
//const baseURL = process.env.VUE_APP_BASE_URL_API

export default {
  components: {
    ThumborImage,
  },
  data: () => ({
    isLoading: false,
    usuario: JSON.parse(localStorage.getItem('user')),
    usuarios: [],
    generos: [],
    editedIndex: 0,
    dialog: false,
    //url: null,
    //imageAvatar: null,
    //loaded: false,
    //avatar: '',
    urlSinImagen: 'https://appapi.shuttleexpressmexico.mx/servicios/bvOQtLnR6WXG72gX.jpg',
    imagePath: '',
    productSpect: '',
    img: '',
    editedItem: {
      _id: '',
      nombre: '',
      apellidos: '',
      correo: '',
      contacto: { telefono: '', celular: '' },
      password: '',
      login: '',
      repassword: '',
      imagen: { avatar: '' },
      genero: null,
      direccion: { calle: '', colonia: '', cp: '', ext: '', int: '' },
    },
    mixins: [validationMixin],
    validations: {
      editedItem: {
        nombre: { required, minLength: minLength(3), maxLength: maxLength(20) },
      },
    },
    reglasAvatar: [
      (value) => !value || value.size < 10000000 || 'El tamaño del avatar debe ser menor a 4MB !!',
    ],
  }),
  created() {
    this.obtenerGeneros()
    this.obtenerUsuario()
  },
  methods: {
    //Obtener Generos
    async obtenerGeneros() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      if (jwt != null) {
        let payload = { jwt: jwt }
        this.$store
          .dispatch('gender/fetchGenders', payload)
          .then((response) => {
            this.generos = response.data
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
    // Obtener todos los Usuarios
    async obtenerUsuario() {
      this.isLoading = true
      let jwt = await getValidToken(this)
      let payload = {
        jwt: jwt,
        id: this.usuario.id,
      }
      if (jwt !== null) {
        this.$store
          .dispatch('user/fetchUsersId', payload)
          .then((response) => {
            this.usuarios = response.data
            this.editedItem = response.data
            this.isLoading = false
            console.log(this.editedItem.imagen.avatar)
            if (this.editedItem.imagen.avatar == undefined) {
              this.editedItem.imagen.avatar = this.urlSinImagen
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    // Guardar Formulario
    async saveForm() {
      //this.$v.$touch()
      //if (!this.$v.$invalid) {
      if (this.files != null) {
        //this.saveAvatar()
        console.log('Entro a SaveAvatar')
      }
      let body = {
        nombre: this.editedItem.nombre,
        apellidos: this.editedItem.apellidos,
        contacto: this.editedItem.contacto,
        direccion: this.editedItem.direccion,
        imagen: this.editedIndex.imagen,
        genero: this.editedItem.genero,
      }
      if (this.editedIndex == 0) {
        // Edita formulario
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
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.msg,
            })
          })
        //Object.assign(this.usuarios[this.editedIndex], this.editedItem)
        //}
        //this.closeForm()
      }
    },
    //MANEJO DE ARCHIVOS
    uploadImage(e) {
      this.img = e.target.files[0]
    },
    // Guardar Avatar
    async UploadAvatar() {
      if (this.img != '') {
        let fd = new FormData()
        fd.append('attachment', this.img)
        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: fd }
        this.$store
          .dispatch('user/loadAvatar', payload)
          .then(() => {
            this.$store.commit('ALERT', {
              color: 'success',
              text: 'El Avatar fue actualizado con éxito',
            })
            this.editedItem.imagen.avatar = URL.createObjectURL(this.img)
            this.$refs.myFileInput.value = ''
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.msg,
            })
          })
      } else {
        this.$store.commit('ALERT', {
          color: 'info',
          text: 'Seleccione una imagen',
        })
      }

      //this.editedItem.imagen.avatar = URL.createObjectURL(this.img)
      //this.obtenerUsuario()
    },
  },
  computed: {
    NombreErrors() {
      const errors = []
      if (!this.$v.editedItem.nombre.$dirty) return errors
      !this.$v.editedItem.nombre.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.nombre.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.nombre.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
  },
}
</script>
