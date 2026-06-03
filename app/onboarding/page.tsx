"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import type { OnboardingData } from "@/lib/schemas"

const onboardingQuestions = [
  { id: "age" as const, question: "Qual sua faixa etaria?", options: [{ value: "16-18", label: "16-18 anos", emoji: "🎓" }, { value: "19-21", label: "19-21 anos", emoji: "🎯" }, { value: "22-24", label: "22-24 anos", emoji: "💼" }, { value: "25+", label: "25+ anos", emoji: "🚀" }] },
  { id: "goal" as const, question: "Por onde você quer começar sua jornada financeira?", options: [{ value: "poupar", label: "Organizar meu dinheiro", emoji: "💰" }, { value: "investir", label: "Entender como investir", emoji: "📈" }, { value: "sair_dividas", label: "Aprender a sair das dividas", emoji: "🎯" }, { value: "independencia", label: "Planejar meu futuro financeiro", emoji: "🏆" }] },
  { id: "experience" as const, question: "Qual seu nivel de experiencia com financas?", options: [{ value: "none", label: "Sou iniciante total", emoji: "🌱" }, { value: "beginner", label: "Sei o basico", emoji: "📚" }, { value: "intermediate", label: "Tenho alguma experiencia", emoji: "⚡" }, { value: "advanced", label: "Ja mando bem", emoji: "🔥" }] },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { isLoggedIn, isOnboarded, completeOnboarding } = useAppStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingData>>({})

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login")
    else if (isOnboarded) router.replace("/home")
  }, [isLoggedIn, isOnboarded, router])

  const mutation = useMutation({
    mutationFn: (data: OnboardingData) => api.post("/user/onboarding", data),
    onSuccess: (_, data) => {
      completeOnboarding(data)
      router.push("/home")
    },
    onError: (_, data) => {
      completeOnboarding(data)
      router.push("/home")
    },
  })

  const currentQuestion = onboardingQuestions[currentStep]
  const progress = ((currentStep + 1) / onboardingQuestions.length) * 100

  const handleOptionSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)
    if (currentStep < onboardingQuestions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300)
    } else {
      mutation.mutate(newAnswers as OnboardingData)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
          <span>{currentStep + 1} de {onboardingQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="mb-8 text-center text-2xl font-bold text-white max-w-md">{currentQuestion.question}</h1>
        <div className="w-full max-w-sm space-y-3">
          {currentQuestion.options.map((option) => (
            <button key={option.value} onClick={() => handleOptionSelect(option.value)} disabled={mutation.isPending} className="flex w-full items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:border-emerald-500 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 transition-colors group-hover:bg-emerald-500/20">
                <span className="text-2xl">{option.emoji}</span>
              </div>
              <span className="text-lg font-medium text-white">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      {mutation.isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            <p className="text-lg font-medium text-white">Preparando sua jornada...</p>
          </div>
        </div>
      )}
    </div>
  )
}
