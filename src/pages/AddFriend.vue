<template>
  <div class="max-w-md mx-auto py-8 px-4">
    <h2 class="text-xl font-bold mb-4">友達追加</h2>
    <input v-model="email" type="email" placeholder="メールアドレス" class="input" />
    <button @click="handleAddFriend" class="btn w-full mt-2">追加</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addFriendByEmail } from '../firebase/friend'
import { useUserStore } from '../stores/user'

const email = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleAddFriend = async () => {
  if (!userStore.currentUser?.email) return
  try {
    await addFriendByEmail(userStore.currentUser.email, email.value)
    alert('友達を追加しました')
    router.push('/friends')
  } catch {
    alert('ユーザーが見つかりません')
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.btn {
  padding: 8px;
  background-color: #00b900;
  color: white;
  border-radius: 6px;
}
</style>
