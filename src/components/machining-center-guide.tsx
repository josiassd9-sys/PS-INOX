
"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Icon } from "./icons"

const topics = [
    {
        id: "conceito",
        title: "O que é um Centro de Usinagem?",
        icon: "Factory",
        content: (
            <p>
                Centros de usinagem são máquinas-ferramenta CNC (Controle Numérico Computadorizado) altamente automatizadas e versáteis, fundamentais na fabricação moderna. Sua principal vantagem é a capacidade de realizar múltiplas operações de usinagem (como fresamento, furação, mandrilamento e rosqueamento) em uma peça, tudo em uma única fixação (setup). Essa precisão, repetibilidade e automação os tornam essenciais em setores que exigem componentes complexos e de alta qualidade.
            </p>
        ),
    },
    {
        id: "tipos",
        title: "Tipos de Centros de Usinagem",
        icon: "Cog",
        content: (
            <ul className="list-disc pl-5 space-y-2">
                <li>
                    <strong>Centro de Usinagem Vertical (VMC):</strong> O eixo-árvore (onde a ferramenta gira) é vertical. Ideal para peças com geometrias complexas em 3 eixos, como moldes, placas, e componentes onde a maior parte do trabalho é feita na face superior.
                </li>
                <li>
                    <strong>Centro de Usinagem Horizontal (HMC):</strong> O eixo-árvore é horizontal. Adequado para produção em alto volume e usinagem pesada, como blocos de motor e caixas de transmissão. Frequentemente utiliza trocadores de paletes para minimizar o tempo de máquina parada.
                </li>
                <li>
                    <strong>Centro de Usinagem de 5 Eixos:</strong> Permite que a ferramenta de corte ou a peça se mova em cinco eixos simultaneamente. Use para peças com geometria altamente complexa (pás de turbinas, implantes médicos) em uma única fixação, garantindo maior precisão e eliminando a necessidade de múltiplos setups.
                </li>
                <li>
                    <strong>Centro Multitarefa (Multi-Tasking):</strong> Combina fresamento (ferramenta giratória) e torneamento (peça giratória) em uma única máquina. Ideal para peças cilíndricas com recursos complexos (furos fora de centro, fresamentos, etc.).
                </li>
            </ul>
        ),
    },
    {
        id: "ferramentas",
        title: "Ferramentas e Materiais Essenciais",
        icon: "PackageCheck",
        content: (
             <ul className="list-disc pl-5 space-y-1">
                <li><strong>Ferramentas de Corte:</strong> Fresas (topo, facear, esféricas), brocas, machos para rosca, alargadores.</li>
                <li><strong>Sistemas de Fixação:</strong> Placas, morsas hidráulicas ou mecânicas, e dispositivos especiais projetados para a peça.</li>
                <li><strong>Programação CNC:</strong> Conhecimento em códigos G e M (padrão ISO), ciclos fixos e subprogramas.</li>
                <li><strong>Fluidos de Corte:</strong> Óleos solúveis ou integrais para refrigeração e lubrificação, essenciais para a vida útil da ferramenta e acabamento da peça.</li>
                <li><strong>Sistemas de Troca Automática (ATC):</strong> Magazine de ferramentas que permite a troca automática de acordo com o programa.</li>
                <li><strong>Sistemas de Medição:</strong> Apalpadores (probes) para zeramento da peça e medição em processo.</li>
                <li><strong>Automação (Opcional):</strong> Paletes trocáveis ou robôs para carga e descarga, permitindo produção contínua.</li>
            </ul>
        ),
    },
    {
        id: "passos",
        title: "Passo a Passo da Operação",
        icon: "ClipboardList",
        content: (
            <ol className="list-decimal pl-5 space-y-3">
                <li>
                    <strong>Definição e Planejamento:</strong> Identifique as necessidades da peça e o setor (automotivo, aeroespacial, médico) para definir a estratégia de usinagem e o centro mais adequado.
                </li>
                <li>
                    <strong>Preparação da Máquina e Peça:</strong>
                    <ul className="list-disc pl-5 mt-1">
                        <li>Realize a manutenção preventiva básica (verificar níveis de fluidos, limpeza).</li>
                        <li>Fixe a peça de forma rígida na mesa ou no dispositivo, garantindo acessibilidade para as ferramentas.</li>
                        <li>Carregue as ferramentas de corte necessárias no magazine do ATC e calibre seus comprimentos e diâmetros.</li>
                    </ul>
                </li>
                <li>
                    <strong>Programação e Simulação CNC:</strong>
                    <ul className="list-disc pl-5 mt-1">
                        <li>Carregue o programa CNC na máquina.</li>
                        <li>Realize uma simulação gráfica ("teste a seco" ou "dry run") para verificar a trajetória da ferramenta e evitar colisões.</li>
                    </ul>
                </li>
                <li>
                    <strong>Execução da Usinagem:</strong>
                     <ul className="list-disc pl-5 mt-1">
                        <li>Inicie o ciclo com os parâmetros de corte otimizados (velocidade de corte, avanço, profundidade de corte - AP/AE).</li>
                        <li>Monitore a remoção de cavacos, o som da usinagem e a refrigeração para garantir que tudo está ocorrendo como planejado.</li>
                    </ul>
                </li>
                <li>
                    <strong>Inspeção e Controle de Qualidade:</strong>
                    <ul className="list-disc pl-5 mt-1">
                        <li>Após a usinagem, verifique as dimensões críticas com instrumentos de medição (paquímetro, micrômetro, CMM - Máquina de Medir por Coordenadas).</li>
                        <li>Garanta que o acabamento superficial e as tolerâncias dimensionais e geométricas estão de acordo com o especificado no desenho técnico.</li>
                    </ul>
                </li>
            </ol>
        ),
    }
];

export function MachiningCenterGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia de Centros de Usinagem CNC</CardTitle>
          <CardDescription>
            Um guia sobre a operação, tipos e aplicações dos centros de usinagem, as máquinas-ferramenta no coração da indústria moderna.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full" defaultValue="conceito">
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

    