import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import i18n from './i18n'

Vue.config.productionTip = false
Vue.use(Vuelidate)

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
