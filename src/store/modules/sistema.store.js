//import sistemaService from '@/services/sistema.services'
import sistemaService from '@/services/sistema.services'
export const namespaced = true

export const actions = {
  fetchSistema(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return sistemaService.getSistema(payload.jwt, params)
  },
  addSistema(context, payload) {
    return sistemaService.postSistema(payload.jwt, payload.body)
  },
  editSistema(context, payload) {
    return sistemaService.putSistema(payload.jwt, payload.body, payload.id)
  },
  deleteSistema(context, payload) {
    return sistemaService.deleteSistema(payload.jwt, payload.body, payload.id)
  },
}
