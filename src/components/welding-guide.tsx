
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
        title: "O que é Soldagem?",
        icon: "Flame",
        content: (
            <p>
                A soldagem é um processo de fabricação que une materiais, geralmente metais ou termoplásticos, usando altas temperaturas para fundir as partes e permitir que elas se tornem uma única peça após o resfriamento. É um processo fundamental em quase toda a indústria metalmecânica, desde a fabricação de pequenas estruturas até a construção de navios e plataformas de petróleo. A escolha do processo de solda correto é crucial para garantir a integridade, resistência e qualidade da união.
            </p>
        ),
    },
    {
        id: "tig",
        title: "Soldagem TIG (GTAW)",
        icon: "CheckCircle",
        content: (
            <div>
                <p className="mb-2">
                    <strong>TIG (Tungsten Inert Gas)</strong>, ou <strong>GTAW (Gas Tungsten Arc Welding)</strong>, é um processo de soldagem a arco que utiliza um eletrodo de tungstênio não consumível para criar o arco elétrico. A poça de fusão e o eletrodo são protegidos da contaminação atmosférica por um gás inerte, geralmente Argônio.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Como Funciona:</strong> O arco é estabelecido entre a ponta do eletrodo de tungstênio e a peça de trabalho. O calor do arco funde os metais. Se necessário, um metal de adição (vareta) é alimentado manualmente na poça de fusão.</li>
                    <li><strong>Aplicações:</strong> Ideal para chapas finas, tubos sanitários (aço inox), peças de alumínio e titânio, e aplicações que exigem um acabamento visual impecável e soldas de alta qualidade, como na indústria aeroespacial e de alimentos.</li>
                    <li><strong>Vantagens:</strong> Soldas de altíssima qualidade e pureza, excelente acabamento, sem respingos (spatter), e grande controle sobre o processo.</li>
                    <li><strong>Desvantagens:</strong> Processo mais lento, requer alta habilidade do soldador e é menos tolerante a impurezas.</li>
                </ul>
            </div>
        ),
    },
    {
        id: "mig-mag",
        title: "Soldagem MIG/MAG (GMAW)",
        icon: "Workflow",
        content: (
            <div>
                <p className="mb-2">
                    <strong>MIG (Metal Inert Gas)</strong> ou <strong>MAG (Metal Active Gas)</strong>, tecnicamente chamado de <strong>GMAW (Gas Metal Arc Welding)</strong>, é um processo semiautomático que utiliza um arame consumível que é alimentado continuamente. O arame serve tanto como eletrodo para criar o arco quanto como metal de adição.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Como Funciona:</strong> Ao pressionar o gatilho da tocha, o arame é alimentado e um gás de proteção é liberado para proteger a poça de fusão. A diferença entre MIG e MAG está no gás: MIG usa gás inerte (Argônio) para não-ferrosos, enquanto MAG usa uma mistura de gases ativos (CO2, Oxigênio) para aços carbono, otimizando a penetração.</li>
                    <li><strong>Aplicações:</strong> Extremamente versátil, é o processo mais usado na indústria em geral, desde serralherias até grandes estaleiros e montadoras automotivas. Ideal para chapas de espessura média a grossa.</li>
                    <li><strong>Vantagens:</strong> Alta produtividade e velocidade de soldagem, fácil de automatizar, soldas de boa qualidade com menos necessidade de limpeza.</li>
                    <li><strong>Desvantagens:</strong> Equipamento mais complexo e menos portátil que o eletrodo revestido, sensível a ventos (por causa do gás de proteção).</li>
                </ul>
            </div>
        ),
    },
    {
        id: "smaw",
        title: "Eletrodo Revestido (SMAW)",
        icon: "Cog",
        content: (
            <div>
                <p className="mb-2">
                    A <strong>Soldagem a Arco com Eletrodo Revestido (SMAW - Shielded Metal Arc Welding)</strong> é um processo manual que utiliza um eletrodo consumível coberto por um fluxo.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Como Funciona:</strong> O calor do arco elétrico entre o eletrodo e a peça de trabalho funde ambos. O revestimento do eletrodo também queima, gerando gases que protegem a poça de fusão e formando uma camada de escória que protege a solda durante o resfriamento.</li>
                    <li><strong>Aplicações:</strong> Muito comum em manutenção, reparos, montagens em campo e soldagem de estruturas pesadas. É extremamente versátil para diferentes tipos de metais, posições de soldagem e ambientes.</li>
                    <li><strong>Vantagens:</strong> Equipamento simples, barato e portátil. Menos sensível a vento e contaminações, tornando-o ideal para trabalhos externos.</li>
                    <li><strong>Desvantagens:</strong> Baixa produtividade (requer troca constante de eletrodos), gera muita fumaça e respingos, e a remoção da escória é uma etapa adicional necessária.</li>
                </ul>
            </div>
        ),
    },
     {
        id: "rsw",
        title: "Solda a Ponto (RSW)",
        icon: "Car",
        content: (
            <div>
                <p className="mb-2">
                    A <strong>Soldagem por Resistência a Ponto (RSW - Resistance Spot Welding)</strong> é um processo que une chapas de metal sobrepostas aplicando pressão e uma forte corrente elétrica através de eletrodos de cobre.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Como Funciona:</strong> O calor é gerado pela resistência à passagem da corrente elétrica no ponto de contato entre as chapas. O metal se funde nesse ponto e, sob pressão, forma um núcleo de solda.</li>
                    <li><strong>Aplicações:</strong> É o processo dominante na indústria automotiva para a montagem de carrocerias e na fabricação de eletrodomésticos. Ideal para produção em massa de chapas finas.</li>
                    <li><strong>Vantagens:</strong> Processo extremamente rápido (frações de segundo por ponto), facilmente automatizado com robôs, não requer metal de adição nem gases.</li>
                    <li><strong>Desvantagens:</strong> Limitado a chapas sobrepostas e com acesso de ambos os lados.</li>
                </ul>
            </div>
        ),
    },
]

export function WeldingGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia de Processos de Soldagem</CardTitle>
          <CardDescription>
            Conheça os principais métodos para unir metais na indústria, suas aplicações, vantagens e desvantagens.
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

    