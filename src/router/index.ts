import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/manage',
      name: 'manage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/emp',
      name: 'emp',
      component: () => import('../views/emp/EmpView.vue'),
    },
    {
      path: '/emp/add',
      name: 'empadd',
      component: () => import('../views/emp/EmpAdd.vue'),
    },
    {
      path: '/emp/update',
      name: 'empupdate',
      component: () => import('../views/emp/EmpUpdate.vue'),
    },
  ],
})

export default router
