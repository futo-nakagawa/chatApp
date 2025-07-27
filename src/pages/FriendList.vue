<template>
  <div class="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto px-4 pt-4">
    <h2 class="text-2xl font-bold mb-4">友達一覧</h2>
    <ul class="space-y-2 mb-6">
      <li
        v-for="friend in friends"
        :key="friend.email"
        class="flex justify-between items-center bg-white p-3 rounded shadow"
      >
        <span class="truncate">{{ friend.name }}</span>
      </li>
    </ul>
    <button @click="showAddFriend = true" class="btn w-full mb-2">友達追加</button>
    <ModalDialog
      :visible="showAddFriend"
      mode="add-friend"
      :friends="[]"
      @close="showAddFriend = false"
      @submit="onAdded"
    />
    <NavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFriends } from '../firebase/friend'
import { useUserStore } from '../stores/user'
import NavBar from '../components/NavBar.vue'
import ModalDialog from '../components/ModalDialog.vue'

const userStore = useUserStore()
const friends = ref<{ email: string; name: string }[]>([])
const showAddFriend = ref(false)

const loadFriends = async () => {
  if (!userStore.currentUser?.email) return
  friends.value = await getFriends(userStore.currentUser.email)
}

const onAdded = async () => {
  showAddFriend.value = false
  await loadFriends()
}

onMounted(loadFriends)
</script>

<style scoped>
.btn {
  background-color: #00b900;
  color: white;
  padding: 6px 16px;
  border-radius: 4px;
}
</style>
