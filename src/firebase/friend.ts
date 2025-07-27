import { db } from './firebase'
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore'

export const addFriendByEmail = async (currentEmail: string, email: string) => {
  const q = query(collection(db, 'users'), where('email', '==', email))
  const snap = await getDocs(q)
  if (snap.empty) {
    throw new Error('User not found')
  }
  const friendData = snap.docs[0].data()
  const ref = doc(db, 'users', currentEmail, 'friends', friendData.email)
  await setDoc(ref, {
    email: friendData.email,
    name: friendData.name,
  })
}

export const getFriends = async (userEmail: string) => {
  const q = query(collection(db, 'users', userEmail, 'friends'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({
    email: d.data().email as string,
    name: d.data().name as string,
  }))
}
