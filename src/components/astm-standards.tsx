"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { StandardLink } from "./standard-link";

const standardsIds = [
  "astmA213", "astmA249", "astmA269", "astmA270", "astmA312",
  "astmA358", "astmA554", "astmA778", "astmA789", "astmA790"
];

export function AstmStandards() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Acabamentos e Tratamentos</CardTitle>
          <CardDescription>
            Além da composição química, o acabamento superficial e os tratamentos térmicos são cruciais para o desempenho e a aparência do aço inoxidável.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="mb-1"><strong className="text-foreground">Recozimento:</strong> Tratamento térmico que alivia as tensões internas do material, geralmente após processos de soldagem ou conformação. Melhora a ductilidade e a resistência à corrosão.</p>
          <p className="mb-1"><strong className="text-foreground">Decapagem e Passivação:</strong> Processo químico que remove impurezas da superfície e restaura a camada passiva de óxido de cromo, que é a responsável pela resistência à corrosão do aço inox.</p>
          <p className="mb-1"><strong className="text-foreground">Acabamento Polido:</strong> Obtido por lixamento com abrasivos finos. Pode ser sanitário (para higiene) ou brilhante (estético). A norma <StandardLink standardId="astmA270" /> é um exemplo focado em acabamento sanitário.</p>
          <p><strong className="text-foreground">Acabamento Escovado (Acetinado):</strong> Cria um visual com riscos finos e uniformes, menos reflexivo que o polido. Muito comum em aplicações arquitetônicas e ornamentais, cobertas pela norma <StandardLink standardId="astmA554" />.</p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
          {standardsIds.map(standardId => (
              <AccordionItem value={standardId} key={standardId}>
                  <AccordionTrigger className="text-base font-semibold hover:bg-primary/10 px-1">
                    <StandardLink standardId={standardId} />
                  </AccordionTrigger>
              </AccordionItem>
          ))}
      </Accordion>
    </>
  )
}
