"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Wallet, Mail, Eye, EyeOff, XCircle, User, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const { isLoggedIn } = useAppStore()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn) router.replace("/home")
  }, [isLoggedIn, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (mode === "login") {
        const response = await api.post("/auth/login", { email, password })
        if (response && response.token) {
          localStorage.setItem("token", response.token)
          useAppStore.setState({ isLoggedIn: true, authEmail: email, user: response.user })
          router.push("/home")
        }
      } else {
        if (name.length < 2) { setError("Nome deve ter pelo menos 2 caracteres"); setIsLoading(false); return }
        if (!email.includes("@")) { setError("Email invalido"); setIsLoading(false); return }
        if (password.length < 8) { setError("Senha deve ter pelo menos 8 caracteres"); setIsLoading(false); return }
        const response = await api.post("/auth/register", { email, password, name })
        if (response && response.token) {
          localStorage.setItem("token", response.token)
          useAppStore.setState({ isLoggedIn: true, authEmail: email, user: response.user })
          router.push("/home")
        }
      }
    } catch (err: any) {
      setError(err?.message || "Ocorreu um erro ao conectar ao servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Side Panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-linear-to-br from-emerald-600 to-teal-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-300 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl">
              <Wallet className="h-7 w-7 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Kapitalia</span>
          </div>
          <div className="max-w-md">
            <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
              Sua liberdade financeira começa <span className="text-emerald-300">aqui.</span>
            </h2>
            <p className="text-xl text-emerald-50/80 leading-relaxed">
              Aprenda a investir, economizar e gerenciar seu patrimônio com a maior plataforma gamificada de finanças.
            </p>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-8">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white mb-1">+50k</span>
            <span className="text-emerald-100/60">Alunos ativos</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white mb-1">98%</span>
            <span className="text-emerald-100/60">Satisfação</span>
          </div>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex flex-col items-center mb-12">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500 shadow-xl shadow-emerald-500/20">
              <Wallet className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Kapitalia</h1>
            <p className="text-slate-400">Domine suas finanças</p>
          </div>

          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">
                {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
              </h2>
              <p className="text-slate-400">
                {mode === "login" ? "Entre com suas credenciais para continuar" : "Comece sua jornada rumo à liberdade financeira"}
              </p>
            </div>

            <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800">
              <button onClick={() => setMode("login")} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${mode === "login" ? "bg-slate-800 text-white shadow-lg shadow-black/50" : "text-slate-500 hover:text-slate-300"}`}>
                Entrar
              </button>
              <button onClick={() => setMode("register")} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${mode === "register" ? "bg-slate-800 text-white shadow-lg shadow-black/50" : "text-slate-500 hover:text-slate-300"}`}>
                Cadastrar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "register" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Nome Completo</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: João Silva" className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-900 pl-12 pr-4 text-white placeholder-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-900 pl-12 pr-4 text-white placeholder-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-900 pl-12 pr-12 text-white placeholder-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 animate-in fade-in slide-in-from-top-2">
                  <XCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <Button type="submit" disabled={isLoading} className="h-14 w-full rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-lg font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                {isLoading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : mode === "login" ? "Entrar na Plataforma" : "Criar minha Conta"}
              </Button>
            </form>

            <div className="pt-8 border-t border-slate-900">
              <p className="text-center text-xs text-slate-600">
                Ao continuar, você concorda com nossos <br />
                <span className="text-slate-400 hover:underline cursor-pointer">Termos de Uso</span> e <span className="text-slate-400 hover:underline cursor-pointer">Política de Privacidade</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
