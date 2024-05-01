<template>
  <div>
    <div class="begin-date"><b>Desde:</b> {{ beginDate }}</div>
    <!-- <div class="end-date"><b>Hasta:</b> {{ endDate }}</div> -->
    <div :class="[isUndefined ? 'red-date' : 'end-date']"><b>Hasta:</b> {{ endDate }}</div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'DateFormat',
  data: () => ({
    // isUndefined: false
    isUndefined: false,
  }),
  props: {
    begin: {
      type: Number,
      default: null,
    },
    end: {
      type: Number,
      default: 99999999,
    },
  },
  computed: {
    beginDate() {
      const unformatedDate = this.formatToFecha(this.begin)
      return unformatedDate
    },
    endDate() {
      const unformatedDate = this.formatToFecha(this.end)
      return unformatedDate
    },
  },
  methods: {
    formatToFecha(data) {
      if (data === 99999999) {
        this.isUndefined = true
        return 'sin definir'
      }
      const cadena = String(data)
      let year = cadena.slice(0, 4)
      let month = cadena.slice(4, 6)
      let day = cadena.slice(6, 8)
      const fecha = year + '-' + month + '-' + day
      return moment(fecha).format('YYYY-MM-DD')
    },
  },
}
</script>

<style lang="scss" scoped>
.begin-date {
  font-size: 0.8rem;
}
.end-date {
  font-size: 0.8rem;
}
.red-date {
  font-size: 0.8rem;
  color: grey;
}
</style>
