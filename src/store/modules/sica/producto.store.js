import productoService from '@/services/sica/producto.services'
export const namespaced = true

export const actions = {
  fetchProducto(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return productoService.getProducto(payload.jwt, params)
  },
  addProducto(context, payload) {
    return productoService.postProducto(payload.jwt, payload.body)
  },
  editProducto(context, payload) {
    return productoService.putProducto(payload.jwt, payload.body, payload.id)
  },
  deleteProducto(context, payload) {
    return productoService.deleteProducto(payload.jwt, payload.body, payload.id)
  },
  editUltimoProducto(context, payload) {
    return productoService.putUltimoProducto(payload.jwt, payload.body, payload.id)
  },
}
