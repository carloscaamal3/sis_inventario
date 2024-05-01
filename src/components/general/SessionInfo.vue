<template>
  <div>
    <div class="session-info-title"><b>Conexiones:</b> {{ timesConecction }}</div>
    <div class="session-info-subtitle"><b>Última:</b> {{ lastConnection }}</div>
  </div>
</template>

<script>
export default {
  name: 'SessionInfo',
  props: {
    loginTimes: {
      type: String,
      default: '0',
    },
    lastLogin: {
      type: String,
      default: '',
    },
  },
  computed: {
    timesConecction() {
      return new Intl.NumberFormat().format(this.loginTimes)
    },
    lastConnection() {
      const lastDate = new Date(this.lastLogin.replace(/\s/, 'T')).getTime()
      const now = new Date().getTime()
      const diasdif = now - lastDate
      const contdias = Math.round(diasdif / (1000 * 60 * 60 * 24))
      var message = ''
      if (contdias === 0) {
        message = 'Hoy'
      } else if (contdias <= 7 && contdias > 0) {
        message = 'Hace ' + contdias + ' dias.'
      } else if (contdias > 7) {
        var meses = new Array(
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic'
        )
        message =
          'El ' +
          new Date(this.lastLogin.replace(/\s/, 'T')).getDate() +
          '-' +
          meses[new Date(this.lastLogin.replace(/\s/, 'T')).getMonth()] +
          '-' +
          new Date(this.lastLogin.replace(/\s/, 'T')).getFullYear() +
          '  ' +
          new Date(this.lastLogin.replace(/\s/, 'T')).getHours() +
          ':' +
          new Date(this.lastLogin.replace(/\s/, 'T')).getMinutes()
      } else {
        message = 'Nunca'
      }
      return message
    },
  },
}
</script>

<style lang="scss" scoped>
.session-info-title {
  font-size: 0.85rem;
}
.session-info-subtitle {
  font-size: 0.75rem;
}
</style>
