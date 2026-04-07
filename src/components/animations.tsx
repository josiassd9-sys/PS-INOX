"use client";

import React from "react";

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 50,
  className = "",
}: StaggerContainerProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          style={{
            animation: `slideInUp 0.5s ease-out forwards`,
            animationDelay: `${index * (staggerDelay / 1000)}s`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: "slideUp" | "fadeIn" | "scale";
  delay?: number;
  className?: string;
}

export function AnimatedSection({
  children,
  animation = "slideUp",
  delay = 0,
  className = "",
}: AnimatedSectionProps) {
  const animationMap = {
    slideUp: "animate-slideInUp",
    fadeIn: "animate-fadeIn",
    scale: "animate-scaleIn",
  };

  return (
    <div
      className={`${animationMap[animation]} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
