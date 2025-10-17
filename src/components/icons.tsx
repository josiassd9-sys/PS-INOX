
"use client";

import { LucideProps, icons, RectangleHorizontal, Hexagon, Scissors, PackageCheck, Weight, Printer, Save, Download, Trash2, Eye, EyeOff, GalleryVertical, Book, Factory, Sparkles, DraftingCompass, Link, ClipboardList, Home, Sheet, FlipHorizontal, Square, Layers, PenRuler, Scale, CheckCircle, Type, ZoomIn, BookOpen, Variable, Calculator, Ruler, Send, Workflow, X, Cog } from 'lucide-react';

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

const ScrapClaw = (props: LucideProps) => (
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
    <path d="M16.1 19.3L13 21l2-5.5-5-5-5 5L7 21l-3.1-1.7" />
    <path d="M12 10.5V3" />
    <path d="M5.1 4.2l-1.3 1.3" />
    <path d="M18.9 4.2l1.3 1.3" />
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
    AllianceRing,
    ClipboardList,
    Home,
    Sheet,
    ScrapClaw,
    FlipHorizontal,
    Square,
    Layers,
    PenRuler,
    Scale,
    CheckCircle,
    Type,
    ZoomIn,
    BookOpen,
    Variable,
    Calculator,
    Ruler,
    Send,
    Workflow,
    X,
    Cog,
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

    