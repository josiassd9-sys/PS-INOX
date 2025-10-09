"use client";

import { ScrapListBuilder } from "@/components/scrap-list-builder";
import * as React from "react";

export default function RetalhoInoxPage() {
  const mainContent = <ScrapListBuilder />;

  return (
    <>
      <main className="h-screen bg-background">
        <div className="h-full">{mainContent}</div>
      </main>
    </>
  );
}
