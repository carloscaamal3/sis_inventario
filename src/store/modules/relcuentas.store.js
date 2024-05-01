import RelCuentaService from '@/services/relcuentas.service'
export const namespaced = true

export const actions = {
  fetchPenAlim(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return RelCuentaService.getPenAlim(payload.jwt, params)
  },
  addRelCuenta(context, payload) {
    return RelCuentaService.postRelCuenta(payload.jwt, payload.body)
  },
  editRelCuenta(context, payload) {
    return RelCuentaService.putRelCuenta(payload.jwt, payload.body, payload.id)
  },
  deleteRelCuenta(context, payload) {
    return RelCuentaService.deleteRelCuenta(payload.jwt, payload.body, payload.id)
  },
}
