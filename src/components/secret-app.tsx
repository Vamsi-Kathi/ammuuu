"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Transaction } from '@/types';
import { TransactionForm } from '@/components/transaction-form';
import { BreakdownCard } from '@/components/breakdown-card';
import { TransactionHistory } from '@/components/transaction-history';
import { SpendingAnalysis } from '@/components/spending-analysis';
import { SettlementCard } from '@/components/settlement-card';
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Edit, Trash2 } from 'lucide-react';
import { generateFunnyMessage } from '@/ai/flows/generate-funny-message';
import Link from 'next/link';
import { Button } from './ui/button';
import { Home } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { getTransactions, updateTransactions } from '@/services/transaction-service';

interface SecretAppProps {
  currentUser: 'Meruputhiga' | 'Pikachu';
}

export default function SecretApp({ currentUser }: SecretAppProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    // No need to set loading to true here, to allow for silent background refreshes
    try {
      const fetchedTransactions = await getTransactions();
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast({
        title: "Error",
        description: "Could not load transactions. Please try again later.",
        variant: "destructive",
      });
    } finally {
        if (isLoading) {
            setIsLoading(false);
        }
    }
  }, [toast, isLoading]);

  useEffect(() => {
    setIsClient(true);
    fetchTransactions();
    
    // Set up polling to refresh data every 3 seconds
    const intervalId = setInterval(() => {
        fetchTransactions();
    }, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchTransactions]);

  const handleAddTransaction = async (newTransactionData: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...newTransactionData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    const currentTransactions = transactions;
    const optimisticNewTransactions = [newTransaction, ...currentTransactions];
    setTransactions(optimisticNewTransactions);

    // First, save the transaction.
    try {
      await updateTransactions(optimisticNewTransactions);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-bold">Transaction Saved!</span>
          </div>
        ),
        description: "Your expense has been logged.",
      });
       // Immediately fetch to get latest state for all clients
      await fetchTransactions(); 
    } catch (error) {
       setTransactions(currentTransactions); // Revert optimistic update
       toast({
        title: "Error",
        description: `Failed to add transaction. Please try again.`,
        variant: 'destructive',
      });
       return; // Stop if saving fails
    }

    // Then, separately, generate the funny message.
    try {
      const { message } = await generateFunnyMessage({
        ...newTransactionData,
        amount: newTransactionData.amount,
      });
      toast({
        title: "P.S.",
        description: message,
      });
    } catch (aiError) {
      // If the AI fails, we don't need to show an error.
      // The main transaction was already saved.
      console.error("AI message generation failed:", aiError);
    }
  };


  const handleDeleteTransaction = async () => {
    if (transactionToDelete) {
      const originalTransactions = transactions;
      const newTransactions = originalTransactions.filter(t => t.id !== transactionToDelete);
      setTransactions(newTransactions);
      setTransactionToDelete(null);

      try {
        await updateTransactions(newTransactions);
        toast({
          title: "Transaction Deleted",
          description: "The transaction has been successfully removed.",
        });
        await fetchTransactions(); // Refresh data
      } catch (error) {
        setTransactions(originalTransactions); // Revert
        toast({
          title: "Error",
          description: "Failed to delete transaction. Please try again.",
          variant: 'destructive',
        });
      }
    }
  };

  const handleEditTransaction = async (updatedTransaction: Transaction) => {
    const originalTransactions = transactions;
    const newTransactions = originalTransactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
    setTransactions(newTransactions);
    setTransactionToEdit(null);

    try {
      await updateTransactions(newTransactions);
       toast({
        title: "Transaction Updated",
        description: "Your changes have been saved.",
      });
       await fetchTransactions(); // Refresh data
    } catch (error) {
        setTransactions(originalTransactions); // Revert
        toast({
          title: "Error",
          description: "Failed to update transaction. Please try again.",
          variant: 'destructive',
        });
    }
  };

  const { totalSent, totalReceived, balance } = useMemo(() => {
    const sent = transactions
      .filter(t => t.sender === currentUser)
      .reduce((sum, t) => sum + t.amount, 0);

    const received = transactions
      .filter(t => t.sender !== currentUser)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const meruputhigaSent = transactions
      .filter(t => t.sender === 'Meruputhiga')
      .reduce((sum, t) => sum + t.amount, 0);

    const pikachuSent = transactions
      .filter(t => t.sender === 'Pikachu')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = meruputhigaSent - pikachuSent;
    
    const currentUserBalance = currentUser === 'Meruputhiga' ? netBalance : -netBalance;

    return { totalSent: sent, totalReceived: received, balance: currentUserBalance };
  }, [transactions, currentUser]);
  
  const transactionsWithDateObjects = useMemo(() => {
    return transactions.map(t => ({
      ...t,
      timestamp: new Date(t.timestamp)
    }));
  }, [transactions]);


  return (
    <div className="container mx-auto p-4 md:p-8 font-body">
      <header className="text-center mb-12 relative">
        <Link href="/" passHref className="absolute left-0 top-1/2 -translate-y-1/2">
           <Button variant="ghost">
            <Home className="mr-2 h-4 w-4" />
            Change User
           </Button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Secret</h1>
        <p className="text-muted-foreground mt-2 text-lg">{currentUser}'s Page</p>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <TransactionForm onAddTransaction={handleAddTransaction} currentUser={currentUser}/>
          {isClient && !isLoading && (
            <>
              <BreakdownCard totalSent={totalSent} totalReceived={totalReceived} />
              <SettlementCard balance={balance} currentUser={currentUser} />
              <SpendingAnalysis transactions={transactionsWithDateObjects} />
            </>
          )}
        </div>
        <div className="lg:col-span-2">
           {isClient && (
            <TransactionHistory 
              transactions={transactionsWithDateObjects} 
              currentUser={currentUser}
              onDelete={setTransactionToDelete}
              onEdit={setTransactionToEdit}
              isLoading={isLoading}
            />
           )}
        </div>
      </main>

       <AlertDialog open={!!transactionToDelete} onOpenChange={() => setTransactionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTransaction}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditTransactionDialog
        transaction={transactionToEdit}
        onOpenChange={() => setTransactionToEdit(null)}
        onSave={handleEditTransaction}
      />

    </div>
  );
}


function EditTransactionDialog({
  transaction,
  onOpenChange,
  onSave,
}: {
  transaction: Transaction | null;
  onOpenChange: (open: boolean) => void;
  onSave: (transaction: Transaction) => void;
}) {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount);
      setDescription(transaction.description);
    }
  }, [transaction]);

  const handleSave = () => {
    if (transaction) {
      onSave({ ...transaction, amount, description });
    }
  };
  
  return (
     <Dialog open={!!transaction} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Make changes to your transaction here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (₹)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
