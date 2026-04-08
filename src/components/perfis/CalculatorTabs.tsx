
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { RefinedCard } from "@/components/refined-components";

const tabs = [
    { step: 1, short: "Geometria", title: "Geometria", href: "/perfis/calculadora/geometria" },
    { step: 2, short: "Laje", title: "Laje", href: "/perfis/calculadora/laje" },
    { step: 3, short: "Viga Sec.", title: "Viga Secundária", href: "/perfis/calculadora/viga-secundaria" },
    { step: 4, short: "Viga Princ.", title: "Viga Principal", href: "/perfis/calculadora/viga-principal" },
    { step: 5, short: "Pilar", title: "Pilar", href: "/perfis/calculadora/pilar" },
    { step: 6, short: "Sapata", title: "Sapata", href: "/perfis/calculadora/sapata" },
    { step: 7, short: "Armadura", title: "Armadura", href: "/perfis/calculadora/armadura-sapata" },
    { step: 8, short: "Visualização", title: "Visualização", href: "/perfis/calculadora/visualizacao" },
];

export function CalculatorTabs() {
    const pathname = usePathname();
    const activeIndex = Math.max(0, tabs.findIndex((tab) => pathname === tab.href));
    const progress = ((activeIndex + 1) / tabs.length) * 100;

    return (
        <RefinedCard hover="subtle" className="w-full overflow-hidden p-0 print:hidden">
            <div className="border-b bg-muted/20 px-3 py-2.5 sm:px-4">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold tracking-tight">Fluxo Estrutural</p>
                    <p className="text-xs text-muted-foreground">
                        Etapa {activeIndex + 1} de {tabs.length}
                    </p>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-4 lg:grid-cols-8">
                {tabs.map((tab, index) => {
                    const isActive = pathname === tab.href;
                    const isCompleted = index < activeIndex;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "group flex min-w-0 flex-col items-start gap-1 rounded-lg border px-2.5 py-2 text-left transition-all duration-200",
                                isActive
                                    ? "border-primary/35 bg-primary/10 shadow-sm"
                                    : isCompleted
                                      ? "border-green-500/30 bg-green-500/10 hover:border-green-500/45"
                                      : "border-border/70 bg-background hover:border-primary/25 hover:bg-muted/30"
                            )}
                        >
                            <div className="flex w-full items-center justify-between gap-2">
                                <span className={cn(
                                    "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : isCompleted
                                          ? "bg-green-600 text-white"
                                          : "bg-muted text-muted-foreground"
                                )}>
                                    {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : tab.step}
                                </span>
                            </div>
                            <span className={cn(
                                "line-clamp-2 text-[11px] leading-tight sm:text-xs",
                                isActive ? "font-semibold text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {tab.short}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </RefinedCard>
    );
}
