import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
  }),
  actions: {
    setUser(user: User) {
      this.currentUser = user
    },
    clearUser() {
      this.currentUser = null
    }
  }
})
