'use server';

/**
 * @fileOverview A Genkit flow for generating a funny, romantic, or flirty message for a transaction.
 *
 * - generateFunnyMessage - Generates a message based on the transaction details.
 * - GenerateFunnyMessageInput - The input type for the generateFunnyMessage function.
 * - GenerateFunnyMessageOutput - The return type for the generateFunnyMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateFunnyMessageInputSchema = z.object({
  sender: z.string().describe("The person who sent the money."),
  amount: z.number().describe("The amount of the transaction."),
  description: z.string().describe("The description of the transaction."),
});

export type GenerateFunnyMessageInput = z.infer<typeof GenerateFunnyMessageInputSchema>;

const GenerateFunnyMessageOutputSchema = z.object({
  message: z.string().describe("A single, short message that is flirty, funny, humorous, or darkly romantic."),
});
export type GenerateFunnyMessageOutput = z.infer<typeof GenerateFunnyMessageOutputSchema>;

export async function generateFunnyMessage(input: GenerateFunnyMessageInput): Promise<GenerateFunnyMessageOutput> {
    return generateFunnyMessageFlow(input);
}

const prompt = ai.definePrompt({
    name: "generateFunnyMessagePrompt",
    input: { schema: GenerateFunnyMessageInputSchema },
    output: { schema: GenerateFunnyMessageOutputSchema },
    prompt: `You are an AI assistant that creates short, witty messages for financial transactions between two people, Meruputhiga and Pikachu. The tone should be a mix of flirty, funny, humorous, and darkly romantic.

Generate a single message for the following transaction:
- Sender: {{{sender}}}
- Amount: ₹{{{amount}}}
- For: {{{description}}}

The message should be from the perspective of the app, commenting on the transaction. It should be just one sentence.
`,
});

const generateFunnyMessageFlow = ai.defineFlow(
    {
        name: "generateFunnyMessageFlow",
        inputSchema: GenerateFunnyMessageInputSchema,
        outputSchema: GenerateFunnyMessageOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
