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
  getOrderServ(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('ordensica/ordenesServicio/' + params)
    }
    return Api.get('ordensica/ordenesServicio/')
  },
  getOrderServDet(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('ordensica/orDetSer/' + params)
    }
    return Api.get('ordensica/orDetSer/')
  },
    /**
   * @name post Crear orden serv
   * @description Se crea el detalle de los productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postOrderServ(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('ordensica/crearOrdenServ/', body)
  },
    /**
   * @name putOrderServ
   * @description Se crea el detalle de los productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  putOrderServ(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('ordensica/actualizaOrdenServ/' + id, body)
  },
}