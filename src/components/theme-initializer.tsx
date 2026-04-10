"use client";

import * as React from "react";
import { applyTheme, getStoredTheme } from "@/lib/theme";
import { applyDesignLevel, getStoredDesignLevel } from "@/lib/design";

const CHUNK_RECOVERY_KEY = "psinox-chunk-recovery-attempted";

function getErrorMessage(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message || "";
  if (typeof value === "object" && value !== null && "message" in value) {
    const msg = (value as { message?: unknown }).message;
    return typeof msg === "string" ? msg : "";
  }
  return "";
}

function isChunkLoadLikeError(message: string): boolean {
  const text = message.toLowerCase();
  return (
    text.includes("chunkloaderror") ||
    text.includes("loading chunk") ||
    text.includes("failed to fetch dynamically imported module")
  );
}

async function recoverFromChunkError() {
  if (typeof window === "undefined") return;

  try {
    if (window.sessionStorage.getItem(CHUNK_RECOVERY_KEY) === "1") {
      return;
    }
    window.sessionStorage.setItem(CHUNK_RECOVERY_KEY, "1");
  } catch {
    // If sessionStorage is unavailable, continue best-effort.
  }

  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
  } catch {
    // Ignore SW errors and continue recovery.
  }

  try {
    if (typeof caches !== "undefined") {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }
  } catch {
    // Ignore Cache API errors and continue recovery.
  }

  window.location.reload();
}

export function ThemeInitializer() {
  React.useEffect(() => {
    applyTheme(getStoredTheme());
    applyDesignLevel(getStoredDesignLevel());
  }, []);

  React.useEffect(() => {
    const onError = (event: ErrorEvent) => {
      const message = getErrorMessage(event.error || event.message);
      if (isChunkLoadLikeError(message)) {
        void recoverFromChunkError();
      }
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = getErrorMessage(event.reason);
      if (isChunkLoadLikeError(message)) {
        void recoverFromChunkError();
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
