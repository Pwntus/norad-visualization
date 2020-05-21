import Vue from 'vue'
import router from '@/router'
import store from '@/store'

// Styles
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

// Libraries
import vuetify from '@/lib/vuetify'

// Services
import '@/service/registerServiceWorker'

// Misc.
import App from '@/App.vue'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
