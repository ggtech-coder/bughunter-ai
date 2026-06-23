import { Technology } from '@/types'

interface TechStackCardProps {
  technologies: Technology[]
}

export default function TechStackCard({ technologies }: TechStackCardProps) {
  const categorized = technologies.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = []
      }
      acc[tech.category].push(tech)
      return acc
    },
    {} as Record<string, Technology[]>
  )

  const riskColorMap = {
    low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">Stack Tecnológico</h3>

      <div className="space-y-4">
        {Object.entries(categorized).map(([category, techs]) => (
          <div key={category}>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {techs.map((tech, idx) => (
                <span
                  key={idx}
                  className={`text-sm px-3 py-1 rounded-full font-medium ${riskColorMap[tech.riskLevel]}`}
                >
                  {tech.name}
                  {tech.version && ` v${tech.version}`}
                </span>
              ))}
            </div>
          </div>
        ))}

        {technologies.length === 0 && (
          <p className="text-slate-600 dark:text-slate-400">Nenhuma tecnologia detectada</p>
        )}
      </div>
    </div>
  )
}
