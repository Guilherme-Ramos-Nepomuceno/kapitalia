import { api } from "../api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    streak: number;
    isPro: boolean;
    totalCoins: number;
  };
  token: string;
}

export const authApi = {
  /**
   * Login user with email and password
   */
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api.post("/auth/login", credentials);
  },

  /**
   * Register new user
   */
  register: (data: RegisterData): Promise<AuthResponse> => {
    return api.post("/auth/register", data);
  },

  /**
   * Logout user (client-side only, server might handle token invalidation)
   */
  logout: (): Promise<{ success: boolean }> => {
    return api.post("/auth/logout");
  },

  /**
   * Refresh authentication token
   */
  refreshToken: (): Promise<{ token: string }> => {
    return api.post("/auth/refresh");
  },

  /**
   * Get current user profile
   */
  getProfile: (): Promise<AuthResponse["user"]> => {
    return api.get("/auth/profile");
  },
};