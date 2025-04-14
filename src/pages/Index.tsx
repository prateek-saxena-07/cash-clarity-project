
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, PieChartIcon, BarChartIcon, DollarSignIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
        <DollarSignIcon className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-finance-blue to-finance-teal">
          Personal Finance Visualizer
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Track, analyze, and optimize your personal finances with beautiful visualizations
        </p>
        <Button onClick={() => navigate('/dashboard')} size="lg" className="mr-4">
          Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
        <Card className="card-hover">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <BarChartIcon className="h-6 w-6 text-finance-blue" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Transactions</h3>
            <p className="text-gray-500">
              Easily record your income and expenses with detailed categorization
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <PieChartIcon className="h-6 w-6 text-finance-teal" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Visualize Spending</h3>
            <p className="text-gray-500">
              See where your money goes with intuitive charts and breakdowns
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <DollarSignIcon className="h-6 w-6 text-finance-green" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Budget Wisely</h3>
            <p className="text-gray-500">
              Set budgets for different categories and track your progress
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
