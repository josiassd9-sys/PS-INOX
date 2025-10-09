"use client";

import * as React from "react";
import { MaterialListBuilder } from "@/components/material-list-builder";
import { PhoneMockup } from "@/components/showcase/phone-mockup";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MOCKUP_VIEW_KEY = "mockupViewEnabled";

export default function MaterialListPage() {
  const [mockupView, setMockupView] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedPreference = localStorage.getItem(MOCKUP_VIEW_KEY);
      if (savedPreference !== null) {
        setMockupView(JSON.parse(savedPreference));
      }
    } catch (error) {
      console.error("Failed to load mockup view preference", error);
    }
  }, []);

  const toggleMockupView = () => {
    setMockupView(prev => {
      const newPreference = !prev;
      try {
        localStorage.setItem(MOCKUP_VIEW_KEY, JSON.stringify(newPreference));
         toast({
          title: `Visualização Alterada`,
          description: `Modo ${newPreference ? "celular" : "desktop"} ativado.`,
        });
      } catch (error) {
        console.error("Failed to save mockup view preference", error);
      }
      return newPreference;
    });
  };

  const mainContent = <MaterialListBuilder />;

  return (
     <>
      <main className={!mockupView ? "h-screen bg-background" : "flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4"}>
        {mockupView ? <PhoneMockup>{mainContent}</PhoneMockup> : <div className="h-full">{mainContent}</div>}
      </main>
       <Button
        variant="outline"
        size="icon"
        onClick={toggleMockupView}
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg"
        aria-label="Alternar visualização"
      >
        {mockupView ? <Monitor className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
      </Button>
    </>
  );
}