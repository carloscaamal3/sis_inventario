import axios from 'axios'
const baseURL = process.env.VUE_APP_BASE_URL_API

//Axios para Datos
const apiPermit = axios.create({
    baseURL: baseURL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})
export default {
    //Obtiene todos los permisos
    getPermit(jwt, params) {
        apiPermit.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
        if (params != null) {
            return apiPermit.get('/modulos/permisos/' + params)
        }
        return apiPermit.get('/modulos/permisos')
    },
    //Agrega un servicio
    postPermit(jwt, body) {
        apiPermit.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
        return apiPermit.post('/modulos/permisos', body)
    },
    //Actualiza un servicio
    patchPermit(jwt, body, id) {
        apiPermit.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
        return apiPermit.patch('/modulos/permisos/' + id, body)
    },
    //Borra un servicio
    // deleteImageService(jwt, body, id) {
    //     apiPermit.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //     return apiPermit.delete('/permisos/' + id, body)
    // },
}