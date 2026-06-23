import { Vulnerability } from '@/types'
import { Trash2, Eye } from 'lucide-react'

interface VulnListProps {
  vulnerabilities: Vulnerability[]
  onSelect: (vuln: Vulnerability) => void
  onDelete: (vulnId: string) => void
}

export default function VulnList({ vulnerabilities, onSelect, onDelete }: VulnListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'false_positive':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    }
  }

  return (
    <div className="space-y-2">
      {vulnerabilities.map((vuln) => (
        <div
          key={vuln.id}
          className="flex items-center justify-between p-4 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          <div className="flex-1 cursor-pointer" onClick={() => onSelect(vuln)}>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold">{vuln.title}</h4>
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                vuln.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900' :
                vuln.severity === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900' :
                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900'
              }`}>
                {vuln.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{vuln.description}</p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(vuln.status)}`}>
              {vuln.status === 'in_progress' ? 'Em andamento' :
               vuln.status === 'false_positive' ? 'Falso positivo' :
               vuln.status === 'resolved' ? 'Resolvido' : 'Aberto'}
            </span>

            <button
              onClick={() => onSelect(vuln)}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition"
              title="Ver detalhes"
            >
              <Eye size={18} className="text-blue-600" />
            </button>

            <button
              onClick={() => onDelete(vuln.id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition"
              title="Deletar"
            >
              <Trash2 size={18} className="text-red-600" />
            </button>
          </div>
        </div>
      ))}

      {vulnerabilities.length === 0 && (
        <p className="text-center text-slate-600 py-8">Nenhuma vulnerabilidade registrada</p>
      )}
    </div>
  )
}
