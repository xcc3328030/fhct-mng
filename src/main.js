// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'
import services from '@/services/services'
import tools from '@/utils/tools'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.js'

Vue.use(Vuex)
Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.prototype.$services = services;
Vue.prototype.$tools = tools;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
