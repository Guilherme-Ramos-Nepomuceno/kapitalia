/**
 * API Modules Index
 *
 * This file exports all API modules and utilities for easy importing.
 */

// Base API utilities
export { fetchApi, api, ApiError, API_CONFIG } from "../api";

// API Modules
export { authApi } from "./auth";
export { dashboardApi } from "./dashboard";
export { lessonsApi } from "./lessons";
export { financialApi } from "./financial";

// Types
export type {
  User,
  OnboardingData,
  Lesson,
  Trail,
  DashboardData,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ExpenseCategory,
  Transaction,
  Investment,
  FinancialData,
  CompleteLessonRequest,
  CompleteLessonResponse,
} from "../types/api";