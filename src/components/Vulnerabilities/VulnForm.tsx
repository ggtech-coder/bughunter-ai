import { useState } from 'react'
import { Vulnerability } from '@/types'

interface VulnFormProps {
  targetId: string
  userId: string
  onSubmit: (vuln: Omit<Vulnerability, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export default function VulnForm({ targetId, userId, onSubmit, onCancel }: VulnFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    status: 'open' as 'open' | 'in_progress' | 'resolved' | 'false_positive',
    notes: '',
    cveId: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      userId,
      targetId,
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
      status: formData.status,
      cveId: formData.cveId || undefined,
      evidenceIds: [],
      notes: formData.notes,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-4">
      <h3 className="text-xl font-bold mb-4">Registrar Vulnerabilidade</h3>

      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600"
          placeholder="Título da vulnerabilidade"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600 h-24"
          placeholder="Descrição detalhada"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Severidade</label>
          <select
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
            className="w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600"
          >
            <option value="open">Aberto</option>
            <option value="in_progress">Em andamento</option>
            <option value="resolved">Resolvido</option>
            <option value="false_positive">Falso positivo</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">CVE (opcional)</label>
        <input
          type="text"
          value={formData.cveId}
          onChange={(e) => setFormData({ ...formData, cveId: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600"
          placeholder="CVE-YYYY-XXXXX"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notas</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600 h-20"
          placeholder="Notas adicionais"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        >
          Registrar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
