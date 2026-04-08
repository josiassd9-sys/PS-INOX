"use client";

import * as React from "react";
import { Sparkles, Eye, EyeOff, CheckCircle, XCircle, Loader } from "lucide-react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefinedButton, RefinedCard } from "./refined-components";
import { useToast } from "@/hooks/use-toast";
import { getAiSettings, saveAiSettings, type AiProvider } from "@/lib/ai-settings";

type TestStatus = "idle" | "testing" | "ok" | "error";

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
        description: "Informe a chave de API antes de testar.",
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
    <RefinedCard hover="subtle" className="overflow-hidden p-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Sparkles className="h-4 w-4" />
          Inteligência Artificial
        </CardTitle>
        <CardDescription>
          Configure o provedor para usar "Comparar com IA". A chave fica salva só neste dispositivo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Provider selector */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Provedor</Label>
          <div className="grid grid-cols-2 gap-2">
            <RefinedButton
              type="button"
              variant={provider === "local" ? "primary" : "outline"}
              animation={provider === "local" ? "lift" : "scale"}
              className="h-auto min-h-12 flex-col gap-0.5 p-2.5"
              onClick={() => handleProviderChange("local")}
            >
              <span className="text-sm font-medium">Local</span>
              <span className="text-xs font-normal opacity-70">Sem IA externa</span>
            </RefinedButton>
            <RefinedButton
              type="button"
              variant={provider === "gemini" ? "primary" : "outline"}
              animation={provider === "gemini" ? "lift" : "scale"}
              className="h-auto min-h-12 flex-col gap-0.5 p-2.5"
              onClick={() => handleProviderChange("gemini")}
            >
              <span className="text-sm font-medium">Gemini</span>
              <span className="text-xs font-normal opacity-70">Google AI</span>
            </RefinedButton>
          </div>
        </div>

        {/* API Key field */}
        {provider === "gemini" && (
          <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
            <Label htmlFor="ai-api-key">Chave de API (Gemini)</Label>
            <div className="relative">
              <Input
                id="ai-api-key"
                type={showKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
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
            <p className="text-xs text-muted-foreground">
              Obtenha sua chave gratuita em{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                aistudio.google.com/apikey
              </a>
              .
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <RefinedButton
                type="button"
                variant="primary"
                animation="lift"
                onClick={handleSave}
                className="flex-1"
              >
                Salvar
              </RefinedButton>
              <RefinedButton
                type="button"
                variant="outline"
                animation="scale"
                onClick={handleTest}
                disabled={testStatus === "testing"}
                className="flex-1"
              >
                {testStatus === "testing" ? (
                  <>
                    <Loader className="animate-spin mr-2 h-4 w-4" />
                    Testando...
                  </>
                ) : (
                  "Testar Conexão"
                )}
              </RefinedButton>
            </div>
          </div>
        )}

        {/* Test status */}
        {testStatus === "ok" && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4 shrink-0" />
            {testMessage}
          </div>
        )}
        {testStatus === "error" && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <XCircle className="h-4 w-4 shrink-0" />
            {testMessage}
          </div>
        )}

        {/* Action buttons */}
        {provider === "local" && (
          <RefinedButton
            type="button"
            variant="primary"
            animation="lift"
            onClick={handleSave}
            className="w-full"
          >
            Salvar
          </RefinedButton>
        )}
      </CardContent>
    </RefinedCard>
  );
}
