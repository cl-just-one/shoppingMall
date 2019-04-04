import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import VueInfiniteScroll from 'vue-infinite-scroll'
import { currency } from '@/util/currency'

Vue.use(Vuex)
    // 全局注册过滤器
Vue.filter('currency1', function(val) {
    return currency(val, "$")
})
Vue.use(VueLazyload, {
    loading: '/static/loading-svg/loading-spin.svg'
})
Vue.use(VueInfiniteScroll)

Vue.config.productionTip = false

const store = new Vuex.Store({
    state: {
        nickName: '',
        cartCount: 0
    },
    mutations: {
        updateUserInfo(state, userName) {
            state.nickName = userName
        },
        updateCartCount(state, cartCount) {
            state.cartCount += cartCount
        },
        initCartCount(state, cartCount) {
            state.cartCount = cartCount
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})