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
   * @name getGeneral
   * @description Obtienen una lista de Clasificacion de tipos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getGeneral(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('/generales/' + params)
    }
    return Api.get('/generales/')
  },
}
