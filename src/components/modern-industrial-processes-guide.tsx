
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
        title: "Indústria 4.0: A Quarta Revolução Industrial",
        icon: "Workflow",
        content: (
            <p>
                Os processos de produção industrial mais modernos estão profundamente integrados à Indústria 4.0, caracterizada pela digitalização, conectividade e automação inteligente. Esses avanços permitem maior eficiência, flexibilidade, personalização e controle em tempo real sobre toda a cadeia de produção. Fábricas inteligentes utilizam uma combinação de sensores, Internet das Coisas (IoT), inteligência artificial (IA), robótica avançada e análise de dados para otimizar operações, prever falhas e reduzir desperdícios.
            </p>
        ),
    },
    {
        id: "producao-continua",
        title: "Produção Contínua com Automação Avançada",
        icon: "Factory",
        content: (
             <p>
                Este modelo, comum em indústrias como petroquímica, alimentícia e farmacêutica, opera 24/7 com mínima intervenção humana. A modernização inclui o uso de sistemas ciber-físicos que monitoram a qualidade e o desempenho em tempo real, com Controladores Lógicos Programáveis (CLPs) ajustando automaticamente parâmetros como temperatura, pressão e fluxo para garantir precisão e consistência.
            </p>
        ),
    },
    {
        id: "producao-lote",
        title: "Produção em Lote com Sistemas Inteligentes",
        icon: "BookOpen",
        content: (
            <p>
                A produção em lote foi aprimorada com tecnologias que permitem customização em escala. Em vez de longas paradas entre lotes, sistemas como o APS (Advanced Planning and Scheduling) permitem o sequenciamento dinâmico da produção com base na demanda. Utilizando simulação e machine learning, esses sistemas otimizam o uso de máquinas e reduzem tempos de setup, tornando a produção mais ágil e responsiva.
            </p>
        ),
    },
    {
        id: "manufatura-discreta",
        title: "Manufatura Discreta e Flexibilidade",
        icon: "Car",
        content: (
             <p>
                Comum em setores automotivo e aeroespacial, a manufatura discreta evoluiu com linhas de montagem altamente configuráveis. Robôs colaborativos (cobots) trabalham ao lado de humanos, realizando tarefas repetitivas com alta precisão. A integração com sistemas MES (Manufacturing Execution System) permite o rastreamento completo do produto, da ordem de produção ao embarque, garantindo transparência e qualidade.
            </p>
        ),
    },
    {
        id: "impressao-3d",
        title: "Impressão 3D e Manufatura Aditiva",
        icon: "Layers",
        content: (
            <p>
                A impressão 3D é uma das tecnologias mais disruptivas na produção moderna. Ela permite a criação de peças complexas camada por camada, com menos desperdício de material e maior liberdade de design. É amplamente usada para prototipagem rápida, produção sob demanda e fabricação de peças de baixo volume com geometrias impossíveis de serem alcançadas por métodos tradicionais.
            </p>
        ),
    },
    {
        id: "tecnologias",
        title: "Tecnologias Habilitadoras da Indústria 4.0",
        icon: "Cog",
        content: (
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Internet das Coisas Industrial (IIoT):</strong> Conecta máquinas e sensores para coleta de dados em tempo real.</li>
                <li><strong>Inteligência Artificial e Machine Learning:</strong> Usadas para manutenção preditiva, controle de qualidade e otimização de processos.</li>
                <li><strong>Computação em Nuvem:</strong> Armazena e processa grandes volumes de dados, permitindo acesso remoto e análise avançada.</li>
                <li><strong>Realidade Aumentada (AR):</strong> Auxilia na manutenção e treinamento de operadores com sobreposições digitais.</li>
                <li><strong>Sistemas WMS e MES:</strong> Integram gestão de estoque e execução da produção, melhorando a visibilidade operacional.</li>
            </ul>
        ),
    },
    {
        id: "conclusao",
        title: "Conclusão",
        icon: "CheckCircle",
        content: (
            <p>
                Os processos industriais mais modernos são aqueles que integram digitalização, automação inteligente e conectividade total. Com o avanço da Indústria 4.0, a produção deixa de ser apenas mecanizada para se tornar cognitiva e autônoma, capaz de aprender, prever e se adaptar, garantindo vantagem competitiva em qualidade, velocidade e sustentabilidade.
            </p>
        ),
    },
];

export function ModernIndustrialProcessesGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia de Processos Industriais Modernos</CardTitle>
          <CardDescription>
            Explore os conceitos e tecnologias da Indústria 4.0 que estão transformando a manufatura.
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

    