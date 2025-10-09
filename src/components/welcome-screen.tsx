"use client";

import { BlueprintMinimalist } from "@/components/showcase/blueprint-minimalist";

interface WelcomeScreenProps {
    onSelectCategory: (categoryId: string) => void;
}

export function WelcomeScreen({ onSelectCategory }: WelcomeScreenProps) {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
           <BlueprintMinimalist onSelectCategory={onSelectCategory} />
        </div>
    )
}