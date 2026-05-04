import { api } from "../api";

export type FinancialType = "INCOME" | "EXPENSE" | "INVESTMENT";

export interface FinancialRecord {
  id: string;
  userId?: string;
  type: FinancialType;
  amount: number;
  category: string;
  date: string;
}

export type CreateFinancialRecordData = Omit<FinancialRecord, "id" | "userId" | "date"> & { date?: string };

export const financialApi = {
  /**
   * Create a new financial record (Income, Expense, or Investment)
   */
  createRecord: (data: CreateFinancialRecordData): Promise<FinancialRecord> => {
    return api.post("/financial/records", data);
  },

  /**
   * Get all financial records for the user
   */
  getRecords: (): Promise<FinancialRecord[]> => {
    return api.get("/financial/records");
  },
};