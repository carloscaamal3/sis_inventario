import axios from 'axios'

// URL de la API
const baseURL = process.env.VUE_APP_BASE_URL_API

// Objeto axios de la api de Roles de Usuario
const apiUserRole = axios.create({
    baseURL: baseURL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos de espera
})

export default {
    /**
     * @name getUserRoles
     * @description Obtiene una lista de Roles de Usuario
     *
     * @param {*} jwt JSON Web Token válido
     * @param {*} params campo1 -> Parametros para poblar el select
     */
    // De la documentacion se obtiene la ruta: "productos/servicios etc"
    getUserRoles(jwt, params) {
        apiUserRole.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
        if (params != null) {
            return apiUserRole.get('roles/' + params)
        }
        return apiUserRole.get('roles')
    },

    /**
     * @name postUserRole
     * @description Se crea el Rol de Usuario
     *
     * @param {*} jwt JSON Web Token válido
     * @param {*} body Input del formulario -> Propiedades para crear el Rol de Usuario
     */
    postUserRole(jwt, body) {
        apiUserRole.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
        return apiUserRole.post('roles', body)
    },

    /**
     * @name patchUserRole
     * @description Se actualiza el Rol de Usuario
     *
     * @param {*} jwt JSON Web Token válido
     * @param {*} body Input del formulario -> Propiedades para actualizar el Rol de Usuario
     * @param {*} id this.editedItem._id -> id del Rol de Usuario que se va a actualizar
     */
    patchUserRole(jwt, body, id) {
        apiUserRole.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
        return apiUserRole.patch('roles/' + id, body)
    },
}
