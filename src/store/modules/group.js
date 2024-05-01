import GroupService from '@/services/GroupServices'
export const namespaced = true

export const actions = {
  // register({ commit }, credentials) {
  //   return GroupService.registerGroup(credentials).then(({ data }) => {
  //     commit('SET_Group_DATA', data.usuario)
  //   })
  // },

  fetchGroups(context, jwt) {
    return GroupService.getGroups(jwt)
  },
  addGroup(context, payload) {
    return GroupService.postGroup(payload.jwt, payload.body)
  },
  editGroup(context, payload) {
    return GroupService.patchGroup(payload.jwt, payload.body, payload.id)
  },
}
