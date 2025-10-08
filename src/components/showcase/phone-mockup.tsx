"use client";

import { cn } from "@/lib/utils";

interface PhoneMockupProps {
    children: React.ReactNode;
    className?: string;
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
    // Aspect ratio for Galaxy S24 Ultra is approx 19.5:9, or ~2.16. Let's use aspect-[9/19.5]
    return (
        <div className={cn("w-full max-w-sm mx-auto bg-slate-800 rounded-[2.5rem] p-2 shadow-2xl", className)}>
            <div className="w-full h-full bg-slate-900 rounded-[2rem] p-1">
                <div 
                    className="relative w-full aspect-[9/19.5] bg-background rounded-[1.8rem] overflow-hidden"
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
