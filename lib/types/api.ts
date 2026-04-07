import { z } from "zod";

// Re-export schemas and types from page.tsx for now
// TODO: Move these to a centralized types file

export interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  isPro: boolean
  totalCoins: number
  joinedAt?: string
}

export interface OnboardingData {
  name: string
  age: "16-18" | "19-21" | "22-24" | "25+"
  goal: "poupar" | "investir" | "sair_dividas" | "independencia"
  experience: "nenhuma" | "basica" | "intermediaria" | "avancada"
}

export interface Lesson {
  id: string
  title: string
  description: string
  content?: string
  activityContent?: string
  duration: string
  xpReward: number
  isCompleted: boolean
  isLocked: boolean
  isPro: boolean
  icon: string
  category: string
}

export interface Trail {
  id: string
  title: string
  description: string
  icon: string
  color: string
  isPro: boolean
  totalLessons: number
  completedLessons: number
  lessons: Lesson[]
}

export interface DashboardData {
  user: User
  lessons: Lesson[]
  currentLesson: Lesson | null
  weeklyProgress: number
  trails: Trail[]
}