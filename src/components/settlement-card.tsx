"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale } from 'lucide-react';

interface SettlementCardProps {
  balance: number;
  currentUser: 'Meruputhiga' | 'Pikachu';
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

export function SettlementCard({ balance, currentUser }: SettlementCardProps) {
  let message;
  const otherUser = currentUser === 'Meruputhiga' ? 'Pikachu' : 'Meruputhiga';
  
  if (balance > 0) {
    message = `${otherUser} owes you ${formatCurrency(balance)}.`;
  } else if (balance < 0) {
    message = `You owe ${otherUser} ${formatCurrency(Math.abs(balance))}.`;
  } else {
    message = "You are all even!";
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-headline">Who Owes Who</CardTitle>
        <Scale className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          This is the net balance of all transactions.
        </p>
      </CardContent>
    </Card>
  );
}
