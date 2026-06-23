import { Target } from '@/types'

interface ScanProgressProps {
  target: Target
}

export default function ScanProgress({ target }: ScanProgressProps) {
  const progress =
    target.status === 'pending'
      ? 25
      : target.status === 'analyzing'
        ? 50
        : target.status === 'completed'
          ? 100
          : 0

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    analyzing: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">{target.url}</h3>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[target.status]}`}>
          {target.status === 'pending'
            ? 'Aguardando'
            : target.status === 'analyzing'
              ? 'Analisando'
              : target.status === 'completed'
                ? 'Completo'
                : 'Erro'}
        </span>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">{progress}% concluído</p>
    </div>
  )
}
