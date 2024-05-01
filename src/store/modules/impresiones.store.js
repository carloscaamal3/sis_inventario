//src/store/modules/impresiones.store.js
import { getValidToken } from '../helpers'

import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const namespaced = true
let solPagosImpresion = []
let nombArchivo = ''
const numLineasDetVertical = 29
const numLineasDetHorizontal = 21

//obtener folios
async function obtenerFoliosImp(jwt, opcion, idGrupo, vm) {
  let params = null
  let endPoint = 'fetchGetFolios'

  if (opcion == 'DEVENGADO') {
    params =
      's.sp_id_gpo_folios = ' +
      idGrupo +
      ' and f.folio_isdevengado = 1 and f.folio_activo = 1/s.sp_id'
  } else if (opcion == 'COMPROMETIDO') {
    /*  params =
      's.sp_id_gpo_folios = ' +
      idGrupo +
      ' and f.folio_iscomprometido = 1 and f.folio_activo = 1/s.sp_id' */
    params =
      's.sp_id_gpo_folios = ' +
      idGrupo +
      ' and f.folio_iscomprometido = 1 and f.folio_activo = 1' +
      ' and ifnull(sp_id_gpo_envio_cont_pre_comp,0) = 0/s.sp_id'
  } else if (opcion == 'COMPROMETIDO_PRE') {
    endPoint = 'fetchGetFoliosComPre'
    params =
      's.sp_id_gpo_envio_cont_pre_comp = ' +
      idGrupo +
      ' and f.folio_iscomprometido = 1 and f.folio_activo = 1/s.sp_id'
  } else if (opcion == 'EJERCIDO') {
    endPoint = 'fetchGetEjecidosImp'
    params = 's.sp_id_gpo_ejercido = ' + idGrupo + '/s.sp_id'
  }

  if (jwt != null) {
    let payload = { jwt: jwt, params: params }
    await vm.$store
      //.dispatch('consulta/fetchGetFolios', payload)
      .dispatch('consulta/' + endPoint, payload)
      .then((response) => {
        solPagosImpresion = []
        solPagosImpresion = response.data
        return solPagosImpresion
      })
      .catch((err) => {
        return err.response.data.error
      })
  }
}
//Obtiene la solictud de pago para imprimir
async function obtenerSolPagosImp(jwt, sp_id, vm, opcion, idGrupo, sp_ejercicio) {
  let params = null
  if (sp_id > 0) {
    if (sp_ejercicio > 0) {
      params = sp_id + '/' + sp_ejercicio
    } else {
      params = sp_id
    }
  }
  if (opcion == 'AUTORIZACION') {
    params = 'filtro?campo1=sp_id_gpo_firma_aut_ida&tipo1=igual&valor1=' + idGrupo
  } else if (opcion == 'CONTABILIDAD') {
    params = 'filtro?campo1=sp_id_gpo_gxc_ent_conta&tipo1=igual&valor1=' + idGrupo
  } else if (opcion == 'CONTABILIDADNP') {
    params = 'filtro?campo1=sp_id_gpo_envio_cont_np&tipo1=igual&valor1=' + idGrupo
  } else if (opcion == 'TESORERIA') {
    params = 'filtro?campo1=sp_id_gpo_firma_aut_vuelta&tipo1=igual&valor1=' + idGrupo
  } else if (opcion == 'GASTOSXC') {
    params = 'filtro?campo1=sp_id_gpo_firma_aut_vuelta_gxc&tipo1=igual&valor1=' + idGrupo
  }

  if (jwt != null) {
    let payload = { jwt: jwt, params: params }
    solPagosImpresion = []
    await vm.$store
      .dispatch('solpago/fetchSolPagosCreado', payload)
      .then((response) => {
        if (response.data.mensaje == undefined) {
          solPagosImpresion = response.data
          solPagosImpresion.sort((a, b) => a.sp_id - b.sp_id)
        }
        return solPagosImpresion
      })
      .catch((err) => {
        return err.response.data.error
      })
  }
}

function formatoFechaSpain(cadena, esLargo) {
  let year = cadena.slice(0, 4)
  let month = parseInt(cadena.slice(5, 7), 10) - 1
  let day = cadena.slice(8, 10)
  if (day < 10) {
    day = cadena.slice(9, 10)
  }

  const MesesLarge = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]
  const Meses = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sept',
    'Oct',
    'Nov',
    'Dic',
  ]

  if (esLargo) {
    return day + ' de ' + MesesLarge[month] + ' de ' + year
  } else {
    return day + '-' + Meses[month] + '-' + year
  }
}

function formatoImporte(value) {
  let val = (value / 1).toFixed(2).replace(',', '.')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function convierteNumeroFecha(date) {
  const cadena = date.toString()
  let year = cadena.slice(0, 4)
  let month = cadena.slice(5, 7)
  let day = cadena.slice(8, 10)
  const fecha = year + '-' + month + '-' + day
  return fecha
}
//Formato de Solicitud de Pago
async function imprimeFormatoSolPag(sp_id, vm, sp_ejercio) {
  //Consultar el id para imprimir

  let jwt = await getValidToken(vm)
  //let solPagosImpresion = await obtenerSolPagosImp(jwt, sp_id, vm)
  await obtenerSolPagosImp(jwt, sp_id, vm, '', 0, sp_ejercio)
  if (solPagosImpresion.length > 0) {
    var doc = new jsPDF('p', 'mm', 'letter')
    var logo = new Image()
    let valor_y = 15
    let valor_x = 60
    //Variables para acomodo de lineas
    let maxLength = 0
    let cadena = ''
    let cadenaNew = ''
    let cadenaImp = ''
    let palabra = ''
    let filaSig = 0
    let customLength = 0
    let actualLength = 0
    let impUltLinea = false
    let totalCadenaImp = 0
    let caracter = ''

    logo.src = require('@/assets/logo_ivey.jpg')

    //***************************************ENCABEZADO***************************************
    let linea_x_ini = 190
    let linea_x_fin = 210
    let linea_x_texto = 200
    doc.addImage(logo, 'JPEG', 10, 10, 50, 15)
    doc.setFontSize(14)
    doc.text(valor_x, valor_y, 'INSTITUTO DE VIVIENDA DEL ESTADO DE YUCATAN')
    //LINEA 1 HORIZONTAL
    doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
    doc.setFontSize(10)
    doc.text(linea_x_texto - 7, valor_y, 'Folio No.')
    //LINEA 2
    doc.line(linea_x_ini, valor_y + 3, linea_x_fin, valor_y + 3)
    //LINEAS VERTICAL
    doc.line(linea_x_ini, valor_y - 5, linea_x_ini, valor_y + 10)
    doc.line(linea_x_fin, valor_y - 5, linea_x_fin, valor_y + 10)
    //folio
    doc.setFontSize(14)
    doc.text(linea_x_texto - 3, valor_y + 8, solPagosImpresion[0].sp_id)
    //LINEA 3
    doc.line(linea_x_ini, valor_y + 10, linea_x_fin, valor_y + 10)
    valor_y += 10
    valor_x = 120
    doc.text(valor_x - 38, valor_y, 'SOLICITUD DE PAGO: ')

    doc.setFont(undefined, 'bold')

    cadena = solPagosImpresion[0].nom_tipo_sol

    doc.text(valor_x + 15, valor_y, cadena.toUpperCase())
    doc.setFont(undefined, 'normal')

    //***************************************TABLA GENERALES***************************************
    doc.setFontSize(10)
    let columna1_x = 11
    let columna2_x = 55

    //5 LINEAS HORIZONTALES
    valor_y += 20
    linea_x_ini = 10
    linea_x_fin = 150
    let fila_y = valor_y
    doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
    valor_y += 10
    doc.text(columna1_x, fila_y, 'Fecha de elaboración:')
    //doc.text(columna2_x, fila_y, formatoFechaSpain(solPagosImpresion[0].sp_fecha_elabora, true))
    doc.text(columna2_x, fila_y, formatoFechaSpain(solPagosImpresion[0].sp_fecha_solicitud, true))
    doc.line(linea_x_ini, valor_y - 7, linea_x_fin, valor_y - 7)
    valor_y += 10
    fila_y += 7
    doc.text(columna1_x, fila_y, 'Fecha probable de pago:')
    if (
      solPagosImpresion[0].sp_fecha_factura_prob_pago == '' ||
      solPagosImpresion[0].sp_fecha_factura_prob_pago == null
    ) {
      doc.text(columna2_x, fila_y, '')
    } else {
      doc.text(
        columna2_x,
        fila_y,
        formatoFechaSpain(solPagosImpresion[0].sp_fecha_factura_prob_pago, true)
      )
    }

    doc.line(linea_x_ini, valor_y - 10, linea_x_fin, valor_y - 10)
    valor_y += 12
    fila_y += 7
    doc.text(columna1_x, fila_y, 'Pago a nombre de:')

    //doc.text(columna2_x, fila_y, solPagosImpresion[0].sp_pago_nombre_de)
    //Dividir PAGO A NOMBRE DE en varias lineas
    cadena = solPagosImpresion[0].sp_pago_nombre_de
    //customLength = 45
    fila_y = ImprimeCadenaEnVariasFilas(doc, cadena, 45, columna2_x, fila_y)
    /*
    maxLength = cadena.length
    cadenaNew = ''
    cadenaImp = ''
    palabra = ''
    filaSig = 0

    actualLength = 0
    impUltLinea = false
    totalCadenaImp = 0
    for (let i = 0; i < maxLength; i++) {
      caracter = cadena.charAt(i)
      if (caracter == ' ') {
        //fin de palabra
        //verificar si cadena es mayor que el limite
        actualLength = cadenaNew.length + palabra.length
        if (actualLength >= customLength) {
          if (actualLength > customLength) {
            cadenaImp = cadenaNew
            cadenaNew = palabra
          } else {
            cadenaImp = cadenaNew + ' ' + palabra
            cadenaNew = ''
          }
          doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
          filaSig = filaSig + 5
          palabra = ''
          totalCadenaImp = totalCadenaImp + cadenaImp.length
        } else if (actualLength == maxLength - cadenaNew.length - totalCadenaImp) {
          cadenaImp = cadenaNew + ' ' + palabra
          if (i < maxLength) {
            palabra = cadena.substring(i, maxLength)
            cadenaImp = cadenaImp + ' ' + palabra
          }
          doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
          impUltLinea = true
        } else {
          cadenaNew = cadenaNew + ' ' + palabra
          palabra = ''
        }
      } else {
        palabra = palabra + caracter
      }
      if (i == maxLength - 1) {
        if (!impUltLinea) {
          cadenaImp = cadenaNew + ' ' + palabra
          doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
        }
      }
    }
*/
    //

    //Dividir el campo
    doc.line(linea_x_ini, valor_y - 10, linea_x_fin, valor_y - 10)
    valor_y += 15
    fila_y += 12
    doc.text(columna1_x, fila_y, 'Concepto:')

    //CONCEPTO
    cadena = solPagosImpresion[0].nom_concepto
    cadenaNew = ''
    cadenaImp = ''
    palabra = ''
    filaSig = 0
    customLength = 37
    maxLength = cadena.length + 1
    actualLength = 0
    impUltLinea = false
    totalCadenaImp = 0
    for (var i = 0; i < maxLength; i++) {
      caracter = cadena.charAt(i)
      if (caracter == ' ') {
        //fin de palabra
        //verificar si cadena es mayor que el limite
        actualLength = cadenaNew.length + palabra.length
        if (actualLength >= customLength) {
          if (actualLength > customLength) {
            cadenaImp = cadenaNew
            cadenaNew = palabra
          } else {
            cadenaImp = cadenaNew + ' ' + palabra
            cadenaNew = ''
          }
          doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
          filaSig = filaSig + 5
          palabra = ''
          totalCadenaImp = totalCadenaImp + cadenaImp.length
        } else if (actualLength == maxLength - cadenaNew.length - totalCadenaImp) {
          cadenaImp = cadenaNew + ' ' + palabra
          if (i < maxLength) {
            palabra = cadena.substring(i, maxLength)
            cadenaImp = cadenaImp + ' ' + palabra
          }
          doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
          impUltLinea = true
        } else {
          cadenaNew = cadenaNew + ' ' + palabra
          palabra = ''
        }
      } else {
        palabra = palabra + caracter
      }
      if (i == maxLength - 1) {
        if (!impUltLinea) {
          cadenaImp = cadenaNew + ' ' + palabra
          doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
        }
      }
    }
    doc.line(linea_x_ini, valor_y - 7, linea_x_fin, valor_y - 7)
    //3 LINEAS VERTICALES
    doc.line(linea_x_ini, valor_y - 52, linea_x_ini, valor_y - 7)
    doc.line(columna2_x - 3, valor_y - 52, columna2_x - 3, valor_y - 7)
    doc.line(linea_x_fin, valor_y - 52, linea_x_fin, valor_y - 7)

    //***************************************TABLA CONCEPTOS***************************************
    //3 LINEAS HORIZAONTALES
    doc.setFontSize(10)
    columna1_x = 11
    //Documento No
    columna2_x = columna1_x + 32
    let columna3_x = 0
    let columna4_x = 0

    if (solPagosImpresion[0].nom_tipo_sol == 'Presupuestal') {
      //Fecha del Documento
      columna3_x = columna2_x + 27
      //Descripcion
      columna4_x = columna3_x + 22
    } else {
      //aqui
      columna4_x = columna2_x + 27 + 20
    }
    //Importe
    let columna5_x = columna4_x + 100
    valor_y += 5
    linea_x_ini = 10
    linea_x_fin = 210
    fila_y += 27
    doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
    //Encabezados
    //Columna 1
    if (solPagosImpresion[0].nom_tipo_sol == 'Presupuestal') {
      doc.text(columna1_x + 5, fila_y - 2, 'Clave')
      doc.text(columna1_x, fila_y + 3, 'Presupuestal')
    } else {
      doc.text(columna1_x + 5, fila_y - 2, 'Fuente ')
      doc.text(columna1_x, fila_y + 3, 'Financiamiento')
    }
    //Columna 2
    if (solPagosImpresion[0].nom_tipo_sol == 'Presupuestal') {
      doc.text(columna2_x, fila_y - 2, 'Documento')
      doc.text(columna2_x + 5, fila_y + 3, 'No.')
    } else {
      doc.text(columna2_x, fila_y - 2, 'Num. de Oficio')
    }
    //Columna 3
    if (solPagosImpresion[0].nom_tipo_sol == 'Presupuestal') {
      doc.text(columna3_x, fila_y - 2, 'Fecha del')
      doc.text(columna3_x, fila_y + 3, 'Documento')
    }
    //Columna 4
    doc.text(columna4_x, fila_y, 'Descripción')
    //Columna 5
    doc.text(columna5_x, fila_y, 'Importe')
    //Encabezados
    valor_y += 10
    doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
    valor_y += 60
    //Informacion de la table conceptos
    doc.setFontSize(8)
    fila_y += 15

    cadena = solPagosImpresion[0].sp_fuente_fin
    doc.text(columna1_x, fila_y, cadena)

    if (solPagosImpresion[0].nom_tipo_sol == 'Presupuestal') {
      cadena = solPagosImpresion[0].sp_no_factura
    } else {
      cadena = solPagosImpresion[0].sp_num_oficio
    }

    doc.text(columna2_x, fila_y, cadena.toUpperCase())
    //console.log(solPagosImpresion[0].sp_fecha_factura)
    if (
      solPagosImpresion[0].sp_fecha_factura == '' ||
      solPagosImpresion[0].sp_fecha_factura == null
    ) {
      cadena = ''
    } else {
      cadena = convierteNumeroFecha(solPagosImpresion[0].sp_fecha_factura)
    }

    if (solPagosImpresion[0].nom_tipo_sol == 'Presupuestal') {
      doc.text(columna3_x, fila_y, cadena)
    }

    //DESCRIPCION
    cadena = solPagosImpresion[0].sp_descripcion
    //customLength = 55
    fila_y = ImprimeCadenaEnVariasFilas(doc, cadena, 55, columna4_x, fila_y)
    /*
    cadenaNew = ''
    cadenaImp = ''
    palabra = ''
    filaSig = 0
    customLength = 55
    maxLength = cadena.length + 1
    actualLength = 0
    impUltLinea = false
    totalCadenaImp = 0
    for (i = 0; i < maxLength; i++) {
      caracter = cadena.charAt(i)
      if (caracter == ' ') {
        actualLength = cadenaNew.length + palabra.length
        if (actualLength >= customLength) {
          if (actualLength > customLength) {
            cadenaImp = cadenaNew + ' '
            cadenaNew = palabra
          } else {
            cadenaImp = cadenaNew + ' ' + palabra
            cadenaNew = ''
          }
          doc.text(columna4_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
          filaSig = filaSig + 5
          palabra = ''
          totalCadenaImp = totalCadenaImp + cadenaImp.length
        } else if (actualLength == maxLength - cadenaNew.length - totalCadenaImp) {
          cadenaImp = cadenaNew + ' ' + palabra
          doc.text(columna4_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())

          if (maxLength - i < customLength) {
            //console.log('O P C I O N  #  2b')
            //console.log('valor de i : ' + i)
            //console.log('maxLength : ' + maxLength)
            palabra = cadena.substring(i, maxLength)
            //console.log('palabra : ' + palabra)
            //cadenaImp = cadenaImp + ' ' + palabra
            cadenaImp = palabra
            //console.log('cadenaImp : ' + cadenaImp)
            filaSig = filaSig + 5
            doc.text(columna4_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
            break
          }

          impUltLinea = true
        } else {
          //console.log('O P C I O N  #  3')
          cadenaNew = cadenaNew + ' ' + palabra
          //console.log('cadenaNew : ' + cadenaNew)
          //console.log('palabra : ' + palabra)
          palabra = ''
        }
      } else {
        palabra = palabra + caracter
      }
      if (i == maxLength - 1) {
        //console.log('O P C I O N  #  4a')
        if (!impUltLinea) {
          //console.log('O P C I O N  #  4b')
          actualLength = cadenaNew.length + palabra.length
          if (actualLength >= customLength) {
            //console.log('O P C I O N  #  4c')
            cadenaImp = cadenaNew
            //console.log('cadenaImp : ' + cadenaImp)
            doc.text(columna4_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
            filaSig = filaSig + 5
            cadenaImp = palabra
            //console.log('cadenaImp : ' + cadenaImp)
            doc.text(columna4_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
          } else {
            //console.log('O P C I O N  #  4d')
            cadenaImp = cadenaNew + ' ' + palabra
            //console.log('cadenaImp : ' + cadenaImp)
            doc.text(columna4_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
          }
        }
      }
    }
*/

    cadena = '$ ' + formatoImporte(solPagosImpresion[0].sp_importe)
    doc.text(columna5_x + 17, fila_y, cadena, {
      align: 'right',
    })
    doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)

    //5 LINEAS VERTICALES
    doc.line(linea_x_ini, valor_y - 75, linea_x_ini, valor_y - 5)
    doc.line(columna2_x - 3, valor_y - 75, columna2_x - 3, valor_y - 5)
    doc.line(columna3_x - 3, valor_y - 75, columna3_x - 3, valor_y - 5)
    doc.line(columna4_x - 3, valor_y - 75, columna4_x - 3, valor_y - 5)
    doc.line(columna5_x - 3, valor_y - 75, columna5_x - 3, valor_y - 5)
    doc.line(linea_x_fin, valor_y - 75, linea_x_fin, valor_y - 5)

    //***************************************TABLA RESUMEN***************************************
    //2 LINEAS HORIZONTALES
    valor_y += 5
    doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
    doc.text(columna1_x, valor_y, 'Cuenta Contable')
    cadena = solPagosImpresion[0].cuecon_cuenta
    //console.log(cadena)
    doc.text(columna2_x, valor_y, cadena)
    //cadena = solPagosImpresion[0].sp_pago_nombre_de
    //Dividir PAGO A NOMBRE DE en varias lineas
    cadena = solPagosImpresion[0].sp_pago_nombre_de
    //customLength = 45
    if (solPagosImpresion[0].nom_tipo_sol == 'Presupuestal') {
      //doc.text(columna3_x, valor_y, cadena.toUpperCase())
      valor_y = ImprimeCadenaEnVariasFilas(doc, cadena, 45, columna3_x, valor_y)
    } else {
      //doc.text(columna4_x, valor_y, cadena.toUpperCase())
      valor_y = ImprimeCadenaEnVariasFilas(doc, cadena, 45, columna4_x - 10, valor_y)
    }

    doc.text(columna5_x - 28, valor_y, 'TOTAL A PAGAR')

    cadena = '$ ' + formatoImporte(solPagosImpresion[0].sp_importe)
    //AQUI
    doc.text(columna5_x + 17, valor_y, cadena, {
      align: 'right',
    })
    //console.log(cadena)

    valor_y += 10
    doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
    //3LINEAS VERTICALES
    doc.line(linea_x_ini, valor_y - 15, linea_x_ini, valor_y - 5)
    doc.line(columna2_x - 3, valor_y - 15, columna2_x - 3, valor_y - 5)
    doc.line(columna5_x - 3, valor_y - 15, columna5_x - 3, valor_y - 5)
    doc.line(linea_x_fin, valor_y - 15, linea_x_fin, valor_y - 5)

    //***************************************F I R M A S  ***************************************
    //3 lineas verticales
    if (solPagosImpresion[0].sp_vobo_emp_id > 0) {
      valor_y += 40
    } else {
      valor_y += 60
    }
    doc.text(columna1_x + 30, valor_y - 30, 'SOLICITA')
    doc.text(150, valor_y - 30, 'AUTORIZA EL PAGO')
    //DPP
    doc.text(200, valor_y + 30, 'DPP')
    //SOLICITA
    linea_x_ini = 10
    linea_x_fin = 100
    let centro_linea = (linea_x_fin - linea_x_ini) / 2
    doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
    cadena = solPagosImpresion[0].titulo_sol + ' ' + solPagosImpresion[0].nombre_sol
    var centro_cadena = cadena.length / 2
    var col_centrado = centro_linea - centro_cadena + linea_x_ini - 10
    doc.text(col_centrado, valor_y, cadena.toUpperCase())
    cadena = solPagosImpresion[0].puesto_sol
    centro_cadena = cadena.length / 2
    col_centrado = centro_linea - centro_cadena + linea_x_ini - 10
    doc.text(col_centrado, valor_y + 5, cadena.toUpperCase())

    //AUTORIZA
    linea_x_ini = 120
    linea_x_fin = 210
    centro_linea = (linea_x_fin - linea_x_ini) / 2
    columna1_x = linea_x_ini + 1
    doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
    cadena = solPagosImpresion[0].titulo_aut + ' ' + solPagosImpresion[0].nombre_aut
    centro_cadena = cadena.length / 2
    col_centrado = centro_linea - centro_cadena + linea_x_ini - 10
    doc.text(col_centrado, valor_y, cadena.toUpperCase())
    cadena = solPagosImpresion[0].puesto_aut
    centro_cadena = cadena.length / 2
    col_centrado = centro_linea - centro_cadena + linea_x_ini - 10
    doc.text(col_centrado, valor_y + 5, cadena.toUpperCase())

    //VISTO BUENO
    if (solPagosImpresion[0].sp_vobo_emp_id > 0) {
      valor_y += 50
      linea_x_ini = 55
      linea_x_fin = linea_x_ini + 90
      centro_linea = (linea_x_fin - linea_x_ini) / 2
      columna1_x = linea_x_ini + 1
      doc.text(columna1_x + 43, valor_y - 30, 'VO.BO')
      doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
      cadena = solPagosImpresion[0].titulo_vobo + ' ' + solPagosImpresion[0].nombre_vobo
      centro_cadena = cadena.length / 2
      col_centrado = centro_linea - centro_cadena + linea_x_ini
      doc.text(col_centrado, valor_y, cadena.toUpperCase())
      cadena = solPagosImpresion[0].puesto_vobo
      centro_cadena = cadena.length / 2
      col_centrado = centro_linea - centro_cadena + linea_x_ini
      doc.text(col_centrado, valor_y + 5, cadena.toUpperCase())
    }

    //GUARDA documento
    return doc.save('solpag_' + sp_id + '.pdf')

    //return true
  }

  ///////////////////FIN DE LO NUEVO ////////////////////////
}
//  IMPRIMEGRUPO
//Encabezao de ImprimeGrupo
function imprimeEncabezadoGrupo(doc, valor_x, valor_y, opcion, idGrupo, logo) {
  let cadena

  doc.addImage(logo, 'JPEG', 10, 10, 50, 15)
  doc.setFontSize(14)
  doc.text(valor_x, valor_y, 'INSTITUTO DE VIVIENDA DEL ESTADO DE YUCATAN')
  valor_y += 7
  if (opcion == 'TESORERIA') {
    nombArchivo = 'gpoPago'
    doc.text(valor_x + 10, valor_y, 'SOLICITUD DE PAGOS AUTORIZADOS')
  } else if (opcion == 'GASTOSXC') {
    nombArchivo = 'gpoComprobacion'
    doc.text(valor_x + 10, valor_y, 'COMPROBACIONES AUTORIZADAS')
  } else {
    doc.text(valor_x + 10, valor_y, 'REPORTE DE DOCUMENTOS ENTREGADOS')
    valor_y += 7
  }
  if (opcion == 'AUTORIZACION') {
    nombArchivo = 'gpoAutoriza'
    doc.text(valor_x + 15, valor_y, 'PARA FIRMA DE AUTORIZACION')
  } else if (opcion == 'CONTABILIDAD') {
    nombArchivo = 'gpoCompCont'
    doc.text(valor_x + 15, valor_y, 'PARA COMPROBACION DE GASTOS')
  } else if (opcion == 'CONTABILIDADNP') {
    nombArchivo = 'gpoNpCont'
    doc.text(valor_x + 15, valor_y, 'A CONTABILIDAD ')
  }
  if (opcion == 'AUTORIZACION' || opcion == 'CONTABILIDAD' || opcion == 'CONTABILIDADNP') {
    valor_y += 7
    doc.text(valor_x + 17, valor_y, 'DE CONTROL PRESUPUESTAL')
  }
  valor_y += 7
  if (opcion == 'AUTORIZACION') {
    cadena = formatoFechaSpain(solPagosImpresion[0].sp_fecha_firma_aut_ida, false)
  } else if (opcion == 'CONTABILIDAD') {
    cadena = formatoFechaSpain(solPagosImpresion[0].sp_fecha_gxc_ent_conta, false)
  } else if (opcion == 'CONTABILIDADNP') {
    cadena = formatoFechaSpain(solPagosImpresion[0].sp_fecha_envio_cont_np, false)
  } else if (opcion == 'TESORERIA') {
    cadena = formatoFechaSpain(solPagosImpresion[0].sp_fecha_firma_aut_vuelta, true)
  } else if (opcion == 'GASTOSXC') {
    cadena = formatoFechaSpain(solPagosImpresion[0].sp_fecha_conta_gasxcomp, true)
  }
  if (opcion == 'TESORERIA' || opcion == 'GASTOSXC') {
    doc.text(valor_x + 15, valor_y, 'FECHA: ' + cadena)
    valor_y += 7
    doc.text(valor_x, valor_y, 'Grupo No. ' + idGrupo)
  } else {
    doc.text(valor_x + 75, valor_y, 'FECHA: ' + cadena)

    doc.text(valor_x, valor_y, 'Grupo No. ' + idGrupo)
  }

  return valor_y
}
//Encabezado de Tabla de imprimeGrupo
function imprimeEncabezadoTablaGrupo(
  doc,
  opcion,
  linea_x_ini,
  linea_x_fin,
  valor_y,
  fila_y,
  columna1_x,
  columna2_x,
  columna3_x,
  columna4_x,
  columna5_x
) {
  doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)

  if (opcion == 'TESORERIA' || opcion == 'GASTOSXC') {
    doc.text(columna1_x, fila_y, 'Folio')
    doc.text(columna2_x, fila_y, 'Beneficiario')
    doc.text(columna3_x, fila_y, '$ Importe')
  } else {
    doc.text(columna2_x, fila_y, 'Fecha')
    doc.text(columna2_x, fila_y + 5, 'Solicitud')
    doc.text(columna3_x, fila_y, 'Beneficiario')
    doc.text(columna4_x, fila_y, '$ Importe')
  }
  valor_y += 13

  //Segunda Linea Horizontal
  doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)

  //Primera Linea Vertical
  doc.line(linea_x_ini, valor_y - 5, linea_x_ini, valor_y - 18)

  //lineas verticales
  if (opcion == 'TESORERIA' || opcion == 'GASTOSXC') {
    doc.line(columna2_x - 1, valor_y - 5, columna2_x - 1, valor_y - 18)
    doc.line(columna3_x - 3, valor_y - 5, columna3_x - 3, valor_y - 18)
    doc.line(columna4_x - 3, valor_y - 5, columna4_x - 3, valor_y - 18)
  } else {
    doc.line(columna2_x - 3, valor_y - 5, columna2_x - 3, valor_y - 18)
    doc.line(columna3_x - 1, valor_y - 5, columna3_x - 1, valor_y - 18)
    doc.line(columna4_x - 3, valor_y - 5, columna4_x - 3, valor_y - 18)
    doc.line(columna5_x - 3, valor_y - 5, columna5_x - 3, valor_y - 18)
  }

  return valor_y
}
//formato de impresion de Grupos
async function imprimeGrupo(idGrupo, opcion, vm) {
  //opcion:
  //  AUTORIZACION    Envia de presupuesto a Autoriazacion de firma
  //  CONTABILIDAD    Envia de presupuesto a contabilidad las comprobaciones
  //  CONTABILIDADNP  Envia NPs de presupuesto a contabilidad
  //  TESORERIA       Envia de Autoizacion de firma a Pago
  //  GASTOSXC       Envia de Autoizacion de firma a presupuesto

  let jwt = await getValidToken(vm)
  if (idGrupo > 0) {
    await obtenerSolPagosImp(jwt, 0, vm, opcion, idGrupo)
    if (solPagosImpresion.length > 0) {
      var logo = new Image()
      let valor_y = 15
      let valor_x = 60
      let total = 0
      let cadena = ''
      // Imprimir documento orientacion Vertical
      var doc = new jsPDF('p', 'mm', 'letter')
      logo.src = require('@/assets/logo_ivey.jpg')

      //***************************************ENCABEZADO***************************************
      valor_y = imprimeEncabezadoGrupo(doc, valor_x, valor_y, opcion, idGrupo, logo)
      //***************************************TABLA*******************************************
      let linea_x_ini = 10
      let linea_x_fin = 210

      valor_y += 17
      let fila_y = valor_y
      //Folio
      let columna1_x = 11
      //Fecha Entrega
      let columna2_x = columna1_x + 30
      //Beneficiario
      let columna3_x = columna2_x + 30
      //Importe
      let columna4_x = columna3_x + 100
      let columna5_x = columna4_x + 42
      if (opcion == 'TESORERIA' || opcion == 'GASTOSXC') {
        columna3_x = columna2_x + 120
        columna4_x = columna3_x + 42
        linea_x_fin = columna1_x + columna2_x + columna3_x - 13
      }

      valor_y = imprimeEncabezadoTablaGrupo(
        doc,
        opcion,
        linea_x_ini,
        linea_x_fin,
        valor_y,
        fila_y,
        columna1_x,
        columna2_x,
        columna3_x,
        columna4_x,
        columna5_x
      )
      //****************************CONTENIDO TABLA*******************************************
      let numlineaAct = 0
      for (var i in solPagosImpresion) {
        doc.text(columna1_x + 3, valor_y, solPagosImpresion[i].sp_id)

        if (opcion == 'TESORERIA' || opcion == 'GASTOSXC') {
          doc.text(columna1_x + 3, valor_y, solPagosImpresion[i].sp_id)
          cadena = solPagosImpresion[i].sp_pago_nombre_de.substring(0, 31)
          doc.text(columna2_x, valor_y, cadena)

          total = total + parseFloat(solPagosImpresion[i].sp_importe)
          cadena = '$ ' + formatoImporte(solPagosImpresion[i].sp_importe)
          doc.text(columna3_x + 38, valor_y, cadena, {
            align: 'right',
          })
        } else {
          cadena = formatoFechaSpain(solPagosImpresion[i].sp_fecha_solicitud, false)
          doc.text(columna2_x - 1, valor_y, cadena)

          cadena = solPagosImpresion[i].sp_pago_nombre_de.substring(0, 31)

          doc.text(columna3_x, valor_y, cadena)

          total = total + parseFloat(solPagosImpresion[i].sp_importe)
          cadena = '$ ' + formatoImporte(solPagosImpresion[i].sp_importe)
          doc.text(columna4_x + 38, valor_y, cadena, {
            align: 'right',
          })
        }

        //linea horizontal de cada celda
        doc.line(linea_x_ini, valor_y + 1, linea_x_fin, valor_y + 1)
        //lineas verticales de cada celda
        doc.line(linea_x_ini, valor_y + 1, linea_x_ini, valor_y - 5)
        if (opcion == 'TESORERIA' || opcion == 'GASTOSXC') {
          doc.line(columna2_x - 1, valor_y + 1, columna2_x - 1, valor_y - 5)
          doc.line(columna3_x - 3, valor_y + 1, columna3_x - 3, valor_y - 5)
          doc.line(columna4_x - 3, valor_y + 1, columna4_x - 3, valor_y - 5)
        } else {
          doc.line(columna2_x - 3, valor_y + 1, columna2_x - 3, valor_y - 5)
          doc.line(columna3_x - 1, valor_y + 1, columna3_x - 1, valor_y - 5)
          doc.line(columna4_x - 3, valor_y + 1, columna4_x - 3, valor_y - 5)
          doc.line(columna5_x - 3, valor_y + 1, columna5_x - 3, valor_y - 5)
        }

        valor_y += 6
        numlineaAct += 1
        if (numlineaAct == numLineasDetVertical) {
          numlineaAct = 0
          doc.addPage()
          valor_y = 15
          valor_x = 60
          valor_y = imprimeEncabezadoGrupo(doc, valor_x, valor_y, opcion, idGrupo, logo)
          valor_y += 17
          valor_y = imprimeEncabezadoTablaGrupo(
            doc,
            opcion,
            linea_x_ini,
            linea_x_fin,
            valor_y,
            fila_y,
            columna1_x,
            columna2_x,
            columna3_x,
            columna4_x,
            columna5_x
          )
        }
      }
      //****************************RESUMEN FINAL*******************************************
      valor_y += 7
      if (solPagosImpresion.length == 1) {
        cadena = ' Solicitud'
      } else {
        cadena = ' Solicitudes'
      }

      doc.text(columna1_x + 3, valor_y, solPagosImpresion.length + cadena)
      cadena = 'TOTAL  $ ' + formatoImporte(total)
      if (opcion == 'TESORERIA' || opcion == 'GASTOSXC') {
        doc.text(columna3_x + 38, valor_y, cadena, {
          align: 'right',
        })
      } else {
        doc.text(columna4_x + 38, valor_y, cadena, {
          align: 'right',
        })
      }

      //Usuario elaboro
      valor_y += 50
      linea_x_ini = 55
      linea_x_fin = linea_x_ini + 90
      let centro_linea = (linea_x_fin - linea_x_ini) / 2
      columna1_x = linea_x_ini + 1
      doc.text(columna1_x + 35, valor_y - 7, 'ELABORO')
      doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
      if (opcion == 'AUTORIZACION') {
        cadena = solPagosImpresion[0].nombre_firma_aut_ida
      } else if (opcion == 'CONTABILIDAD') {
        cadena = solPagosImpresion[0].nombre_usr_fingxc
      } else if (opcion == 'CONTABILIDADNP') {
        cadena = solPagosImpresion[0].nombre_envio_cont_np
      } else if (opcion == 'TESORERIA') {
        cadena = solPagosImpresion[0].nombre_firma_aut_vuelta
      } else if (opcion == 'GASTOSXC') {
        cadena = solPagosImpresion[0].nombre_conta_gasxcomp
      }

      let centro_cadena = cadena.length / 2
      let col_centrado = centro_linea - centro_cadena + linea_x_ini - 15
      doc.text(col_centrado, valor_y, cadena.toUpperCase())

      //GUARDA documento
      return doc.save(nombArchivo + idGrupo + '.pdf')
    }
  }
}
//  IMPRIMEGRUPOCOMPDEV
//Encabezao de imprimeGrupoCompDev
function imprimeEncabezadoGrupoCompDev(doc, opcion, logo, idGrupo, valor_x, valor_y) {
  let cadena
  doc.addImage(logo, 'JPEG', 10, 10, 50, 15)
  doc.setFontSize(14)
  doc.text(valor_x, valor_y, 'INSTITUTO DE VIVIENDA DEL ESTADO DE YUCATAN')
  valor_y += 7
  doc.text(valor_x + 10, valor_y, 'REPORTE DE DOCUMENTOS ENTREGADOS')
  valor_y += 7
  if (opcion == 'DEVENGADO') {
    doc.text(valor_x + 15, valor_y, 'DEVENGADOS')
    nombArchivo = 'gpoDevengado'
  } else if (opcion == 'COMPROMETIDO' || opcion == 'COMPROMETIDO_PRE') {
    doc.text(valor_x + 15, valor_y, 'COMPROMETIDOS')
    nombArchivo = 'gpoComprometido'
  }
  valor_y += 7
  doc.text(valor_x + 17, valor_y, 'DE CONTROL PRESUPUESTAL')

  valor_y += 7
  cadena = formatoFechaSpain(solPagosImpresion[0].sp_fecha_gpo_folios, false)
  doc.text(valor_x + 75, valor_y, 'FECHA: ' + cadena)
  doc.text(valor_x, valor_y, 'Grupo No. ' + idGrupo)

  return valor_y
}
//Encabezado de Tabla de imprimeGrupoCompDev
function imprimeEncabezadoTablaGrupoCompDev(
  doc,
  opcion,
  linea_x_ini,
  linea_x_fin,
  columna1_x,
  columna2_x,
  columna2_2_x,
  columna3_x,
  columna4_x,
  columna5_x,
  valor_y,
  fila_y
) {
  doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)

  doc.text(columna1_x, fila_y, 'Folio')
  doc.text(columna2_x, fila_y, 'Fecha')
  if (opcion == 'DEVENGADO') {
    doc.text(columna2_x, fila_y + 5, 'Devengado')
  } else if (opcion == 'COMPROMETIDO' || opcion == 'COMPROMETIDO_PRE') {
    doc.text(columna2_x, fila_y + 5, 'Comprometido')
  }
  doc.text(columna2_2_x, fila_y, 'Folio')
  if (opcion == 'DEVENGADO') {
    doc.text(columna2_2_x, fila_y + 5, 'Devengado')
  } else if (opcion == 'COMPROMETIDO' || opcion == 'COMPROMETIDO_PRE') {
    doc.text(columna2_2_x, fila_y + 5, 'Comprometido')
  }

  doc.text(columna3_x, fila_y, 'Beneficiario')
  doc.text(columna4_x, fila_y, '$ Importe')
  valor_y += 13

  doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
  //4 lineas verticales
  doc.line(linea_x_ini, valor_y - 5, linea_x_ini, valor_y - 18)
  doc.line(columna2_x - 3, valor_y - 5, columna2_x - 3, valor_y - 18)
  doc.line(columna2_2_x - 3, valor_y - 5, columna2_2_x - 3, valor_y - 18)
  doc.line(columna3_x - 1, valor_y - 5, columna3_x - 1, valor_y - 18)
  doc.line(columna4_x - 3, valor_y - 5, columna4_x - 3, valor_y - 18)
  doc.line(columna5_x - 3, valor_y - 5, columna5_x - 3, valor_y - 18)

  return valor_y
}
//Formato de impresion de Comprometidos y Devengados
async function imprimeGrupoCompDev(idGrupo, opcion, vm) {
  if (idGrupo > 0) {
    let jwt = await getValidToken(vm)
    await obtenerFoliosImp(jwt, opcion, idGrupo, vm)
    if (solPagosImpresion.length > 0) {
      //let nombArchivo = ''
      // Imprimir documento orientacion Horizontal
      var doc = new jsPDF('l', 'mm', 'letter')
      var logo = new Image()
      let valor_y = 15
      let valor_x = 60
      let total = 0
      logo.src = require('@/assets/logo_ivey.jpg')
      //***************************************ENCABEZADO***************************************
      valor_y = imprimeEncabezadoGrupoCompDev(doc, opcion, logo, idGrupo, valor_x, valor_y)

      //***************************************TABLA*******************************************
      let linea_x_ini = 10
      let linea_x_fin = 270
      valor_y += 17
      let fila_y = valor_y
      //Folio
      let columna1_x = 11
      //Fecha Entrega
      let columna2_x = columna1_x + 30
      let columna2_2_x = columna2_x + 40
      //Beneficiario
      let columna3_x = columna2_2_x + 40
      //Importe
      let columna4_x = columna3_x + 110
      let columna5_x = columna4_x + 42
      //Encabesados de la Tabla
      valor_y = imprimeEncabezadoTablaGrupoCompDev(
        doc,
        opcion,
        linea_x_ini,
        linea_x_fin,
        columna1_x,
        columna2_x,
        columna2_2_x,
        columna3_x,
        columna4_x,
        columna5_x,
        valor_y,
        fila_y
      )
      //****************************CONTENIDO TABLA*******************************************
      let cadena
      let numlineaAct = 0
      for (var i in solPagosImpresion) {
        doc.text(columna1_x + 3, valor_y, solPagosImpresion[i].sp_id)
        cadena = formatoFechaSpain(solPagosImpresion[i].folio_fecha, false)
        doc.text(columna2_x - 1, valor_y, cadena)
        cadena = solPagosImpresion[i].folio_num
        doc.text(columna2_2_x - 1, valor_y, cadena)
        cadena = solPagosImpresion[i].sp_pago_nombre_de.substring(0, 31)
        doc.text(columna3_x, valor_y, cadena)
        total = total + parseFloat(solPagosImpresion[i].sp_importe)
        cadena = '$ ' + formatoImporte(solPagosImpresion[i].sp_importe)
        doc.text(columna4_x + 38, valor_y, cadena, {
          align: 'right',
        })
        //linea horizontal de cada celda
        doc.line(linea_x_ini, valor_y + 1, linea_x_fin, valor_y + 1)
        //lineas verticales de cada celda
        doc.line(linea_x_ini, valor_y + 1, linea_x_ini, valor_y - 5)
        doc.line(columna2_x - 3, valor_y + 1, columna2_x - 3, valor_y - 5)
        doc.line(columna2_2_x - 3, valor_y + 1, columna2_2_x - 3, valor_y - 5)
        doc.line(columna3_x - 1, valor_y + 1, columna3_x - 1, valor_y - 5)
        doc.line(columna4_x - 3, valor_y + 1, columna4_x - 3, valor_y - 5)
        doc.line(columna5_x - 3, valor_y + 1, columna5_x - 3, valor_y - 5)

        valor_y += 6
        numlineaAct += 1
        if (numlineaAct == numLineasDetHorizontal) {
          numlineaAct = 0
          doc.addPage()
          valor_y = 15
          valor_x = 60
          valor_y = imprimeEncabezadoGrupoCompDev(doc, opcion, logo, idGrupo, valor_x, valor_y)
          valor_y += 17
          valor_y = imprimeEncabezadoTablaGrupoCompDev(
            doc,
            opcion,
            linea_x_ini,
            linea_x_fin,
            columna1_x,
            columna2_x,
            columna2_2_x,
            columna3_x,
            columna4_x,
            columna5_x,
            valor_y,
            fila_y
          )
        }
      }
      //Resumen Final
      valor_y += 7
      if (solPagosImpresion.length == 1) {
        cadena = ' Solicitud'
      } else {
        cadena = ' Solicitudes'
      }
      doc.text(columna1_x + 3, valor_y, solPagosImpresion.length + cadena)
      cadena = 'TOTAL  $ ' + formatoImporte(total)
      doc.text(columna4_x + 38, valor_y, cadena, {
        align: 'right',
      })
      return doc.save(nombArchivo + idGrupo + '.pdf')
    }
  }
}
//  IMPRIMEGRUPOEJERCIDO
//Encabeezado de imprimeGrupoEjercido
function imprimeEncabezadoGrupoEjercido(doc, logo, idGrupo, valor_x, valor_y) {
  doc.addImage(logo, 'JPEG', 10, 10, 50, 15)
  doc.setFontSize(14)
  doc.text(valor_x, valor_y, 'INSTITUTO DE VIVIENDA DEL ESTADO DE YUCATAN')
  valor_y += 7
  doc.text(valor_x + 10, valor_y, 'RELACION DE SOLICITUDES EJERCIDAS')
  valor_y += 7
  let cadena = formatoFechaSpain(solPagosImpresion[0].sp_fecha_envia_ejercido, false)
  doc.text(valor_x + 75, valor_y, 'FECHA: ' + cadena)
  doc.text(valor_x, valor_y, 'Grupo No. ' + idGrupo)

  return valor_y
}
//Encabeezado de Tabla de imprimeGrupoEjercido
function imprimeEncabezadoTablaGrupoEjercido(
  doc,
  linea_x_ini,
  linea_x_fin,
  columna1_x,
  columna2_x,
  columna3_x,
  columna4_x,
  columna5_x,
  columna6_x,
  columna7_x,
  columna8_x,
  valor_y,
  fila_y
) {
  doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)

  doc.text(columna1_x + 3, fila_y, 'Folio')

  doc.text(columna2_x, fila_y, 'Folio')
  doc.text(columna2_x, fila_y + 5, 'Comprometido')

  doc.text(columna3_x, fila_y, 'Fecha')
  doc.text(columna3_x, fila_y + 5, 'Ejercido')

  doc.text(columna4_x, fila_y, 'Folio')
  doc.text(columna4_x, fila_y + 5, 'Ejercido')

  doc.text(columna5_x, fila_y, 'Poliza')
  doc.text(columna5_x, fila_y + 5, 'Ejercido')

  doc.text(columna6_x, fila_y, 'Beneficiario')

  doc.text(columna7_x, fila_y, '$ Importe')

  valor_y += 13
  //linea horizontal superior
  doc.line(linea_x_ini, valor_y - 5, linea_x_fin, valor_y - 5)
  //lineas verticales
  doc.line(columna1_x, valor_y - 5, columna1_x, valor_y - 18)
  doc.line(columna2_x - 3, valor_y - 5, columna2_x - 3, valor_y - 18)
  doc.line(columna3_x - 1, valor_y - 5, columna3_x - 1, valor_y - 18)
  doc.line(columna4_x - 3, valor_y - 5, columna4_x - 3, valor_y - 18)
  doc.line(columna5_x - 3, valor_y - 5, columna5_x - 3, valor_y - 18)
  doc.line(columna6_x - 3, valor_y - 5, columna6_x - 3, valor_y - 18)
  doc.line(columna7_x - 3, valor_y - 5, columna7_x - 3, valor_y - 18)
  doc.line(columna8_x - 3, valor_y - 5, columna8_x - 3, valor_y - 18)

  return valor_y
}
//formato de impresion de Ejercidos - Horizontal
async function imprimeGrupoEjercido(idGrupo, opcion, vm) {
  if (idGrupo > 0) {
    let cadena
    nombArchivo = 'rse_'
    let jwt = await getValidToken(vm)
    await obtenerFoliosImp(jwt, opcion, idGrupo, vm)
    if (solPagosImpresion.length > 0) {
      // Imprimir documento orientacion Horizontal
      var doc = new jsPDF('l', 'mm', 'letter')
      var logo = new Image()
      let valor_y = 15
      //let valor_x = 60
      let valor_x = 80
      let total = 0
      logo.src = require('@/assets/logo_ivey.jpg')
      //***************************************ENCABEZADO***************************************
      valor_y = imprimeEncabezadoGrupoEjercido(doc, logo, idGrupo, valor_x, valor_y)
      //***************************************TABLA*******************************************
      //let linea_x_ini = 10
      let linea_x_ini = 5
      //let linea_x_fin = 280
      let linea_x_fin = 274
      valor_y += 17
      let fila_y = valor_y
      //Folio_id
      let columna1_x = linea_x_ini
      //Folio Comprometido
      let columna2_x = columna1_x + 26
      //Fecha Ejercido
      let columna3_x = columna2_x + 36
      //folio Ejercido
      let columna4_x = columna3_x + 35
      //Poliza Ejercido
      let columna5_x = columna4_x + 26
      //Beneficiario
      let columna6_x = columna5_x + 26
      //Importe
      //let columna7_x = columna6_x + 85
      let columna7_x = columna6_x + 85
      let columna8_x = columna7_x + 38
      //***********************************************************************
      valor_y = imprimeEncabezadoTablaGrupoEjercido(
        doc,
        linea_x_ini,
        linea_x_fin,
        columna1_x,
        columna2_x,
        columna3_x,
        columna4_x,
        columna5_x,
        columna6_x,
        columna7_x,
        columna8_x,
        valor_y,
        fila_y
      )
      //****************************CONTENIDO TABLA*******************************************
      let numlineaAct = 0
      for (var i in solPagosImpresion) {
        //folio id
        doc.text(columna1_x + 3, valor_y, solPagosImpresion[i].sp_id)
        //Folio Comprometido
        doc.text(columna2_x + 3, valor_y, solPagosImpresion[i].comprometido)
        //Fecha Ejercido
        cadena = formatoFechaSpain(solPagosImpresion[i].sp_fecha_ejercido_cap)
        doc.text(columna3_x + 3, valor_y, cadena)
        //folio Ejercido
        cadena = solPagosImpresion[i].sp_folio_ejercido
        doc.text(columna4_x - 1, valor_y, cadena)
        //Poliza Ejercido
        cadena = solPagosImpresion[i].sp_poliza_ejercido
        doc.text(columna5_x - 1, valor_y, cadena)
        //Beneficiario
        cadena = solPagosImpresion[i].sp_pago_nombre_de.substring(0, 29)
        //cambiar tamaño de letra
        doc.setFontSize(12)
        doc.text(columna6_x, valor_y, cadena)
        doc.setFontSize(14)
        //Importe
        total = total + parseFloat(solPagosImpresion[i].sp_importe)
        cadena = '$ ' + formatoImporte(solPagosImpresion[i].sp_importe)
        doc.text(columna7_x + 34, valor_y, cadena, {
          align: 'right',
        })
        //linea horizontal de cada celda
        doc.line(linea_x_ini, valor_y + 1, linea_x_fin, valor_y + 1)
        //lineas verticales de cada celda
        doc.line(columna1_x, valor_y + 1, columna1_x, valor_y - 5)
        doc.line(columna2_x - 3, valor_y + 1, columna2_x - 3, valor_y - 5)
        doc.line(columna3_x - 1, valor_y + 1, columna3_x - 1, valor_y - 5)
        doc.line(columna4_x - 3, valor_y + 1, columna4_x - 3, valor_y - 5)
        doc.line(columna5_x - 3, valor_y + 1, columna5_x - 3, valor_y - 5)
        doc.line(columna6_x - 3, valor_y + 1, columna6_x - 3, valor_y - 5)
        doc.line(columna7_x - 3, valor_y + 1, columna7_x - 3, valor_y - 5)
        doc.line(columna8_x - 3, valor_y + 1, columna8_x - 3, valor_y - 5)

        valor_y += 6
        numlineaAct += 1
        if (numlineaAct == numLineasDetHorizontal) {
          numlineaAct = 0
          doc.addPage()
          valor_y = 15
          valor_x = 60
          valor_y = imprimeEncabezadoGrupoEjercido(doc, logo, idGrupo, valor_x, valor_y)
          valor_y += 17
          valor_y = imprimeEncabezadoTablaGrupoEjercido(
            doc,
            linea_x_ini,
            linea_x_fin,
            columna1_x,
            columna2_x,
            columna3_x,
            columna4_x,
            columna5_x,
            columna6_x,
            columna7_x,
            columna8_x,
            valor_y,
            fila_y
          )
        }
      }
      //Resumen Final
      valor_y += 7
      if (solPagosImpresion.length == 1) {
        cadena = ' Solicitud'
      } else {
        cadena = ' Solicitudes'
      }
      doc.text(columna1_x + 3, valor_y, solPagosImpresion.length + cadena)
      cadena = 'TOTAL  $ ' + formatoImporte(total)
      doc.text(columna7_x + 34, valor_y, cadena, {
        align: 'right',
      })

      return doc.save(nombArchivo + idGrupo + '.pdf')
    }
  }
}
//Funcion para dividir e imprimir en varias filas
function ImprimeCadenaEnVariasFilas(doc, cadena, customLength, columna2_x, fila_y) {
  let maxLength = cadena.length,
    cadenaNew = '',
    cadenaImp = '',
    palabra = '',
    filaSig = 0,
    actualLength = 0,
    impUltLinea = false,
    totalCadenaImp = 0,
    caracter = '',
    cadenaAnt = ''

  for (let i = 0; i < maxLength; i++) {
    caracter = cadena.charAt(i)
    if (caracter == ' ') {
      //fin de palabra
      //verificar si cadena es mayor que el limite
      if (cadenaNew.length == 0) {
        actualLength = cadenaNew.length + palabra.length
      } else {
        actualLength = cadenaNew.length + palabra.length + 1
      }

      //console.log(cadenaNew, palabra)
      //console.log('actualLength', actualLength)
      if (actualLength >= customLength) {
        //console.log('OPCION 1: SE PASA')
        //console.log('actualLength >= customLength', actualLength, customLength)

        if (actualLength > customLength) {
          cadenaImp = cadenaNew
          cadenaNew = palabra
        } else {
          cadenaImp = cadenaNew + ' ' + palabra
          cadenaNew = ''
        }
        //31/Agosto/2022
        actualLength = cadenaNew.length

        doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
        //console.log('Imprime 1: ', cadenaImp.toUpperCase().trim())
        filaSig = filaSig + 5
        palabra = ''
        totalCadenaImp = totalCadenaImp + cadenaImp.length
      } else if (cadenaNew.length + palabra.length >= customLength) {
        console.log('OPCION 2: MEDIO')
        console.log(
          'cadenaNew.length + palabra.length >= customLength',
          cadenaNew.length + palabra.length,
          customLength
        )
        if (actualLength > customLength) {
          cadenaImp = cadenaNew
          cadenaNew = palabra
        } else {
          cadenaImp = cadenaNew + ' ' + palabra
          cadenaNew = ''
        }
        //31/Agosto/2022
        actualLength = cadenaNew.length

        doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
        //console.log('Imprime 1.2: ', cadenaImp.toUpperCase().trim())
        filaSig = filaSig + 5
        palabra = ''
        totalCadenaImp = totalCadenaImp + cadenaImp.length
      } /* else if (actualLength == maxLength - cadenaNew.length - totalCadenaImp) {
        console.log('actualLength == maxLength - cadenaNew.length - totalCadenaImp')
        console.log('actualLength', actualLength)
        console.log('maxLength', maxLength)
        console.log('cadenaNew.length', cadenaNew.length)
        console.log('totalCadenaImp', totalCadenaImp)

        //cadenaImp = cadenaNew + ' ' + palabra
        cadenaImp = cadenaNew
        console.log('cadenaNew', cadenaNew)
        console.log('palabra', palabra)
        if (i < maxLength) {
          palabra = cadena.substring(i, maxLength)
          cadenaImp = cadenaImp + ' ' + palabra
        }
        doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
        console.log('Imprime 2: ', cadenaImp.toUpperCase().trim())
        impUltLinea = true
      } */ else {
        //console.log('OPCION 3: ELSE')
        //31/Agosto/2022
        //console.log('else {')
        //OJOOOOOO se paso abajo

        cadenaAnt = cadenaNew
        if (cadenaNew == '') {
          cadenaNew = palabra
        } else {
          cadenaNew = cadenaNew + ' ' + palabra
        }

        //6/SEP/2022
        actualLength = cadenaNew.length
        //console.log('cadenaNew', cadenaNew)
        //console.log('actualLength', actualLength)
        if (actualLength >= customLength) {
          //console.log(' SEGUNDA -> ')
          //console.log('actualLength >= customLength', actualLength, customLength)
          //console.log('cadena.length', cadena.length)
          //console.log('palabra', palabra)
          //console.log('cadenaAnt', cadenaAnt)
          if (actualLength > customLength) {
            //cadenaImp = cadenaNew
            cadenaImp = cadenaAnt
            cadenaNew = palabra
          } else {
            cadenaImp = cadenaNew + ' ' + palabra
            //cadenaImp = cadenaAnt + ' ' + palabra
            cadenaNew = ''
          }
          //31/Agosto/2022
          //actualLength = cadenaNew.length
          actualLength = cadenaNew.length

          doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
          //console.log('Imprime 1.3: ', cadenaImp.toUpperCase().trim())
          filaSig = filaSig + 5
          palabra = ''
          totalCadenaImp = totalCadenaImp + cadenaImp.length
        }
        /*
        else {
          cadenaAnt = cadenaNew
          if (cadenaNew == '') {
            cadenaNew = palabra
          } else {
            cadenaNew = cadenaNew + ' ' + palabra
          }
          palabra = ''
        }*/
        palabra = ''
      }
    } else {
      palabra = palabra + caracter
    }
    if (i == maxLength - 1) {
      if (!impUltLinea) {
        //console.log('TERMINO if principal')
        //console.log('i', i)
        //console.log('maxLength', maxLength)
        //console.log('impUltLinea', impUltLinea)
        if (cadenaNew.length == 0) {
          actualLength = cadenaNew.length + palabra.length
        } else {
          actualLength = cadenaNew.length + palabra.length + 1
        }
        //console.log('actualLength', actualLength)

        if (actualLength >= customLength) {
          if (actualLength > customLength) {
            //cadenaImp = cadenaNew
            cadenaImp = cadenaNew
            cadenaNew = palabra
            doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
            filaSig = filaSig + 5
            cadenaImp = palabra
            doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
          } else {
            cadenaImp = cadenaNew + ' ' + palabra
            //cadenaImp = cadenaAnt + ' ' + palabra
            cadenaNew = ''
            doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
          }
        } else {
          cadenaImp = cadenaNew + ' ' + palabra
          doc.text(columna2_x, fila_y + filaSig, cadenaImp.toUpperCase().trim())
          //console.log('Imprime 2: ', cadenaImp.toUpperCase().trim())
          //console.log('cadenaImp.length', cadenaImp.length)
        }
      }
    }
  }

  return fila_y
}
export { imprimeFormatoSolPag, imprimeGrupo, imprimeGrupoCompDev, imprimeGrupoEjercido }
