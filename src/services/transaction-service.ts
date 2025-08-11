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
    amount: 500,
    description: 'Coffee date',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    sender: 'Pikachu',
    amount: 1200,
    description: 'Movie tickets',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    sender: 'Meruputhiga',
    amount: 850,
    description: 'Dinner',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];


const isVercelKvConfigured = () => {
    return process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
}

export async function getTransactions(): Promise<Transaction[]> {
    if (!isVercelKvConfigured()) {
        console.warn("Vercel KV environment variables not set. Using initial mock data. Data will not be persisted online.");
        // We'll use a mock store in-memory for local dev if KV is not set up.
        // For the purpose of this demo, we'll just return the initial data.
        return Promise.resolve(initialTransactions);
    }

    try {
        let transactions = await kv.get<Transaction[]>(TRANSACTIONS_KEY);
        
        // This will reset the data on Vercel to our clean initial state if it's empty.
        if (!transactions || transactions.length === 0) {
            await kv.set(TRANSACTIONS_KEY, initialTransactions);
            transactions = initialTransactions;
        }

        return transactions;
    } catch (error) {
        console.error("Error fetching from Vercel KV:", error);
        // Fallback to initial data if there's an error connecting.
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
