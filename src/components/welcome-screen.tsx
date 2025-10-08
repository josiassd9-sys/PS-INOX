"use client";

import { PhoneMockup } from "@/components/showcase/phone-mockup";
import { BlueprintMinimalist } from "@/components/showcase/blueprint-minimalist";

interface WelcomeScreenProps {
    onSelectCategory: (categoryId: string) => void;
}

export function WelcomeScreen({ onSelectCategory }: WelcomeScreenProps) {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-slate-900">
            <PhoneMockup>
                <BlueprintMinimalist onSelectCategory={onSelectCategory} />
            </PhoneMockup>
        </div>
    )
}
