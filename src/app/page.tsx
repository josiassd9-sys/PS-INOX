"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";

console.log("[page.tsx]", "Page component loaded");

export default function HomePage() {
  console.log("[page.tsx]", "HomePage rendering");
  return (
      <Dashboard initialCategoryId="lista-materiais" />
  );
}
