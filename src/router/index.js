import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from '../pages/MainPage.vue'
import CategoryListPage from '../pages/CategoryListPage.vue'
import CategoryPage from '../pages/CategoryPage.vue'
import ItemDetailPage from '../pages/ItemDetailPage.vue'
import AdminPage from '../pages/AdminPage.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/menu', component: CategoryListPage },
  { path: '/menu/:id', component: CategoryPage },
  { path: '/menu/:id/:itemId', component: ItemDetailPage },
  { path: '/admin', component: AdminPage },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
