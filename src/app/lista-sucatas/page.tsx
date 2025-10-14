"use client";

import * as React from "react";
import { ScrapListBuilder } from "@/components/scrap-list-builder";

export default function ScrapListPage() {
  const mainContent = <ScrapListBuilder />;

  return (
    <>
      <main className="h-screen bg-background">
        <div className="h-full">{mainContent}</div>
      </main>
    </>
  );
}
