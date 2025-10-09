"use client";

import { ScrapListBuilder } from "@/components/scrap-list-builder";
import { PhoneMockup } from "@/components/showcase/phone-mockup";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone } from "lucide-react";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";

const MOCKUP_VIEW_KEY = "mockupViewEnabled";

export default function RetalhoInoxPage() {
  const [mockupView, setMockupView] = React.useState(true);
  const { toast } = useToast();
  const isInitialMount = React.useRef(true);

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

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      localStorage.setItem(MOCKUP_VIEW_KEY, JSON.stringify(mockupView));
      toast({
        title: `Visualização Alterada`,
        description: `Modo ${mockupView ? "celular" : "desktop"} ativado.`,
      });
    } catch (error) {
      console.error("Failed to save mockup view preference", error);
    }
  }, [mockupView, toast]);

  const toggleMockupView = () => {
    setMockupView((prev) => !prev);
  };

  const mainContent = <ScrapListBuilder />;

  return (
    <>
      <main
        className={
          !mockupView
            ? "h-screen bg-background"
            : "flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4"
        }
      >
        {mockupView ? (
          <PhoneMockup>{mainContent}</PhoneMockup>
        ) : (
          <div className="h-full">{mainContent}</div>
        )}
      </main>
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMockupView}
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg"
        aria-label="Alternar visualização"
      >
        {mockupView ? (
          <Monitor className="h-6 w-6" />
        ) : (
          <Smartphone className="h-6 w-6" />
        )}
      </Button>
    </>
  );
}
