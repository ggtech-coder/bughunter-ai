import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { Menu } from 'lucide-react'
import GlobalSearch from '@/components/Search/GlobalSearch'

export default function Header() {
  const { user } = useAuthStore()
  const { toggleSidebar } = useUIStore()

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold whitespace-nowrap">BugHunter AI</h1>
      </div>

      <div className="flex-1 max-w-md">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="font-medium">{user?.displayName}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</p>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {user?.displayName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
