import EmpleadoService from '@/services/empleado.services'
export const namespaced = true

export const actions = {
  fetchEmpleado(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return EmpleadoService.getEmpleado(payload.jwt, params)
  },
  addEmpleado(context, payload) {
    return EmpleadoService.postEmpleado(payload.jwt, payload.body)
  },
  editEmpleado(context, payload) {
    return EmpleadoService.putEmpleado(payload.jwt, payload.body, payload.id)
  },
  deleteEmpleado(context, payload) {
    return EmpleadoService.deleteEmpleado(payload.jwt, payload.body, payload.id)
  },
}
