"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, Star, BookOpen, CheckCircle2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import { ProModal } from "@/components/app/ProModal"
import { DashboardSkeleton } from "@/components/app/DashboardSkeleton"
import { mockTrails } from "@/lib/mock-data"
import type { Lesson } from "@/lib/schemas"

export default function TrailDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { isLessonCompleted } = useAppStore()
  const [showProModal, setShowProModal] = useState(false)

  const { data: apiTrails, isLoading } = useQuery({
    queryKey: ["trails"],
    queryFn: () => api.get("/trails"),
    staleTime: 5 * 60 * 1000,
  })

  const rawTrails = (apiTrails && apiTrails.length > 0) ? apiTrails : mockTrails
  const rawTrail = rawTrails.find((t: any) => t.id === id)

  if (isLoading) return <DashboardSkeleton />
  if (!rawTrail) {
    router.push("/trilhas")
    return null
  }

  const trail = {
    ...rawTrail,
    lessons: (rawTrail.lessons || []).map((lesson: any) => ({
      ...lesson,
      isCompleted: isLessonCompleted(lesson.id) || lesson.isCompleted || lesson.completed,
    })),
    completedLessons: (rawTrail.lessons || []).filter((l: any) => isLessonCompleted(l.id) || l.isCompleted || l.completed).length,
    totalLessons: (rawTrail.lessons || []).length || rawTrail.totalLessons || 0,
  }

  const activeLesson = trail.lessons.find((l: any) => !l.isCompleted && !l.isLocked) || trail.lessons[trail.lessons.length - 1]

  const handleStartLesson = (lesson: Lesson) => {
    useAppStore.setState({ currentLesson: lesson } as any)
    router.push(`/licao/${lesson.id}`)
  }

  const positions = [0, -60, -80, -30, 40, 80, 50]

  return (
    <div className="min-h-screen bg-slate-950 pb-32 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-emerald-500 rotate-12 rounded-2xl" />
        <div className="absolute top-60 right-20 w-24 h-24 border-4 border-teal-500 -rotate-12 rounded-3xl" />
      </div>

      <div className="relative z-20 px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 transition-all hover:scale-110 active:scale-95 shadow-xl">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-2 backdrop-blur-xl shadow-xl">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-black text-white tracking-widest">{trail.completedLessons}/{trail.totalLessons}</span>
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-white leading-tight tracking-tight">{trail.title}</h1>
          <p className="mt-2 text-slate-400 font-bold text-lg">{trail.description}</p>
        </div>

        {activeLesson && (
          <div className="relative mb-16 group">
            <div className={`absolute -inset-1 bg-linear-to-r ${trail.color} rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-700`} />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-6">
              <div className="flex items-center gap-5 relative z-10">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br ${trail.color} shadow-2xl`}>
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase mb-1 block">SUA MISSÃO ATUAL</span>
                  <h3 className="text-xl font-black text-white truncate mb-4">{activeLesson.title}</h3>
                  <Button onClick={() => handleStartLesson(activeLesson)} className="w-full h-12 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 text-sm font-black text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    COMEÇAR AGORA
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zig-Zag Path */}
      <div className="relative max-w-md mx-auto px-12 pb-20">
        <div className="relative space-y-24 py-10 flex flex-col items-center">
          {trail.lessons.map((lesson: any, index: number) => {
            const xPos = positions[index % positions.length]
            const isCompleted = lesson.isCompleted
            const isLocked = lesson.isLocked
            const isActive = !isCompleted && !isLocked

            return (
              <div key={lesson.id} className="relative flex flex-col items-center transition-all duration-700" style={{ transform: `translateX(${xPos}px)` }}>
                {isCompleted && (
                  <div className="absolute -top-12 flex items-end gap-1.5 animate-bounce">
                    <Star className="h-6 w-6 text-amber-400 fill-amber-400 -rotate-12 mb-1" />
                    <Star className="h-8 w-8 text-amber-400 fill-amber-400" />
                    <Star className="h-6 w-6 text-amber-400 fill-amber-400 rotate-12 mb-1" />
                  </div>
                )}
                {isActive && (
                  <div className="absolute -inset-6 z-0">
                    <div className="h-full w-full animate-ping rounded-[3rem] bg-emerald-500/20 duration-1000" />
                  </div>
                )}
                <button
                  disabled={isLocked && !lesson.isPro}
                  onClick={() => {
                    if (lesson.isPro) setShowProModal(true)
                    else if (!isLocked) handleStartLesson(lesson)
                  }}
                  className={`relative group flex h-24 w-24 items-center justify-center transition-all duration-300 ${isLocked ? "grayscale opacity-60" : "hover:scale-110 active:scale-95 active:translate-y-1"}`}
                >
                  <div className={`absolute inset-0 translate-y-3 rounded-[2.5rem] ${isCompleted ? "bg-emerald-700" : isLocked ? "bg-slate-800" : "bg-emerald-600"}`} />
                  <div className={`absolute inset-0 flex items-center justify-center rounded-[2.5rem] border-b-[6px] transition-all duration-300 transform group-active:translate-y-2 ${isCompleted ? "bg-emerald-500 border-emerald-600" : isLocked ? "bg-slate-700 border-slate-800" : "bg-emerald-400 border-emerald-500"} shadow-2xl z-10`}>
                    {isCompleted ? <CheckCircle2 className="h-12 w-12 text-white stroke-[3px]" /> : isLocked ? <Lock className="h-10 w-10 text-white/30" /> : <BookOpen className="h-12 w-12 text-white stroke-[3px]" />}
                  </div>
                  {!isLocked && (
                    <div className={`absolute top-full mt-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl bg-slate-900 border border-white/5 shadow-2xl whitespace-nowrap z-30 transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"}`}>
                      <span className="block text-[10px] font-black text-emerald-400 uppercase mb-1">{isCompleted ? "Praticar" : "Iniciar"}</span>
                      <span className="text-sm font-black text-white">{lesson.title}</span>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-t border-l border-white/5 rotate-45" />
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  )
}
