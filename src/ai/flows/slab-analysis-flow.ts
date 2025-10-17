
'use server';

/**
 * @fileOverview Analyzes the selection of a steel deck slab.
 *
 * - analyzeSlabSelection - A function that analyzes the slab configuration.
 * - AnalyzeSlabSelectionInput - The input type for the function.
 * - AnalyzeSlabSelectionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSlabSelectionInputSchema = z.object({
  deckType: z.string().describe('O tipo de Steel Deck (ex: MD57, MD75).'),
  deckThickness: z.number().describe('A espessura da chapa do Steel Deck em mm.'),
  concreteSlabThickness: z.number().describe('A espessura total da laje de concreto em cm.'),
  liveLoad: z.number().describe('A sobrecarga de utilização em kgf/m² (ex: pessoas, móveis).'),
  totalLoad: z.number().describe('A carga total calculada para a laje em kgf/m².'),
});
export type AnalyzeSlabSelectionInput = z.infer<typeof AnalyzeSlabSelectionInputSchema>;

const AnalyzeSlabSelectionOutputSchema = z.object({
  analysis: z.string().describe('Uma análise concisa e em linguagem clara sobre a configuração da laje, com insights sobre a otimização e adequação.'),
});
export type AnalyzeSlabSelectionOutput = z.infer<typeof AnalyzeSlabSelectionOutputSchema>;


export async function analyzeSlabSelection(input: AnalyzeSlabSelectionInput): Promise<AnalyzeSlabSelectionOutput> {
  return analyzeSlabSelectionFlow(input);
}


const prompt = ai.definePrompt({
    name: 'analyzeSlabSelectionPrompt',
    input: {schema: AnalyzeSlabSelectionInputSchema},
    output: {schema: AnalyzeSlabSelectionOutputSchema},
    prompt: `
      Você é um engenheiro estrutural experiente, especialista em lajes mistas (Steel Deck). Sua tarefa é fornecer uma análise clara e objetiva sobre uma configuração de laje calculada.

      **Dados da Laje:**
      - Modelo do Deck: {{{deckType}}} (chapa {{{deckThickness}}}mm)
      - Espessura da Laje de Concreto: {{{concreteSlabThickness}}} cm
      - Sobrecarga de Projeto: {{{liveLoad}}} kgf/m²
      - Carga Total Resultante: ~{{{totalLoad}}} kgf/m²

      **Sua Análise (seja breve, didático e objetivo em 1-2 parágrafos):**

      1.  **Análise Geral da Carga:** Com base na sobrecarga de {{{liveLoad}}} kgf/m² e espessura de {{{concreteSlabThickness}}} cm, avalie se a carga total de ~{{{totalLoad}}} kgf/m² é coerente.
          - Se a sobrecarga for ~250 kgf/m², mencione que é um valor comum para escritórios e áreas comerciais.
          - Se for ~150 kgf/m², comente que é típico para áreas residenciais.
          - Se for >400 kgf/m², indique que é para cargas mais pesadas, como depósitos leves ou equipamentos.

      2.  **Análise da Configuração (Deck vs. Concreto):**
          - Comente a relação entre o tipo de deck ({{{deckType}}}) e a espessura do concreto.
          - Se for um MD75 com espessura de concreto alta (>15cm), sugira que ele é ideal para vencer vãos maiores entre as vigas, otimizando a estrutura secundária.
          - Se for um MD57 com espessura menor (~10-12cm), comente que é uma solução econômica e eficiente para vãos moderados, com bom aproveitamento de material.
          - Se a espessura do concreto for muito baixa (<8cm), alerte que pode não ser suficiente para garantir o cobrimento adequado da armadura e a resistência ao fogo.
          - Se a espessura for muito alta (>20cm), comente sobre o peso excessivo que isso adiciona à estrutura.

      3.  **Conclusão e Próximo Passo:** Faça uma breve conclusão sobre a adequação da laje e lembre o usuário de usar a carga total calculada para dimensionar as vigas secundárias.
    `,
});

const analyzeSlabSelectionFlow = ai.defineFlow(
  {
    name: 'analyzeSlabSelectionFlow',
    inputSchema: AnalyzeSlabSelectionInputSchema,
    outputSchema: AnalyzeSlabSelectionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
