import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const router = createRouter({
    history: createWebHashHistory(), // hash 模式
    // history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/home')
        },
        {
            path: '/login',
            name: 'login',
            // component: defineAsyncComponent(() => import('../views/login'))
            component: () => import('../views/login')
        }
    ]
})


export default router