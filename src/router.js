import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',

      component: Login
    },
    {
      path: '/index',

      component: Index
    }

  ]
})