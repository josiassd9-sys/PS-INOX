// src/ai/flows/material-cost-forecaster.ts
'use server';

/**
 * @fileOverview Calculates an adjusted selling price based on cost and margin.
 *
 * - forecastMaterialCost - A function that calculates a selling price.
 * - ForecastMaterialCostInput - The input type for the forecastMaterialCost function.
 * - ForecastMaterialCostOutput - The return type for the forecastMaterialCost function.
 */

import { z } from 'genkit';

// Schema for the input data remains the same for compatibility.
const ForecastMaterialCostInputSchema = z.object({
  marketTrends: z
    .string()
    .describe('Description of current market trends for stainless steel.'),
  costPrice: z.number().describe('The current cost price of stainless steel.'),
  marginPercentage: z.number().describe('The desired profit margin percentage.'),
});
export type ForecastMaterialCostInput = z.infer<typeof ForecastMaterialCostInputSchema>;

// Schema for the output data remains the same for compatibility.
const ForecastMaterialCostOutputSchema = z.object({
  costFluctuationForecast: z
    .string()
    .describe('A forecast of potential cost fluctuations for stainless steel.'),
  adjustedSellingPrice: z
    .number()
    .describe('The adjusted selling price based on the cost fluctuation forecast.'),
});
export type ForecastMaterialCostOutput = z.infer<typeof ForecastMaterialCostOutputSchema>;

/**
 * Calculates an adjusted selling price based on the current cost price and desired margin.
 * This function provides a deterministic calculation and replaces the external AI-based forecast.
 *
 * @param input The input data containing cost price and margin percentage.
 * @returns A promise that resolves to the calculated output.
 */
export async function forecastMaterialCost(input: ForecastMaterialCostInput): Promise<ForecastMaterialCostOutput> {
  
  // Calculate the adjusted selling price using a simple, reliable formula.
  const adjustedSellingPrice = input.costPrice * (1 + input.marginPercentage / 100);

  // Create a static, informative message instead of an AI-generated forecast.
  const costFluctuationForecast = "O preço de venda ajustado é calculado com base no custo atual e na margem de lucro desejada. Esta análise não prevê flutuações futuras do mercado.";

  // Return the output in the expected format, ensuring compatibility with the rest of the app.
  return {
    costFluctuationForecast,
    adjustedSellingPrice,
  };
}

// The AI-related prompt and flow definitions are now removed to ensure the app is self-contained.
