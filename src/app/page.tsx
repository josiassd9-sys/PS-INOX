"use client";

import { BlueprintMinimalist } from "@/components/showcase/blueprint-minimalist";
import { useRouter } from 'next/navigation';
import { PsInoxLogo } from "@/components/ps-inox-logo";

export default function HomePage() {
    const router = useRouter();

    const handleSelectCategory = (categoryId: string) => {
        if (!categoryId) return;

        if (categoryId === 'retalho-inox') {
            router.push('/retalho-inox');
        } else if (categoryId === 'lista-materiais') {
            router.push('/lista-materiais');
        } else {
            router.push(`/calculator/${categoryId}`);
        }
    };

    return (
        <main className="w-full h-screen bg-slate-800">
            <BlueprintMinimalist onSelectCategory={handleSelectCategory} />
        </main>
    );
}
