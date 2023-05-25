import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CarView from '../views/CarView.vue'
import DrawPointView from '../views/DrawPointView.vue'
import DragAndDropView from '../views/DragAndDropView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/car-list',
    name: 'cars',
    component: CarView
  },
  {
    path: '/draw-point',
    name: 'draw',
    component: DrawPointView
  },
  {
    path: '/image',
    name: 'drag-and-drop',
    component: DragAndDropView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
