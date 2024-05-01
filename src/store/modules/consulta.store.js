import consultaService from '@/services/consulta.services'
export const namespaced = true
export const actions = {
  fetchProvTipo(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getProvTipo(payload.jwt, params)
  },
  fetchDireccion(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getDireccion(payload.jwt, params)
  },
  fetchDirectores(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getDirectores(payload.jwt, params)
  },
  fetchCuentaxProvxTipo(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getCuentaxProvxTipo(payload.jwt, params)
  },
  fetchgetsolpagos(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getsolpagos(payload.jwt, params)
  },
  fetchgetEjercidos(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getEjercidos(payload.jwt, params)
  },
  fetchGetFolios(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getFolios(payload.jwt, params)
  },
  fetchGetEjecidosImp(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getEjercidosImp(payload.jwt, params)
  },
  fetchGetGpoEnvPago(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getGpoEnvPago(payload.jwt, params)
  },
  fetchGetGpoEnvPresGxc(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getGpoEnvPresGxc(payload.jwt, params)
  },
  //Reimpresiones
  fetchGetGpoEnvFirAut(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getGpoEnvFirAut(payload.jwt, params)
  },
  fetchGetGpoEnvComDev(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getGpoEnvComDev(payload.jwt, params)
  },
  fetchGetGpoEnvConGxc(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getGpoEnvConGxc(payload.jwt, params)
  },
  fetchGetGpoEnvConNp(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getGpoEnvConNp(payload.jwt, params)
  },
  fetchGetDistinct(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getDistinct(payload.jwt, params)
  },
  fetchGetUsuarios(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getUsuarios(payload.jwt, params)
  },
  fetchGetEmpleados(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getEmpleados(payload.jwt, params)
  },
  fetchGetCuentas(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getCuentas(payload.jwt, params)
  },
  fetchGetTipos(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getTipos(payload.jwt, params)
  },
  fetchGetProveedor(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getProveedor(payload.jwt, params)
  },
  fetchGetSistemas(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getSistemas(payload.jwt, params)
  },
  fetchGetEjercicios(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getEjercicios(payload.jwt, params)
  },
  fetchGetEjerciciosOrden(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getEjerciciosOrdenes(payload.jwt, params)
  },
  fetchGetClasTipoFiltro(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getClastipoFiltro(payload.jwt, params)
  },
  fetchSgteProd(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getSgteProd(payload.jwt, params)
  },
  //
  fetchGetFoliosComPre(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getFoliosComPre(payload.jwt, params)
  },
  fetchGetDepartamentos(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getDepartamentos(payload.jwt, params)
  },
  fetchGetConceptosSica(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getConceptosSica(payload.jwt, params)
  }, 
  fetchTiposOrden(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getTipoOrden(payload.jwt, params)
  },
  fetchGetEjerciciosFact(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return consultaService.getEjerciciosFact(payload.jwt, params)
  },
}
