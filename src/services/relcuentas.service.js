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
   * @name getPenAlim
   * @description Obtienen una lista de Rel Cuentas pension alimenticia
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getPenAlim(jwt, params) {
    apiCuenta.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return apiCuenta.get('rel_cuentas/' + params + '/')
    }
    return apiCuenta.get('rel_cuentas/')
  },

  /**
   * @name postRelCuenta
   * @description Se crea el Relacion de cuentas
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postRelCuenta(jwt, body) {
    apiCuenta.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiCuenta.post('rel_cuentas/', body)
  },

  /**
   * @name putRelCuenta
   * @description Se actualiza el Relacion Cuenta
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  putRelCuenta(jwt, body, id) {
    apiCuenta.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiCuenta.put('rel_cuentas/' + id, body)
  },
  /**
   * @name deleteRelCuenta
   * @description Se actualiza inactivo = 0 la relacion Cuenta
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  deleteRelCuenta(jwt, body, id) {
    apiCuenta.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiCuenta.delete('rel_cuentas/' + id, body)
  },
}
