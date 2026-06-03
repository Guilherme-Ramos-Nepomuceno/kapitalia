"use client"

import { Crown, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProModal({ isOpen, onClose }: ProModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-amber-500/30 bg-slate-900 sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-yellow-600">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl text-white">Destravar PRO</DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Acesse conteudos exclusivos e acelere sua jornada financeira
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            {["Acesso a todas as aulas avancadas", "Simuladores educacionais", "Suporte prioritario", "Certificados de conclusao"].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm text-white">{feature}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
            <p className="text-sm text-amber-400">Por apenas</p>
            <p className="text-3xl font-bold text-white">R$ 19,90<span className="text-lg font-normal text-slate-400">/mes</span></p>
          </div>
          <Button className="h-14 w-full rounded-2xl bg-linear-to-r from-amber-400 to-yellow-600 text-lg font-bold text-slate-900 transition-all hover:scale-[1.02]">
            <Sparkles className="mr-2 h-5 w-5" />
            Quero ser PRO
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
