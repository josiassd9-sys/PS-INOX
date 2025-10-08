"use client";

import { LucideProps, icons, RectangleHorizontal, Hexagon, Scissors, PackageCheck, Weight, Printer, Save, Download, Trash2, Eye, EyeOff, GalleryVertical, Book, Factory, Sparkles, DraftingCompass, Link } from 'lucide-react';

const AllianceRing = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="9" cy="12" r="5" />
    <circle cx="15" cy="12" r="5" />
  </svg>
);


const customIcons = {
    RectangleHorizontal,
    Hexagon,
    Scissors,
    PackageCheck,
    Weight,
    Printer,
    Save,
    Download,
    Trash2,
    Eye,
    EyeOff,
    GalleryVertical,
    Book,
    Factory,
    Sparkles,
    DraftingCompass,
    Link,
    AllianceRing
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
