

import { auth, db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

// Retrieve user profile, including displayName and Firestore-stored name
export const fetchUserProfile = async () => {
  const currentUser = auth.currentUser
  if (!currentUser) return null

  const email = currentUser.email
  let firestoreName = null
  if (email) {
    const userDoc = await getDoc(doc(db, 'users', email))
    if (userDoc.exists()) {
      firestoreName = userDoc.data().name
    }
  }

  return {
    uid: currentUser.uid,
    email: currentUser.email,
    displayName: currentUser.displayName || firestoreName,
  }
}