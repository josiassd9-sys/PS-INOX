import { MaterialListBuilder } from "@/components/material-list-builder";
import { PhoneMockup } from "@/components/showcase/phone-mockup";

export default function MaterialListPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <PhoneMockup>
        <MaterialListBuilder />
      </PhoneMockup>
    </main>
  );
}
