import { BlueprintMinimalist } from "@/components/showcase/blueprint-minimalist";
import { PhoneMockup } from "@/components/showcase/phone-mockup";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <PhoneMockup>
        <BlueprintMinimalist />
      </PhoneMockup>
    </main>
  );
}
