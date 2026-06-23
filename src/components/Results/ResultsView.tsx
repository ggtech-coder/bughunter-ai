import { AnalysisResult } from '@/types'
import DomainCard from './DomainCard'
import TechStackCard from './TechStackCard'
import EndpointsCard from './EndpointsCard'
import SecurityCard from './SecurityCard'
import RisksCard from './RisksCard'

export default function ResultsView({ analysis }: { analysis: AnalysisResult }) {
  if (!analysis || Object.keys(analysis).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">Análise ainda em processamento ou sem resultados</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DomainCard domains={analysis.domains || []} subdomains={analysis.subdomains || []} />
        <TechStackCard technologies={analysis.technologies || []} />
        <SecurityCard ssl={analysis.ssl} headers={analysis.headers || {}} />
        <EndpointsCard endpoints={analysis.endpoints || []} />
      </div>

      <RisksCard risks={analysis.risks || []} />

      {analysis.aiSummary && (
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Resumo IA</h2>
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{analysis.aiSummary}</p>
        </div>
      )}

      {analysis.aiPriority && (
        <div className="bg-purple-50 dark:bg-purple-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Priorização IA</h2>
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{analysis.aiPriority}</p>
        </div>
      )}
    </div>
  )
}
