
import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Transaction } from '@/types';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TransactionTable from '@/components/transactions/TransactionTable';
import TransactionForm from '@/components/transactions/TransactionForm';

const Transactions = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | undefined>(undefined);
  
  const handleAddClick = () => {
    setCurrentTransaction(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditClick = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };
  
  const handleFormSubmit = (data: any) => {
    if (currentTransaction) {
      updateTransaction(currentTransaction.id, data);
    } else {
      addTransaction(data);
    }
    setIsFormOpen(false);
  };
  
  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={handleAddClick} className="w-full sm:w-auto">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>
      
      <TransactionTable
        transactions={transactions}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {currentTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={currentTransaction}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
