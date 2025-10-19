
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

      **Sua Análise Final (seja conciso, didático e conclusivo em 2-3 parágrafos):**

      1.  **Revisão da Carga e Segurança do Pilar**: Primeiro, avalie a escolha do perfil '{{{recommendedProfile}}}'. Compare a tensão atuante ({{{actingStress}}} MPa) com a tensão admissível ({{{allowableStress}}} MPa), calculando a porcentagem de utilização: (Tensão Atuante / Tensão Admissível) * 100. Comente o resultado, por exemplo: "O perfil {{{recommendedProfile}}} está trabalhando com XX% de sua capacidade resistente à flambagem, indicando um dimensionamento seguro e com uma margem adequada."

      2.  **Análise da Conexão Viga-Pilar**: Com base na sua experiência, avalie as cargas concentradas (as reações da viga principal e secundária) em relação ao perfil do pilar selecionado ({{{recommendedProfile}}}). Se as reações forem muito altas (ex: acima de 5-10 toneladas-força) para um perfil de pilar relativamente leve (série 150, 200), comente sobre a importância da conexão. Exemplo de frase: "As reações de apoio de {{{supportReactions.vigaPrincipal}}} kgf e {{{supportReactions.vigaSecundaria}}} kgf são cargas concentradas significativas. No projeto detalhado, será crucial verificar a alma do pilar {{{recommendedProfile}}} quanto ao esmagamento e à flambagem local, podendo ser necessário o uso de enrijecedores na alma para garantir uma transferência segura dos esforços." Se as cargas forem baixas, diga que a conexão pode ser feita de forma mais simples.

      3.  **Conclusão Geral do Sistema**: Forneça um parágrafo de conclusão sobre a coerência do pré-dimensionamento. Exemplo: "Em resumo, o sistema pré-dimensionado aparenta ser coerente. As cargas foram transferidas da laje para as vigas, e finalmente concentradas no pilar. O pilar {{{recommendedProfile}}} foi dimensionado de forma segura para a carga axial total, e foi feito um alerta para a verificação da ligação viga-pilar. Este resultado serve como uma excelente base para o projeto executivo final."
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
