import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useFirestore } from '@/hooks/useFirestore'
import { Report } from '@/types'

export default function Reports() {
  const { user } = useAuthStore()
  const { getByField } = useFirestore('reports')
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadReports()
    }
  }, [user])

  const loadReports = async () => {
    try {
      const data = await getByField('userId', user?.uid)
      setReports(data as Report[])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
        <p className="text-slate-600">Gere e visualize relatórios de segurança</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6">
          + Novo Relatório
        </button>

        {reports.length === 0 ? (
          <p className="text-slate-600">Nenhum relatório gerado</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:shadow-lg transition">
                <h3 className="font-bold text-lg mb-2">{report.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{report.description}</p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{report.reportType}</span>
                  <span>{new Date(report.generatedAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 px-2 py-1 text-sm bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-800">
                    Ver
                  </button>
                  <button className="flex-1 px-2 py-1 text-sm bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-green-800">
                    Baixar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
