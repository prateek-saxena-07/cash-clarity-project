
import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { 
  getTotalExpenses, 
  getTotalIncome, 
  getNetIncome, 
  formatCurrency,
  generateInsights
} from '@/utils/financeUtils';
import { WalletIcon, TrendingUpIcon, TrendingDownIcon, DollarSignIcon } from 'lucide-react';
import SummaryCard from '@/components/dashboard/SummaryCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import MonthlyExpensesChart from '@/components/charts/MonthlyExpensesChart';
import InsightsList from '@/components/dashboard/InsightsList';

const Dashboard = () => {
  const { transactions, budgets } = useFinance();
  
  // Calculate summary data
  const totalExpenses = getTotalExpenses(transactions);
  const totalIncome = getTotalIncome(transactions);
  const netIncome = getNetIncome(transactions);
  
  // Generate insights
  const insights = generateInsights(transactions, budgets);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          formattedAmount={formatCurrency(totalIncome)}
          icon={<TrendingUpIcon className="h-5 w-5" />}
          variant="income"
        />
        
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          formattedAmount={formatCurrency(totalExpenses)}
          icon={<TrendingDownIcon className="h-5 w-5" />}
          variant="expense"
        />
        
        <SummaryCard
          title="Net Income"
          amount={netIncome}
          formattedAmount={formatCurrency(netIncome)}
          trend={netIncome >= 0 ? 'up' : 'down'}
          trendValue={netIncome >= 0 ? 'Positive Balance' : 'Negative Balance'}
          icon={<WalletIcon className="h-5 w-5" />}
          variant={netIncome >= 0 ? 'savings' : 'expense'}
        />
        
        <SummaryCard
          title="Saving Rate"
          amount={totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0}
          formattedAmount={totalIncome > 0 ? `${((netIncome / totalIncome) * 100).toFixed(1)}%` : '0%'}
          icon={<DollarSignIcon className="h-5 w-5" />}
          variant="savings"
        />
      </div>
      
      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyExpensesChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />
      </div>
      
      {/* Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={transactions} />
        <div className="space-y-6">
          <BudgetProgress 
            budgets={budgets} 
            transactions={transactions} 
          />
          <InsightsList insights={insights} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
