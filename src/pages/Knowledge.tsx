import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useFirestore } from '@/hooks/useFirestore'
import { Note } from '@/types'

export default function Knowledge() {
  const { user } = useAuthStore()
  const { getByField } = useFirestore('notes')
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadNotes()
    }
  }, [user])

  const loadNotes = async () => {
    try {
      const data = await getByField('userId', user?.uid)
      setNotes(data as Note[])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Base de Conhecimento</h1>
        <p className="text-slate-600">Organize notas e referências de segurança</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6">
          + Nova Nota
        </button>

        {notes.length === 0 ? (
          <p className="text-slate-600">Nenhuma nota criada</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`border rounded-lg p-4 hover:shadow-lg transition cursor-pointer ${
                  note.isPinned
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{note.title}</h3>
                  {note.isPinned && <span className="text-yellow-600">📌</span>}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-3">
                  {note.content}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-500">
                  {new Date(note.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
