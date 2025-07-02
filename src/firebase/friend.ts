import { db } from './firebase'
import {
  doc, getDoc, setDoc, collection, query, where, getDocs
} from 'firebase/firestore'

export const addFriend = async (myEmail: string, friendEmail: string) => {
  const userRef = doc(db, 'users', friendEmail)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) throw new Error('ユーザーが存在しません')

  const myFriendRef = doc(db, 'users', myEmail, 'friends', friendEmail)
  await setDoc(myFriendRef, {
    email: friendEmail,
    name: userSnap.data().name,
  })
}

export const getFriends = async (email: string) => {
  const q = query(collection(db, 'users', email, 'friends'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data())
}
