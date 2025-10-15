import * as React from "react";
import ClientPage from "./client-page";

export default function CalculatorPage({ params }: { params: { id: string } }) {
  return (
      <ClientPage id={params.id} />
  );
}
