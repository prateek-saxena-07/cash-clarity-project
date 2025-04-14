
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  // Function to clear all data from local storage
  const handleClearData = () => {
    if (
      confirm(
        'Are you sure you want to clear all your financial data? This action cannot be undone.'
      )
    ) {
      localStorage.removeItem('transactions');
      localStorage.removeItem('budgets');
      alert('All data has been cleared. Please refresh the page.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Application Settings
          </CardTitle>
          <CardDescription>
            Configure your Finance Tracker settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Management</h3>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Clearing your data will remove all transactions and budgets. This action cannot be undone.
              </AlertDescription>
            </Alert>
            <Button variant="destructive" onClick={handleClearData}>
              Clear All Data
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">About</h3>
            <p className="text-muted-foreground">
              Personal Finance Tracker - Version 1.0.0
            </p>
            <p className="text-sm text-muted-foreground">
              This application helps you track your personal finances, manage budgets, and visualize your spending patterns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
