import { Risk } from '@/types'
import { AlertTriangle, AlertCircle, AlertOctagon, Info } from 'lucide-react'

interface RisksCardProps {
  risks: Risk[]
}

export default function RisksCard({ risks }: RisksCardProps) {
  const criticalRisks = risks.filter((r) => r.severity === 'critical')
  const highRisks = risks.filter((r) => r.severity === 'high')
  const mediumRisks = risks.filter((r) => r.severity === 'medium')
  const lowRisks = risks.filter((r) => r.severity === 'low')

  const RiskIcon = ({ severity }: { severity: string }) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="text-red-600" size={18} />
      case 'high':
        return <AlertTriangle className="text-orange-600" size={18} />
      case 'medium':
        return <AlertCircle className="text-yellow-600" size={18} />
      default:
        return <Info className="text-blue-600" size={18} />
    }
  }

  const RiskItem = ({ risk }: { risk: Risk }) => (
    <div className={`p-3 rounded-lg border ${
      risk.severity === 'critical' ? 'border-red-300 bg-red-50 dark:bg-red-900' :
      risk.severity === 'high' ? 'border-orange-300 bg-orange-50 dark:bg-orange-900' :
      risk.severity === 'medium' ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900' :
      'border-blue-300 bg-blue-50 dark:bg-blue-900'
    }`}>
      <div className="flex gap-2 items-start">
        <RiskIcon severity={risk.severity} />
        <div className="flex-1">
          <h5 className="font-bold text-sm">{risk.title}</h5>
          <p className="text-xs mt-1 opacity-80">{risk.description}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-bold">Riscos Identificados</h3>

      {criticalRisks.length > 0 && (
        <div>
          <p className="text-sm font-bold text-red-600 mb-2">CRÍTICOS ({criticalRisks.length})</p>
          <div className="space-y-2">
            {criticalRisks.map((risk) => (
              <RiskItem key={risk.id} risk={risk} />
            ))}
          </div>
        </div>
      )}

      {highRisks.length > 0 && (
        <div>
          <p className="text-sm font-bold text-orange-600 mb-2">ALTOS ({highRisks.length})</p>
          <div className="space-y-2">
            {highRisks.map((risk) => (
              <RiskItem key={risk.id} risk={risk} />
            ))}
          </div>
        </div>
      )}

      {risks.length === 0 && (
        <p className="text-slate-600 dark:text-slate-400">Nenhum risco identificado ✓</p>
      )}
    </div>
  )
}
