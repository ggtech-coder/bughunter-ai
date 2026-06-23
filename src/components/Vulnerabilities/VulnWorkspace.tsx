import { useState } from 'react'
import { Vulnerability } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useFirestore } from '@/hooks/useFirestore'
import VulnList from './VulnList'
import VulnDetail from './VulnDetail'
import VulnForm from './VulnForm'
import { Plus } from 'lucide-react'

interface VulnWorkspaceProps {
  vulnerabilities: Vulnerability[]
  onRefresh: () => void
}

export default function VulnWorkspace({ vulnerabilities, onRefresh }: VulnWorkspaceProps) {
  const { user } = useAuthStore()
  const { add, update, remove } = useFirestore('findings')
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async (vuln: Omit<Vulnerability, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await add(vuln)
      setShowForm(false)
      onRefresh()
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdate = async (vuln: Vulnerability) => {
    try {
      await update(vuln.id, vuln)
      setSelectedVuln(vuln)
      onRefresh()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (vulnId: string) => {
    try {
      await remove(vulnId)
      onRefresh()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Vulnerabilidades Registradas</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Nova Vulnerabilidade
        </button>
      </div>

      {showForm && user && (
        <VulnForm
          targetId=""
          userId={user.uid}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <VulnList
        vulnerabilities={vulnerabilities}
        onSelect={setSelectedVuln}
        onDelete={handleDelete}
      />

      {selectedVuln && (
        <VulnDetail
          vulnerability={selectedVuln}
          onClose={() => setSelectedVuln(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}
