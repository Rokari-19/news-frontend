import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Detail from '@/views/Detail.vue'
import Tags from '@/views/Tags.vue'
import Create from '@/views/Create.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/news/:id',
    name: 'News Detail',
    component: Detail
  },
  {
    path: '/tags/',
    name:'Tags',
    component: Tags
  },
  {
    path: '/news/create/',
    name: "create news post",
    component: Create
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
