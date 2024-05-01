import comcomiteService from '@/services/sica/comcomite.services'
export const namespaced = true

export const actions = {
  fetchComComite(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return comcomiteService.getComComite(payload.jwt, params)
  },
  addComComite(context, payload) {
    return comcomiteService.postComComite(payload.jwt, payload.body)
  },
  editComComite(context, payload) {
    return comcomiteService.putComComite(payload.jwt, payload.body, payload.id)
  },
  deleteComComite(context, payload) {
    return comcomiteService.deleteComComite(payload.jwt, payload.body, payload.id)
  },
}
