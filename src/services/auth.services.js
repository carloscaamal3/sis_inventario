import api from './api'
const END_POINT = '/usuarios'
//import axios from 'axios'
//const baseURL = process.env.VUE_APP_BASE_URL_API
//Axios para Datos
/* const apiAuth = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
}) */

export default {
  /**
   * @name refreshToken
   * @type POST
   * @description Obtiene un nuevo jwt a partir de el token de refresco
   * @param {*} rft Refresh Token
   */
  refreshToken(rft) {
    //console.log(rft)
    return api.post('/tokens/refresh', rft)
  },

  /**
   * @name loginUser
   * @type POST
   * @description Valida credenciales del usuario
   * @param {*} body Cuerpo del request con las credenciales del usuario
   */
  loginUser(body) {
    return api.post(END_POINT + '/login', body)
  },

  /**
   * @name changePassword
   * @type POST
   * @description Cambia la contraseña del usuario
   * @param {*} body Cuerpo del request con las contraseñas del usuario
   */
  changePassword(body) {
    return api.post(END_POINT + '/cambio', body)
  },

  /**
   * @name resetPassword
   * @type POST
   * @description Reinicia la contraseña del usuario
   * @param {*} body Cuerpo del request con el correo del usuario
   */
  resetPassword(body) {
    return api.post('/usuarios/reinicio', body)
  },
}
