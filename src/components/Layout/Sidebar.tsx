import { Link } from 'react-router-dom'
import { 
  Home, 
  Search, 
  AlertCircle, 
  FileText, 
  BookOpen, 
  Settings 
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

export default function Sidebar() {
  const { sidebarOpen, currentPage, setCurrentPage } = useUIStore()

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'vulnerabilities', label: 'Vulnerabilidades', icon: AlertCircle, path: '/vulnerabilities' },
    { id: 'reports', label: 'Relatórios', icon: FileText, path: '/reports' },
    { id: 'knowledge', label: 'Base de Conhecimento', icon: BookOpen, path: '/knowledge' },
    { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings' },
  ]

  return (
    <aside className={`bg-slate-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 border-b border-slate-800">
        <h2 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-lg text-center'}`}>
          {sidebarOpen ? 'BugHunter' : 'BH'}
        </h2>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                currentPage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
