import { SSLInfo } from '@/types'
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'

interface SecurityCardProps {
  ssl: SSLInfo
  headers: Record<string, string>
}

export default function SecurityCard({ ssl, headers }: SecurityCardProps) {
  const requiredHeaders = ['X-Content-Type-Options', 'X-Frame-Options', 'Strict-Transport-Security']
  const unverifiedHeaders = requiredHeaders.filter((h) => !headers[h])
  const sslChecked = ssl.issuer !== 'Não disponível' && ssl.issuer !== ''

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-bold">Segurança</h3>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Shield size={18} />
          SSL/TLS
        </h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
            <span>Status</span>
            <div className="flex items-center gap-1">
              {!sslChecked ? (
                <span className="text-slate-500">Não verificado</span>
              ) : ssl.isValid ? (
                <>
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-green-600">Válido</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={16} className="text-red-600" />
                  <span className="text-red-600">Expirado</span>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
            <span>Válido até</span>
            <span className="font-mono">{ssl.validTo}</span>
          </div>

          {sslChecked && (
            <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
              <span>Dias até expiração</span>
              <span
                className={`font-bold ${
                  ssl.daysUntilExpiry > 30 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {ssl.daysUntilExpiry}
              </span>
            </div>
          )}
        </div>
      </div>

      {unverifiedHeaders.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2 text-orange-600">
            <AlertTriangle size={18} />
            Headers Não Verificados
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Não confirmados como presentes — não significa que estejam ausentes (limitação do método de verificação atual)
          </p>

          <div className="space-y-1">
            {unverifiedHeaders.map((header) => (
              <div key={header} className="p-2 bg-orange-50 dark:bg-orange-900 rounded text-sm text-orange-700 dark:text-orange-300">
                {header}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
