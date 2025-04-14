
import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import MonthlyExpensesChart from '@/components/charts/MonthlyExpensesChart';
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
import { formatCurrency, groupTransactionsByMonth, getTotalExpenses, getTotalIncome } from '@/utils/financeUtils';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const MonthlyExpenses = () => {
  const { transactions } = useFinance();
  
  // Group transactions by month
  const groupedTransactions = groupTransactionsByMonth(transactions);
  
  // Transform data for the table
  const monthlyData = Object.entries(groupedTransactions)
    .map(([monthYear, transactions]) => {
      const [year, month] = monthYear.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      const monthName = date.toLocaleString('default', { month: 'long' });
      const formattedDate = `${monthName} ${year}`;
      
      const income = getTotalIncome(transactions);
      const expenses = getTotalExpenses(transactions);
      const netIncome = income - expenses;
      
      return {
        monthYear,
        formattedDate,
        income,
        expenses,
        netIncome,
      };
    })
    .sort((a, b) => b.monthYear.localeCompare(a.monthYear)); // Sort by month (newest first)
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Monthly Expenses</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyExpensesChart 
            transactions={transactions} 
            height={400}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
            <CardDescription>
              Your income and expenses by month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Income</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    monthlyData.map((month) => (
                      <TableRow key={month.monthYear}>
                        <TableCell className="font-medium">
                          {month.formattedDate}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(month.income)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(month.expenses)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className={cn(
                            "flex items-center justify-end",
                            month.netIncome >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {month.netIncome >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            {formatCurrency(Math.abs(month.netIncome))}
                          </div>
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

export default MonthlyExpenses;
