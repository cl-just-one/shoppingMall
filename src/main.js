import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import VueInfiniteScroll from 'vue-infinite-scroll'

Vue.use(VueLazyload, {
    loading: '/static/loading-svg/loading-spin.svg'
})
Vue.use(VueInfiniteScroll)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})