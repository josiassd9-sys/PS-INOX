import { BlueprintMinimalist } from "@/components/showcase/blueprint-minimalist";
import { PhoneMockup } from "@/components/showcase/phone-mockup";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">PS INOX</h1>
        <p className="text-muted-foreground">
          Interface de Navegação Principal
        </p>
      </div>
      <PhoneMockup>
        <BlueprintMinimalist />
      </PhoneMockup>
    </main>
  );
}
