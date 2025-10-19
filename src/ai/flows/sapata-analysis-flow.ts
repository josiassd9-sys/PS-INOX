
'use server';

/**
 * @fileOverview Analyzes and suggests a concrete footing (sapata) for a steel column.
 *
 * - analyzeSapataSelection - A function that analyzes the footing requirements.
 * - AnalyzeSapataSelectionInput - The input type for the function.
 * - AnalyzeSapataSelectionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSapataSelectionInputSchema = z.object({
  totalLoadKgf: z.number().describe('A carga total do pilar sobre a sapata em kgf.'),
  soilType: z.string().describe('O tipo de solo escolhido (ex: "Argila Rija (1.5 kgf/cm²)")'),
  allowableSoilPressure: z.number().describe('A tensão admissível do solo em kgf/cm².')
});
export type AnalyzeSapataSelectionInput = z.infer<typeof AnalyzeSapataSelectionInputSchema>;

const AnalyzeSapataSelectionOutputSchema = z.object({
  analysis: z.string().describe('Uma análise técnica e didática sobre a sapata dimensionada.'),
  footingDimensions: z.object({
    requiredAreaM2: z.number().describe('A área mínima necessária para a sapata em metros quadrados.'),
    sideLengthM: z.number().describe('O lado de uma sapata quadrada com a área necessária, em metros.'),
    recommendedHeightCm: z.number().describe('A altura recomendada para a sapata em centímetros.'),
  }).describe('As dimensões calculadas para a sapata.'),
});
export type AnalyzeSapataSelectionOutput = z.infer<typeof AnalyzeSapataSelectionOutputSchema>;


export async function analyzeSapata(input: AnalyzeSapataSelectionInput): Promise<AnalyzeSapataSelectionOutput> {
  return analyzeSapataFlow(input);
}


const prompt = ai.definePrompt({
    name: 'analyzeSapataPrompt',
    input: {schema: AnalyzeSapataSelectionInputSchema},
    output: {schema: AnalyzeSapataSelectionOutputSchema},
    prompt: `
      Você é um engenheiro geotécnico e de fundações, especialista em sapatas para estruturas de aço. Sua tarefa é analisar e descrever uma sapata para um pilar.

      **Dados Recebidos:**
      - Carga Total do Pilar (P): {{{totalLoadKgf}}} kgf
      - Tipo de Solo: {{{soilType}}}
      - Tensão Admissível do Solo (σ_solo): {{{allowableSoilPressure}}} kgf/cm²

      **Sua Análise (seja técnico, claro e didático em 2-3 parágrafos):**

      1.  **Cálculo da Área da Sapata:**
          - Converta a tensão do solo para kgf/m²: σ_solo_m2 = {{{allowableSoilPressure}}} * 10000.
          - Calcule a área mínima necessária da sapata: Área (m²) = Carga Total (P) / σ_solo_m2.
          - Preencha 'requiredAreaM2' com este valor.
          - Calcule o lado de uma sapata quadrada: Lado (m) = sqrt(Área).
          - Preencha 'sideLengthM' com este valor.

      2.  **Dimensionamento da Altura (h):**
          - Use uma regra prática comum para pré-dimensionamento: a altura (h) da sapata deve ser aproximadamente 1/3 do lado (L) para sapatas rígidas, com um mínimo de 25-30 cm.
          - Calcule a altura: h (cm) = (Lado (m) * 100) / 3. Arredonde para o múltiplo de 5 mais próximo (ex: 33cm vira 35cm). Garanta um mínimo de 30cm.
          - Preencha 'recommendedHeightCm' com este valor.

      3.  **Texto da Análise:**
          - **Parágrafo 1: Justificativa do Dimensionamento.** Comece explicando que para a carga de {{{totalLoadKgf}}} kgf e um solo do tipo "{{{soilType}}}" com tensão admissível de {{{allowableSoilPressure}}} kgf/cm², a sapata precisa ter uma área mínima para distribuir a carga sem exceder a capacidade do solo. Apresente a área calculada e as dimensões da sapata quadrada resultante (Lado x Lado).
          - **Parágrafo 2: Detalhes Construtivos.** Descreva a sapata recomendada. Ex: "A recomendação é uma sapata quadrada de Xm por Ym, com uma altura de Zcm." Explique a importância da altura para resistir à punção (o pilar "furar" a sapata) e à flexão. Mencione a necessidade de um "colarinho" de concreto (bloco de arranque) sobre a sapata para embutir a base do pilar metálico, com dimensões um pouco maiores que a placa de base do pilar (ex: 40x40cm ou 50x50cm).
          - **Parágrafo 3: Recomendações Finais.** Conclua reforçando que este é um pré-dimensionamento. O projeto executivo final deve ser feito por um engenheiro calculista, que irá detalhar as armaduras de aço necessárias dentro da sapata, verificar a necessidade de estacas (se o solo for muito ruim), e garantir a conformidade com as normas NBR 6118 e NBR 6122.
    `,
});

const analyzeSapataFlow = ai.defineFlow(
  {
    name: 'analyzeSapataFlow',
    inputSchema: AnalyzeSapataSelectionInputSchema,
    outputSchema: AnalyzeSapataSelectionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
`