<template>
  <div class="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto px-4 pt-4">
    <h2 class="text-2xl font-bold mb-4">チャットルーム一覧</h2>

    <ul class="space-y-2 mb-6">
      <li
        v-for="room in chatRooms"
        :key="room.id"
        class="flex justify-between items-center bg-white p-3 rounded shadow"
      >
        <router-link
          :to="`/chat/${room.id}`"
          class="text-blue-600 hover:underline truncate"
        >
          {{ room.name }}
        </router-link>
        <button
          @click="leaveRoom(room.id)"
          class="text-sm text-red-600 hover:underline"
        >
          退出
        </button>
      </li>
    </ul>

    <button @click="openCreateModal('create-chat')" class="btn w-full mb-2">チャット作成</button>

    <ModalDialog
      :visible="modalVisible"
      :mode="modalMode"
      :friends="friends"
      @submit="handleModalSubmit"
      @close="modalVisible = false"
    />

    <NavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '../firebase/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  arrayRemove,
} from 'firebase/firestore'
import ModalDialog from '../components/ModalDialog.vue'
import NavBar from '../components/NavBar.vue'
import { useUserStore } from '../stores/user'

const chatRooms = ref<any[]>([])
const friends = ref<{ email: string; name: string }[]>([])
const modalVisible = ref(false)
const modalMode = ref<'create-chat' | 'create-group'>('create-chat')

const userStore = useUserStore()
const currentUser = userStore.currentUser

const loadChatRooms = async () => {
  if (!currentUser) return
  const q = query(collection(db, 'chatRooms'), where('members', 'array-contains', currentUser.email))
  const snap = await getDocs(q)
  chatRooms.value = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

const loadFriends = async () => {
  if (!currentUser?.email) return
  const q = query(collection(db, 'users', currentUser.email, 'friends'))
  const snap = await getDocs(q)
  friends.value = snap.docs.map((doc) => {
    const data = doc.data()
    return {
      email: data.email as string,
      name: data.name as string,
    }
  })
}

const leaveRoom = async (roomId: string) => {
  if (!currentUser) return
  const roomRef = doc(db, 'chatRooms', roomId)
  await updateDoc(roomRef, {
    members: arrayRemove(currentUser.email),
  })
  await loadChatRooms()
}

const openCreateModal = (mode: 'create-chat' | 'create-group') => {
  modalMode.value = mode
  modalVisible.value = true
}

const handleModalSubmit = async (payload: {
  mode: string
  selected: string[]
  groupName?: string
}) => {
  if (!currentUser) return
  const members = [...payload.selected, currentUser.email]
  const name = payload.mode === 'create-group'
    ? payload.groupName || 'グループチャット'
    : friends.value.find(f => f.email === payload.selected[0])?.name || 'チャット'

  await addDoc(collection(db, 'chatRooms'), { name, members })
  modalVisible.value = false
  await loadChatRooms()
}

onMounted(() => {
  loadChatRooms()
  loadFriends()
})
</script>
