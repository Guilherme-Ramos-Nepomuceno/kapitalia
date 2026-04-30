import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// ============================================
// Types
// ============================================

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

export interface AuthCredentials {
  email: string
  password: string
  name?: string
}

export interface OnboardingData {
  age: "16-18" | "19-21" | "22-24" | "25+"
  goal: "poupar" | "investir" | "sair_dividas" | "independencia"
  experience: "nenhuma" | "basica" | "intermediaria" | "avancada"
}

export interface Lesson {
  id: string
  title: string
  description: string
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

export interface ExpenseCategory {
  id: string
  name: string
  budgeted: number
  spent: number
  color: string
}

export interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
  type: "income" | "expense"
}

export interface Investment {
  id: string
  name: string
  type: "tesouro" | "acao" | "fii" | "cripto" | "cdb"
  invested: number
  currentValue: number
  lastUpdate: string
}

// ============================================
// Store State Interface
// ============================================

interface AppState {
  // Theme
  theme: "light" | "dark"
  
  // Auth Data
  isLoggedIn: boolean
  authEmail: string | null
  authPassword: string | null // In production, use proper hashing
  
  // User Data
  user: User | null
  isOnboarded: boolean
  onboardingData: OnboardingData | null

  // Progress Data
  completedLessons: Set<string>

  // Financial Tools Data
  monthlyIncome: number
  expenses: ExpenseCategory[]
  transactions: Transaction[]
  investments: Investment[]
  emergencyFundGoal: number
  emergencyFundCurrent: number

  // App State
  currentStreak: number
  lastActivityDate: string | null
  totalXpEarned: number

  // Actions - Theme
  setTheme: (theme: "light" | "dark") => void
  toggleTheme: () => void
  
  // Actions - Auth
  login: (email: string, password: string) => boolean
  register: (email: string, password: string, name: string) => boolean
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  
  // Actions - User
  setUser: (user: User) => void
  updateUserXp: (xp: number) => void
  upgradeToProDemo: () => void
  
  // Actions - Onboarding
  completeOnboarding: (data: OnboardingData) => void
  
  // Actions - Lessons
  completeLesson: (lessonId: string, xpReward: number) => void
  isLessonCompleted: (lessonId: string) => boolean

  // Actions - Financial Tools
  setMonthlyIncome: (income: number) => void
  addExpenseCategory: (category: ExpenseCategory) => void
  updateExpenseCategory: (id: string, updates: Partial<ExpenseCategory>) => void
  addTransaction: (transaction: Transaction) => void
  addInvestment: (investment: Investment) => void
  updateInvestment: (id: string, updates: Partial<Investment>) => void
  setEmergencyFund: (goal: number, current: number) => void
  
  // Actions - Streak
  updateStreak: () => void
  
  // Actions - Reset
  resetStore: () => void
}

// ============================================
// Initial State
// ============================================

const initialState = {
  theme: "dark" as "light" | "dark",
  isLoggedIn: false,
  authEmail: null as string | null,
  authPassword: null as string | null,
  user: null,
  isOnboarded: false,
  onboardingData: null,
  completedLessons: new Set<string>(),
  monthlyIncome: 0,
  expenses: [] as ExpenseCategory[],
  transactions: [] as Transaction[],
  investments: [] as Investment[],
  emergencyFundGoal: 0,
  emergencyFundCurrent: 0,
  currentStreak: 0,
  lastActivityDate: null,
  totalXpEarned: 0,
}

// ============================================
// Custom Storage for Sets
// ============================================

const setToArray = (set: Set<string> | string[] | undefined | null): string[] => {
  if (!set) return []
  if (Array.isArray(set)) return set
  if (set instanceof Set) return Array.from(set)
  return []
}

const arrayToSet = (arr: string[] | Set<string> | undefined | null): Set<string> => {
  if (!arr) return new Set()
  if (arr instanceof Set) return arr
  if (Array.isArray(arr)) return new Set(arr)
  return new Set()
}

const normalizeSet = (value: Set<string> | string[] | undefined | null): Set<string> =>
  arrayToSet(value)

const normalizePersistedSets = <T extends Record<string, unknown>>(state: T) => ({
  ...state,
  completedLessons: normalizeSet(state.completedLessons as string[] | Set<string> | undefined | null),
})

const customStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      const str = localStorage.getItem(name)
      if (!str) return null
      const parsed = JSON.parse(str)
      
      // Convert arrays back to Sets safely
      if (parsed?.state) {
        parsed.state = normalizePersistedSets(parsed.state)
      }
      return JSON.stringify(parsed)
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    if (typeof window === "undefined") return
    try {
      // Try to parse, if fails just store as-is
      let parsed: Record<string, unknown>
      try {
        parsed = JSON.parse(value)
      } catch {
        localStorage.setItem(name, value)
        return
      }
      
      // If no parsed object or no state, store as-is
      if (!parsed || typeof parsed !== "object" || !parsed.state) {
        localStorage.setItem(name, value)
        return
      }
      
      const state = parsed.state as Record<string, unknown>
      if (!state || typeof state !== "object") {
        localStorage.setItem(name, value)
        return
      }
      
      // Safely serialize Sets to Arrays
      const serialized = {
        ...parsed,
        state: {
          ...state,
          completedLessons: state.completedLessons ? setToArray(state.completedLessons as Set<string> | string[]) : [],
        },
      }
      localStorage.setItem(name, JSON.stringify(serialized))
    } catch {
      // Silently fail if storage is full or unavailable
      try {
        localStorage.setItem(name, value)
      } catch {
        // Give up
      }
    }
  },
  removeItem: (name: string) => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(name)
    } catch {
      // Silently fail
    }
  },
}

// ============================================
// Zustand Store with Persistence
// ============================================

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Theme Actions
      setTheme: (theme) => {
        set({ theme })
        if (typeof window !== "undefined") {
          document.documentElement.classList.remove("light", "dark")
          document.documentElement.classList.add(theme)
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === "dark" ? "light" : "dark"
        set({ theme: newTheme })
        if (typeof window !== "undefined") {
          document.documentElement.classList.remove("light", "dark")
          document.documentElement.classList.add(newTheme)
        }
      },

      // Auth Actions
      login: (email, password) => {
        const state = get()
        // Check if credentials match stored ones
        if (state.authEmail === email && state.authPassword === password) {
          set({ isLoggedIn: true })
          return true
        }
        return false
      },

      register: (email, password, name) => {
        set({
          isLoggedIn: true,
          authEmail: email,
          authPassword: password,
          isOnboarded: false,
          user: {
            id: `user-${Date.now()}`,
            name,
            email,
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            streak: 0,
            isPro: false,
            totalCoins: 0,
            joinedAt: new Date().toISOString(),
          },
        })
        return true
      },

      logout: () => {
        set({
          isLoggedIn: false,
          // Keep credentials so user can log back in
        })
      },

      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
          authEmail: updates.email || state.authEmail,
        })),

      // User Actions
      setUser: (user) => set({ user }),

      updateUserXp: (xp) =>
        set((state) => {
          if (!state.user) return state
          const newXp = state.user.xp + xp
          const newTotalXp = state.totalXpEarned + xp
          
          // Check for level up
          if (newXp >= state.user.xpToNextLevel) {
            return {
              user: {
                ...state.user,
                xp: newXp - state.user.xpToNextLevel,
                level: state.user.level + 1,
                xpToNextLevel: Math.floor(state.user.xpToNextLevel * 1.5),
              },
              totalXpEarned: newTotalXp,
            }
          }
          
          return {
            user: { ...state.user, xp: newXp },
            totalXpEarned: newTotalXp,
          }
        }),

      upgradeToProDemo: () =>
        set((state) => {
          if (!state.user) return state
          return { user: { ...state.user, isPro: true } }
        }),

      // Onboarding Actions
      completeOnboarding: (data) =>
        set((state) => ({
          isOnboarded: true,
          onboardingData: data,
          user: state.user 
            ? { ...state.user } // Keep existing user (from registration)
            : {
                id: `user-${Date.now()}`,
                name: "Estudante",
                level: 1,
                xp: 0,
                xpToNextLevel: 100,
                streak: 0,
                isPro: false,
                totalCoins: 0,
              },
        })),

      // Lesson Actions
      completeLesson: (lessonId, xpReward) =>
        set((state) => {
          const newCompleted = arrayToSet(state.completedLessons)
          if (newCompleted.has(lessonId)) return state
          
          newCompleted.add(lessonId)
          
          // Update XP
          const newXp = (state.user?.xp || 0) + xpReward
          const newTotalXp = state.totalXpEarned + xpReward
          
          let updatedUser = state.user
          if (state.user) {
            if (newXp >= state.user.xpToNextLevel) {
              updatedUser = {
                ...state.user,
                xp: newXp - state.user.xpToNextLevel,
                level: state.user.level + 1,
                xpToNextLevel: Math.floor(state.user.xpToNextLevel * 1.5),
                totalCoins: state.user.totalCoins + Math.floor(xpReward / 10),
              }
            } else {
              updatedUser = {
                ...state.user,
                xp: newXp,
                totalCoins: state.user.totalCoins + Math.floor(xpReward / 10),
              }
            }
          }
          
          return {
            completedLessons: newCompleted,
            user: updatedUser,
            totalXpEarned: newTotalXp,
          }
        }),

      isLessonCompleted: (lessonId) => normalizeSet(get().completedLessons).has(lessonId),

      // Financial Tools Actions
      setMonthlyIncome: (income) => set({ monthlyIncome: income }),

      addExpenseCategory: (category) =>
        set((state) => ({
          expenses: [...state.expenses, category],
        })),

      updateExpenseCategory: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        })),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions].slice(0, 100), // Keep last 100
        })),

      addInvestment: (investment) =>
        set((state) => ({
          investments: [...state.investments, investment],
        })),

      updateInvestment: (id, updates) =>
        set((state) => ({
          investments: state.investments.map((inv) =>
            inv.id === id ? { ...inv, ...updates } : inv
          ),
        })),

      setEmergencyFund: (goal, current) =>
        set({ emergencyFundGoal: goal, emergencyFundCurrent: current }),

      // Streak Actions
      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split("T")[0]
          const lastDate = state.lastActivityDate
          
          if (lastDate === today) {
            return state // Already updated today
          }
          
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split("T")[0]
          
          if (lastDate === yesterdayStr) {
            // Consecutive day
            const newStreak = state.currentStreak + 1
            return {
              currentStreak: newStreak,
              lastActivityDate: today,
              user: state.user
                ? { ...state.user, streak: newStreak }
                : null,
            }
          }
          
          // Streak broken, start new
          return {
            currentStreak: 1,
            lastActivityDate: today,
            user: state.user ? { ...state.user, streak: 1 } : null,
          }
        }),

      // Reset
      resetStore: () => set(initialState),
    }),
    {
      name: "finz-app-storage",
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        theme: state.theme,
        isLoggedIn: state.isLoggedIn,
        authEmail: state.authEmail,
        authPassword: state.authPassword,
        user: state.user,
        isOnboarded: state.isOnboarded,
        onboardingData: state.onboardingData,
        completedLessons: state.completedLessons,
        monthlyIncome: state.monthlyIncome,
        expenses: state.expenses,
        transactions: state.transactions,
        investments: state.investments,
        emergencyFundGoal: state.emergencyFundGoal,
        emergencyFundCurrent: state.emergencyFundCurrent,
        currentStreak: state.currentStreak,
        lastActivityDate: state.lastActivityDate,
        totalXpEarned: state.totalXpEarned,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        return normalizePersistedSets(state as unknown as Record<string, unknown>)
      },
    }
  )
)
