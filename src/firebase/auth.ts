import {auth, db} from './firebase'
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth'
import {doc, setDoc} from 'firebase/firestore'

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

export const logout = async () => {
  await auth.signOut()
};



