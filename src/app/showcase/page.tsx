import { BlueprintMinimalist } from "@/components/showcase/blueprint-minimalist";
import { ExplodedView } from "@/components/showcase/exploded-view";
import { MaterialFlow } from "@/components/showcase/material-flow";
import { MetallicMosaic } from "@/components/showcase/metallic-mosaic";
import { SculpturalComposition } from "@/components/showcase/sculptural-composition";
import { Separator } from "@/components/ui/separator";

export default function ShowcasePage() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-3xl font-bold">Propostas de Design para a Página Inicial</h1>
            <p className="text-muted-foreground">
                Abaixo estão as 5 propostas visuais para a nova página inicial. Role para ver cada uma delas.
            </p>

            <Separator />
            <MetallicMosaic />
            <Separator />
            <SculpturalComposition />
            <Separator />
            <ExplodedView />
            <Separator />
            <MaterialFlow />
            <Separator />
            <BlueprintMinimalist />

        </div>
    );
}
