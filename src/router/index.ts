import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Chat from '../pages/Chat.vue'

const routes = [
    { path: '/', component: Login },
    { path: '/chat', component: Chat }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
