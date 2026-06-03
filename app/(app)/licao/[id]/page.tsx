"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, BookOpen, Clock, Target, Sparkles, Zap, Trophy, CheckCircle2, XCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import { lessonsApi } from "@/lib/api/lessons"
import { CompletionModal } from "@/components/app/CompletionModal"
import { DashboardSkeleton } from "@/components/app/DashboardSkeleton"

type ViewMode = "explanation" | "quiz"

interface QuizContent {
  pergunta: string
  alternativas: string[]
  resposta_correta: string
  bloqueado?: boolean
}

function parseQuizContent(content: string | undefined | null): QuizContent | null {
  if (!content) return null
  try {
    const parsed = JSON.parse(content)
    if (parsed.pergunta && parsed.alternativas) return parsed
  } catch {}
  return null
}

function getCorrectIndex(alternativas: string[], resposta_correta: string): number {
  // resposta_correta é "A", "B", "C" ou "D"
  // alternativas são ["A) texto", "B) texto", ...]
  const letter = resposta_correta.trim().toUpperCase()
  const idx = alternativas.findIndex(a => a.trim().toUpperCase().startsWith(letter + ")"))
  if (idx !== -1) return idx
  // fallback: posição da letra no alfabeto
  return ["A", "B", "C", "D"].indexOf(letter)
}

export default function LicaoPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const store = useAppStore() as any
  const currentLesson = store.currentLesson
  const { completeLesson, isLessonCompleted } = useAppStore()

  const [mode, setMode] = useState<ViewMode>("explanation")
  const [showCompletion, setShowCompletion] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Busca a lição pelo ID da trail caso currentLesson não esteja disponível
  const { data: trails, isLoading } = useQuery({
    queryKey: ["trails"],
    queryFn: () => api.get("/trails"),
    staleTime: 5 * 60 * 1000,
    enabled: !currentLesson,
  })

  const completeMutation = useMutation({
    mutationFn: (lessonId: string) => lessonsApi.completeLesson({ lessonId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["trails"] })
      setShowCompletion(true)
    },
    onError: () => setShowCompletion(true),
  })

  // Tenta usar currentLesson do store, ou busca nas trails
  let lesson = currentLesson
  if (!lesson && trails) {
    for (const trail of trails) {
      const found = trail.lessons?.find((l: any) => l.id === id)
      if (found) { lesson = found; break }
    }
  }

  if (isLoading && !lesson) return <DashboardSkeleton />

  if (!lesson) {
    router.replace("/trilhas")
    return null
  }

  const quizData = parseQuizContent(lesson.content)
  const isQuizLesson = !!quizData
  const alreadyCompleted = isLessonCompleted(lesson.id) || lesson.isCompleted || lesson.completed

  const quizQuestion = quizData
    ? {
        id: lesson.id,
        question: quizData.pergunta,
        options: quizData.alternativas,
        correctIndex: getCorrectIndex(quizData.alternativas, quizData.resposta_correta),
      }
    : null

  const isCorrect = selectedAnswer !== null && quizQuestion && selectedAnswer === quizQuestion.correctIndex

  const handleSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
  }

  const handleQuizComplete = () => {
    completeLesson(lesson.id, lesson.xpReward || 50)
    completeMutation.mutate(lesson.id)
  }

  const handleCompletionClose = () => {
    setShowCompletion(false)
    router.back()
  }

  // ── EXPLANATION VIEW ──
  if (mode === "explanation") {
    const conceptText = isQuizLesson
      ? lesson.description  // se o content é quiz, usa description para o conceito
      : lesson.content || lesson.description

    return (
      <div className="flex min-h-screen flex-col bg-slate-950">
        {/* Header */}
        <div className="relative h-64 w-full overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 to-teal-500/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/20">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">{lesson.title}</h1>
            {isQuizLesson && (
              <span className="mt-2 rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-black text-emerald-400 uppercase tracking-widest">Quiz</span>
            )}
            <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-900/50 px-3 py-1 border border-slate-800 backdrop-blur-sm">
              <Clock className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{lesson.duration || "5 min"}</span>
            </div>
          </div>
          <button onClick={() => router.back()} className="absolute left-6 top-8 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 transition-all hover:scale-110">
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        <div className="relative -mt-8 flex-1 rounded-t-[2.5rem] border-t border-slate-800 bg-slate-950 overflow-y-auto">
          <div className="mx-auto max-w-md p-8 pt-10 pb-32">

            {/* Step 1: Conceito */}
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs">01</div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">O Conceito</h2>
              </div>
              <p className="text-lg leading-relaxed text-slate-200 font-medium">{conceptText}</p>
            </div>

            {/* Step 2: Quiz preview ou atividade */}
            {isQuizLesson ? (
              <div className="mb-12">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs">02</div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">O Desafio</h2>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                  <p className="text-sm font-bold text-slate-300 mb-3">Pergunta:</p>
                  <p className="text-md leading-relaxed text-slate-200 font-semibold italic">"{quizData!.pergunta}"</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <Target className="h-4 w-4 text-emerald-500" />
                    <span>{quizData!.alternativas.length} alternativas disponíveis</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-12">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs">02</div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">As Atividades</h2>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                  <p className="text-md leading-relaxed text-slate-300 font-semibold italic">
                    {lesson.activityContent || "Aplique os conceitos através de exercícios práticos."}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <Target className="h-4 w-4 text-emerald-500" />
                    <span>Foco: Precisão de análise e Lógica Financeira</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Tips (se tiver) */}
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

            {/* Recompensa e CTA */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Recompensa Final</p>
                  <p className="text-xs text-slate-400">Conclua para ganhar {lesson.xpReward || 50} XP</p>
                </div>
                {alreadyCompleted && (
                  <div className="ml-auto flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-xs font-bold">Concluída</span>
                  </div>
                )}
              </div>
              <Button
                onClick={() => setMode("quiz")}
                className="h-16 w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 text-lg font-black text-white shadow-lg shadow-emerald-500/20 transition-all hover:translate-y-[-2px]"
              >
                {isQuizLesson ? "RESPONDER DESAFIO" : "IR PARA PRÁTICA"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── QUIZ VIEW ──
  if (!quizQuestion) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Conteúdo em Breve</h2>
          <p className="text-slate-400 mb-6">Esta lição ainda não tem quiz disponível.</p>
          <Button onClick={() => { handleQuizComplete(); }} className="rounded-2xl bg-emerald-500 px-8 py-3 font-bold text-white">
            Marcar como Concluída
          </Button>
        </div>
        <CompletionModal isOpen={showCompletion} onClose={handleCompletionClose} xpEarned={lesson.xpReward || 50} />
      </div>
    )
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-slate-950 px-4 py-6">
        {/* Progress Header */}
        <div className="mb-6 shrink-0">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => setMode("explanation")} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 transition-transform hover:scale-110">
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <div className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 border border-slate-800">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">1 de 1 questão</span>
            </div>
            <div className="w-10" />
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-900 border border-slate-800">
            <div className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: showResult ? "100%" : "0%" }} />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="mb-10 text-center">
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">Múltipla Escolha</span>
              <h2 className="text-xl font-black text-white leading-tight">{quizQuestion.question}</h2>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              {quizQuestion.options.map((option: string, index: number) => {
                const isSelected = selectedAnswer === index
                const isCorrectOption = index === quizQuestion.correctIndex
                const isWrong = isSelected && !isCorrectOption
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    disabled={showResult}
                    className={`relative w-full overflow-hidden rounded-[1.5rem] border-2 p-5 text-left transition-all duration-300 ${
                      showResult
                        ? isCorrectOption ? "border-emerald-500 bg-emerald-500/10"
                          : isWrong ? "border-rose-500 bg-rose-500/10"
                          : "border-slate-800 opacity-40 grayscale"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700 active:scale-[0.97]"
                    }`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black text-lg ${
                        showResult
                          ? isCorrectOption ? "bg-emerald-500 text-white"
                            : isWrong ? "bg-rose-500 text-white"
                            : "bg-slate-800 text-slate-600"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className={`text-base font-semibold leading-snug ${showResult && !isCorrectOption && !isSelected ? "text-slate-600" : "text-slate-200"}`}>
                        {/* Remove o prefixo "A) " das alternativas pois já mostramos o badge */}
                        {option.replace(/^[A-D]\)\s*/, "")}
                      </span>
                      {showResult && isCorrectOption && <CheckCircle2 className="ml-auto h-7 w-7 shrink-0 text-emerald-500" />}
                      {showResult && isWrong && <XCircle className="ml-auto h-7 w-7 shrink-0 text-rose-500" />}
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
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                    {isCorrect ? "Incrível! Resposta certa!" : "Quase lá!"}
                  </p>
                  <p className="text-sm font-bold text-white">
                    {isCorrect ? "Você domina o assunto!" : "Errar faz parte do aprendizado."}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleQuizComplete}
                disabled={completeMutation.isPending}
                className="h-16 w-full rounded-[1.5rem] bg-linear-to-r from-emerald-500 to-teal-500 text-lg font-black text-white shadow-xl transition-all hover:scale-[1.02]"
              >
                {completeMutation.isPending
                  ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  : <><span>CONCLUIR LIÇÃO</span><ChevronRight className="ml-2 h-6 w-6" /></>
                }
              </Button>
            </div>
          )}
          {!showResult && (
            <div className="flex items-center justify-center gap-3 py-4 text-slate-500">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest">Vale {lesson.xpReward || 50} XP</span>
            </div>
          )}
        </div>
      </div>
      <CompletionModal isOpen={showCompletion} onClose={handleCompletionClose} xpEarned={lesson.xpReward || 50} />
    </>
  )
}
