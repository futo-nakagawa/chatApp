<!-- src/pages/chat.vue -->
<template>
  <div class="flex flex-col h-screen bg-gray-100 pb-16">
    <!-- ヘッダー -->
    <div class="bg-green-600 text-white p-4 flex items-center shadow">
      <router-link to="/chatroom" class="mr-4 font-bold">←</router-link>
      <h2 class="text-lg font-semibold truncate">{{ roomName }}</h2>
    </div>

    <!-- メッセージ一覧 -->
    <div ref="scrollArea" class="flex-1 overflow-y-auto p-3 space-y-2">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="[
          'max-w-[75%] rounded p-2',
          msg.senderEmail === user?.email ? 'bg-green-200 self-end text-right' : 'bg-white self-start text-left'
        ]"
      >
        <div class="text-xs text-gray-500 mb-1">{{ msg.name }}</div>
        <div class="whitespace-pre-wrap">{{ msg.text }}</div>
      </div>
    </div>

    <!-- 入力欄 -->
    <form
      @submit.prevent="sendMessage"
      class="fixed bottom-14 left-0 w-full bg-white border-t flex items-center p-3 space-x-2"
    >
      <input
        v-model="newMessage"
        type="text"
        placeholder="メッセージを入力"
        class="flex-1 px-4 py-2 border rounded-full focus:outline-none"
      />
      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">送信</button>
    </form>

    <!-- NavBar -->
    <NavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, defineProps } from 'vue'
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import NavBar from '../components/NavBar.vue'

const props = defineProps<{ roomId: string }>()
const { currentUser: user } = storeToRefs(useUserStore())

const newMessage = ref('')
const messages = ref<any[]>([])
const scrollArea = ref<HTMLDivElement | null>(null)
const roomName = ref('')

const messagesRef = collection(db, `chatRooms/${props.roomId}/messages`)
const q = query(messagesRef, orderBy('createdAt'))

const fetchRoomName = async () => {
  const docRef = doc(db, 'chatRooms', props.roomId)
  const docSnap = await getDoc(docRef)
  roomName.value = docSnap.exists() ? docSnap.data().name : '不明なルーム'
}

onMounted(() => {
  fetchRoomName()
  onSnapshot(q, async (snapshot) => {
    const tempMessages: any[] = []
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data()
      const userDoc = await getDoc(doc(db, 'users', data.senderEmail))
      const userData = userDoc.exists() ? userDoc.data() : { name: '不明なユーザ' }

      tempMessages.push({
        id: docSnap.id,
        text: data.text,
        senderEmail: data.senderEmail,
        name: userData.name,
        createdAt: data.createdAt,
      })
    }
    messages.value = tempMessages
    await nextTick()
    scrollArea.value?.scrollTo(0, scrollArea.value.scrollHeight)
  })
})

const sendMessage = async () => {
  if (!newMessage.value.trim() || !user.value?.email) return
  await addDoc(messagesRef, {
    text: newMessage.value,
    senderEmail: user.value.email,
    createdAt: serverTimestamp(),
  })
  newMessage.value = ''
}
</script>

<style scoped>
/* メッセージの方向を統一 */
.self-end {
  align-self: flex-end;
}
.self-start {
  align-self: flex-start;
}
</style>
