"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, Trophy, Flame, CheckCircle2, Coins, Crown, Target, Calendar, ChevronRight, LogOut } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { ProModal } from "@/components/app/ProModal"

export default function PerfilPage() {
  const router = useRouter()
  const { user, totalXpEarned, completedLessons, onboardingData, logout } = useAppStore()
  const [showProModal, setShowProModal] = useState(false)

  if (!user) {
    router.replace("/login")
    return null
  }

  const stats = [
    { icon: Zap, label: "XP Total", value: totalXpEarned, color: "from-emerald-500 to-teal-500" },
    { icon: Trophy, label: "Nivel", value: user.level, color: "from-amber-400 to-yellow-600" },
    { icon: Flame, label: "Streak", value: `${user.streak} dias`, color: "from-orange-500 to-red-500" },
    { icon: CheckCircle2, label: "Licoes", value: (completedLessons as any).size || 0, color: "from-blue-500 to-cyan-500" },
    { icon: Coins, label: "Moedas", value: user.totalCoins, color: "from-pink-500 to-rose-500" },
  ]

  const handleLogout = () => {
    logout()
    if (typeof window !== "undefined") localStorage.removeItem("token")
    router.replace("/login")
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 pb-28">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-500 text-3xl font-bold text-white ring-4 ring-emerald-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {user.isPro && (
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-yellow-600 ring-2 ring-slate-950">
              <Crown className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
        {user.email && <p className="mt-1 text-slate-400">{user.email}</p>}
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-400">Nivel {user.level}</span>
          {user.isPro && <span className="rounded-full bg-linear-to-r from-amber-400 to-yellow-600 px-3 py-1 text-sm font-bold text-slate-900">PRO</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-3 text-center">
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${stat.color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* XP Progress */}
      <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">Progresso Nivel {user.level + 1}</span>
          <span className="text-sm font-bold text-emerald-400">{user.xp}/{user.xpToNextLevel} XP</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all" style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }} />
        </div>
      </div>

      {/* Onboarding Info */}
      {onboardingData && (
        <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <Target className="h-5 w-5 text-emerald-400" />
            Seu Perfil
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Faixa etaria</span>
              <span className="text-sm font-medium text-white">{onboardingData.age} anos</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Objetivo</span>
              <span className="text-sm font-medium text-white capitalize">{onboardingData.goal.replace("_", " ")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Experiencia</span>
              <span className="text-sm font-medium text-white capitalize">{onboardingData.experience}</span>
            </div>
          </div>
        </div>
      )}

      {/* Join Date */}
      {user.joinedAt && (
        <div className="mb-6 flex items-center justify-center gap-2 text-sm text-slate-400">
          <Calendar className="h-4 w-4" />
          <span>Membro desde {new Date(user.joinedAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</span>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {!user.isPro && (
          <button onClick={() => setShowProModal(true)} className="flex w-full items-center justify-between rounded-2xl border border-amber-500/30 bg-linear-to-r from-amber-500/10 to-yellow-500/10 p-4 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-yellow-600">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Seja PRO</p>
                <p className="text-xs text-slate-400">Desbloqueie todo o conteudo</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-amber-400" />
          </button>
        )}
        <button onClick={handleLogout} className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-all hover:border-red-500/30 hover:bg-red-500/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
              <LogOut className="h-5 w-5 text-red-400" />
            </div>
            <span className="font-semibold text-white">Sair da Conta</span>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  )
}
