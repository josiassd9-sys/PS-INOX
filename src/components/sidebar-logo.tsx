"use client";

import React from "react";

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-sidebar-border">
      {/* Hexagon Logo */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient
            id="sidebarGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.65" />
          </linearGradient>
        </defs>

        {/* Outer hexagon */}
        <polygon
          points="24,4 40,12 40,28 24,36 8,28 8,12"
          fill="url(#sidebarGradient)"
        />

        {/* Inner hexagon */}
        <polygon
          points="24,10 36,16 36,26 24,32 12,26 12,16"
          fill="white"
          opacity="0.25"
        />

        {/* Center circle accent */}
        <circle cx="24" cy="20" r="4" fill="white" opacity="0.15" />

        {/* Corner dots */}
        <circle cx="24" cy="4" r="1.5" fill="white" opacity="0.6" />
        <circle cx="40" cy="12" r="1.5" fill="white" opacity="0.6" />
      </svg>

      {/* Brand Text */}
      <div className="flex flex-col gap-0">
        <span className="font-bold text-sm leading-none text-sidebar-foreground">
          PS
        </span>
        <span className="font-bold text-xs leading-none text-sidebar-primary">
          INOX
        </span>
      </div>
    </div>
  );
}
