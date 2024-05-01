import PermitService from '@/services/Permiso.Service'
export const namespaced = true

export const actions = {
    //Obtiene los servicios
    fetchPermits(context, payload) {
        let params = 'params' in payload ? payload.params : null
        return PermitService.getPermit(payload.jwt, params)
    },
    //Agrega un servicio
    addPermit(context, payload) {
        return PermitService.postPermit(payload.jwt, payload.body)
    },
    //Actualiza un servicio
    editPermit(context, payload) {
        return PermitService.patchPermit(payload.jwt, payload.body, payload.id)
    },
    //Borrar servicio
    // deleteImageService(context, payload) {
    //     return PermitService.deleteImageService(payload.jwt, payload.body, payload.id)
    // }
}