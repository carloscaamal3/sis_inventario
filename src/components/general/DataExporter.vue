<template>
  <v-container>
    <!-- Empieza boton para exportar a excel -->
    <v-btn :style="displayExcel" small class="ma-2" elevation="2" color="blue">
      <json-excel :data="dataArray" :fields="dataFields" :name="fileName">
        {{ excelButtonText }}
      </json-excel>
      <v-icon right> {{ excelIcon }} </v-icon>
    </v-btn>
    <!-- Termina boton para exportar a excel -->

    <!-- Empieza boton para exporta a pdf -->
    <v-btn :style="displayPdf" small class="ma-2" elevation="2" color="blue" @click="generatePDF">
      {{ pdfButtonText }}
      <span aria-hidden="true">
        <v-icon right>{{ pdfIcon }}</v-icon>
      </span>
    </v-btn>
    <!-- Termina boton para exportar a pdf -->
  </v-container>
</template>

<script>
// Se importan las dependencias
import JsonExcel from 'vue-json-excel'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'DataExporter',

  // Componentes de las dependencias
  components: {
    JsonExcel,
  },

  // Propiedades del componente
  props: {
    dataArray: {
      type: Array,
      default: null,
    },

    dataFields: {
      type: Object,
      default: null,
    },

    fileName: {
      type: String,
      default: 'data',
    },

    excelIcon: {
      type: String,
      default: 'mdi-file-excel-outline',
    },

    pdfIcon: {
      type: String,
      default: 'mdi-file-pdf-outline',
    },

    excelButtonText: {
      type: String,
      default: 'Descargar Excel',
    },

    pdfButtonText: {
      type: String,
      default: 'Descargar PDF',
    },

    //inline
    //none
    excelView: { type: String, default: 'inline' },
    pdfView: { type: String, default: 'inline' },
  },
  computed: {
    displayExcel() {
      return `display:` + this.excelView
    },
    displayPdf() {
      return `display:` + this.pdfView
    },
  },

  methods: {
    // Genera el PDF y lo descarga
    generatePDF() {
      var doc = new jsPDF('landscape')
      var body = this.getDataArrayForPDF()
      if (body.length != 0) {
        doc.autoTable({
          head: [Object.keys(this.dataFields)],
          body: body,
        })
        doc.save(this.fileName + '.pdf')
      }
    },

    // Obtiene las propiedades de los objetos
    getProp(object, path) {
      if (path.length === 1) return object[path[0]]
      else if (path.length === 0) throw console.error('rip')
      else {
        if (object[path[0]]) {
          return this.getProp(object[path[0]], path.slice(1))
        } else {
          object[path[0]] = {}
          return this.getProp(object[path[0]], path.slice(1))
        }
      }
    },

    // Genera el arreglo de datos para el PDF
    getDataArrayForPDF() {
      var x = Object.values(this.dataFields)
      var y = []
      let table = []
      this.dataArray.forEach((element) => {
        for (let index = 0; index < x.length; index++) {
          let path = x[index].split('.')
          y.push(this.getProp(element, path))
        }
        table.push(y)
        y = []
      })
      return table
    },
  },
}
</script>
