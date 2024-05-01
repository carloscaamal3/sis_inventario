import CasosEspService from '@/services/casosesp.services'
export const namespaced = true

export const actions = {
  fetchCasosEsp(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return CasosEspService.getCasosEsp(payload.jwt, params)
  },
  addCasosEsp(context, payload) {
    return CasosEspService.postCasosEsp(payload.jwt, payload.body)
  },
  editCasosEsp(context, payload) {
    return CasosEspService.putCasosEsp(payload.jwt, payload.body, payload.id)
  },
  deleteCasosEsp(context, payload) {
    return CasosEspService.deleteCasosEsp(payload.jwt, payload.body, payload.id)
  },
}
