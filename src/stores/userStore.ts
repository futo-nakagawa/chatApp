import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { fetchUserProfile } from '../firebase/user'

import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null | any>(null)
  const loading = ref(true)

  async function initUser() {
    loading.value = true
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          currentUser.value = await fetchUserProfile()
        } catch (e) {
          console.error('ユーザー情報の取得に失敗しました', e)
          currentUser.value = firebaseUser
        }
      } else {
        currentUser.value = null
      }
      loading.value = false
    })
  }

  function setUser(user: User) {
    currentUser.value = user
  }

  function clearUser() {
    currentUser.value = null
  }

  return {
    currentUser,
    loading,
    initUser,
    setUser,
    clearUser,
  }
})
