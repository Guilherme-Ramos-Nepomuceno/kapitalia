"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Sparkles, Crown, Map, Lock, CheckCircle2, ChevronRight } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import { ProModal } from "@/components/app/ProModal"
import { DashboardSkeleton } from "@/components/app/DashboardSkeleton"
import { mockTrails } from "@/lib/mock-data"

export default function TrilhasPage() {
  const router = useRouter()
  const { isLessonCompleted } = useAppStore()
  const [showProModal, setShowProModal] = useState(false)

  const { data: apiTrails, isLoading } = useQuery({
    queryKey: ["trails"],
    queryFn: () => api.get("/trails"),
    staleTime: 5 * 60 * 1000,
  })

  const rawTrails = (apiTrails && apiTrails.length > 0) ? apiTrails : mockTrails

  const trails = rawTrails.map((trail: any) => ({
    ...trail,
    lessons: (trail.lessons || []).map((lesson: any) => ({
      ...lesson,
      isCompleted: isLessonCompleted(lesson.id) || lesson.isCompleted || lesson.completed,
    })),
    completedLessons: (trail.lessons || []).filter((l: any) => isLessonCompleted(l.id) || l.isCompleted || l.completed).length,
    totalLessons: (trail.lessons || []).length || trail.totalLessons || 0,
  }))

  const freeTrails = trails.filter((t: any) => !t.isPro)
  const proTrails = trails.filter((t: any) => t.isPro)

  if (isLoading) return <DashboardSkeleton />

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 pb-28">
      <h1 className="mb-6 text-2xl font-bold text-white">Trilhas de Aprendizado</h1>

      {/* Free Trails */}
      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          Trilhas Gratuitas
        </h2>
        <div className="relative">
          <div className="absolute left-7 top-8 bottom-8 w-1 rounded-full bg-linear-to-b from-emerald-500/50 via-emerald-500/30 to-slate-700" />
          <div className="space-y-6">
            {freeTrails.map((trail: any, index: number) => {
              const progress = trail.totalLessons > 0 ? (trail.completedLessons / trail.totalLessons) * 100 : 0
              const isCompleted = progress === 100
              const isStarted = progress > 0
              const totalMinutes = (trail.lessons || []).reduce((acc: number, l: any) => {
                const min = parseInt(String(l.duration || "5").replace(/\D/g, "")) || 5
                return acc + min
              }, 0)
              const levels = ["Iniciante", "Intermediário", "Avançado"]
              const trailLevel = levels[Math.min(index, levels.length - 1)]
              const levelColors: Record<string, string> = { "Iniciante": "text-emerald-400 bg-emerald-500/20", "Intermediário": "text-yellow-400 bg-yellow-500/20", "Avançado": "text-red-400 bg-red-500/20" }
              const levelDots: Record<string, number> = { "Iniciante": 1, "Intermediário": 2, "Avançado": 3 }

              return (
                <div key={trail.id} className="relative">
                  <div className={`absolute left-5 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border-4 ${isCompleted ? "border-emerald-500 bg-emerald-500" : isStarted ? "border-emerald-500 bg-slate-950" : "border-slate-600 bg-slate-950"}`}>
                    {isCompleted && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                  <button onClick={() => router.push(`/trilhas/${trail.id}`)} className="ml-12 w-[calc(100%-3rem)] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 text-left transition-all hover:scale-[1.02] hover:border-emerald-500/50 hover:bg-slate-800">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${trail.color}`}>
                        <Map className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColors[trailLevel]}`}>{trailLevel}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((d) => (
                              <div key={d} className={`h-1.5 w-1.5 rounded-full ${d <= (levelDots[trailLevel] || 1) ? "bg-emerald-400" : "bg-slate-700"}`} />
                            ))}
                          </div>
                        </div>
                        <h3 className="truncate font-bold text-white">{trail.title}</h3>
                        <p className="truncate text-sm text-slate-400">{trail.description}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-xs text-slate-500">{trail.totalLessons} lições</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500">{totalMinutes} min</span>
                          <span className="text-xs font-medium text-emerald-400 ml-auto">{trail.completedLessons}/{trail.totalLessons}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-center">
                        <div className="relative h-11 w-11">
                          <svg className="h-11 w-11 -rotate-90">
                            <circle cx="22" cy="22" r="18" fill="none" stroke="#1e293b" strokeWidth="3" />
                            <circle cx="22" cy="22" r="18" fill="none" stroke="url(#g)" strokeWidth="3" strokeDasharray={`${progress * 1.13} 113`} strokeLinecap="round" />
                            <defs>
                              <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#14b8a6" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{Math.round(progress)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        {isCompleted ? "Revisar" : isStarted ? "Continuar" : "Iniciar"}
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pro Trails */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Crown className="h-5 w-5 text-amber-400" />
          Trilhas PRO
        </h2>
        <div className="relative">
          <div className="absolute left-7 top-8 bottom-8 w-1 rounded-full bg-linear-to-b from-amber-500/50 via-amber-500/30 to-slate-700" />
          <div className="space-y-6">
            {proTrails.map((trail: any) => (
              <div key={trail.id} className="relative">
                <div className="absolute left-5 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border-4 border-amber-500/50 bg-slate-950">
                  <Lock className="h-2.5 w-2.5 text-amber-400" />
                </div>
                <button onClick={() => setShowProModal(true)} className="ml-12 w-[calc(100%-3rem)] overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-r from-amber-500/5 to-yellow-500/5 p-4 text-left transition-all hover:scale-[1.02] hover:border-amber-500/50">
                  <div className="absolute right-4 top-4 rounded-full bg-linear-to-r from-amber-400 to-yellow-600 px-2 py-0.5 text-xs font-bold text-slate-900">PRO</div>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${trail.color}`}>
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-white">{trail.title}</h3>
                      <p className="truncate text-sm text-slate-400">{trail.description}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-slate-500">{trail.totalLessons} licoes</span>
                        <span className="flex items-center gap-1 text-xs text-amber-400">
                          <Lock className="h-3 w-3" /> Desbloqueie
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  )
}
