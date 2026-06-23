import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

export default function Toast() {
  const { toast, hideToast } = useUIStore()

  if (!toast) return null

  const icons = {
    success: <CheckCircle className="text-green-600" size={20} />,
    error: <AlertCircle className="text-red-600" size={20} />,
    info: <Info className="text-blue-600" size={20} />,
  }

  const backgrounds = {
    success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700',
    error: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700',
    info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border ${backgrounds[toast.type]}`}
      >
        {icons[toast.type]}
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          onClick={hideToast}
          className="ml-2 p-1 hover:bg-black hover:bg-opacity-10 rounded"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
