<template>
  <div class="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto px-4 pt-4">
    <h2 class="text-xl font-bold mb-4">マイアカウント</h2>
    <div class="bg-white p-4 rounded shadow space-y-2">
      <div>
        <span class="font-semibold">名前:</span>
        <span>{{ user?.displayName || '未設定' }}</span>
      </div>
      <div>
        <span class="font-semibold">メール:</span>
        <span>{{ user?.email }}</span>
      </div>
    </div>
    <button @click="goBack" class="btn w-full mt-4">戻る</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'

const router = useRouter()
const { currentUser: user } = storeToRefs(useUserStore())

const goBack = () => {
  router.back()
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