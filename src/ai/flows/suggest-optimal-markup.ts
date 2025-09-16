'use server';

/**
 * @fileOverview Suggests an optimal markup percentage based on market data.
 *
 * - suggestOptimalMarkup - A function that suggests the optimal markup percentage.
 * - SuggestOptimalMarkupInput - The input type for the suggestOptimalMarkup function.
 * - SuggestOptimalMarkupOutput - The return type for the suggestOptimalMarkup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalMarkupInputSchema = z.object({
  costPrice: z.number().describe('The cost price of the stainless steel item.'),
  currentMarkup: z.number().describe('The current markup percentage being used.'),
  itemDescription: z.string().describe('A description of the stainless steel item.'),
});
export type SuggestOptimalMarkupInput = z.infer<typeof SuggestOptimalMarkupInputSchema>;

const SuggestOptimalMarkupOutputSchema = z.object({
  suggestedMarkup: z.number().describe('The suggested optimal markup percentage.'),
  reasoning: z.string().describe('The reasoning behind the suggested markup.'),
});
export type SuggestOptimalMarkupOutput = z.infer<typeof SuggestOptimalMarkupOutputSchema>;

export async function suggestOptimalMarkup(input: SuggestOptimalMarkupInput): Promise<SuggestOptimalMarkupOutput> {
  return suggestOptimalMarkupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalMarkupPrompt',
  input: {schema: SuggestOptimalMarkupInputSchema},
  output: {schema: SuggestOptimalMarkupOutputSchema},
  prompt: `You are an expert pricing strategist specializing in stainless steel products.

  Given the following information, suggest an optimal markup percentage to maximize profit while remaining competitive in the market.

  Cost Price: {{{costPrice}}}
  Current Markup: {{{currentMarkup}}}
  Item Description: {{{itemDescription}}}

  Consider market conditions, demand, and competitor pricing.

  Provide a suggested markup percentage and reasoning for your suggestion.
  `,
});

const suggestOptimalMarkupFlow = ai.defineFlow(
  {
    name: 'suggestOptimalMarkupFlow',
    inputSchema: SuggestOptimalMarkupInputSchema,
    outputSchema: SuggestOptimalMarkupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
