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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const email = ref("")
const password = ref("")
const error = ref<string | null>(null)

const auth = getAuth()
const router = useRouter()

const login = async () => {
    try{
        await signInWithEmailAndPassword(auth, email.value, password.value)
        router.push('/chat')
    }catch(err: any){
        error.value = err.message
    }
}

const signup = async () => {
    try{
        await createUserWithEmailAndPassword(auth, email.value, password.value)
        router.push('/chat')
    }catch(err: any){
        error.value = err.message
    }
}


</script>