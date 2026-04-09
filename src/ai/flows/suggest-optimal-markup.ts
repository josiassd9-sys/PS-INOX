/**
 * @fileOverview Suggests a markup percentage based on the item's cost price.
 *
 * - suggestOptimalMarkup - A function that suggests a markup percentage.
 * - SuggestOptimalMarkupInput - The input type for the suggestOptimalMarkup function.
 * - SuggestOptimalMarkupOutput - The return type for the suggestOptimalMarkup function.
 */

import { z } from 'zod';

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

/**
 * Suggests a markup percentage based on a tiered-pricing strategy determined by the cost price.
 * This local logic replaces the external AI call.
 *
 * @param input The input data containing the item's cost price.
 * @returns A promise that resolves to the suggested markup and reasoning.
 */
export async function suggestOptimalMarkup(input: SuggestOptimalMarkupInput): Promise<SuggestOptimalMarkupOutput> {
  let suggestedMarkup: number;
  let reasoning: string;

  // Tiered-pricing logic based on cost price.
  if (input.costPrice < 100) {
    suggestedMarkup = 50;
    reasoning = `Para itens de baixo custo (abaixo de R$100), uma margem de ${suggestedMarkup}% é sugerida para maximizar a rentabilidade em produtos de maior giro.`
  } else if (input.costPrice >= 100 && input.costPrice <= 1000) {
    suggestedMarkup = 35;
    reasoning = `Para itens de custo médio (entre R$100 e R$1000), uma margem de ${suggestedMarkup}% oferece um bom equilíbrio entre competitividade e lucratividade.`
  } else {
    suggestedMarkup = 25;
    reasoning = `Para itens de alto custo (acima de R$1000), uma margem mais competitiva de ${suggestedMarkup}% é recomendada para atrair clientes em compras de maior valor.`
  }

  // Add a comparison to the user's current markup.
  if (input.currentMarkup > suggestedMarkup) {
    reasoning += ` Sua margem atual de ${input.currentMarkup}% é superior à sugerida, o que pode impactar a competitividade.`
  } else if (input.currentMarkup < suggestedMarkup) {
    reasoning += ` Sua margem atual de ${input.currentMarkup}% é inferior à sugerida. Há potencial para aumentar a lucratividade.`
  } else {
    reasoning += ` Sua margem atual de ${input.currentMarkup}% está alinhada com a nossa sugestão.`
  }

  return {
    suggestedMarkup,
    reasoning,
  };
}

// The AI-related prompt and flow definitions are now removed.
