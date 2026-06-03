"use client"

import { useEffect, useState } from "react"
import { Trophy, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CompletionModalProps {
  isOpen: boolean
  onClose: () => void
  xpEarned: number
}

export function CompletionModal({ isOpen, onClose, xpEarned }: CompletionModalProps) {
  const [showXpAnimation, setShowXpAnimation] = useState(false)
  const [xpCount, setXpCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setXpCount(0)
      setShowXpAnimation(false)
      const timer = setTimeout(() => setShowXpAnimation(true), 100)
      const interval = setInterval(() => {
        setXpCount((prev) => {
          if (prev < xpEarned) return prev + 10
          clearInterval(interval)
          return xpEarned
        })
      }, 50)
      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    }
  }, [isOpen, xpEarned])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-emerald-500/30 bg-slate-900 sm:max-w-md overflow-hidden">
        <DialogHeader>
          <div className="mx-auto mb-4 relative">
            <div className={`absolute inset-0 rounded-3xl bg-emerald-500 blur-xl transition-all duration-700 ${showXpAnimation ? "opacity-60 scale-100" : "opacity-0 scale-50"}`} />
            <div className={`relative flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-500 to-teal-500 transition-all duration-500 ${showXpAnimation ? "scale-100" : "scale-50"}`}>
              <Trophy className="h-10 w-10 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl text-white">Parabéns!</DialogTitle>
          <DialogDescription className="text-center text-slate-400">Você completou a lição com sucesso!</DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <div className={`inline-flex items-center gap-2 rounded-2xl bg-emerald-500/20 px-6 py-3 transition-all duration-300 ${showXpAnimation ? "scale-100" : "scale-90"}`}>
            <Zap className={`h-6 w-6 text-emerald-400 transition-all duration-300 ${showXpAnimation ? "animate-bounce" : ""}`} />
            <span className="text-3xl font-black text-emerald-400 tabular-nums">+{xpCount}</span>
            <span className="text-sm font-bold text-emerald-400">XP</span>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            <p>Próxima lição desbloqueada! 🚀</p>
          </div>
        </div>
        <Button onClick={onClose} className="h-14 w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 text-lg font-bold text-white transition-all hover:scale-[1.02]">
          Continuar
        </Button>
      </DialogContent>
    </Dialog>
  )
}
