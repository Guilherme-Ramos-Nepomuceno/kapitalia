"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Flame, Zap, Trophy, Coins, BookOpen, Map, Crown, ChevronRight } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import { StatCard } from "@/components/app/StatCard"
import { DashboardSkeleton } from "@/components/app/DashboardSkeleton"
import { ProModal } from "@/components/app/ProModal"
import type { Lesson } from "@/lib/schemas"

export default function HomePage() {
  const router = useRouter()
  const { user: storeUser, isLessonCompleted, updateStreak } = useAppStore()
  const [showProModal, setShowProModal] = useState(false)
  const [disclaimerDismissed, setDisclaimerDismissed] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [dashboardResp, trailsResp] = await Promise.all([
        api.get("/dashboard"),
        api.get("/trails"),
      ])
      return { ...dashboardResp, trails: trailsResp || [] }
    },
    staleTime: 5 * 60 * 1000,
    onSuccess: (data: any) => {
      if (data?.user) useAppStore.setState({ user: data.user })
      updateStreak()
    },
  } as any)

  const handleStartLesson = (lesson: Lesson) => {
    useAppStore.setState({ currentLesson: lesson } as any)
    router.push(`/licao/${lesson.id}`)
  }

  if (isLoading || !data) return <DashboardSkeleton />

  const user = data.user || storeUser
  if (!user) return <DashboardSkeleton />

  const trails = (data.trails || []).map((trail: any) => ({
    ...trail,
    lessons: (trail.lessons || []).map((lesson: any) => ({
      ...lesson,
      isCompleted: isLessonCompleted(lesson.id) || lesson.isCompleted || lesson.completed,
    })),
    completedLessons: (trail.lessons || []).filter((l: any) => isLessonCompleted(l.id) || l.isCompleted || l.completed).length,
  }))

  const currentLesson = data.currentLesson
  const xpProgress = (user.xp / user.xpToNextLevel) * 100

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 pb-28">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-500 text-lg font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Ola, {user.name}!</h1>
            <p className="text-sm text-slate-400">Nivel {user.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-3 py-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="font-bold text-orange-500">{user.streak}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard icon={Zap} value={user.xp} label="XP Total" gradient="from-emerald-500 to-teal-500" />
        <StatCard icon={Trophy} value={user.level} label="Nivel" gradient="from-amber-400 to-yellow-600" />
        <StatCard icon={Coins} value={user.totalCoins} label="Moedas" gradient="from-purple-500 to-indigo-500" />
      </div>

      {/* XP Progress */}
      <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">Progresso para Nivel {user.level + 1}</span>
          <span className="text-sm font-bold text-emerald-400">{user.xp}/{user.xpToNextLevel} XP</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: `${xpProgress}%` }} />
        </div>
      </div>

      {/* Streak Banner */}
      {user.streak >= 7 && (
        <div className="mb-6 flex items-center gap-4 rounded-3xl border border-orange-500/30 bg-linear-to-r from-orange-500/10 to-red-500/10 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-red-500">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="font-bold text-white">Sua ofensiva ta pegando fogo!</p>
            <p className="text-sm text-slate-400">{user.streak} dias seguidos estudando</p>
          </div>
        </div>
      )}

      {/* Continue Learning */}
      {currentLesson && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-white">Continuar aprendendo</h2>
          <button onClick={() => handleStartLesson(currentLesson)} className="flex w-full items-center gap-4 rounded-3xl border border-emerald-500/30 bg-linear-to-r from-emerald-500/20 to-teal-500/20 p-5 transition-all duration-200 hover:scale-[1.02]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-white">{currentLesson.title}</h3>
              <p className="text-sm text-slate-400">{currentLesson.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-emerald-400" />
          </button>
        </div>
      )}

      {/* Trails */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-white">Suas trilhas</h2>
        <div className="space-y-3">
          {trails.slice(0, 3).map((trail: any) => (
            <div key={trail.id} className={`rounded-2xl border p-4 transition-all ${trail.isPro ? "border-amber-500/30 bg-amber-500/5" : "border-slate-800 bg-slate-900"}`}>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${trail.color}`}>
                  {trail.isPro ? <Crown className="h-6 w-6 text-white" /> : <Map className="h-6 w-6 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{trail.title}</h3>
                    {trail.isPro && <span className="rounded-full bg-linear-to-r from-amber-400 to-yellow-600 px-2 py-0.5 text-xs font-bold text-slate-900">AVANÇADO</span>}
                  </div>
                  <p className="text-sm text-slate-400">{trail.completedLessons}/{trail.totalLessons} licoes</p>
                </div>
                <span className="text-sm font-bold text-emerald-400">
                  {trail.totalLessons > 0 ? Math.round((trail.completedLessons / trail.totalLessons) * 100) : 0}%
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full bg-linear-to-r ${trail.color} transition-all`} style={{ width: `${trail.totalLessons > 0 ? (trail.completedLessons / trail.totalLessons) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      {!disclaimerDismissed && (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
          <div className="bg-slate-900/95 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-amber-400 text-sm">⚠️</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  O Kapitalia é uma plataforma educacional. As simulações não constituem recomendação de investimento.
                </p>
              </div>
              <button onClick={() => setDisclaimerDismissed(true)} className="text-slate-500 hover:text-slate-300 transition-colors">
                <span className="text-lg">×</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  )
}
