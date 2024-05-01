/**
 * @fileoverview Contiene el archivo del store de Ordenos
 *
 * @version 1.0
 *
 * @copyright Shuttle Express Mexico
 *
 * Historial
 *
 * ----
 * La primera versión fue escrita por Roger Gala Pacheco
 */

import OrdenServicioServices from '@/services/sica/ordenes_servicio.services'
export const namespaced = true

export const actions = {
     /**
   * @name fetchOrden
   * @description Obtiene una lista de Ordenes
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para poblar el select
   */
  fetchOrdenServ(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return OrdenServicioServices.getOrderServ(payload.jwt, params)
    },
    fetchOrdenServDet(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return OrdenServicioServices.getOrderServDet(payload.jwt, params)
    },
      /**
   * @name addOrdenServ
   * @description Crea un nuevo Orden servicio
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para crear un nuevo Ordeno
   */
  addOrdenServ(context, payload) {
    return OrdenServicioServices.postOrderServ(payload.jwt, payload.body)
  },
    /**
   * @name editOrdenServ
   * @description Edita Orden servicio
   *
   * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
   * @param {*} payload Parametros para editar un Ordeno
   */
  editOrdenServ(context, payload) {
    return OrdenServicioServices.putOrderServ(payload.jwt, payload.body, payload.id)
  },
}