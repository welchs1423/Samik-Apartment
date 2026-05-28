import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from '../pages/MainPage.vue'
import CategoryListPage from '../pages/CategoryListPage.vue'
import CategoryPage from '../pages/CategoryPage.vue'
import ItemDetailPage from '../pages/ItemDetailPage.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/menu', component: CategoryListPage },
  { path: '/menu/:id', component: CategoryPage },
  { path: '/menu/:id/:itemId', component: ItemDetailPage },
  ...(import.meta.env.DEV
    ? [{ path: '/admin', component: () => import('../pages/AdminPage.vue') }]
    : []),
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
