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
  message: z.string().describe("A single, short message that is flirty, funny, and romantic, as if a boy (Pikachu) is speaking to a girl (Meruputhiga)."),
});
export type GenerateFunnyMessageOutput = z.infer<typeof GenerateFunnyMessageOutputSchema>;

export async function generateFunnyMessage(input: GenerateFunnyMessageInput): Promise<GenerateFunnyMessageOutput> {
    return generateFunnyMessageFlow(input);
}

const prompt = ai.definePrompt({
    name: "generateFunnyMessagePrompt",
    input: { schema: GenerateFunnyMessageInputSchema },
    output: { schema: GenerateFunnyMessageOutputSchema },
    prompt: `You are an AI assistant that creates short, witty messages for financial transactions between a boy, Pikachu, and a girl. The tone should be simple, efficient, flirty, and romantic, as if Pikachu is speaking directly to the girl. Each message must be new and unique.

Generate a single message for the following transaction, from the perspective of the app commenting on the couple's interaction:
- Sender: {{{sender}}}
- Amount: ₹{{{amount}}}
- For: {{{description}}}

The message should be just one sentence.
Example if Pikachu sends money: "Looks like someone's trying to win your heart, one rupee at a time."
Example if Meruputhiga sends money: "She's paying, so you're on dish duty tonight, buddy."
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
