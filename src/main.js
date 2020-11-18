import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.css'
Vue.config.productionTip = false
import router from './routers'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
