import { api } from "../api";

export interface ExpenseCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
}

export interface Investment {
  id: string;
  name: string;
  type: "tesouro" | "acao" | "fii" | "cripto" | "cdb";
  invested: number;
  currentValue: number;
  lastUpdate: string;
}

export interface FinancialData {
  monthlyIncome: number;
  expenses: ExpenseCategory[];
  transactions: Transaction[];
  investments: Investment[];
  emergencyFundGoal: number;
  emergencyFundCurrent: number;
}

export const financialApi = {
  /**
   * Get user's financial data
   */
  getFinancialData: (): Promise<FinancialData> => {
    return api.get("/financial");
  },

  /**
   * Update monthly income
   */
  updateMonthlyIncome: (income: number): Promise<{ success: boolean }> => {
    return api.patch("/financial/income", { monthlyIncome: income });
  },

  /**
   * Add expense category
   */
  addExpenseCategory: (category: Omit<ExpenseCategory, "id">): Promise<ExpenseCategory> => {
    return api.post("/financial/expenses", category);
  },

  /**
   * Update expense category
   */
  updateExpenseCategory: (id: string, updates: Partial<ExpenseCategory>): Promise<ExpenseCategory> => {
    return api.patch(`/financial/expenses/${id}`, updates);
  },

  /**
   * Delete expense category
   */
  deleteExpenseCategory: (id: string): Promise<{ success: boolean }> => {
    return api.delete(`/financial/expenses/${id}`);
  },

  /**
   * Add transaction
   */
  addTransaction: (transaction: Omit<Transaction, "id">): Promise<Transaction> => {
    return api.post("/financial/transactions", transaction);
  },

  /**
   * Get transactions with pagination
   */
  getTransactions: (page = 1, limit = 50): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
  }> => {
    return api.get(`/financial/transactions?page=${page}&limit=${limit}`);
  },

  /**
   * Add investment
   */
  addInvestment: (investment: Omit<Investment, "id">): Promise<Investment> => {
    return api.post("/financial/investments", investment);
  },

  /**
   * Update investment
   */
  updateInvestment: (id: string, updates: Partial<Investment>): Promise<Investment> => {
    return api.patch(`/financial/investments/${id}`, updates);
  },

  /**
   * Delete investment
   */
  deleteInvestment: (id: string): Promise<{ success: boolean }> => {
    return api.delete(`/financial/investments/${id}`);
  },

  /**
   * Update emergency fund
   */
  updateEmergencyFund: (goal: number, current: number): Promise<{ success: boolean }> => {
    return api.patch("/financial/emergency-fund", { goal, current });
  },

  /**
   * Get financial insights/analytics
   */
  getInsights: (): Promise<{
    monthlyExpenses: number;
    monthlySavings: number;
    investmentGrowth: number;
    budgetUtilization: number;
  }> => {
    return api.get("/financial/insights");
  },
};