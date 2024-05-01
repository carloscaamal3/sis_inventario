import axios from 'axios'
// URL de la API
const baseURL = process.env.VUE_APP_BASE_URL_API

// Objeto axios de la api de SolPagos
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
   * @name getSolPagos
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSolPagos(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/' + params)
    }
    return Api.get('solpagos/')
  },
  /**
   * @name getSolPagos
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSolPagosCreado(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/creado/' + params)
    }
    return Api.get('solpagos/creado/')
  },

  /**
   * @name postSolPagos
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postSolPagos(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
   
   return Api.post('solpagos/creaRegistro/', body)

   // return Api.post('solpagos/crear/', body) //ANTERIOR NO BORRAR
  },

  /**
   * @name putSolPagos
   * @description Se actualiza el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  putSolPagos(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.put('solpagos/' + id + '/' + ejercicio, body)
  },
  /**
   * @name deleteSolPagos
   * @description Se actualiza el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  deleteSolPagos(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.delete('solpagos/' + id + '/' + ejercicio, body)
  },
  /**
   * @name getSgteGpoFirmaSol
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSgteGpoFirmaSol(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/sgteGpoFirmaSol/' + params)
    }
    return Api.get('solpagos/sgteGpoFirmaSol')
  },
  /**
   * @name postGposolida
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postGpoSolIda(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/gposolida/' + id + '/' + ejercicio, body)
  },
  /**
   * @name postGpoSolVta
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postGpoSolVta(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/gposolvta/' + id + '/' + ejercicio, body)
  },
  /**
   * @name getSgteGpoFirmaAut
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSgteGpoFirmaAut(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/sgteGpoFirmaAut/' + params)
    }
    return Api.get('solpagos/sgteGpoFirmaAut')
  },
  /**
   * @name postGpoAutIda
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postGpoAutIda(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/gpoautida/' + id + '/' + ejercicio, body)
  },
  /**
   * @name getSgteGpoPago
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSgteGpoPago(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/sgteGpoPagos/' + params)
    }
    return Api.get('solpagos/sgteGpoPagos')
  },
  /**
   * @name getSgteGpoPago
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSgteGpoGasto(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/sgteGpoGastosxComp/' + params)
    }
    return Api.get('solpagos/sgteGpoGastosxComp')
  },
  /**
   * @name postGpoPago
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postGpoPago(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/gpoenviapago/' + id + '/' + ejercicio, body)
  },
  /**
   * @name postGpoGasto
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postGpoGasto(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/gpoenviagastoxc/' + id + '/' + ejercicio, body)
  },
  /**
   * @name postPagos
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postPagos(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/pagos/' + id + '/' + ejercicio, body)
  },
  /**
   * @name postxCancelar
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postxCancelar(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/xcancelar/' + id + '/' + ejercicio, body)
  },
  /**
   * @name postxCancelado
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postxCancelado(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/cancelado/' + id + '/' + ejercicio, body)
  },
  /**
   * @name postEjercido
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postEjercido(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/ejercido/' + id + '/' + ejercicio, body)
  },
  /**
   * @name postCambioEstatus
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postCambioEstatus(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/cambiaestatus/' + id + '/' + ejercicio, body)
  },
  /**
   * @name postFolios
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postFolios(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/actualizafolios/' + id + '/' + ejercicio, body)
  },
  /**
   * @name getSgteGpoFolio
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSgteGpoFolio(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/sgteGpoFolios/' + params)
    }
    return Api.get('solpagos/sgteGpoFolios')
  },
  /**
   * @name postGpoFolio
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postGpoFolio(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/gpoenviafolio/' + id + '/' + ejercicio, body)
  },
  /**
   * @name getSgteGpoGxcEntCont
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSgteGpoGxcEntCont(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/sgteGpoGxcEntCont/' + params)
    }
    return Api.get('solpagos/sgteGpoGxcEntCont')
  },
  /**
   * @name postGpoEnviaConta
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postGpoEnviaConta(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/gpoenviacontagxc/' + id + '/' + ejercicio, body)
  },
  /**
   * @name getSgteGpoEjercido
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSgteGpoEjercido(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/sgteGpoEjercidos/' + params)
    }
    return Api.get('solpagos/sgteGpoEjercidos')
  },
  /**
   * @name postGpoEnviaEjercido
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postGpoEnviaEjercido(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/gpoenviaejercido/' + id + '/' + ejercicio, body)
  },
  /**
   * @name getSgteGpoContaNp
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSgteGpoContaNp(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/sgteGpoContaNp/' + params)
    }
    return Api.get('solpagos/sgteGpoContaNp')
  },
  /**
   * @name postGpoEnviaContaNp
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postGpoEnviaContaNp(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/gpoEnviaContaNp/' + id + '/' + ejercicio, body)
  },
  /**
   * @name postActualizaSaldo
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postActualizaSaldo(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/actualizaSaldo/' + id + '/' + ejercicio, body)
  },
  /**
   * @name postActualizaFolComp
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postActualizaFolComp(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/actualizafolcomp/' + id + '/' + ejercicio, body)
  },
  /**
   * @name postGpoAutVta
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postGpoAutVta(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/GpoAutorizaVta/' + id + '/' + ejercicio, body)
  },
  ///////////////////////////////////////////
  /**
   * @name getSgteSolPag
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSgteSolPag(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/sgteSolPag/' + params)
    }
    return Api.get('solpagos/sgteSolPag')
  },
  /**
   * @name postPreSolPagos
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postPreSolPagos(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/crearpre/', body)
  },

  /**
   * @name putPreSolPagos
   * @description Se actualiza el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  putPreSolPagos(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/actualizaPreCap/' + id + '/' + ejercicio, body)
  },
  /**
   * @name getSgteFoliosCompPre
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSgteFoliosCompPre(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('solpagos/sgteGpoFoliosCompPre/' + params)
    }
    return Api.get('solpagos/sgteGpoFoliosCompPre')
  },
  /**
   * @name postGpoFolioCompPre
   * @description Se crea el SolPagos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  postGpoFolioCompPre(jwt, body, id, ejercicio) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/gpoenviafolioComPre/' + id + '/' + ejercicio, body)
  },
  postEstSol(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/estatusSol', body)
  },
  putCamposSol(jwt, body) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    return Api.post('solpagos/estSolAct/', body)
  },
   }
