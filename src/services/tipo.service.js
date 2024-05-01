import axios from 'axios'
// URL de la API
const baseURL = process.env.VUE_APP_BASE_URL_API

// Objeto axios de la api de tipo
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
   * @name getTipo
   * @description Obtienen una lista de Tipos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getTipo(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('tipo/' + params)
    }
    return Api.get('tipo/')
  },

  /**
   * @name postTipo
   * @description Se crea el tipo
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postTipo(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('tipo', body)
  },

  /**
   * @name putTipo
   * @description Se actualiza el tipo
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  putTipo(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('tipo/' + id, body)
  },
  /**
   * @name deleteTipo
   * @description Se actualiza el tipo
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  deleteTipo(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.delete('tipo/' + id, body)
  },
}
