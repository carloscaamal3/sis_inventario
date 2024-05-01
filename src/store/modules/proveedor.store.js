import ProveedorService from '@/services/proveedor.services'
export const namespaced = true

export const actions = {
  fetchProveedor(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return ProveedorService.getProveedor(payload.jwt, params)
  },
  addProveedor(context, payload) {
    return ProveedorService.postProveedor(payload.jwt, payload.body)
  },
  editProveedor(context, payload) {
    return ProveedorService.putProveedor(payload.jwt, payload.body, payload.id)
  },
  editCorreo(context, payload) {
    console.log("payload prueba", payload)
    return ProveedorService.putCorreos(payload.jwt, payload.body, payload.id)
  },
   enviaProveedor(context, payload) {
    console.log("payload prueba", payload)
    return ProveedorService.enviaPRoovedor(payload.jwt, payload.body)
  },
  deleteProveedor(context, payload) {
    return ProveedorService.deleteProveedor(payload.jwt, payload.body, payload.id)
  },
}
