import { useState } from 'react'
import { Report } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useAnalysisStore } from '@/store/analysisStore'
import { useFirestore } from '@/hooks/useFirestore'
import { generateReportHTML } from '@/lib/report-generator'
import ReportExport from './ReportExport'
import ReportPreview from './ReportPreview'
import { Eye, Download, Trash2 } from 'lucide-react'

interface ReportGeneratorProps {
  reports: Report[]
  onRefresh: () => void
}

export default function ReportGenerator({ reports, onRefresh }: ReportGeneratorProps) {
  const { user } = useAuthStore()
  const { targets } = useAnalysisStore()
  const { add, remove } = useFirestore('reports')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showExportForm, setShowExportForm] = useState(false)

  const handleGenerate = async (format: 'pdf' | 'html', title: string, reportType: string) => {
    if (!user) return

    try {
      setIsGenerating(true)
      const targetIds = targets.map((t) => t.id)
      const htmlContent = generateReportHTML(targets, title, reportType)

      const newReport: Omit<Report, 'id'> = {
        userId: user.uid,
        targetIds,
        title,
        description: `Relatório ${reportType} gerado a partir de ${targets.length} análise(s)`,
        reportType: reportType as any,
        generatedAt: new Date(),
        htmlContent,
        status: 'finalized',
      }

      await add(newReport)
      setShowExportForm(false)
      onRefresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (reportId: string) => {
    try {
      await remove(reportId)
      onRefresh()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDownload = (report: Report) => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(report.htmlContent))
    element.setAttribute('download', `relatorio-${report.id}.html`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Relatórios Gerados</h2>
        <button
          onClick={() => setShowExportForm(!showExportForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showExportForm ? 'Cancelar' : '+ Novo Relatório'}
        </button>
      </div>

      {showExportForm && (
        <ReportExport
          targetIds={targets.map((t) => t.id)}
          onExport={handleGenerate}
          isLoading={isGenerating}
        />
      )}

      {reports.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400 text-center py-8">Nenhum relatório gerado</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:shadow-lg transition bg-white dark:bg-slate-800">
              <h3 className="font-bold text-lg mb-2">{report.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{report.description}</p>
              <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">{report.reportType}</span>
                <span>{new Date(report.generatedAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100"
                >
                  <Eye size={14} />
                  Ver
                </button>
                <button
                  onClick={() => handleDownload(report)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-100"
                >
                  <Download size={14} />
                  Baixar
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="px-2 py-1 text-sm bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReport && (
        <ReportPreview report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  )
}
