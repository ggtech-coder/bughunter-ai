import { useState } from 'react'
import { useAnalysis } from '@/hooks/useAnalysis'
import { isValidURL } from '@/lib/utils'

interface URLInputProps {
  onSuccess?: () => void
}

export default function URLInput({ onSuccess }: URLInputProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { startAnalysis } = useAnalysis()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Por favor, insira uma URL')
      return
    }

    if (!isValidURL(url)) {
      setError('URL inválida. Certifique-se de incluir http:// ou https://')
      return
    }

    try {
      setIsLoading(true)
      await startAnalysis(url)
      setUrl('')
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Erro ao analisar URL')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">URL para analisar</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://exemplo.com"
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Analisando...' : 'Analisar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm dark:bg-red-900 dark:border-red-700 dark:text-red-100">
          {error}
        </div>
      )}
    </form>
  )
}
