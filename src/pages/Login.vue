<template>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { loginUser, signupUser } from '../firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const name = ref('')
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
