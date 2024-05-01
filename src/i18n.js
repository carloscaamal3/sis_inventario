import Vue from 'vue'
import VueI18n from 'vue-i18n'

import es from 'vuetify/lib/locale/es'
import en from 'vuetify/lib/locale/en'

Vue.use(VueI18n)

// function loadLocaleMessages() {
//   const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
//   const messages = {}
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i)
//     if (matched && matched.length > 1) {
//       const locale = matched[1]
//       messages[locale] = locales(key)
//     }
//   })
//   return messages
// }

const messages = {
  es: {
    ...require('@/locales/es.json'),
    $vuetify: es,
  },
  en: {
    ...require('@/locales/en.json'),
    $vuetify: en,
  },
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'es',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'es',
  messages, //: loadLocaleMessages()
})
