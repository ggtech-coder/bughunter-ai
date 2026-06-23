import { Note } from '@/types'
import { Trash2, Edit, Pin, Search } from 'lucide-react'
import { useState } from 'react'

interface NoteListProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (noteId: string) => void
  onPin: (note: Note) => void
}

export default function NoteList({ notes, onEdit, onDelete, onPin }: NoteListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned)
  const regularNotes = filteredNotes.filter((n) => !n.isPinned)

  const NoteCard = ({ note, pinned }: { note: Note; pinned: boolean }) => (
    <div
      className={`rounded-lg p-4 hover:shadow-lg transition border ${
        pinned
          ? 'bg-yellow-50 dark:bg-yellow-900 border-2 border-yellow-400'
          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-lg">{note.title}</h3>
        <button onClick={() => onPin(note)} title={pinned ? 'Desafixar' : 'Fixar'}>
          <Pin
            className={pinned ? 'text-yellow-600' : 'text-slate-400'}
            size={16}
            fill={pinned ? 'currentColor' : 'none'}
          />
        </button>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 line-clamp-3">
        {note.content}
      </p>
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2 py-1 rounded ${
                pinned ? 'bg-yellow-200 dark:bg-yellow-800' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(note)}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200"
        >
          <Edit size={14} />
          Editar
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200"
        >
          <Trash2 size={14} />
          Deletar
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar notas..."
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600"
        />
      </div>

      {pinnedNotes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Fixadas</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} pinned={true} />
            ))}
          </div>
        </div>
      )}

      {regularNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Outras notas</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularNotes.map((note) => (
              <NoteCard key={note.id} note={note} pinned={false} />
            ))}
          </div>
        </div>
      )}

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            {searchTerm ? 'Nenhuma nota encontrada' : 'Nenhuma nota criada'}
          </p>
        </div>
      )}
    </div>
  )
}
