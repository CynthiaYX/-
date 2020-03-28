import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
import ECharts from 'vue-echarts'


Vue.config.productionTip = false;
Vue.use(VueAxios,axios);
Vue.component('v-chart', ECharts)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
