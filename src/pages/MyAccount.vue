<template>
  <div class="flex flex-col h-screen max-w-md mx-auto p-4 bg-gray-50">
    <h2 class="text-xl font-bold mb-4">マイアカウント</h2>
    <div class="bg-white p-4 rounded shadow space-y-2 mb-4">
      <div>
        <span class="font-semibold">名前:</span>
        <input v-model="editedName" class="w-full border rounded px-2 py-1 mt-1" />
      </div>
      <div>
        <span class="font-semibold">メール:</span>
        <span class="ml-2">{{ user?.email }}</span>
      </div>
    </div>
    <button @click="updateUserName" class="btn w-full mb-2">名前を更新</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase/firebase'

const { currentUser: user } = storeToRefs(useUserStore())
const editedName = ref('')

onMounted(() => {
  editedName.value = user.value?.displayName || user.value?.name || ''
})

const updateUserName = async () => {
  if (!editedName.value.trim()) return
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: editedName.value })
  }
  if (user.value) {
    user.value.displayName = editedName.value
  }
  alert('名前を更新しました')
}
</script>

<style scoped>
.btn {
  background-color: #00b900;
  color: white;
  padding: 6px 16px;
  border-radius: 4px;
}
</style>