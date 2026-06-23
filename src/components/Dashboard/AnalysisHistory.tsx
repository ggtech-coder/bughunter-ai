import { Target } from '@/types'
import { useNavigate } from 'react-router-dom'

export default function AnalysisHistory({ targets }: { targets: Target[] }) {
  const navigate = useNavigate()

  return (
    <div className="space-y-2">
      {targets.map((target) => (
        <button
          key={target.id}
          onClick={() => navigate(`/analysis/${target.id}`)}
          className="w-full text-left p-3 border border-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{target.url}</span>
            <span className={`text-sm px-2 py-1 rounded ${
              target.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {target.status}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
