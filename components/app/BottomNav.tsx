"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Map, Calculator, User } from "lucide-react"

const tabs = [
  { id: "home", path: "/home", icon: Home, label: "Inicio" },
  { id: "trilhas", path: "/trilhas", icon: Map, label: "Trilhas" },
  { id: "ferramentas", path: "/ferramentas", icon: Calculator, label: "Ferramentas" },
  { id: "perfil", path: "/perfil", icon: User, label: "Perfil" },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.path || pathname.startsWith(tab.path + "/")
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200 ${isActive ? "scale-105" : "opacity-60 hover:opacity-100"}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${isActive ? "bg-emerald-500/20" : ""}`}>
                <Icon className={`h-6 w-6 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
              </div>
              <span className={`text-xs font-medium ${isActive ? "text-emerald-400" : "text-slate-400"}`}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
