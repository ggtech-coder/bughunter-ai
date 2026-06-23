import { useState } from 'react'
import { FileText, Download } from 'lucide-react'

interface ReportExportProps {
  targetIds: string[]
  onExport: (format: 'pdf' | 'html', title: string, reportType: string) => void
  isLoading: boolean
}

export default function ReportExport({ targetIds, onExport, isLoading }: ReportExportProps) {
  const [title, setTitle] = useState('Relatório de Segurança')
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'executive'>('detailed')

  const handleExport = (format: 'pdf' | 'html') => {
    onExport(format, title, reportType)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <FileText size={24} />
        Gerar Novo Relatório
      </h3>

      <div>
        <label className="block text-sm font-medium mb-1">Título do Relatório</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600"
          placeholder="Título do relatório"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tipo de Relatório</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as any)}
          className="w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600"
        >
          <option value="summary">Resumido</option>
          <option value="detailed">Detalhado</option>
          <option value="executive">Executivo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Alvos Incluídos</label>
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded text-sm">
          {targetIds.length} alvo(s) selecionado(s)
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => handleExport('html')}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          <Download size={18} />
          {isLoading ? 'Gerando...' : 'HTML'}
        </button>
        <button
          onClick={() => handleExport('pdf')}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 font-medium"
        >
          <Download size={18} />
          {isLoading ? 'Gerando...' : 'PDF'}
        </button>
      </div>
    </div>
  )
}
