export type AiProvider = "local" | "gemini";

export interface AiSettings {
  provider: AiProvider;
  apiKey: string;
}

const DEFAULT_SETTINGS: AiSettings = { provider: "local", apiKey: "" };
const STORAGE_KEY = "ps_inox_ai_settings";

export function getAiSettings(): AiSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AiSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAiSettings(settings: AiSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function isAiConfigured(): boolean {
  const s = getAiSettings();
  return s.provider === "gemini" && s.apiKey.trim().length > 0;
}
