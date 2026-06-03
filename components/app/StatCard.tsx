interface StatCardProps {
  icon: React.ElementType
  value: string | number
  label: string
  gradient: string
}

export function StatCard({ icon: Icon, value, label, gradient }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-all duration-200 hover:scale-105 hover:border-slate-700">
      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${gradient}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}
