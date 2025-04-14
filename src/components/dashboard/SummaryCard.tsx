
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  amount: number;
  formattedAmount: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'income' | 'expense' | 'savings';
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  formattedAmount,
  trend,
  trendValue,
  icon,
  variant = 'default',
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'income':
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
      case 'expense':
        return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
      case 'savings':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getIconClass = () => {
    switch (variant) {
      case 'income':
        return 'bg-green-100 text-green-700';
      case 'expense':
        return 'bg-red-100 text-red-700';
      case 'savings':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrendClass = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className={cn("border stat-card", getVariantClass())}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{formattedAmount}</h3>
            
            {trend && trendValue && (
              <div className={cn("flex items-center mt-2 text-xs font-medium", getTrendClass())}>
                {trend === 'up' ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : trend === 'down' ? (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                ) : null}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          
          <div className={cn("p-2 rounded-full", getIconClass())}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
