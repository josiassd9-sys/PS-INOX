
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
        title: "O que é a Linha de Montagem Automotiva?",
        icon: "Workflow",
        content: (
            <p>
                A produção industrial automotiva moderna é um processo estruturado e altamente automatizado, que combina tecnologia de ponta, engenharia de precisão e logística complexa para fabricar veículos com máxima eficiência e qualidade. As principais etapas incluem estamparia, soldagem da carroceria (body shop), pintura, montagem final e um rigoroso controle de qualidade. Além disso, diferentes regimes de produção, como CKD, SKD e CBU, são utilizados globalmente para adaptar a fabricação às realidades de cada mercado.
            </p>
        ),
    },
    {
        id: "principios",
        title: "Princípios Fundamentais de Produção",
        icon: "BookOpen",
        content: (
            <ul className="list-disc pl-5 space-y-2">
                <li>
                    <strong>Produção Artesanal:</strong> Caracterizada pelo baixo volume e alto custo, onde cada veículo é feito praticamente sob medida, com grande intervenção manual. Exemplo clássico: Fabricantes de supercarros de luxo como a Aston Martin.
                </li>
                <li>
                    <strong>Produção em Massa:</strong> Revolucionou a indústria com a introdução de peças intercambiáveis e a linha de montagem, permitindo alta escala de produção a um custo reduzido. Exemplo histórico: Ford Modelo T.
                </li>
                <li>
                    <strong>Produção Enxuta (Lean Manufacturing):</strong> Sistema focado em otimizar recursos e eliminar desperdícios (tempo, material, estoque). Originado na Toyota (Toyota Production System), é o modelo dominante na indústria atual, priorizando a eficiência e a melhoria contínua.
                </li>
            </ul>
        ),
    },
    {
        id: "etapas",
        title: "As 5 Etapas da Linha de Montagem",
        icon: "ClipboardList",
        content: (
            <ol className="list-decimal pl-5 space-y-3">
                <li>
                    <strong>1. Estamparia:</strong> Gigantescas prensas (com força de até 3.000 toneladas) cortam e moldam chapas de aço ou alumínio para criar as peças que formarão a carroceria do veículo, como portas, capô, teto e assoalho.
                </li>
                <li>
                    <strong>2. Estruturação (Body Shop):</strong> É aqui que o "esqueleto" do carro ganha forma. As peças estampadas são unidas por robôs de solda de alta precisão. Em uma fábrica moderna, cerca de 70% ou mais das soldas são automatizadas para garantir a integridade estrutural.
                </li>
                <li>
                    <strong>3. Pintura:</strong> A carroceria montada passa por uma série de banhos químicos e cabines climatizadas. Camadas de primer (proteção anticorrosiva), tinta (cor) e verniz (proteção e brilho) são aplicadas, com um controle rigoroso para evitar qualquer tipo de impureza.
                </li>
                <li>
                    <strong>4. Montagem Final (Final Assembly):</strong> Esta é a fase mais complexa, onde o carro recebe todos os seus componentes. Motor, transmissão, suspensão, sistemas elétricos, painel, bancos, vidros e rodas são instalados em sequência, em uma coreografia que envolve tanto operadores humanos quanto robôs colaborativos.
                </li>
                 <li>
                    <strong>5. Controle de Qualidade e Embarque:</strong> Ao final da linha, cada veículo passa por testes completos em bancadas e, muitas vezes, em uma pista de testes interna. Verifica-se o funcionamento mecânico, elétrico, a vedação e o acabamento. Uma vez aprovado, o carro está pronto para ser enviado às concessionárias. O tempo médio total de montagem pode variar de 15 a 24 horas.
                </li>
            </ol>
        ),
    },
    {
        id: "regimes",
        title: "Regimes de Produção e Importação",
        icon: "Sheet",
        content: (
             <div>
                <p className="mb-2">A forma como um veículo chega ao consumidor depende da estratégia da montadora para cada mercado. No Brasil, por exemplo, vemos três modelos principais:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>CBU (Completely Built Unit):</strong> O carro é importado totalmente pronto para a venda. É comum para modelos de luxo ou de nicho (Ex: Porsche, Volvo).</li>
                    <li><strong>CKD (Completely Knocked Down):</strong> O veículo chega ao país de destino como um "kit" completo de peças. Processos-chave como estamparia e pintura são realizados localmente antes da montagem final. (Ex: Muitas operações da BMW e Chery no Brasil).</li>
                    <li><strong>SKD (Semi Knocked Down):</strong> Uma etapa intermediária, onde o carro chega com partes pré-montadas (como a carroceria já pintada). A fábrica local realiza apenas a montagem final e a integração de componentes. (Ex: Alguns modelos da Audi).</li>
                </ul>
            </div>
        ),
    },
]

export function AutomotiveAssemblyGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia da Linha de Montagem Automotiva</CardTitle>
          <CardDescription>
            Conheça os processos, etapas e tecnologias que transformam chapas de aço em veículos complexos e eficientes.
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
