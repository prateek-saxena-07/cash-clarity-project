
import { Transaction, Category, Budget } from "@/types";

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

// Get total expenses for a given period
export const getTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Get total income for a given period
export const getTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Get net income (income - expenses)
export const getNetIncome = (transactions: Transaction[]): number => {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
};

// Group transactions by month
export const groupTransactionsByMonth = (transactions: Transaction[]): Record<string, Transaction[]> => {
  const grouped: Record<string, Transaction[]> = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    
    grouped[monthYear].push(transaction);
  });
  
  return grouped;
};

// Group expenses by category
export const groupExpensesByCategory = (transactions: Transaction[]): Record<Category, number> => {
  const grouped: Partial<Record<Category, number>> = {};
  
  transactions
    .filter(transaction => transaction.type === 'expense')
    .forEach(transaction => {
      const { category, amount } = transaction;
      grouped[category] = (grouped[category] || 0) + amount;
    });
  
  return grouped as Record<Category, number>;
};

// Calculate budget vs actual expenses
export const getBudgetVsActual = (
  transactions: Transaction[], 
  budgets: Budget[]
): Record<Category, { budgeted: number; actual: number; remaining: number }> => {
  const expensesByCategory = groupExpensesByCategory(transactions);
  const result: Record<Category, { budgeted: number; actual: number; remaining: number }> = {} as any;
  
  budgets.forEach(budget => {
    const actual = expensesByCategory[budget.category] || 0;
    result[budget.category] = {
      budgeted: budget.amount,
      actual,
      remaining: budget.amount - actual
    };
  });
  
  return result;
};

// Get monthly expense data for chart
export const getMonthlyExpenseData = (transactions: Transaction[]): Array<{ name: string; amount: number }> => {
  const grouped = groupTransactionsByMonth(transactions);
  const sortedMonths = Object.keys(grouped).sort();
  
  return sortedMonths.map(month => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    return {
      name: `${monthName} ${year}`,
      amount: getTotalExpenses(grouped[month])
    };
  });
};

// Get category expense data for pie chart
export const getCategoryExpenseData = (transactions: Transaction[]): Array<{ name: string; value: number }> => {
  const expensesByCategory = groupExpensesByCategory(transactions);
  
  return Object.entries(expensesByCategory)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category,
      value: amount
    }));
};

// Generate insights based on spending patterns
export const generateInsights = (
  transactions: Transaction[],
  budgets: Budget[]
): string[] => {
  const insights: string[] = [];
  const totalExpenses = getTotalExpenses(transactions);
  const totalIncome = getTotalIncome(transactions);
  const expensesByCategory = groupExpensesByCategory(transactions);
  const budgetVsActual = getBudgetVsActual(transactions, budgets);
  
  // Income vs Expenses
  if (totalExpenses > totalIncome) {
    insights.push(`Your expenses ($${totalExpenses.toFixed(2)}) exceed your income ($${totalIncome.toFixed(2)}). Consider reducing spending.`);
  } else if (totalIncome > 0) {
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    insights.push(`You're saving ${savingsRate.toFixed(1)}% of your income. ${savingsRate < 20 ? 'Consider increasing your savings rate to 20% or more.' : 'Great job!'}`);
  }
  
  // Budget overruns
  Object.entries(budgetVsActual).forEach(([category, { budgeted, actual, remaining }]) => {
    if (remaining < 0) {
      insights.push(`You've exceeded your ${category} budget by ${formatCurrency(Math.abs(remaining))}.`);
    } else if (budgeted > 0 && (remaining / budgeted) < 0.1) {
      insights.push(`Your ${category} budget is nearly depleted with ${formatCurrency(remaining)} remaining.`);
    }
  });
  
  // Highest expense category
  const entries = Object.entries(expensesByCategory);
  if (entries.length > 0) {
    const [topCategory, topAmount] = entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    
    if (topAmount > 0) {
      const percentOfTotal = (topAmount / totalExpenses) * 100;
      insights.push(`${topCategory} is your highest expense category at ${formatCurrency(topAmount)} (${percentOfTotal.toFixed(1)}% of total expenses).`);
    }
  }
  
  return insights;
};
