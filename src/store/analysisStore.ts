import { create } from 'zustand'
import { Target, AnalysisResult } from '@/types'
import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore'

interface AnalysisStore {
  targets: Target[]
  currentTarget: Target | null
  loading: boolean
  error: string | null
  createTarget: (userId: string, url: string) => Promise<Target>
  getTargets: (userId: string) => Promise<void>
  getTargetById: (targetId: string) => Promise<Target | null>
  updateTargetResults: (targetId: string, results: AnalysisResult) => Promise<void>
  deleteTarget: (targetId: string) => Promise<void>
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  targets: [],
  currentTarget: null,
  loading: false,
  error: null,

  createTarget: async (userId: string, url: string) => {
    try {
      set({ loading: true, error: null })
      
      const target = {
        userId,
        url,
        domain: new URL(url).hostname,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending' as const,
        analysisResults: {} as AnalysisResult,
      }

      const docRef = await addDoc(collection(db, 'targets'), target)
      const newTarget: Target = { ...target, id: docRef.id }
      
      set((state) => ({
        targets: [...state.targets, newTarget],
        currentTarget: newTarget,
        loading: false,
      }))

      return newTarget
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  getTargets: async (userId: string) => {
    try {
      set({ loading: true, error: null })
      const q = query(collection(db, 'targets'), where('userId', '==', userId))
      const snapshot = await getDocs(q)
      const targets: Target[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Target[]

      set({ targets, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  getTargetById: async (targetId: string) => {
    try {
      const docRef = doc(db, 'targets', targetId)
      const snapshot = await getDoc(docRef)
      
      if (snapshot.exists()) {
        const target = { ...snapshot.data(), id: snapshot.id } as Target
        set({ currentTarget: target })
        return target
      }
      
      return null
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  updateTargetResults: async (targetId: string, results: AnalysisResult) => {
    try {
      const docRef = doc(db, 'targets', targetId)
      await updateDoc(docRef, {
        analysisResults: results,
        status: 'completed',
        updatedAt: new Date(),
      })

      set((state) => ({
        currentTarget: state.currentTarget
          ? { ...state.currentTarget, analysisResults: results, status: 'completed' }
          : null,
      }))
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  deleteTarget: async (targetId: string) => {
    try {
      // Implement delete logic
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },
}))
