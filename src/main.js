import './assets/css/base.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$kc = window.__KC_CONTEXT;
app.config.globalProperties.$env = window.env;
app.mount('#app')
