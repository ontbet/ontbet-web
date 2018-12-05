import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import router from './router'
import { client } from 'ontology-dapi';

client.registerClient({});

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  i18n,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
