import { auth, db } from './firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useUserStore } from '../stores/user'

type FriendlyAuthError = Error & { code?: string }

const toFriendlyError = (error: any): FriendlyAuthError => {
  const code = error?.code as string | undefined
  let message = '認証でエラーが発生しました'

  switch (code) {
    // ログイン系
    case 'auth/invalid-email':
      message = 'メールアドレスの形式が正しくありません'
      break
    case 'auth/user-disabled':
      message = 'このアカウントは無効化されています'
      break
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      message = 'メールアドレスまたはパスワードが間違っています'
      break

    // サインアップ系
    case 'auth/email-already-in-use':
      message = 'このメールアドレスは既に使用されています'
      break
    case 'auth/weak-password':
      message = 'パスワードが弱すぎます（6文字以上にしてください）'
      break

    default:
      // それ以外のコードはそのまま code を保持しつつ汎用メッセージ
      break
  }

  const friendly = new Error(message) as FriendlyAuthError
  if (code) friendly.code = code
  return friendly
}

export const loginUser = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (e) {
    throw toFriendlyError(e)
  }
}

export const signupUser = async (email: string, password: string, name: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    const userRef = doc(db, 'users', result.user.email!)
    await setDoc(userRef, {
      uid: result.user.uid,
      name,
      email: result.user.email,
      createdAt: new Date(),
    })
    return result
  } catch (e) {
    throw toFriendlyError(e)
  }
}

export const logout = async () => {
  await auth.signOut()
}

onAuthStateChanged(auth, (user) => {
  const userStore = useUserStore()
  if (user) {
    userStore.setUser(user)
  } else {
    userStore.clearUser()
  }
})