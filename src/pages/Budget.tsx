import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Category, Budget as BudgetType } from '@/types';
import { PlusIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import BudgetForm from '@/components/budgets/BudgetForm';
import BudgetComparisonChart from '@/components/charts/BudgetComparisonChart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, getBudgetVsActual } from '@/utils/financeUtils';
import { cn } from '@/lib/utils';

const Budget = () => {
  const { transactions, budgets, addBudget, updateBudget, deleteBudget } = useFinance();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<BudgetType | undefined>(undefined);
  
  const handleAddClick = () => {
    setCurrentBudget(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditClick = (budget: BudgetType) => {
    setCurrentBudget(budget);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (category: Category) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(category);
    }
  };
  
  const handleFormSubmit = (data: any) => {
    if (currentBudget) {
      updateBudget(data.category, data.amount);
    } else {
      addBudget(data);
    }
    setIsFormOpen(false);
  };
  
  const handleFormCancel = () => {
    setIsFormOpen(false);
  };
  
  const budgetVsActual = getBudgetVsActual(transactions, budgets);
  
  const existingCategories = budgets.map(budget => budget.category);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold">Budget</h1>
        <Button onClick={handleAddClick} className="w-full sm:w-auto">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BudgetComparisonChart 
            transactions={transactions} 
            budgets={budgets} 
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>
              Your monthly budget allocations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No budgets set yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    budgets.map((budget) => (
                      <TableRow key={budget.category}>
                        <TableCell className="font-medium">
                          {budget.category}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(budget.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditClick(budget)}
                            >
                              <Edit2Icon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(budget.category)}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Budget Status</CardTitle>
          <CardDescription>
            Your spending progress against each budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No budgets set yet
            </p>
          ) : (
            <div className="space-y-8">
              {Object.entries(budgetVsActual).map(([category, data]) => {
                const { budgeted, actual, remaining } = data;
                const percentage = (actual / budgeted) * 100;
                const isOverBudget = remaining < 0;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{category}</h3>
                      <div className="text-sm">
                        <span className={isOverBudget ? "text-red-600" : ""}>
                          {formatCurrency(actual)}
                        </span>
                        {" of "}
                        <span>{formatCurrency(budgeted)}</span>
                      </div>
                    </div>
                    
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={cn(
                        "h-2",
                        isOverBudget ? "bg-red-100" : "bg-gray-100"
                      )}
                      indicatorClassName={cn(
                        isOverBudget ? "bg-red-500" : 
                        percentage > 80 ? "bg-amber-500" : 
                        "bg-green-500"
                      )} 
                    />
                    
                    <div className="flex justify-between text-sm">
                      <div className={cn(
                        isOverBudget ? "text-red-600" : "text-green-600"
                      )}>
                        {isOverBudget 
                          ? `Over by ${formatCurrency(Math.abs(remaining))}` 
                          : `${formatCurrency(remaining)} remaining`
                        }
                      </div>
                      <div className="text-muted-foreground">
                        {Math.round(percentage)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentBudget ? 'Edit Budget' : 'Add Budget'}
            </DialogTitle>
          </DialogHeader>
          <BudgetForm
            budget={currentBudget}
            existingCategories={existingCategories}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Budget;
