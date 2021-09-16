import { pinia } from './stores'
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import router from './router'

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
