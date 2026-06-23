import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useFirestore } from '@/hooks/useFirestore'
import { UserSettings } from '@/types'

export default function Settings() {
  const { user, logout } = useAuthStore()
  const { getByField, update } = useFirestore('settings')
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      const data = await getByField('userId', user?.uid)
      if (data.length > 0) {
        setSettings(data[0] as UserSettings)
      } else {
        setSettings({
          userId: user?.uid || '',
          emailNotifications: true,
          theme: 'light',
          defaultReportFormat: 'pdf',
          maxConcurrentScans: 3,
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return
    try {
      setSaving(true)
      await update(settings.userId, settings)
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!settings) {
    return <div className="text-center py-12">Erro ao carregar configurações</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-slate-600">Gerencie suas preferências</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Preferências</h2>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="rounded"
              />
              <span className="ml-2">Notificações por email</span>
            </label>

            <div>
              <label className="block text-sm font-medium mb-2">Tema</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Scans Simultâneos Máximos</label>
              <input
                type="number"
                value={settings.maxConcurrentScans}
                onChange={(e) => setSettings({ ...settings, maxConcurrentScans: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
