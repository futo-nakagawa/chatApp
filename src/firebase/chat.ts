// src/firebase/chat.ts
import { db } from '../firebase/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export const fetchChatRooms = async (uid: string) => {
  const q = query(collection(db, "chatRooms"), where("members", "array-contains", uid)); 
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
};

