"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";

export default function HomePage() {
  return (
      <Dashboard initialCategoryId="package-checker" />
  );
}
