<template>
  <div class="max-w-md mx-auto py-12 px-4">
    <h2 class="text-2xl font-bold mb-4">ログイン・サインアップ</h2>
    <input v-model="email" type="email" placeholder="メール" class="input" />
    <input v-model="password" type="password" placeholder="パスワード" class="input" />
    <input v-model="name" type="text" placeholder="名前 (サインアップ用)" class="input" />
    <p v-if="errorMessage" class="text-red-600 mb-2">{{ errorMessage }}</p>
    <div class="flex gap-4">
      <button @click="handleLogin" class="btn">ログイン</button>
      <button @click="handleSignup" class="btn">サインアップ</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, signupUser } from '../firebase/auth'

const email = ref('')
const password = ref('')
const name = ref('')
const errorMessage = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    errorMessage.value = ''
    await loginUser(email.value, password.value)
    router.push('/chatroom')
  } catch (error: any) {
    errorMessage.value = error?.message || 'ログインに失敗しました'
  }
}

const handleSignup = async () => {
  try {
    errorMessage.value = ''
    await signupUser(email.value, password.value, name.value)
    router.push('/chatroom')
  } catch (error: any) {
    errorMessage.value = error?.message || 'サインアップ中にエラーが発生しました'
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  margin-bottom: 8px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.btn {
  padding: 10px 16px;
  background-color: #00b900;
  color: white;
  border-radius: 8px;
}
</style>
