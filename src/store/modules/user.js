import UserService from '@/services/UserServices.js'
export const namespaced = true

export const state = {
  user: '',
}

export const mutations = {
  SET_USER_DATA(state, userData) {
    var created = new Date().getTime()
    userData.created = created

    state.user = userData
    localStorage.setItem('user', JSON.stringify(userData))
    //axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
  },
}

export const actions = {
  register({ commit }, credentials) {
    return UserService.registerUser(credentials).then(({ data }) => {
      commit('SET_USER_DATA', data.usuario)
    })
  },
  inviteUser(context, payload) {
    return UserService.inviteUser(payload.jwt, payload.body)
  },
  fetchUsers(context, payload) {
    return UserService.getUsers(payload.jwt)
  },
  //RGALA - Store para obtener un solo usuario mediante el Id - 11/Sep/2020
  fetchUsersId(context, payload) {
    return UserService.getUsersId(payload.jwt, payload.id)
  },
  addUser(context, payload) {
    return UserService.postUser(payload.jwt, payload.body)
  },
  editUser(context, payload) {
    return UserService.patchUser(payload.jwt, payload.body, payload.id)
  },
  checkInvitation(context, payload) {
    return UserService.checkInvitation(payload)
  },
  registerUser(context, payload) {
    return UserService.registerUser(payload.id, payload.body)
  },
  //RGALA - Store para guardar el avatar de un usuario - 11/Sep/2020
  loadAvatar(context, payload) {
    return UserService.postUserAvatar(payload.jwt, payload.body)
  },
  cambioPwd(context, payload) {
    return UserService.postCambioPwd(payload.jwt, payload.body, payload.id)
  },
}

export const getters = {
  loggedIn(state) {
    return !!state.user
  },
}
