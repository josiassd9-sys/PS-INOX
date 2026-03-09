
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const tabs = [
    { name: "1. Geometria", href: "/perfis/calculadora/geometria" },
    { name: "2. Laje", href: "/perfis/calculadora/laje" },
    { name: "3. Viga Sec.", href: "/perfis/calculadora/viga-secundaria" },
    { name: "4. Viga Princ.", href: "/perfis/calculadora/viga-principal" },
    { name: "5. Pilar", href: "/perfis/calculadora/pilar" },
    { name: "6. Sapata", href: "/perfis/calculadora/sapata" },
    { name: "7. Armadura", href: "/perfis/calculadora/armadura-sapata" },
    { name: "8. Visualização", href: "/perfis/calculadora/visualizacao" },
];

export function CalculatorTabs() {
    const pathname = usePathname();

    return (
        <div className="grid w-full grid-cols-4 md:grid-cols-8 gap-1 p-1 rounded-md bg-muted print:hidden">
            {tabs.map((tab) => (
                <Link
                    key={tab.name}
                    href={tab.href}
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "transition-all text-xs sm:text-sm",
                        pathname === tab.href
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-background/50"
                    )}
                >
                    {tab.name}
                </Link>
            ))}
        </div>
    );
}
