'use server';

/**
 * @fileOverview Analyzes the selection of a steel column (pillar).
 *
 * - analyzePillarSelection - A function that analyzes the pillar configuration.
 * - AnalyzePillarSelectionInput - The input type for the function.
 * - AnalyzePillarSelectionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePillarSelectionInputSchema = z.object({
  pillarHeight: z.number().describe('A altura do pilar em metros.'),
  axialLoad: z.number().describe('A carga axial total no pilar em kgf.'),
  supportReactions: z.object({
      vigaPrincipal: z.number(),
      vigaSecundaria: z.number(),
  }).describe('As reações de apoio das vigas que foram transferidas para este pilar.'),
  recommendedProfile: z.string().describe('O nome do perfil de aço recomendado para o pilar.'),
  actingStress: z.number().describe('A tensão de compressão atuante no pilar em MPa.'),
  allowableStress: z.number().describe('A tensão de compressão admissível (já considerando flambagem) para o perfil em MPa.'),
});
export type AnalyzePillarSelectionInput = z.infer<typeof AnalyzePillarSelectionInputSchema>;

const AnalyzePillarSelectionOutputSchema = z.object({
  analysis: z.string().describe('Uma análise final e abrangente sobre o dimensionamento do pilar e a coerência do sistema estrutural.'),
});
export type AnalyzePillarSelectionOutput = z.infer<typeof AnalyzePillarSelectionOutputSchema>;


export async function analyzePillarSelection(input: AnalyzePillarSelectionInput): Promise<AnalyzePillarSelectionOutput> {
  return analyzePillarSelectionFlow(input);
}


const prompt = ai.definePrompt({
    name: 'analyzePillarSelectionPrompt',
    input: {schema: AnalyzePillarSelectionInputSchema},
    output: {schema: AnalyzePillarSelectionOutputSchema},
    prompt: `
      Você é um engenheiro estrutural sênior e está fazendo a revisão final do pré-dimensionamento de um sistema de piso. Sua tarefa é fornecer uma análise conclusiva sobre a escolha do pilar.

      **Dados do Pilar:**
      - Altura: {{{pillarHeight}}} metros
      - Carga Axial Total Aplicada: {{{axialLoad}}} kgf
      - Perfil Recomendado: {{{recommendedProfile}}}
      - Tensão Atuante: {{{actingStress}}} MPa
      - Tensão Admissível (Resistência à Flambagem): {{{allowableStress}}} MPa

      **Contexto da Carga (Reações recebidas das vigas):**
      - Da Viga Principal: {{{supportReactions.vigaPrincipal}}} kgf
      - Da Viga Secundária: {{{supportReactions.vigaSecundaria}}} kgf

      **Sua Análise Final (seja conciso, didático e conclusivo):**

      1.  **Revisão da Carga**: Comece verificando a coerência da carga total. Compare a soma das reações recebidas ({{{supportReactions.vigaPrincipal}}} + {{{supportReactions.vigaSecundaria}}}) com a carga total informada ({{{axialLoad}}}). Se houver outras cargas não listadas, mencione que a carga total inclui essas reações mais outras cargas.

      2.  **Análise de Segurança do Pilar**: Avalie a escolha do perfil '{{{recommendedProfile}}}'.
          - Compare a tensão atuante ({{{actingStress}}} MPa) com a tensão admissível ({{{allowableStress}}} MPa).
          - Calcule a porcentagem de utilização do perfil: (Tensão Atuante / Tensão Admissível) * 100.
          - Comente o resultado. Por exemplo: "O perfil {{{recommendedProfile}}} está trabalhando com XX% de sua capacidade resistente à flambagem, o que indica um dimensionamento seguro e com uma margem de segurança adequada." ou "O perfil está trabalhando muito próximo do seu limite, um perfil superior poderia oferecer mais segurança.".

      3.  **Conclusão Geral do Sistema**: Forneça um parágrafo de conclusão sobre o pré-dimensionamento. Exemplo: "Em resumo, o sistema pré-dimensionado aparenta ser coerente. As cargas da laje foram transferidas para as vigas secundárias, estas para as principais (se aplicável), e finalmente concentradas no pilar. O pilar {{{recommendedProfile}}} foi dimensionado de forma segura para suportar esses esforços. Este resultado serve como uma excelente base para o projeto executivo final."
    `,
});

const analyzePillarSelectionFlow = ai.defineFlow(
  {
    name: 'analyzePillarSelectionFlow',
    inputSchema: AnalyzePillarSelectionInputSchema,
    outputSchema: AnalyzePillarSelectionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
