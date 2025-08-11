"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Banknote } from 'lucide-react';

interface BreakdownCardProps {
  totalSent: number;
  totalReceived: number;
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

export function BreakdownCard({ totalSent, totalReceived }: BreakdownCardProps) {
    const remainingAmount = totalSent - totalReceived;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center gap-2 p-2 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2">
                <ArrowUp className="h-5 w-5 text-primary"/>
                <span className="font-semibold text-sm">You Sent</span>
            </div>
            <span className="text-lg font-bold">{formatCurrency(totalSent)}</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-2 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5 text-accent"/>
                <span className="font-semibold text-sm">You Received</span>
            </div>
            <span className="text-lg font-bold">{formatCurrency(totalReceived)}</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-2 bg-secondary/30 rounded-lg">
             <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-primary"/>
                <span className="font-semibold text-sm">Balance</span>
            </div>
            <span className={`text-lg font-bold ${remainingAmount >= 0 ? 'text-primary' : 'text-accent'}`}>
                {remainingAmount > 0 ? '+ ' : ''}{formatCurrency(remainingAmount)}
            </span>
        </div>
      </CardContent>
    </Card>
  );
}
