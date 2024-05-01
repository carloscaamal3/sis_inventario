/**
 * @fileoverview Contiene los configuracion de los interceptors
 *
 * @version 1.0
 *
 * @author Roger Gala Pacheco <rgdsgsoft@gmail.com>
 *
 * @copyright DesignSoft
 *
 * @Date 2022-09-22
 * Historial
 * ---------
 * La primera versión fue escrita por Roger Gala Pacheco
 */

import { getValidToken } from '../../helpers'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
//import * as tools from '@/store/modules/tools.store.js'
import * as tools from '../tools.store.js'

import { NumeroALetras } from '../numeroALetras'

export const namespaced = true
let ordenCompraImpresion = []
let ordenCompraDetImpresion = []
let nomnreArchivo = ''
let eFormatos = tools.formatos
let formato = tools.formato
//const numLineasDetVertical = 29

//Funciones privades
async function obtenerOrdencompraImp(jwt, osnumdoc, vm) {
  let params = null
  if (osnumdoc > 0) {
    params = osnumdoc
    if (jwt != null) {
      let payload = { jwt: jwt, params: params }
      ordenCompraImpresion = []
      await vm.$store
        .dispatch('ordenServicio/fetchOrdenServ', payload)
        .then((response) => {
          if (response.data.mensaje == undefined) {
            ordenCompraImpresion = response.data
            ordenCompraImpresion.sort((a, b) => a.osnumdoc - b.osnumdoc)
          }
          return ordenCompraImpresion
        })
        .catch((err) => {
          return err.response.data.error
        })
    }
  }
}
async function obtenerOrdencompraDetImp(jwt, osnumdoc, vm) {
  let params = null
  if (osnumdoc > 0) {
    params = osnumdoc
    if (jwt != null) {
      let payload = { jwt: jwt, params: params }
      ordenCompraDetImpresion = []
      await vm.$store
        .dispatch('ordenServicio/fetchOrdenServDet', payload)
        .then((response) => {
          if (response.data.mensaje == undefined) {
            ordenCompraDetImpresion = response.data

            ordenCompraDetImpresion.sort((a, b) => a.osnumdoc - b.osnumdoc)
          }
          return ordenCompraDetImpresion
        })
        .catch((err) => {
          return err.response.data.error
        })
    }
  }
}
/* function formato(opcion, valor) {
  if (opcion == eFormatos.IMPORTE) {
    return tools.formatoImporte(valor)
  } else if (opcion == eFormatos.MONEDA) {
    return tools.formatoMoneda(valor)
  } else if (opcion == eFormatos.MONEDA_RIGHT) {
    return tools.formatoMonedaRight(valor)
  } else if (opcion == eFormatos.FECHA) {
    return tools.convierteNumeroFechaVista(valor)
  } else if (opcion == eFormatos.FECHA_FORMATO) {
    return tools.fechaformato(valor)
  }
} */
//******************************************************************************************************* */
//funciones Publicas
async function imprimeFormatoOrdenServ(osNumDoc, vm) {
  let jwt = await getValidToken(vm)
  await obtenerOrdencompraImp(jwt, osNumDoc, vm)
  await obtenerOrdencompraDetImp(jwt, osNumDoc, vm)
 
  if (ordenCompraImpresion.length > 0 && ordenCompraDetImpresion.length > 0) {
    var doc = new jsPDF('p', 'mm', 'letter')
    //console.log('doc.getFont()', doc.getFont())
    let valor_y = 62
    let valor_x = 25 + 2
    let valor_x2 = 160
    let cadena = ''

    doc.setFontSize(8)

    //SE IMPRIME RAZON SOCIAL Y FECHA
    cadena = ordenCompraImpresion[0].prov_razon_social
    doc.text(valor_x, valor_y, cadena)
    cadena = formato(eFormatos.FECHA_BARRA, ordenCompraImpresion[0].osFecha)
    doc.text(valor_x2, valor_y, cadena)
    valor_y += 13 - 2

    //SE IMPRIME DOMICILIO Y CIUDAD
    cadena = ordenCompraImpresion[0].prov_direccion
    doc.text(valor_x, valor_y, cadena.toUpperCase())
    cadena = ordenCompraImpresion[0].prov_ciudad
    doc.text(valor_x2, valor_y, cadena.toUpperCase())

    //**************************************************************************** */
    //Se Imprime el Detalle
    //para el detalle
    let x_cant = 15
    let x_unidad = x_cant + 15
    let x_articulo = x_unidad + 20
    let x_precio = x_articulo + 130
    let x_total = x_precio + 23

    doc.setFontSize(6)
    valor_y += 17
    for (var i in ordenCompraDetImpresion) {
      cadena = ordenCompraDetImpresion[i].osDetCantidad
      //console.log('x_total', x_total)
      doc.text(x_cant, valor_y, formato(eFormatos.IMPORTE, cadena))
      cadena = ordenCompraDetImpresion[i].unidad_id_det_desc
      doc.text(x_unidad, valor_y, cadena)
      cadena = ordenCompraDetImpresion[i].prod_descripcion
      doc.text(x_articulo, valor_y, cadena.toUpperCase())
      cadena = ordenCompraDetImpresion[i].osDetPrecio
      doc.text(x_precio, valor_y, formato(eFormatos.MONEDA, cadena), { align: 'right' })
      cadena = ordenCompraDetImpresion[i].osDetSubtotal
      doc.text(x_total, valor_y, formato(eFormatos.MONEDA, cadena), { align: 'right' })

      valor_y += 5
    }
    //**************************************************************************** */
    //FECHA LIMITE DE ENTREGA
    doc.setFontSize(5)
    valor_y = 190
    valor_x = 15
    valor_x2 = 50
    cadena = 'FECHA LIMITE DE ENTREGA'
    doc.text(valor_x, valor_y, cadena)
    cadena = formato(eFormatos.FECHA_BARRA, ordenCompraImpresion[0].osFechaLimEntrega)
    doc.text(valor_x2, valor_y, cadena)
    //LUGAR DE ENTREGA
    valor_y += 5
    cadena = 'LUGAR DE ENTREGA'
    doc.text(valor_x, valor_y, cadena)
    cadena = ordenCompraImpresion[0].osLugarEntrega
    doc.text(valor_x2, valor_y, cadena.toUpperCase())
    //FECHA POSIBLE DE PAGO A LA
    valor_y += 5
    cadena = 'FECHA POSIBLE DE PAGO A LA'
    doc.text(valor_x, valor_y, cadena)
    //RECEPCION DE LA FACTURA
    valor_y += 3
    cadena = 'RECEPCION DE LA FACTURA'
    doc.text(valor_x, valor_y, cadena)
    cadena = 'CREDITO ' + ordenCompraImpresion[0].osDiasCredito + ' DIAS'
    doc.text(valor_x2, valor_y, cadena.toUpperCase())
    //AREA SOLICITANNTE
    //doc.setFont('Helvetica', 'bold', 'normal')
    doc.setFont('Helvetica', 'bold')
    valor_y += 5
    cadena = 'area solicitante'
    doc.text(valor_x, valor_y, cadena.toUpperCase())
    doc.setFont('Helvetica', 'normal')
    cadena = ordenCompraImpresion[0].osDeptoSolicita
    doc.text(valor_x2, valor_y, cadena.toUpperCase())
    //AREA DESTINO
    doc.setFont('Helvetica', 'bold')
    valor_y += 5
    cadena = 'area destino'
    doc.text(valor_x, valor_y, cadena.toUpperCase())
    cadena = ordenCompraImpresion[0].osDeptoDestino
    //RESALTAR AREA DE DESTINO
    doc.setFillColor(163, 169, 164)
    doc.rect(valor_x2, valor_y - 2, cadena.length + 5, 3, 'F')
    doc.text(valor_x2, valor_y, cadena.toUpperCase())

    //SOLICITA y AUTORIZA
    valor_y += 17
    cadena = 'solicita'
    doc.text(valor_x + 15, valor_y, cadena.toUpperCase(), { align: 'center' })
    cadena = 'autoriza'
    doc.text(x_precio, valor_y, cadena.toUpperCase(), { align: 'center' })

    valor_y += 8
    cadena = ordenCompraImpresion[0].titulo_sol + ' ' + ordenCompraImpresion[0].nombre_sol
    doc.text(valor_x, valor_y, cadena.toUpperCase())
    cadena = ordenCompraImpresion[0].titulo_aut + ' ' + ordenCompraImpresion[0].nombre_aut
    doc.text(x_precio - 15, valor_y, cadena.toUpperCase())

    valor_y += 3
    cadena = ordenCompraImpresion[0].puesto_sol
    doc.text(valor_x, valor_y, cadena.toUpperCase())
    cadena = ordenCompraImpresion[0].puesto_aut
    doc.text(x_precio - 15, valor_y, cadena.toUpperCase())

    //**************************************************************************** */
    //SUBTOTAL
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    valor_y = 210
    cadena = 'SUBTOTAL'
    doc.text(x_precio - 15, valor_y, cadena.toUpperCase())
    cadena = ordenCompraImpresion[0].osSubTotal
    doc.text(x_total, valor_y, formato(eFormatos.MONEDA, cadena), { align: 'right' })
    //IVA
    valor_y += 5
    cadena = 'IVA'
    doc.text(x_precio - 15, valor_y, cadena.toUpperCase())
    cadena = ordenCompraImpresion[0].osIva
    doc.text(x_total, valor_y, formato(eFormatos.MONEDA, cadena), { align: 'right' })
    //TOTAL
    valor_y += 5
    cadena = 'TOTAL'
    doc.text(x_precio - 15, valor_y, cadena.toUpperCase())
    console.log("total",cadena = ordenCompraImpresion[0].osTotal )
    cadena = ordenCompraImpresion[0].osTotal
    doc.text(x_total, valor_y, formato(eFormatos.MONEDA, cadena), { align: 'right' })
    //TOTAL EN LETRAS
    //valor_y += 10
    cadena = 'son:'
    doc.text(valor_x, valor_y, cadena.toUpperCase())
    cadena = NumeroALetras(ordenCompraImpresion[0].osTotal)
    doc.text(valor_x2, valor_y, cadena.toUpperCase())

    //**************************************************************************** */
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    //GUARDA documento
    nomnreArchivo = 'ordenservicio_' + osNumDoc + '_pdf'
    return doc.save(nomnreArchivo)
  }
}


export { imprimeFormatoOrdenServ }
