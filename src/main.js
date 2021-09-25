import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from 'vant'
import 'vant/lib/index.css';
// import 'vant/lib/icon/local.css';
import 'assets/font/font.css'
import 'assets/css/reset.scss'
import 'vant/lib/index.less';

Vue.use(Vant)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  // Vant,
  render: (h) => h(App),
}).$mount("#app");
