/**
 * Mock Data for Development
 * This file contains all mock data simulating a real database
 */

import type { User, Trail, Lesson, Transaction, Investment, ExpenseCategory } from "@/lib/types/api";

// Mock Users Database
export const mockUsers = new Map<
  string,
  User & {
    password: string;
    joinedAt: string;
    completedLessons: string[];
    currentLesson?: string;
    monthlyIncome: number;
    expenses: ExpenseCategory[];
    transactions: Transaction[];
    investments: Investment[];
    emergencyFundGoal: number;
    emergencyFundCurrent: number;
  }
>();

// Initialize with default user
mockUsers.set("user@example.com", {
  id: "user-1",
  name: "João Silva",
  email: "user@example.com",
  password: "password123", // In real app, this would be hashed
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
  level: 5,
  xp: 2450,
  xpToNextLevel: 3000,
  streak: 12,
  isPro: false,
  totalCoins: 450,
  joinedAt: "2024-01-15",
  completedLessons: ["lesson-1", "lesson-2", "lesson-3", "lesson-5"],
  currentLesson: "lesson-4",
  monthlyIncome: 3500,
  emergencyFundGoal: 10000,
  emergencyFundCurrent: 4200,
  expenses: [
    {
      id: "exp-1",
      name: "Alimentação",
      budgeted: 800,
      spent: 650,
      color: "#FF6B6B",
    },
    {
      id: "exp-2",
      name: "Transporte",
      budgeted: 300,
      spent: 280,
      color: "#4ECDC4",
    },
    {
      id: "exp-3",
      name: "Diversão",
      budgeted: 200,
      spent: 150,
      color: "#95E1D3",
    },
    {
      id: "exp-4",
      name: "Moradia",
      budgeted: 1200,
      spent: 1200,
      color: "#F7B731",
    },
  ],
  transactions: [
    {
      id: "trans-1",
      description: "Salário",
      amount: 3500,
      category: "Renda",
      date: "2024-04-01",
      type: "income",
    },
    {
      id: "trans-2",
      description: "Supermercado",
      amount: 250,
      category: "Alimentação",
      date: "2024-04-03",
      type: "expense",
    },
    {
      id: "trans-3",
      description: "Passagem Ônibus",
      amount: 120,
      category: "Transporte",
      date: "2024-04-03",
      type: "expense",
    },
  ],
  investments: [
    {
      id: "inv-1",
      name: "Tesouro IPCA+ 2045",
      type: "tesouro",
      invested: 2000,
      currentValue: 2150,
      lastUpdate: "2024-04-07",
    },
    {
      id: "inv-2",
      name: "Fundo Imobiliário XP Log",
      type: "fii",
      invested: 1000,
      currentValue: 1080,
      lastUpdate: "2024-04-07",
    },
  ],
});

// Mock Trails (Learning Paths)
export const mockTrails: Trail[] = [
  {
    id: "trail-1",
    title: "Fundamentos Financeiros",
    description: "Aprenda os conceitos básicos de finanças pessoais",
    icon: "PiggyBank",
    color: "#FF6B6B",
    isPro: false,
    totalLessons: 5,
    completedLessons: 4,
    lessons: [
      {
        id: "lesson-1",
        title: "O que é Educação Financeira",
        description: "Entenda a importância de gerenciar suas finanças",
        duration: "8 min",
        xpReward: 100,
        isCompleted: true,
        isLocked: false,
        isPro: false,
        icon: "BookOpen",
        category: "Basics",
      },
      {
        id: "lesson-2",
        title: "Orçamento Pessoal",
        description: "Aprenda a criar e manter um orçamento eficiente",
        duration: "12 min",
        xpReward: 150,
        isCompleted: true,
        isLocked: false,
        isPro: false,
        icon: "Calculator",
        category: "Basics",
      },
      {
        id: "lesson-3",
        title: "Controle de Despesas",
        description: "Técnicas para acompanhar e reduzir gastos",
        duration: "10 min",
        xpReward: 125,
        isCompleted: true,
        isLocked: false,
        isPro: false,
        icon: "TrendingDown",
        category: "Basics",
      },
      {
        id: "lesson-4",
        title: "Fundo de Emergência",
        description: "Por que e como construir sua rede de segurança financeira",
        duration: "15 min",
        xpReward: 200,
        isCompleted: false,
        isLocked: false,
        isPro: false,
        icon: "Shield",
        category: "Basics",
      },
      {
        id: "lesson-5",
        title: "Dívidas e Crédito",
        description: "Gestão inteligente de débitos e pontuação de crédito",
        duration: "14 min",
        xpReward: 175,
        isCompleted: true,
        isLocked: false,
        isPro: false,
        icon: "AlertCircle",
        category: "Basics",
      },
    ],
  },
  {
    id: "trail-2",
    title: "Investimentos 101",
    description: "Inicie sua jornada no mundo dos investimentos",
    icon: "TrendingUp",
    color: "#4ECDC4",
    isPro: false,
    totalLessons: 6,
    completedLessons: 0,
    lessons: [
      {
        id: "lesson-6",
        title: "Tipos de Investimentos",
        description: "Conheça as principais modalidades de investimento",
        duration: "16 min",
        xpReward: 200,
        isCompleted: false,
        isLocked: false,
        isPro: false,
        icon: "BarChart3",
        category: "Investing",
      },
      {
        id: "lesson-7",
        title: "Renda Fixa",
        description: "Entenda os investimentos de renda fixa",
        duration: "12 min",
        xpReward: 150,
        isCompleted: false,
        isLocked: false,
        isPro: false,
        icon: "TrendingUp",
        category: "Investing",
      },
      {
        id: "lesson-8",
        title: "Ações na Bolsa",
        description: "Como investir em ações na B3",
        duration: "18 min",
        xpReward: 225,
        isCompleted: false,
        isLocked: true,
        isPro: true,
        icon: "Building2",
        category: "Investing",
      },
      {
        id: "lesson-9",
        title: "Fundos de Investimento",
        description: "Diversifique com fundos mútuos",
        duration: "14 min",
        xpReward: 175,
        isCompleted: false,
        isLocked: true,
        isPro: true,
        icon: "Coins",
        category: "Investing",
      },
      {
        id: "lesson-10",
        title: "Fundos Imobiliários",
        description: "FIIs - Investimento em imóveis",
        duration: "13 min",
        xpReward: 160,
        isCompleted: false,
        isLocked: true,
        isPro: true,
        icon: "Building2",
        category: "Investing",
      },
      {
        id: "lesson-11",
        title: "Análise de Investimentos",
        description: "Ferramentas para tomar melhores decisões",
        duration: "20 min",
        xpReward: 250,
        isCompleted: false,
        isLocked: true,
        isPro: true,
        icon: "BarChart3",
        category: "Investing",
      },
    ],
  },
  {
    id: "trail-3",
    title: "Independência Financeira",
    description: "Caminho para a liberdade financeira (PRO)",
    icon: "Crown",
    color: "#F7B731",
    isPro: true,
    totalLessons: 4,
    completedLessons: 0,
    lessons: [
      {
        id: "lesson-12",
        title: "FIRE - Financial Independence",
        description: "Conceitos avançados de independência financeira",
        duration: "22 min",
        xpReward: 300,
        isCompleted: false,
        isLocked: true,
        isPro: true,
        icon: "Flame",
        category: "Advanced",
      },
      {
        id: "lesson-13",
        title: "Construindo Renda Passiva",
        description: "Fontes de renda passiva com segurança",
        duration: "18 min",
        xpReward: 225,
        isCompleted: false,
        isLocked: true,
        isPro: true,
        icon: "DollarSign",
        category: "Advanced",
      },
      {
        id: "lesson-14",
        title: "Planejamento de Aposentadoria",
        description: "Prepare-se para uma aposentadoria confortável",
        duration: "20 min",
        xpReward: 250,
        isCompleted: false,
        isLocked: true,
        isPro: true,
        icon: "Clock",
        category: "Advanced",
      },
      {
        id: "lesson-15",
        title: "Diversificação Avançada",
        description: "Estratégias de diversificação profissional",
        duration: "19 min",
        xpReward: 240,
        isCompleted: false,
        isLocked: true,
        isPro: true,
        icon: "Zap",
        category: "Advanced",
      },
    ],
  },
  {
    id: "trail-4",
    title: "Sair das Dívidas",
    description: "Estratégias para se livrar das dívidas",
    icon: "TrendingDown",
    color: "#95E1D3",
    isPro: false,
    totalLessons: 5,
    completedLessons: 0,
    lessons: [
      {
        id: "lesson-16",
        title: "Entendendo Suas Dívidas",
        description: "Análise e categorização de dívidas",
        duration: "11 min",
        xpReward: 140,
        isCompleted: false,
        isLocked: false,
        isPro: false,
        icon: "AlertCircle",
        category: "Debt",
      },
      {
        id: "lesson-17",
        title: "Método Bola de Neve",
        description: "Técnica eficaz para eliminar dívidas",
        duration: "13 min",
        xpReward: 165,
        isCompleted: false,
        isLocked: false,
        isPro: false,
        icon: "Target",
        category: "Debt",
      },
      {
        id: "lesson-18",
        title: "Método Avalanche",
        description: "Minimizar juros ao pagar dívidas",
        duration: "12 min",
        xpReward: 150,
        isCompleted: false,
        isLocked: false,
        isPro: false,
        icon: "TrendingUp",
        category: "Debt",
      },
      {
        id: "lesson-19",
        title: "Negociação de Dívidas",
        description: "Técnicas para negociar com credores",
        duration: "14 min",
        xpReward: 175,
        isCompleted: false,
        isLocked: false,
        isPro: false,
        icon: "Users",
        category: "Debt",
      },
      {
        id: "lesson-20",
        title: "Reconstruindo Seu Crédito",
        description: "Como recuperar uma boa pontuação de crédito",
        duration: "15 min",
        xpReward: 190,
        isCompleted: false,
        isLocked: false,
        isPro: false,
        icon: "CheckCircle",
        category: "Debt",
      },
    ],
  },
];

// Helper function to get user by email
export function getUserByEmail(email: string) {
  return mockUsers.get(email);
}

// Helper function to verify password
export function verifyPassword(email: string, password: string): boolean {
  const user = mockUsers.get(email);
  return user ? user.password === password : false;
}

// Helper function to create JWT token (simple mock)
export function createMockToken(userId: string, email: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64url"
  );
  const payload = Buffer.from(
    JSON.stringify({ userId, email, iat: Date.now(), exp: Date.now() + 24 * 60 * 60 * 1000 })
  ).toString("base64url");
  const signature = Buffer.from("mock-signature").toString("base64url");
  return `${header}.${payload}.${signature}`;
}

// Helper to get user from token (mock)
export function verifyMockToken(token: string): { userId: string; email: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}
