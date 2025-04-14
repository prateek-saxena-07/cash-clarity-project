
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, Budget } from '@/types';
import { getBudgetVsActual, formatCurrency } from '@/utils/financeUtils';

interface BudgetComparisonChartProps {
  transactions: Transaction[];
  budgets: Budget[];
  title?: string;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-blue-600">{`Budget: ${formatCurrency(payload[0].value || 0)}`}</p>
        <p className="text-sm text-orange-500">{`Spent: ${formatCurrency(payload[1]?.value || 0)}`}</p>
        <hr className="my-1" />
        {payload[1]?.value > payload[0].value ? (
          <p className="text-sm text-red-500">
            {`Over budget by ${formatCurrency(payload[1].value - payload[0].value)}`}
          </p>
        ) : (
          <p className="text-sm text-green-500">
            {`Remaining: ${formatCurrency(payload[0].value - (payload[1]?.value || 0))}`}
          </p>
        )}
      </div>
    );
  }

  return null;
};

const BudgetComparisonChart: React.FC<BudgetComparisonChartProps> = ({
  transactions,
  budgets,
  title = "Budget vs. Actual",
  height = 400
}) => {
  const budgetVsActual = getBudgetVsActual(transactions, budgets);
  
  const data = Object.entries(budgetVsActual).map(([category, values]) => ({
    name: category,
    budget: values.budgeted,
    actual: values.actual,
    isOverBudget: values.actual > values.budgeted
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex justify-center items-center h-[400px]">
            <p className="text-muted-foreground">No budget data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              barSize={20}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ strokeWidth: 0.5 }}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ strokeWidth: 0.5 }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="budget" name="Budget" fill="#3B82F6" />
              <Bar 
                dataKey="actual" 
                name="Actual" 
                fill="#F59E0B">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isOverBudget ? '#EF4444' : '#F59E0B'} />
                ))}
              </Bar>
              <ReferenceLine 
                y={0} 
                stroke="#666" 
                strokeWidth={1} 
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetComparisonChart;
