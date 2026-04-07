
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
    const isMobile = useIsMobile();

    return (
        <div className={cn(
            "w-full print:hidden",
            isMobile
                ? "flex gap-2 overflow-x-auto rounded-xl border border-border/60 bg-card/80 p-2 shadow-md"
                : "grid grid-cols-4 md:grid-cols-8 gap-1 rounded-md bg-muted p-1"
        )}>
            {tabs.map((tab) => (
                <Link
                    key={tab.name}
                    href={tab.href}
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "transition-all text-xs sm:text-sm",
                        isMobile && "min-w-max rounded-lg px-3 py-2 whitespace-nowrap border border-transparent",
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
