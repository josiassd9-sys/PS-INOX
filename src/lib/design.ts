export const DESIGN_LEVELS = [1, 2, 3, 4] as const;
export type DesignLevel = (typeof DESIGN_LEVELS)[number];

export const DESIGN_LABELS: Record<DesignLevel, string> = {
  1: "Nível 1 — Polimento Sutil",
  2: "Nível 2 — Refinamento Tipográfico",
  3: "Nível 3 — Identidade Industrial",
  4: "Nível 4 — Redesign Total",
};

export const DESIGN_DESCRIPTIONS: Record<DesignLevel, string> = {
  1: "Sombras, hover states e arredondamento refinado.",
  2: "Tipografia Chakra Petch, hierarquia de menu, headers destacados.",
  3: "Paleta profissional (azul navy + prata), cards com borda colorida, tabelas com listras.",
  4: "Identidade completa: micro-interações, logo SVG, animações, splash screen.",
};

const DESIGN_LEVEL_STORAGE_KEY = "psinox-design-level";

export function applyDesignLevel(level: DesignLevel) {
  const root = document.documentElement;
  root.setAttribute("data-design-level", level.toString());
  // Persistir em localStorage
  try {
    localStorage.setItem(DESIGN_LEVEL_STORAGE_KEY, level.toString());
  } catch (error) {
    console.warn("Failed to store design level", error);
  }
}

export function getStoredDesignLevel(): DesignLevel {
  if (typeof window === "undefined") return 4;
  try {
    const stored = localStorage.getItem(DESIGN_LEVEL_STORAGE_KEY);
    const level = stored ? parseInt(stored, 10) : 4;
    if (DESIGN_LEVELS.includes(level as DesignLevel)) {
      return level as DesignLevel;
    }
  } catch (error) {
    console.warn("Failed to retrieve design level", error);
  }
  return 4;
}

export function storeDesignLevel(level: DesignLevel) {
  try {
    localStorage.setItem(DESIGN_LEVEL_STORAGE_KEY, level.toString());
  } catch (error) {
    console.warn("Failed to store design level", error);
  }
}
