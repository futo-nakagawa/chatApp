<template>
    <div class="login">
        <h2>ログイン</h2>
        <input v-model="email" type="text" name="email" placeholder="example@email.com">
        <input v-model="password" type="text" name="password" placeholder="password">
        <button @click="login">ログイン</button>
        <button @click="signup">サインアップ</button>
        <p v-if="error">{{ error }}</p>
    </div>
</template>


<script setup lang="ts">
import {loginUser, signupUser} from '../lib/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref("")
const password = ref("")
const error = ref<string | null>(null)


const router = useRouter()

const login = async () => {
    try{
        await loginUser(email.value, password.value)
        router.push('/chat')
    }catch(err: any){
        error.value = 'ログイン失敗'
    }
}

const signup = async () => {
    try{
        await signupUser(email.value, password.value)
        router.push('/chat')
    }catch(err: any){
        error.value = '登録に失敗しました'
    }
}


</script>