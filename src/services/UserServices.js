import axios from 'axios'
const END_POINT = '/usuarios'
const baseURL = process.env.VUE_APP_BASE_URL_API

const apiUsers = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

//RGALA - Constante  Axio para guardar el Avatar de un usuario - 11/Sep/2020
const apiUsersAvatar = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 0,
})

export default {
  /**
   * Obtiene todos los usuarios o uno por su id
   * @param {*} jwt Json Web Token
   */
  getUsers(jwt) {
    apiUsers.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiUsers.get(END_POINT + '/')
  },
  /**
   * Crea un usuario en la base de datos
   * @param {*} jwt Json Web Token
   * @param {*} body Informacion del usuario
   */
  postUser(jwt, body) {
    apiUsers.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiUsers.post(END_POINT + '/registro', body)
  },

  /**
   * Actualiza los datos del usuario por su Id
   * @param {*} jwt Json Web Token
   * @param {*} body Informacion del usuario
   * @param {*} id Id del usuario
   */
  patchUser(jwt, body, id) {
    apiUsers.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiUsers.put(END_POINT + '/' + id, body)
  },
  //RGALA - Servicio para obtener un solo usuario mediante el Id - 11/Sep/2020
  getUsersId(jwt, id) {
    apiUsers.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiUsers.get(END_POINT + '/' + id)
  },
  //RGALA - Servicio para guardar el Avatar de un usuario - 11/Sep/2020
  postUserAvatar(jwt, body) {
    apiUsersAvatar.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiUsersAvatar.post(END_POINT + '/imagen/upload', body)
  },
  /**
   * Elimina un usuario por su Id
   * @param {*} jwt Json Web Token
   * @param {*} id Id del usuario
   */
  deleteUser(jwt, id) {
    apiUsers.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiUsers.delete(END_POINT + '/' + id)
  },
  /**
   * Envia un correo de invitacion para registro a un usuario
   * @param {*} jwt Json Web Token
   * @param {*} body Correo del usuario que se desea invitar
   */
  inviteUser(jwt, body) {
    apiUsers.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiUsers.post(END_POINT + '/invitacion', body)
  },

  /**
   * Verifica la llave de invitacion
   * @param {*} id api-key de invitacion
   */
  checkInvitation(id) {
    apiUsers.defaults.headers.common['api-key'] = id
    return apiUsers.get(END_POINT + '/invitacion')
  },

  /**
   * Registra un usuario con los campos minimos
   * @param {*} id api-key de invitacion
   * @param {*} body Informacion del usuario
   */
  registerUser(id, body) {
    apiUsers.defaults.headers.common['api-key'] = id
    return apiUsers.post(END_POINT + '/registro', body)
  },

  /**
   * Registra un usuario con los campos minimos
   * @param {*} id api-key de invitacion
   * @param {*} body Informacion del usuario
   */
  postCambioPwd(jwt, body, id) {
    apiUsers.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiUsers.post(END_POINT + '/reinicio/' + id, body)
  },
}
