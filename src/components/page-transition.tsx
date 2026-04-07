"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const animationStyles: Record<NonNullable<PageTransitionProps["variant"]>, React.CSSProperties> = {
  slide: {
    animation: "slideInUp 0.45s ease-out forwards",
  },
  fade: {
    animation: "fadeIn 0.35s ease-out forwards",
  },
  scale: {
    animation: "scaleIn 0.4s ease-out forwards",
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: "slide" | "fade" | "scale";
}

export function PageTransition({
  children,
  variant = "fade",
}: PageTransitionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={mounted ? "" : "opacity-0"} style={mounted ? animationStyles[variant] : undefined}>
      {children}
    </div>
  );
}

export function usePageTransition() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transition = (href: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(href);
      setIsTransitioning(false);
    }, 300);
  };

  return { transition, isTransitioning };
}
