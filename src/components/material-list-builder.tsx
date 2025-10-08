
"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { PsInoxLogo } from "./ps-inox-logo";
import { Input } from "./ui/input";
import { PhoneMockup } from "./showcase/phone-mockup";

export function MaterialListBuilder() {
  return (
    <PhoneMockup>
      <div className="relative w-full h-full flex flex-col items-center overflow-auto bg-slate-800 p-1">
        <div className="absolute inset-0 bg-grid-slate-700/[0.4] [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>
        
        <div className="relative z-10 w-full p-1 flex flex-col gap-2">
            <div className="flex justify-center pt-2">
                <PsInoxLogo />
            </div>

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                    type="search"
                    placeholder="Buscar material..."
                    className="w-full rounded-lg bg-slate-900/80 border-slate-700 text-slate-300 pl-8 focus:ring-slate-500"
                />
            </div>
            
            {/* List Area */}
            <div className="flex-1 mt-2">
                <div className="text-center text-slate-500 py-10">
                    <p>Sua lista de materiais aparecerá aqui.</p>
                </div>
            </div>
        </div>
      </div>
    </PhoneMockup>
  );
}
