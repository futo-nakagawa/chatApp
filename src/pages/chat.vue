<template>
  <div class="flex flex-col h-screen bg-gray-100 pb-16">
    <!-- ヘッダー -->
    <div class="bg-green-600 text-white p-4 flex items-center shadow">
      <router-link to="/chatroom" class="mr-4 font-bold">←</router-link>
      <div class="flex items-center justify-between flex-1">
        <h2 class="text-lg font-semibold truncate">{{ roomName }}</h2>
        <button @click="showSettings = true" class="text-sm underline">設定</button>
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

    <!-- ルーム設定モーダル -->
    <div v-if="showSettings" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded w-80">
        <h3 class="text-lg font-bold mb-2">ルーム設定</h3>
        <div class="mb-2">
          <label class="block text-sm font-semibold mb-1">ルーム名</label>
          <input v-model="editedRoomName" class="w-full border rounded px-2 py-1" />
          <button @click="updateRoomName" class="mt-2 btn w-full">名前を更新</button>
        </div>
        <div class="mb-2">
          <h4 class="font-semibold">メンバー</h4>
          <ul class="mb-2">
            <li v-for="member in members" :key="member" class="flex justify-between items-center">
              <span>{{ member }}</span>
              <button @click="removeMember(member)" class="text-red-500 text-xs">削除</button>
            </li>
          </ul>
          <input v-model="newMemberEmail" placeholder="メールアドレス" class="w-full border rounded px-2 py-1 mb-2" />
          <button @click="addMember" class="btn w-full">メンバー追加</button>
        </div>
        <button @click="showSettings = false" class="mt-4 text-gray-600 underline">閉じる</button>
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
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore'
import NavBar from '../components/NavBar.vue'

const props = defineProps<{ roomId: string }>()
const { currentUser: user } = storeToRefs(useUserStore())

const newMessage = ref('')
const messages = ref<any[]>([])
const scrollArea = ref<HTMLDivElement | null>(null)
const roomName = ref('')

const messagesRef = collection(db, `chatRooms/${props.roomId}/messages`)
const q = query(messagesRef, orderBy('createdAt'))

const showSettings = ref(false)
const editedRoomName = ref('')
const newMemberEmail = ref('')
const members = ref<string[]>([])

const fetchRoomName = async () => {
  const docRef = doc(db, 'chatRooms', props.roomId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    if (data.name && data.name.trim() !== '') {
      roomName.value = data.name
      editedRoomName.value = data.name
    } else if (data.partnerName) {
      roomName.value = `${data.partnerName}のチャット`
      editedRoomName.value = roomName.value
    } else {
      roomName.value = '不明なルーム'
      editedRoomName.value = ''
    }
    members.value = data.members || []
  } else {
    roomName.value = '不明なルーム'
    editedRoomName.value = ''
    members.value = []
  }
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


const updateRoomName = async () => {
  if (!editedRoomName.value.trim()) return
  await updateDoc(doc(db, 'chatRooms', props.roomId), { name: editedRoomName.value })
  roomName.value = editedRoomName.value
  showSettings.value = false
}

const addMember = async () => {
  if (!newMemberEmail.value.trim()) return
  await updateDoc(doc(db, 'chatRooms', props.roomId), {
    members: arrayUnion(newMemberEmail.value.trim())
  })
  members.value.push(newMemberEmail.value.trim())
  newMemberEmail.value = ''
}

const removeMember = async (email: string) => {
  await updateDoc(doc(db, 'chatRooms', props.roomId), {
    members: arrayRemove(email)
  })
  members.value = members.value.filter(m => m !== email)
}
</script>

<style scoped></style>
