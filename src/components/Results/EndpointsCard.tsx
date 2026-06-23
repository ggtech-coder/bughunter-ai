import { Endpoint } from '@/types'
import { Globe, Lock, AlertTriangle } from 'lucide-react'

interface EndpointsCardProps {
  endpoints: Endpoint[]
}

export default function EndpointsCard({ endpoints }: EndpointsCardProps) {
  const publicEndpoints = endpoints.filter((e) => e.isPublic)
  const protectedEndpoints = endpoints.filter((e) => !e.isPublic)

  const getStatusColor = (status: number) => {
    if (status < 300) return 'text-green-600'
    if (status < 400) return 'text-blue-600'
    if (status < 500) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">Endpoints</h3>

      <div className="space-y-4">
        {publicEndpoints.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-orange-600" size={18} />
              <p className="text-sm font-medium">Endpoints Públicos ({publicEndpoints.length})</p>
            </div>
            <div className="space-y-1">
              {publicEndpoints.map((endpoint, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900 rounded text-sm">
                  <code className="font-mono text-orange-700 dark:text-orange-300">{endpoint.path}</code>
                  <span className={`font-bold ${getStatusColor(endpoint.statusCode)}`}>
                    {endpoint.statusCode}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {protectedEndpoints.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="text-green-600" size={18} />
              <p className="text-sm font-medium">Endpoints Protegidos ({protectedEndpoints.length})</p>
            </div>
            <div className="space-y-1">
              {protectedEndpoints.map((endpoint, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900 rounded text-sm">
                  <code className="font-mono text-green-700 dark:text-green-300">{endpoint.path}</code>
                  <span className={`font-bold ${getStatusColor(endpoint.statusCode)}`}>
                    {endpoint.statusCode}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {endpoints.length === 0 && (
          <p className="text-slate-600 dark:text-slate-400">Nenhum endpoint descoberto</p>
        )}
      </div>
    </div>
  )
}
