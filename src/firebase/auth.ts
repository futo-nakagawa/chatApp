<<<<<<< Updated upstream:src/firebase/auth.ts
import {auth, db} from './firebase'
=======
<<<<<<< Updated upstream:src/lib/auth.ts
import {auth, db} from '../firebase'
>>>>>>> Stashed changes:src/lib/auth.ts
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth'
=======
import {auth, db} from './firebase'
import {signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        onAuthStateChanged
       } from 'firebase/auth'
>>>>>>> Stashed changes:src/firebase/auth.ts
import {doc, setDoc} from 'firebase/firestore'
import { useUserStore } from '../stores/user'

export const loginUser = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const signupUser = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    const userRef = doc(db, 'users', result.user.uid)
    await setDoc(userRef,{
        uid: result.user.uid,
        name: name,
        email: result.user.email,
        createdAt: new Date()
    })
    return result
}
<<<<<<< Updated upstream:src/firebase/auth.ts
=======
<<<<<<< Updated upstream:src/lib/auth.ts
=======
>>>>>>> Stashed changes:src/lib/auth.ts

export const logout = async () => {
  await auth.signOut()
};

<<<<<<< Updated upstream:src/firebase/auth.ts


=======
onAuthStateChanged(auth, (user) => {
  const userStore = useUserStore()
  if (user) {
    userStore.setUser(user)
  } else {
    userStore.clearUser()
  }
})
>>>>>>> Stashed changes:src/firebase/auth.ts
>>>>>>> Stashed changes:src/lib/auth.ts
