
"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronDown, CheckCircle2 } from "lucide-react";
import { RefinedCard } from "@/components/refined-components";

const tabs = [
    { step: 1, title: "Geometria", href: "/perfis/calculadora/geometria" },
    { step: 2, title: "Laje", href: "/perfis/calculadora/laje" },
    { step: 3, title: "Viga Secundária", href: "/perfis/calculadora/viga-secundaria" },
    { step: 4, title: "Viga Principal", href: "/perfis/calculadora/viga-principal" },
    { step: 5, title: "Pilar", href: "/perfis/calculadora/pilar" },
    { step: 6, title: "Sapata", href: "/perfis/calculadora/sapata" },
    { step: 7, title: "Armadura", href: "/perfis/calculadora/armadura-sapata" },
    { step: 8, title: "Visualização", href: "/perfis/calculadora/visualizacao" },
];

export function CalculatorTabs() {
    const pathname = usePathname();
    const router = useRouter();
    const activeIndex = Math.max(0, tabs.findIndex((tab) => pathname === tab.href));
    const progress = ((activeIndex + 1) / tabs.length) * 100;

    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    const haptic = React.useCallback(() => {
        const h = (window as any)?.Capacitor?.Plugins?.Haptics;
        if (h?.selectionChanged) { h.selectionChanged(); return; }
        if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
    }, []);

    const navigateTo = React.useCallback((href: string) => {
        haptic();
        router.push(href);
        setMenuOpen(false);
    }, [haptic, router]);

    const goBack = () => { if (activeIndex > 0) navigateTo(tabs[activeIndex - 1].href); };
    const goForward = () => { if (activeIndex < tabs.length - 1) navigateTo(tabs[activeIndex + 1].href); };

    React.useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    const active = tabs[activeIndex];

    return (
        <RefinedCard hover="subtle" className="w-full overflow-hidden p-0 print:hidden">
            {/* Single navigation row */}
            <div className="flex items-center gap-1.5 px-2 py-2 sm:px-3">
                {/* Back */}
                <button
                    onClick={goBack}
                    disabled={activeIndex === 0}
                    aria-label="Etapa anterior"
                    className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border transition-colors active:scale-95",
                        activeIndex === 0
                            ? "cursor-not-allowed border-border/30 text-muted-foreground/30"
                            : "border-border hover:bg-muted"
                    )}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Current step label */}
                <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
                    <span className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                        {activeIndex + 1}
                    </span>
                    <span className="truncate text-sm font-semibold tracking-tight">
                        {active.title}
                    </span>
                    <span className="flex-shrink-0 text-xs text-muted-foreground">/ {tabs.length}</span>
                </div>

                {/* Forward */}
                <button
                    onClick={goForward}
                    disabled={activeIndex === tabs.length - 1}
                    aria-label="Próxima etapa"
                    className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border transition-colors active:scale-95",
                        activeIndex === tabs.length - 1
                            ? "cursor-not-allowed border-border/30 text-muted-foreground/30"
                            : "border-border hover:bg-muted"
                    )}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

                {/* All-steps dropdown */}
                <div className="relative ml-0.5 flex-shrink-0" ref={menuRef}>
                    <button
                        onClick={() => { haptic(); setMenuOpen((v) => !v); }}
                        aria-label="Ver todas as etapas"
                        className={cn(
                            "flex h-8 items-center gap-1 rounded-md border px-2 text-xs font-medium transition-colors",
                            menuOpen
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : "border-border hover:bg-muted"
                        )}
                    >
                        <span className="hidden sm:inline">Etapas</span>
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", menuOpen && "rotate-180")} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-xl border bg-popover shadow-lg">
                            <div className="p-1">
                                {tabs.map((tab, index) => {
                                    const isActive = index === activeIndex;
                                    const isCompleted = index < activeIndex;
                                    return (
                                        <button
                                            key={tab.href}
                                            onClick={() => navigateTo(tab.href)}
                                            className={cn(
                                                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                                                isActive
                                                    ? "bg-primary/10 font-semibold text-foreground"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <span className={cn(
                                                "inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : isCompleted
                                                      ? "bg-green-600 text-white"
                                                      : "bg-muted text-muted-foreground"
                                            )}>
                                                {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : tab.step}
                                            </span>
                                            <span className="truncate">{tab.title}</span>
                                            {isActive && (
                                                <span className="ml-auto flex-shrink-0 text-[10px] text-muted-foreground">atual</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="px-3 pb-2.5">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </RefinedCard>
    );
}
