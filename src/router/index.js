import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from 'components/index'
import Map from 'd3-components/map'
import {routes as demoRoutes} from './demos'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Map
    },
    {
      path: '/:x/:y',
      name: 'Map',
      component: Map
    }
    , ... demoRoutes
  ]
})
