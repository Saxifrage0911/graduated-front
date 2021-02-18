import Vue from 'vue'
import Router from 'vue-router'
import Add from '@/components/Add'
import Search from '@/components/Search'
import Update from '@/components/Update'
import Test from '@/components/Test'
import Login from '@/components/Login'
import Registry from '@/components/Registry'
import Flight from '@/components/Flight'
import Order from '@/components/Order'
import OrderList from '@/components/OrderList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Add',
      component: Add
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/update',
      name: 'Update',
      component: Update
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/registry',
      name: 'Registry',
      component: Registry
    },
    {
      path: '/flight',
      name: 'Flight',
      component: Flight
    },
    {
      path: '/order',
      name: 'Order',
      component: Order
    },
    {
      path: '/orderList',
      name: 'OrderList',
      component: OrderList
    }
  ]
})
