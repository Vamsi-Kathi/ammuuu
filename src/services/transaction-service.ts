'use server';

import type { Transaction } from '@/types';
import { createClient } from '@vercel/kv';

const TRANSACTIONS_KEY = 'transactions';

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


const checkEnv = () => {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
        console.warn("Vercel KV environment variables not set. Using initial mock data. Data will not be persisted online.");
        return false;
    }
    return true;
}

export async function getTransactions(): Promise<Transaction[]> {
    if (!checkEnv()) {
        return Promise.resolve(initialTransactions);
    }
    try {
        let transactions = await kv.get<Transaction[]>(TRANSACTIONS_KEY);
        
        if (!transactions) {
            // If no data, seed with initial data
            await kv.set(TRANSACTIONS_KEY, initialTransactions);
            transactions = initialTransactions;
        }

        return transactions;
    } catch (error) {
        console.error("Error fetching from Vercel KV:", error);
        // Fallback to initial data on error to prevent app crash
        return initialTransactions;
    }
}

export async function updateTransactions(transactions: Transaction[]): Promise<void> {
    if (!checkEnv()) {
        // In local/demo mode without env keys, we don't persist.
        return Promise.resolve();
    }
    try {
        await kv.set(TRANSACTIONS_KEY, transactions);
    } catch (error) {
        console.error("Error updating Vercel KV:", error);
        throw error; // Re-throwing allows the caller to handle the error (e.g., show a toast)
    }
}
