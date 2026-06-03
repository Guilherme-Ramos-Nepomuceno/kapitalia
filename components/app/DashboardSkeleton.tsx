import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-800" />
            <Skeleton className="h-3 w-16 bg-slate-800" />
          </div>
        </div>
        <Skeleton className="h-10 w-20 rounded-2xl bg-slate-800" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl bg-slate-800" />)}
      </div>
      <Skeleton className="h-32 rounded-3xl bg-slate-800" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl bg-slate-800" />)}
      </div>
    </div>
  )
}
