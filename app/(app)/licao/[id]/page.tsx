"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, BookOpen, Clock, Target, Sparkles, Zap, Trophy, CheckCircle2, XCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { lessonsApi } from "@/lib/api/lessons"
import { CompletionModal } from "@/components/app/CompletionModal"
import { mockQuizQuestions } from "@/lib/mock-data"

type ViewMode = "explanation" | "quiz"

export default function LicaoPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { currentLesson, completeLesson } = useAppStore() as any
  const [mode, setMode] = useState<ViewMode>("explanation")
  const [showCompletion, setShowCompletion] = useState(false)

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const lesson = currentLesson

  const completeMutation = useMutation({
    mutationFn: (lessonId: string) => lessonsApi.completeLesson({ lessonId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["trails"] })
      setShowCompletion(true)
    },
    onError: () => setShowCompletion(true),
  })

  if (!lesson) {
    router.replace("/trilhas")
    return null
  }

  const handleQuizComplete = () => {
    completeLesson(lesson.id, lesson.xpReward)
    completeMutation.mutate(lesson.id)
  }

  const handleCompletionClose = () => {
    setShowCompletion(false)
    router.push("/trilhas")
  }

  // Parse quiz questions from lesson content if available
  let quizQuestions = mockQuizQuestions
  try {
    if (lesson.content) {
      const parsed = JSON.parse(lesson.content)
      if (parsed.pergunta && parsed.alternativas) {
        quizQuestions = [{
          id: lesson.id,
          question: parsed.pergunta,
          options: parsed.alternativas,
          correctIndex: ["A", "B", "C", "D"].indexOf(parsed.resposta_correta),
        }]
      }
    }
  } catch {}

  const currentQuestion = quizQuestions[currentIndex]
  const isLastQuestion = currentIndex === quizQuestions.length - 1
  const isCorrect = selectedAnswer === currentQuestion?.correctIndex
  const progress = ((currentIndex + 1) / quizQuestions.length) * 100

  const handleSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    if (index === currentQuestion.correctIndex) setCorrectCount(correctCount + 1)
  }

  const handleNext = () => {
    if (isLastQuestion && showResult) {
      handleQuizComplete()
    } else {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  // ── EXPLANATION VIEW ──
  if (mode === "explanation") {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950">
        <div className="relative h-64 w-full overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 to-teal-500/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/20">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">{lesson.title}</h1>
            <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-900/50 px-3 py-1 border border-slate-800 backdrop-blur-sm">
              <Clock className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{lesson.duration || "5 min"} de preparacao</span>
            </div>
          </div>
          <button onClick={() => router.back()} className="absolute left-6 top-8 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 transition-all hover:scale-110">
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        <div className="relative -mt-8 flex-1 rounded-t-[2.5rem] border-t border-slate-800 bg-slate-950 overflow-y-auto">
          <div className="mx-auto max-w-md p-8 pt-10 pb-32">
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs">01</div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">O Conceito</h2>
              </div>
              <p className="text-lg leading-relaxed text-slate-200 font-medium">{lesson.content || lesson.description}</p>
            </div>

            <div className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs">02</div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">As Atividades</h2>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                <p className="text-md leading-relaxed text-slate-300 font-semibold italic">
                  {lesson.activityContent || "Aplique os conceitos através de exercícios práticos de tomada de decisão."}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Target className="h-4 w-4 text-emerald-500" />
                  <span>Foco: Precisão de análise e Lógica Financeira</span>
                </div>
              </div>
            </div>

            {lesson.tips && lesson.tips.length > 0 && (
              <div className="mb-12">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs">03</div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">Módulo de Especialista</h2>
                </div>
                <div className="space-y-3">
                  {lesson.tips.map((tip: string, idx: number) => (
                    <div key={idx} className="flex gap-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                      <Sparkles className="h-6 w-6 shrink-0 text-emerald-400" />
                      <p className="text-sm leading-relaxed text-slate-200 font-bold italic">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Recompensa Final</p>
                  <p className="text-xs text-slate-400">Conclua as atividades para ganhar {lesson.xpReward} XP</p>
                </div>
              </div>
              <Button onClick={() => setMode("quiz")} className="h-16 w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 text-lg font-black text-white shadow-lg shadow-emerald-500/20 transition-all hover:translate-y-[-2px]">
                IR PARA PRÁTICA
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── QUIZ VIEW ──
  return (
    <>
      <div className="flex min-h-screen flex-col bg-slate-950 px-4 py-6">
        <div className="mb-6 shrink-0">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => setMode("explanation")} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 transition-transform hover:scale-110">
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <div className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 border border-slate-800">
              <span className="text-[10px] font-black text-emerald-400 uppercase">Questão {currentIndex + 1}/{quizQuestions.length}</span>
            </div>
            <div className="w-10" />
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-900 border border-slate-800">
            <div className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="mb-10 text-center">
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">Múltipla Escolha</span>
              <h2 className="text-2xl font-black text-white leading-tight">{currentQuestion.question}</h2>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              {currentQuestion.options.map((option: string, index: number) => {
                const isSelected = selectedAnswer === index
                const isCorrectOption = index === currentQuestion.correctIndex
                const isWrong = isSelected && !isCorrectOption
                return (
                  <button key={index} onClick={() => handleSelect(index)} disabled={showResult} className={`relative w-full overflow-hidden rounded-[1.5rem] border-2 p-5 text-left transition-all duration-300 ${showResult ? isCorrectOption ? "border-emerald-500 bg-emerald-500/10" : isWrong ? "border-rose-500 bg-rose-500/10" : "border-slate-800 opacity-40 grayscale" : "border-slate-800 bg-slate-900/60 hover:border-slate-700 active:scale-[0.97]"}`}>
                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black text-lg ${showResult ? isCorrectOption ? "bg-emerald-500 text-white" : isWrong ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-600" : "bg-slate-800 text-slate-300"}`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className={`text-lg font-bold ${showResult && !isCorrectOption && !isSelected ? "text-slate-600" : "text-slate-200"}`}>{option}</span>
                      {showResult && isCorrectOption && <CheckCircle2 className="ml-auto h-7 w-7 text-emerald-500" />}
                      {showResult && isWrong && <XCircle className="ml-auto h-7 w-7 text-rose-500" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 shrink-0 pb-6">
          {showResult && (
            <div className="animate-in slide-in-from-bottom-8 fade-in duration-500 max-w-md mx-auto">
              <div className={`mb-6 rounded-3xl p-6 flex items-center gap-4 ${isCorrect ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-rose-500/10 border border-rose-500/20"}`}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isCorrect ? "bg-emerald-500" : "bg-rose-500"}`}>
                  {isCorrect ? <Trophy className="h-6 w-6 text-white" /> : <XCircle className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>{isCorrect ? "Incrível!" : "Quase lá!"}</p>
                  <p className="text-sm font-bold text-white">{isCorrect ? "Você domina o assunto!" : "Errar faz parte do aprendizado."}</p>
                </div>
              </div>
              <Button onClick={handleNext} disabled={completeMutation.isPending} className="h-16 w-full rounded-[1.5rem] bg-linear-to-r from-emerald-500 to-teal-500 text-lg font-black text-white shadow-xl transition-all hover:scale-[1.02]">
                {completeMutation.isPending ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" /> : isLastQuestion ? "CONCLUIR JORNADA" : "PRÓXIMO DESAFIO"}
                {!completeMutation.isPending && <ChevronRight className="ml-2 h-6 w-6" />}
              </Button>
            </div>
          )}
          {!showResult && (
            <div className="flex items-center justify-center gap-3 py-4 text-slate-500">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest">Vale {lesson.xpReward} XP</span>
            </div>
          )}
        </div>
      </div>
      <CompletionModal isOpen={showCompletion} onClose={handleCompletionClose} xpEarned={lesson.xpReward} />
    </>
  )
}
