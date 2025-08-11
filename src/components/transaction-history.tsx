"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Transaction } from "@/types";
import { History, ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

type TransactionWithDate = Omit<Transaction, 'timestamp'> & { timestamp: Date };

interface TransactionHistoryProps {
  transactions: TransactionWithDate[];
  currentUser: 'Meruputhiga' | 'Pikachu';
  onDelete: (id: string) => void;
  onEdit: (transaction: TransactionWithDate) => void;
  isLoading: boolean;
}

const formatCurrency = (amount: number) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return formatted.replace('₹', '₹ ');
};

const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(date);
};

const TransactionItem = ({ 
  transaction, 
  sent,
  onDelete,
  onEdit,
  showActions
}: { 
  transaction: TransactionWithDate, 
  sent: boolean,
  onDelete: (id: string) => void,
  onEdit: (transaction: TransactionWithDate) => void,
  showActions: boolean
}) => (
    <div className="flex items-start gap-4 p-4 bg-card rounded-lg border">
        <div className="flex-grow">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-card-foreground">{transaction.description}</p>
                <p className={`font-bold ${sent ? 'text-primary' : 'text-accent'}`}>{formatCurrency(transaction.amount)}</p>
            </div>
            <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground/70">
                    {formatDateTime(transaction.timestamp)}
                </p>
                {showActions && (
                  <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(transaction)}>
                          <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(transaction.id)}>
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </div>
                )}
            </div>
        </div>
    </div>
);

const HistorySkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-16 w-full" />
    <Skeleton className="h-16 w-full" />
    <Skeleton className="h-16 w-full" />
    <Skeleton className="h-16 w-full" />
  </div>
);


export function TransactionHistory({ transactions, currentUser, onDelete, onEdit, isLoading }: TransactionHistoryProps) {
  const [style, setStyle] = useState<'first' | 'second'>('second');
  
  const sortedTransactions = [...transactions].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const sentTransactions = sortedTransactions.filter(t => t.sender === currentUser);
  const receivedTransactions = sortedTransactions.filter(t => t.sender !== currentUser);
  
  const now = new Date();
  const EDIT_WINDOW_MS = 3 * 60 * 1000; // 3 minutes

  const canPerformAction = (timestamp: Date) => {
    return now.getTime() - timestamp.getTime() < EDIT_WINDOW_MS;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline flex items-center gap-2">
                <History className="h-6 w-6" />
                History
            </CardTitle>
            <Tabs defaultValue={style} onValueChange={(value) => setStyle(value as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="first">Style 1</TabsTrigger>
                <TabsTrigger value="second">Style 2</TabsTrigger>
              </TabsList>
            </Tabs>
        </div>
        <CardDescription>A list of all your money transfers. You can edit or delete within 3 minutes.</CardDescription>
      </CardHeader>
        <div className="flex-grow min-h-0">
        {isLoading ? (
          <CardContent>
            <HistorySkeleton />
          </CardContent>
        ) : style === 'first' ? (
            <CardContent className="h-full">
                <ScrollArea className="h-full pr-4">
                {sortedTransactions.length > 0 ? (
                    <div className="space-y-4">
                    {sortedTransactions.map((transaction) => (
                        <TransactionItem 
                          key={transaction.id} 
                          transaction={transaction} 
                          sent={transaction.sender === currentUser}
                          onDelete={onDelete}
                          onEdit={onEdit}
                          showActions={canPerformAction(transaction.timestamp)}
                        />
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                    <p>No expenses yet.</p>
                    <p className="text-sm">Add one using the form!</p>
                    </div>
                )}
                </ScrollArea>
            </CardContent>
        ) : ( // style === 'second'
            <CardContent className="h-full">
                <div className="grid grid-cols-2 gap-x-4 h-full">
                    {/* Sent Column */}
                    <div className="flex flex-col h-full min-h-0">
                        <h3 className="text-lg font-semibold mb-2 text-center text-primary flex items-center justify-center gap-2 shrink-0">
                          <ArrowUp className="h-5 w-5" />
                          You Sent
                        </h3>
                        <Separator className="shrink-0"/>
                        <ScrollArea className="flex-grow mt-2 pr-2">
                            {sentTransactions.length > 0 ? (
                                <div className="space-y-2">
                                    {sentTransactions.map(t => (
                                      <div key={t.id} className="p-3 bg-card rounded-lg border text-sm relative group">
                                        <div className="flex justify-between font-bold text-primary">
                                          <span>{formatCurrency(t.amount)}</span>
                                        </div>
                                        <p className="text-muted-foreground truncate">{t.description}</p>
                                        <p className="text-xs text-muted-foreground/70">
                                          {formatDateTime(t.timestamp)}
                                        </p>
                                        {canPerformAction(t.timestamp) && (
                                            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(t)}>
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(t.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                            </div>
                                        )}
                                      </div>
                                    ))}
                                </div>
                            ) : <p className="text-center text-muted-foreground pt-4 text-xs">Nothing sent yet.</p>}
                        </ScrollArea>
                    </div>
                     {/* Received Column */}
                     <div className="flex flex-col h-full min-h-0">
                        <h3 className="text-lg font-semibold mb-2 text-center text-accent flex items-center justify-center gap-2 shrink-0">
                          <ArrowDown className="h-5 w-5" />
                          You Received
                        </h3>
                        <Separator className="shrink-0" />
                        <ScrollArea className="flex-grow mt-2 pr-2">
                             {receivedTransactions.length > 0 ? (
                                <div className="space-y-2">
                                    {receivedTransactions.map(t => (
                                      <div key={t.id} className="p-3 bg-card rounded-lg border text-sm relative group">
                                         <div className="flex justify-between font-bold text-accent">
                                          <span>{formatCurrency(t.amount)}</span>
                                        </div>
                                        <p className="text-muted-foreground truncate">{t.description}</p>
                                        <p className="text-xs text-muted-foreground/70">
                                          {formatDateTime(t.timestamp)}
                                        </p>
                                      </div>
                                    ))}
                                </div>
                            ) : <p className="text-center text-muted-foreground pt-4 text-xs">Nothing received yet.</p>}
                        </ScrollArea>
                    </div>
                </div>
            </CardContent>
        )}
        </div>
    </Card>
  );
}
