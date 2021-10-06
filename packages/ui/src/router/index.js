import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MyEgg from '../views/MyEgg.vue'
import InitGame from '../views/InitGame.vue'
import ListScores from '../views/ListScores.vue'
import ScanEgg from '../views/ScanEgg.vue'
import Info from '../views/Info.vue'
import { useEggStore } from '@/stores/egg'
import { createApp } from 'vue'
import App from '@/App.vue'
import { createPinia } from 'pinia'

export const pinia = createPinia()

const app = createApp(App)
app.use(pinia)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: async (to, from, next) => {
      const store = useEggStore()
      const eggLoginInfo = store.getToken()

      if (eggLoginInfo.token) {
        next({ name: 'egg', params: { id: eggLoginInfo.key } })
      } else {
        next('init-game')
      }
    }
  },
  {
    name: 'egg',
    path: '/egg/:id',
    component: MyEgg,
    beforeEnter: async (to, from, next) => {
      const store = useEggStore()
      const eggLoginInfo = store.getToken()

      if (eggLoginInfo.token) {
        next()
      } else {
        next('init-game')
      }
    }
  },
  {
    name: 'help',
    path: '/help',
    component: Info,
    beforeEnter: async (to, from, next) => {
      const store = useEggStore()
      const eggLoginInfo = store.getToken()

      if (eggLoginInfo.token) {
        next()
      } else {
        next('init-game')
      }
    }
  },
  {
    name: 'egg',
    path: '/egg/:id',
    component: MyEgg,
    beforeEnter: async (to, from, next) => {
      const store = useEggStore()
      const eggLoginInfo = store.getToken()

      if (eggLoginInfo) {
        next()
      } else {
        next('init-game')
      }
    }
  },
  {
    path: '/scan-egg',
    component: ScanEgg
  },
  {
    path: '/scores',
    component: ListScores,
    beforeEnter: async (to, from, next) => {
      const store = useEggStore()

      if (store.getToken()) {
        next()
      } else {
        next('init-game')
      }
    }
  },
  {
    path: '/init-game',
    component: InitGame
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(to => {
  const eggStore = useEggStore()

  if (to.meta.requiresAuth && !eggStore.isLoggedIn) return '/login'
})

export default router
