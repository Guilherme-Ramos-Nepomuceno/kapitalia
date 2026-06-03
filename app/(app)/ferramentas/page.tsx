"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Crown, Sparkles, Wallet, Building2, TrendingUp, Percent, PiggyBank, Coins, Target, Lock, CheckCircle2, BookOpen, HeartPulse, Zap } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { ProModal } from "@/components/app/ProModal"

const tools = [
  { id: "budget", title: "Controle de Gastos", description: "Organize suas despesas mensais", icon: Wallet, color: "from-emerald-500 to-teal-500", isPro: false, xp: 50, level: 1 },
  { id: "tesouro", title: "Simulador Tesouro", description: "Calcule seus rendimentos", icon: Building2, color: "from-blue-500 to-cyan-500", isPro: false, xp: 30, level: 2 },
  { id: "stocks", title: "Simulacao de Ativos", description: "Simule comportamento de acoes", icon: TrendingUp, color: "from-purple-500 to-indigo-500", isPro: false, xp: 40, level: 3 },
  { id: "compound", title: "Juros Compostos", description: "Poder do tempo", icon: Percent, color: "from-amber-500 to-orange-500", isPro: false, xp: 25, level: 1 },
  { id: "emergency", title: "Reserva de Emergencia", description: "Calcule sua reserva", icon: PiggyBank, color: "from-pink-500 to-rose-500", isPro: false, xp: 60, level: 1 },
  { id: "crypto", title: "Simulador de Volatilidade", description: "Simule volatilidade (cripto)", icon: Coins, color: "from-orange-500 to-red-500", isPro: false, xp: 100, level: 3 },
  { id: "retirement", title: "Aposentadoria", description: "Planeje seu futuro", icon: Target, color: "from-indigo-500 to-purple-500", isPro: false, xp: 120, level: 2 },
]

export default function FerramentasPage() {
  const router = useRouter()
  const { user, expenses, monthlyIncome, emergencyFundGoal, emergencyFundCurrent, investments, completedLessons } = useAppStore()
  const [showProModal, setShowProModal] = useState(false)
  const userLevel = user?.level || 1

  const toolsWithProgress = tools.map(tool => ({
    ...tool,
    progress: tool.id === "budget" ? (expenses.length > 0 ? 100 : 0) :
              tool.id === "stocks" ? (investments.length > 0 ? 100 : 0) :
              tool.id === "emergency" ? (emergencyFundGoal > 0 ? (emergencyFundCurrent / emergencyFundGoal) * 100 : 0) : 0,
  }))

  const calculateHealthScore = () => {
    let score = 0
    if (monthlyIncome > 0) score += 20
    if (expenses.length > 0) score += 20
    if (emergencyFundGoal > 0 && emergencyFundCurrent >= emergencyFundGoal) score += 20
    else if (emergencyFundGoal > 0) score += (emergencyFundCurrent / emergencyFundGoal) * 20
    if (investments.length > 0) score += 20
    if (user) score += Math.min(user.level * 4, 20)
    return Math.round(score)
  }

  const healthScore = calculateHealthScore()

  const missions = [
    { id: 1, title: "Definir Renda Mensal", icon: Wallet, xp: 20, done: monthlyIncome > 0 },
    { id: 2, title: "Usar Simulador Educacional", icon: TrendingUp, xp: 40, done: investments.length > 0 },
    { id: 3, title: "Concluir uma Lição", icon: BookOpen, xp: 50, done: ((completedLessons as any)?.size || (completedLessons as any)?.length || 0) > 0 },
  ]

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 pb-28">
      {/* Level Banner */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600">
            <Crown className="h-5 w-5 text-slate-900" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Nível {userLevel}</p>
            <p className="text-[10px] text-slate-400">Ferramentas desbloqueadas</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((lvl) => (
            <div key={lvl} className={`h-2 w-6 rounded-full transition-all ${userLevel >= lvl ? lvl === 1 ? "bg-emerald-500" : lvl === 2 ? "bg-yellow-500" : "bg-red-500" : "bg-slate-800"}`} />
          ))}
        </div>
      </div>

      {/* Health Score */}
      <div className="mb-8 relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-6 backdrop-blur-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <HeartPulse className="h-32 w-32 text-emerald-400 -mr-8 -mt-8" />
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">Sua Pontuação de Saúde</span>
          <div className="relative h-40 w-40 mb-4">
            <svg className="h-full w-full -rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
              <circle cx="80" cy="80" r="70" fill="none" stroke="url(#hg)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${healthScore * 4.4} 440`} className="transition-all duration-1000" />
              <defs>
                <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{healthScore}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</span>
            </div>
          </div>
          <h2 className="text-lg font-bold text-white mb-1">
            {healthScore >= 80 ? "Mestre Financeiro! 🏆" : healthScore >= 50 ? "No Caminho Certo 👍" : "Iniciando a Jornada 🌱"}
          </h2>
          <p className="text-xs text-slate-400">Complete as ferramentas abaixo para subir seu score!</p>
        </div>
      </div>

      {/* Daily Missions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Missões do Dia
          </h3>
        </div>
        <div className="space-y-3">
          {missions.map((mission) => (
            <div key={mission.id} className={`flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${mission.done ? "bg-emerald-500/10 border-emerald-500/30" : "bg-slate-900/60 border-slate-800"}`}>
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${mission.done ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500"}`}>
                  {mission.done ? <CheckCircle2 className="h-6 w-6" /> : <mission.icon className="h-5 w-5" />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${mission.done ? "text-emerald-400" : "text-white"}`}>{mission.title}</p>
                  <p className="text-[10px] font-bold text-slate-500">Recompensa: {mission.xp} XP</p>
                </div>
              </div>
              {mission.done && <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Concluída</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Tool Grid */}
      <h3 className="mb-4 px-2 text-sm font-black uppercase tracking-widest text-white">Seu Laboratório</h3>
      <div className="grid grid-cols-2 gap-4">
        {toolsWithProgress.map((tool) => {
          const Icon = tool.icon
          const isUnlocked = userLevel >= tool.level
          const isComplete = tool.progress === 100
          return (
            <button
              key={tool.id}
              onClick={() => {
                if (!isUnlocked) {
                  toast.error(`Você precisa estar no nível ${tool.level}!`, { description: "Complete mais lições para subir de nível!" })
                } else if (tool.isPro) {
                  setShowProModal(true)
                } else {
                  router.push(`/ferramentas/${tool.id}`)
                }
              }}
              className={`group relative overflow-hidden rounded-[2rem] border p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${!isUnlocked ? "border-slate-800/50 bg-slate-900/30 opacity-60" : isComplete ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-800 bg-slate-900/60"}`}
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${tool.color} shadow-lg transition-transform group-hover:scale-110 group-hover:-rotate-6`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="truncate font-black text-white text-sm">{tool.title}</h4>
                <p className="mt-1 line-clamp-2 text-[11px] text-slate-500 group-hover:text-slate-400">{tool.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-amber-500" />
                  <span className="text-[10px] font-black text-amber-500">+{tool.xp} XP</span>
                </div>
                {!isUnlocked ? <div className="text-[9px] font-black text-slate-500">NÍVEL {tool.level}</div> : <div className="text-[9px] font-black text-slate-600 uppercase">{isComplete ? "OK" : `${Math.round(tool.progress)}%`}</div>}
              </div>
              {!isUnlocked && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <Lock className="h-5 w-5 text-slate-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase">Nível {tool.level}</span>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  )
}
