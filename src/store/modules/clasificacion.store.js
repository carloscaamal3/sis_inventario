import ClasTipoService from '@/services/clasificacion.services'
export const namespaced = true

export const actions = {
  fetchClasTipo(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return ClasTipoService.getClasTipo(payload.jwt, params)
  },
  addClasTipo(context, payload) {
    return ClasTipoService.postClasTipo(payload.jwt, payload.body)
  },
  editClasTipo(context, payload) {
    return ClasTipoService.putClasTipo(payload.jwt, payload.body, payload.id)
  },
  deleteClasTipo(context, payload) {
    return ClasTipoService.deleteClasTipo(payload.jwt, payload.body, payload.id)
  },
}
