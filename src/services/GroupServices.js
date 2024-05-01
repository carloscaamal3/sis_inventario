import axios from 'axios'
const baseURL = process.env.VUE_APP_BASE_URL_API

const apiGroups = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

export default {
  getGroups(jwt) {
    apiGroups.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiGroups.get('/grupos')
  },
  postGroup(jwt, body) {
    apiGroups.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiGroups.post('/grupos/', body)
  },
  patchGroup(jwt, body, id) {
    apiGroups.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return apiGroups.patch('/grupos/' + id, body)
  },
}
