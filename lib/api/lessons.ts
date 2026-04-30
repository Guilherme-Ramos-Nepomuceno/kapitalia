import { api } from "../api";
import type { Lesson, Trail } from "../types/api";

export interface CompleteLessonRequest {
  lessonId: string;
  answers?: Record<string, any>; // For quiz answers if applicable
}

export interface CompleteLessonResponse {
  success: boolean;
  xpGained: number;
  coinsGained: number;
  newLevel?: number;
}

export const lessonsApi = {
  /**
   * Get all available trails
   */
  getTrails: (): Promise<Trail[]> => {
    return api.get("/lessons/trails");
  },

  /**
   * Get specific trail with lessons
   */
  getTrail: (trailId: string): Promise<Trail> => {
    return api.get(`/lessons/trails/${trailId}`);
  },

  /**
   * Get lesson details
   */
  getLesson: (lessonId: string): Promise<Lesson> => {
    return api.get(`/lessons/${lessonId}`);
  },

  /**
   * Mark lesson as completed
   */
  completeLesson: (data: CompleteLessonRequest): Promise<CompleteLessonResponse> => {
    return api.post("/lessons/complete", data);
  },

  /**
   * Get user's progress on lessons
   */
  getProgress: (): Promise<{
    completedLessons: string[];
    currentStreak: number;
    totalXp: number;
  }> => {
    return api.get("/lessons/progress");
  },

  /**
   * Start lesson (mark as in progress)
   */
  startLesson: (lessonId: string): Promise<{ success: boolean }> => {
    return api.post(`/lessons/${lessonId}/start`);
  },
};