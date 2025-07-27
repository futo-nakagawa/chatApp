<template>
  <nav class="fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50">
    <div class="flex justify-around items-center py-2">
      <router-link to="/chatroom" class="nav-item">チャット</router-link>
      <router-link to="/friends" class="nav-item">友達</router-link>
      <button @click="logoutAndRedirect" class="nav-item text-red-500">ログアウト</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { logout } from '../firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const logoutAndRedirect = async () => {
  await logout()
  router.push('/')
}
</script>

<style scoped>
.nav-item {
  padding: 8px 16px;
  font-weight: 500;
  text-align: center;
}
</style>
