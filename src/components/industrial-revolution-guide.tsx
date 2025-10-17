
"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Icon } from "./icons"

const topics = [
    {
        id: "intro",
        title: "A Primeira Revolução Industrial: O Berço da Indústria",
        icon: "BookOpen",
        content: (
            <p>
                O início dos processos de produção industrial no mundo está diretamente ligado à Primeira Revolução Industrial, que começou na Inglaterra por volta de 1760. Este período marcou a transição fundamental da produção artesanal para a mecanizada em fábricas, inaugurando o modelo de economia industrial moderna. A produção deixou de ser feita em pequenas oficinas e passou a ocorrer em larga escala, com divisão do trabalho e padronização de produtos.
            </p>
        ),
    },
    {
        id: "caracteristicas",
        title: "Características da Primeira Revolução Industrial",
        icon: "ClipboardList",
        content: (
             <ul className="list-disc pl-5 space-y-2">
                <li><strong>Máquina a Vapor:</strong> Uso da invenção de James Watt como principal fonte de energia, substituindo a força humana e animal.</li>
                <li><strong>Combustível Fóssil:</strong> Utilização do carvão mineral como combustível para as máquinas e indústrias.</li>
                <li><strong>Mecanização Têxtil:</strong> Inovações como a fiandeira "mule" e o tear mecânico revolucionaram a produção de tecidos.</li>
                <li><strong>Transporte:</strong> Desenvolvimento da locomotiva e dos navios a vapor, que facilitaram o transporte de matérias-primas e o escoamento da produção em massa.</li>
                <li><strong>Comunicações:</strong> A criação do telégrafo agilizou a comunicação a longas distâncias.</li>
            </ul>
        ),
    },
    {
        id: "fatores",
        title: "Fatores que Impulsionaram o Processo na Inglaterra",
        icon: "Factory",
        content: (
            <p className="mb-2">A Inglaterra foi pioneira na industrialização devido a uma combinação única de fatores:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>Capital Acumulado:</strong> A burguesia inglesa acumulou riqueza através do comércio colonial e da agricultura modernizada.</li>
                <li><strong>Recursos Naturais:</strong> O país possuía grandes reservas de carvão e ferro, essenciais para a indústria.</li>
                <li><strong>Mão de Obra:</strong> O cercamento dos campos ("enclosures") expulsou camponeses para as cidades, criando uma mão de obra abundante e barata.</li>
                <li><strong>Mercado e Transporte:</strong> Uma poderosa frota mercante e uma política econômica liberal garantiram o acesso a mercados e o incentivo a investimentos.</li>
            </ul>
        ),
    },
    {
        id: "impactos",
        title: "Impactos Sociais e Econômicos Iniciais",
        icon: "Users",
        content: (
            <div>
                <p className="mb-2">A industrialização trouxe transformações profundas e, muitas vezes, brutais:</p>
                 <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Urbanização Acelerada:</strong> Crescimento desordenado das cidades devido ao êxodo rural.</li>
                    <li><strong>Nova Estrutura Social:</strong> Surgimento da classe operária (proletariado), submetida a condições de trabalho precárias, com longas jornadas e baixos salários.</li>
                    <li><strong>Desigualdade:</strong> Aumento do abismo social entre a burguesia industrial (dona das fábricas) e os operários.</li>
                    <li><strong>Exploração:</strong> O trabalho infantil era comum e amplamente explorado nas fábricas.</li>
                    <li><strong>Consolidação do Capitalismo:</strong> O modelo industrial solidificou o capitalismo como o sistema econômico dominante.</li>
                </ul>
            </div>
        ),
    },
    {
        id: "expansao",
        title: "Expansão para Outros Países",
        icon: "Globe",
        content: (
            <p>
                Após a Inglaterra, a industrialização se espalhou pelo mundo. Bélgica, França e Alemanha foram os primeiros na Europa continental. Os Estados Unidos iniciaram seu processo no final do século XVIII, e, mais tarde, durante a Segunda Revolução Industrial, países como Japão e Rússia também se industrializaram, cada um adaptando o modelo às suas próprias realidades.
            </p>
        ),
    }
];

export function IndustrialRevolutionGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia do Início da Produção Industrial</CardTitle>
          <CardDescription>
            Explore como a Primeira Revolução Industrial transformou o mundo, da produção artesanal à indústria mecanizada.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full" defaultValue="intro">
          {topics.map(topic => (
              <AccordionItem value={topic.id} key={topic.id}>
                  <AccordionTrigger className="text-base font-semibold hover:bg-primary/10 px-1">
                    <div className="flex items-center gap-2">
                        <Icon name={topic.icon as any} className="h-5 w-5 text-primary" />
                        {topic.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-1 py-1 border-t bg-primary/5 text-base">
                      {topic.content}
                  </AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </>
  )
}
