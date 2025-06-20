<template>
  <div>
    <h1>チャットルーム一覧</h1>
    <ul>
      <li v-for="room in chatRooms" :key="room.id">
        {{ room.id }}
      </li>
    </ul>
    <button @click="createRoom">チャットルーム作成</button>
    <button @click="handleLogout">ログアウト</button>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {fetchChatRooms} from '../firebase/chat'
import {auth} from '../firebase/firebase'
import {useRouter} from 'vue-router'
import {logout} from '../firebase/auth'

const chatRooms = ref<any[]>( [])
const router = useRouter()

onMounted(async () => {
  if (auth.currentUser) {
    chatRooms.value = await fetchChatRooms(auth.currentUser.uid);
  } else {
    router.push('/');
  }
})

const createRoom = async () => {
  
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}

</script>
