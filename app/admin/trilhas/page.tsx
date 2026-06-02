"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { api, ApiError } from "@/lib/api"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Lesson {
  id: string
  title: string
  description: string
  content: string
  order: number
}

export default function AdminTrilhas() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    color: "from-blue-500 to-cyan-600",
    icon: "BookOpen",
    isPro: false,
  })
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    id: "",
    title: "",
    description: "",
    content: "",
  })
  const [loading, setLoading] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)

  useEffect(() => {
    // Verificar se token existe no localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    setIsAuthenticated(!!token)

    if (!token) {
      toast.error("Você precisa estar autenticado")
      router.push("/")
    }
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
          <p className="mb-6">Você precisa estar autenticado para acessar esta página.</p>
          <Link href="/" className="inline-block px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            Voltar para Home
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleAddLesson = () => {
    if (!newLesson.id || !newLesson.title || !newLesson.description || !newLesson.content) {
      toast.error("Preencha todos os campos da lição")
      return
    }

    const lessonWithOrder: Lesson = {
      id: newLesson.id || "",
      title: newLesson.title || "",
      description: newLesson.description || "",
      content: newLesson.content || "",
      order: lessons.length + 1,
    }

    setLessons([...lessons, lessonWithOrder])
    setNewLesson({ id: "", title: "", description: "", content: "" })
    setShowLessonForm(false)
    toast.success("Lição adicionada!")
  }

  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index))
    toast.success("Lição removida")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.id || !formData.title || !formData.description) {
      toast.error("Preencha os campos obrigatórios da trilha")
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        lessons: lessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1,
        })),
      }

      await api.post("/trails", payload)

      toast.success("Trilha criada com sucesso!")
      // Reset form
      setFormData({
        id: "",
        title: "",
        description: "",
        color: "from-blue-500 to-cyan-600",
        icon: "BookOpen",
        isPro: false,
      })
      setLessons([])
    } catch (error) {
      console.error("Erro ao criar trilha:", error)
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao criar trilha")
      }
    } finally {
      setLoading(false)
    }
  }

  const colors = [
    "from-emerald-400 to-teal-600",
    "from-orange-400 to-red-600",
    "from-blue-400 to-blue-600",
    "from-purple-500 to-indigo-600",
    "from-pink-500 to-rose-600",
    "from-cyan-400 to-blue-600",
    "from-green-400 to-emerald-600",
    "from-yellow-400 to-orange-600",
  ]

  const icons = [
    "BookOpen",
    "Brain",
    "CreditCard",
    "PiggyBank",
    "TrendingUp",
    "DollarSign",
    "Wallet",
    "BarChart3",
    "Sparkles",
    "Target",
    "Briefcase",
    "Building2",
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h1 className="text-4xl font-bold mb-2">Gerenciar Trilhas</h1>
          <p className="text-slate-400 mb-8">Crie e gerencie trilhas de aprendizado</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Informações Básicas</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ID da Trilha *</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="ex: trilha_01"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Título *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="ex: Fundamentos Financeiros"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descreva a trilha..."
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cor</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {icons.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPro"
                  name="isPro"
                  checked={formData.isPro}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label htmlFor="isPro" className="text-sm font-medium">
                  Trilha Premium (Pro)
                </label>
              </div>
            </div>

            {/* Lições */}
            <div className="space-y-4 border-t border-slate-700 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Lições ({lessons.length})</h2>
                <button
                  type="button"
                  onClick={() => setShowLessonForm(!showLessonForm)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Lição
                </button>
              </div>

              {showLessonForm && (
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">ID da Lição</label>
                      <input
                        type="text"
                        value={newLesson.id || ""}
                        onChange={(e) => setNewLesson({ ...newLesson, id: e.target.value })}
                        placeholder="ex: lecao_01"
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Título</label>
                      <input
                        type="text"
                        value={newLesson.title || ""}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                        placeholder="ex: Introdução"
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <input
                      type="text"
                      value={newLesson.description || ""}
                      onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                      placeholder="Breve descrição da lição"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Conteúdo</label>
                    <textarea
                      value={newLesson.content || ""}
                      onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                      placeholder="Conteúdo da lição ou Quiz em JSON"
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddLesson}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition font-medium"
                  >
                    Confirmar Lição
                  </button>
                </div>
              )}

              {lessons.length > 0 && (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-sm text-slate-400">{lesson.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(index)}
                        className="ml-4 p-2 text-red-400 hover:text-red-300 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6 border-t border-slate-700">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-semibold transition"
              >
                {loading ? "Criando..." : "Criar Trilha"}
              </button>
              <Link
                href="/"
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
