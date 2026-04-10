export const THEME_STORAGE_KEY = "psinox-theme";

export const THEMES = ["industrial-light", "industrial-dark", "sheet", "minimal-gray"] as const;

export type AppTheme = (typeof THEMES)[number];

export const THEME_LABELS: Record<AppTheme, string> = {
  "industrial-light": "Industrial Claro",
  "industrial-dark": "Industrial Escuro",
  sheet: "Lista de Materiais",
  "minimal-gray": "Cinza Minimalista",
};

export function isAppTheme(value: string | null): value is AppTheme {
  return !!value && THEMES.includes(value as AppTheme);
}

export function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "industrial-dark");
}

export function getStoredTheme(): AppTheme {
  if (typeof window === "undefined") {
    return "industrial-light";
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isAppTheme(storedTheme)) {
      return storedTheme;
    }
  } catch (error) {
    // localStorage may not be ready during app initialization, fallback to default
    console.debug("[Theme] localStorage access failed during boot, using default");
  }

  return "industrial-light";
}

export function storeTheme(theme: AppTheme) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function getNextTheme(theme: AppTheme): AppTheme {
  const index = THEMES.indexOf(theme);
  return THEMES[(index + 1) % THEMES.length];
}
