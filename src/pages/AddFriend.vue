<template>
  <div class="p-4 pb-20 min-h-screen bg-gray-50">
    <h2 class="text-2xl font-bold mb-4">友達リスト</h2>

    <ul class="space-y-2 mb-6">
      <li
        v-for="friend in friends"
        :key="friend.email"
        class="bg-white p-3 rounded shadow flex justify-between items-center"
      >
        <span>{{ friend.name }}</span>
        <span class="text-sm text-gray-500">{{ friend.email }}</span>
      </li>
    </ul>

    <button @click="modalVisible = true" class="btn w-full">友達を追加</button>

    <ModalDialog
      v-if="modalVisible"
      :visible="modalVisible"
      mode="create-chat"
      :friends="[]"
      @submit="handleAddFriend"
      @close="modalVisible = false"
    />

    <NavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import ModalDialog from '../components/ModalDialog.vue'
import NavBar from '../components/NavBar.vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const currentUser = userStore.currentUser

const friends = ref<{ email: string; name: string }[]>([])
const modalVisible = ref(false)

const loadFriends = async () => {
  if (!currentUser?.email) return
  const snap = await getDocs(collection(db, 'users', currentUser.email, 'friends'))
  friends.value = snap.docs.map(doc => doc.data() as { email: string; name: string })
}

const handleAddFriend = async (payload: { mode: string; selected: string[] }) => {
  if (!currentUser?.email) return
  const targetEmail = payload.selected[0]
  const userDoc = await getDoc(doc(db, 'users', targetEmail))
  if (!userDoc.exists()) return alert('ユーザーが存在しません')

  const userData = userDoc.data()
  await setDoc(doc(db, 'users', currentUser.email, 'friends', targetEmail), {
    email: targetEmail,
    name: userData.name,
  })

  modalVisible.value = false
  await loadFriends()
}

onMounted(() => {
  loadFriends()
})
</script>

<style scoped>
.btn {
  background-color: #00b900;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
}
</style>
