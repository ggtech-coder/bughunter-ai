import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useAnalysisStore } from '@/store/analysisStore'
import URLInput from '@/components/Scanner/URLInput'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { targets, getTargets } = useAnalysisStore()

  useEffect(() => {
    if (user) {
      getTargets(user.uid)
    }
  }, [user, getTargets])

  const stats = {
    totalAnalyses: targets.length,
    criticalRisks: targets.reduce(
      (sum, t) => sum + (t.analysisResults.risks?.filter(r => r.severity === 'critical').length || 0),
      0
    ),
    highRisks: targets.reduce(
      (sum, t) => sum + (t.analysisResults.risks?.filter(r => r.severity === 'high').length || 0),
      0
    ),
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Bem-vindo, {user?.displayName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <p className="text-slate-600 dark:text-slate-400 text-sm">Análises Totais</p>
          <p className="text-3xl font-bold mt-2">{stats.totalAnalyses}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <p className="text-red-600 text-sm">Riscos Críticos</p>
          <p className="text-3xl font-bold mt-2">{stats.criticalRisks}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <p className="text-orange-600 text-sm">Riscos Altos</p>
          <p className="text-3xl font-bold mt-2">{stats.highRisks}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Nova Análise</h2>
        <URLInput onSuccess={() => getTargets(user?.uid || '')} />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Histórico de Análises</h2>
        {targets.length === 0 ? (
          <p className="text-slate-600">Nenhuma análise realizada ainda</p>
        ) : (
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
        )}
      </div>
    </div>
  )
}
