'use server';
/**
 * @fileOverview Analyzes the geometry of a structural slab.
 *
 * - analyzeSlabGeometry - A function that analyzes the slab dimensions.
 * - SlabAnalysisInput - The input type for the analyzeSlabGeometry function.
 * - SlabAnalysisOutput - The return type for the analyzeSlabGeometry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SlabAnalysisInputSchema = z.object({
    totalSpanX: z.number().describe('O comprimento total da laje na direção X (em metros).'),
    totalSpanY: z.number().describe('O comprimento total da laje na direção Y (em metros).'),
    cantileverX_Left: z.number().describe('O comprimento do balanço à esquerda na direção X (em metros).'),
    cantileverX_Right: z.number().describe('O comprimento do balanço à direita na direção X (em metros).'),
    cantileverY_Front: z.number().describe('O comprimento do balanço à frente na direção Y (em metros).'),
    cantileverY_Back: z.number().describe('O comprimento do balanço atrás na direção Y (em metros).'),
});
export type SlabAnalysisInput = z.infer<typeof SlabAnalysisInputSchema>;

export const SlabAnalysisOutputSchema = z.object({
  analysis: z.string().describe('A análise detalhada da geometria da laje, como se fosse feita por um engenheiro estrutural experiente.'),
});
export type SlabAnalysisOutput = z.infer<typeof SlabAnalysisOutputSchema>;

export async function analyzeSlabGeometry(input: SlabAnalysisInput): Promise<SlabAnalysisOutput> {
  return slabAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'slabAnalysisPrompt',
  input: {schema: SlabAnalysisInputSchema},
  output: {schema: SlabAnalysisOutputSchema},
  prompt: `Você é um engenheiro estrutural sênior, especialista em estruturas metálicas, e está fazendo a análise preliminar de uma geometria de laje para um projeto. Seja direto, técnico e forneça insights úteis.

  Analise a seguinte geometria da laje:
  - Comprimento Total em X: {{{totalSpanX}}} m
  - Comprimento Total em Y: {{{totalSpanY}}} m
  - Balanço em X (Esquerda): {{{cantileverX_Left}}} m
  - Balanço em X (Direita): {{{cantileverX_Right}}} m
  - Balanço em Y (Frente): {{{cantileverY_Front}}} m
  - Balanço em Y (Atrás): {{{cantileverY_Back}}} m

  Sua análise deve conter:
  1.  Cálculo dos vãos livres: Calcule o vão livre principal em X (Viga Principal) e em Y (Viga Secundária). O vão livre é o comprimento total menos os balanços.
  2.  Comentário sobre os vãos: Avalie se os vãos livres calculados são pequenos, médios ou grandes para um sistema estrutural metálico típico.
  3.  Comentário sobre os balanços: Avalie a proporção dos balanços em relação aos vãos. Balanços muito grandes (ex: >35% do vão) exigem atenção especial. Balanços moderados (15-30%) são eficientes para otimizar os momentos fletores.
  4.  Conclusão e Próximos Passos: Forneça uma breve conclusão sobre a geometria e informe que os vãos calculados foram enviados para as próximas abas da calculadora.

  Formate a resposta de forma clara e organizada.
  `,
});

const slabAnalysisFlow = ai.defineFlow(
  {
    name: 'slabAnalysisFlow',
    inputSchema: SlabAnalysisInputSchema,
    outputSchema: SlabAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
