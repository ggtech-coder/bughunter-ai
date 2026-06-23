import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, loading, error, register, login, logout, initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  }
}
