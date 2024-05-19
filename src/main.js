// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Button, Field, Notify, Icon, Dialog } from 'vant'

import 'vant/lib/index.css'

import './assets/css/common.scss'

createApp(App)
    .use(router)
    .use(store)
    .use(Button)
    .use(Field)
    .use(Notify)
    .use(Icon)
    .use(Dialog)
    .mount('#app')
