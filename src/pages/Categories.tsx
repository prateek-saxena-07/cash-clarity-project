
import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, groupExpensesByCategory } from '@/utils/financeUtils';
import { Category, categoryColors } from '@/types';

const Categories = () => {
  const { transactions } = useFinance();
  
  // Get expenses by category
  const expensesByCategory = groupExpensesByCategory(transactions);
  
  // Calculate total expenses
  const totalExpenses = Object.values(expensesByCategory).reduce(
    (total, amount) => total + amount,
    0
  );
  
  // Transform data for the table
  const categoryData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category: category as Category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount); // Sort by amount (highest first)
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Category Breakdown</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoryPieChart 
            transactions={transactions} 
            height={400}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Category Summary</CardTitle>
            <CardDescription>
              Your spending by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    categoryData.map((category) => (
                      <TableRow key={category.category}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: categoryColors[category.category] }}
                            />
                            <span className="font-medium">{category.category}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(category.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {category.percentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Categories;
