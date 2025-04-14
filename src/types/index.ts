
export type Category = 
  | "Housing"
  | "Food"
  | "Transportation" 
  | "Utilities"
  | "Healthcare"
  | "Insurance"
  | "Entertainment"
  | "Shopping"
  | "Personal"
  | "Education"
  | "Travel"
  | "Debt"
  | "Savings"
  | "Investments"
  | "Income"
  | "Other";

export const CATEGORIES: Category[] = [
  "Housing",
  "Food",
  "Transportation",
  "Utilities",
  "Healthcare",
  "Insurance", 
  "Entertainment",
  "Shopping",
  "Personal",
  "Education",
  "Travel",
  "Debt",
  "Savings",
  "Investments",
  "Income",
  "Other"
];

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category: Category;
  type: "expense" | "income";
}

export interface Budget {
  category: Category;
  amount: number;
}

export interface TransactionFormData {
  amount: number;
  date: Date;
  description: string;
  category: Category;
  type: "expense" | "income";
}

export interface BudgetFormData {
  category: Category;
  amount: number;
}

export const categoryColors: Record<Category, string> = {
  Housing: "#1E40AF",
  Food: "#3B82F6",
  Transportation: "#0D9488", 
  Utilities: "#14B8A6",
  Healthcare: "#10B981",
  Insurance: "#34D399",
  Entertainment: "#A855F7",
  Shopping: "#EC4899",
  Personal: "#F59E0B",
  Education: "#F97316",
  Travel: "#6366F1",
  Debt: "#EF4444",
  Savings: "#22C55E",
  Investments: "#84CC16",
  Income: "#22C55E",
  Other: "#6B7280"
};
