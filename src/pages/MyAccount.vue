<template>
  <div class="flex flex-col h-screen max-w-md mx-auto">
    <div class="bg-green-600 text-white p-4 flex items-center">
      <h2 class="text-xl font-bold">{{ roomName }}</h2>
      <button @click="showSettings = true" class="ml-2 text-sm underline">設定</button>
    </div>
    <div class="flex-1 overflow-auto p-4 space-y-2">
      <div v-for="message in messages" :key="message.id" class="p-2 rounded bg-gray-200">
        <div class="text-sm font-semibold">{{ message.sender }}</div>
        <div>{{ message.text }}</div>
      </div>
    </div>

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

    <form @submit.prevent="sendMessage" class="p-4 bg-white flex space-x-2">
      <input v-model="newMessage" placeholder="メッセージを入力" class="flex-1 border rounded px-2 py-1" />
      <button type="submit" class="btn">送信</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useRoute } from 'vue-router'

const route = useRoute()
const props = { roomId: route.params.id as string }

const roomName = ref('')
const messages = ref<{ id: string; sender: string; text: string }[]>([])
const newMessage = ref('')

const showSettings = ref(false)
const editedRoomName = ref('')
const newMemberEmail = ref('')
const members = ref<string[]>([])

const fetchRoomName = async () => {
  const docRef = doc(db, 'chatRooms', props.roomId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    roomName.value = data.name || ''
    editedRoomName.value = roomName.value
    members.value = data.members || []
  }
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

const sendMessage = async () => {
  // existing send message logic
}

onMounted(() => {
  fetchRoomName()
  // existing fetch messages logic
})
</script>

<style scoped>
.btn {
  background-color: #00b900;
  color: white;
  padding: 6px 16px;
  border-radius: 4px;
}
</style>