import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import store from './store.js'

// 配置后端api接口路径
axios.defaults.baseURL = 'http://127.0.0.1:5000/v1'
// 添加axios 拦截器
axios.interceptors.request.use(config => {
  config.headers.common.token = window.sessionStorage.getItem('token')
  return config
})

// 挂载Vue全局对象
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
