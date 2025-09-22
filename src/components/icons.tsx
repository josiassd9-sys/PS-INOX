"use client";

import { LucideProps, icons, RectangleHorizontal, Hexagon, Scissors } from 'lucide-react';

const customIcons = {
    RectangleHorizontal,
    Hexagon,
    Scissors
}

interface IconProps extends LucideProps {
  name: keyof typeof icons | keyof typeof customIcons;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name as keyof typeof icons] || customIcons[name as keyof typeof customIcons];
  if (!LucideIcon) {
    // Fallback or error logging
    return null;
  }
  return <LucideIcon {...props} />;
};
