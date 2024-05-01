/**
 * @fileoverview Contiene los servicios de consumo a la API para
 * Ordenes de compra
 *
 * @version 1.0
 *
 * @author Roger Gala Pacheco <rogapa@hotmail.com>
 *
 * @copyright
 *
 * Historial
 * ---------
 * La primera versión fue escrita por Roger Gala Pacheco
 */

import axios from 'axios'
// URL de la API
const baseURL = process.env.VUE_APP_BASE_URL_API

// Objeto axios de la api
const Api = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de espera
})

export default {
  /**
   * @name getOrders
   * @description Obtienen una lista de Ordenes
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getOrders(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('ordensica/ordenesCompra/' + params)
    }
    return Api.get('ordensica/ordenesCompra/')
  },
  getOrdersAll(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('ordensica/todos/' + params)
    }
    return Api.get('ordensica/todos/')
  },
  /**
   * @name getOrdersDet
   * @description Obtienen una lista de OrdenesDet
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getOrdersDet(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('ordensica/ordenesDet/' + params)
    }
    return Api.get('ordensica/ordenesDet/')
  },
  /**
   * @name postCreaDet
   * @description Se crea el detalle de los productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postCreaDet(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('ordensica/creaDet/', body)
  },
  /**
   * @name putOrderDet
   * @description Se crea el detalle de los productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  putOrderDet(jwt, body, id, posicion) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('ordensica/actualizaDet/' + id + '/' + posicion, body)
  },
  /**
   * @name postOrder
   * @description Se crea el detalle de los productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postOrder(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('ordensica/crea/', body)
  },
  postOrderServ(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('ordensica/crearOrdenServ/', body)
  },
  /**
   * @name putOrder
   * @description Se crea el detalle de los productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  putOrder(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('ordensica/actualiza/' + id, body)
  },
  putOrderServ(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('ordensica/actualizaOrdenServ/' + id, body)
  },
  putOrderEstatus(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('ordensica/EstOrd/' + id, body)
  },
  putOrdenSp(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('ordensica/EstOrdSp', body)
  },
  /**
   * @name getUltimaPosicion
   * @description Obtienen una lista de OrdenesDet
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getUltimaPosicion(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('ordensica/ultimapos/' + params)
    }
    return Api.get('ordensica/ultimapos/')
  },
  getUltimaPosicionDoc(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('ordensica/ultimaposdoc/' + params)
    }
    return Api.get('ordensica/ultimaposdoc/')
  },
  /*deleteOrDet(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.delete('ordensica/ordenesDet/' + id)
  },*/
  deleteOrDet(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.delete('ordensica/ordenesDetRec/' + id)
  },
  deleteOrden(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.delete('ordensica/cab/' + id)
  },
    /**
   * @name getOrdersSeg
   * @description Obtienen detalle de seguimiento
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
    getOrdersSeg(jwt, params) {
      Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
  
      if (params != null) {
        return Api.get('seguimiento/segOsNum/' + params)
      }
      return Api.get('seguimiento/segOsNum/')
    },
    postSeguimiento(jwt, body) {
      Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
      return Api.post('seguimiento/creaCampo', body)
    },
    putSeguimiento(jwt, body) {
      Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
      return Api.put('seguimiento/actCamp', body)
    },

    getCabList(jwt, params) {
      Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
      if (params != null) {
        return Api.get('productoLista/obtCab/' + params)
      }
      return Api.get('productoLista/obtCab')
    },
    
    getDetList(jwt, params) {
      Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
      if (params != null) {
    
        return Api.get('productoLista/obtDet/' + params)
      }
      return Api.get('productoLista/obtDet')
    },
    postCabList(jwt, body) {
      Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
      return Api.post('productoLista/creaCab/', body)
    },
    postDetList(jwt, body) {
      Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
      return Api.post('productoLista/creaDetalle/', body)
    },
    putCabtList(jwt, body) {
      Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
      return Api.put('productoLista/actualizaCab/', body)
    },

    putDetList(jwt, body) {
      Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
      return Api.put('productoLista/actulizaDet', body)
    },
    deleteDetList(jwt, body, id) {
      Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
      return Api.delete('productoLista/DelLicDet/' + id)
    },

}
