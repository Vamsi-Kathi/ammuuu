"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/types";
import { PlusCircle } from 'lucide-react';

const formSchema = z.object({
  sender: z.enum(["Meruputhiga", "Pikachu"]),
  amount: z.coerce.number().min(0.01, {
    message: "Amount must be greater than 0.",
  }),
  description: z.string().optional(),
});

interface TransactionFormProps {
  onAddTransaction: (data: Omit<Transaction, 'id' | 'timestamp'>) => void;
  currentUser: 'Meruputhiga' | 'Pikachu';
}

export function TransactionForm({ onAddTransaction, currentUser }: TransactionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender: currentUser,
      amount: 0,
      description: "",
    },
  });

  React.useEffect(() => {
    form.reset({ sender: currentUser, amount: 0, description: "" });
  }, [currentUser, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddTransaction({
      ...values,
      description: values.description || 'belief'
    });
    form.reset({ sender: currentUser, amount: 0, description: "" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <PlusCircle className="h-6 w-6"/>
          Add Expense
        </CardTitle>
        <CardDescription>Enter a new expense.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What was it for? (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dinner, movie tickets" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Add Expense</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
