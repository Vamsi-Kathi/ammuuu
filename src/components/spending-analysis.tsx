"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from '@/types';
import { analyzeSpending, AnalyzeSpendingInput } from '@/ai/flows/analyze-spending';
import { Bot, AlertTriangle } from "lucide-react";

type TransactionWithDate = Omit<Transaction, 'timestamp'> & { timestamp: Date };

interface SpendingAnalysisProps {
  transactions: TransactionWithDate[];
}

export function SpendingAnalysis({ transactions }: SpendingAnalysisProps) {
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAnalyzeSpending = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    const input: AnalyzeSpendingInput = transactions.map(t => ({ description: t.description }));

    try {
      const result = await analyzeSpending(input);
      setSummary(result.summary);
    } catch (e) {
      setError("Something went wrong. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Bot className="h-6 w-6" />
          AI Summary
        </CardTitle>
        <CardDescription>
          Let AI tell you where your money is going.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleAnalyzeSpending} 
          disabled={isLoading || transactions.length === 0}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? 'Thinking...' : 'Generate Summary'}
        </Button>
        
        {isLoading && (
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {summary && (
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-secondary-foreground">{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
