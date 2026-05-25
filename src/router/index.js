import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from '../pages/MainPage.vue'
import MenuPage from '../pages/MenuPage.vue'
import InfoPage from '../pages/InfoPage.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/menu', component: MenuPage },
  { path: '/info', component: InfoPage },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
