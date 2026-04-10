"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global app error:", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background text-foreground">
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-2xl font-bold">Falha ao carregar a aplicacao</h1>
          <p className="text-sm text-muted-foreground">
            O app encontrou um erro no cliente. Tente recarregar a pagina.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
            >
              Tentar novamente
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
            >
              Recarregar pagina
            </button>
          </div>
          {process.env.NODE_ENV !== "production" && (
            <pre className="w-full overflow-x-auto rounded-md border bg-muted p-3 text-left text-xs text-muted-foreground">
              {error?.message}
            </pre>
          )}
        </main>
      </body>
    </html>
  );
}
