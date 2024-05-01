import CuentaService from '@/services/cuenta.services'
export const namespaced = true

export const actions = {
  fetchCuenta(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return CuentaService.getCuenta(payload.jwt, params)
  },
  addCuenta(context, payload) {
    return CuentaService.postCuenta(payload.jwt, payload.body)
  },
  editCuenta(context, payload) {
    return CuentaService.putCuenta(payload.jwt, payload.body, payload.id)
  },
  deleteCuenta(context, payload) {
    return CuentaService.deleteCuenta(payload.jwt, payload.body, payload.id)
  },
}
