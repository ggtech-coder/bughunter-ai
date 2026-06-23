import { Copy, ExternalLink } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

interface DomainCardProps {
  domains: string[]
  subdomains: string[]
}

export default function DomainCard({ domains, subdomains }: DomainCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">Domínios Descobertos</h3>

      <div className="space-y-4">
        {domains.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Domínios Primários ({domains.length})
            </p>
            <div className="space-y-2">
              {domains.map((domain, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded"
                >
                  <code className="text-sm">{domain}</code>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(domain)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition"
                      title="Copiar"
                    >
                      <Copy size={16} />
                    </button>
                    <a
                      href={`https://${domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition"
                      title="Abrir"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {subdomains.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Subdomínios ({subdomains.length})
            </p>
            <div className="space-y-2">
              {subdomains.map((subdomain, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900 rounded"
                >
                  <code className="text-sm text-blue-700 dark:text-blue-300">{subdomain}</code>
                  <button
                    onClick={() => copyToClipboard(subdomain)}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition"
                    title="Copiar"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {domains.length === 0 && subdomains.length === 0 && (
          <p className="text-slate-600 dark:text-slate-400">Nenhum domínio descoberto</p>
        )}
      </div>
    </div>
  )
}
