import { Report } from '@/types'
import { Download, X } from 'lucide-react'

interface ReportPreviewProps {
  report: Report
  onClose: () => void
}

export default function ReportPreview({ report, onClose }: ReportPreviewProps) {
  const handleDownload = () => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(report.htmlContent))
    element.setAttribute('download', `relatorio-${report.id}.html`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div>
            <h2 className="text-2xl font-bold">{report.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {new Date(report.generatedAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: report.htmlContent }}
          />
        </div>

        <div className="flex gap-2 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            <Download size={18} />
            Baixar HTML
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
