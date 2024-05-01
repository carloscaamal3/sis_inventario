import UserRole from '@/services/UserRolesServices'
export const namespaced = true

export const actions = {
    /**
     * @name fetchUserRole
     * @description Obtiene una lista de Roles de Usuario
     *
     * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
     * @param {*} payload Parametros para poblar el select
     */
    fetchUserRole(context, payload) {
        let params = 'params' in payload ? payload.params : null
        return UserRole.getUserRoles(payload.jwt, params)
    },

    /**
     * @name addUserRole
     * @description Crea un nuevo Rol de Usuario
     *
     * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
     * @param {*} payload Parametros para crear un nuevo Rol de Usuario
     */
    addUserRole(context, payload) {
        return UserRole.postUserRole(payload.jwt, payload.body)
    },

    /**
     * @name editUserRole
     * @description Edita un Rol de Usuario
     *
     * @param {*} context Para hacer referencia al objeto en el que se ejecuta la función
     * @param {*} payload Parametros para editar un Rol de Usuario
     */
    editUserRole(context, payload) {
        return UserRole.patchUserRole(payload.jwt, payload.body, payload.id)
    },
}
