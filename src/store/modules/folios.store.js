import ClasFolios from '@/services/folios.service'
export const namespaced = true

export const actions = {
  fetchFolios(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return ClasFolios.getFolios(payload.jwt, params)
  },
  addFolios(context, payload) {
    return ClasFolios.postFolios(payload.jwt, payload.body)
  },
  editFolios(context, payload) {
    return ClasFolios.putFolios(payload.jwt, payload.body, payload.id)
  },
  deleteFolios(context, payload) {
    return ClasFolios.deleteFolios(payload.jwt, payload.body, payload.id)
  },
}
