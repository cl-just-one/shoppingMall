<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price
              <svg class="icon icon-arrow-short" :class="{'arrow-by':sortFlag}">
                <use xlink:href="#icon-arrow-short"></use>
              </svg>
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd>
                  <a
                    href="javascript:void(0)"
                    :class="{'cur':priceChecked=='all'}"
                    @click="clickPrice('all')">All</a>
                </dd>
                <dd v-for="(item, idx) in priceList" :key="idx">
                  <a
                    href="javascript:void(0)"
                    :class="{'cur':priceChecked==idx}"
                    @click="clickPrice(idx)">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>
              </dl>
            </div>
            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item, idx) in goodsList" :key='idx'>
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div
                  class="load-more"
                  v-infinite-scroll="loadMore"
                  infinite-scroll-disabled="busy"
                  infinite-scroll-distance="30">
                  <img src="./../../static/loading-svg/loading-spinning-bubbles.svg" v-show="loading">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <modal :mdShow="mdShow" @close="closeModal">
        <p slot="message">
          你未登录，不能加入购物车。
        </p>
        <p slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShow=false">关闭</a>
        </p>
      </modal>
      <modal :mdShow="mdShowCart">
        <p slot="message">
          <svg class="navbar-cart-logo">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use>
          </svg>
          <span>加入购物车成功！</span>
        </p>
        <p slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
          <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
        </p>
      </modal>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
  import './../assets/css/base.css'
  import './../assets/css/product.css'

  import NavHeader from '@/components/NavHeader.vue'
  import NavFooter from '@/components/NavFooter.vue'
  import NavBread from '@/components/NavBread.vue'
  import Modal from '@/components/Modal'
  import axios from 'axios'

  export default{
      data() {
          return {
            goodsList: [],
            priceList: [],
            priceChecked: 'all',
            filterBy: false,
            overLayFlag: false,
            sortFlag: true,
            page: 1,
            pageSize: 8,
            sort: 1,
            busy: true,
            loading: true,
            mdShow: false,
            mdShowCart: false
          }
      },
      components: {
        NavHeader,
        NavFooter,
        NavBread,
        Modal
      },
      mounted() {
        this.getGoodsList()
        this.priceList = [{
          startPrice: '0.00',
          endPrice: '100.00'
        }, {
          startPrice: '100.00',
          endPrice: '500.00'
        }, {
          startPrice: '500.00',
          endPrice: '1000.00'
        }, {
          startPrice: '1000.00',
          endPrice: '5000.00'
        }]
      },
      methods: {
        getGoodsList(flag) {
          let param = {
            page: this.page,
            pageSize: this.pageSize,
            sort: this.sortFlag ? 1 : -1,
            priceLevel: this.priceChecked
          }
          this.loading = true
          axios.get('/goods/list', {
            params: param
          }).then((result) => {
            var res = result.data
            this.loading = false
            if (res.status === '0') {
              if (flag) {
                this.goodsList = this.goodsList.concat(res.result.list)
                if (res.result.count === 0) {
                  this.busy = true
                } else {
                  if (res.result.count < 8) {
                    this.busy = true
                  } else {
                    this.busy = false
                  }
                }
              } else {
                this.goodsList = res.result.list
                this.busy = false
              }
            } else {
              this.goodsList = []
            }
          }).catch(err => {
            console.log(err)
          })
        },
        clickPrice(idx) {
          this.priceChecked = idx
          this.page = 1
          this.closePop()
          this.getGoodsList()
        },
        showFilterPop() {
          this.filterBy = true
          this.overLayFlag = true
        },
        closePop() {
          this.filterBy = false
          this.overLayFlag = false
        },
        sortGoods() {
          this.sortFlag = !this.sortFlag
          this.page = 1
          this.getGoodsList()
        },
        loadMore() {
          this.busy = true
          setTimeout(() => {
            this.page++
            this.getGoodsList(true)
            this.loading = true
          }, 500)
        },
        addCart(productId) {
          axios.post('/goods/addCart', {
            productId: productId
          }).then((res) => {
            var result = res.data
            if (result.status === "0") {
              this.mdShowCart = true
              this.$store.commit('updateCartCount', 1)
            } else {
              this.mdShow = true
            }
          })
        },
        closeModal() {
          this.mdShow = false
        }
      }
  }
</script>
<style scoped>
  .load-more {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .arrow-by {
    transform: rotate(180deg);
    transition: all .3s ease-out;
  }
</style>
