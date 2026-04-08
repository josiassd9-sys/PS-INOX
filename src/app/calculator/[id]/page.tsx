import * as React from "react";
import ClientPage from "./client-page";
import { ALL_CATEGORIES } from "@/lib/data/index";

export function generateStaticParams() {
  const ids = new Set<string>();

  for (const category of ALL_CATEGORIES) {
    if (category.path?.startsWith("/calculator/")) {
      const routeId = category.path.replace("/calculator/", "");
      if (routeId && !routeId.includes("/")) {
        ids.add(routeId);
      }
      continue;
    }

    if (category.id && !category.id.includes("/")) {
      ids.add(category.id);
    }
  }

  return Array.from(ids).map((id) => ({ id }));
}

export default async function CalculatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
      <ClientPage id={id} />
  );
}
