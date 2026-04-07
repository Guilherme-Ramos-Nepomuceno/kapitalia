import { api } from "../api";
import type { DashboardData, OnboardingData } from "../types/api";

export const dashboardApi = {
  /**
   * Fetch dashboard data for the authenticated user
   */
  getDashboard: (): Promise<DashboardData> => {
    return api.get("/dashboard");
  },

  /**
   * Submit onboarding data
   */
  submitOnboarding: (data: OnboardingData): Promise<{ success: boolean }> => {
    return api.post("/onboarding", data);
  },

  /**
   * Update user profile
   */
  updateProfile: (updates: Partial<DashboardData["user"]>): Promise<DashboardData["user"]> => {
    return api.patch("/user/profile", updates);
  },
};