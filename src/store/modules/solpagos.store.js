import SolPagosService from '@/services/solpagos.services'
export const namespaced = true

export const actions = {
  fetchSolPagos(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSolPagos(payload.jwt, params)
  },
  fetchSolPagosCreado(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSolPagosCreado(payload.jwt, params)
  },
  addSolPagos(context, payload) {
    console.log("body", payload.body)
    return SolPagosService.postSolPagos(payload.jwt, payload.body)
  },
  editSolPagos(context, payload) {
    return SolPagosService.putSolPagos(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  //No se usa
  deleteSolPagos(context, payload) {
    return SolPagosService.deleteSolPagos(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  /////////////////////////////////////////////////////////////////////////////////////////////
  fetchSgteGpoFirmaSol(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSgteGpoFirmaSol(payload.jwt, params)
  },
  addGpoSolIda(context, payload) {
    return SolPagosService.postGpoSolIda(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  addGpoSolVta(context, payload) {
    return SolPagosService.postGpoSolVta(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  fetchSgteGpoFirmaAut(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSgteGpoFirmaAut(payload.jwt, params)
  },
  addGpoAutIda(context, payload) {
    return SolPagosService.postGpoAutIda(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  fetchSgteGpoPago(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSgteGpoPago(payload.jwt, params)
  },
  addGpoPago(context, payload) {
    return SolPagosService.postGpoPago(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  fetchSgteGpoGasto(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSgteGpoGasto(payload.jwt, params)
  },
  addGpoGasto(context, payload) {
    return SolPagosService.postGpoGasto(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  addPagos(context, payload) {
    return SolPagosService.postPagos(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  addxCancelar(context, payload) {
    return SolPagosService.postxCancelar(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  addxCancelado(context, payload) {
    return SolPagosService.postxCancelado(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  addEjercido(context, payload) {
    return SolPagosService.postEjercido(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  addCambioEstatus(context, payload) {
    return SolPagosService.postCambioEstatus(
      payload.jwt,
      payload.body,
      payload.id,
      payload.ejercicio
    )
  },
  addFolios(context, payload) {
    return SolPagosService.postFolios(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  fetchSgteGpoFolio(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSgteGpoFolio(payload.jwt, params)
  },
  addGpoFolio(context, payload) {
    return SolPagosService.postGpoFolio(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  fetchSgteGpoGxcEntCont(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSgteGpoGxcEntCont(payload.jwt, params)
  },
  addGpoEnviaConta(context, payload) {
    return SolPagosService.postGpoEnviaConta(
      payload.jwt,
      payload.body,
      payload.id,
      payload.ejercicio
    )
  },
  fetchSgteGpoEjercido(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSgteGpoEjercido(payload.jwt, params)
  },
  addGpoEnviaEjercido(context, payload) {
    return SolPagosService.postGpoEnviaEjercido(
      payload.jwt,
      payload.body,
      payload.id,
      payload.ejercicio
    )
  },
  fetchSgteGpoContaNp(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSgteGpoContaNp(payload.jwt, params)
  },
  addGpoEnviaContaNp(context, payload) {
    return SolPagosService.postGpoEnviaContaNp(
      payload.jwt,
      payload.body,
      payload.id,
      payload.ejercicio
    )
  },
  addActualizaSaldo(context, payload) {
    return SolPagosService.postActualizaSaldo(
      payload.jwt,
      payload.body,
      payload.id,
      payload.ejercicio
    )
  },
  addActualizaFolComp(context, payload) {
    return SolPagosService.postActualizaFolComp(
      payload.jwt,
      payload.body,
      payload.id,
      payload.ejercicio
    )
  },
  addGpoAutVta(context, payload) {
    return SolPagosService.postGpoAutVta(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  //////////////////////////////////////////////
  fetchSgteSolPag(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSgteSolPag(payload.jwt, params)
  },
  addPreSolPagos(context, payload) {
    return SolPagosService.postPreSolPagos(payload.jwt, payload.body)
  },
  editEstSol(context, payload) {
    return SolPagosService.postEstSol(payload.jwt, payload.body)
  },
  editPreSolPagos(context, payload) {
    return SolPagosService.putPreSolPagos(payload.jwt, payload.body, payload.id, payload.ejercicio)
  },
  fetchSgteFoliosCompPre(context, payload) {
    let params = 'params' in payload ? payload.params : null
    //console.log(params)
    return SolPagosService.getSgteFoliosCompPre(payload.jwt, params)
  },
  addGpoFolioCompPre(context, payload) {
    return SolPagosService.postGpoFolioCompPre(
      payload.jwt,
      payload.body,
      payload.id,
      payload.ejercicio
    )
  },
  editCampoSol(context, payload) {
    return SolPagosService.putCamposSol(payload.jwt, payload.body)
  },
}
