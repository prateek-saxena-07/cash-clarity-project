
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Budget, Transaction, Category } from '@/types';
import { formatCurrency, groupExpensesByCategory } from '@/utils/financeUtils';
import { cn } from '@/lib/utils';

interface BudgetProgressProps {
  budgets: Budget[];
  transactions: Transaction[];
  limit?: number;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ 
  budgets, 
  transactions,
  limit = 4
}) => {
  // Get expenses by category
  const expensesByCategory = groupExpensesByCategory(transactions);
  
  // Calculate budget progress
  const budgetProgress = budgets
    .map(budget => {
      const spent = expensesByCategory[budget.category] || 0;
      const percentage = (spent / budget.amount) * 100;
      const remaining = budget.amount - spent;
      
      return {
        category: budget.category,
        budget: budget.amount,
        spent,
        percentage: Math.min(percentage, 100), // Cap at 100%
        remaining,
        isOverBudget: percentage > 100
      };
    })
    .sort((a, b) => b.percentage - a.percentage) // Sort by percentage (highest first)
    .slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {budgetProgress.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No budgets set yet</p>
        ) : (
          <div className="space-y-5">
            {budgetProgress.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{item.category}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(item.spent)} of {formatCurrency(item.budget)}
                  </div>
                </div>
                <Progress 
                  value={item.percentage} 
                  className={cn(
                    "h-2",
                    item.isOverBudget ? "bg-red-100" : "bg-gray-100"
                  )}
                  indicatorClassName={cn(
                    item.isOverBudget ? "bg-red-500" : 
                    item.percentage > 80 ? "bg-amber-500" : 
                    "bg-green-500"
                  )} 
                />
                <div className="flex justify-between text-xs">
                  <div className={cn(
                    item.isOverBudget ? "text-red-600" : "text-green-600",
                    "font-medium"
                  )}>
                    {item.isOverBudget 
                      ? `Over budget by ${formatCurrency(Math.abs(item.remaining))}` 
                      : `${formatCurrency(item.remaining)} remaining`
                    }
                  </div>
                  <div className="text-muted-foreground">
                    {Math.round(item.percentage)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
