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
   * @name getProvTipo
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getProvTipo(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('consulta/provxtipo/' + params)
    }
    return Api.get('consulta/provxtipo/')
  },
  /**
   * @name getDireccion
   * @description Obtienen una lista de SolPagoss
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getDireccion(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('consulta/direccion/' + params)
    }
    return Api.get('consulta/direccion/')
  },
  ///////////////////////////////////////////////////////////
  /**
   * @name getDirectores
   * @description Obtienen una lista de Directores
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getDirectores(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt

    if (params != null) {
      return Api.get('consulta/directores/' + params)
    }
    return Api.get('consulta/directores/')
  },
  /**
   * @name getCuentaxProvxTipo
   * @description Obtienen una lista de cuentas x proveedor por tipo y activas
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getCuentaxProvxTipo(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    console.log("params2",params)
    if (params != null) {
      return Api.get('consulta/cuentaxprovxtipo/' + params)
    }
    return Api.get('consulta/cuentaxprovxtipo/')
  },
  /**
   * @name getsolpagos
   * @description Obtienen una lista de cuentas x proveedor por tipo y activas
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getsolpagos(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/solpagos/' + params)
    }
    return Api.get('consulta/solpagos/')
  },
  /**
   * @name getEjercidos
   * @description Obtienen una lista de cuentas x proveedor por tipo y activas
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getEjercidos(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/ejercidos/' + params)
    }
    return Api.get('consulta/ejercidos/')
  },

  /**
   * @name GetFolios
   * @description Obtienen una lista de cuentas x proveedor por tipo y activas
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getFolios(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/folios/' + params)
    }
    return Api.get('consulta/folios/')
  },
  /**
   * @name getEjercidosImp
   * @description Obtienen una lista de cuentas x proveedor por tipo y activas
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getEjercidosImp(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/ejercidosimp/' + params)
    }
    return Api.get('consulta/ejercidosimp/')
  },
  /**
   * @name getGpoEnvPago
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getGpoEnvPago(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/grupoenvpagos/' + params)
    }
    return Api.get('consulta/grupoenvpagos/')
  },
  /**
   * @name getGpoEnvPresGxc
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getGpoEnvPresGxc(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/grupoenvpregxc/' + params)
    }
    return Api.get('consulta/grupoenvpregxc/')
  },
  /**
   * @name getGpoEnvFirAut
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getGpoEnvFirAut(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/grupoenvfiraut/' + params)
    }
    return Api.get('consulta/grupoenvfiraut/')
  },
  /**
   * @name getGpoEnvComDev
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getGpoEnvComDev(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/grupoenvcomdev/' + params)
    }
    return Api.get('consulta/grupoenvcomdev/')
  },
  /**
   * @name getGpoEnvConGxc
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getGpoEnvConGxc(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/grupoenvcongxc/' + params)
    }
    return Api.get('consulta/grupoenvcongxc/')
  },
  /**
   * @name getGpoEnvConNp
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getGpoEnvConNp(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/grupoenvconnp/' + params)
    }
    return Api.get('consulta/grupoenvconnp/')
  },
  /**
   * @name getDistinct
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getDistinct(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/distinct/' + params)
    }
    //return Api.get('consulta/grupoenvconnp/')
  },
  /**
   * @name getUsuarios
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getUsuarios(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/usuarios/' + params)
    }
    //return Api.get('consulta/grupoenvconnp/')
  },
  /**
   * @name getEmpleados
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getEmpleados(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/empleados/' + params)
    }
    //return Api.get('consulta/grupoenvconnp/')
  },
  /**
   * @name getCuentas
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getCuentas(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/cuentascontables/' + params)
    }
    //return Api.get('consulta/grupoenvconnp/')
  },
  /**
   * @name getTipos
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getTipos(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/tipos/' + params)
    }
    //return Api.get('consulta/grupoenvconnp/')
  },
  /**
   * @name getProveedor
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getProveedor(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/proveedor/' + params)
    }
    //return Api.get('consulta/grupoenvconnp/')
  },
  /**
   * @name getSistemas
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSistemas(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/sistemas/' + params)
    }
    //return Api.get('consulta/grupoenvconnp/')
  },
  /**
   * @name getEjercicios
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getEjercicios(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/ejercicios' + params)
    }
    return Api.get('consulta/ejercicios')
  },
  getEjerciciosOrdenes(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    if (params != null) {
      return Api.get('consulta/ejerciciosOrd' + params)
    }
    return Api.get('consulta/ejerciciosOrd')
  },
  /**
   * @name getClastipoFiltro
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getClastipoFiltro(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/clastipocon/' + params)
    }
    return Api.get('consulta/clastipocon')
  },
  /**
   * @name getSgteProd
   * @description Obtienen una lista de
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getSgteProd(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/sgteprod/' + params)
    }
    return Api.get('consulta/sgteprod')
  },
  /**
   * @name getFoliosComPre
   * @description Obtienen una lista de cuentas x proveedor por tipo y activas
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getFoliosComPre(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/foliosComPre/' + params)
    }
    return Api.get('consulta/foliosComPre/')
  },
  /**
   * @name getDepartamentos
   * @description Obtienen una lista de Departamentos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getDepartamentos(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/departamentos/' + params)
    }
    return Api.get('consulta/departamentos/')
  },
  /**
   * @name getConceptosSica
   * @description Obtienen una lista de Departamentos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getConceptosSica(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/conceptoSicas/' + params)
    }
    return Api.get('consulta/conceptoSicas/')
  },
    /**
   * @name getConceptosSica
   * @description Obtienen una lista de Departamentos
   *
   * @param {*} jwt JSON Web Token válido
   * @param {*} params campo1 -> Parametros para poblar el Select
   */
  getTipoOrden(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/tipOrden/' + params)
    }
    return Api.get('consulta/tipOrden/')
  },
   getEjerciciosFact(jwt, params) {
    Api.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
    //console.log(params)
    if (params != null) {
      return Api.get('consulta/ejerFact/' + params)
    }
    return Api.get('consulta/ejerFact/')
  },
}
