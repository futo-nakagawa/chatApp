<template>
  <div>
    <h1>チャットに招待したいユーザのメールアドレス</h1>
    <input v-model="email" placeholder="メールアドレス" />
    <button @click="handleAddFriend">チャットに招待</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { db, auth } from '../firebase/firebase'
import { collection, query, where, getDocs, arrayUnion, updateDoc, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const email = ref('')
const router = useRouter()

const handleAddFriend = async () => {
  if (!auth.currentUser) return;

  // メールアドレスからユーザを取得
  const q = query(collection(db, "users"), where("email", "==", email.value))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    alert("ユーザが見つかりません")
    return
  }
  
  const friendId = snapshot.docs[0].id

  // 自分のチャットルームに招待する場合（ルームの管理方法に従う）
  // 例として最初のチャットルームに friendId を追加する場合:
  
  // 前に取得したチャットルームのID
  // ここではデモとして１つ取得するという設定
  // 本番ではルームIdもルーティングに伴って管理しておくべき
  const chatRooms = collection(db, "chatRooms")
  // ルームIdはルーティングや状態管理から取得して下さい
  const roomId = "yourChatRoomId"

  await updateDoc(doc(chatRooms, roomId), {
    members: arrayUnion(friendId)
  })
  
  alert("招待しました")
  router.push('/chat')
}
</script>
