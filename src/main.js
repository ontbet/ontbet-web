import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/index'
import router from './router'
import { client } from 'ontology-dapi'
import VueClipboard from 'vue-clipboard2'
import * as filters from './utils/filters'

client.registerClient({});

Vue.config.productionTip = false
// 绑定全局配置变量
Vue.prototype.$config = config
// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(ElementUI)
Vue.use(VueClipboard)

store.dispatch('getAccount')

new Vue({
  i18n,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
