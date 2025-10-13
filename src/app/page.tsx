"use client";

import * as React from "react";
import { MaterialListBuilder } from "@/components/material-list-builder";

export default function HomePage() {
  const mainContent = <MaterialListBuilder />;

  return (
    <>
      <main className="h-screen bg-background">
        <div className="h-full">{mainContent}</div>
      </main>
    </>
  );
}
