import { NextResponse } from "next/server";

// Required for CAPACITOR_BUILD static export flow.
// In static export this route is not served, but declaring force-static
// avoids build-time failure for /api paths.
export const dynamic = "force-static";

interface AiComparePayload {
  analysisType: string;
  context: Record<string, unknown>;
  /** Optional: API key provided by the client (user-configured in Settings). */
  apiKey?: string;
}

const MODEL = "gemini-2.5-flash";

function getEnvApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
          maxOutputTokens: 700,
        },
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== "string") {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

function buildPrompt(payload: AiComparePayload): string {
  if (payload.analysisType === "test") {
    return "Responda apenas com a palavra: ok";
  }
  return [
    "Voce e um engenheiro estrutural senior.",
    "Analise os dados abaixo e produza uma segunda opiniao tecnica em portugues do Brasil.",
    "Regras:",
    "1) Seja direto e objetivo.",
    "2) Estruture em 4 blocos: Diagnostico, Riscos, Otimizacoes, Recomendacao final.",
    "3) Nao invente dados ausentes.",
    "4) Se houver incerteza, indique como validacao de engenharia.",
    "",
    `Tipo de analise: ${payload.analysisType}`,
    "Dados em JSON:",
    JSON.stringify(payload.context, null, 2),
  ].join("\n");
}

export async function GET() {
  return NextResponse.json({ available: !!getEnvApiKey() });
}

export async function POST(request: Request) {
  let payload: AiComparePayload;
  try {
    payload = (await request.json()) as AiComparePayload;
  } catch {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
  }

  if (!payload?.analysisType || !payload?.context) {
    return NextResponse.json(
      { error: "analysisType e context sao obrigatorios." },
      { status: 400 }
    );
  }

  // Prefer client-provided key over env var so each user can
  // configure their own API key in Ferramentas > Configurações.
  const apiKey = payload.apiKey?.trim() || getEnvApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "IA indisponivel: configure sua chave em Ferramentas > Configuracoes ou defina GEMINI_API_KEY no ambiente.",
      },
      { status: 503 }
    );
  }

  try {
    const prompt = buildPrompt(payload);
    const analysis = await callGemini(prompt, apiKey);
    return NextResponse.json({ analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao consultar IA.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
