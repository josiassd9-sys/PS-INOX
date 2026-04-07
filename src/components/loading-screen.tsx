"use client";

import React from "react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      {/* Center Container */}
      <div className="flex flex-col items-center gap-8">
        {/* Animated Logo */}
        <div className="relative w-20 h-20">
          <svg
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full animate-pulse"
          >
            <defs>
              <linearGradient
                id="loadingGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity="0.9"
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--accent))"
                  stopOpacity="0.7"
                />
              </linearGradient>
            </defs>

            <polygon
              points="24,4 40,12 40,28 24,36 8,28 8,12"
              fill="url(#loadingGradient)"
            />
          </svg>

          {/* Spinner Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-accent opacity-75 animate-spin" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground mb-1">
            PS INOX
          </h2>
          <p className="text-sm text-muted-foreground">
            Carregando aplicativo...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-40 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-shimmer"
            style={{
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite",
            }}
          />
        </div>

        {/* Dots Animation */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              style={{
                animation: `pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
