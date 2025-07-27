import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Chatroom from '../pages/ChatRoom.vue'
import Chat from '../pages/chat.vue'
import AddFriend from '../pages/AddFriend.vue'
import FriendList from '../pages/FriendList.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/chatroom', component: Chatroom },
  { path: '/chat/:roomId', name: 'Chat', component: Chat, props: true },
  { path: '/addfriend', component: AddFriend },
  { path: '/friends', component: FriendList },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

