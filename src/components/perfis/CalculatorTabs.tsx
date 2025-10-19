
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const tabs = [
    { name: "1. Laje", href: "/perfis/calculadora/laje" },
    { name: "2. Viga Sec.", href: "/perfis/calculadora/viga-secundaria" },
    { name: "3. Viga Princ.", href: "/perfis/calculadora/viga-principal" },
    { name: "4. Pilar", href: "/perfis/calculadora/pilar" },
];

export function CalculatorTabs() {
    const pathname = usePathname();

    return (
        <div className="grid w-full grid-cols-4 gap-1 p-1 rounded-md bg-muted print:hidden">
            {tabs.map((tab) => (
                <Link
                    key={tab.name}
                    href={tab.href}
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "transition-all",
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
