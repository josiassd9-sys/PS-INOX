
"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { PsInoxLogo } from "./ps-inox-logo";
import { Input } from "./ui/input";
import { PhoneMockup } from "./showcase/phone-mockup";
import { ALL_CATEGORIES, Category, ConnectionGroup, ConnectionItem, SteelItem } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

export function MaterialListBuilder() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return [];
  
    const safeSearchTerm = searchTerm.replace(",", ".").toLowerCase();
  
    return ALL_CATEGORIES.map((category) => {
        // Skip categories that are just tools/info
        if (['retalhos', 'package-checker', 'balanca', 'tabela-sucata', 'normas-astm', 'processos-fabricacao', 'desenho-tecnico'].includes(category.id)) {
            return null;
        }

        let filteredItems: any[] = [];
  
        if (category.id === "conexoes") {
          const connectionGroups = category.items as ConnectionGroup[];
          const filteredGroups = connectionGroups
            .map((group) => {
              const items = group.items.filter(
                (item: ConnectionItem) =>
                  item.description &&
                  item.description
                    .toLowerCase()
                    .replace(",", ".")
                    .includes(safeSearchTerm)
              );
              return { ...group, items };
            })
            .filter((group) => group.items.length > 0);
          
          if (filteredGroups.length > 0) {
             return { ...category, items: filteredGroups };
          }
           return null;
  
        } else {
            if (Array.isArray(category.items)) {
                filteredItems = (category.items as SteelItem[]).filter(
                    (item) =>
                    item.description &&
                    item.description
                        .toLowerCase()
                        .replace(",", ".")
                        .includes(safeSearchTerm)
                );
            }
        }
        
        if (filteredItems.length > 0) {
            return { ...category, items: filteredItems };
        }
        
        return null;
        
      })
      .filter((category): category is Category => category !== null && category.items.length > 0);
  }, [searchTerm]);


  const renderResults = () => {
    if (!searchTerm) {
      return (
        <div className="text-center text-slate-500 py-10">
          <p>Comece a digitar para buscar um material.</p>
        </div>
      );
    }

    if (filteredCategories.length === 0) {
        return (
            <div className="text-center text-slate-500 py-10">
                <p>Nenhum material encontrado para "{searchTerm}".</p>
            </div>
        );
    }

    return (
        <Accordion type="multiple" className="w-full space-y-1" defaultValue={filteredCategories.map(c => c.id)}>
            {filteredCategories.map(category => (
                <AccordionItem value={category.id} key={category.id} className="border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
                    <AccordionTrigger className="px-2 py-2 hover:bg-slate-700/50 text-base font-semibold text-slate-300">
                        {category.name} ({category.id === 'conexoes' ? (category.items as ConnectionGroup[]).reduce((acc, g) => acc + g.items.length, 0) : category.items.length})
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                         <div className="overflow-auto border-t border-slate-700">
                            <Table>
                                <TableBody>
                                    {(category.items as SteelItem[]).map(item => (
                                        <TableRow key={item.id} className="border-slate-800 hover:bg-slate-700/30 cursor-pointer">
                                            <TableCell className="text-slate-400 text-xs p-2">
                                                {item.description}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
  }

  return (
    <PhoneMockup>
      <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-800 p-1">
        <div className="absolute inset-0 bg-grid-slate-700/[0.4] [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>
        
        <div className="relative z-10 w-full p-1 flex flex-col gap-2 shrink-0">
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* List Area */}
        <div className="flex-1 mt-2 overflow-y-auto relative z-10 p-1">
            {renderResults()}
        </div>
      </div>
    </PhoneMockup>
  );
}
