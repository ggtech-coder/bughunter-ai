import { Vulnerability } from '@/types'
import { X } from 'lucide-react'

interface VulnDetailProps {
  vulnerability: Vulnerability
  onClose: () => void
  onUpdate: (vuln: Vulnerability) => void
}

export default function VulnDetail({ vulnerability, onClose, onUpdate }: VulnDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
          <h2 className="text-2xl font-bold">{vulnerability.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{vulnerability.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Severidade</label>
              <select
                value={vulnerability.severity}
                onChange={(e) => onUpdate({ ...vulnerability, severity: e.target.value as any })}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={vulnerability.status}
                onChange={(e) => onUpdate({ ...vulnerability, status: e.target.value as any })}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600"
              >
                <option value="open">Aberto</option>
                <option value="in_progress">Em andamento</option>
                <option value="resolved">Resolvido</option>
                <option value="false_positive">Falso positivo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notas</label>
            <textarea
              value={vulnerability.notes}
              onChange={(e) => onUpdate({ ...vulnerability, notes: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600 h-24"
            />
          </div>

          {vulnerability.cveId && (
            <div>
              <label className="text-sm font-medium">CVE</label>
              <p className="mt-1 font-mono text-blue-600">{vulnerability.cveId}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
