import axios from 'axios'
// URL de la API
const baseURL = process.env.VUE_APP_BASE_URL_API

// Objeto axios de la api
const Api = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de espera
})

export default {
	    /**
   * @name post guardar factura serv
   * @description Se crea el detalle de los productos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postFact(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('factura/crea/', body)
  },
  postFactDet(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('factura/creaDet/', body)
  },
  postFactDoc(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('factura/creaFacDoc/', body)
  },
  putFactMonto(jwt, body, id) {
    console.log("id",id)
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('ordensica/acMonto/' + id, body)
  },
   putSaldo(jwt, body, id) {
    console.log("id",id)
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('factura/saldo/' + id, body)
  },
  getFacturaCab(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('factura/todos/' + params)
    }
    return Api.get('factura/todos/')
  },
  getFacturaDoc(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('factura/FacDoc/' + params)
    }
    //return Api.get('factura/FacDoc/')
  },
  getFacturaDet(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('factura/Det/' + params)
    }
    return Api.get('factura/Det/')
  },
   deletefacturaCab(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.delete('factura/cab/' + id)
  },
   deletefacturaCabDet(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.delete('factura/det/' + id)
  },
  deletefacturaDoc(jwt, body, id) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.delete('factura/delFacDoc/' + id)
  }
 }
