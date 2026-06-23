import { create } from 'zustand'
import { User } from '@/types'
import { auth } from '@/lib/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

interface AuthStore {
  user: User | null
  loading: boolean
  error: string | null
  register: (email: string, password: string, displayName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  initAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  register: async (email: string, password: string, displayName: string) => {
    try {
      set({ error: null })
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      set({
        user: {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName,
          photoURL: result.user.photoURL || '',
          createdAt: new Date(),
          subscription: 'free',
        },
      })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ error: null })
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      set({
        user: {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'User',
          photoURL: result.user.photoURL || '',
          createdAt: new Date(),
          subscription: 'free',
        },
      })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  logout: async () => {
    try {
      await signOut(auth)
      set({ user: null, error: null })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  initAuth: () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            photoURL: firebaseUser.photoURL || '',
            createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
            subscription: 'free',
          },
          loading: false,
        })
      } else {
        set({ user: null, loading: false })
      }
    })
  },
}))
