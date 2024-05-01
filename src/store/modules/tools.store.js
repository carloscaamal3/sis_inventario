export const namespaced = true

function formatoImporte(value) {
  let val = (value / 1).toFixed(2).replace(',', '.')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function formatoMoneda(value) {
  let val = (value / 1).toFixed(2).replace(',', '.')
  return '$ ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
function formatoMonedaRight(value) {
  let val = (value / 1).toFixed(2).replace(',', '.')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $'
}

function convierteNumeroFechaVista(date) {
  let fecha = ''
  if (date == undefined) {
    fecha = '00-00-00'
  } else {
    const cadena = date.toString()
    let year = cadena.slice(2, 4)
    let month = cadena.slice(5, 7)
    let day = cadena.slice(8, 10)

    fecha = day + '-' + month + '-' + year
  }

  return fecha
}
function convierteNumeroFechaBarra(date) {
  let fecha = ''
  if (date == undefined) {
    fecha = '00-00-00'
  } else {
    const cadena = date.toString()
    let year = cadena.slice(2, 4)
    let month = cadena.slice(5, 7)
    let day = cadena.slice(8, 10)

    fecha = day + '/' + month + '/' + year
  }

  return fecha
}

function convierteNumeroFecha(date) {
  const cadena = date.toString()
  let year = cadena.slice(0, 4)
  //let year = cadena.slice(2, 4)
  let month = cadena.slice(5, 7)
  let day = cadena.slice(8, 10)

  const fecha = year + '-' + month + '-' + day
  //const fecha = day + '-' + month + '-' + year

  return fecha
}

function fechaformato(f) {
  var mes = f.getMonth() + 1
  var dia = f.getDate()
  const fecha =
    f.getFullYear() + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia)
  return fecha
}

const formatos = {
  NUMERICO: 1,
  MONEDA: 2,
  ENTERO: 3,
  FECHA: 4,
  FECHA_NUM: 5,
  FECHA_FORMATO: 6,
  MONEDA_RIGHT: 7,
  IMPORTE: 8,
  FECHA_BARRA: 9,
}

function formato(opcion, valor) {
  switch (opcion) {
    case formatos.MONEDA:
      return formatoMoneda(valor)
    //break;
    case formatos.IMPORTE:
      return formatoImporte(valor)
    case formatos.FECHA:
      return convierteNumeroFechaVista(valor)
    case formatos.FECHA_FORMATO:
      return fechaformato(valor)
    case formatos.FECHA_BARRA:
      return convierteNumeroFechaBarra(valor)
  }
}
export {
  formatoImporte,
  formatoMoneda,
  formatoMonedaRight,
  formatos,
  convierteNumeroFechaVista,
  convierteNumeroFecha,
  fechaformato,
  formato,
}
