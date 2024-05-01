import FacturasServices from '@/services/sica/facturas.services'
export const namespaced = true

export const actions = {
	addFact(context, payload) {
    return FacturasServices.postFact(payload.jwt, payload.body)
  },
  addFactDoc(context, payload) {
    return FacturasServices.postFactDoc(payload.jwt, payload.body)
  },
  addFactDet(context, payload) {
    return FacturasServices.postFactDet(payload.jwt, payload.body)
  },
  editFactMonto(context, payload) {
    return FacturasServices.putFactMonto(payload.jwt, payload.body, payload.id)
  },
   editSaldo(context, payload) {
    return FacturasServices.putSaldo(payload.jwt, payload.body, payload.id)
  },
  fetchFactura(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return FacturasServices.getFacturaCab(payload.jwt, params)
  },
  fetchFacturaDet(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return FacturasServices.getFacturaDet(payload.jwt, params)
  },
   fetchFacturaDoc(context, payload) {
    let params = 'params' in payload ? payload.params : null
    return FacturasServices.getFacturaDoc(payload.jwt, params)
  },
  deleteFacturaCab(context, payload)
  {
    return FacturasServices.deletefacturaCab(payload.jwt, payload.body, payload.id)
  },
  deleteFacturaDet(context, payload)
  {
    return FacturasServices.deletefacturaCabDet(payload.jwt, payload.body, payload.id)
  },
  deleteFacturaDoc(context, payload)
  {
    return FacturasServices.deletefacturaDoc(payload.jwt, payload.body, payload.id)
  }
}