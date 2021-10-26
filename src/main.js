import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
// import 'vant/lib/icon/local.css';
import 'assets/font/font.css'
import 'assets/font/svgFont.css'
import 'assets/font/svgFont.js'
// import { Icon } from 'vant';
import 'assets/css/reset.scss'
import 'vant/lib/index.less'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  // Vant,
  render: (h) => h(App)
}).$mount('#app')


// rem适配
;(function (designWidth, maxWidth) {
  var doc = document,
    win = window,
    docEl = doc.documentElement,
    remStyle = document.createElement('style'),
    tid

  function refreshRem() {
    var width = docEl.getBoundingClientRect().width

    maxWidth = maxWidth || 540

    width > maxWidth && (width = maxWidth)

    var rem = (width * 100) / designWidth

    remStyle.innerHTML = 'html{font-size:' + rem + 'px;}'
  }

  if (docEl.firstElementChild) {
    docEl.firstElementChild.appendChild(remStyle)
  } else {
    var wrap = doc.createElement('div')

    wrap.appendChild(remStyle)

    doc.write(wrap.innerHTML)

    wrap = null
  }

  //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；

  refreshRem()

  win.addEventListener(
    'resize',
    function () {
      clearTimeout(tid) //防止执行两次

      tid = setTimeout(refreshRem, 300)
    },
    false
  )

  win.addEventListener(
    'pageshow',
    function (e) {
      if (e.persisted) {
        // 浏览器后退的时候重新计算

        clearTimeout(tid)

        tid = setTimeout(refreshRem, 300)
      }
    },
    false
  )

  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = '16px'
  } else {
    doc.addEventListener(
      'DOMContentLoaded',
      function (e) {
        doc.body.style.fontSize = '16px'
      },
      false
    )
  }
})(375, 750)
