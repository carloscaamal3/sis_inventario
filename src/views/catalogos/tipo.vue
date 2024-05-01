<template>
  <v-container id="data-tables" tag="section">
    <base-material-card color="blue" icon="mdi-city" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading></template>
      <!-- Texto del boton NUEVO -->
      <template v-slot:corner-button>
        <v-row>
          <v-col cols="12">
            <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog = true"
              >Nuevo Tipo</v-btn
            >
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="clastipo"
              :items="clastiposfiltro"
              :menu-props="{ top: true, offsetY: true }"
              label="Clasificación"
              item-text="clatip_descripcion"
              item-value="clatip_id"
              persistent-hint
              dense
              hint="Seleciona Clasificación"
              @change="onChangeClasTipo"
              return-object
            >
            </v-select>
          </v-col>
        </v-row>
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
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <!-- Campo DESCRIPCION -->
                <v-col cols="12">
                  <v-text-field
                    v-model="$v.editedItem.tipo_descripcion.$model"
                    label="Nombre*"
                    counter="100"
                    required
                    :error-messages="tipo_nombreErrors"
                    @input="$v.editedItem.tipo_descripcion.$reset(), (changed = true)"
                    @blur="$v.editedItem.tipo_descripcion.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo TIPO DE CATEGORIA -->
                <v-col cols="12">
                  <v-select
                    v-model="$v.editedItem.clatip_id.$model"
                    :items="clastipos"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Clasificación*"
                    :item-text="(item) => item.clatip_id + ' - ' + item.clatip_descripcion"
                    hint="Selecciona una clasificación"
                    item-value="clatip_id"
                    persistent-hint
                    dense
                    return-object
                    :error-messages="clatip_idErrors"
                    @input="changed = true"
                    @blur="$v.editedItem.clatip_id.$touch()"
                  >
                  </v-select>
                </v-col>
                <!-- Campo id_sistema -->
                <v-col cols="12">
                  <v-select
                    v-model="$v.editedItem.id_sistema.$model"
                    :items="sistemas"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Sistema*"
                    hint="Selecciona un Sistema"
                    :item-text="(item) => item.id_sistema + ' - ' + item.sistema"
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
                <!-- Campo CLAVE  -->
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.tipo_clave"
                    label="Clave"
                    counter="10"
                    @input="$v.editedItem.tipo_clave.$reset(), (changed = true)"
                    @blur="$v.editedItem.tipo_clave.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo RELACION 1 -->
                <v-col cols="12">
                  <v-select
                    v-model="editedItem.tipo_relacion1"
                    :items="relacion1"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Relación 1"
                    item-text="tipo_descripcion"
                    item-value="tipo_id"
                    hint="Selecciona un Tipo"
                    persistent-hint
                    dense
                    return-object
                    @input="changed = true"
                  >
                  </v-select>
                </v-col>
                <!-- Campo ORDEN -->
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.tipo_orden"
                    label="Orden"
                    counter="10"
                    @input="$v.editedItem.tipo_orden.$reset(), (changed = true)"
                    @blur="$v.editedItem.tipo_orden.$touch()"
                  ></v-text-field>
                </v-col>

                <!-- Campo RELACION 2 -->
                <!-- <v-col cols="12">
                  <v-select
                    v-model="editedItem.tipo_relacion2"
                    :items="relacion2"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Relación 2"
                    item-text="tipo_descripcion"
                    item-value="tipo_id"
                    hint="Selecciona un Tipo"
                    persistent-hint
                    dense
                    return-object
                    @input="changed = true"
                    @blur="$v.editedItem.tipo_relacion2.$touch()"
                  >
                  </v-select>
                </v-col> -->
                <!-- Campo ACTIVO -->
                <v-col cols="12">
                  <v-checkbox
                    v-model="editedItem.tipo_activo"
                    :label="`Estatus: ${
                      editedItem.tipo_activo.toString() == 'true' ? 'Activo' : 'Inactivo'
                    }`"
                    @input="$v.editedItem.tipo_activo.$reset(), (changed = true)"
                    @blur="$v.editedItem.tipo_activo.$touch()"
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
        :items="tipos"
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
        <template v-slot:item.tipo_activo="{ item }">
          <Status :activostr="item.tipo_activo" tipo="String" />
        </template>

        <template v-slot:no-data>
          <!-- <v-btn color="primary">Reset</v-btn> -->
          ¡No hay datos para mostrar!
        </template>
      </v-data-table>
      <!-- Termina Tabla de Tipos -->
      <!-- Empieza DataExporter -->
      <DataExporter :dataArray="tipos" :dataFields="fields" fileName="Tipos" />
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
    usuario: JSON.parse(localStorage.getItem('user')),
    search: undefined,
    isLoading: false,
    checkbox: false,
    isEditing: false,
    dialog: false,
    isSure: false,
    overlay: false,
    changed: false,
    headers: [
      { text: 'Tipo', align: 'start', value: 'tipo_id' },
      { text: 'Nombre', value: 'tipo_descripcion' },
      { text: 'Clasificación', value: 'clatip_id' },
      { text: 'Descripción', value: 'clatip_descripcion' },
      { text: 'Clave', value: 'tipo_clave' },
      { text: 'Relacion', value: 'desc_relacion1' },
      { text: 'Activo', value: 'tipo_activo' },
      { text: 'sistema', value: 'id_sistema' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //
    value: [],
    tipos: [],
    clastipos: [],
    clastiposfiltro: [],
    clastipo: 0,
    relacion1: [],
    relacion2: [],
    sistemas: [],
    editedIndex: -1,
    editedItem: {
      tipo_id: 0,
      tipo_descripcion: '',
      clatip_id: 0,
      tipo_activo: true,
      tipo_clave: '',
      tipo_orden: 0,
      tipo_relacion1: 0,
      id_sistema: 0,
      //tipo_relacion2: 0,
    },
    defaultItem: {
      tipo_id: 0,
      tipo_descripcion: '',
      clatip_id: 0,
      tipo_activo: true,
      tipo_clave: '',
      tipo_orden: 0,
      tipo_relacion1: 0,
      id_sistema: 0,
      //tipo_relacion2: 0,
    },
    //Para Exportar
    fields: {
      Tipo: 'tipo_id',
      Nombre: 'tipo_descripcion',
      Clasificación: 'clatip_id',
      Descripcion: 'clatip_descripcion',
      Activo: 'tipo_activo',
    },
  }),

  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      tipo_descripcion: { required, minLength: minLength(3), maxLength: maxLength(100) },
      clatip_id: { required },
      id_sistema: { required },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Tipo' : 'Editar Tipo'
    },

    tipo_nombreErrors() {
      const errors = []
      if (!this.$v.editedItem.tipo_descripcion.$dirty) return errors
      !this.$v.editedItem.tipo_descripcion.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.tipo_descripcion.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.tipo_descripcion.maxLength &&
        errors.push('Este campo debe de tener un máximo de 20 caracteres.')
      return errors
    },
    clatip_idErrors() {
      const errors = []
      if (!this.$v.editedItem.clatip_id.$dirty) return errors
      !this.$v.editedItem.clatip_id.required && errors.push('Este campo es requerido')
      return errors
    },
    id_sistemaErrors() {
      const errors = []
      if (!this.$v.editedItem.id_sistema.$dirty) return errors
      !this.$v.editedItem.id_sistema.required && errors.push('Este campo es requerido')
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
      await this.obtenerClasTipos(jwt)
      await this.obtenerTipoRelacion1(jwt)
      await this.obtenerSistemas(jwt)
      await this.obtenerClasTiposFiltra(jwt, this.usuario.id_sistema)
      if (this.clastipo == undefined || this.clastipo == 0) {
        this.clastipo = this.clastiposfiltro[0].clatip_id
      }
      await this.obtenerTipos(jwt, this.clastipo)

      //await this.obtenerTipoRelacion2(jwt)
    },
    async obtenerClasTiposFiltra(jwt, idsistema) {
      this.isLoading = true
      let params = null
      params = idsistema
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.clastiposfiltro = []
        await this.$store
          .dispatch('consulta/fetchGetClasTipoFiltro', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.clastiposfiltro = response.data
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
    //Obtiene Todos las clasificaciones de Tipos para el SELECT

    async obtenerClasTipos(jwt) {
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=clatip_activo&tipo1=igual&valor1=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.clastipos = []
        await this.$store
          .dispatch('clastipo/fetchClasTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.clastipos = response.data
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
    //Obtiene Todos los Tipos para la tabla
    async obtenerTipos(jwt, clastipo) {
      this.isLoading = true
      //let jwt = await getValidToken(this)
      let params = null
      if (clastipo != null) {
        /*         params =
          'filtro?campo1=t.id_sistema&tipo1=igual&valor1=0&logico2=or&campo2=t.id_sistema&tipo2=igual&valor2=' +
          this.usuario.id_sistema +
          '&logico3=and&campo3=t.clatip_id&tipo3=igual&valor3=' +
          clastipo
 */
        params = "t.clatip_id = '" + clastipo + "'/t.tipo_descripcion"
      } else {
        /*         params =
          'filtro?campo1=t.id_sistema&tipo1=igual&valor1=0&logico2=or&campo2=t.id_sistema&tipo2=igual&valor2=' +
          this.usuario.id_sistema
 */
        params = 't.id_sistema in (0,' + this.usuario.id_sistema + ' ) ' + '/t.tipo_descripcion'
      }

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.tipos = []
        await this.$store
          //.dispatch('tipo/fetchTipo', payload)
          .dispatch('consulta/fetchGetTipos', payload)

          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.tipos = response.data
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
    //Obtiene los tipo que se puedan relacionar 1
    async obtenerTipoRelacion1(jwt) {
      this.isLoading = true
      let params = null

      //params ='filtro?campo1=clatip_id&tipo1=igual&valor1=TIPSOL&logico2=and&campo2=tipo_activo&tipo2=igual&valor2=1'
      params = 'filtro?campo1=t.tipo_activo&tipo1=igual&valor1=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.relacion1 = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.relacion1 = response.data
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
    //Obtiene los tipo que se puedan relacionar 2
    /*
    async obtenerTipoRelacion2(jwt) {
      this.isLoading = true
      let params = null
      params = 'filtro?campo1=t.tipo_activo&tipo1=igual&valor1=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            this.relacion2 = []
            this.relacion2 = response.data
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
    */
    //Obtiene los sistemas del usuario
    async obtenerSistemas(jwt) {
      this.isLoading = true
      let params = 'id_sistema >= 0/id_sistema'

      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.sistemas = []
        await this.$store
          .dispatch('consulta/fetchGetSistemas', payload)
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
      this.editedIndex = this.tipos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.tipo_activo = this.editedItem.tipo_activo == 1 ? true : false
      this.dialog = true
    },
    // Eliminar Tipo
    deleteItem(item) {
      const index = this.tipos.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.tipos.splice(index, 1)
      this.Borrar(item.tipo_id)
    },
    //Borrar en BD es desActivar
    async Borrar(index) {
      this.overlay = true
      this.$v.$touch()

      let body = {
        tipo_id: index,
        tipo_activo: 0,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('tipo/deleteTipo', payload)
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
      Object.assign(this.tipos[this.editedIndex], this.editedItem)
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
        let clasif = 0
        if (this.editedItem.clatip_id.clatip_id == null) {
          clasif = this.editedItem.clatip_id
        } else {
          clasif = this.editedItem.clatip_id.clatip_id
        }
        let sistema = 0
        if (this.editedItem.id_sistema.id_sistema == null) {
          sistema = this.editedItem.id_sistema
        } else {
          sistema = this.editedItem.id_sistema.id_sistema
        }

        let rel1 = 0
        if (this.editedItem.tipo_relacion1 != null) {
          rel1 = this.editedItem.tipo_relacion1.tipo_id
        }
        let body = {
          tipo_id: this.editedItem.tipo_id,
          tipo_descripcion: this.editedItem.tipo_descripcion,
          clatip_id: clasif,
          tipo_activo: this.editedItem.tipo_activo == true ? 1 : 0,
          tipo_clave: this.editedItem.tipo_clave,
          tipo_orden: this.editedItem.tipo_orden,
          tipo_relacion1: rel1,
          tipo_relacion2: 0,
          id_sistema: sistema,
        }
        //console.log(body)
        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.editedIndex > -1) {
          payload.id = this.editedItem.tipo_id
          await this.$store
            .dispatch('tipo/editTipo', payload)
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
          Object.assign(this.tipos[this.editedIndex], this.editedItem)
        } else {
          await this.$store
            .dispatch('tipo/addTipo', payload)
            .then(() => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se creó con éxito',
              })
              //this.Tipos.push(response.data)
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
        await this.iniciando()
      }
    },
    async onChangeClasTipo(value) {
      let jwt = await getValidToken(this)
      this.clastipo = value.clatip_id
      await this.obtenerTipos(jwt, this.clastipo)
    },
  },
}
</script>
