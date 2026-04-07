/**
 * API Modules Index
 *
 * This file exports all API modules and utilities for easy importing.
 */

// Base API utilities
export { fetchApi, api, ApiError, API_CONFIG } from "../api";

// API Modules
export { authApi } from "./api/auth";
export { dashboardApi } from "./api/dashboard";
export { lessonsApi } from "./api/lessons";
export { financialApi } from "./api/financial";

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