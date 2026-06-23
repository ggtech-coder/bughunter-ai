interface StatsCardProps {
  label: string
  value: number
  color: 'blue' | 'red' | 'orange' | 'green'
}

export default function StatsCard({ label, value, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <p className={`text-sm font-medium ${colorClasses[color]} inline-block px-2 py-1 rounded`}>
        {label}
      </p>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  )
}
