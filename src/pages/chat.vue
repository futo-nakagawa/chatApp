<template>
  <div class="flex flex-col h-screen bg-gray-100 pb-16">
    <!-- ヘッダー -->
    <div class="bg-green-600 text-white p-4 flex items-center shadow">
      <router-link to="/chatroom" class="mr-4 font-bold">←</router-link>
      <div class="flex items-center space-x-2">
        <template v-if="editingName">
          <input
            v-model="editedName"
            class="text-black px-2 py-1 rounded"
            @keyup.enter="saveRoomName"
            @blur="saveRoomName"
          />
        </template>
        <template v-else>
          <h2 class="text-lg font-semibold truncate">{{ roomName }}</h2>
          <button @click="startEditing" class="text-sm underline">編集</button>
        </template>
      </div>
    </div>

    <!-- メッセージ一覧 -->
    <div ref="scrollArea" class="flex-1 overflow-y-auto p-3 space-y-4 flex flex-col">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="[
          'max-w-[75%] p-2 rounded-lg shadow',
          msg.senderEmail === user?.email
            ? 'bg-green-200 text-right ml-auto'
            : 'bg-white text-left mr-auto'
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
  updateDoc
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
const editingName = ref(false)
const editedName = ref('')

const messagesRef = collection(db, `chatRooms/${props.roomId}/messages`)
const q = query(messagesRef, orderBy('createdAt'))

const fetchRoomName = async () => {
  const docRef = doc(db, 'chatRooms', props.roomId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    if (data.name && data.name.trim() !== '') {
      roomName.value = data.name
    } else if (data.partnerName) {
      roomName.value = `${data.partnerName}のチャット`
    } else {
      roomName.value = '不明なルーム'
    }
  } else {
    roomName.value = '不明なルーム'
  }
}

const startEditing = () => {
  editedName.value = roomName.value
  editingName.value = true
}

const saveRoomName = async () => {
  if (!editedName.value.trim()) {
    editingName.value = false
    return
  }
  await updateDoc(doc(db, 'chatRooms', props.roomId), { name: editedName.value })
  roomName.value = editedName.value
  editingName.value = false
}

onMounted(() => {
  fetchRoomName()
  onSnapshot(q, async (snapshot) => {
    const tempMessages: any[] = []
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data()

      tempMessages.push({
        id: docSnap.id,
        text: data.text,
        senderEmail: data.senderEmail,
        name: data.senderName || '不明なユーザ',
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
    senderName: user.value.displayName || user.value.email,
    createdAt: serverTimestamp(),
  })
  newMessage.value = ''
}
</script>

<style scoped>
</style>
