import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useFirestore } from '@/hooks/useFirestore'
import { Vulnerability } from '@/types'

export default function Vulnerabilities() {
  const { user } = useAuthStore()
  const { getByField } = useFirestore('findings')
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadVulnerabilities()
    }
  }, [user])

  const loadVulnerabilities = async () => {
    try {
      const data = await getByField('userId', user?.uid)
      setVulnerabilities(data as Vulnerability[])
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
        <h1 className="text-3xl font-bold mb-2">Vulnerabilidades</h1>
        <p className="text-slate-600">Gerencie vulnerabilidades e achados de segurança</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        {vulnerabilities.length === 0 ? (
          <p className="text-slate-600">Nenhuma vulnerabilidade registrada</p>
        ) : (
          <div className="space-y-4">
            {vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{vuln.title}</h3>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    vuln.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    vuln.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {vuln.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-2">{vuln.description}</p>
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>Status: {vuln.status}</span>
                  <span>{new Date(vuln.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
