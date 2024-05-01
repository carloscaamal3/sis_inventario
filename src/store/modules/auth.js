import AuthService from '@/services/auth.services.js'
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
  },
  LOGOUT(state) {
    localStorage.removeItem('user')
    state.user = ''
  },
}

export const actions = {
  getValidToken({ commit }) {
    const user = JSON.parse(localStorage.getItem('user'))
    //alert(user)
    const time = user.created
    const now = new Date().getTime()
    const expire = user.expira

    var sec_diff = (now - time) / 1000
    const remainingTime = expire - sec_diff

    /* console.log('now: ' + now)
    console.log('time: ' + time)
    console.log('sec_diff: ' + sec_diff)
    console.log('expire: ' + expire)
    console.log('remainingTime: ' + remainingTime) */
    //console.log(user)

    //if (remainingTime > 60) {
    if (remainingTime > 60) {
      // send valid token
      console.log('Entrega token valido')
      return { estado: 1, jwt: user.jwt }
    }
    // request jwt
    console.log('Solicita nuevo token')
    const rft = user.rft
    //console.log('refresh', rft)
    let body = { rft: rft }
    return AuthService.refreshToken(body)
      .then((response) => {
        // console.log('Nuevo tokens', response.data.expira)
        //console.log(response.data)
        user.jwt = response.data.jwt
        user.expira = response.data.expira
        //console.log(user)
        commit('SET_USER_DATA', user)
        console.log(user)
        return response.data
      })
      .catch((error) => {
        return error.response.data
      })
  },
  login({ commit }, credentials) {
    return AuthService.loginUser(credentials)
      .then(({ data }) => {
        //console.log(data)
        commit('SET_USER_DATA', data.usuario)
      })
      .catch((error) => {
        throw error
      })
  },
  logout({ commit }) {
    commit('LOGOUT')
  },

  changePassword(context, payload) {
    return AuthService.changePassword(payload)
  },

  resetPassword(context, payload) {
    return AuthService.resetPassword(payload)
  },
}
