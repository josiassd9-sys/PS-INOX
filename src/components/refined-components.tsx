"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RefinedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: "lift" | "subtle" | "intense" | "none";
  border?: boolean;
}

export const RefinedCard = React.forwardRef<HTMLDivElement, RefinedCardProps>(
  ({ className, children, hover = "lift", border = true, ...props }, ref) => {
    const hoverClasses = {
      lift: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
      subtle: "hover:shadow-md transition-shadow duration-300",
      intense:
        "hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg p-4 bg-card text-card-foreground",
          border && "border border-border",
          "shadow-sm",
          hoverClasses[hover],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
RefinedCard.displayName = "RefinedCard";

interface RefinedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  animation?: "ripple" | "scale" | "lift" | "none";
}

export const RefinedButton = React.forwardRef<
  HTMLButtonElement,
  RefinedButtonProps
>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      animation = "ripple",
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/75",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/75",
      outline:
        "border border-border hover:bg-muted active:bg-muted/75 transition-colors",
      ghost: "hover:bg-muted text-foreground active:bg-muted/75 transition-colors",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const animationClasses = {
      ripple:
        "relative overflow-hidden transition-all duration-300 active:scale-95",
      scale: "transition-transform duration-200 hover:scale-105 active:scale-95",
      lift:
        "transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:translate-y-0",
      none: "transition-colors duration-200",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          variantClasses[variant],
          sizeClasses[size],
          animationClasses[animation],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
RefinedButton.displayName = "RefinedButton";

interface RefinedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const RefinedInput = React.forwardRef<
  HTMLInputElement,
  RefinedInputProps
>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground block">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-destructive focus-visible:ring-destructive/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});
RefinedInput.displayName = "RefinedInput";
