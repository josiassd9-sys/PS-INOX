
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { AstmStandards } from "@/components/astm-standards";

export default function AstmPage() {
  return (
    <Dashboard initialCategoryId="informativos/normas-astm">
      <div className="container mx-auto p-4">
        <AstmStandards />
      </div>
    </Dashboard>
  );
}
