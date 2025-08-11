'use server';

/**
 * @fileOverview This file contains the Genkit flow for analyzing spending patterns.
 *
 * - analyzeSpending - Analyzes spending reasons and categorizes them using NLP.
 * - AnalyzeSpendingInput - The input type for the analyzeSpending function.
 * - AnalyzeSpendingOutput - The return type for the analyzeSpending function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSpendingInputSchema = z.array(
  z.object({
    description: z.string().describe('The description of the transaction.'),
  })
);
export type AnalyzeSpendingInput = z.infer<typeof AnalyzeSpendingInputSchema>;

const AnalyzeSpendingOutputSchema = z.object({
  summary: z.string().describe('A summary of the most frequent spending reasons, categorized using natural language processing.'),
});
export type AnalyzeSpendingOutput = z.infer<typeof AnalyzeSpendingOutputSchema>;

export async function analyzeSpending(input: AnalyzeSpendingInput): Promise<AnalyzeSpendingOutput> {
  return analyzeSpendingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSpendingPrompt',
  input: {schema: AnalyzeSpendingInputSchema},
  output: {schema: AnalyzeSpendingOutputSchema},
  prompt: `You are an AI assistant helping Meruputhiga analyze their spending habits.

  You are provided with a list of transaction descriptions. Your task is to summarize the most frequent spending reasons and categorize them using natural language processing.

  Transaction Descriptions:
  {{#each this}}
  - {{{description}}}
  {{/each}}
  `,
});

const analyzeSpendingFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingFlow',
    inputSchema: AnalyzeSpendingInputSchema,
    outputSchema: AnalyzeSpendingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
