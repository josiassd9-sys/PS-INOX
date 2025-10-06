"use client";

import { Warehouse } from "lucide-react";

export function WelcomeScreen() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
                <Warehouse className="h-16 w-16 text-primary/50" />
                <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao PS INOX</h1>
                <p className="text-muted-foreground">Selecione uma categoria no menu lateral para começar a calcular.</p>
            </div>
        </div>
    )
}
