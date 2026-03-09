"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";

export function GlobalMenuTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="fixed top-2 left-2 z-50 print:hidden">
        <Button onClick={toggleSidebar} variant="outline" size="icon" className="h-8 w-8 bg-background/50 backdrop-blur-sm">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
        </Button>
    </div>
  );
}
