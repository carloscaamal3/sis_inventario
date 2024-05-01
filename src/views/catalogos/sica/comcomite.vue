<template>
  <v-container id="data-tables" tag="section">
    <base-material-card color="blue" icon="mdi-paperclip" inline class="px-5 py-3">
      <v-spacer></v-spacer>
      <template v-slot:after-heading></template>
      <!-- Texto del boton NUEVO -->
      <template v-slot:corner-button>
        <v-row>
          <v-col cols="12">
            <v-btn small class="ma-2" elevation="2" color="blue" @click.stop="dialog = true"
              >Nuevo Concepto comité
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="familia"
              :items="familiasFiltro"
              :menu-props="{ top: true, offsetY: true }"
              label="Familia"
              item-text="tipo_descripcion"
              item-value="tipo_clave"
              persistent-hint
              dense
              hint="Seleciona Familia"
              @change="onChangeFamilia"
              return-object
            >
            </v-select>
          </v-col>
        </v-row>
      </template>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        label="Búsqueda"
        hide-details
        single-line
        style="max-width: 250px"
      />

      <!-- Dialogo Cancelar -->
      <ConfirmationDialog v-model="isSure" @click="cancel" />

      <!-- Dialogo Captura -->
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <!-- Campo familia_id -->
                <v-col cols="6">
                  <v-select
                    v-model="$v.editedItem.fam_id.$model"
                    :items="familias"
                    :menu-props="{ top: true, offsetY: true }"
                    label="Familia*"
                    hint="Selecciona una Familia"
                    item-text="tipo_descripcion"
                    item-value="tipo_clave"
                    persistent-hint
                    dense
                    return-object
                    :error-messages="fam_idErrors"
                    @input="changed = true"
                    @blur="$v.editedItem.fam_id.$touch()"
                  >
                  </v-select>
                </v-col>

                <!-- Campo prod_descripcion -->
                <v-col cols="12">
                  <v-text-field
                    v-model="$v.editedItem.concom_descripcion.$model"
                    label="Descripción*"
                    counter="100"
                    required
                    :error-messages="concom_descripcionErrors"
                    @input="$v.editedItem.concom_descripcion.$reset(), (changed = true)"
                    @blur="$v.editedItem.concom_descripcion.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo concom_partida_global -->
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.concom_partida_global"
                    label="Partida global"
                    counter="10"
                    @input="$v.editedItem.concom_partida_global.$reset(), (changed = true)"
                    @blur="$v.editedItem.concom_partida_global.$touch()"
                  ></v-text-field>
                </v-col>
                <!-- Campo concom_partida_especifica -->
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.concom_partida_especifica"
                    label="Partida específica"
                    counter="10"
                    required
                    @input="$v.editedItem.concom_partida_especifica.$reset(), (changed = true)"
                    @blur="$v.editedItem.concom_partida_especifica.$touch()"
                  ></v-text-field>
                </v-col>

                <!-- Campo ACTIVO -->
                <v-col cols="12">
                  <v-checkbox
                    v-model="editedItem.concom_activo"
                    :label="`Estatus: ${
                      editedItem.concom_activo.toString() == 'true' ? 'Activo' : 'Inactivo'
                    }`"
                    @input="$v.editedItem.concom_activo.$reset(), (changed = true)"
                    @blur="$v.editedItem.concom_activo.$touch()"
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

      <!-- Aqui va progress linear -->
      <v-divider class="mt-3" />

      <!-- Tabla de Datos -->
      <v-data-table
        :headers="headers"
        :items="comcomite"
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
        <template v-slot:item.prod_activo="{ item }">
          <Status :activostr="item.concom_activo" tipo="String" />
        </template>

        <template v-slot:no-data>
          <!-- <v-btn color="primary">Reset</v-btn> -->
          ¡No hay datos para mostrar!
        </template>
      </v-data-table>

      <!-- DataExporter para exportar a Excel -->
      <DataExporter :dataArray="comcomite" :dataFields="fields" fileName="comcomite" />
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
    familiasFiltro: [],
    familias: [],
    familia: 0,
    comcomite: [],
    editedItem: {
      concom_id: 0,
      concom_descripcion: '',
      fam_id: '',
      concom_partida_global: 0,
      concom_partida_especifica: 0,
      concom_activo: true,
    },
    defaultItem: {
      concom_id: 0,
      concom_descripcion: '',
      fam_id: '',
      concom_partida_global: 0,
      concom_partida_especifica: 0,
      concom_activo: true,
    },
    headers: [
      { text: 'Concepto', align: 'start', value: 'concom_id' },
      { text: 'Descripción', value: 'concom_descripcion' },
      { text: 'Familia', value: 'Familia' },
      { text: 'Partida Global', value: 'concom_partida_global' },
      { text: 'Partida Especifica', value: 'concom_partida_especifica' },
      { text: 'Activo', value: 'concom_activo' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    //Para Exportar
    fields: {
      id: 'concom_id',
      Descripcion: 'concom_descripcion',
      Familia: 'Familia',
      Partida_Global: 'concom_partida_global',
      Partida_Especifica: 'concom_partida_especifica',
      Activo: 'concom_activo',
    },
    /////////////////////////////////////////////////////////////////////////
    usuario: JSON.parse(localStorage.getItem('user')),
    search: undefined,
    isLoading: false,
    checkbox: false,
    isEditing: false,
    dialog: false,
    isSure: false,
    overlay: false,
    changed: false,
    //
    //value: [],
    //tipos: [],
    //clastipos: [],
    //clastiposfiltro: [],
    //clastipo: 0,
    //relacion1: [],
    //relacion2: [],
    //sistemas: [],
    editedIndex: -1,
  }),

  mixins: [validationMixin],
  //Validaciones para los campos del formulario
  validations: {
    editedItem: {
      //prod_id: { required, minLength: minLength(3), maxLength: maxLength(10) },
      concom_descripcion: { required, minLength: minLength(3), maxLength: maxLength(100) },
      fam_id: { required },
    },
  },

  computed: {
    //Titulo de los formularios
    formTitle() {
      return this.editedIndex === -1
        ? 'Nuevo Concepto'
        : 'Editar Concepto: ' + this.editedItem.concom_id
    },

    prod_idErrors() {
      const errors = []
      if (!this.$v.editedItem.prod_id.$dirty) return errors
      !this.$v.editedItem.prod_id.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.prod_id.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.prod_id.maxLength &&
        errors.push('Este campo debe de tener un máximo de 10 caracteres.')
      return errors
    },
    concom_descripcionErrors() {
      const errors = []
      if (!this.$v.editedItem.concom_descripcion.$dirty) return errors
      !this.$v.editedItem.concom_descripcion.required && errors.push('Este campo es requerido')
      !this.$v.editedItem.concom_descripcion.minLength &&
        errors.push('Este campo debe de tener un mínimo de 3 caracteres.')
      !this.$v.editedItem.concom_descripcion.maxLength &&
        errors.push('Este campo debe de tener un máximo de 100 caracteres.')
      return errors
    },
    fam_idErrors() {
      const errors = []
      if (!this.$v.editedItem.fam_id.$dirty) return errors
      !this.$v.editedItem.fam_id.required && errors.push('Este campo es requerido')
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
    //////////////////////////////////////////////////////////////////////////
    //Borrar en BD es desActivar Concepto Comite
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
        .dispatch('comcomite/deleteComComite', payload)
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
      await this.ComComiteSelect(jwt, this.familia)
    },
    //Cancelar Formulario
    cancel(isSure) {
      this.isSure = isSure
      if (this.isSure) {
        this.close(false)
        this.changed = false
      }
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
    //Obtiene Todos los conceptos comite
    async ComComiteSelect(jwt, familia) {
      this.isLoading = true
      let params = null

      if (familia != null) {
        if (familia != 'FAMTOD') {
          params = 'filtro?campo1=fam_id&tipo1=igual&valor1=' + familia
        }
      }
      //
      //params = 'filtro?campo1=concom_activo&tipo1=igual&valor1=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.comcomite = []
        await this.$store
          .dispatch('comcomite/fetchComComite', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.comcomite = response.data
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
    // Editar concepto comite
    editItem(item) {
      this.isEditing = true
      this.editedIndex = this.comcomite.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.concom_activo = this.editedItem.concom_activo == 1 ? true : false
      this.dialog = true
    },
    // Eliminar Concepto Comite
    deleteItem(item) {
      const index = this.comcomite.indexOf(item)
      //Confirma cerrar formulario
      confirm('Esta seguro que desea eliminar este registro?') && this.comcomite.splice(index, 1)
      this.Borrar(item.concom_id)
    },
    //Refresca Datos para la tabla
    async iniciando() {
      let jwt = await getValidToken(this)
      await this.FamiliasSelect(jwt)
      //await this.UnidadesSelect(jwt)
      await this.ComComiteSelect(jwt)

      if (this.familia == undefined || this.familia == 0) {
        this.familia = this.familiasFiltro[0].tipo_clave
      }
      await this.ComComiteSelect(jwt, this.familia)
    },
    //Obtiene Todos las Familias para el SELECT
    async FamiliasSelect(jwt) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=FAMPROD&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.familiasFiltro = []
        this.familias = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.familiasFiltro = response.data
              this.familias = response.data
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
    //Obtiene Todos las Unidades para el SELECT
    async UnidadesSelect(jwt) {
      this.isLoading = true
      let params = null
      params =
        'filtro?campo1=t.clatip_id&tipo1=igual&valor1=UNIPROD&logico2=and&campo2=t.tipo_activo&tipo2=igual&valor2=1'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.unidades = []
        await this.$store
          .dispatch('tipo/fetchTipo', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.unidades = response.data
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
    //Al cambiar el valor del Filtro de Familia
    async onChangeFamilia(value) {
      let jwt = await getValidToken(this)
      this.familia = value.tipo_clave
      await this.ComComiteSelect(jwt, this.familia)
    },
    // Guardar el formulario de concepto comite
    async save() {
      this.overlay = true
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let familia = 0
        if (this.editedItem.fam_id.tipo_clave == null) {
          familia = this.editedItem.fam_id
        } else {
          familia = this.editedItem.fam_id.tipo_clave
        }

        let body = {
          concom_descripcion: this.editedItem.concom_descripcion,
          fam_id: familia,
          concom_activo: this.editedItem.concom_activo == true ? 1 : 0,
          concom_partida_global: this.editedItem.concom_partida_global,
          concom_partida_especifica: this.editedItem.concom_partida_especifica,
        }

        let jwt = await getValidToken(this)
        let payload = { jwt: jwt, body: body }
        if (this.editedIndex > -1) {
          payload.id = this.editedItem.concom_id
          await this.$store
            .dispatch('comcomite/editComComite', payload)
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
        } else {
          await this.$store
            .dispatch('comcomite/addComComite', payload)
            .then(() => {
              this.$store.commit('ALERT', {
                color: 'success',
                text: 'El registro se creó con éxito',
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
        }

        this.close(this.checkbox)
        this.changed = false
        await this.iniciando()
      }
    },

    //////////////////////////////////////////////////////////////////////////
  },
}
</script>
