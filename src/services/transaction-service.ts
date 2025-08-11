'use server';

import type { Transaction } from '@/types';
import { createClient } from '@vercel/kv';

const TRANSACTIONS_KEY = 'transactions';

// This is the correct way to initialize the client on Vercel.
// It automatically finds the connected KV store's environment variables.
const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});


const initialTransactions: Transaction[] = [
  {
    id: '1',
    sender: 'Meruputhiga',
    amount: 2550,
    description: 'Groceries',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    sender: 'Meruputhiga',
    amount: 1100,
    description: 'Dinner',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    sender: 'Meruputhiga',
    amount: 5000,
    description: 'Concert tickets',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    sender: 'Pikachu',
    amount: 600,
    description: 'Movie night',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    sender: 'Pikachu',
    amount: 400,
    description: 'Coffee date',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];


const isVercelKvConfigured = () => {
    return process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
}

export async function getTransactions(): Promise<Transaction[]> {
    if (!isVercelKvConfigured()) {
        console.warn("Vercel KV environment variables not set. Using initial mock data. Data will not be persisted online.");
        return Promise.resolve(initialTransactions);
    }

    try {
        let transactions = await kv.get<Transaction[]>(TRANSACTIONS_KEY);
        
        if (!transactions) {
            await kv.set(TRANSACTIONS_KEY, initialTransactions);
            transactions = initialTransactions;
        }

        return transactions;
    } catch (error) {
        console.error("Error fetching from Vercel KV:", error);
        return initialTransactions;
    }
}

export async function updateTransactions(transactions: Transaction[]): Promise<void> {
    if (!isVercelKvConfigured()) {
        console.warn("Vercel KV environment variables not set. Skipping persistence.");
        return Promise.resolve();
    }
    try {
        await kv.set(TRANSACTIONS_KEY, transactions);
    } catch (error) {
        console.error("Error updating Vercel KV:", error);
        throw error;
    }
}
