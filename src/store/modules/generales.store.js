import generalService from '@/services/generales.services'
export const namespaced = true

export const actions = {
  fetchGeneral(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return generalService.getGeneral(payload.jwt, params)
  },
  addGeneral(context, payload) {
    return generalService.postGeneral(payload.jwt, payload.body)
  },
  editGeneral(context, payload) {
    return generalService.putGeneral(payload.jwt, payload.body, payload.id)
  },
  deleteGeneral(context, payload) {
    return generalService.deletegeneral(payload.jwt, payload.body, payload.id)
  },
}
