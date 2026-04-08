"use client";

import * as React from "react";
import { Eye, EyeOff, CheckCircle, XCircle, Loader, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAiSettings, saveAiSettings, type AiProvider } from "@/lib/ai-settings";

type TestStatus = "idle" | "testing" | "ok" | "error";

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="w-full sm:w-auto sm:shrink-0">{children}</div>
    </div>
  );
}

export function AiSettings() {
  const { toast } = useToast();
  const [provider, setProvider] = React.useState<AiProvider>("local");
  const [apiKey, setApiKey] = React.useState("");
  const [showKey, setShowKey] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState<TestStatus>("idle");
  const [testMessage, setTestMessage] = React.useState("");

  React.useEffect(() => {
    const s = getAiSettings();
    setProvider(s.provider);
    setApiKey(s.apiKey);
  }, []);

  const handleSave = () => {
    saveAiSettings({ provider, apiKey: provider === "gemini" ? apiKey : "" });
    setTestStatus("idle");
    setTestMessage("");
    toast({
      title: "Configurações salvas",
      description: "As configurações de IA foram salvas neste dispositivo.",
    });
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Chave ausente",
        description: "Informe a chave antes de testar.",
      });
      return;
    }

    setTestStatus("testing");
    setTestMessage("");

    try {
      const response = await fetch("/api/ai-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisType: "test",
          context: { test: true },
          apiKey: apiKey.trim(),
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (response.ok) {
        setTestStatus("ok");
        setTestMessage("Conexão com o Gemini testada com sucesso!");
      } else {
        setTestStatus("error");
        setTestMessage(data?.error ?? "Falha no teste de conexão.");
      }
    } catch {
      setTestStatus("error");
      setTestMessage("Erro ao conectar com o servidor de IA.");
    }
  };

  const handleProviderChange = (next: AiProvider) => {
    setProvider(next);
    setTestStatus("idle");
    setTestMessage("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold">Inteligência Artificial</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Configure o provedor de IA para os calculadores. A chave fica salva apenas neste
          dispositivo.
        </p>
      </div>

      <div className="overflow-hidden divide-y rounded-lg border">
        {/* Provider row */}
        <SettingRow label="Provedor" description="Fonte de inteligência artificial">
          <Select value={provider} onValueChange={(v) => handleProviderChange(v as AiProvider)}>
            <SelectTrigger className="h-9 w-full sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local — sem IA externa</SelectItem>
              <SelectItem value="gemini">Gemini — Google AI</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        {/* API Key row */}
        {provider === "gemini" && (
          <div className="space-y-3 px-4 py-3.5">
            <div>
              <p className="text-sm font-medium">Chave de API</p>
              <p className="text-xs text-muted-foreground">
                Obtenha gratuitamente em{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  aistudio.google.com/apikey
                </a>
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-9 pl-9 pr-10"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  aria-label={showKey ? "Ocultar chave" : "Mostrar chave"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowKey((v) => !v)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTest}
                disabled={testStatus === "testing"}
                className="h-9 shrink-0"
              >
                {testStatus === "testing" ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Testar"
                )}
              </Button>
              <Button type="button" size="sm" onClick={handleSave} className="h-9 shrink-0">
                Salvar
              </Button>
            </div>

            {testStatus === "ok" && (
              <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs text-green-700 dark:text-green-400">
                <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                {testMessage}
              </div>
            )}
            {testStatus === "error" && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <XCircle className="h-3.5 w-3.5 shrink-0" />
                {testMessage}
              </div>
            )}
          </div>
        )}

        {/* Save for local mode */}
        {provider === "local" && (
          <div className="flex items-center justify-between px-4 py-3.5">
            <p className="text-xs text-muted-foreground">
              Modo local ativo — análises com IA desabilitadas.
            </p>
            <Button type="button" size="sm" onClick={handleSave} className="h-8 shrink-0">
              Salvar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
