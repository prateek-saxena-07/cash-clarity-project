import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, TransactionFormData, Budget, BudgetFormData, CATEGORIES, Category } from '@/types';
import { toast } from '@/components/ui/sonner';
import { v4 as uuidv4 } from 'uuid';

// Define the context type
interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (data: TransactionFormData) => void;
  updateTransaction: (id: string, data: TransactionFormData) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (data: BudgetFormData) => void;
  updateBudget: (category: Category, amount: number) => void;
  deleteBudget: (category: Category) => void;
}

// Create the context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Sample transactions for demonstration
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    amount: 1200,
    date: new Date('2023-01-05'),
    description: 'Monthly Rent',
    category: 'Housing',
    type: 'expense',
  },
  {
    id: '2',
    amount: 150,
    date: new Date('2023-01-10'),
    description: 'Grocery Shopping',
    category: 'Food',
    type: 'expense',
  },
  {
    id: '3',
    amount: 80,
    date: new Date('2023-01-15'),
    description: 'Electric Bill',
    category: 'Utilities',
    type: 'expense',
  },
  {
    id: '4',
    amount: 3500,
    date: new Date('2023-01-01'),
    description: 'Salary',
    category: 'Income',
    type: 'income',
  },
  {
    id: '5',
    amount: 200,
    date: new Date('2023-01-20'),
    description: 'Dinner with friends',
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: '6',
    amount: 1200,
    date: new Date('2023-02-05'),
    description: 'Monthly Rent',
    category: 'Housing',
    type: 'expense',
  },
  {
    id: '7',
    amount: 130,
    date: new Date('2023-02-12'),
    description: 'Grocery Shopping',
    category: 'Food',
    type: 'expense',
  },
  {
    id: '8',
    amount: 3500,
    date: new Date('2023-02-01'),
    description: 'Salary',
    category: 'Income',
    type: 'income',
  },
  {
    id: '9',
    amount: 50,
    date: new Date('2023-02-18'),
    description: 'Movie night',
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: '10',
    amount: 400,
    date: new Date('2023-02-22'),
    description: 'New laptop accessory',
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: '11',
    amount: 1200,
    date: new Date('2023-03-05'),
    description: 'Monthly Rent',
    category: 'Housing',
    type: 'expense',
  },
  {
    id: '12',
    amount: 3500,
    date: new Date('2023-03-01'),
    description: 'Salary',
    category: 'Income',
    type: 'income',
  },
];

// Sample budgets for demonstration
const sampleBudgets: Budget[] = [
  { category: 'Housing', amount: 1500 },
  { category: 'Food', amount: 500 },
  { category: 'Transportation', amount: 300 },
  { category: 'Utilities', amount: 200 },
  { category: 'Entertainment', amount: 300 },
  { category: 'Shopping', amount: 400 },
];

// Context provider component
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);
  
  // Load data from localStorage on initial load
  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem('transactions');
      const storedBudgets = localStorage.getItem('budgets');
      
      if (storedTransactions) {
        // Need to convert date strings back to Date objects
        const parsedTransactions = JSON.parse(storedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }));
        setTransactions(parsedTransactions);
      }
      
      if (storedBudgets) {
        setBudgets(JSON.parse(storedBudgets));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // If error loading from localStorage, use sample data
      setTransactions(sampleTransactions);
      setBudgets(sampleBudgets);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
      localStorage.setItem('budgets', JSON.stringify(budgets));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [transactions, budgets]);
  
  // Add a new transaction
  const addTransaction = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      ...data,
      id: uuidv4(),
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    toast.success('Transaction added successfully');
  };
  
  // Update an existing transaction
  const updateTransaction = (id: string, data: TransactionFormData) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id ? { ...data, id } : transaction
      )
    );
    toast.success('Transaction updated successfully');
  };
  
  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    toast.success('Transaction deleted successfully');
  };
  
  // Add a new budget
  const addBudget = (data: BudgetFormData) => {
    // Check if budget for this category already exists
    const existingBudget = budgets.find(b => b.category === data.category);
    
    if (existingBudget) {
      // If budget exists, update it
      updateBudget(data.category, data.amount);
    } else {
      // Otherwise, add new budget
      setBudgets(prev => [...prev, data]);
      toast.success('Budget added successfully');
    }
  };
  
  // Update an existing budget
  const updateBudget = (category: Category, amount: number) => {
    setBudgets(prev => 
      prev.map(budget => 
        budget.category === category ? { ...budget, amount } : budget
      )
    );
    toast.success('Budget updated successfully');
  };
  
  // Delete a budget
  const deleteBudget = (category: Category) => {
    setBudgets(prev => prev.filter(budget => budget.category !== category));
    toast.success('Budget deleted successfully');
  };
  
  // Context value
  const value = {
    transactions,
    budgets,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
  };
  
  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  
  return context;
};
