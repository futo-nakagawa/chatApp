<template>
<<<<<<< Updated upstream
  <div>
    <h1>{{ isLogin ? 'ログイン' : 'サインアップ' }}</h1>
    <input v-model="email" placeholder="メールアドレス" />
    <input v-model="password" placeholder="パスワード" type="password" />
    <input v-if="!isLogin" v-model="name" placeholder="ユーザ名" />

    <button @click="handleSubmit">
      {{ isLogin ? 'ログイン' : 'サインアップ' }}
    </button>

    <p @click="isLogin = !isLogin">
      {{ isLogin ? 'アカウントをお持ちですか？' : 'アカウントをお持ちじゃありませんか？' }}
    </p>
=======
  <div class="max-w-md mx-auto py-12 px-4">
    <h2 class="text-2xl font-bold mb-4">ログイン・サインアップ</h2>
    <input v-model="email" type="email" placeholder="メール" class="input" />
    <input v-model="password" type="password" placeholder="パスワード" class="input" />
    <input v-model="name" type="text" placeholder="名前 (サインアップ用)" class="input" />
    <div class="flex gap-4">
      <button @click="handleLogin" class="btn">ログイン</button>
      <button @click="handleSignup" class="btn">サインアップ</button>
    </div>
>>>>>>> Stashed changes
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { loginUser, signupUser } from '../firebase/auth'
import { useRouter } from 'vue-router'
import { loginUser, signupUser } from '../firebase/auth'

const email = ref('')
const password = ref('')
const name = ref('')
<<<<<<< Updated upstream
const isLogin = ref(true)

const router = useRouter()

const handleSubmit = async () => {
  if (isLogin.value) {
    await loginUser(email.value, password.value);
    router.push('/chat')
  } else {
    await signupUser(email.value, password.value, name.value);
    router.push('/chat')
  }
}
</script>
=======
const router = useRouter()

const handleLogin = async () => {
  await loginUser(email.value, password.value)
  router.push('/chatroom')
}

const handleSignup = async () => {
  await signupUser(email.value, password.value, name.value)
  router.push('/chatroom')
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
>>>>>>> Stashed changes
