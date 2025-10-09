"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";

export default function Home() {
  const mainContent = <Dashboard />;

  return (
    <>
      <main className="min-h-screen bg-background">{mainContent}</main>
    </>
  );
}
