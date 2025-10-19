
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
  pointLoad: z.number().optional().describe('A carga pontual aplicada na viga em kgf, se houver.'),
  pointLoadPosition: z.number().optional().describe('A posição da carga pontual em metros, se houver.'),
  beamScheme: z.string().describe('O esquema da viga (ex: biapoiada, dois-balancos).'),
  steelType: z.string().describe('O tipo de aço usado (ex: ASTM A36).'),
  recommendedProfile: z.object({
      nome: z.string(),
      peso: z.number(),
      Wx: z.number(),
      Ix: z.number(),
  }).describe('O perfil de aço que foi recomendado pela calculadora.'),
   requiredWx: z.number().describe('O módulo de resistência mínimo necessário (Wx) em cm³.'),
   requiredIx: z.number().describe('O momento de inércia mínimo necessário (Ix) em cm⁴.'),
   shearCheck: z.object({
       vsd: z.number().describe('O esforço cortante solicitante em kN.'),
       vrd: z.number().describe('O esforço cortante resistente do perfil em kN.'),
   }).describe('Verificação do esforço cortante.'),
   connectorCount: z.number().optional().describe('A quantidade de conectores de cisalhamento (stud bolts) calculada para a viga, se aplicável.')
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
      - Esquema da Viga: {{{beamScheme}}}
      - Vão Principal: {{{span}}} metros
      - Carga Distribuída: {{{load}}} kgf/m
      {{#if pointLoad}}- Carga Pontual: {{{pointLoad}}} kgf a {{{pointLoadPosition}}} m do apoio{{/if}}
      - Tipo de Aço: {{{steelType}}}

      **Requisitos Mínimos Calculados:**
      - Módulo de Resistência (Wx) necessário: {{{requiredWx}}} cm³ (para resistir à flexão)
      - Momento de Inércia (Ix) necessário: {{{requiredIx}}} cm⁴ (para limitar a deformação/flecha)

      **Perfil Recomendado:**
      - Nome: {{{recommendedProfile.nome}}}
      - Wx do Perfil: {{{recommendedProfile.Wx}}} cm³
      - Ix do Perfil: {{{recommendedProfile.Ix}}} cm⁴
      - Peso: {{{recommendedProfile.peso}}} kg/m

      **Verificações de Segurança:**
      - Esforço Cortante: Solicitante (Vsd) = {{{shearCheck.vsd}}} kN | Resistente (Vrd) = {{{shearCheck.vrd}}} kN

      {{#if connectorCount}}
      **Conectores de Cisalhamento (Ação Mista):**
      - Quantidade Calculada: {{{connectorCount}}} unidades
      {{/if}}

      **Sua Análise (seja breve, técnico mas claro, em 1-2 parágrafos):**

      1.  **Justificativa da Escolha**: Comece explicando que, para o esquema de viga "{{{beamScheme}}}" e as cargas aplicadas, o perfil '{{{recommendedProfile.nome}}}' foi selecionado por ser a opção mais leve que atendeu a todos os critérios de segurança e serviço. Mencione os critérios principais:
          - **Resistência à Flexão** (Momento Fletor), atendido pelo Wx.
          - **Rigidez** (limite de deformação/flecha), atendido pelo Ix.
          - **Resistência ao Cisalhamento** (Esforço Cortante), atendido pela alma do perfil.

      2.  **Nível de Otimização**: Calcule a "folga" ou "sobra" de capacidade do perfil em relação ao necessário, tanto para Wx, Ix, quanto para o Cortante.
          - Otimização de Resistência à Flexão (%) = ( (Wx do Perfil / Wx necessário) - 1 ) * 100
          - Otimização de Rigidez (%) = ( (Ix do Perfil / Ix necessário) - 1 ) * 100
          - Otimização ao Cortante (%) = ( (Vrd / Vsd) - 1) * 100
          Apresente isso de forma clara. Por exemplo: "Este perfil tem uma capacidade de resistência à flexão X% acima do mínimo e uma rigidez Y% superior. Sua resistência ao esforço cortante está com uma folga de Z%, indicando um dimensionamento seguro em todos os aspectos."

      3.  {{#if connectorCount}}
          **Análise da Ação Mista**: Comente sobre a importância dos conectores. Ex: "Foram calculados {{{connectorCount}}} conectores de cisalhamento. A instalação correta destes elementos é fundamental para garantir a ação mista entre a viga de aço e a laje de concreto, o que aumenta a rigidez e a capacidade de carga do sistema."
          {{/if}}

      4.  **Conclusão**: Faça uma breve declaração final sobre a adequação da escolha.
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
