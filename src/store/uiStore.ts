import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  currentPage: string
  toggleSidebar: () => void
  setCurrentPage: (page: string) => void
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
  hideToast: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  currentPage: 'dashboard',
  toast: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setCurrentPage: (page: string) => set({ currentPage: page }),
  
  showToast: (message: string, type: 'success' | 'error' | 'info') => {
    set({ toast: { message, type } })
    setTimeout(() => set({ toast: null }), 3000)
  },
  
  hideToast: () => set({ toast: null }),
}))
