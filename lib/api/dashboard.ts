import { api } from "../api";
import type { DashboardData } from "../types/api";

export const dashboardApi = {
  /**
   * Fetch dashboard data for the authenticated user
   */
  getDashboard: (): Promise<DashboardData> => {
    return api.get("/dashboard");
  },

  /**
   * Update user profile
   */
  updateProfile: (updates: Partial<DashboardData["user"]>): Promise<DashboardData["user"]> => {
    return api.patch("/user/profile", updates);
  },
};