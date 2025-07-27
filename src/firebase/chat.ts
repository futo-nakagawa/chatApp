import { db } from './firebase'
import {
  addDoc, collection, doc, updateDoc, getDocs, query, where, arrayUnion
} from 'firebase/firestore'

export const createChatRoom = async (
  members: string[],
  partnerName: string,
  chatName?: string
) => {
  const name = chatName?.trim() || ''
  const docRef = await addDoc(collection(db, 'chatRooms'), {
    members,
    name,
    partnerName,
    createdAt: new Date()
  })
  return docRef.id
}

export const getChatRooms = async (email: string) => {
  const q = query(collection(db, 'chatRooms'), where('members', 'array-contains', email))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
