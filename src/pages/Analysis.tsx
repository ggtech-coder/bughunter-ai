import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAnalysisStore } from '@/store/analysisStore'

export default function Analysis() {
  const { targetId } = useParams<{ targetId: string }>()
  const { currentTarget, getTargetById, loading } = useAnalysisStore()

  useEffect(() => {
    if (targetId) {
      getTargetById(targetId)
    }
  }, [targetId, getTargetById])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!currentTarget) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Análise não encontrada</p>
      </div>
    )
  }

  const analysis = currentTarget.analysisResults

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{currentTarget.url}</h1>
        <p className="text-slate-600">
          Analisado em {new Date(currentTarget.updatedAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Domínios</h2>
          <div className="space-y-2">
            {analysis.domains && analysis.domains.length > 0 ? (
              analysis.domains.map((domain, idx) => (
                <p key={idx} className="text-slate-700 dark:text-slate-300">{domain}</p>
              ))
            ) : (
              <p className="text-slate-500">Nenhum domínio detectado</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Tecnologias</h2>
          <div className="space-y-2">
            {analysis.technologies && analysis.technologies.length > 0 ? (
              analysis.technologies.map((tech, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-700 rounded">
                  <span>{tech.name}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{tech.category}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">Nenhuma tecnologia detectada</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">SSL/TLS</h2>
          {analysis.ssl ? (
            <div className="space-y-2 text-sm">
              <p><strong>Válido:</strong> {analysis.ssl.isValid ? 'Sim' : 'Não'}</p>
              <p><strong>Válido até:</strong> {analysis.ssl.validTo}</p>
              <p><strong>Dias até expiração:</strong> {analysis.ssl.daysUntilExpiry}</p>
              <p><strong>Emitente:</strong> {analysis.ssl.issuer}</p>
            </div>
          ) : (
            <p className="text-slate-500">Informações SSL não disponíveis</p>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Endpoints Públicos</h2>
          <div className="space-y-2">
            {analysis.endpoints && analysis.endpoints.filter(e => e.isPublic).length > 0 ? (
              analysis.endpoints.filter(e => e.isPublic).map((endpoint, idx) => (
                <div key={idx} className="text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded">
                  <p className="font-mono">{endpoint.path}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Status: {endpoint.statusCode}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">Nenhum endpoint público</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Riscos Identificados</h2>
        <div className="space-y-3">
          {analysis.risks && analysis.risks.length > 0 ? (
            analysis.risks.map((risk, idx) => (
              <div key={idx} className={`p-4 border rounded-lg ${
                risk.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900' :
                risk.severity === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900' :
                'border-yellow-500 bg-yellow-50 dark:bg-yellow-900'
              }`}>
                <h3 className="font-bold">{risk.title}</h3>
                <p className="text-sm mt-1">{risk.description}</p>
                <p className="text-sm mt-2"><strong>Remediação:</strong> {risk.remediation}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-500">Nenhum risco identificado</p>
          )}
        </div>
      </div>

      {analysis.aiSummary && (
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Resumo IA</h2>
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{analysis.aiSummary}</p>
        </div>
      )}
    </div>
  )
}
