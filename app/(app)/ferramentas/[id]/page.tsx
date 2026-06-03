"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, Calculator, BookOpen, Percent, Clock, ArrowUpRight, Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { dashboardApi } from "@/lib/api/dashboard"
import { financialApi } from "@/lib/api/financial"

const toolTitles: Record<string, string> = {
  budget: "Controle de Gastos",
  tesouro: "Simulador Tesouro",
  stocks: "Simulação de Ativos",
  compound: "Juros Compostos",
  emergency: "Reserva de Emergência",
  crypto: "Simulador de Volatilidade",
  retirement: "Planejamento de Aposentadoria",
}

const toolInfo: Record<string, { what: string; why: string }> = {
  budget: { what: "O Controle de Gastos distribui sua renda usando metodologias consagradas.", why: "Não existe um método único. Dependendo da sua fase de vida, você pode precisar ser mais rigoroso ou ter mais liberdade." },
  tesouro: { what: "O Simulador de Tesouro Direto projeta o rendimento de títulos públicos.", why: "O Tesouro é o investimento mais seguro do país. Entender seu crescimento ajuda a planejar metas." },
  stocks: { what: "Esta ferramenta simula o comportamento de ativos de renda variável.", why: "Entenda como funciona a renda variável e os riscos envolvidos sem recomendação de compra." },
  compound: { what: "Os Juros Compostos são calculados sobre o montante acumulado.", why: "Einstein chamou os juros compostos de a 8ª maravilha do mundo." },
  emergency: { what: "Calcula o montante necessário para cobrir seu custo de vida.", why: "A reserva é seu colchão de segurança contra imprevistos." },
}

const budgetStrategies = [
  { id: "50/30/20", label: "Equilibrado", type: "Tranquilo", desc: "50% Essencial, 30% Desejos, 20% Futuro", ratios: [0.5, 0.3, 0.2] },
  { id: "60/30/10", label: "Conservador", type: "Iniciante", desc: "60% Essencial, 30% Desejos, 10% Futuro", ratios: [0.6, 0.3, 0.1] },
  { id: "70/20/10", label: "Sobrevivência", type: "Rigoroso", desc: "70% Essencial, 20% Desejos, 10% Reserva", ratios: [0.7, 0.2, 0.1] },
  { id: "25/25/25/25", label: "O Quadrante", type: "Aplicado", desc: "25% Fixo, 25% Variável, 25% Invest., 25% Edu.", ratios: [0.25, 0.25, 0.25, 0.25] },
]

export default function ToolDetailPage() {
  const router = useRouter()
  const { id: toolId } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { user, updateUserXp, setMonthlyIncome, setEmergencyFund, addInvestment } = useAppStore()
  const [values, setValues] = useState<Record<string, number>>({})
  const [displayValues, setDisplayValues] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{ value: number; details: string[] } | null>(null)
  const [budgetMethod, setBudgetMethod] = useState("50/30/20")
  const [xpEarned, setXpEarned] = useState(false)

  const updateProfileMutation = useMutation({
    mutationFn: (updates: any) => dashboardApi.updateProfile(updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  })

  const createFinancialMutation = useMutation({
    mutationFn: (data: any) => financialApi.createRecord(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  })

  const handleNumericInput = (fieldId: string, raw: string) => {
    const formatted = raw.replace(/[^0-9.,]/g, "")
    if ((formatted.match(/[.,]/g) || []).length > 1) return
    setDisplayValues({ ...displayValues, [fieldId]: formatted })
    setValues({ ...values, [fieldId]: parseFloat(formatted.replace(",", ".")) || 0 })
  }

  const getFields = () => {
    switch (toolId) {
      case "budget": return [{ id: "income", label: "Renda mensal", placeholder: "5000", type: "currency" }]
      case "tesouro": case "compound": return [
        { id: "initial", label: "Valor inicial", placeholder: "1000", type: "currency" },
        { id: "monthly", label: "Aporte mensal", placeholder: "500", type: "currency" },
        { id: "years", label: "Anos", placeholder: "5", type: "time" },
        ...(toolId === "compound" ? [{ id: "rate", label: "Taxa anual (%)", placeholder: "10", type: "percent" }] : []),
      ]
      case "stocks": return [{ id: "initial", label: "Valor inicial", placeholder: "10000", type: "currency" }, { id: "years", label: "Anos", placeholder: "10", type: "time" }]
      case "emergency": return [{ id: "expenses", label: "Despesas mensais", placeholder: "3000", type: "currency" }, { id: "months", label: "Meses de reserva", placeholder: "6", type: "time" }]
      case "crypto": return [{ id: "initial", label: "Valor inicial", placeholder: "1000", type: "currency" }, { id: "volatility", label: "Nivel de Risco (1-10)", placeholder: "8", type: "percent" }]
      case "retirement": return [{ id: "age", label: "Sua Idade", placeholder: "25", type: "time" }, { id: "retireAge", label: "Idade de Aposentadoria", placeholder: "65", type: "time" }, { id: "monthly", label: "Investimento Mensal", placeholder: "1000", type: "currency" }]
      default: return []
    }
  }

  const handleCalculate = () => {
    if (!xpEarned) {
      updateUserXp(50)
      setXpEarned(true)
      if (user) {
        const newXp = user.xp + 50
        const isLevelUp = newXp >= user.xpToNextLevel
        updateProfileMutation.mutate({ xp: isLevelUp ? newXp - user.xpToNextLevel : newXp, level: isLevelUp ? user.level + 1 : user.level })
      }
    }

    switch (toolId) {
      case "budget": {
        const income = values.income || 0
        const strategy = budgetStrategies.find(s => s.id === budgetMethod)
        if (!strategy) break
        setMonthlyIncome(income)
        createFinancialMutation.mutate({ type: "INCOME", amount: income, category: "Salário/Renda", date: new Date().toISOString() })
        if (budgetMethod === "25/25/25/25") {
          setResult({ value: income * 0.25, details: [`Custos Fixos (25%): R$ ${(income * 0.25).toLocaleString("pt-BR")}`, `Variáveis (25%): R$ ${(income * 0.25).toLocaleString("pt-BR")}`, `Investimentos (25%): R$ ${(income * 0.25).toLocaleString("pt-BR")}`, `Educação/Lazer (25%): R$ ${(income * 0.25).toLocaleString("pt-BR")}`] })
        } else {
          const [r1, r2, r3] = strategy.ratios
          setResult({ value: income * r3, details: [`Essencial (${r1 * 100}%): R$ ${(income * r1).toLocaleString("pt-BR")}`, `Desejos (${r2 * 100}%): R$ ${(income * r2).toLocaleString("pt-BR")}`, `Investimento (${r3 * 100}%): R$ ${(income * r3).toLocaleString("pt-BR")}`] })
        }
        break
      }
      case "tesouro": {
        const { initial = 0, monthly = 0, years = 1 } = values
        const rate = 0.1; const months = years * 12
        let total = initial
        for (let i = 0; i < months; i++) total = total * (1 + rate / 12) + monthly
        const totalInvested = initial + monthly * months
        addInvestment({ id: `inv-${Date.now()}`, name: `Tesouro Direto - ${years} anos`, type: "tesouro", invested: totalInvested, currentValue: total, lastUpdate: new Date().toISOString() })
        createFinancialMutation.mutate({ type: "INVESTMENT", amount: totalInvested, category: "Tesouro Direto", date: new Date().toISOString() })
        setResult({ value: total, details: [`Total investido: R$ ${totalInvested.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, `Rendimento: R$ ${(total - totalInvested).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, `Taxa: 10% a.a.`] })
        break
      }
      case "stocks": {
        const { initial = 0, years = 1 } = values
        const total = initial * Math.pow(1.12, years)
        addInvestment({ id: `inv-${Date.now()}`, name: `Simulação Ações - ${years} anos`, type: "acao", invested: initial, currentValue: total, lastUpdate: new Date().toISOString() })
        setResult({ value: total, details: [`Inicial: R$ ${initial.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, `Valorização: R$ ${(total - initial).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, `Retorno histórico médio: 12% a.a.`] })
        break
      }
      case "compound": {
        const { initial = 0, monthly = 0, years = 1, rate: rateVal = 10 } = values
        const rate = rateVal / 100; const months = years * 12
        let total = initial
        for (let i = 0; i < months; i++) total = total * (1 + rate / 12) + monthly
        const totalInvested = initial + monthly * months
        setResult({ value: total, details: [`Total investido: R$ ${totalInvested.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, `Juros acumulados: R$ ${(total - totalInvested).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, `Taxa: ${rateVal}% a.a.`] })
        break
      }
      case "emergency": {
        const { expenses: exp = 0, months: mos = 6 } = values
        const total = exp * mos
        setEmergencyFund(total, total * 0.1)
        setResult({ value: total, details: [`Despesas mensais: R$ ${exp.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, `Meses de cobertura: ${mos}`, `Meta: R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`] })
        break
      }
      case "crypto": {
        const { initial = 0, volatility = 8 } = values
        const vol = volatility / 10
        const total = initial * (1 + (Math.random() * vol * 2) - vol * 0.5)
        setResult({ value: total, details: [`Inicial: R$ ${initial.toLocaleString("pt-BR")}`, `Volatilidade: ${(vol * 100).toFixed(0)}%`, total > initial ? "Cenário de Alta 🚀" : "Cenário de Queda 📉"] })
        break
      }
      case "retirement": {
        const { age = 25, retireAge = 65, monthly = 1000 } = values
        const years = retireAge - age; const months = years * 12
        let total = 0
        for (let i = 0; i < months; i++) total = total * (1 + 0.08 / 12) + monthly
        setResult({ value: total, details: [`Tempo: ${years} anos`, `Aporte mensal: R$ ${monthly.toLocaleString("pt-BR")}`, `Rendimento estimado: 8% a.a.`] })
        break
      }
    }
  }

  const toolTitle = toolTitles[toolId] || "Ferramenta"

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 pb-28">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 transition-transform hover:scale-110">
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">{toolTitle}</h1>
      </div>

      {toolInfo[toolId] && (
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20">
              <BookOpen className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Central de Conhecimento</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Como funciona?</p>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">{toolInfo[toolId].what}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Por que usar?</p>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">{toolInfo[toolId].why}</p>
            </div>
          </div>
        </div>
      )}

      {toolId === "budget" && (
        <div className="mb-8">
          <label className="mb-4 block text-sm font-black uppercase tracking-widest text-slate-400">Escolha sua Estratégia</label>
          <div className="grid grid-cols-1 gap-3">
            {budgetStrategies.map((strat) => (
              <button key={strat.id} onClick={() => setBudgetMethod(strat.id)} className={`relative flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${budgetMethod === strat.id ? "border-emerald-500 bg-emerald-500/10" : "border-slate-800 bg-slate-900/60 hover:border-slate-700"}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-white">{strat.label}</span>
                    <span className="rounded-full px-2 py-0.5 text-[8px] font-black bg-emerald-500/20 text-emerald-400">{strat.type}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{strat.desc}</p>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${budgetMethod === strat.id ? "border-emerald-500 bg-emerald-500" : "border-slate-700"}`}>
                  {budgetMethod === strat.id && <Check className="h-3 w-3 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {getFields().map((field) => (
          <div key={field.id}>
            <label className="mb-2 block text-sm font-medium text-slate-400">{field.label}</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                {field.type === "time" ? <Clock className="h-4 w-4" /> : field.type === "percent" ? <Percent className="h-4 w-4" /> : <span className="text-xs font-bold">R$</span>}
              </div>
              <input type="text" inputMode="decimal" placeholder={field.placeholder} value={displayValues[field.id] || ""} onChange={(e) => handleNumericInput(field.id, e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-4 pl-12 pr-4 text-lg text-white placeholder-slate-500 outline-none transition-all focus:border-emerald-500" />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleCalculate} className="mt-6 h-14 w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 text-lg font-bold text-white transition-all hover:scale-[1.02]">
        <Calculator className="mr-2 h-5 w-5" />
        Calcular
      </Button>

      {result && (
        <div className="mt-8 overflow-hidden rounded-[2.5rem] border border-emerald-500/30 bg-linear-to-br from-emerald-500/10 to-teal-500/10 p-8 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Resultado da Simulação</p>
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1">
              <Zap className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400">+50 XP</span>
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-6">R$ {result.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          <div className="mt-4 space-y-2">
            {result.details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
