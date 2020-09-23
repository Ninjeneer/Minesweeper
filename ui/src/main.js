import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue'
import VueWebsocket from 'vue-websocket';
import config from './config.json';

Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.use(VueWebsocket, `${config.protocol}://${config.host}:${config.port}`, { reconnection: true });


new Vue({
  render: h => h(App),
}).$mount('#app')
