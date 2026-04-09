import {z} from 'zod';

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
  const vaoX = input.totalSpanX - input.cantileverX_Left - input.cantileverX_Right;
  const vaoY = input.totalSpanY - input.cantileverY_Front - input.cantileverY_Back;

  const classifySpan = (value: number) => {
    if (value < 3) return 'pequeno';
    if (value <= 6) return 'medio';
    return 'grande';
  };

  const classifyCantilever = (cantilever: number, span: number) => {
    if (span <= 0 || cantilever <= 0) return 'sem impacto relevante';
    const ratio = (cantilever / span) * 100;
    if (ratio > 35) return `critico (${ratio.toFixed(1)}% do vao)`;
    if (ratio >= 15) return `moderado (${ratio.toFixed(1)}% do vao)`;
    return `baixo (${ratio.toFixed(1)}% do vao)`;
  };

  const lines = [
    `1. Calculo dos vaos livres:`,
    `- Vao livre principal em X (Viga Principal): ${vaoX.toFixed(2)} m.`,
    `- Vao livre principal em Y (Viga Secundaria): ${vaoY.toFixed(2)} m.`,
    '',
    `2. Comentario sobre os vaos:`,
    `- O vao em X e classificado como ${classifySpan(vaoX)} para um sistema estrutural metalico usual.`,
    `- O vao em Y e classificado como ${classifySpan(vaoY)} para um sistema estrutural metalico usual.`,
    '',
    `3. Comentario sobre os balancos:`,
    `- Balanco X esquerdo: ${classifyCantilever(input.cantileverX_Left, vaoX)}.`,
    `- Balanco X direito: ${classifyCantilever(input.cantileverX_Right, vaoX)}.`,
    `- Balanco Y frontal: ${classifyCantilever(input.cantileverY_Front, vaoY)}.`,
    `- Balanco Y traseiro: ${classifyCantilever(input.cantileverY_Back, vaoY)}.`,
    '',
    `4. Conclusao e proximos passos:`,
    `- A geometria foi analisada com base nos vaos livres e proporcoes de balanco informados.`,
    `- Os vaos calculados podem ser usados nas proximas abas da calculadora para pre-dimensionamento estrutural.`,
  ];

  return {
    analysis: lines.join('\n'),
  };
}
