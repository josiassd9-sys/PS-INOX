
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
        title: "O que é Transmissão de Potência?",
        icon: "Cog",
        content: (
            <p>
                Transmissão de potência é o processo de transferir energia de um componente que a gera (como um motor elétrico ou um motor a combustão) para outro componente que realiza um trabalho útil (como as rodas de um carro, a lâmina de uma serra ou um transportador industrial). Esse sistema é o coração de quase todas as máquinas, garantindo que a energia seja entregue de forma controlada, eficiente e na velocidade e torque corretos para a aplicação.
            </p>
        ),
    },
    {
        id: "eixos-rolamentos",
        title: "Eixos e Rolamentos",
        icon: "Circle",
        content: (
            <div>
                <p className="mb-2">Eixos e rolamentos formam a base de qualquer sistema rotativo.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong>Eixos:</strong> São componentes cilíndricos, geralmente feitos de aço carbono ou aço-liga de alta resistência, projetados para suportar componentes giratórios como engrenagens, polias e rodas. Sua principal função é transmitir torque e rotação.
                    </li>
                    <li>
                        <strong>Rolamentos:</strong> São elementos de máquina que permitem o movimento rotativo suave entre o eixo e a estrutura fixa, minimizando o atrito e suportando as cargas. Os mais comuns são os rolamentos de esferas (para altas velocidades e cargas mais leves) e os rolamentos de rolos (para cargas mais pesadas).
                    </li>
                </ul>
            </div>
        ),
    },
    {
        id: "engrenagens",
        title: "Engrenagens: Precisão e Torque",
        icon: "Cog",
        content: (
             <p>
                As engrenagens são rodas dentadas usadas para transmitir movimento e torque entre eixos. Elas são essenciais para alterar a velocidade de rotação e multiplicar o torque. A relação entre o número de dentes de duas engrenagens acopladas determina a mudança na velocidade e no torque. Por exemplo, em uma caixa de câmbio de um carro, diferentes combinações de engrenagens são usadas para fornecer mais força em baixas velocidades ou mais velocidade em altas rotações.
            </p>
        ),
    },
    {
        id: "polias-correias",
        title: "Polias e Correias: Versatilidade e Suavidade",
        icon: "AllianceRing",
        content: (
             <p>
                Este sistema consiste em duas ou mais polias (rodas com um sulco) conectadas por uma correia. É um método muito comum para transmitir potência entre eixos que estão a uma certa distância um do outro. A transmissão é suave, silenciosa e absorve choques e vibrações. Um exemplo clássico é o sistema de correias no motor de um carro, que aciona o alternador, a bomba d'água e o compressor do ar-condicionado.
            </p>
        ),
    },
    {
        id: "correntes",
        title: "Correntes e Rodas Dentadas: Robustez e Sincronismo",
        icon: "Link",
        content: (
             <p>
                Similar ao sistema de polias e correias, mas utiliza uma corrente metálica e rodas dentadas (sprockets). Este sistema não permite deslizamento, garantindo uma transmissão perfeitamente sincronizada. É muito mais robusto e capaz de transmitir torques mais elevados, sendo ideal para aplicações como motocicletas, bicicletas e transportadores industriais pesados.
            </p>
        ),
    }
];

export function PowerTransmissionGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia de Transmissão de Potência</CardTitle>
          <CardDescription>
            Entenda como a energia é transferida em sistemas mecânicos através de eixos, engrenagens, correias e outros componentes essenciais.
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
