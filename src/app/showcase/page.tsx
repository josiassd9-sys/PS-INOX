import { BlueprintMinimalist } from "@/components/showcase/blueprint-minimalist";
import { ExplodedView } from "@/components/showcase/exploded-view";
import { MaterialFlow } from "@/components/showcase/material-flow";
import { MetallicMosaic } from "@/components/showcase/metallic-mosaic";
import { PhoneMockup } from "@/components/showcase/phone-mockup";
import { SculpturalComposition } from "@/components/showcase/sculptural-composition";
import { Separator } from "@/components/ui/separator";

export default function ShowcasePage() {
    return (
        <div className="flex flex-col items-center gap-12 p-4 bg-muted/40">
            <div className="text-center mt-8">
                <h1 className="text-3xl font-bold">Propostas de Design para a Página Inicial</h1>
                <p className="text-muted-foreground">
                    Abaixo estão as 5 propostas visuais, cada uma em um simulador de celular.
                </p>
            </div>

            <PhoneMockup>
                <MetallicMosaic />
            </PhoneMockup>

            <Separator />

            <PhoneMockup>
                <SculpturalComposition />
            </PhoneMockup>

            <Separator />

            <PhoneMockup>
                <ExplodedView />
            </PhoneMockup>
            
            <Separator />

            <PhoneMockup>
                <MaterialFlow />
            </PhoneMockup>

            <Separator />

            <PhoneMockup>
                <BlueprintMinimalist />
            </PhoneMockup>

        </div>
    );
}
