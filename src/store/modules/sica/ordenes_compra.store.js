/**
 * @fileoverview Contiene el archivo del store de Ordenos
 *
 * @version 1.0
 *
 * @author Roger Gala Pacheco <rogapa@hotmail.com>
 *
 * @copyright Shuttle Express Mexico
 *
 * Historial
 *
 * ----
 * La primera versión fue escrita por Roger Gala Pacheco
 */

import OrdenCompraServices from '@/services/sica/ordenes_compra.services'
export const namespaced = true

export const actions = {
  /**
   * @name addOrden
   * @description Crea un nuevo Ordeno
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para crear un nuevo Ordeno
   */
  addOrden(context, payload) {
    return OrdenCompraServices.postOrder(payload.jwt, payload.body)
  },
  addOrdenServ(context, payload) {
    return OrdenCompraServices.postOrderServ(payload.jwt, payload.body)
  },
  /**
   * @name fetchOrden
   * @description Obtiene una lista de Ordenes
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para poblar el select
   */
  fetchOrden(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return OrdenCompraServices.getOrders(payload.jwt, params)
  },
  /**
   * @name fetchOrdenDet
   * @description Obtiene el Detalle de una orden de compra
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para poblar el select
   */
  fetchOrdenDet(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return OrdenCompraServices.getOrdersDet(payload.jwt, params)
  },
  /**
   * @name editOrden
   * @description Edita un Ordeno
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para editar un Ordeno
   */
  editOrden(context, payload) {
    return OrdenCompraServices.putOrder(payload.jwt, payload.body, payload.id)
  },
  editOrdenServ(context, payload) {
    return OrdenCompraServices.putOrderServ(payload.jwt, payload.body, payload.id)
  },
    /**
   * @name editEstatus
   * @description Edita solo el campo estatus de la orden de compra
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para crear un nuevo Detalle de Orden de compra
   */
  editEstatus(context, payload) {
    return OrdenCompraServices.putOrderEstatus(payload.jwt, payload.body, payload.id)
  },
   /**
   * @name editEstatusSP
   * @description Edita el estatus de la orden basandose en su sp_id y en el sp_ejercicio
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para crear un nuevo Detalle de Orden de compra
   */
   editEstatusSP(context, payload) {
    return OrdenCompraServices.putOrdenSp(payload.jwt, payload.body)
  },
  /**
   * @name addCreaDet
   * @description Crea un nuevo Detalle de Orden de compra Existente
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para crear un nuevo Detalle de Orden de compra
   */
  addCreaDet(context, payload) {
    return OrdenCompraServices.postCreaDet(payload.jwt, payload.body)
  },
  /**
   * @name editOrdenDet
   * @description Edita un Ordeno
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para editar un Ordeno
   */
  editOrdenDet(context, payload) {
    return OrdenCompraServices.putOrderDet(payload.jwt, payload.body, payload.id, payload.posicion)
  },
  /**
   * @name fetchUltimaPosicion
   * @description Obtiene el Detalle de una orden de compra
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para poblar el select
   */
  fetchUltimaPosicion(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return OrdenCompraServices.getUltimaPosicion(payload.jwt, params)
  },
  fetchUltimaPosicionDoc(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return OrdenCompraServices.getUltimaPosicionDoc(payload.jwt, params)
  },
  fetchordersAll(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return OrdenCompraServices.getOrdersAll(payload.jwt, params)
  },
  deleteOrdenDet(context, payload) {
    return OrdenCompraServices.deleteOrDet(payload.jwt, payload.body, payload.id)
  },
  deleteOrden(context, payload)
  {
    return OrdenCompraServices.deleteOrden(payload.jwt, payload.body, payload.id)
  },
    /**
   * @name fetchOrdenSeg
   * @description Obtiene una lista de Ordenes
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para poblar el select
   */
    fetchOrdenSeg(context, payload) {
      let params = 'params' in payload ? payload.params : null
      return OrdenCompraServices.getOrdersSeg(payload.jwt, params)
    },
    addSeguimiento(context, payload) {
      return OrdenCompraServices.postSeguimiento(payload.jwt, payload.body)
    },
    editSeguimiento(context, payload) {
      return OrdenCompraServices.putSeguimiento(payload.jwt, payload.body, payload.id, payload.posicion)
    },
    fetchListCab(context, payload) {
      let params = 'params' in payload ? payload.params : null
      return OrdenCompraServices.getCabList(payload.jwt, params)
    },
    fetchListDet(context, payload) {
      let params = 'params' in payload ? payload.params : null
      return OrdenCompraServices.getDetList(payload.jwt, params)
    },
    addCabList(context, payload) {
      return OrdenCompraServices.postCabList(payload.jwt, payload.body)
    },
    addDetList(context, payload) {
      return OrdenCompraServices. postDetList(payload.jwt, payload.body)
    },
    editCabList(context, payload) {
      return OrdenCompraServices.putCabtList(payload.jwt, payload.body, payload.id)
    },
    editDetList(context, payload) {
      return OrdenCompraServices.putDetList(payload.jwt, payload.body)
    },
    deleteDetLis(context, payload) {
      return OrdenCompraServices.deleteDetList(payload.jwt, payload.body, payload.id)
    },

}
