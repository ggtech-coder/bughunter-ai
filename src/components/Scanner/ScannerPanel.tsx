import { useState } from 'react'
import { useAnalysis } from '@/hooks/useAnalysis'
import URLInput from './URLInput'
import ScanProgress from './ScanProgress'

export default function ScannerPanel() {
  const { targets } = useAnalysis()
  const [recentScans] = useState(() => targets.slice(0, 5))

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Nova Análise</h2>
        <URLInput onSuccess={() => {}} />
      </div>

      {recentScans.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold">Scans Recentes</h3>
          {recentScans.map((scan) => (
            <ScanProgress key={scan.id} target={scan} />
          ))}
        </div>
      )}
    </div>
  )
}
