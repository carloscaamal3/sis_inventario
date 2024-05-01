import { mapGetters } from 'vuex'

export const authComputed = {
  ...mapGetters(['loggedIn']),
}

export const getValidToken = async (vm) => {
  let jwt = await vm.$store.dispatch('auth/getValidToken').then((response) => {
    if (response.jwt) {
      return response.jwt
    }
    vm.$store.commit('ALERT', {
      color: 'error',
      text: response.mensaje + ', Inicie Sesión de Nuevo',
    })
    vm.$store.dispatch('auth/logout')
    vm.$router.push('/pages/login')
    return null
  })
  return jwt
}
