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
   * @name getCasosEsp
   * @description Obtienen una lista de Clasificacion de tipos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getCasosEsp(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('/casosEsp/' + params)
    }
    return Api.get('/casosEsp/')
  },

  /**
   * @name postcasosEsp
   * @description Se crea la clasificacion de tipo
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postcasosEsp(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('casosEsp/', body)
  },

  /**
   * @name putcasosEsp
   * @description Se actualiza la clasificacion de tipo
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  putcasosEsp(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('casosEsp/' + id, body)
  },
  /**
   * @name deletecasosEsp
   * @description Se actualiza el activp de clasificacion de tipo
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  deletecasosEsp(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.delete('casosEsp/' + id, body)
  },
}
