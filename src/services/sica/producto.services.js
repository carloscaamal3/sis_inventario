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
   * @name getProducto
   * @description Obtienen una lista de Productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getProducto(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('producto/' + params)
    }
    return Api.get('producto/')
  },

  /**
   * @name postProducto
   * @description Se crea la Productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postProducto(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('producto/', body)
  },

  /**
   * @name putProducto
   * @description Se actualiza la Productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  putProducto(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('producto/Actualizar/' + id, body)
  },
  /**
   * @name deleteProducto
   * @description Se actualiza el activo de Productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  deleteProducto(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.delete('producto/' + id, body)
  },
  /**
   * @name putUltimoProducto
   * @description Se actualiza la Productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  putUltimoProducto(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('producto/ActualizarUltimo/' + id, body)
  },
}
