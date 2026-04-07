"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  const getAnimation = () => {
    switch (variant) {
      case "slide":
        return "animate-slideInUp";
      case "scale":
        return "animate-scaleIn";
      case "fade":
      default:
        return "animate-fadeIn";
    }
  };

  return (
    <div className={`${getAnimation()} ${mounted ? "" : "opacity-0"}`}>
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
