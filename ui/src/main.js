import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue'
// import VueNativeSock from 'vue-native-websocket'
import VueWebsocket from 'vue-websocket';

Vue.config.productionTip = false
Vue.use(BootstrapVue);
// Vue.use(VueNativeSock, 'ws://localhost:9000', { format: 'json' })
Vue.use(VueWebsocket, "ws://localhost:9000", { reconnection: true });


new Vue({
  render: h => h(App),
}).$mount('#app')
