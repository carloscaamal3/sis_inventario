import vehiculosService from '@/services/sica/vehiculo.services'
export const namespaced = true

export const actions = {
  fetchVehiculos(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return vehiculosService.getVehiculos(payload.jwt, params)
  },
  addVehiculos(context, payload) {
    return vehiculosService.postVehiculos(payload.jwt, payload.body)
  },
  editVehiculos(context, payload) {
    return vehiculosService.putVehiculos(payload.jwt, payload.body, payload.id)
  },
  deleteVehiculos(context, payload) {
    return vehiculosService.deleteVehiculos(payload.jwt, payload.body, payload.id)
  },
}
