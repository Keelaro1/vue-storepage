import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/favourites',
    name: 'favourites',
    component: () => import('../views/Favourites.vue')
  },
  {
    path: '/details/:id',
    name: 'details',
    component: () => import('../views/Details.vue')
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
