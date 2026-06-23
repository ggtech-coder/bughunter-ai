import { useState } from 'react'
import { Note } from '@/types'
import { X, Save } from 'lucide-react'

interface NoteEditorProps {
  note?: Note
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export default function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    tags: note?.tags?.join(', ') || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      userId: note?.userId || '',
      title: formData.title,
      content: formData.content,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      relatedTargets: note?.relatedTargets || [],
      isPinned: note?.isPinned || false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{note ? 'Editar Nota' : 'Nova Nota'}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
        >
          <X size={20} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600"
          placeholder="Título da nota"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Conteúdo</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          className="w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600 h-48 font-mono text-sm"
          placeholder="Conteúdo da nota (suporta Markdown)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tags (separadas por vírgula)</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600"
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        >
          <Save size={18} />
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
