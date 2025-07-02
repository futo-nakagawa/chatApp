<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg relative">
      <h2 class="text-xl font-semibold mb-4">
        {{ modeTitle }}
      </h2>

      <!-- フレンド追加用：メール入力 -->
      <div v-if="mode === 'add-friend'" class="space-y-2">
        <input
          v-model="email"
          type="email"
          placeholder="メールアドレスを入力"
          class="w-full p-2 border rounded"
        />
        <button @click="handleAddFriend" class="btn w-full">追加</button>
      </div>

      <!-- チャット作成用 -->
      <div v-else>
        <!-- グループ名入力（グループモード時のみ） -->
        <div v-if="mode === 'create-group'" class="mb-2">
          <input
            v-model="groupName"
            type="text"
            placeholder="グループ名を入力"
            class="w-full p-2 border rounded"
          />
        </div>

        <!-- 友達リストチェック -->
        <div class="max-h-60 overflow-y-auto border rounded p-2 mb-4">
          <div
            v-for="friend in friends"
            :key="friend.email"
            class="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              :value="friend.email"
              v-model="selected"
              :id="friend.email"
            />
            <label :for="friend.email">{{ friend.name }}</label>
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="$emit('close')" class="text-gray-600 px-3 py-1">キャンセル</button>
          <button @click="submit" class="btn">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { db, auth } from '../firebase/firebase'
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore'

const props = defineProps<{
  visible: boolean
  mode: 'add-friend' | 'create-chat' | 'create-group'
  friends: { email: string; name: string }[]
}>()

const emit = defineEmits<{
  (e: 'submit', payload: any): void
  (e: 'close'): void
}>()

const email = ref('')
const selected = ref<string[]>([])
const groupName = ref('')

const modeTitle = computed(() => {
  switch (props.mode) {
    case 'add-friend':
      return '友達を追加'
    case 'create-group':
      return 'グループチャット作成'
    default:
      return 'チャット作成'
  }
})

// 友達追加処理
const handleAddFriend = async () => {
  if (!email.value.trim()) return alert('メールアドレスを入力してください')
  const currentUser = auth.currentUser
  if (!currentUser?.email) return

  const q = query(collection(db, 'users'), where('email', '==', email.value.trim()))
  const snap = await getDocs(q)
  if (snap.empty) {
    alert('ユーザーが見つかりません')
    return
  }

  const friendData = snap.docs[0].data()
  const friendRef = doc(db, 'users', currentUser.email, 'friends', friendData.email)

  await setDoc(friendRef, {
    email: friendData.email,
    name: friendData.name,
  })

  alert('友達を追加しました')
  emit('close')
}

// チャット作成（1対1 or グループ）
const submit = () => {
  if (selected.value.length === 0) {
    alert('1人以上選択してください')
    return
  }
  if (props.mode === 'create-group' && !groupName.value.trim()) {
    alert('グループ名を入力してください')
    return
  }

  emit('submit', {
    mode: props.mode,
    selected: selected.value,
    groupName: groupName.value.trim(),
  })
  selected.value = []
  groupName.value = ''
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
