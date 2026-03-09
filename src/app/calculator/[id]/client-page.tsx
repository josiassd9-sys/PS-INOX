"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";

export default function ClientPage({ id }: { id: string }) {
  return (
      <Dashboard initialCategoryId={id} />
  );
}
