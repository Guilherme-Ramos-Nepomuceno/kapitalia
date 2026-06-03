import { z } from "zod"

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  avatar: z.string().url().optional(),
  level: z.number().min(1),
  xp: z.number().min(0),
  xpToNextLevel: z.number().min(1),
  streak: z.number().min(0),
  isPro: z.boolean(),
  totalCoins: z.number().min(0),
  joinedAt: z.string().optional(),
})

export const OnboardingSchema = z.object({
  age: z.enum(["16-18", "19-21", "22-24", "25+"]),
  goal: z.enum(["poupar", "investir", "sair_dividas", "independencia"]),
  experience: z.enum(["none", "beginner", "intermediate", "advanced"]),
})

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string().optional(),
  activityContent: z.string().optional(),
  duration: z.string().optional(),
  xpReward: z.number(),
  isCompleted: z.boolean().optional().default(false),
  isLocked: z.boolean().optional().default(false),
  isPro: z.boolean().optional().default(false),
  icon: z.string().optional(),
  category: z.string().optional(),
  tips: z.array(z.string()).optional(),
  order: z.number().optional(),
  completed: z.boolean().optional(),
})

export const TrailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  color: z.string(),
  isPro: z.boolean(),
  totalLessons: z.number(),
  completedLessons: z.number(),
  lessons: z.array(LessonSchema),
})

export const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  preContent: z.string().optional(),
  options: z.array(z.string()),
  correctIndex: z.number(),
})

export const DashboardDataSchema = z.object({
  user: UserSchema,
  lessons: z.array(LessonSchema),
  currentLesson: LessonSchema.nullable(),
  weeklyProgress: z.number(),
  trails: z.array(TrailSchema),
})

export type AppUser = z.infer<typeof UserSchema>
export type OnboardingData = z.infer<typeof OnboardingSchema>
export type Lesson = z.infer<typeof LessonSchema>
export type Trail = z.infer<typeof TrailSchema>
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>
export type DashboardData = z.infer<typeof DashboardDataSchema>
