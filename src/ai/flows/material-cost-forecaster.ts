// src/ai/flows/material-cost-forecaster.ts
'use server';

/**
 * @fileOverview Forecasts potential fluctuations in stainless steel material costs.
 *
 * - forecastMaterialCost - A function that forecasts material costs based on market trends.
 * - ForecastMaterialCostInput - The input type for the forecastMaterialCost function.
 * - ForecastMaterialCostOutput - The return type for the forecastMaterialCost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastMaterialCostInputSchema = z.object({
  marketTrends: z
    .string()
    .describe('Description of current market trends for stainless steel.'),
  costPrice: z.number().describe('The current cost price of stainless steel.'),
  marginPercentage: z.number().describe('The desired profit margin percentage.'),
});
export type ForecastMaterialCostInput = z.infer<typeof ForecastMaterialCostInputSchema>;

const ForecastMaterialCostOutputSchema = z.object({
  costFluctuationForecast: z
    .string()
    .describe('A forecast of potential cost fluctuations for stainless steel.'),
  adjustedSellingPrice: z
    .number()
    .describe('The adjusted selling price based on the cost fluctuation forecast.'),
});
export type ForecastMaterialCostOutput = z.infer<typeof ForecastMaterialCostOutputSchema>;

export async function forecastMaterialCost(input: ForecastMaterialCostInput): Promise<ForecastMaterialCostOutput> {
  return forecastMaterialCostFlow(input);
}

const forecastMaterialCostPrompt = ai.definePrompt({
  name: 'forecastMaterialCostPrompt',
  input: {schema: ForecastMaterialCostInputSchema},
  output: {schema: ForecastMaterialCostOutputSchema},
  prompt: `You are an expert in financial forecasting, specializing in stainless steel market analysis.

  Based on the provided market trends, forecast potential cost fluctuations for stainless steel and suggest an adjusted selling price to maintain the desired profit margin.

  Market Trends: {{{marketTrends}}}
  Current Cost Price: {{{costPrice}}}
  Desired Margin Percentage: {{{marginPercentage}}}

  Consider these factors when determining the cost fluctuation forecast:
  - Current economic conditions
  - Supply and demand dynamics
  - Geopolitical factors

  The adjusted selling price should take into account the potential cost fluctuations to ensure the desired profit margin is maintained.

  Cost Fluctuation Forecast: 
  Adjusted Selling Price:
  `,
});

const forecastMaterialCostFlow = ai.defineFlow(
  {
    name: 'forecastMaterialCostFlow',
    inputSchema: ForecastMaterialCostInputSchema,
    outputSchema: ForecastMaterialCostOutputSchema,
  },
  async input => {
    const {output} = await forecastMaterialCostPrompt(input);
    return output!;
  }
);
