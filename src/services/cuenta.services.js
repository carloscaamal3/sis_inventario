import axios from 'axios'
// URL de la API
const baseURL = process.env.VUE_APP_BASE_URL_API

// Objeto axios de la api de Cuenta
const apiCuenta = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de espera
})

export default {
  /**
   * @name getCuenta
   * @description Obtienen una lista de Cuentas
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getCuenta(jwt, params) {
    apiCuenta.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return apiCuenta.get('cuentas/' + params)
    }
    return apiCuenta.get('cuentas/')
  },

  /**
   * @name postCuenta
   * @description Se crea el Cuenta
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postCuenta(jwt, body) {
    apiCuenta.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiCuenta.post('cuentas/', body)
  },

  /**
   * @name putCuenta
   * @description Se actualiza el Cuenta
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  putCuenta(jwt, body, id) {
    apiCuenta.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiCuenta.put('cuentas/' + id, body)
  },
  /**
   * @name deleteCuenta
   * @description Se actualiza el Cuenta
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  deleteCuenta(jwt, body, id) {
    apiCuenta.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiCuenta.delete('cuentas/' + id, body)
  },
}
