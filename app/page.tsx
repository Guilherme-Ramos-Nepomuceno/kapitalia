"use client"

import { useState, useRef, useEffect } from "react"
import { QueryClient, QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { useAppStore } from "@/lib/store"
import {
  Flame,
  Trophy,
  Zap,
  Lock,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle2,
  XCircle,
  Sparkles,
  Target,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Wallet,
  Crown,
  Home,
  Map,
  Calculator,
  DollarSign,
  Percent,
  BarChart3,
  Building2,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  Star,
  User,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Settings,
  Edit3,
  Award,
  Clock,
  Calendar,
  Sun,
  Moon,
  HeartPulse,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ============================================
// MODEL: Zod Schemas
// ============================================

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().url().optional(),
  level: z.number().min(1),
  xp: z.number().min(0),
  xpToNextLevel: z.number().min(1),
  streak: z.number().min(0),
  isPro: z.boolean(),
  totalCoins: z.number().min(0),
})

const OnboardingSchema = z.object({
  age: z.enum(["16-18", "19-21", "22-24", "25+"]),
  goal: z.enum(["poupar", "investir", "sair_dividas", "independencia"]),
  experience: z.enum(["nenhuma", "basica", "intermediaria", "avancada"]),
})

const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string().optional(),
  activityContent: z.string().optional(),
  duration: z.string(),
  xpReward: z.number(),
  isCompleted: z.boolean(),
  isLocked: z.boolean(),
  isPro: z.boolean(),
  icon: z.string(),
  category: z.string(),
  tips: z.array(z.string()).optional(),
})

const TrailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  isPro: z.boolean(),
  totalLessons: z.number(),
  completedLessons: z.number(),
  lessons: z.array(LessonSchema),
})

const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  preContent: z.string().optional(),
  options: z.array(z.string()),
  correctIndex: z.number(),
})

const DashboardDataSchema = z.object({
  user: UserSchema,
  lessons: z.array(LessonSchema),
  currentLesson: LessonSchema.nullable(),
  weeklyProgress: z.number(),
  trails: z.array(TrailSchema),
})

// Types
type User = z.infer<typeof UserSchema>
type OnboardingData = z.infer<typeof OnboardingSchema>
type Lesson = z.infer<typeof LessonSchema>
type Trail = z.infer<typeof TrailSchema>
type QuizQuestion = z.infer<typeof QuizQuestionSchema>
type DashboardData = z.infer<typeof DashboardDataSchema>

// ============================================
// MODEL: Mock Data
// ============================================

const mockTrails: Trail[] = [
  {
    id: "trail-1",
    title: "Fundamentos Financeiros",
    description: "Aprenda o básico sobre dinheiro e como ele funciona no mundo real.",
    icon: "Wallet",
    color: "from-emerald-500 to-teal-600",
    isPro: false,
    totalLessons: 8,
    completedLessons: 0,
    lessons: [
      {
        id: "t1-1", title: "O que é dinheiro?", description: "A base de tudo",
        content: "Dinheiro é uma ferramenta criada para facilitar trocas. Antigamente usávamos sal ou gado, hoje usamos papel e bits.",
        activityContent: "Identifique as três funções do dinheiro: Meio de Troca, Reserva de Valor e Unidade de Conta.",
        duration: "3 min", xpReward: 50, isCompleted: false, isLocked: false, isPro: false, icon: "Coins", category: "Básico",
        tips: [
          "O cartão de crédito possui fechamento e vencimento. Compre após o fechamento para ganhar 40 dias.",
          "Sempre pague o total da fatura para fugir do juros rotativo de 400%+."
        ]
      },
      {
        id: "t1-2", title: "Mentalidade de Riqueza", description: "Como os ricos pensam",
        content: "Riqueza não é o quanto você ganha, mas o quanto você mantém. A mentalidade correta foca em ativos, não apenas em consumo.",
        activityContent: "Diferencie um Ativo (coloca dinheiro no bolso) de um Passivo (tira dinheiro do bolso).",
        duration: "4 min", xpReward: 60, isCompleted: false, isLocked: true, isPro: false, icon: "Sparkles", category: "Mindset",
        tips: [
          "Um carro de luxo para uso próprio é um passivo. Uma casa alugada é um ativo.",
          "Pague-se primeiro: reserve uma parte do seu salário antes de pagar as contas."
        ]
      },
      {
        id: "t1-3", title: "Inflação Simplificada", description: "O inimigo invisível",
        content: "Inflação é o aumento generalizado dos preços que corrói seu poder de compra. É por isso que R$ 100 hoje valem menos que ano passado.",
        activityContent: "Calcule o poder de compra perdido em um cenário de inflação de 10% ao ano.",
        duration: "5 min", xpReward: 70, isCompleted: false, isLocked: true, isPro: false, icon: "TrendingUp", category: "Economia",
        tips: [
          "Inflação alta favorece devedores e prejudica poupadores que deixam dinheiro parado.",
          "O IPCA é o principal índice que mede quanto os preços subiram no Brasil."
        ]
      },
      {
        id: "t1-4", title: "Juros Compostos", description: "A oitava maravilha do mundo",
        content: "Juros sobre juros. No longo prazo, o tempo é mais importante que o valor investido inicialmente.",
        activityContent: "Projete o crescimento de um capital investido por 10 anos usando juros compostos.",
        duration: "5 min", xpReward: 80, isCompleted: false, isLocked: true, isPro: false, icon: "Zap", category: "Investimentos",
        tips: [
          "A regra dos 72 ajuda a estimar em quanto tempo seu dinheiro dobra.",
          "Começar cedo é mais importante do que investir valores altos."
        ]
      },
      {
        id: "t1-5", title: "Segurança de Dados", description: "Proteja seu patrimônio",
        content: "No mundo digital, senhas fortes e 2FA são essenciais. Nunca compartilhe códigos de segurança com ninguém.",
        activityContent: "Identifique ataques de Phishing comuns em aplicativos bancários.",
        duration: "4 min", xpReward: 50, isCompleted: false, isLocked: true, isPro: false, icon: "Shield", category: "Segurança",
        tips: [
          "Use gerenciadores de senhas para não repetir senhas em sites diferentes.",
          "Ative a verificação em duas etapas em todos os seus apps financeiros."
        ]
      },
      {
        id: "t1-6", title: "A Regra 50/30/20", description: "Organize seu orçamento",
        content: "Uma estratégia simples: 50% necessidades, 30% desejos, 20% futuro.",
        activityContent: "Aloque as despesas de uma família em cada categoria da regra 50/30/20.",
        duration: "5 min", xpReward: 65, isCompleted: false, isLocked: true, isPro: false, icon: "BarChart3", category: "Orçamento",
        tips: [
          "Se suas necessidades passam de 50%, tente reduzir custos fixos como aluguel ou planos.",
          "O objetivo é que os 20% do futuro cresçam com o tempo."
        ]
      },
      {
        id: "t1-7", title: "Dívidas vs Investimentos", description: "O que priorizar?",
        content: "Dívidas de juros altos (como cartão) devem ser pagas antes de começar a investir em renda fixa.",
        activityContent: "Determine se vale a pena investir 10% ou pagar uma dívida de 12% ao mês.",
        duration: "6 min", xpReward: 75, isCompleted: false, isLocked: true, isPro: false, icon: "ArrowUpRight", category: "Dívidas",
        tips: [
          "Juros de dívidas quase sempre superam o rendimento de qualquer investimento.",
          "Negocie suas dívidas antes de começar a investir."
        ]
      },
      {
        id: "t1-8", title: "Sua Primeira Reserva", description: "O fim do estresse financeiro",
        content: "Comece com R$ 1.000. Depois, busque 6 meses de custo de vida em um investimento seguro e líquido.",
        activityContent: "Calcule sua reserva de emergência baseada em seu gasto mensal atual.",
        duration: "7 min", xpReward: 100, isCompleted: false, isLocked: true, isPro: false, icon: "PiggyBank", category: "Reserva",
        tips: [
          "A reserva deve ficar em um investimento com liquidez diária.",
          "Não toque na reserva para compras de consumo, apenas emergências reais."
        ]
      }
    ],
  },
  {
    id: "trail-2",
    title: "Crédito Inteligente",
    description: "Domine o cartão de crédito e as ferramentas bancárias.",
    icon: "CreditCard",
    color: "from-purple-500 to-indigo-600",
    isPro: false,
    totalLessons: 6,
    completedLessons: 0,
    lessons: [
      {
        id: "t2-1", title: "Ouro no Cartão", description: "Como funciona o ciclo",
        content: "O cartão é um empréstimo de curto prazo. Se pagar em dia, é juro zero.",
        activityContent: "Encontre a melhor data de compra analisando o fechamento da fatura.",
        duration: "4 min", xpReward: 55, isCompleted: false, isLocked: true, isPro: false, icon: "CreditCard", category: "Cartão",
        tips: [
          "O fechamento da fatura ocorre geralmente 10 dias antes do vencimento.",
          "Centralizar gastos no cartão ajuda a controlar o orçamento."
        ]
      },
      {
        id: "t2-2", title: "Limite e Score", description: "Seu valor para o banco",
        content: "Score é sua reputação financeira. Pagar contas em dia aumenta seu acesso a crédito barato.",
        activityContent: "Identifique comportamentos que aumentam ou reduzem seu Serasa Score.",
        duration: "5 min", xpReward: 60, isCompleted: false, isLocked: true, isPro: false, icon: "TrendingUp", category: "Crédito",
        tips: [
          "Manter o Cadastro Positivo ativo ajuda a subir seu score.",
          "Evite pedir crédito em vários bancos ao mesmo tempo."
        ]
      },
      {
        id: "t2-3", title: "Juros do Rotativo", description: "A maior armadilha",
        content: "Nunca pague o mínimo. Os juros rotativos são os mais caros do mercado financeiro.",
        activityContent: "Simule o crescimento de uma fatura de R$ 1.000 não paga por 3 meses.",
        duration: "5 min", xpReward: 70, isCompleted: false, isLocked: true, isPro: false, icon: "Percent", category: "Alerta",
        tips: [
          "Se não puder pagar a fatura, busque um parcelamento de fatura, que tem juros menores que o rotativo.",
          "O rotativo é ativado automaticamente se você pagar menos que o total."
        ]
      },
      {
        id: "t2-4", title: "Milhas e Pontos", description: "Dinheiro de volta",
        content: "Seus gastos podem virar passagens aéreas ou dinheiro. Mas não gaste mais só para pontuar.",
        activityContent: "Calcule a conversão de gastos reais para pontos em um programa padrão.",
        duration: "4 min", xpReward: 50, isCompleted: false, isLocked: true, isPro: false, icon: "Sparkles", category: "Benefícios",
        tips: [
          "Fique atento às promoções de transferência bonificada entre cartão e companhias aéreas.",
          "Não pague anuidade cara apenas por pontos se você gasta pouco."
        ]
      },
      {
        id: "t2-5", title: "Anuidade e Taxas", description: "Negocie como um mestre",
        content: "Muitos bancos cobram taxas que podem ser isentas. O atendimento ao cliente é seu aliado.",
        activityContent: "Escolha os melhores argumentos para pedir isenção de anuidade via chat.",
        duration: "4 min", xpReward: 45, isCompleted: false, isLocked: true, isPro: false, icon: "MessageCircle", category: "Economia",
        tips: [
          "Bancos digitais costumam oferecer cartões sem anuidade facilmente.",
          "Se o banco negar a isenção, considere trocar para um cartão gratuito."
        ]
      },
      {
        id: "t2-6", title: "Empréstimos Bancários", description: "Quando valem a pena?",
        content: "Consignado e financiamento imobiliário são ferramentas. Juro pessoal e cheque especial são perigos.",
        activityContent: "Ordene as modalidades de crédito da mais barata para a mais cara.",
        duration: "6 min", xpReward: 80, isCompleted: false, isLocked: true, isPro: false, icon: "DollarSign", category: "Crédito",
        tips: [
          "O crédito consignado é barato porque o desconto é direto na folha.",
          "Evite o cheque especial a todo custo."
        ]
      }
    ],
  },
  {
    id: "trail-3",
    title: "Domínio da Renda Fixa",
    description: "Invista com segurança e ganhe do CDI.",
    icon: "Building2",
    color: "from-blue-500 to-cyan-600",
    isPro: false,
    totalLessons: 6,
    completedLessons: 0,
    lessons: [
      {
        id: "t3-1", title: "O que é Renda Fixa?", description: "Emprestando para o banco",
        content: "Investir em renda fixa é como emprestar seu dinheiro em troca de juros acordados.",
        activityContent: "Identifique quem é o emissor (banco ou governo) em cada título.",
        duration: "5 min", xpReward: 60, isCompleted: false, isLocked: true, isPro: false, icon: "Building2", category: "Conceito",
        tips: ["Renda fixa não significa lucro fixo, mas sim regras de remuneração fixas.", "O IOF incide apenas nos primeiros 30 dias de aplicação."]
      },
      {
        id: "t3-2", title: "Selic e CDI", description: "As taxas mestras",
        content: "A Selic é a taxa do governo. O CDI é a taxa entre bancos. Elas andam juntas.",
        activityContent: "Calcule o rendimento de um investimento de 100% do CDI em um ano de Selic a 10%.",
        duration: "5 min", xpReward: 65, isCompleted: false, isLocked: true, isPro: false, icon: "Percent", category: "Taxas",
        tips: ["O CDI costuma ser 0,10% menor que a taxa Selic vigente.", "Quando a Selic sobe, a renda fixa costuma ficar mais atrativa."]
      },
      {
        id: "t3-3", title: "Tesouro Direto", description: "País mais seguro",
        content: "SELIC (liquidez), IPCA (inflação) e Prefixado (garantia).",
        activityContent: "Escolha o melhor título do Tesouro para uma viagem daqui a 5 anos.",
        duration: "6 min", xpReward: 75, isCompleted: false, isLocked: true, isPro: false, icon: "Map", category: "Governo"
      },
      {
        id: "t3-4", title: "CDB, LCI e LCA", description: "Bancos e Setores",
        content: "LCI e LCA são isentos de Imposto de Renda. CDBs pagam imposto mas costumam render mais.",
        activityContent: "Compare a rentabilidade real de um CDB de 115% vs uma LCI de 95% do CDI.",
        duration: "6 min", xpReward: 70, isCompleted: false, isLocked: true, isPro: false, icon: "Coins", category: "Bancos"
      },
      {
        id: "t3-5", title: "O Poder do FGC", description: "Sua garantia real",
        content: "O Fundo Garantidor de Crédito protege até R$ 250 mil por CPF e por instituição.",
        activityContent: "Determine o risco de investir em um banco pequeno garantido pelo FGC.",
        duration: "4 min", xpReward: 50, isCompleted: false, isLocked: true, isPro: false, icon: "Shield", category: "Segurança"
      },
      {
        id: "t3-6", title: "Montando seu Portfólio", description: "Estratégia completa",
        content: "Diversificar em renda fixa também é importante (Pós, Pré e Inflação).",
        activityContent: "Crie uma carteira de renda fixa equilibrando liquidez e rentabilidade.",
        duration: "7 min", xpReward: 90, isCompleted: false, isLocked: true, isPro: false, icon: "Wallet", category: "Estratégia"
      }
    ],
  },
  {
    id: "trail-4",
    title: "Ações e Bolsa",
    description: "Aprenda a investir em empresas e tornar-se sócio de grandes negócios.",
    icon: "BarChart3",
    color: "from-amber-400 to-yellow-600",
    isPro: true,
    totalLessons: 6,
    completedLessons: 0,
    lessons: [
      {
        id: "t4-1", title: "O que são Ações?", description: "Tornando-se sócio",
        content: "Ações representam a menor fração do capital social de uma empresa. Ao comprar, você vira sócio.",
        activityContent: "Diferencie ações Ordinárias (ON) de Preferenciais (PN).",
        duration: "5 min", xpReward: 70, isCompleted: false, isLocked: true, isPro: true, icon: "Building", category: "Bolsa",
        tips: ["Investir em ações é focar no longo prazo (5 a 10 anos pelo menos).", "Você ganha com a valorização da cotação e com os dividendos."]
      },
      {
        id: "t4-2", title: "Análise Fundamentalista", description: "Saúde das empresas",
        content: "Olhar lucro, dívida e governança antes de comprar um pedaço da empresa.",
        activityContent: "Analise o P/L (Preço sobre Lucro) de uma empresa fictícia.",
        duration: "7 min", xpReward: 100, isCompleted: false, isLocked: true, isPro: true, icon: "Search", category: "Análise"
      },
      { id: "t4-3", title: "Dividendos e JCP", description: "Renda passiva", duration: "6 min", xpReward: 80, isCompleted: false, isLocked: true, isPro: true, icon: "DollarSign", category: "Renda" },
      { id: "t4-4", title: "Dividend Yield", description: "Quanto a empresa paga?", duration: "5 min", xpReward: 75, isCompleted: false, isLocked: true, isPro: true, icon: "Percent", category: "Métricas" },
      { id: "t4-5", title: "Diversificação Real", description: "Não coloque todos os ovos numa cesta", duration: "6 min", xpReward: 85, isCompleted: false, isLocked: true, isPro: true, icon: "PieChart", category: "Estratégia" },
      { id: "t4-6", title: "ETFs e Índices", description: "Investindo no mercado todo", duration: "5 min", xpReward: 70, isCompleted: false, isLocked: true, isPro: true, icon: "Layers", category: "Simplicidade" }
    ],
  },
  {
    id: "trail-5",
    title: "Cripto para Iniciantes",
    description: "Desvende o Bitcoin e a nova economia digital.",
    icon: "Zap",
    color: "from-orange-500 to-red-600",
    isPro: true,
    totalLessons: 4,
    completedLessons: 0,
    lessons: [
      {
        id: "t5-1", title: "O que é Bitcoin?", description: "Ouro Digital",
        content: "A primeira moeda descentralizada do mundo, limitada a 21 milhões de unidades.",
        activityContent: "Entenda por que a escassez matemática dá valor ao Bitcoin.",
        duration: "6 min", xpReward: 90, isCompleted: false, isLocked: true, isPro: true, icon: "Coins", category: "Cripto",
        tips: ["Bitcoin não tem dono nem governo. É controlado por código e consenso.", "Not Your Keys, Not Your Coins: mantenha suas moedas em uma carteira própria."]
      },
      { id: "t5-2", title: "Ethereum e Smart Contracts", description: "O computador mundial", duration: "7 min", xpReward: 100, isCompleted: false, isLocked: true, isPro: true, icon: "Cpu", category: "Tecnologia" },
      { id: "t5-3", title: "Wallets e Segurança", description: "Proteja suas chaves", duration: "5 min", xpReward: 80, isCompleted: false, isLocked: true, isPro: true, icon: "Key", category: "Segurança" },
      { id: "t5-4", title: "Altcoins e DeFi", description: "O futuro das finanças", duration: "6 min", xpReward: 95, isCompleted: false, isLocked: true, isPro: true, icon: "Globe", category: "Inovação" }
    ],
  },
]

const mockQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Qual e o prazo medio para pagar a fatura do cartao sem juros?",
    preContent: "Dica de Ouro: O cartao de credito possui um 'dia de fechamento' e um 'dia de vencimento'. Se voce compra logo apos o fechamento, ganha ate 40 dias de prazo para pagar.",
    options: ["5 dias", "10 dias", "30 dias", "40 dias"],
    correctIndex: 2
  },
  {
    id: "q2",
    question: "O que acontece se voce pagar apenas o minimo da fatura?",
    preContent: "Pagar o minimo e uma das armadilhas mais caras do Brasil. O valor restante entra no 'Juros Rotativo', que costuma passar de 400% ao ano. Sempre pague o total!",
    options: ["Nada, esta tudo certo", "Voce entra no rotativo e paga juros altos", "Seu limite aumenta", "Voce ganha cashback"],
    correctIndex: 1
  },
  {
    id: "q3",
    question: "Qual a melhor estrategia para usar o cartao de credito?",
    preContent: "O cartao deve ser uma ferramenta de fluxo de caixa, nao um complemento de renda. Use-o para centralizar gastos e ganhar pontos/cashback, mas so gaste o que voce ja tem no banco.",
    options: ["Pagar sempre o minimo", "Parcelar tudo em 12x", "Pagar a fatura total todo mes", "Usar o limite todo"],
    correctIndex: 2
  },
]

const fetchDashboardData = (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: { id: "user-1", name: "Joao", level: 1, xp: 0, xpToNextLevel: 100, streak: 0, isPro: false, totalCoins: 0 },
        lessons: mockTrails[0].lessons,
        currentLesson: mockTrails[0].lessons[0],
        weeklyProgress: 0,
        trails: mockTrails,
      })
    }, 800)
  })
}

const submitOnboarding = (data: OnboardingData): Promise<{ success: boolean }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = OnboardingSchema.safeParse(data)
      if (result.success) resolve({ success: true })
      else reject(new Error("Dados invalidos"))
    }, 800)
  })
}

// ============================================
// VIEWMODELS
// ============================================

function useDashboardViewModel() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000,
  })
  return { data, isLoading, error, refetch }
}

function useOnboardingViewModel(onSuccess: () => void) {
  const mutation = useMutation({
    mutationFn: submitOnboarding,
    onSuccess: () => onSuccess(),
  })
  const validateAndSubmit = (data: OnboardingData) => {
    const result = OnboardingSchema.safeParse(data)
    if (result.success) mutation.mutate(result.data)
  }
  return { submit: validateAndSubmit, isLoading: mutation.isPending, isError: mutation.isError, error: mutation.error }
}

// ============================================
// VIEWS: Skeletons
// ============================================

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-800" />
            <Skeleton className="h-3 w-16 bg-slate-800" />
          </div>
        </div>
        <Skeleton className="h-10 w-20 rounded-2xl bg-slate-800" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl bg-slate-800" />)}
      </div>
      <Skeleton className="h-32 rounded-3xl bg-slate-800" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl bg-slate-800" />)}
      </div>
    </div>
  )
}

// ============================================
// VIEWS: Onboarding
// ============================================

interface OnboardingQuestion {
  id: keyof OnboardingData
  question: string
  options: { value: string; label: string; emoji: string }[]
}

const onboardingQuestions: OnboardingQuestion[] = [
  { id: "age", question: "Qual sua faixa etaria?", options: [{ value: "16-18", label: "16-18 anos", emoji: "🎓" }, { value: "19-21", label: "19-21 anos", emoji: "🎯" }, { value: "22-24", label: "22-24 anos", emoji: "💼" }, { value: "25+", label: "25+ anos", emoji: "🚀" }] },
  { id: "goal", question: "Qual seu maior objetivo financeiro?", options: [{ value: "poupar", label: "Comecar a poupar", emoji: "💰" }, { value: "investir", label: "Aprender a investir", emoji: "📈" }, { value: "sair_dividas", label: "Sair das dividas", emoji: "🎯" }, { value: "independencia", label: "Independencia financeira", emoji: "🏆" }] },
  { id: "experience", question: "Qual seu nivel de experiencia com financas?", options: [{ value: "nenhuma", label: "Sou iniciante total", emoji: "🌱" }, { value: "basica", label: "Sei o basico", emoji: "📚" }, { value: "intermediaria", label: "Tenho alguma experiencia", emoji: "⚡" }, { value: "avancada", label: "Ja mando bem", emoji: "🔥" }] },
]

function OnboardingView({ onComplete, onSubmit }: { onComplete: () => void; onSubmit?: (data: OnboardingData) => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingData>>({})
  const [nameInput, setNameInput] = useState("")
  const { submit, isLoading } = useOnboardingViewModel(() => {
    if (onSubmit && answers.age && answers.goal && answers.experience) {
      onSubmit(answers as OnboardingData)
    }
    onComplete()
  })
  const currentQuestion = onboardingQuestions[currentStep]
  const progress = ((currentStep + 1) / onboardingQuestions.length) * 100


  const handleOptionSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)
    if (currentStep < onboardingQuestions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300)
    } else {
      submit(newAnswers as OnboardingData)
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
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="mb-8 text-center text-2xl font-bold text-white max-w-md">{currentQuestion.question}</h1>
        <div className="w-full max-w-sm space-y-3">
          {currentQuestion.options.map((option) => (
            <button key={option.value} onClick={() => handleOptionSelect(option.value)} disabled={isLoading} className="flex w-full items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:border-emerald-500 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 transition-colors group-hover:bg-emerald-500/20">
                <span className="text-2xl">{option.emoji}</span>
              </div>
              <span className="text-lg font-medium text-white">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      {isLoading && (
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

// ============================================
// VIEWS: Bottom Navigation
// ============================================

type TabType = "home" | "trails" | "tools" | "profile"

function BottomNav({ activeTab, onTabChange }: { activeTab: TabType; onTabChange: (tab: TabType) => void }) {
  const tabs = [
    { id: "home" as TabType, icon: Home, label: "Inicio" },
    { id: "trails" as TabType, icon: Map, label: "Trilhas" },
    { id: "tools" as TabType, icon: Calculator, label: "Ferramentas" },
    { id: "profile" as TabType, icon: User, label: "Perfil" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200 ${isActive ? "scale-105" : "opacity-60 hover:opacity-100"}`}>
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

// ============================================
// VIEWS: Home Dashboard
// ============================================

function StatCard({ icon: Icon, value, label, gradient }: { icon: React.ElementType; value: string | number; label: string; gradient: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-all duration-200 hover:scale-105 hover:border-slate-700">
      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}

function HomeView({ data, onStartLesson, onProClick }: { data: DashboardData; onStartLesson: (lesson: Lesson) => void; onProClick: () => void }) {
  const xpProgress = (data.user.xp / data.user.xpToNextLevel) * 100

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 pb-28">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-lg font-bold text-white">
            {data.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Ola, {data.user.name}!</h1>
            <p className="text-sm text-slate-400">Nivel {data.user.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-3 py-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="font-bold text-orange-500">{data.user.streak}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard icon={Zap} value={data.user.xp} label="XP Total" gradient="from-emerald-500 to-teal-500" />
        <StatCard icon={Trophy} value={data.user.level} label="Nivel" gradient="from-amber-400 to-yellow-600" />
        <StatCard icon={Coins} value={data.user.totalCoins} label="Moedas" gradient="from-purple-500 to-indigo-500" />
      </div>

      {/* XP Progress */}
      <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">Progresso para Nivel {data.user.level + 1}</span>
          <span className="text-sm font-bold text-emerald-400">{data.user.xp}/{data.user.xpToNextLevel} XP</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: `${xpProgress}%` }} />
        </div>
      </div>

      {/* Streak Banner */}
      {data.user.streak >= 7 && (
        <div className="mb-6 flex items-center gap-4 rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="font-bold text-white">Sua ofensiva ta pegando fogo!</p>
            <p className="text-sm text-slate-400">{data.user.streak} dias seguidos estudando</p>
          </div>
        </div>
      )}

      {/* Continue Learning */}
      {data.currentLesson && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-white">Continuar aprendendo</h2>
          <button onClick={() => onStartLesson(data.currentLesson!)} className="flex w-full items-center gap-4 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-5 transition-all duration-200 hover:scale-[1.02]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-white">{data.currentLesson.title}</h3>
              <p className="text-sm text-slate-400">{data.currentLesson.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-emerald-400" />
          </button>
        </div>
      )}

      {/* Recent Trails */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-white">Suas trilhas</h2>
        <div className="space-y-3">
          {data.trails.slice(0, 3).map((trail) => (
            <div key={trail.id} className={`rounded-2xl border p-4 transition-all ${trail.isPro ? "border-amber-500/30 bg-amber-500/5" : "border-slate-800 bg-slate-900"}`}>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${trail.color}`}>
                  {trail.isPro ? <Crown className="h-6 w-6 text-white" /> : <Map className="h-6 w-6 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{trail.title}</h3>
                    {trail.isPro && <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 px-2 py-0.5 text-xs font-bold text-slate-900">PRO</span>}
                  </div>
                  <p className="text-sm text-slate-400">{trail.completedLessons}/{trail.totalLessons} licoes</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400">{Math.round((trail.completedLessons / trail.totalLessons) * 100)}%</span>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full bg-gradient-to-r ${trail.color} transition-all`} style={{ width: `${(trail.completedLessons / trail.totalLessons) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// VIEWS: Trails (Duolingo Style)
// ============================================
// VIEWS: Trails (Duolingo Style)
// ============================================

function TrailsView({ trails, onStartLesson, onProClick }: { trails: Trail[]; onStartLesson: (lesson: Lesson) => void; onProClick: () => void }) {
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null)

  if (selectedTrail) {
    return (
      <TrailDetailView
        trail={selectedTrail}
        onBack={() => setSelectedTrail(null)}
        onStartLesson={onStartLesson}
        onProClick={onProClick}
      />
    )
  }

  const freeTrails = trails.filter((t) => !t.isPro)
  const proTrails = trails.filter((t) => t.isPro)

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 pb-28">
      <h1 className="mb-6 text-2xl font-bold text-white">Trilhas de Aprendizado</h1>

      {/* Free Trails */}
      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          Trilhas Gratuitas
        </h2>
        <div className="relative">
          {/* Vertical Connection Line */}
          <div className="absolute left-7 top-8 bottom-8 w-1 rounded-full bg-gradient-to-b from-emerald-500/50 via-emerald-500/30 to-slate-700" />

          <div className="space-y-6">
            {freeTrails.map((trail, index) => {
              const progress = (trail.completedLessons / trail.totalLessons) * 100
              const isCompleted = progress === 100
              const isStarted = progress > 0

              return (
                <div key={trail.id} className="relative">
                  {/* Connection Node */}
                  <div className={`absolute left-5 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border-4 ${isCompleted ? "border-emerald-500 bg-emerald-500" :
                    isStarted ? "border-emerald-500 bg-slate-950" :
                      "border-slate-600 bg-slate-950"
                    }`}>
                    {isCompleted && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>

                  <button
                    onClick={() => setSelectedTrail(trail)}
                    className="ml-12 w-[calc(100%-3rem)] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 text-left transition-all hover:scale-[1.02] hover:border-emerald-500/50 hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${trail.color}`}>
                        <Map className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold text-white">{trail.title}</h3>
                        <p className="truncate text-sm text-slate-400">{trail.description}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-xs text-slate-500">{trail.totalLessons} licoes</span>
                          <span className="text-xs font-medium text-emerald-400">{trail.completedLessons}/{trail.totalLessons}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-center">
                        <div className="relative h-11 w-11">
                          <svg className="h-11 w-11 -rotate-90">
                            <circle cx="22" cy="22" r="18" fill="none" stroke="#1e293b" strokeWidth="3" />
                            <circle cx="22" cy="22" r="18" fill="none" stroke={`url(#gradient-${trail.id})`} strokeWidth="3" strokeDasharray={`${progress * 1.13} 113`} strokeLinecap="round" />
                            <defs>
                              <linearGradient id={`gradient-${trail.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#14b8a6" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pro Trails */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Crown className="h-5 w-5 text-amber-400" />
          Trilhas PRO
        </h2>
        <div className="relative">
          {/* Vertical Connection Line */}
          <div className="absolute left-7 top-8 bottom-8 w-1 rounded-full bg-gradient-to-b from-amber-500/50 via-amber-500/30 to-slate-700" />

          <div className="space-y-6">
            {proTrails.map((trail) => (
              <div key={trail.id} className="relative">
                {/* Connection Node */}
                <div className="absolute left-5 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border-4 border-amber-500/50 bg-slate-950">
                  <Lock className="h-2.5 w-2.5 text-amber-400" />
                </div>

                <button
                  onClick={onProClick}
                  className="ml-12 w-[calc(100%-3rem)] overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 p-4 text-left transition-all hover:scale-[1.02] hover:border-amber-500/50"
                >
                  {/* Pro Badge */}
                  <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 px-2 py-0.5 text-xs font-bold text-slate-900">
                    PRO
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${trail.color}`}>
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-white">{trail.title}</h3>
                      <p className="truncate text-sm text-slate-400">{trail.description}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-slate-500">{trail.totalLessons} licoes</span>
                        <span className="flex items-center gap-1 text-xs text-amber-400">
                          <Lock className="h-3 w-3" />
                          Desbloqueie
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Trail Detail View (Duolingo Path Style)
// Trail Detail View (Duolingo Path Style)
function TrailDetailView({ trail, onBack, onStartLesson, onProClick }: { trail: Trail; onBack: () => void; onStartLesson: (lesson: Lesson) => void; onProClick: () => void }) {
  // Find the current active lesson (the first one not completed)
  const activeLesson = trail.lessons.find(l => !l.isCompleted && !l.isLocked) || trail.lessons[trail.lessons.length - 1];

  return (
    <div className="min-h-screen bg-slate-950 pb-32 overflow-x-hidden">
      {/* Dynamic Background Pattern - Floating Shapes */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-emerald-500 rotate-12 rounded-2xl" />
        <div className="absolute top-60 right-20 w-24 h-24 border-4 border-teal-500 -rotate-12 rounded-3xl" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 border-4 border-cyan-500 rotate-45 rounded-xl" />
      </div>

      {/* Modern Compact Header */}
      <div className="relative z-20 px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 transition-all hover:scale-110 active:scale-95 shadow-xl">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-2 backdrop-blur-xl shadow-xl">
            <div className="flex -space-x-1.5 font-bold text-amber-400">
              <Star className="h-4 w-4 fill-amber-400" />
            </div>
            <span className="text-sm font-black text-white tracking-widest">
              {trail.completedLessons}/{trail.totalLessons}
            </span>
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-white leading-tight tracking-tight">{trail.title}</h1>
          <p className="mt-2 text-slate-400 font-bold text-lg">{trail.description}</p>
        </div>

        {/* Start Learning Call-to-Action Card */}
        {activeLesson && (
          <div className="relative mb-16 group">
            <div className={`absolute -inset-1 bg-gradient-to-r ${trail.color} rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-700`}></div>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-6">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <BookOpen className="h-24 w-24 text-white -mr-8 -mt-8 rotate-12" />
              </div>
              <div className="flex items-center gap-5 relative z-10">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${trail.color} shadow-2xl`}>
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase mb-1 block">SUA MISSÃO ATUAL</span>
                  <h3 className="text-xl font-black text-white truncate mb-4">{activeLesson.title}</h3>
                  <Button
                    onClick={() => onStartLesson(activeLesson)}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-black text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    COMEÇAR AGORA
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Isometric/Zig-Zag Path */}
      <div className="relative max-w-md mx-auto px-12 pb-20">
        {/* Animated Connector Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-2.5 -translate-x-1/2 overflow-hidden opacity-5 z-0 pointer-events-none rounded-full">
          <div className={`h-full w-full bg-gradient-to-b from-emerald-500 via-teal-500 to-transparent`} />
        </div>

        <div className="relative space-y-24 py-10 flex flex-col items-center">
          {trail.lessons.map((lesson, index) => {
            // Duolingo-style zig-zag positioning (alternating offsets)
            const positions = [0, -60, -80, -30, 40, 80, 50];
            const xPos = positions[index % positions.length];

            const isCompleted = lesson.isCompleted;
            const isLocked = lesson.isLocked;
            const isActive = !isCompleted && !isLocked;

            return (
              <div
                key={lesson.id}
                className={`relative flex flex-col items-center transition-all duration-700`}
                style={{
                  transform: `translateX(${xPos}px)`,
                }}
              >
                {/* Reward Stars floating above completed node */}
                {isCompleted && (
                  <div className="absolute -top-12 flex items-end gap-1.5 animate-bounce">
                    <Star className="h-6 w-6 text-amber-400 fill-amber-400 -rotate-12 mb-1 drop-shadow-lg" />
                    <Star className="h-8 w-8 text-amber-400 fill-amber-400 drop-shadow-xl" />
                    <Star className="h-6 w-6 text-amber-400 fill-amber-400 rotate-12 mb-1 drop-shadow-lg" />
                  </div>
                )}

                {/* Active Pulse Animation */}
                {isActive && (
                  <div className="absolute -inset-6 z-0">
                    <div className="h-full w-full animate-ping rounded-[3rem] bg-emerald-500/20 duration-1000" />
                  </div>
                )}

                {/* 3D Isometric Node Button */}
                <button
                  disabled={isLocked && !lesson.isPro}
                  onClick={() => {
                    if (lesson.isPro) onProClick();
                    else if (!isLocked) onStartLesson(lesson);
                  }}
                  className={`
                    relative group flex h-24 w-24 items-center justify-center transition-all duration-300
                    ${isLocked ? 'grayscale opacity-60' : 'hover:scale-110 active:scale-95 active:translate-y-1'}
                  `}
                >
                  {/* Node 'Base' (Shadow/Depth for 3D look) */}
                  <div className={`
                    absolute inset-0 translate-y-3 rounded-[2.5rem]
                    ${isCompleted ? 'bg-emerald-700' : isLocked ? 'bg-slate-800' : 'bg-emerald-600'}
                  `} />

                  {/* Node 'Surface' */}
                  <div className={`
                    absolute inset-0 flex items-center justify-center rounded-[2.5rem] border-b-[6px]
                    transition-all duration-300 transform group-active:translate-y-2
                    ${isCompleted
                      ? 'bg-emerald-500 border-emerald-600 shadow-emerald-500/30'
                      : isLocked
                        ? 'bg-slate-700 border-slate-800 shadow-inner'
                        : 'bg-emerald-400 border-emerald-500 shadow-emerald-400/30'}
                    shadow-2xl z-10
                  `}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-12 w-12 text-white stroke-[3px]" />
                    ) : isLocked ? (
                      <Lock className="h-10 w-10 text-white/30" />
                    ) : (
                      <BookOpen className="h-12 w-12 text-white stroke-[3px]" />
                    )}
                  </div>

                  {/* Floating Information Tooltip */}
                  {!isLocked && (
                    <div className={`
                      absolute top-full mt-6 left-1/2 -translate-x-1/2 
                      px-5 py-2.5 rounded-2xl bg-slate-900 border border-white/5 
                      shadow-2xl backdrop-blur-xl whitespace-nowrap z-30
                      transition-all duration-300 transform
                      ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 translate-y-2 group-hover:translate-y-0'}
                    `}>
                      <span className="block text-[10px] font-black text-emerald-400 uppercase leading-none mb-1 tracking-wider">
                        {isCompleted ? 'Praticar conteúdo' : 'Iniciar lição'}
                      </span>
                      <span className="text-sm font-black text-white">{lesson.title}</span>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-t border-l border-white/5 rotate-45" />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================
// VIEWS: Financial Tools
// ============================================

function ToolsView({ onProClick }: { onProClick: () => void }) {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const { user, expenses, monthlyIncome, emergencyFundGoal, emergencyFundCurrent, investments, completedLessons, updateUserXp } = useAppStore()

  const tools = [
    { id: "budget", title: "Controle de Gastos", description: "Organize suas despesas mensais", icon: Wallet, color: "from-emerald-500 to-teal-500", isPro: false, progress: expenses.length > 0 ? 100 : 0, xp: 50 },
    { id: "tesouro", title: "Simulador Tesouro", description: "Calcule seus rendimentos", icon: Building2, color: "from-blue-500 to-cyan-500", isPro: false, progress: 0, xp: 30 },
    { id: "stocks", title: "Projecao de Acoes", description: "Simule investimentos", icon: TrendingUp, color: "from-purple-500 to-indigo-500", isPro: false, progress: investments.length > 0 ? 100 : 0, xp: 40 },
    { id: "compound", title: "Juros Compostos", description: "Poder do tempo", icon: Percent, color: "from-amber-500 to-orange-500", isPro: false, progress: 0, xp: 25 },
    { id: "emergency", title: "Reserva de Emergencia", description: "Calcule sua reserva", icon: PiggyBank, color: "from-pink-500 to-rose-500", isPro: false, progress: emergencyFundGoal > 0 ? (emergencyFundCurrent / emergencyFundGoal) * 100 : 0, xp: 60 },
    { id: "crypto", title: "Simulador Cripto", description: "Projete criptos", icon: Coins, color: "from-orange-500 to-red-500", isPro: true, progress: 0, xp: 100 },
    { id: "retirement", title: "Aposentadoria", description: "Planeje seu futuro", icon: Target, color: "from-indigo-500 to-purple-500", isPro: true, progress: 0, xp: 120 },
  ]

  // Calculate Health Score (Gamified Metric)
  const calculateHealthScore = () => {
    let score = 0
    // 1. Pilar de Renda (20 pts)
    if (monthlyIncome > 0) score += 20

    // 2. Pilar de Despesas (20 pts)
    if (expenses.length > 0) score += 20

    // 3. Pilar de Reserva (20 pts)
    if (emergencyFundGoal > 0 && emergencyFundCurrent >= emergencyFundGoal) score += 20
    else if (emergencyFundGoal > 0) score += (emergencyFundCurrent / emergencyFundGoal) * 20

    // 4. Pilar de Investimentos (20 pts)
    if (investments.length > 0) score += 20

    // 5. Pilar de Conhecimento e Pratica (XP/Level) (20 pts)
    if (user) {
      // Cada level da 4 pontos, ate o level 5 (20 pts total)
      const levelBonus = Math.min(user.level * 4, 20)
      score += levelBonus
    }

    return Math.round(score)
  }

  const healthScore = calculateHealthScore()

  const missions = [
    { id: 1, title: "Definir Renda Mensal", icon: Wallet, xp: 20, done: monthlyIncome > 0 },
    { id: 2, title: "Usar Simulador de Investimento", icon: TrendingUp, xp: 40, done: investments.length > 0 },
    { id: 3, title: "Concluir uma Lição", icon: BookOpen, xp: 50, done: ((completedLessons as any)?.size || (completedLessons as any)?.length || 0) > 0 },
  ]

  if (activeTool) {
    const tool = tools.find((t) => t.id === activeTool)
    if (tool) {
      return (
        <ToolDetailView
          toolId={activeTool}
          toolTitle={tool.title}
          onBack={() => setActiveTool(null)}
        />
      )
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 pb-28">
      {/* 1. Health Score Card (Gamified) */}
      <div className="mb-8 relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-6 backdrop-blur-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <HeartPulse className="h-32 w-32 text-emerald-400 -mr-8 -mt-8" />
        </div>

        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">Sua Pontuação de Saúde</span>

          {/* Circular Progress Gauge */}
          <div className="relative h-40 w-40 mb-4">
            <svg className="h-full w-full -rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
              <circle
                cx="80" cy="80" r="70" fill="none"
                stroke="url(#health-gradient)" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${healthScore * 4.4} 440`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
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

      {/* 2. Daily Missions Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Missões do Dia
          </h3>
          <span className="text-[10px] font-bold text-slate-500 transition-all hover:text-emerald-400 cursor-pointer">Reset em 12h</span>
        </div>

        <div className="space-y-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${mission.done ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/60 border-slate-800'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${mission.done ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  {mission.done ? <CheckCircle2 className="h-6 w-6" /> : <mission.icon className="h-5 w-5" />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${mission.done ? 'text-emerald-400' : 'text-white'}`}>{mission.title}</p>
                  <p className="text-[10px] font-bold text-slate-500">Recompensa: {mission.xp} XP</p>
                </div>
              </div>
              {mission.done && <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Concluída</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Redesigned Tool Grid */}
      <h3 className="mb-4 px-2 text-sm font-black uppercase tracking-widest text-white">Seu Laboratório</h3>
      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon
          const isComplete = tool.progress === 100

          return (
            <button
              key={tool.id}
              onClick={() => tool.isPro ? onProClick() : setActiveTool(tool.id)}
              className={`group relative overflow-hidden rounded-[2rem] border p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${tool.isPro
                ? "border-amber-500/20 bg-amber-500/5"
                : isComplete
                  ? "border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/10"
                  : "border-slate-800 bg-slate-900/60 shadow-xl shadow-black/20"
                }`}
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} shadow-lg transition-transform group-hover:scale-110 group-hover:-rotate-6`}>
                <Icon className="h-6 w-6 text-white" />
              </div>

              <div className="min-w-0">
                <h4 className="truncate font-black text-white text-sm tracking-tight">{tool.title}</h4>
                <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-tight text-slate-500 group-hover:text-slate-400 transition-colors">{tool.description}</p>
              </div>

              {/* Progress and XP Badge */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-amber-500" />
                  <span className="text-[10px] font-black text-amber-500">+{tool.xp} XP</span>
                </div>
                {tool.isPro ? (
                  <div className="flex h-6 w-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 text-[9px] font-black text-slate-900">PRO</div>
                ) : (
                  <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{isComplete ? "OK" : `${Math.round(tool.progress)}%`}</div>
                )}
              </div>

              {/* Pro Overlay */}
              {tool.isPro && (
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Lock className="h-6 w-6 text-amber-400" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Tool Detail View
function ToolDetailView({ toolId, toolTitle, onBack }: { toolId: string; toolTitle: string; onBack: () => void }) {
  const [values, setValues] = useState<Record<string, number>>({})
  const [displayValues, setDisplayValues] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{ value: number; details: string[] } | null>(null)
  const [budgetMethod, setBudgetMethod] = useState("50/30/20")

  const budgetStrategies = [
    { id: "50/30/20", label: "Equilibrado", type: "Tranquilo", desc: "50% Essencial, 30% Desejos, 20% Futuro", ratios: [0.5, 0.3, 0.2] },
    { id: "60/30/10", label: "Conservador", type: "Iniciante", desc: "60% Essencial, 30% Desejos, 10% Futuro", ratios: [0.6, 0.3, 0.1] },
    { id: "70/20/10", label: "Sobrevivência", type: "Rigoroso", desc: "70% Essencial, 20% Desejos, 10% Reserva", ratios: [0.7, 0.2, 0.1] },
    { id: "25/25/25/25", label: "O Quadrante", type: "Aplicado", desc: "25% Fixo, 25% Variável, 25% Invest., 25% Edu.", ratios: [0.25, 0.25, 0.25, 0.25] },
  ]

  const { updateUserXp } = useAppStore()
  const [xpEarned, setXpEarned] = useState(false)

  const handleNumericInput = (id: string, rawValue: string) => {
    const formatted = rawValue.replace(/[^0-9.,]/g, "")
    const separators = (formatted.match(/[.,]/g) || []).length
    if (separators > 1) return

    setDisplayValues({ ...displayValues, [id]: formatted })
    const numValue = parseFloat(formatted.replace(",", ".")) || 0
    setValues({ ...values, [id]: numValue })
  }

  const toolInfo: Record<string, { what: string; why: string }> = {
    budget: {
      what: "O Controle de Gastos ajuda voce a distribuir sua renda usando metodologias consagradas do mercado financeiro.",
      why: "Nao existe um metodo unico. Dependendo da sua fase de vida, voce pode precisar ser mais rigoroso ou ter mais liberdade para desejos."
    },
    tesouro: {
      what: "O Simulador de Tesouro Direto projeta o rendimento de titulos publicos baseados em aportes mensais e tempo.",
      why: "O Tesouro e o investimento mais seguro do pais. Entender seu crescimento ajuda a planejar metas de médio e longo prazo com seguranca."
    },
    stocks: {
      what: "Esta ferramenta simula o crescimento de um capital investido em acoes considerando dividendos e valorizacao media.",
      why: "Acoes permitem que voce seja socio das maiores empresas do mundo. Simular ajuda a visualizar o poder da renda variavel no longo prazo."
    },
    compound: {
      what: "Os Juros Compostos sao calculados sobre o montante acumulado, gerando um efeito de bola de neve no seu patrimonio.",
      why: "Einstein chamou os juros compostos de a 8a maravilha do mundo. Ver o dinheiro trabalhando por voce e a maior motivacao para poupar."
    },
    emergency: {
      what: "A Reserva de Emergencia calcula o montante necessario para cobrir seu custo de vida por um periodo determinado (geralmente 6 meses).",
      why: "A reserva e seu colchao de seguranca. Ela evita que voce contraia dividas caras em momentos de crise ou imprevistos."
    }
  }

  const handleCalculate = () => {
    // Award XP
    if (!xpEarned) {
      updateUserXp(50)
      setXpEarned(true)
    }

    switch (toolId) {
      case "budget": {
        const income = values.income || 0
        const strategy = budgetStrategies.find(s => s.id === budgetMethod)
        if (strategy) {
          if (budgetMethod === "25/25/25/25") {
            setResult({
              value: income * 0.25,
              details: [
                `Custos Fixos (25%): R$ ${(income * 0.25).toLocaleString("pt-BR")}`,
                `Variaveis (25%): R$ ${(income * 0.25).toLocaleString("pt-BR")}`,
                `Investimentos (25%): R$ ${(income * 0.25).toLocaleString("pt-BR")}`,
                `Educacao/Lazer (25%): R$ ${(income * 0.25).toLocaleString("pt-BR")}`,
              ],
            })
          } else {
            const [r1, r2, r3] = strategy.ratios
            setResult({
              value: income * r3,
              details: [
                `Essencial (${r1 * 100}%): R$ ${(income * r1).toLocaleString("pt-BR")}`,
                `Desejos (${r2 * 100}%): R$ ${(income * r2).toLocaleString("pt-BR")}`,
                `Investimento (${r3 * 100}%): R$ ${(income * r3).toLocaleString("pt-BR")}`,
              ],
            })
          }
        }
        break
      }
      case "tesouro": {
        const initial = values.initial || 0
        const monthly = values.monthly || 0
        const years = values.years || 1
        const rate = 0.1 // 10% ao ano
        const months = years * 12
        let total = initial
        for (let i = 0; i < months; i++) {
          total = total * (1 + rate / 12) + monthly
        }
        const totalInvested = initial + monthly * months
        const profit = total - totalInvested
        setResult({
          value: total,
          details: [
            `Total investido: R$ ${totalInvested.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            `Rendimento: R$ ${profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            `Taxa considerada: 10% a.a.`,
          ],
        })
        break
      }
      case "stocks": {
        const initial = values.initial || 0
        const years = values.years || 1
        const rate = 0.12 // 12% ao ano
        const total = initial * Math.pow(1 + rate, years)
        const profit = total - initial
        setResult({
          value: total,
          details: [
            `Investimento inicial: R$ ${initial.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            `Valorizacao esperada: R$ ${profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            `Retorno medio historico: 12% a.a.`,
          ],
        })
        break
      }
      case "compound": {
        const initial = values.initial || 0
        const monthly = values.monthly || 0
        const years = values.years || 1
        const rate = (values.rate || 10) / 100
        const months = years * 12
        let total = initial
        for (let i = 0; i < months; i++) {
          total = total * (1 + rate / 12) + monthly
        }
        const totalInvested = initial + monthly * months
        setResult({
          value: total,
          details: [
            `Total investido: R$ ${totalInvested.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            `Juros acumulados: R$ ${(total - totalInvested).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            `Taxa: ${(rate * 100).toFixed(1)}% a.a.`,
          ],
        })
        break
      }
      case "emergency": {
        const expenses = values.expenses || 0
        const months = values.months || 6
        const total = expenses * months
        setResult({
          value: total,
          details: [
            `Despesas mensais: R$ ${expenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            `Meses de cobertura: ${months}`,
            `Meta de reserva: R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
          ],
        })
        break
      }
      default:
        break
    }
  }

  const getFields = () => {
    switch (toolId) {
      case "budget":
        return [{ id: "income", label: "Renda mensal", placeholder: "5000", type: "currency" }]
      case "tesouro":
      case "compound":
        return [
          { id: "initial", label: "Valor inicial", placeholder: "1000", type: "currency" },
          { id: "monthly", label: "Aporte mensal", placeholder: "500", type: "currency" },
          { id: "years", label: "Anos", placeholder: "5", type: "time" },
          ...(toolId === "compound" ? [{ id: "rate", label: "Taxa anual (%)", placeholder: "10", type: "percent" }] : []),
        ]
      case "stocks":
        return [
          { id: "initial", label: "Valor inicial", placeholder: "10000", type: "currency" },
          { id: "years", label: "Anos", placeholder: "10", type: "time" },
        ]
      case "emergency":
        return [
          { id: "expenses", label: "Despesas mensais", placeholder: "3000", type: "currency" },
          { id: "months", label: "Meses de reserva", placeholder: "6", type: "time" },
        ]
      default:
        return []
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 pb-28">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 transition-transform hover:scale-110">
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">{toolTitle}</h1>
      </div>

      {/* Informativo / Conhecimento */}
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

      {/* Strategy Selector (Budget Only) */}
      {toolId === "budget" && (
        <div className="mb-8">
          <label className="mb-4 block text-sm font-black uppercase tracking-widest text-slate-400">Escolha sua Estratégia</label>
          <div className="grid grid-cols-1 gap-3">
            {budgetStrategies.map((strat) => (
              <button
                key={strat.id}
                onClick={() => setBudgetMethod(strat.id)}
                className={`relative flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${budgetMethod === strat.id
                    ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                    : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-white">{strat.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter ${strat.type === "Tranquilo" ? "bg-blue-500/20 text-blue-400" :
                        strat.type === "Rigoroso" ? "bg-rose-500/20 text-rose-400" :
                          strat.type === "Aplicado" ? "bg-amber-500/20 text-amber-400" :
                            "bg-emerald-500/20 text-emerald-400"
                      }`}>
                      {strat.type}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500">{strat.desc}</p>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${budgetMethod === strat.id ? "border-emerald-500 bg-emerald-500" : "border-slate-700"
                  }`}>
                  {budgetMethod === strat.id && <Check className="h-3 w-3 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Fields */}
      <div className="space-y-4">
        {getFields().map((field) => (
          <div key={field.id}>
            <label className="mb-2 block text-sm font-medium text-slate-400">{field.label}</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                {field.type === "time" ? <Clock className="h-4 w-4" /> : field.type === "percent" ? <Percent className="h-4 w-4" /> : <span className="text-xs font-bold">R$</span>}
              </div>
              <input
                type="text"
                inputMode="decimal"
                placeholder={field.placeholder}
                value={displayValues[field.id] || ""}
                onChange={(e) => handleNumericInput(field.id, e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-4 pl-12 pr-4 text-lg text-white placeholder-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Calculate Button */}
      <Button onClick={handleCalculate} className="mt-6 h-14 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-lg font-bold text-white transition-all hover:scale-[1.02]">
        <Calculator className="mr-2 h-5 w-5" />
        Calcular
      </Button>

      {/* Result */}
      {result && (
        <div className="mt-8 overflow-hidden rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-8 shadow-2xl shadow-emerald-500/10 animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Resultado da Simulação</p>
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1">
              <Zap className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400">+50 XP</span>
            </div>
          </div>

          <p className="text-4xl font-black text-white mb-6">
            R$ {result.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
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

// ============================================
// VIEWS: Video Player
// ============================================


// ============================================
// VIEWS: Lesson Explanation
// ============================================

function LessonExplanationView({ lesson, onStartPractice, onBack }: { lesson: Lesson; onStartPractice: () => void; onBack: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {/* Header */}
      <div className="relative h-64 w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/20">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">{lesson.title}</h1>
          <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-900/50 px-3 py-1 border border-slate-800 backdrop-blur-sm">
            <Clock className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{lesson.duration} de preparacao</span>
          </div>
        </div>
        <button onClick={onBack} className="absolute left-6 top-8 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 transition-all hover:scale-110 active:scale-95">
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="relative -mt-8 flex-1 rounded-t-[2.5rem] border-t border-slate-800 bg-slate-950 overflow-y-auto">
        <div className="mx-auto max-w-md p-8 pt-10 pb-32">
          {/* Step 1: The Subject */}
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs">01</div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">O Conceito</h2>
            </div>
            <div className="prose prose-invert">
              <p className="text-lg leading-relaxed text-slate-200 font-medium">
                {lesson.content || lesson.description}
              </p>
            </div>
          </div>

          {/* New Step 2: Deep Activity Explanation */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs">02</div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">As Atividades</h2>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
              <p className="text-md leading-relaxed text-slate-300 font-semibold italic">
                {lesson.activityContent || "Nesta fase, voce aplicara os conceitos aprendidos atraves de exercicios praticos de tomada de decisao e calculos financeiros basicos."}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Target className="h-4 w-4 text-emerald-500" />
                <span>Foco: Precisao de analise e Logica Financeira</span>
              </div>
            </div>
          </div>

          {/* New Step 3: Expert Module (Consolidated Tips) */}
          {lesson.tips && lesson.tips.length > 0 && (
            <div className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs">03</div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">Módulo de Especialista</h2>
              </div>
              <div className="space-y-3">
                {lesson.tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 shrink-0 text-emerald-400" />
                    <p className="text-sm leading-relaxed text-slate-200 font-bold italic">
                      {tip}
                    </p>
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

            <Button
              onClick={onStartPractice}
              className="h-16 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-lg font-black text-white shadow-lg shadow-emerald-500/20 transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
            >
              IR PARA PRÁTICA
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuizView({ lesson, onComplete, onBack }: { lesson: Lesson; onComplete: () => void; onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const currentQuestion = mockQuizQuestions[currentIndex]
  const isCorrect = selectedAnswer === currentQuestion?.correctIndex
  const isLastQuestion = currentIndex === mockQuizQuestions.length - 1

  const handleSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    if (index === currentQuestion.correctIndex) setCorrectCount(correctCount + 1)
  }

  const handleNext = () => {
    if (isLastQuestion && showResult) onComplete()
    else {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const progress = ((currentIndex + 1) / mockQuizQuestions.length) * 100

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 px-4 py-6">
      {/* Progress Header */}
      <div className="mb-6 shrink-0">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 transition-transform duration-200 hover:scale-110 active:scale-95">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 border border-slate-800">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Questão {currentIndex + 1}/{mockQuizQuestions.length}</span>
          </div>
          <div className="w-10" />
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-900 border border-slate-800">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Question View */}
        <div className="animate-in slide-in-from-right-8 fade-in duration-500">
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">Múltipla Escolha</span>
            <h2 className="text-2xl font-black text-white leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectOption = index === currentQuestion.correctIndex
              const isWrong = isSelected && !isCorrectOption

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={showResult}
                  className={`
                    relative w-full overflow-hidden rounded-[1.5rem] border-2 p-5 text-left transition-all duration-300
                    ${showResult
                      ? isCorrectOption
                        ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                        : isWrong
                          ? "border-rose-500 bg-rose-500/10"
                          : "border-slate-800 opacity-40 grayscale"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 active:scale-[0.97] shadow-xl shadow-black/20"}
                  `}
                >
                  <div className="flex items-center gap-5 relative z-10">
                    <div className={`
                      flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black text-lg transition-colors
                      ${showResult
                        ? isCorrectOption
                          ? "bg-emerald-500 text-white"
                          : isWrong
                            ? "bg-rose-500 text-white"
                            : "bg-slate-800 text-slate-600"
                        : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"}
                    `}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className={`text-lg font-bold transition-colors ${showResult && !isCorrectOption && !isSelected ? "text-slate-600" : "text-slate-200"}`}>
                      {option}
                    </span>
                    {showResult && isCorrectOption && <CheckCircle2 className="ml-auto h-7 w-7 text-emerald-500 bounce-in" />}
                    {showResult && isWrong && <XCircle className="ml-auto h-7 w-7 text-rose-500 shake" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 shrink-0 pb-6">
        {showResult && (
          <div className="animate-in slide-in-from-bottom-8 fade-in duration-500 max-w-md mx-auto">
            <div className={`mb-6 rounded-3xl p-6 flex items-center gap-4 ${isCorrect ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-rose-500/10 border border-rose-500/20"}`}>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isCorrect ? "bg-emerald-500" : "bg-rose-500"}`}>
                {isCorrect ? <Trophy className="h-6 w-6 text-white" /> : <XCircle className="h-6 w-6 text-white" />}
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                  {isCorrect ? "Incrível!" : "Quase lá!"}
                </p>
                <p className="text-sm font-bold text-white">
                  {isCorrect ? "Você domina o assunto!" : "Errar faz parte do aprendizado."}
                </p>
              </div>
            </div>
            <Button onClick={handleNext} className="h-16 w-full rounded-[1.5rem] bg-gradient-to-r from-emerald-500 to-teal-500 text-lg font-black text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              {isLastQuestion ? "CONCLUIR JORNADA" : "PRÓXIMO DESAFIO"}
              <ChevronRight className="ml-2 h-6 w-6" />
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
  )
}

// ============================================
// VIEWS: Modals
// ============================================

function ProModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-amber-500/30 bg-slate-900 sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl text-white">Destravar PRO</DialogTitle>
          <DialogDescription className="text-center text-slate-400">Acesse conteudos exclusivos e acelere sua jornada financeira</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            {["Acesso a todas as aulas avancadas", "Simuladores de investimento", "Suporte prioritario", "Certificados de conclusao"].map((feature, index) => (
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
          <Button className="h-14 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-600 text-lg font-bold text-slate-900 transition-all hover:scale-[1.02]">
            <Sparkles className="mr-2 h-5 w-5" />
            Quero ser PRO
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CompletionModal({ isOpen, onClose, xpEarned }: { isOpen: boolean; onClose: () => void; xpEarned: number }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-emerald-500/30 bg-slate-900 sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl text-white">Parabens!</DialogTitle>
          <DialogDescription className="text-center text-slate-400">Voce completou a licao com sucesso!</DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/20 px-6 py-3">
            <Zap className="h-6 w-6 text-emerald-400" />
            <span className="text-2xl font-bold text-emerald-400">+{xpEarned} XP</span>
          </div>
        </div>
        <Button onClick={onClose} className="h-14 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-lg font-bold text-white transition-all hover:scale-[1.02]">Continuar</Button>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// VIEWS: Login / Register
// ============================================

function LoginView({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login, register, authEmail } = useAppStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800))

    if (mode === "login") {
      if (!authEmail) {
        setError("Nenhuma conta encontrada. Crie uma conta primeiro.")
        setIsLoading(false)
        return
      }
      const success = login(email, password)
      if (success) {
        onSuccess()
      } else {
        setError("Email ou senha incorretos")
      }
    } else {
      if (name.length < 2) {
        setError("Nome deve ter pelo menos 2 caracteres")
        setIsLoading(false)
        return
      }
      if (email.length < 5 || !email.includes("@")) {
        setError("Email invalido")
        setIsLoading(false)
        return
      }
      if (password.length < 6) {
        setError("Senha deve ter pelo menos 6 caracteres")
        setIsLoading(false)
        return
      }
      register(email, password, name)
      onSuccess()
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Side Panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-emerald-600 to-teal-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-300 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl shadow-emerald-900/20">
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

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile Logo (Visible only on small screens) */}
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
                {mode === "login"
                  ? "Entre com suas credenciais para continuar"
                  : "Comece sua jornada rumo à liberdade financeira"}
              </p>
            </div>

            {/* Premium Tab Switcher */}
            <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${mode === "login"
                  ? "bg-slate-800 text-white shadow-lg shadow-black/50"
                  : "text-slate-500 hover:text-slate-300"
                  }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${mode === "register"
                  ? "bg-slate-800 text-white shadow-lg shadow-black/50"
                  : "text-slate-500 hover:text-slate-300"
                  }`}
              >
                Cadastrar
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "register" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Nome Completo</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Silva"
                      className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-900 pl-12 pr-4 text-white placeholder-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                    className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-900 pl-12 pr-4 text-white placeholder-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-900 pl-12 pr-4 text-white placeholder-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
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

              <Button
                type="submit"
                disabled={isLoading}
                className="h-14 w-full rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-lg font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : mode === "login" ? (
                  "Entrar na Plataforma"
                ) : (
                  "Criar minha Conta"
                )}
              </Button>
            </form>

            {/* Social Proof / Footer */}
            <div className="pt-8 border-t border-slate-900 space-y-6">
              <div className="flex items-center justify-center gap-4 grayscale opacity-50">
                <div className="w-8 h-8 rounded bg-slate-800" />
                <div className="w-8 h-8 rounded bg-slate-800" />
                <div className="w-8 h-8 rounded bg-slate-800" />
              </div>
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

// ============================================
// VIEWS: Profile
// ============================================

function ProfileView({ onLogout, onProClick }: { onLogout: () => void; onProClick: () => void }) {
  const { user, totalXpEarned, completedLessons, onboardingData, logout } = useAppStore()
  const [showEditModal, setShowEditModal] = useState(false)

  if (!user) return null

  const stats = [
    { icon: Zap, label: "XP Total", value: totalXpEarned, color: "from-emerald-500 to-teal-500" },
    { icon: Trophy, label: "Nivel", value: user.level, color: "from-amber-400 to-yellow-600" },
    { icon: Flame, label: "Streak", value: `${user.streak} dias`, color: "from-orange-500 to-red-500" },
    { icon: CheckCircle2, label: "Licoes", value: completedLessons.size, color: "from-blue-500 to-cyan-500" },
    { icon: Coins, label: "Moedas", value: user.totalCoins, color: "from-pink-500 to-rose-500" },
  ]

  const handleLogout = () => {
    logout()
    onLogout()
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 pb-28">
      {/* Profile Header */}
      <div className="mb-6 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-3xl font-bold text-white ring-4 ring-emerald-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {user.isPro && (
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 ring-2 ring-slate-950">
              <Crown className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
        {user.email && <p className="mt-1 text-slate-400">{user.email}</p>}
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-400">
            Nivel {user.level}
          </span>
          {user.isPro && (
            <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 px-3 py-1 text-sm font-bold text-slate-900">
              PRO
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-3 text-center">
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* XP Progress */}
      <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">Progresso Nivel {user.level + 1}</span>
          <span className="text-sm font-bold text-emerald-400">{user.xp}/{user.xpToNextLevel} XP</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
            style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
          />
        </div>
      </div>

      {/* Onboarding Info */}
      {onboardingData && (
        <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <Target className="h-5 w-5 text-emerald-400" />
            Seu Perfil
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Faixa etaria</span>
              <span className="text-sm font-medium text-white">{onboardingData.age} anos</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Objetivo</span>
              <span className="text-sm font-medium text-white capitalize">
                {onboardingData.goal.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Experiencia</span>
              <span className="text-sm font-medium text-white capitalize">{onboardingData.experience}</span>
            </div>
          </div>
        </div>
      )}

      {/* Join Date */}
      {user.joinedAt && (
        <div className="mb-6 flex items-center justify-center gap-2 text-sm text-slate-400">
          <Calendar className="h-4 w-4" />
          <span>
            Membro desde {new Date(user.joinedAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {!user.isPro && (
          <button
            onClick={onProClick}
            className="flex w-full items-center justify-between rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 p-4 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Seja PRO</p>
                <p className="text-xs text-slate-400">Desbloqueie todo o conteudo</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-amber-400" />
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-all hover:border-red-500/30 hover:bg-red-500/10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
              <LogOut className="h-5 w-5 text-red-400" />
            </div>
            <span className="font-semibold text-white">Sair da Conta</span>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </button>
      </div>
    </div>
  )
}

// ============================================
// MAIN: App
// ============================================

type AppView = "login" | "onboarding" | "main" | "lesson" | "quiz"

function FinanceApp() {
  const [currentView, setCurrentView] = useState<AppView>("login")
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [showProModal, setShowProModal] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Zustand store
  const {
    isLoggedIn,
    isOnboarded,
    user,
    completeOnboarding,
    completeLesson,
    updateStreak,
    isLessonCompleted,
  } = useAppStore()

  const { data, isLoading, refetch } = useDashboardViewModel()

  // Hydration check for SSR
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Set initial view based on persisted state
  useEffect(() => {
    if (isHydrated) {
      if (isLoggedIn && isOnboarded) {
        setCurrentView("main")
        updateStreak() // Update streak on app open
      } else if (isLoggedIn && !isOnboarded) {
        setCurrentView("onboarding")
      } else {
        setCurrentView("login")
      }
    }
  }, [isHydrated, isLoggedIn, isOnboarded, updateStreak])

  const handleOnboardingComplete = () => {
    setCurrentView("main")
  }

  // Custom onboarding that saves to Zustand
  const handleOnboardingSubmit = (onboardingData: OnboardingData) => {
    completeOnboarding(onboardingData)
    setCurrentView("main")
  }

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setCurrentView("lesson")
  }

  const handlePractice = () => setCurrentView("quiz")

  const handleQuizComplete = () => {
    if (selectedLesson) {
      // Save lesson completion to Zustand
      completeLesson(selectedLesson.id, selectedLesson.xpReward)
    }
    setShowCompletionModal(true)
  }

  const handleCompletionClose = () => {
    setShowCompletionModal(false)
    setSelectedLesson(null)
    setCurrentView("main")
    refetch()
  }

  const handleBackToMain = () => {
    setSelectedLesson(null)
    setCurrentView("main")
  }

  // Show loading while hydrating
  if (!isHydrated) {
    return <DashboardSkeleton />
  }

  if (currentView === "login" && !isLoggedIn) {
    return <LoginView onSuccess={() => setCurrentView(isOnboarded ? "main" : "onboarding")} />
  }

  if (currentView === "onboarding" && !isOnboarded) {
    return <OnboardingView onComplete={handleOnboardingComplete} onSubmit={handleOnboardingSubmit} />
  }


  if (currentView === "lesson" && selectedLesson) {
    return <LessonExplanationView lesson={selectedLesson} onStartPractice={handlePractice} onBack={handleBackToMain} />
  }

  if (currentView === "quiz" && selectedLesson) {
    return (
      <>
        <QuizView lesson={selectedLesson} onComplete={handleQuizComplete} onBack={() => setCurrentView("lesson")} />
        <CompletionModal isOpen={showCompletionModal} onClose={handleCompletionClose} xpEarned={selectedLesson.xpReward} />
      </>
    )
  }

  if (isLoading || !data) {
    return <DashboardSkeleton />
  }

  // Merge persisted user data with fetched data
  const mergedData = {
    ...data,
    user: user || data.user,
    trails: data.trails.map(trail => ({
      ...trail,
      lessons: trail.lessons.map(lesson => ({
        ...lesson,
        isCompleted: isLessonCompleted(lesson.id) || lesson.isCompleted,
      })),
      completedLessons: trail.lessons.filter(l => isLessonCompleted(l.id) || l.isCompleted).length,
    })),
  }

  return (
    <>
      {activeTab === "home" && <HomeView data={mergedData} onStartLesson={handleStartLesson} onProClick={() => setShowProModal(true)} />}
      {activeTab === "trails" && <TrailsView trails={mergedData.trails} onStartLesson={handleStartLesson} onProClick={() => setShowProModal(true)} />}
      {activeTab === "tools" && <ToolsView onProClick={() => setShowProModal(true)} />}
      {activeTab === "profile" && <ProfileView onLogout={() => setCurrentView("login")} onProClick={() => setShowProModal(true)} />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </>
  )
}

// ============================================
// PROVIDER
// ============================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <FinanceApp />
    </QueryClientProvider>
  )
}
