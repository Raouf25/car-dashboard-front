import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'material-design-icons-iconfont/dist/material-design-icons.css'


// Element UI
import ElementUI from 'element-ui'
import '@/assets/styles/element.scss'
Vue.use(ElementUI)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
