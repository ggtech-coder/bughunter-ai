import { useState } from 'react'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export function useStorage() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (path: string, file: File) => {
    try {
      setUploading(true)
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      return url
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (path: string) => {
    try {
      setUploading(true)
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  return { uploadFile, deleteFile, uploading, error }
}
