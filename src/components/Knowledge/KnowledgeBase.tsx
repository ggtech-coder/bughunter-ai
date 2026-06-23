import { useState } from 'react'
import { Note } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useFirestore } from '@/hooks/useFirestore'
import NoteEditor from './NoteEditor'
import NoteList from './NoteList'
import { Plus } from 'lucide-react'

interface KnowledgeBaseProps {
  notes: Note[]
  onRefresh: () => void
}

export default function KnowledgeBase({ notes, onRefresh }: KnowledgeBaseProps) {
  const { user } = useAuthStore()
  const { add, update, remove } = useFirestore('notes')
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined)
  const [showEditor, setShowEditor] = useState(false)

  const handleSave = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingNote) {
        await update(editingNote.id, noteData)
      } else {
        await add({ ...noteData, userId: user?.uid || '' })
      }
      setShowEditor(false)
      setEditingNote(undefined)
      onRefresh()
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setShowEditor(true)
  }

  const handleDelete = async (noteId: string) => {
    try {
      await remove(noteId)
      onRefresh()
    } catch (error) {
      console.error(error)
    }
  }

  const handlePin = async (note: Note) => {
    try {
      await update(note.id, { ...note, isPinned: !note.isPinned })
      onRefresh()
    } catch (error) {
      console.error(error)
    }
  }

  const handleNewNote = () => {
    setEditingNote(undefined)
    setShowEditor(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleNewNote}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Nova Nota
        </button>
      </div>

      {showEditor && (
        <NoteEditor
          note={editingNote}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false)
            setEditingNote(undefined)
          }}
        />
      )}

      <NoteList
        notes={notes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPin={handlePin}
      />
    </div>
  )
}
