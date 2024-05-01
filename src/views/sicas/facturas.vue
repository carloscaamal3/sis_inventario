<template>
  <v-container id="data-tables" tag="section">
    <base-material-card icon="mdi-eye" color="blue" inline class="px-5 py-3">
      <v-spacer></v-spacer>

      <template v-slot:corner-button>
      <v-row>
         <v-col cols="6">
        <v-btn class="ma-2" elevation="2" color="primary" @click="nuevaCaptura" 
          >Agregar Factura</v-btn
        >
      </v-col>
        <v-col cols="6">
            <v-select
              v-model="ejercicio"
              :items="ejercicios"
              :menu-props="{ top: true, offsetY: true }"
              label="Ejercicio"
              item-text="sp_ejercicio"
              item-value="sp_ejercicio"
              persistent-hint
              dense
              hint="Seleciona Ejercicio"
              @change="onChangeEjercicio"
              return-object
            >
          </v-select>
        </v-col>
      </v-row>
    </template>
    <CargarFactura
    v-model="dialogCargarFactura"
    :UUID = "UUID"
    :isEditing ="isEditing"
    :ejercicio="ejercicio"
    />
    <v-data-table
    dense
    loading-text="Cargando... Espere por favor"
    :headers="headersPrincipal"
    :items="facturasPrincipal"
    :loading="isLoading"
    :search.sync="search"
    hide-default-footer
    disable-pagination
    >
        <!-- Template para Fecha -->
       <template v-slot:[`item.Fecha`]="{ item }">
          <div class="name-info-title">
            {{ formato(eFormatos.FECHA_NUM, item.Fecha) }}
          </div>
        </template>

        <template v-slot:[`item.Total`]="{ item }">
          {{ formato(eFormatos.MONEDA, item.Total) }}
        </template>

        <!-- Acciones de la Tabla Principal -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" medium @click="editItem(item)">mdi-eye</v-icon>
          <!--<v-icon class="mr-2" small @click="editItemDet(item)">mdi-view-grid-outline</v-icon> -->
          <v-icon medium @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
import { getValidToken } from '@/store/helpers.js'
import * as tools from '@/store/modules/tools.store.js'
import CargarFactura from '@/components/general/CargarFactura.vue'
export default {
  components: {
    CargarFactura,
  },
  data: () => ({
    eFormatos: tools.formatos,
    editedIndex: -1,
    isEditing: false,
    dialogCargarFactura: false,
    isLoading: false,
    isSure: false,
    changed: false,
    editedItem: {
      sp_ejercicio:'',
    },
    xmlData: {
      cabecero: {
        Fecha: '',
        Folio: '',
        MetodoPago: '',
        Total: '',
        Version: '',
        Moneda:''
      },
      hijos: {
        emisor: {
          Nombre: '',
          RegimenFiscal: '',
          Rfc: '',
        },
        receptor: {
          Nombre: '',
          RegimenFiscalReceptor: '',
          Rfc: '',
          UsoCFDI: '',
        },
      },
      complemento:{
           Version: '',
            UUID: '',
            FechaTimbrado: '',
            RfcProvCertif: '',
        },
        impuesto:{
           TotalImpuestosTrasladados: '',
        },
        trasData1:{
            Base: '',
        },
        trasData2:{
            Base: '',
        },

    },
  defaultItem:
    {
       UUID: '',
    },
   
    ejercicios:[],
    conceptosData: [],
    trasladosData: [],
    arregloTrasData1: [],
    tableData: [],
    tableDataDoc:[],
    facturasPrincipal:[],
    facturasDetalle:[],
     headersPrincipal: [
      { text: 'Fecha', value: 'Fecha' },
      { text: 'Folio', value: 'Folio' },
      { text: 'UUID', value: 'UUID' },
      { text: 'Emisor', value: 'NombreEmisor' },
      { text: 'Receptor', value: 'NombreReceptor' },
      { text: 'Total', value: 'Total' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    headers: [
      { text: 'Cantidad', value: 'Cantidad' },
      { text: 'ClaveProdServ', value: 'ClaveProdServ' },
      { text: 'ClaveUnidad', value: 'ClaveUnidad' },
      { text: 'Descripcion', value: 'Descripcion' },
      { text: 'ValorUnitario', value: 'ValorUnitario' },
      { text: 'Base', value: 'Base' },
      { text: 'Importe', value: 'Importe' },
      { text: 'Impuesto', value: 'Impuesto' },
      { text: 'TasaOCuota', value: 'TasaQCuota' },
    ],
    fileLoaded: false,
    showModal: false,
    search: undefined,
    tabs: 0,
    fileInputValue: null,
  }),
  watch: {
    async dialogCargarFactura(val) {
      console.log('Watch', 'dialogCargarFactura(val)', val)
    },
  },
  async created() {
    this.Refresca()
    this.$root.$on('guardado-exitoso', () => {
      this.Refresca()
    });
  },
  methods: {
   async Refresca(){
      let jwt = await getValidToken(this)
       //await this.obtenerFacturas(jwt)
       await this.obtenerEjercicios(jwt)
        this.EjercicioValido()
        console.log("ejercicio", this.sp_ejercicio)
       if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      await this.obtenerFacturas(jwt, this.ejercicio)
    },
     EjercicioValido() {
      console.log(this.ejercicio)
      if (this.ejercicio == undefined || this.ejercicio == 0) {
        this.ejercicio = this.ejercicios[0].sp_ejercicio
      }
      if (this.ejercicio == 0) {
        var currentTime = new Date()
        this.ejercicio = currentTime.getFullYear()
      }
      this.editedItem.sp_ejercicio = this.ejercicio
    },
    async cargarFactura() {
      this.dialogCargarFactura = true;
      this.isEditing = false
      console.log("isEditingFactura", this.isEditing)
      this.$emit('update:isEditing', false); // Establecer isEditing en false
},


     async obtenerEjercicios(jwt) {
      //this.isLoading = true
      let params = null
      //params = 'solicitud_pagos/sp_ejercicio/'
      if (jwt != null) {
        let payload = { jwt: jwt, params: params }
        this.ejercicios = []
        await this.$store
          .dispatch('consulta/fetchGetEjerciciosFact', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.ejercicios = response.data
            }
          })
          .catch((err) => {
            this.$store.commit('ALERT', {
              color: 'error',
              text: err.response.data.error,
            })
          })
      }
    },
      async obtenerFacturas(jwt, ejercicio) {
      this.isLoading = true
      let params = null
        params ='filtro?campo1=sp_ejercicio&tipo1=igual&valor1=' + ejercicio
      if (jwt != null) {
        this.facturasPrincipal = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('factura/fetchFactura', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.facturasPrincipal = response.data
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
    nuevaCaptura() {
      this.EjercicioValido()
      this.cargarFactura()
    },
     editItem(item) {
      console.log('ENTRA A: editItem(item)', 'item: ', item)
      this.isEditing = true
      this.editedIndex = this.facturasPrincipal.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.UUID = this.editedItem.UUID
      const ejercicioValue =  this.editedItem.sp_ejercicio
      this.ejercicioEnCargarFactura = ejercicioValue
      this.cargFactura(item)
      //this.dialogCargarFactura = true
    },

    async cargFactura(val) {
      const ejercicioValue =  this.editedItem.sp_ejercicio
      this.ejercicioEnCargarFactura = ejercicioValue
      this.$emit('update:UUID', val.UUID);
      this.$emit('update:ejercicio', val.sp_ejercicio);
       this.dialogCargarFactura = true;

    },


    async obtenerFacturasDet(UUID) {
      this.isLoading = true
      let params = null
       params ='filtro?campo1=UUID&tipo1=igual&valor1=' + UUID
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.tableData = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('factura/fetchFacturaDet', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.tableData = response.data
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
    async onChangeEjercicio(value) {
      let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
      await  this.obtenerFacturas(jwt, value.sp_ejercicio)
    },
    async onChangeEjercicioPrinc(value) {
      //let jwt = await getValidToken(this)
      this.ejercicio = value.sp_ejercicio
    },

    //NO BORRAR FUNCION ANTERIOR//
    /* deleteItem(item) {
      console.log("item-text", item)
      const index = this.facturasPrincipal.indexOf(item)
      console.log("det.UUID", this.facturasPrincipal)
      confirm('¿Está seguro que desea eliminar este registro?, Se perderan todos los datos') &&
      this.facturasPrincipal.splice(index, 1)
      this.BorrarRegistroDoc(item.numDoc)
      this.BorrarOrDet(item.UUID)
      this.BorrarRegistro(item.UUID)
    },*/
     async obtenerFacturasDoc(numDoc) {
      this.isLoading = true
      let params = null
       params ='filtro?campo1=numDoc&tipo1=igual&valor1=' + numDoc
      let jwt = await getValidToken(this)
      if (jwt != null) {
        this.tableDataDoc = []
        let payload = { jwt: jwt, params: params }
        await this.$store
          .dispatch('factura/fetchFacturaDoc', payload)
          .then((response) => {
            if (response.data.mensaje == undefined) {
              this.tableDataDoc = response.data
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
    /* deleteItem(item) {
      console.log("item-text", item)
      const index = this.tableDataDoc.indexOf(item)
      confirm('¿Está seguro que desea eliminar este registro?, Se perderan todos los datos') &&
      this.tableDataDoc.splice(index, 1)
      //this.BorrarRegistroDoc(item.numDoc)
      this.BorrarOrDet(item.UUID)
      this.BorrarRegistro(item.UUID)
    },*/
    async deleteItem(item) {
      console.log("item-text", item);
      const index = this.tableData.indexOf(item);
      confirm('¿Está seguro que desea eliminar este registro?, Se perderan todos los datos') &&
      this.tableData.splice(index, 1)
  // Llama a obtenerFacturasDoc con el número de documento
      await this.obtenerFacturasDoc(item.osNumDoc);
      if (this.tableDataDoc.length > 0) {
    // Si se encontraron registros en obtenerFacturasDoc, borra el registro de documento
        this.BorrarRegistroDoc(item.osNumDoc);
        this.BorrarOrDet(item.UUID);
        this.BorrarRegistro(item.UUID);
      } else {
    // Si no se encontraron registros, borra solo el registro de documento
        this.BorrarOrDet(item.UUID);
        this.BorrarRegistro(item.UUID);
      }
  // Elimina el elemento de la tabla
      this.tableData.splice(index, 1);
      this.Refresca()
    },
    async BorrarRegistroDoc(index) {
      let body = {
        numDoc: index,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('factura/deleteFacturaDoc', payload)
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
          })
          this.overlay = false
        })
    },
     async BorrarRegistro(index) {
      let body = {
        UUID: index,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('factura/deleteFacturaCab', payload)
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
          })
          this.overlay = false
        })
    },
    async BorrarOrDet(index) {
      let body = {
        UUID: index,
      }
      let jwt = await getValidToken(this)
      let payload = { jwt: jwt, body: body }
      payload.id = index
      await this.$store
        .dispatch('factura/deleteFacturaDet', payload)
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
          })
          this.overlay = false
        })
    },
  
      formato(opcion, valor) {
      if (opcion == this.eFormatos.IMPORTE) {
        return tools.formatoImporte(valor)
      } else if (opcion == this.eFormatos.MONEDA) {
        return tools.formatoMoneda(valor)
      } else if (opcion == this.eFormatos.FECHA) {
        return tools.convierteNumeroFechaVista(valor)
      } else if (opcion == this.eFormatos.FECHA_NUM) {
        return tools.convierteNumeroFecha(valor)
      } else if (opcion == this.eFormatos.FECHA_FORMATO) {
        return tools.fechaformato(valor)
      } else if (opcion == this.eFormatos.MONEDA_RIGHT) {
        return tools.formatoMonedaRight(valor)
      }
    },
    },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'Cargar nueva factura XML'
        : 'Descripción de factura: ' + this.xmlData.complemento.UUID
    },
  }

}
</script>
