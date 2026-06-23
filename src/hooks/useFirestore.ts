import { useState, useCallback } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useFirestore(collectionName: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const add = useCallback(
    async (data: any) => {
      try {
        setLoading(true)
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: new Date(),
        })
        return docRef.id
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [collectionName]
  )

  const getAll = useCallback(async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, collectionName))
      return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  const getByField = useCallback(
    async (field: string, value: any) => {
      try {
        setLoading(true)
        const q = query(collection(db, collectionName), where(field, '==', value))
        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [collectionName]
  )

  const update = useCallback(
    async (id: string, data: any) => {
      try {
        setLoading(true)
        await updateDoc(doc(db, collectionName, id), {
          ...data,
          updatedAt: new Date(),
        })
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [collectionName]
  )

  const remove = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        await deleteDoc(doc(db, collectionName, id))
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [collectionName]
  )

  return { add, getAll, getByField, update, remove, loading, error }
}
