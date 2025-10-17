'use server';

/**
 * @fileOverview Interprets and provides insights on a selected steel profile.
 *
 * - interpretProfileSelection - A function that analyzes a profile selection.
 * - InterpretProfileSelectionInput - The input type for the function.
 * - InterpretProfileSelectionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretProfileSelectionInputSchema = z.object({
  span: z.number().describe('O vão da viga em metros.'),
  load: z.number().describe('A carga distribuída na viga em kgf/m.'),
  steelType: z.string().describe('O tipo de aço usado (ex: ASTM A36).'),
  recommendedProfile: z.object({
      nome: z.string(),
      peso: z.number(),
      Wx: z.number(),
      Ix: z.number(),
  }).describe('O perfil de aço que foi recomendado pela calculadora.'),
   requiredWx: z.number().describe('O módulo de resistência mínimo necessário (Wx) em cm³.'),
   requiredIx: z.number().describe('O momento de inércia mínimo necessário (Ix) em cm⁴.'),
});
export type InterpretProfileSelectionInput = z.infer<typeof InterpretProfileSelectionInputSchema>;

const InterpretProfileSelectionOutputSchema = z.object({
  analysis: z.string().describe('Uma análise concisa e em linguagem clara sobre a escolha do perfil, explicando o porquê da seleção e o nível de otimização.'),
});
export type InterpretProfileSelectionOutput = z.infer<typeof InterpretProfileSelectionOutputSchema>;


export async function interpretProfileSelection(input: InterpretProfileSelectionInput): Promise<InterpretProfileSelectionOutput> {
  return interpretProfileSelectionFlow(input);
}


const prompt = ai.definePrompt({
    name: 'interpretProfileSelectionPrompt',
    input: {schema: InterpretProfileSelectionInputSchema},
    output: {schema: InterpretProfileSelectionOutputSchema},
    prompt: `
      Você é um engenheiro estrutural sênior, especialista em estruturas de aço. Sua tarefa é fornecer uma análise clara e concisa sobre a seleção de um perfil de viga, feita por uma calculadora.

      **Contexto do Cálculo:**
      - Vão da Viga: {{{span}}} metros
      - Carga na Viga: {{{load}}} kgf/m
      - Tipo de Aço: {{{steelType}}}

      **Requisitos Mínimos Calculados:**
      - Módulo de Resistência (Wx) necessário: {{{requiredWx}}} cm³ (para resistir à força)
      - Momento de Inércia (Ix) necessário: {{{requiredIx}}} cm⁴ (para limitar a deformação/flecha)

      **Perfil Recomendado:**
      - Nome: {{{recommendedProfile.nome}}}
      - Wx do Perfil: {{{recommendedProfile.Wx}}} cm³
      - Ix do Perfil: {{{recommendedProfile.Ix}}} cm⁴
      - Peso: {{{recommendedProfile.peso}}} kg/m

      **Sua Análise (seja breve, técnico mas claro, em 1-2 parágrafos):**

      1.  **Justificativa da Escolha**: Comece explicando por que o perfil '{{{recommendedProfile.nome}}}' foi selecionado. Mencione que ele foi a opção mais leve que atendeu aos dois critérios essenciais: resistência (Wx) e rigidez (Ix).
      2.  **Nível de Otimização**: Calcule a "folga" ou "sobra" de capacidade do perfil em relação ao necessário, tanto para Wx quanto para Ix.
          - Otimização de Resistência (%) = ( (Wx do Perfil / Wx necessário) - 1 ) * 100
          - Otimização de Rigidez (%) = ( (Ix do Perfil / Ix necessário) - 1 ) * 100
          Apresente isso de forma clara. Por exemplo: "Este perfil tem uma capacidade de resistência X% acima do mínimo necessário e uma rigidez Y% superior, indicando uma boa margem de segurança."
      3.  **Conclusão**: Faça uma breve declaração final sobre a adequação da escolha.

      Use um tom profissional e didático.
    `,
});

const interpretProfileSelectionFlow = ai.defineFlow(
  {
    name: 'interpretProfileSelectionFlow',
    inputSchema: InterpretProfileSelectionInputSchema,
    outputSchema: InterpretProfileSelectionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
