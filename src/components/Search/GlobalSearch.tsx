import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useFirestore } from '@/hooks/useFirestore'

interface SearchResult {
  id: string
  type: 'target' | 'vulnerability' | 'note' | 'report'
  title: string
  description: string
  path: string
}

export default function GlobalSearch() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const targetsFs = useFirestore('targets')
  const findingsFs = useFirestore('findings')
  const notesFs = useFirestore('notes')

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2 && user) {
        performSearch()
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const performSearch = async () => {
    if (!user) return

    try {
      setIsSearching(true)
      const lowerQuery = query.toLowerCase()
      const allResults: SearchResult[] = []

      const targets = await targetsFs.getByField('userId', user.uid)
      targets.forEach((t: any) => {
        if (t.url?.toLowerCase().includes(lowerQuery) || t.domain?.toLowerCase().includes(lowerQuery)) {
          allResults.push({
            id: t.id,
            type: 'target',
            title: t.url,
            description: `Domínio: ${t.domain} • Status: ${t.status}`,
            path: `/analysis/${t.id}`,
          })
        }
      })

      const findings = await findingsFs.getByField('userId', user.uid)
      findings.forEach((f: any) => {
        if (f.title?.toLowerCase().includes(lowerQuery) || f.description?.toLowerCase().includes(lowerQuery)) {
          allResults.push({
            id: f.id,
            type: 'vulnerability',
            title: f.title,
            description: `Severidade: ${f.severity}`,
            path: '/vulnerabilities',
          })
        }
      })

      const notes = await notesFs.getByField('userId', user.uid)
      notes.forEach((n: any) => {
        if (
          n.title?.toLowerCase().includes(lowerQuery) ||
          n.content?.toLowerCase().includes(lowerQuery) ||
          n.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
        ) {
          allResults.push({
            id: n.id,
            type: 'note',
            title: n.title,
            description: n.content?.substring(0, 80) || '',
            path: '/knowledge',
          })
        }
      })

      setResults(allResults.slice(0, 10))
      setIsOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSearching(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'target':
        return '🌐'
      case 'vulnerability':
        return '⚠️'
      case 'note':
        return '📝'
      case 'report':
        return '📊'
      default:
        return '📄'
    }
  }

  const handleSelect = (result: SearchResult) => {
    navigate(result.path)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar análises, vulnerabilidades, notas..."
          className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg z-50">
          <div className="max-h-80 overflow-y-auto">
            {results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 border-b border-slate-200 dark:border-slate-700 last:border-b-0 transition flex items-start gap-3"
              >
                <span className="text-xl">{getTypeIcon(result.type)}</span>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium truncate">{result.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{result.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.length > 2 && results.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg z-50 p-4 text-center text-slate-600 dark:text-slate-400">
          Nenhum resultado encontrado
        </div>
      )}
    </div>
  )
}
