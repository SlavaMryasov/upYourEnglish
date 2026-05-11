import { PiniaColada } from '@pinia/colada'
import { createApp } from 'vue'
import App from './App.vue'
import './global.css'
import { router } from './router'
import { pinia } from './store'

createApp(App).use(pinia).use(PiniaColada).use(router).mount('#root')
